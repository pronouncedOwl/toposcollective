import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../lib/admin-auth';
import {
  badRequestResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../../../../../lib/api-response';
import { removeAsset } from '../../../../../lib/storage';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';

const VALID_SIZES = new Set(['normal', 'tall', 'wide']);

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> },
) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const updatePayload: Record<string, unknown> = {};

    if (body?.altText !== undefined) {
      updatePayload.alt_text = body.altText || null;
    }

    if (body?.caption !== undefined) {
      updatePayload.caption = body.caption || null;
    }

    if (body?.size !== undefined) {
      if (!VALID_SIZES.has(body.size)) {
        return badRequestResponse('size must be normal, tall, or wide');
      }
      updatePayload.size = body.size;
    }

    if (Object.keys(updatePayload).length === 0) {
      return badRequestResponse('No fields to update');
    }

    const { data, error } = await supabaseAdmin
      .from('gallery_photos')
      .update(updatePayload)
      .eq('id', params.photoId)
      .select()
      .single();

    if (error || !data) {
      console.error('[gallery/photos/:photoId][PUT] Failed to update gallery photo:', error);
      return errorResponse('Failed to update gallery photo', error?.message);
    }

    return successResponse({ photo: data });
  } catch (error) {
    console.error('[gallery/photos/:photoId][PUT] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> },
) {
  const params = await context.params;
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('gallery_photos')
      .select('id, storage_path')
      .eq('id', params.photoId)
      .single();

    if (fetchError || !photo) {
      return notFoundResponse('Photo not found');
    }

    try {
      await removeAsset(photo.storage_path);
    } catch (storageError) {
      console.warn('[gallery/photos/:photoId][DELETE] Failed to remove storage asset:', storageError);
    }

    const { error } = await supabaseAdmin.from('gallery_photos').delete().eq('id', params.photoId);

    if (error) {
      console.error('[gallery/photos/:photoId][DELETE] Failed to delete metadata:', error);
      return errorResponse('Failed to delete photo metadata', error.message);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error('[gallery/photos/:photoId][DELETE] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
