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
import { IsPublic } from '@/common/decorators/is-public.decorator';
import { AuthRefreshGuard } from '@/common/guards/auth-refresh.guard';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthResetPasswordDto } from '@/modules/auth/dtos/auth-reset-password.dto';
import { AuthConfirmEmailDto } from '@/modules/auth/dtos/auth-confirm-email.dto';
import { AuthLoginDto } from '@/modules/auth/dtos/auth-login.dto';
import { SessionDto } from '@/modules/user/sub-modules/session/dtos/session.dto';
import { UserDto } from '@/modules/user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async register(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthLoginDto,
  ): Promise<SessionDto> {
    return this.authService.register(deviceIdentifier, body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async login(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthLoginDto,
  ): Promise<SessionDto> {
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
  @IsPublic()
  @ApiDocs({
    isPublic: true,
    tags: 'auth',
    headers: [{ name: 'Refresh-Token' }],
    response: [400],
  })
  async refresh(
    @DeviceIdentifier() deviceIdentifier: string,
    @CurrentUser() user: User,
  ): Promise<SessionDto> {
    return this.authService.refresh(deviceIdentifier, user);
  }

  @Post('resend-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @IsPublic()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 404] })
  async resendConfirmation(
    @Body('email', ParseEmailPipe) email: string,
  ): Promise<void> {
    return this.authService.resendConfirmationAccount(email);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @IsPublic()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400] })
  async confirmEmail(@Body() body: AuthConfirmEmailDto): Promise<void> {
    return this.authService.confirmEmail(body);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @IsPublic()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 404] })
  async forgotPassword(
    @Body('email', ParseEmailPipe) email: string,
  ): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @IsPublic()
  @ApiDocs({ isPublic: true, tags: 'auth', response: [400, 404] })
  async resetPassword(
    @DeviceIdentifier() deviceIdentifier: string,
    @Body() body: AuthResetPasswordDto,
  ): Promise<SessionDto> {
    return this.authService.resetPassword(deviceIdentifier, body);
  }

  @Get('me')
  @ApiDocs({ tags: 'auth', response: [400, 401] })
  async me(@CurrentUser('id') userId: string): Promise<UserDto> {
    return await this.authService.me(userId);
  }
}
