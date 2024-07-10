import { Module } from '@nestjs/common';
import { StorageProvider } from '@/infra/storage/storage.provider';

@Module({
  providers: [StorageProvider],
  exports: [],
})
export class StorageModule {}
