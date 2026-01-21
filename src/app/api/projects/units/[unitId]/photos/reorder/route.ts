import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, successResponse } from '../../../../../../../lib/api-response';
import { supabaseAdmin } from '../../../../../../../lib/supabase-admin';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ unitId: string }> },
) {
  const params = await context.params;
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

    const { data: unitPhotos, error: fetchError } = await supabaseAdmin
      .from('unit_photos')
      .select('id')
      .eq('unit_id', params.unitId)
      .in('id', order);

    if (fetchError) {
      console.error('[units/:unitId/photos/reorder][POST] Failed to load photos:', fetchError);
      return errorResponse('Failed to validate photo order', fetchError.message);
    }

    if ((unitPhotos || []).length !== order.length) {
      return badRequestResponse('One or more photos do not belong to this unit');
    }

    const results = await Promise.all(
      order.map((photoId, index) =>
        supabaseAdmin
          .from('unit_photos')
          .update({ sort_order: index })
          .eq('id', photoId)
          .eq('unit_id', params.unitId),
      ),
    );

    const updateError = results.find((result) => result.error)?.error;
    if (updateError) {
      console.error('[units/:unitId/photos/reorder][POST] Failed to update order:', updateError);
      return errorResponse('Failed to update photo order', updateError.message);
    }

    return successResponse({ reordered: true });
  } catch (error) {
    console.error('[units/:unitId/photos/reorder][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
