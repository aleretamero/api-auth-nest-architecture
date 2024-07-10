import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { HashModule } from '@/infra/hash/hash.module';
import { SessionModule } from '@/modules/user/sub-modules/session/session.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { UserCodeModule } from '@/modules/user/sub-modules/user-code/user-code.module';
import { AuthWelcomeQueue } from '@/modules/auth/queues/auth-welcome.queue';
import { QueueModule } from '@/infra/queue/queue.module';
import { AuthWelcomeJob } from '@/modules/auth/jobs/auth-welcome.job';
import { AuthForgotPasswordQueue } from '@/modules/auth/queues/auth-forgot-password.queue';
import { AuthForgotPasswordJob } from '@/modules/auth/jobs/auth-forgot-password.job';
import { AuthNewConfirmEmailCodeQueue } from '@/modules/auth/queues/auth-new-confirm-email-code.queue';
import { AuthNewConfirmEmailCodeJob } from '@/modules/auth/jobs/auth-new-confirm-email-code.job';
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
    AuthWelcomeQueue,
    AuthWelcomeJob,
    AuthForgotPasswordQueue,
    AuthForgotPasswordJob,
    AuthNewConfirmEmailCodeQueue,
    AuthNewConfirmEmailCodeJob,
  ],
})
export class AuthModule {}
