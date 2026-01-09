import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../lib/admin-auth';
import { badRequestResponse, createdResponse, errorResponse } from '../../../../../lib/api-response';
import { insertProjectPhoto } from '../../../../../lib/projects-service';
import { createSignedUpload } from '../../../../../lib/storage';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const auth = ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const filename = body?.filename;
    const contentType = body?.contentType;
    const role = body?.role || null;

    if (!filename || !contentType) {
      return badRequestResponse('filename and contentType are required');
    }

    const upload = await createSignedUpload('projects', params.id, filename);

    const { data, error } = await insertProjectPhoto(params.id, {
      storage_path: upload.objectPath,
      alt_text: body?.altText || null,
      caption: body?.caption || null,
      role,
      sort_order: body?.sortOrder ?? null,
      metadata: body?.metadata || null,
    });

    if (error) {
      console.error('[projects/:id/photos][POST] Failed to insert project photo:', error);
      return errorResponse('Failed to create photo record', error.message);
    }

    return createdResponse({ upload, photo: data });
  } catch (error) {
    console.error('[projects/:id/photos][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
