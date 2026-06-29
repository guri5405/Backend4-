import { createClient, SupabaseClient } from '@supabase/supabase-js';
import appConfig from '@config/config';

export const supabaseAuthClient: SupabaseClient = createClient(
    appConfig.supabaseUrl,
    appConfig.supabaseAnonKey
);

export const supabaseAdminClient: SupabaseClient = createClient(
    appConfig.supabaseUrl,
    appConfig.supabaseServiceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);
