import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { HashModule } from '@/infra/hash/hash.module';
import { SessionModule } from '@/modules/session/session.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthLoginUsecase } from '@/modules/auth/usecases/auth-login.usecase';
import { AuthRegisterUsecase } from '@/modules/auth/usecases/auth-register.usecase';
import { AuthConfirmEmailUsecase } from '@/modules/auth/usecases/auth-confirm-email.usecase';
import { AuthConfirmForgotPasswordUsecase } from '@/modules/auth/usecases/auth-confirm-forgot-password.usecase';
import { AuthLogoutUsecase } from '@/modules/auth/usecases/auth-logout.usecase';
import { AuthNewConfirmEmailCodeUsecase } from '@/modules/auth/usecases/auth-new-confirm-email-code.usecase';
import { AuthNewForgotPasswordCodeUsecase } from '@/modules/auth/usecases/auth-new-forgot-password-code.usecase';
import { AuthRefreshUsecase } from '@/modules/auth/usecases/auth-refresh.usecase';
import { AuthResetPasswordUsecase } from '@/modules/auth/usecases/auth-reset-password.usecase';
import { UserCodeModule } from '@/modules/user-code/user-code.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { AuthMeUsecase } from '@/modules/auth/usecases/auth-me.usecase';

@Module({
  imports: [HashModule, JwtModule, UserModule, UserCodeModule, SessionModule],
  controllers: [AuthController],
  providers: [
    AuthConfirmEmailUsecase,
    AuthConfirmForgotPasswordUsecase,
    AuthLoginUsecase,
    AuthLogoutUsecase,
    AuthMeUsecase,
    AuthNewConfirmEmailCodeUsecase,
    AuthNewForgotPasswordCodeUsecase,
    AuthRefreshUsecase,
    AuthRegisterUsecase,
    AuthResetPasswordUsecase,
  ],
})
export class AuthModule {}
