import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, successResponse } from '../../../../../lib/api-response';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const order = body?.order;

    if (!Array.isArray(order) || order.some((entry) => typeof entry !== 'string')) {
      return badRequestResponse('order must be an array of photo ids');
    }

    if (order.length === 0) {
      return successResponse({ reordered: true });
    }

    const unique = new Set(order);
    if (unique.size !== order.length) {
      return badRequestResponse('order must not include duplicate ids');
    }

    const { data: photos, error: fetchError } = await supabaseAdmin
      .from('gallery_photos')
      .select('id')
      .in('id', order);

    if (fetchError) {
      console.error('[gallery/photos/reorder][POST] Failed to load photos:', fetchError);
      return errorResponse('Failed to validate photo order', fetchError.message);
    }

    if ((photos || []).length !== order.length) {
      return badRequestResponse('order contains unknown ids');
    }

    const updates = await Promise.all(
      order.map((photoId: string, index: number) =>
        supabaseAdmin.from('gallery_photos').update({ sort_order: index }).eq('id', photoId),
      ),
    );

    const failed = updates.find((result) => result.error);
    if (failed?.error) {
      console.error('[gallery/photos/reorder][POST] Failed to update order:', failed.error);
      return errorResponse('Failed to update photo order', failed.error.message);
    }

    return successResponse({ reordered: true });
  } catch (error) {
    console.error('[gallery/photos/reorder][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
