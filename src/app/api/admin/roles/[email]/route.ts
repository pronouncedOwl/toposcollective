import { NextRequest } from 'next/server';
import { badRequestResponse, errorResponse, successResponse } from '../../../../../lib/api-response';
import { ensureAdminRole } from '../../../../../lib/admin-auth';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';

const isValidRole = (role: string) => role === 'admin' || role === 'employee';

const decodeEmail = (raw: string) => {
  try {
    return decodeURIComponent(raw).toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const auth = await ensureAdminRole(request, 'admin');
  if (!auth.authorized) {
    return auth.response;
  }

  const { email: rawEmail } = await params;
  const email = decodeEmail(rawEmail);
  if (!email) {
    return badRequestResponse('Email is required');
  }

  try {
    const body = await request.json();
    const role = String(body?.role || '').trim();

    if (!isValidRole(role)) {
      return badRequestResponse('Valid role is required');
    }

    const { data, error } = await supabaseAdmin
      .from('roles')
      .update({ role })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('[roles][PATCH] Failed to update role:', error);
      return errorResponse('Failed to update role', error.message);
    }

    return successResponse({ role: data });
  } catch (error) {
    console.error('[roles][PATCH] Handler error:', error);
    return errorResponse('Failed to update role', error instanceof Error ? error.message : error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const auth = await ensureAdminRole(request, 'admin');
  if (!auth.authorized) {
    return auth.response;
  }

  const { email: rawEmail } = await params;
  const email = decodeEmail(rawEmail);
  if (!email) {
    return badRequestResponse('Email is required');
  }

  const { error } = await supabaseAdmin.from('roles').delete().eq('email', email);
  if (error) {
    console.error('[roles][DELETE] Failed to delete role:', error);
    return errorResponse('Failed to delete role', error.message);
  }

  return successResponse({ deleted: true });
}
