import { Type } from '@nestjs/common';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { MailModule } from '@/infra/mail/mail.module';
import { MongoModule } from '@/infra/database/mongo/mongo-module';
import { HashModule } from '@/infra/hash/hash.module';
import { QueueModule } from '@/infra/queue/queue.module';
import { JwtModule } from '@/infra/jwt/jwt.module';

export default [
  TypeormModule,
  MongoModule,
  MailModule,
  QueueModule,
  JwtModule,
  HashModule,
] as Type<any>[];
