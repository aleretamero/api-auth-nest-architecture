import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { HashModule } from '@/infra/hash/hash.module';
import { SessionModule } from '@/modules/user/sub-modules/session/session.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { UserCodeModule } from '@/modules/user/sub-modules/user-code/user-code.module';
import { QueueModule } from '@/infra/queue/queue.module';
import { WelcomeJob } from '@/modules/auth/jobs/welcome.job';
import { ForgotPasswordJob } from '@/modules/auth/jobs/forgot-password.job';
import { ResendConfirmationAccountJob } from '@/modules/auth/jobs/resend-confirmation-account.job';
import { AuthService } from '@/modules/auth/auth.service';
import { MailModule } from '@/infra/mail/mail.module';

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
    AuthService,
    WelcomeJob,
    ForgotPasswordJob,
    ResendConfirmationAccountJob,
  ],
})
export class AuthModule {}
