import { randomUUID } from 'crypto';
import { supabaseAdmin } from './supabase-admin';

const DEFAULT_BUCKET = 'project-assets';
const bucket =
  process.env.PROJECT_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_PROJECT_BUCKET ||
  DEFAULT_BUCKET;

const sanitizeFilename = (filename: string) =>
  filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');

const publicBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}`
  : '';

export function buildAssetPath(scope: 'projects' | 'units' | 'gallery', entityId: string, filename: string) {
  const safeFilename = sanitizeFilename(filename);
  return `${scope}/${entityId}/${randomUUID()}-${safeFilename}`;
}

const encodePath = (path: string) =>
  path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

export function getPublicUrl(path: string) {
  if (!publicBaseUrl) return null;
  return `${publicBaseUrl}/${encodePath(path)}`;
}

export async function getSignedUrl(path: string, expiresInSeconds = 60 * 60) {
  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) {
    console.warn('[storage] Failed to create signed URL:', error?.message || 'Unknown error');
    return null;
  }
  return data.signedUrl;
}

export async function createSignedUpload(scope: 'projects' | 'units' | 'gallery', entityId: string, filename: string) {
  const objectPath = buildAssetPath(scope, entityId, filename);
  const bucketClient = supabaseAdmin.storage.from(bucket);

  const { data, error } = await bucketClient.createSignedUploadUrl(objectPath);

  if (error || !data) {
    throw new Error(error?.message || 'Unable to generate signed upload URL');
  }

  return {
    bucket,
    objectPath,
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl: getPublicUrl(objectPath),
  };
}

export async function removeAsset(objectPath: string) {
  const bucketClient = supabaseAdmin.storage.from(bucket);
  const { error } = await bucketClient.remove([objectPath]);
  if (error) {
    throw new Error(error.message);
  }
}

export { bucket as projectBucketName };

