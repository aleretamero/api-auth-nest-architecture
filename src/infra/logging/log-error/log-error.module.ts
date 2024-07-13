import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogErrorController } from '@/infra/logging/log-error/log-error.controller';
import { LogErrorInterceptor } from '@/infra/logging/log-error/log-error.interceptor';
import { LogErrorService } from '@/infra/logging/log-error/log-error.service';
import { MongoModule } from '@/infra/database/mongo/mongo-module';

@Module({
  imports: [MongoModule],
  controllers: [LogErrorController],
  providers: [
    LogErrorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LogErrorInterceptor,
    },
  ],
})
export class LogErrorModule {}
