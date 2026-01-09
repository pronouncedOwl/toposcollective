import { randomUUID } from 'crypto';
import { supabaseAdmin } from './supabase';

const DEFAULT_BUCKET = 'project-assets';
const bucket = process.env.PROJECT_STORAGE_BUCKET || DEFAULT_BUCKET;

const sanitizeFilename = (filename: string) =>
  filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');

const publicBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}`
  : '';

export function buildAssetPath(scope: 'projects' | 'units', entityId: string, filename: string) {
  const safeFilename = sanitizeFilename(filename);
  return `${scope}/${entityId}/${randomUUID()}-${safeFilename}`;
}

export function getPublicUrl(path: string) {
  if (!publicBaseUrl) return null;
  return `${publicBaseUrl}/${path}`;
}

export async function createSignedUpload(scope: 'projects' | 'units', entityId: string, filename: string) {
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

