import environment from '@/configs/environment';
import { Provider } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const client = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE,
  {
    auth: {
      persistSession: false,
    },
  },
);

export const SupabaseProvider: Provider<SupabaseClient> = {
  provide: 'SupabaseProvider',
  useValue: client,
};

export type SupabaseProvider = SupabaseClient;
