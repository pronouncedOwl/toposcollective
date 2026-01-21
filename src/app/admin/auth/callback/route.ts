import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

const buildSupabaseClient = (request: NextRequest) => {
  const response = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => request.cookies.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        response.cookies.set({ name, value, ...options });
      },
      remove: (name: string, options: CookieOptions) => {
        response.cookies.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
  return { supabase, response };
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/admin/projects';

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login', url.origin));
  }

  const { supabase, response } = buildSupabaseClient(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[admin-auth-callback] Failed to exchange code:', error);
    return NextResponse.redirect(new URL('/admin/login', url.origin));
  }

  const redirect = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
