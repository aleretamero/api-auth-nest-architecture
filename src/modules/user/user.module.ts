import { Module } from '@nestjs/common';
import { UserCodeModule } from '@/modules/user/sub-modules/user-code/user-code.module';
import { SessionModule } from '@/modules/user/sub-modules/session/session.module';
import { UserController } from '@/modules/user/user.controller';
import { CreateUserJob } from '@/modules/user/jobs/create-user.job';
import { HashModule } from '@/infra/hash/hash.module';
import { QueueModule } from '@/infra/queue/queue.module';
import { UserService } from '@/modules/user/user.service';
import { MailModule } from '@/infra/mail/mail.module';
import { SaveUserAvatarJob } from '@/modules/user/jobs/save-user-avatar.job';
import { SupabaseModule } from '@/infra/storage/supabase/supabase.module';
import { LocalStorageModule } from '@/infra/storage/local-storage/local-storage.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { RemoveUserAvatarJob } from '@/modules/user/jobs/remove-user-avatar.job';

@Module({
  imports: [
    HashModule,
    QueueModule,
    MailModule,
    SupabaseModule,
    LocalStorageModule,
    SessionModule,
    UserCodeModule,
    CacheModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserJob,
    SaveUserAvatarJob,
    RemoveUserAvatarJob,
  ],
})
export class UserModule {}
