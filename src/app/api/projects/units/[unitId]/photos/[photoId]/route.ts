import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../../lib/admin-auth';
import { errorResponse, notFoundResponse, successResponse } from '../../../../../../../lib/api-response';
import { deleteUnitPhoto } from '../../../../../../../lib/projects-service';
import { removeAsset } from '../../../../../../../lib/storage';
import { supabaseAdmin } from '../../../../../../../lib/supabase';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ unitId: string; photoId: string }> },
) {
  const params = await context.params;
  const auth = ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('unit_photos')
      .select('id, storage_path, unit_id')
      .eq('id', params.photoId)
      .eq('unit_id', params.unitId)
      .single();

    if (fetchError || !photo) {
      return notFoundResponse('Photo not found');
    }

    try {
      await removeAsset(photo.storage_path);
    } catch (storageError) {
      console.warn('[units/:unitId/photos/:photoId][DELETE] Failed to remove storage asset:', storageError);
    }

    const { error } = await deleteUnitPhoto(params.photoId);

    if (error) {
      console.error('[units/:unitId/photos/:photoId][DELETE] Failed to delete metadata:', error);
      return errorResponse('Failed to delete photo metadata', error.message);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('[units/:unitId/photos/:photoId][DELETE] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
