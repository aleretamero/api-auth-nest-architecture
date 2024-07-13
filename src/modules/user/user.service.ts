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
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';
import { QUEUE, QueueService } from '@/infra/queue/queue.service';

@Injectable()
export class UserService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
    private readonly localStorageService: LocalStorageService,
    private readonly cacheService: CacheService,
    private readonly userCodeService: UserCodeService,
    private readonly queueService: QueueService,
  ) {}

  async create(
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

    const user = this.typeormService.user.create({
      email: createUserDto.email,
      passwordHash,
      avatarPath: fileName,
      avatarUrl: fileName && this.localStorageService.getUrl(fileName),
    });

    if (fileName) {
      await this.queueService.saveUserAvatar.add(QUEUE.SAVE_USER_AVATAR, {
        user,
      });
    }

    await this.queueService.createUser.add({
      userId: user.id,
      email: user.email,
      password,
    });

    await this.typeormService.user.save(user);

    return new UserDto(user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.cacheService.execute(
      CACHE_KEY.USERS,
      async () => await this.typeormService.user.find(),
      1000,
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
    if (!currentUser.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException();
    }

    let user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (user.roles.includes(Role.ADMIN) && currentUser.id !== user.id) {
      throw new BadRequestException(
        this.i18nService.t('user.cannot_delete_another_admin'),
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

    if (fileName && fileName !== user.avatarPath) {
      await this.queueService.saveUserAvatar.add({ user });

      user = this.typeormService.user.merge(user, {
        avatarPath: fileName,
        avatarUrl: fileName && this.localStorageService.getUrl(fileName),
      });
    }

    if (!user.emailVerified) {
      // const code = await this.userCodeService.create(
      //   user.id,
      //   UserCodeType.EMAIL_VERIFICATION,
      // );
      // await this.authNewEmailConfirmationCodeQueue.add({
      //   email: user.email,
      //   code,
      // });
    }

    user = await this.typeormService.user.save(user);

    return new UserDto(user);
  }

  async updateMe(
    currentUser: User,
    updateUserDto: UpdateUserDto,
    fileName: string | undefined,
  ): Promise<UserDto> {
    if (updateUserDto.email && currentUser.email !== updateUserDto.email) {
      const emailAlreadyExists = await this.typeormService.user.existsBy({
        id: Not(currentUser.id),
        email: updateUserDto.email,
      });

      if (emailAlreadyExists) {
        throw new BadRequestException(
          this.i18nService.t('user.email_already_exists'),
        );
      }

      currentUser = this.typeormService.user.merge(currentUser, {
        email: updateUserDto.email,
        emailVerified: false,
      });
    }

    if (fileName && fileName !== currentUser.avatarPath) {
      await this.queueService.saveUserAvatar.add({ user: currentUser });

      currentUser = this.typeormService.user.merge(currentUser, {
        avatarPath: fileName,
        avatarUrl: fileName && this.localStorageService.getUrl(fileName),
      });
    }

    if (!currentUser.emailVerified) {
      // const code = await this.userCodeService.create(
      //   currentUser.id,
      //   UserCodeType.EMAIL_VERIFICATION,
      // );
      // await this.authNewEmailConfirmationCodeQueue.add({
      //   email: currentUser.email,
      //   code,
      // });
    }

    currentUser = await this.typeormService.user.save(currentUser);

    return new UserDto(currentUser);
  }

  async delete(currentUser: User, id: string): Promise<void> {
    if (!currentUser.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException();
    }

    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (user.roles.includes(Role.ADMIN) && currentUser.id !== user.id) {
      throw new BadRequestException(
        this.i18nService.t('user.cannot_delete_another_admin'),
      );
    }

    if (user.avatarPath) {
      await this.queueService.removeUserAvatar.add({
        avatarPath: user.avatarPath,
      });
    }

    await this.typeormService.user.remove(user);
  }

  async deleteMe(currentUser: User): Promise<void> {
    if (currentUser.avatarPath) {
      await this.queueService.removeUserAvatar.add({
        avatarPath: currentUser.avatarPath,
      });
    }

    await this.typeormService.user.remove(currentUser);
  }
}
