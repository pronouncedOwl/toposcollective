import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../lib/admin-auth';
import { errorResponse, notFoundResponse, successResponse } from '../../../../../../lib/api-response';
import { deleteProjectPhoto } from '../../../../../../lib/projects-service';
import { removeAsset } from '../../../../../../lib/storage';
import { supabaseAdmin } from '../../../../../../lib/supabase';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; photoId: string }> },
) {
  const params = await context.params;
  const auth = ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('project_photos')
      .select('id, storage_path')
      .eq('id', params.photoId)
      .eq('project_id', params.id)
      .single();

    if (fetchError || !photo) {
      return notFoundResponse('Photo not found');
    }

    try {
      await removeAsset(photo.storage_path);
    } catch (storageError) {
      console.warn('[projects/:id/photos/:photoId][DELETE] Failed to remove storage asset:', storageError);
    }

    const { error } = await deleteProjectPhoto(params.photoId);

    if (error) {
      console.error('[projects/:id/photos/:photoId][DELETE] Failed to delete metadata:', error);
      return errorResponse('Failed to delete photo metadata', error.message);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('[projects/:id/photos/:photoId][DELETE] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
