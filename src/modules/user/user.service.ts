import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { Code } from '@/common/helpers/code';
import { CreateUserQueue } from '@/modules/user/queues/create-user.queue';
import { Not } from 'typeorm';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dtos/update-user.dto';
import { I18nService } from '@/infra/i18n/i18n.service';
import { File, StorageService } from '@/infra/storage/storage.service';
import { UserDto } from '@/modules/user/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly i18nService: I18nService,
    private readonly storageService: StorageService,
    private readonly createUserQueue: CreateUserQueue,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file: File | undefined,
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
      numbers: true,
      length: 12,
    });

    const passwordHash = await this.hashService.hash(password);

    let user = this.typeormService.user.create({
      email: createUserDto.email,
      passwordHash,
    });

    if (file) {
      const { path, publicUrl } = await this.storageService.uploadFile(
        user,
        file,
      );

      user = this.typeormService.user.merge(user, {
        avatarUrl: publicUrl,
        avatarPath: path,
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
    const users = await this.typeormService.user.find();

    return users.map((user) => new UserDto(user));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    return new UserDto(user);
  }

  async update(
    id: string,
    createUserDto: UpdateUserDto,
    file: File | undefined,
  ): Promise<UserDto> {
    let user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (createUserDto.email && user.email !== createUserDto.email) {
      const emailAlreadyExists = await this.typeormService.user.existsBy({
        id: Not(id),
        email: createUserDto.email,
      });

      if (emailAlreadyExists) {
        throw new BadRequestException(
          this.i18nService.t('user.email_already_exists'),
        );
      }

      user = this.typeormService.user.merge(user, {
        email: createUserDto.email,
        emailVerified: false,
      });
    }

    if (file && user.avatarPath) {
      await this.storageService.deleteFile(user, user.avatarPath);
    }

    if (file) {
      const { path, publicUrl } = await this.storageService.uploadFile(
        user,
        file,
      );

      user = this.typeormService.user.merge(user, {
        avatarUrl: publicUrl,
        avatarPath: path,
      });
    }

    user = await this.typeormService.user.save(user);

    if (!user.emailVerified) {
      // TODO - Generate a new code and call the queue
      // await this.userCodeService.create(user, UserCodeType.EMAIL_VERIFICATION);
    }

    return new UserDto(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (user.avatarPath) {
      await this.storageService.deleteFile(user, user.avatarPath);
    }

    await this.typeormService.user.remove(user);
  }
}
