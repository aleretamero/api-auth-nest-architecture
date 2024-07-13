import { Module } from '@nestjs/common';
import { LogErrorModule } from '@/infra/logging/log-error/log-error.module';

@Module({
  imports: [LogErrorModule],
})
export class LoggingModule {}
