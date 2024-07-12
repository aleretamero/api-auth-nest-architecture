import { Type } from '@nestjs/common';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { MailModule } from '@/infra/mail/mail.module';
import { MongoModule } from '@/infra/database/mongo/mongo-module';
import { HashModule } from '@/infra/hash/hash.module';
import { QueueModule } from '@/infra/queue/queue.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { I18nModule } from '@/infra/i18n/i18n.module';

export default [
  TypeormModule,
  MongoModule,
  CacheModule,
  MailModule,
  QueueModule,
  JwtModule,
  HashModule,
  I18nModule,
] as Type<any>[];
