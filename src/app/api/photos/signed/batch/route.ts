import { NextRequest } from 'next/server';
import { ensureAdminRequest } from '../../../../../lib/admin-auth';
import { badRequestResponse, errorResponse, successResponse } from '../../../../../lib/api-response';
import { getPublicUrl, getSignedUrl } from '../../../../../lib/storage';

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const paths = Array.isArray(body?.paths) ? body.paths.filter((path: unknown) => typeof path === 'string') : [];
    const expiresParam = body?.expires;

    if (!paths.length) {
      return badRequestResponse('paths[] is required');
    }

    const expiresInSeconds = Number.isFinite(expiresParam) ? Number(expiresParam) : undefined;

    const entries = await Promise.all(
      paths.map(async (path: string) => {
        try {
          if (isAbsoluteUrl(path)) {
            return [path, path];
          }
          const signedUrl = await getSignedUrl(path, expiresInSeconds);
          const fallbackUrl = signedUrl || getPublicUrl(path);
          return fallbackUrl ? [path, fallbackUrl] : null;
        } catch (error) {
          console.warn('[photos/signed/batch] Failed to sign path', path, error);
          return null;
        }
      }),
    );

    const map: Record<string, string> = {};
    entries.forEach((entry) => {
      if (entry) {
        map[entry[0]] = entry[1];
      }
    });

    return successResponse({ urls: map });
  } catch (error) {
    console.error('[photos/signed/batch][POST] Handler error:', error);
    return errorResponse('Internal server error', error instanceof Error ? error.message : error);
  }
}
