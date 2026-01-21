import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Ignore if called in a context where cookies can't be set.
        }
      },
      remove: (name: string, options: CookieOptions) => {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        } catch {
          // Ignore if called in a context where cookies can't be set.
        }
      },
    },
  });
};

export const createSupabaseRequestClient = (request: NextRequest) =>
  createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => request.cookies.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        void name;
        void value;
        void options;
        // No-op: route handlers read cookies but don't need to mutate them here.
      },
      remove: (name: string, options: CookieOptions) => {
        void name;
        void options;
        // No-op: route handlers read cookies but don't need to mutate them here.
      },
    },
  });
