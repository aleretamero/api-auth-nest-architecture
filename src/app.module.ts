import { Module } from '@nestjs/common';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { HashModule } from '@/infra/hash/hash.module';
import { TypeormModule } from '@/infra/database/postgres/typeorm-module';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingErrorInterceptor } from '@/common/interceptors/log-error.interceptor';
import { MongoModule } from '@/infra/database/mongo/mongo-module';
import { SessionModule } from '@/modules/session/session.module';
import { AuthGuard } from '@/common/guards/auth.guard';

@Module({
  imports: [
    TypeormModule,
    MongoModule,
    JwtModule,
    HashModule,
    AuthModule,
    UserModule,
    SessionModule,
  ],
  providers: [
    // { provide: APP_GUARD, useClass: ThrottlerGuard }, // call ThrottlerGuard first so it runs before
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingErrorInterceptor },
  ],
})
export class AppModule {}
