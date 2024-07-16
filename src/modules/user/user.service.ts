import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { Code } from '@/common/helpers/code';
import { Not } from 'typeorm';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dtos/update-user.dto';
import { I18nService } from '@/infra/i18n/i18n.service';
import { UserDto } from '@/modules/user/dtos/user.dto';
import { LocalStorageService } from '@/infra/storage/local-storage/local-storage.service';
import { User } from '@/modules/user/entities/user.entity';
import { Role } from '@/modules/user/enums/role.enum';
import { CACHE_KEY, CacheService } from '@/infra/cache/cache.service';
import { QUEUE, QueueService } from '@/infra/queue/queue.service';
import { ClockUtil } from '@/common/helpers/clock-util';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly userCodeService: UserCodeService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
    private readonly localStorageService: LocalStorageService,
    private readonly cacheService: CacheService,
    private readonly queueService: QueueService,
  ) {}

  async create(
    currentUser: User,
    createUserDto: CreateUserDto,
    fileName: string | undefined,
  ): Promise<UserDto> {
    const userExists = await this.typeormService.user.existsBy({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new BadRequestException(
        this.i18nService.t('user.email_already_exists'),
      );
    }

    const password = Code.generate({
      hasLowercase: true,
      hasUppercase: true,
      hasSpecialCharacters: true,
      hasNumbers: true,
      length: 12,
    });

    const passwordHash = await this.hashService.hash(password);

    const roles: Role[] = [Role.USER];

    if (createUserDto.role === Role.ADMIN) {
      if (!currentUser.roles.includes(Role.SUPER_ADMIN)) {
        throw new ForbiddenException(
          this.i18nService.t('user.cannot_create_admin'),
        );
      }

      createUserDto.role === Role.ADMIN && roles.push(Role.ADMIN);
    }

    const user = this.typeormService.user.create({
      email: createUserDto.email,
      passwordHash,
      roles,
      avatarPath: fileName,
      avatarUrl: fileName && this.localStorageService.getUrl(fileName),
    });

    if (createUserDto.personalData) {
      user.personalData = this.typeormService.personalData.create({
        userId: user.id,
        ...createUserDto.personalData,
      });
    }

    if (fileName) {
      await this.queueService.saveUserAvatar.add(
        QUEUE.SAVE_USER_AVATAR,
        {
          user,
        },
        {
          delay: ClockUtil.getTimestampMilliseconds('5s'),
        },
      );
    }

    await this.queueService.sendConfirmationAccount.add(
      {
        userId: user.id,
        email: user.email,
        password,
      },
      {
        delay: ClockUtil.getTimestampMilliseconds('5s'),
      },
    );

    await this.typeormService.user.save(user);

    return new UserDto(user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.cacheService.execute(
      CACHE_KEY.USERS,
      async () =>
        await this.typeormService.user.find({
          relations: {
            personalData: true,
          },
        }),
      // 1000, // TODO - TTL does not work
    );

    return users.map((user) => new UserDto(user));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.typeormService.user.findOne({
      where: { id },
      relations: {
        personalData: true,
      },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    return new UserDto(user);
  }

  async update(
    currentUser: User,
    id: string,
    updateUserDto: UpdateUserDto,
    fileName: string | undefined,
  ): Promise<UserDto> {
    let user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (user.roles.includes(Role.SUPER_ADMIN)) {
      throw new ForbiddenException(
        this.i18nService.t('user.cannot_update_super_admin'),
      );
    }

    if (
      user.roles.includes(Role.ADMIN) &&
      (!currentUser.roles.includes(Role.SUPER_ADMIN) ||
        (!currentUser.roles.includes(Role.ADMIN) && currentUser.id !== user.id))
    ) {
      throw new ForbiddenException(
        this.i18nService.t('user.cannot_update_admin'),
      );
    }

    if (
      !currentUser.roles.includes(Role.SUPER_ADMIN) &&
      !currentUser.roles.includes(Role.ADMIN) &&
      currentUser.id !== user.id
    ) {
      throw new ForbiddenException(
        this.i18nService.t('user.cannot_update_user'),
      );
    }

    if (updateUserDto.email && user.email !== updateUserDto.email) {
      const emailAlreadyExists = await this.typeormService.user.existsBy({
        id: Not(id),
        email: updateUserDto.email,
      });

      if (emailAlreadyExists) {
        throw new BadRequestException(
          this.i18nService.t('user.email_already_exists'),
        );
      }

      user = this.typeormService.user.merge(user, {
        email: updateUserDto.email,
        emailVerified: false,
      });
    }

    if (updateUserDto.role) {
      const roles: Role[] = [Role.USER];

      if (updateUserDto.role === Role.ADMIN) {
        if (!currentUser.roles.includes(Role.SUPER_ADMIN)) {
          throw new ForbiddenException(
            this.i18nService.t('user.cannot_update_admin'),
          );
        }

        roles.push(Role.ADMIN);
      }

      user = this.typeormService.user.merge(user, {
        roles,
      });
    }

    if (fileName) {
      await this.queueService.saveUserAvatar.add(
        { user },
        {
          delay: ClockUtil.getTimestampMilliseconds('5s'),
        },
      );

      user = this.typeormService.user.merge(user, {
        avatarPath: fileName,
        avatarUrl: fileName && this.localStorageService.getUrl(fileName),
      });
    }

    if (updateUserDto.personalData) {
      user = this.typeormService.user.merge(user, {
        personalData: {
          userId: user.id,
          ...user.personalData,
          ...updateUserDto.personalData,
        },
      });
    }

    if (!user.emailVerified) {
      const code = await this.userCodeService.create(
        user.id,
        UserCodeType.EMAIL_CONFIRMATION,
      );

      await this.queueService.sendConfirmationAccount.add(
        {
          email: user.email,
          code,
        },
        {
          delay: ClockUtil.getTimestampMilliseconds('5s'),
        },
      );
    }

    user = await this.typeormService.user.save(user);

    return new UserDto(user);
  }

  async delete(currentUser: User, id: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (user.roles.includes(Role.SUPER_ADMIN)) {
      throw new ForbiddenException(
        this.i18nService.t('user.cannot_delete_super_admin'),
      );
    }

    if (
      user.roles.includes(Role.ADMIN) &&
      (!currentUser.roles.includes(Role.SUPER_ADMIN) ||
        (!currentUser.roles.includes(Role.ADMIN) && currentUser.id !== user.id))
    ) {
      throw new ForbiddenException(
        this.i18nService.t('user.cannot_delete_admin'),
      );
    }

    if (
      !currentUser.roles.includes(Role.SUPER_ADMIN) &&
      !currentUser.roles.includes(Role.ADMIN) &&
      currentUser.id !== user.id
    ) {
      throw new ForbiddenException(
        this.i18nService.t('user.cannot_delete_user'),
      );
    }

    if (user.avatarPath) {
      await this.queueService.removeUserAvatar.add({
        avatarPath: user.avatarPath,
      });
    }

    await this.typeormService.user.remove(user);
  }
}
