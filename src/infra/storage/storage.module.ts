import { Module } from '@nestjs/common';
import { StorageProvider } from '@/infra/storage/storage.provider';
import { StorageService } from '@/infra/storage/storage.service';

@Module({
  providers: [
    StorageProvider,
    {
      provide: StorageService,
      useFactory: (provider: StorageProvider) => new StorageService(provider),
      inject: ['StorageProvider'],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
