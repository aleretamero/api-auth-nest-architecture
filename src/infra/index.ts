import { Type } from '@nestjs/common';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { MailModule } from '@/infra/mail/mail.module';
import { MongoModule } from '@/infra/database/mongo/mongo-module';
import { HashModule } from '@/infra/hash/hash.module';
import { QueueModule } from '@/infra/queue/queue.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { I18nModule } from '@/infra/i18n/i18n.module';
import { RateLimitingModule } from '@/infra/rate-limiting/rate-limiting.module';
import { ServeStaticModule } from '@/infra/server-static/server-static.module';
import { LogErrorModule } from '@/infra/logging/log-error/log-error.module';
import { SupabaseModule } from '@/infra/storage/supabase/supabase.module';
import { LocalStorageModule } from '@/infra/storage/local-storage/local-storage.module';
import { TwoFactorAuthModule } from '@/infra/two-factor-auth/two-factor-auth.module';

export default [
  TypeormModule,
  MongoModule,
  CacheModule,
  SupabaseModule,
  LocalStorageModule,
  MailModule,
  QueueModule,
  LogErrorModule,
  JwtModule,
  HashModule,
  I18nModule,
  RateLimitingModule,
  ServeStaticModule,
  TwoFactorAuthModule,
] as Type[];
