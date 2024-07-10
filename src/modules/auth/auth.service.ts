import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '@/infra/hash/hash.service';
import { AuthLoginDto } from '@/modules/auth/dtos/auth-login.dto';
import { TypeormService } from '@/infra/database/postgres/typeorm.service';
import { SessionService } from '@/modules/user/sub-modules/session/session.service';
import { SessionPresenter } from '@/modules/user/sub-modules/session/presenters/session.presenter';
import { User } from '@/modules/user/entities/user.entity';
import { AuthRegisterDto } from '@/modules/auth/dtos/auth-register.dto';
import { UserCodeService } from '@/modules/user/sub-modules/user-code/user-code.service';
import { AuthWelcomeQueue } from '@/modules/auth/queues/auth-welcome.queue';
import { UserCodeType } from '@/modules/user/sub-modules/user-code/enums/user-code-type.enum';
import { AuthConfirmEmailDto } from '@/modules/auth/dtos/auth-confirm-email.dto';
import { AuthConfirmForgotPasswordDto } from '@/modules/auth/dtos/auth-confirm-forgot-password.dto';
import { AuthForgotPasswordQueue } from '@/modules/auth/queues/auth-forgot-password.queue';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { AuthResetPasswordDto } from '@/modules/auth/dtos/auth-reset-password.dto';
import { AuthNewConfirmEmailCodeQueue } from '@/modules/auth/queues/auth-new-confirm-email-code.queue';

@Injectable()
export class AuthService {
  constructor(
    private readonly typeormService: TypeormService,
    private readonly hashService: HashService,
    private readonly sessionService: SessionService,
    private readonly userCodeService: UserCodeService,
    private readonly authWelcomeQueue: AuthWelcomeQueue,
    private readonly authForgotPasswordQueue: AuthForgotPasswordQueue,
    private readonly authNewEmailConfirmationCodeQueue: AuthNewConfirmEmailCodeQueue,
    private readonly userPresenter: UserPresenter,
  ) {}

  async register(
    deviceIdentifier: string,
    authRegisterDto: AuthRegisterDto,
  ): Promise<SessionPresenter> {
    const userExists = await this.typeormService.user.existsBy({
      email: authRegisterDto.email,
    });

    if (userExists) {
      throw new BadRequestException('Email already registered.');
    }

    const passwordHash = await this.hashService.hash(authRegisterDto.password);

    const user = this.typeormService.user.create({
      email: authRegisterDto.email,
      passwordHash,
    });

    const code = await this.userCodeService.create(
      user,
      UserCodeType.EMAIL_VERIFICATION,
    );

    await this.authWelcomeQueue.add({ code, email: user.email });

    await this.typeormService.user.save(user);

    return await this.sessionService.create(user, deviceIdentifier);
  }

  async login(
    deviceIdentifier: string,
    authLoginDto: AuthLoginDto,
  ): Promise<SessionPresenter> {
    const user = await this.typeormService.user.findOne({
      where: { email: authLoginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isMatch = await this.hashService.compare(
      authLoginDto.password,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new BadRequestException('Email or password is incorrect');
    }

    return await this.sessionService.create(user, deviceIdentifier);
  }

  async logout(deviceIdentifier: string, user: User): Promise<void> {
    await this.sessionService.remove(user, deviceIdentifier);
  }

  async refresh(
    deviceIdentifier: string,
    user: User,
  ): Promise<SessionPresenter> {
    return await this.sessionService.create(user, deviceIdentifier);
  }

  async confirmEmail(authConfirmEmailDto: AuthConfirmEmailDto): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: {
        email: authConfirmEmailDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.userCodeService.confirm(
      user,
      UserCodeType.EMAIL_VERIFICATION,
      authConfirmEmailDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }

    await this.typeormService.user.update(user.id, {
      emailVerified: true,
    });
  }

  async newConfirmEmailCode(email: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = await this.userCodeService.create(
      user,
      UserCodeType.EMAIL_VERIFICATION,
    );

    await this.authNewEmailConfirmationCodeQueue.add({
      email: user.email,
      code,
    });
  }

  async resetPassword(
    deviceIdentifier: string,
    authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<SessionPresenter> {
    const user = await this.typeormService.user.findOne({
      where: { email: authResetPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.userCodeService.confirm(
      user,
      UserCodeType.FORGOT_PASSWORD,
      authResetPasswordDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }

    const passwordHash = await this.hashService.hash(
      authResetPasswordDto.password,
    );

    await this.typeormService.user.update(user.id, {
      passwordHash,
    });

    return await this.sessionService.create(user, deviceIdentifier);
  }

  async newForgotPasswordCode(email: string): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = await this.userCodeService.create(
      user,
      UserCodeType.FORGOT_PASSWORD,
    );

    await this.authForgotPasswordQueue.add({
      email: user.email,
      code,
    });
  }

  async verifyForgotPasswordCode(
    authConfirmForgotPasswordDto: AuthConfirmForgotPasswordDto,
  ): Promise<void> {
    const user = await this.typeormService.user.findOne({
      where: {
        email: authConfirmForgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.userCodeService.isValid(
      user,
      UserCodeType.FORGOT_PASSWORD,
      authConfirmForgotPasswordDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }
  }

  async me(user: User): Promise<UserPresenter> {
    return this.userPresenter.present(user);
  }
}
