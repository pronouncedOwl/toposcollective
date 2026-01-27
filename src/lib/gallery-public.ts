import { getPublicUrl, getSignedUrl } from './storage';
import { supabase } from './supabase';

export type GalleryPhoto = {
  id: string;
  url: string;
  alt: string;
  size: 'normal' | 'tall' | 'wide';
};

const resolveImageUrl = async (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Prefer public URLs for gallery (they don't expire)
  // Fall back to signed URLs if bucket isn't public
  const publicUrl = getPublicUrl(path);
  if (publicUrl) return publicUrl;
  const signedUrl = await getSignedUrl(path);
  return signedUrl || null;
};

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('id, storage_path, alt_text, size, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[gallery-public] Failed to fetch gallery photos:', error);
    return [];
  }

  const resolved = await Promise.all(
    (data || []).map(async (photo) => {
      const url = await resolveImageUrl(photo.storage_path);
      if (!url) return null;
      return {
        id: photo.id,
        url,
        alt: photo.alt_text || 'Gallery photo',
        size: (photo.size as GalleryPhoto['size']) || 'normal',
      };
    }),
  );

  return resolved.filter(Boolean) as GalleryPhoto[];
}
