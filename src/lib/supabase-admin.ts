import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabaseAdmin = (() => {
  if (!supabaseServiceKey) {
    const message = 'SUPABASE_SERVICE_ROLE_KEY is not configured.';
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(`${message} Admin APIs require a service role key.`);
    }
    console.warn(`${message} Admin APIs will not work without it.`);
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
})();
