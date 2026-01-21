import { NextRequest } from 'next/server';
import { badRequestResponse, createdResponse, errorResponse, successResponse } from '../../../../lib/api-response';
import { ensureAdminRole } from '../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRole(request, 'admin');
  if (!auth.authorized) {
    return auth.response;
  }

  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[access-requests][GET] Failed to fetch requests:', error);
    return errorResponse('Failed to fetch access requests', error.message);
  }

  return successResponse({ requests: data ?? [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const name = String(body?.name || '').trim();
    const note = String(body?.note || '').trim();

    if (!email || !name) {
      return badRequestResponse('Name and email are required');
    }

    const { data, error } = await supabaseAdmin
      .from('access_requests')
      .insert({ email, name, note })
      .select()
      .single();

    if (error) {
      if ((error as { code?: string }).code === '23505') {
        return successResponse({ request: null, duplicate: true });
      }
      console.error('[access-requests][POST] Failed to create request:', error);
      return errorResponse('Failed to submit access request', error.message);
    }

    return createdResponse({ request: data });
  } catch (error) {
    console.error('[access-requests][POST] Handler error:', error);
    return errorResponse('Failed to submit access request', error instanceof Error ? error.message : error);
  }
}
