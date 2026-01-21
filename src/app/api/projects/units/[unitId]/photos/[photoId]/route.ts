import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, notFoundResponse, successResponse } from '../../../../../../../lib/api-response';
import { deleteUnitPhoto } from '../../../../../../../lib/projects-service';
import { removeAsset } from '../../../../../../../lib/storage';
import { supabaseAdmin } from '../../../../../../../lib/supabase-admin';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ unitId: string; photoId: string }> },
) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const role = body?.role;

    if (role !== undefined && role !== 'main' && role !== 'gallery') {
      return badRequestResponse('role must be main or gallery');
    }

    if (role === undefined) {
      return badRequestResponse('role is required');
    }

    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('unit_photos')
      .select('id, unit_id')
      .eq('id', params.photoId)
      .eq('unit_id', params.unitId)
      .single();

    if (fetchError || !photo) {
      return notFoundResponse('Photo not found');
    }

    if (role === 'main') {
      const { error: clearError } = await supabaseAdmin
        .from('unit_photos')
        .update({ role: 'gallery' })
        .eq('unit_id', params.unitId)
        .neq('id', params.photoId);

      if (clearError) {
        console.error('[units/:unitId/photos/:photoId][PUT] Failed to clear main:', clearError);
        return errorResponse('Failed to update main photo', clearError.message);
      }
    }

    const updatePayload: Record<string, unknown> = { role };

    const { data, error } = await supabaseAdmin
      .from('unit_photos')
      .update(updatePayload)
      .eq('id', params.photoId)
      .eq('unit_id', params.unitId)
      .select()
      .single();

    if (error) {
      console.error('[units/:unitId/photos/:photoId][PUT] Failed to update role:', error);
      return errorResponse('Failed to update photo role', error.message);
    }

    return successResponse({ photo: data });
  } catch (error) {
    console.error('[units/:unitId/photos/:photoId][PUT] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ unitId: string; photoId: string }> },
) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
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
