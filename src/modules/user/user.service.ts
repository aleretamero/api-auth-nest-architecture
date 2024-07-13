import {
  BadRequestException,
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
import { SupabaseService } from '@/infra/storage/supabase/supabase.service';
import { UserDto } from '@/modules/user/dtos/user.dto';
import { CreateUserQueue } from '@/modules/user/queues/create-user.queue';
import { SaveUserAvatarQueue } from '@/modules/user/queues/save-user-avatar.queue';
import { LocalStorageService } from '@/infra/storage/local-storage/local-storage.service';
import { User } from '@/modules/user/entities/user.entity';
import { Role } from './enums/role.enum';
import { CACHE_KEY, CacheService } from '@/infra/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
    private readonly storageService: SupabaseService,
    private readonly localStorageService: LocalStorageService,
    private readonly createUserQueue: CreateUserQueue,
    private readonly saveUserAvatarQueue: SaveUserAvatarQueue,
    private readonly cacheService: CacheService,
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
      await this.saveUserAvatarQueue.add({
        userId: user.id,
      });
    }

    await this.createUserQueue.add({
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
        avatarPath: fileName,
        avatarUrl: fileName && this.localStorageService.getUrl(fileName),
      });
    }

    user = this.typeormService.user.merge(user, {
      avatarPath: fileName,
      avatarUrl: fileName && this.localStorageService.getUrl(fileName),
    });

    // if (file && user.avatarPath) {
    //   await this.storageService.deleteFile(user, user.avatarPath);
    // }

    // if (file) {
    //   const { path, publicUrl } = await this.storageService.uploadFile(
    //     user,
    //     file,
    //   );

    //   user = this.typeormService.user.merge(user, {
    //     avatarUrl: publicUrl,
    //     avatarPath: path,
    //   });
    // }

    user = await this.typeormService.user.save(user);

    if (!user.emailVerified) {
      console.log('TODO - Generate a new code and call the queue');
      // TODO - Generate a new code and call the queue
      // await this.userCodeService.create(user, UserCodeType.EMAIL_VERIFICATION);
    }

    return new UserDto(user);
  }

  async delete(currentUser: User, id: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (
      user.roles.includes(Role.ADMIN) &&
      currentUser.roles.includes(Role.ADMIN) &&
      currentUser.id !== user.id
    ) {
      throw new BadRequestException(
        this.i18nService.t('user.cannot_delete_another_admin'),
      );
    }

    if (!user.roles.includes(Role.ADMIN) && currentUser.id !== user.id) {
      throw new BadRequestException(
        this.i18nService.t('user.cannot_delete_another_user'),
      );
    }

    if (user.avatarPath) {
      await this.storageService.deleteFile(user, user.avatarPath);
    }

    await this.typeormService.user.remove(user);
  }
}
