import { Module } from '@nestjs/common';
import { LocalStorageService } from '@/infra/storage/local-storage/local-storage.service';

@Module({
  providers: [LocalStorageService],
  exports: [LocalStorageService],
})
export class LocalStorageModule {}
