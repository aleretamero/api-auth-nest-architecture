import environment from '@/configs/environment';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Provider } from '@nestjs/common';

const client = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE,
  {
    auth: {
      persistSession: false,
    },
  },
);

export const StorageProvider: Provider<SupabaseClient> = {
  provide: 'StorageProvider',
  useValue: client,
};

export type StorageProvider = SupabaseClient;
