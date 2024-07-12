import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiDocs } from '@/common/swagger/api-config.swagger';
import { DeviceIdentifier } from '@/common/decorators/device-identifier.decorator';
import { ParseEmailPipe } from '@/common/pipes/parse-email.pipe';
import { User } from '@/modules/user/entities/user.entity';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { AuthRefreshGuard } from '@/common/guards/auth-refresh.guard';
import { SessionPresenter } from '@/modules/user/sub-modules/session/presenters/session.presenter';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthConfirmForgotPasswordDto } from '@/modules/auth/dtos/auth-confirm-forgot-password.dto';
import { AuthResetPasswordDto } from '@/modules/auth/dtos/auth-reset-password.dto';
import { AuthConfirmEmailDto } from '@/modules/auth/dtos/auth-confirm-email.dto';
import { AuthLoginDto } from '@/modules/auth/dtos/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async register(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthLoginDto,
  ): Promise<SessionPresenter> {
    return this.authService.register(deviceIdentifier, body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async login(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthLoginDto,
  ): Promise<SessionPresenter> {
    return this.authService.login(deviceIdentifier, body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocs({ tags: 'auth', response: [400, 401] })
  async logout(
    @DeviceIdentifier() deviceIdentifier: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.authService.logout(deviceIdentifier, user);
  }

  @UseGuards(AuthRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 401] }) // TODO: update guard to return 400
  async refresh(
    @DeviceIdentifier() deviceIdentifier: string,
    @CurrentUser() user: User,
  ): Promise<SessionPresenter> {
    return this.authService.refresh(deviceIdentifier, user);
  }

  @Post('email/new-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 404] })
  async newEmailCode(
    @Body('email', ParseEmailPipe) email: string,
  ): Promise<void> {
    return this.authService.newConfirmEmailCode(email);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async confirmEmail(@Body() body: AuthConfirmEmailDto): Promise<void> {
    return this.authService.confirmEmail(body);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 404] })
  async forgotPassword(
    @Body('email', ParseEmailPipe) email: string,
  ): Promise<void> {
    return this.authService.newForgotPasswordCode(email);
  }

  @Post('forgot-password/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async confirmForgotPassword(
    @Body() body: AuthConfirmForgotPasswordDto,
  ): Promise<void> {
    return this.authService.verifyForgotPasswordCode(body);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 404] })
  async resetPassword(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthResetPasswordDto,
  ): Promise<SessionPresenter> {
    return this.authService.resetPassword(deviceIdentifier, body);
  }

  @Get('me')
  @ApiDocs({ tags: 'auth', response: [400, 401] })
  async me(@CurrentUser() user: User): Promise<UserPresenter> {
    return await this.authService.me(user);
  }
}
