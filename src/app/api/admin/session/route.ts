import { NextRequest } from 'next/server';
import { successResponse } from '../../../../lib/api-response';
import { createSupabaseRequestClient } from '../../../../lib/supabase-server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export async function GET(request: NextRequest) {
  // Localhost bypass: auto-login as andrew showell
  const isLocalhost = process.env.NODE_ENV === 'development' || 
                      request.headers.get('host')?.includes('localhost') ||
                      process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost');
  
  if (isLocalhost) {
    return successResponse({
      user: { email: 'andrew.showell@toposcollective.com' },
      role: 'admin',
    });
  }

  const supabase = createSupabaseRequestClient(request);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) {
    return successResponse({ user: null, role: null });
  }

  const { data: roleRow } = await supabaseAdmin
    .from('roles')
    .select('role')
    .eq('email', data.user.email)
    .maybeSingle();

  return successResponse({
    user: { email: data.user.email },
    role: roleRow?.role ?? null,
  });
}
