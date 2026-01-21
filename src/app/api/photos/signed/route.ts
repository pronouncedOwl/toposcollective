import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, successResponse } from '../../../../lib/api-response';
import { getSignedUrl } from '../../../../lib/storage';

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const expiresParam = searchParams.get('expires');

    if (!path) {
      return badRequestResponse('path is required');
    }

    const expiresInSeconds = expiresParam ? Number(expiresParam) : undefined;
    const signedUrl = await getSignedUrl(path, Number.isFinite(expiresInSeconds) ? expiresInSeconds : undefined);

    if (!signedUrl) {
      return errorResponse('Failed to create signed URL');
    }

    return successResponse({ url: signedUrl });
  } catch (error) {
    console.error('[photos/signed][GET] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
