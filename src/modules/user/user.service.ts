import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { Code } from '@/common/helpers/code';
import { CreateUserQueue } from '@/modules/user/queues/create-user.queue';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { Not } from 'typeorm';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly userCodeService: UserCodeService,
    private readonly createUserQueue: CreateUserQueue,
    private readonly userPresenter: UserPresenter,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserPresenter> {
    const userExists = await this.typeormService.user.existsBy({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new BadRequestException('Email already registered.');
    }

    const password = Code.generate({
      hasLowercase: true,
      hasUppercase: true,
      hasSpecialCharacters: true,
      numbers: true,
      length: 12,
    });

    const passwordHash = await this.hashService.hash(password);

    const user = this.typeormService.user.create({
      email: createUserDto.email,
      passwordHash,
    });

    const code = await this.userCodeService.create(
      user,
      UserCodeType.EMAIL_VERIFICATION,
    );

    await this.createUserQueue.add({ code, email: user.email, password });

    await this.typeormService.user.save(user);

    return this.userPresenter.present(user);
  }

  async findAll(): Promise<UserPresenter[]> {
    const users = await this.typeormService.user.find();

    return this.userPresenter.present(users);
  }

  async findOne(id: string): Promise<UserPresenter> {
    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.userPresenter.present(user);
  }

  async update(
    id: string,
    createUserDto: UpdateUserDto,
  ): Promise<UserPresenter> {
    let user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (createUserDto.email && user.email !== createUserDto.email) {
      const emailAlreadyExists = await this.typeormService.user.existsBy({
        id: Not(id),
        email: createUserDto.email,
      });

      if (emailAlreadyExists) {
        throw new BadRequestException('Email already registered.');
      }

      user.email = createUserDto.email;
      user.emailVerified = false;
    }

    user = await this.typeormService.user.save(user);

    if (!user.emailVerified) {
      // TODO - Generate a new code and call the queue
      // await this.userCodeService.create(user, UserCodeType.EMAIL_VERIFICATION);
    }

    return this.userPresenter.present(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.typeormService.user.remove(user);
  }
}
