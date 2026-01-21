import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, notFoundResponse, successResponse } from '../../../../../../lib/api-response';
import { deleteProjectPhoto } from '../../../../../../lib/projects-service';
import { removeAsset } from '../../../../../../lib/storage';
import { supabaseAdmin } from '../../../../../../lib/supabase-admin';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; photoId: string }> },
) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const role = body?.role;

    if (role !== undefined && role !== 'hero' && role !== 'gallery') {
      return badRequestResponse('role must be hero or gallery');
    }

    if (role === undefined) {
      return badRequestResponse('role is required');
    }

    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('project_photos')
      .select('id, project_id')
      .eq('id', params.photoId)
      .eq('project_id', params.id)
      .single();

    if (fetchError || !photo) {
      return notFoundResponse('Photo not found');
    }

    const { data, error } = await supabaseAdmin
      .from('project_photos')
      .update({ role })
      .eq('id', params.photoId)
      .eq('project_id', params.id)
      .select()
      .single();

    if (error) {
      console.error('[projects/:id/photos/:photoId][PUT] Failed to update role:', error);
      return errorResponse('Failed to update photo role', error.message);
    }

    return successResponse({ photo: data });
  } catch (error) {
    console.error('[projects/:id/photos/:photoId][PUT] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; photoId: string }> },
) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('project_photos')
      .select('id, storage_path, project_id')
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
