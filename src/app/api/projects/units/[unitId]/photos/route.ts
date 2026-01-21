import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../lib/admin-auth';
import { badRequestResponse, createdResponse, errorResponse } from '../../../../../../lib/api-response';
import { insertUnitPhoto } from '../../../../../../lib/projects-service';
import { createSignedUpload } from '../../../../../../lib/storage';
import { supabaseAdmin } from '../../../../../../lib/supabase-admin';

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
    const filename = body?.filename;
    const contentType = body?.contentType;
    const role = body?.role || 'gallery';

    if (!filename || !contentType) {
      return badRequestResponse('filename and contentType are required');
    }

    if (role !== 'gallery' && role !== 'main') {
      return badRequestResponse('role must be main or gallery');
    }

    const upload = await createSignedUpload('units', params.unitId, filename);

    let sortOrder = body?.sortOrder ?? null;
    if (sortOrder === null || sortOrder === undefined) {
      const { data: maxRow, error: maxError } = await supabaseAdmin
        .from('unit_photos')
        .select('sort_order')
        .eq('unit_id', params.unitId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxError) {
        console.error('[units/:unitId/photos][POST] Failed to fetch max sort order:', maxError);
        return errorResponse('Failed to determine photo sort order', maxError.message);
      }

      sortOrder = (maxRow?.sort_order ?? -1) + 1;
    }

    const { data, error } = await insertUnitPhoto(params.unitId, {
      storage_path: upload.objectPath,
      role,
      alt_text: body?.altText || null,
      caption: body?.caption || null,
      sort_order: sortOrder,
      metadata: body?.metadata || null,
    });

    if (error) {
      console.error('[units/:unitId/photos][POST] Failed to insert unit photo:', error);
      return errorResponse('Failed to create photo record', error.message);
    }

    return createdResponse({ upload, photo: data });
  } catch (error) {
    console.error('[units/:unitId/photos][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
