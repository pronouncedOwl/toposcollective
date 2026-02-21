import { NextRequest } from 'next/server';
import { forbiddenResponse, unauthorizedResponse } from './api-response';
import { supabaseAdmin } from './supabase-admin';
import { createSupabaseRequestClient, createSupabaseServerClient } from './supabase-server';

export type AdminRole = 'admin' | 'employee';

export type AdminUser = {
  email: string;
  role: AdminRole;
};

const fetchRoleByEmail = async (email: string): Promise<AdminRole | null> => {
  const { data, error } = await supabaseAdmin
    .from('roles')
    .select('role')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('[admin-auth] Failed to fetch role:', error);
    return null;
  }

  return (data?.role as AdminRole | undefined) ?? null;
};

export async function getAdminUser(): Promise<AdminUser | null> {
  // Localhost bypass: auto-login as andrew showell
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost')) {
    return { email: 'andrew.showell@toposcollective.com', role: 'admin' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) {
    return null;
  }

  const role = await fetchRoleByEmail(data.user.email);
  if (!role) return null;

  return { email: data.user.email, role };
}

export async function ensureAdminRequest(req: NextRequest) {
  // Localhost bypass: auto-login as andrew showell
  const isLocalhost = process.env.NODE_ENV === 'development' || 
                      req.headers.get('host')?.includes('localhost') ||
                      process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');
  
  if (isLocalhost) {
    return { authorized: true as const, role: 'admin' as AdminRole, email: 'andrew.showell@toposcollective.com' };
  }

  const supabase = createSupabaseRequestClient(req);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) {
    return { authorized: false as const, response: unauthorizedResponse('Not authenticated') };
  }

  const role = await fetchRoleByEmail(data.user.email);
  if (!role) {
    return { authorized: false as const, response: unauthorizedResponse('Access not approved') };
  }

  return { authorized: true as const, role, email: data.user.email };
}

export async function ensureAdminRole(req: NextRequest, requiredRole: AdminRole) {
  const auth = await ensureAdminRequest(req);
  if (!auth.authorized) {
    return auth;
  }

  if (auth.role !== requiredRole) {
    return { authorized: false as const, response: forbiddenResponse('Insufficient role') };
  }

  return auth;
}

