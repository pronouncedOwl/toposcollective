import { NextRequest } from 'next/server';
import { badRequestResponse, createdResponse, errorResponse, successResponse } from '../../../../lib/api-response';
import { ensureAdminRole } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

const isValidRole = (role: string) => role === 'admin' || role === 'employee';

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRole(request, 'admin');
  if (!auth.authorized) {
    return auth.response;
  }

  const { data, error } = await supabaseAdmin.from('roles').select('*').order('email');
  if (error) {
    console.error('[roles][GET] Failed to fetch roles:', error);
    return errorResponse('Failed to fetch roles', error.message);
  }

  return successResponse({ roles: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRole(request, 'admin');
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const role = String(body?.role || '').trim();

    if (!email || !isValidRole(role)) {
      return badRequestResponse('Valid email and role are required');
    }

    const { data, error } = await supabaseAdmin
      .from('roles')
      .upsert({ email, role, created_by: auth.email }, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('[roles][POST] Failed to upsert role:', error);
      return errorResponse('Failed to save role', error.message);
    }

    return createdResponse({ role: data });
  } catch (error) {
    console.error('[roles][POST] Handler error:', error);
    return errorResponse('Failed to save role', error instanceof Error ? error.message : error);
  }
}
