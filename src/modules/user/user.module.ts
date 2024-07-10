import { Module } from '@nestjs/common';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { UserCodeModule } from '@/modules/user/sub-modules/user-code/user-code.module';
import { SessionModule } from '@/modules/user/sub-modules/session/session.module';
import { UserController } from '@/modules/user/user.controller';
import { CreateUserQueue } from '@/modules/user/queues/create-user.queue';
import { CreateUserJob } from '@/modules/user/jobs/create-user.job';
import { HashModule } from '@/infra/hash/hash.module';
import { QueueModule } from '@/infra/queue/queue.module';
import { PersonalDataModule } from '@/modules/user/sub-modules/personal-data/personal-data.module';
import { UserService } from '@/modules/user/user.service';
import { MailModule } from '@/infra/mail/mail.module';

@Module({
  imports: [
    HashModule,
    QueueModule,
    MailModule,
    SessionModule,
    UserCodeModule,
    PersonalDataModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserPresenter, CreateUserQueue, CreateUserJob],
  exports: [UserPresenter],
})
export class UserModule {}
