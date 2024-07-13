import { Module } from '@nestjs/common';
import { SupabaseProvider } from '@/infra/storage/supabase/supabase.provider';
import { SupabaseService } from '@/infra/storage/supabase/supabase.service';

@Module({
  providers: [
    SupabaseProvider,
    {
      provide: SupabaseService,
      useFactory: (provider: SupabaseProvider) => new SupabaseService(provider),
      inject: ['SupabaseProvider'],
    },
  ],
  exports: [SupabaseService],
})
export class SupabaseModule {}
