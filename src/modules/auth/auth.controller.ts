import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginUsecase } from '@/modules/auth/usecases/auth-login.usecase';
import { AuthLoginDto } from '@/modules/auth/dtos/auth-login.dto';
import { AuthRegisterUsecase } from '@/modules/auth/usecases/auth-register.usecase';
import { DeviceIdentifier } from '@/common/decorators/device-identifier.decorator';
import { AuthConfirmEmailDto } from '@/modules/auth/dtos/auth-confirm-email.dto';
import { AuthConfirmEmailUsecase } from '@/modules/auth/usecases/auth-confirm-email.usecase';
import { AuthConfirmForgotPasswordUsecase } from '@/modules/auth/usecases/auth-confirm-forgot-password.usecase';
import { AuthResetPasswordUsecase } from '@/modules/auth/usecases/auth-reset-password.usecase';
import { AuthResetPasswordDto } from '@/modules/auth/dtos/auth-reset-password.dto';
import { AuthNewConfirmEmailCodeUsecase } from '@/modules/auth/usecases/auth-new-confirm-email-code.usecase';
import { ParseEmailPipe } from '@/common/pipes/parse-email.pipe';
import { AuthNewForgotPasswordCodeUsecase } from '@/modules/auth/usecases/auth-new-forgot-password-code.usecase';
import { AuthConfirmForgotPasswordDto } from '@/modules/auth/dtos/auth-confirm-forgot-password.dto';
import { AuthLogoutUsecase } from '@/modules/auth/usecases/auth-logout.usecase';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AuthRefreshUsecase } from '@/modules/auth/usecases/auth-refresh.usecase';
import { User } from '@/modules/user/entities/user.entity';
import { Public } from '@/common/decorators/public.decorator';
import { AuthRefreshGuard } from '@/common/guards/auth-refresh.guard';
import { SessionPresenter } from '@/modules/session/presenters/session.presenter';
import { AuthMeUsecase } from '@/modules/auth/usecases/auth-me.usecase';
import { UserPresenter } from '../user/presenters/user.presenter';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authRegisterUsecase: AuthRegisterUsecase,
    private readonly authLoginUsecase: AuthLoginUsecase,
    private readonly authLogoutUsecase: AuthLogoutUsecase,
    private readonly authRefreshUsecase: AuthRefreshUsecase,
    private readonly authNewConfirmEmailCodeUsecase: AuthNewConfirmEmailCodeUsecase,
    private readonly authConfirmEmailUsecase: AuthConfirmEmailUsecase,
    private readonly authNewForgotPasswordCodeUsecase: AuthNewForgotPasswordCodeUsecase,
    private readonly authConfirmForgotPasswordUsecase: AuthConfirmForgotPasswordUsecase,
    private readonly authResetPasswordUsecase: AuthResetPasswordUsecase,
    private readonly authMeUsecase: AuthMeUsecase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async register(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthLoginDto,
  ): Promise<SessionPresenter> {
    return this.authRegisterUsecase.execute(deviceIdentifier, body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthLoginDto,
  ): Promise<SessionPresenter> {
    return this.authLoginUsecase.execute(deviceIdentifier, body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @DeviceIdentifier() deviceIdentifier: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.authLogoutUsecase.execute(deviceIdentifier, user);
  }

  @UseGuards(AuthRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  async refresh(
    @DeviceIdentifier() deviceIdentifier: string,
    @CurrentUser() user: User,
  ): Promise<SessionPresenter> {
    return this.authRefreshUsecase.execute(deviceIdentifier, user);
  }

  @Post('email/new-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async newEmailCode(
    @Body('email', ParseEmailPipe) email: string,
  ): Promise<void> {
    return this.authNewConfirmEmailCodeUsecase.execute(email);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async confirmEmail(@Body() body: AuthConfirmEmailDto): Promise<void> {
    return this.authConfirmEmailUsecase.execute(body);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async forgotPassword(
    @Body('email', ParseEmailPipe) email: string,
  ): Promise<void> {
    return this.authNewForgotPasswordCodeUsecase.execute(email);
  }

  @Post('forgot-password/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async confirmForgotPassword(
    @Body() body: AuthConfirmForgotPasswordDto,
  ): Promise<void> {
    return this.authConfirmForgotPasswordUsecase.execute(body);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async resetPassword(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthResetPasswordDto,
  ): Promise<SessionPresenter> {
    return this.authResetPasswordUsecase.execute(deviceIdentifier, body);
  }

  @Get('me')
  async me(@CurrentUser() user: User): Promise<UserPresenter> {
    return await this.authMeUsecase.execute(user);
  }
}
