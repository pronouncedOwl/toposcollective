import { NextRequest } from 'next/server';
import { badRequestResponse, errorResponse, successResponse } from '../../../../../lib/api-response';
import { ensureAdminRole } from '../../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await ensureAdminRole(request, 'admin');
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  if (!id) {
    return badRequestResponse('Request id is required');
  }

  const { error } = await supabaseAdmin.from('access_requests').delete().eq('id', id);
  if (error) {
    console.error('[access-requests][DELETE] Failed to delete request:', error);
    return errorResponse('Failed to delete request', error.message);
  }

  return successResponse({ deleted: true });
}
