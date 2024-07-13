import { Module } from '@nestjs/common';
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
import { StorageModule } from '@/infra/storage/storage.module';
import { SaveUserAvatarQueue } from '@/modules/user/queues/save-user-avatar.queue';
import { SaveUserAvatarJob } from '@/modules/user/jobs/save-user-avatar.job';

@Module({
  imports: [
    HashModule,
    QueueModule,
    MailModule,
    StorageModule,
    SessionModule,
    UserCodeModule,
    PersonalDataModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserQueue,
    SaveUserAvatarQueue,
    CreateUserJob,
    SaveUserAvatarJob,
  ],
})
export class UserModule {}
