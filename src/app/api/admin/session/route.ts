import { NextRequest } from 'next/server';
import { successResponse } from '../../../../lib/api-response';
import { createSupabaseRequestClient } from '../../../../lib/supabase-server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export async function GET(request: NextRequest) {
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
