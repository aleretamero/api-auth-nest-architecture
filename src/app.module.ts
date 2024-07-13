import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingErrorInterceptor } from '@/common/interceptors/log-error.interceptor';
import { AuthGuard } from '@/common/guards/auth.guard';

import ModulesModules from '@/modules';
import InfraModules from '@/infra';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [...InfraModules, ...ModulesModules],
  providers: [
    // { provide: APP_GUARD, useClass: ThrottlerGuard }, // call ThrottlerGuard first so it runs before
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingErrorInterceptor },
  ],
})
export class AppModule {}
