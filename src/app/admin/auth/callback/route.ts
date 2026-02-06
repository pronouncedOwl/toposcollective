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
  const errorParam = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  console.log('[admin-auth-callback] ===== CALLBACK ROUTE HIT =====');
  console.log('[admin-auth-callback] Request details:', {
    pathname: url.pathname,
    code: code ? `${code.substring(0, 20)}...` : 'missing',
    next,
    errorParam,
    errorDescription,
    fullUrl: url.toString(),
    allSearchParams: Object.fromEntries(url.searchParams.entries()),
    headers: {
      referer: request.headers.get('referer'),
      'user-agent': request.headers.get('user-agent'),
    },
  });

  if (errorParam) {
    console.error('[admin-auth-callback] OAuth error received:', {
      error: errorParam,
      description: errorDescription,
    });
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(errorParam)}`, url.origin));
  }

  if (!code) {
    console.error('[admin-auth-callback] No code parameter found - redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', url.origin));
  }

  console.log('[admin-auth-callback] Exchanging code for session...');
  const { supabase, response } = buildSupabaseClient(request);
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[admin-auth-callback] Failed to exchange code:', {
      error: error.message,
      errorDetails: error,
      status: error.status,
    });
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, url.origin));
  }

  console.log('[admin-auth-callback] ===== AUTH SUCCESSFUL =====');
  console.log('[admin-auth-callback] Session data:', {
    user: data?.user?.email,
    sessionExists: !!data?.session,
  });
  console.log('[admin-auth-callback] Redirecting to:', next);

  const redirect = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
