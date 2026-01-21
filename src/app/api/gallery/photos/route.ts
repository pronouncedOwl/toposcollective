import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../lib/admin-auth';
import {
  badRequestResponse,
  createdResponse,
  errorResponse,
  successResponse,
} from '../../../../lib/api-response';
import { createSignedUpload } from '../../../../lib/storage';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

const VALID_SIZES = new Set(['normal', 'tall', 'wide']);

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_photos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[gallery/photos][GET] Failed to fetch gallery photos:', error);
      return errorResponse('Failed to fetch gallery photos', error.message);
    }

    return successResponse({ photos: data ?? [] });
  } catch (error) {
    console.error('[gallery/photos][GET] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const filename = body?.filename;
    const contentType = body?.contentType;

    if (!filename || !contentType) {
      return badRequestResponse('filename and contentType are required');
    }

    const size = body?.size ?? 'normal';
    if (!VALID_SIZES.has(size)) {
      return badRequestResponse('size must be normal, tall, or wide');
    }

    const upload = await createSignedUpload('gallery', 'portfolio', filename);

    let sortOrder = body?.sortOrder ?? null;
    if (sortOrder === null || sortOrder === undefined) {
      const { data: maxRow, error: maxError } = await supabaseAdmin
        .from('gallery_photos')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxError) {
        console.error('[gallery/photos][POST] Failed to fetch max sort order:', maxError);
        return errorResponse('Failed to determine photo sort order', maxError.message);
      }

      sortOrder = (maxRow?.sort_order ?? -1) + 1;
    }

    const { data: photo, error } = await supabaseAdmin
      .from('gallery_photos')
      .insert([
        {
          storage_path: upload.objectPath,
          alt_text: body?.altText || null,
          caption: body?.caption || null,
          size,
          sort_order: sortOrder,
          metadata: body?.metadata || null,
        },
      ])
      .select()
      .single();

    if (error || !photo) {
      console.error('[gallery/photos][POST] Failed to insert gallery photo:', error);
      return errorResponse('Failed to create gallery photo', error?.message);
    }

    return createdResponse({ photo, upload });
  } catch (error) {
    console.error('[gallery/photos][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
