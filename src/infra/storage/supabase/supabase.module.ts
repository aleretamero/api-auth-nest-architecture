import { Module } from '@nestjs/common';
import { SupabaseProvider } from '@/infra/storage/supabase/supabase.provider';
import { SupabaseService } from '@/infra/storage/supabase/supabase.service';
import { LocalStorageModule } from '@/infra/storage/local-storage/local-storage.module';
import { LocalStorageService } from '@/infra/storage/local-storage/local-storage.service';

@Module({
  imports: [LocalStorageModule],
  providers: [
    SupabaseProvider,
    {
      provide: SupabaseService,
      useFactory: (
        provider: SupabaseProvider,
        localStorageService: LocalStorageService,
      ) => new SupabaseService(provider, localStorageService),
      inject: ['SupabaseProvider', LocalStorageService],
    },
  ],
  exports: [SupabaseService],
})
export class SupabaseModule {}
