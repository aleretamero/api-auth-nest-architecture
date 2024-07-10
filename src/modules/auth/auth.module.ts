import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { HashModule } from '@/infra/hash/hash.module';
import { SessionModule } from '@/modules/user/sub-modules/session/session.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthLoginUsecase } from '@/modules/auth/usecases/auth-login.usecase';
import { AuthRegisterUsecase } from '@/modules/auth/usecases/auth-register.usecase';
import { AuthConfirmEmailUsecase } from '@/modules/auth/usecases/auth-confirm-email.usecase';
import { AuthConfirmForgotPasswordUsecase } from '@/modules/auth/usecases/auth-confirm-forgot-password.usecase';
import { AuthLogoutUsecase } from '@/modules/auth/usecases/auth-logout.usecase';
import { AuthNewConfirmEmailCodeCodeUsecase } from '@/modules/auth/usecases/auth-new-confirm-email-code.usecase';
import { AuthNewForgotPasswordCodeUsecase } from '@/modules/auth/usecases/auth-new-forgot-password-code.usecase';
import { AuthRefreshUsecase } from '@/modules/auth/usecases/auth-refresh.usecase';
import { AuthResetPasswordUsecase } from '@/modules/auth/usecases/auth-reset-password.usecase';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { AuthMeUsecase } from '@/modules/auth/usecases/auth-me.usecase';
import { MailModule } from '@/infra/mail/mail.module';
import { UserCodeModule } from '@/modules/user/sub-modules/user-code/user-code.module';
import { AuthWelcomeQueue } from '@/modules/auth/queues/auth-welcome.queue';
import { QueueModule } from '@/infra/queue/queue.module';
import { AuthWelcomeJob } from '@/modules/auth/jobs/auth-welcome.job';
import { AuthForgotPasswordQueue } from '@/modules/auth/queues/auth-forgot-password.queue';
import { AuthForgotPasswordJob } from '@/modules/auth/jobs/auth-forgot-password.job';
import { AuthNewConfirmEmailCodeQueue } from '@/modules/auth/queues/auth-new-confirm-email-code.queue';
import { AuthNewConfirmEmailCodeJob } from '@/modules/auth/jobs/auth-new-confirm-email-code.job';

@Module({
  imports: [
    MailModule,
    QueueModule,
    HashModule,
    JwtModule,
    UserModule,
    UserCodeModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthConfirmEmailUsecase,
    AuthConfirmForgotPasswordUsecase,
    AuthLoginUsecase,
    AuthLogoutUsecase,
    AuthMeUsecase,
    AuthNewConfirmEmailCodeCodeUsecase,
    AuthNewForgotPasswordCodeUsecase,
    AuthRefreshUsecase,
    AuthRegisterUsecase,
    AuthResetPasswordUsecase,
    AuthWelcomeQueue,
    AuthWelcomeJob,
    AuthForgotPasswordQueue,
    AuthForgotPasswordJob,
    AuthNewConfirmEmailCodeQueue,
    AuthNewConfirmEmailCodeJob,
  ],
})
export class AuthModule {}
