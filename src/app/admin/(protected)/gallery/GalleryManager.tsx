'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { supabaseBrowser } from '../../../../lib/supabase-browser';

type ApiGalleryPhoto = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  caption: string | null;
  size: 'normal' | 'tall' | 'wide';
  sort_order: number | null;
  metadata?: Record<string, unknown> | null;
};

type GalleryOrder = string[];

const sizeOptions: ApiGalleryPhoto['size'][] = ['normal', 'tall', 'wide'];

const sortGalleryPhotos = (photos: ApiGalleryPhoto[]) =>
  [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

const orderGalleryPhotos = (photos: ApiGalleryPhoto[], order?: string[]) => {
  const sorted = sortGalleryPhotos(photos);
  if (!order?.length) return sorted;
  const byId = new Map(sorted.map((photo) => [photo.id, photo]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as ApiGalleryPhoto[];
  const orderedSet = new Set(order);
  const remaining = sorted.filter((photo) => !orderedSet.has(photo.id));
  return [...ordered, ...remaining];
};

const GalleryPhotoUploader = ({
  onUploaded,
  onError,
}: {
  onUploaded: () => void;
  onError?: (message: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setUploading(true);

    try {
      for (const file of Array.from(event.target.files)) {
        const response = await fetch('/api/gallery/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            size: 'normal',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to reserve upload slot');
        }

        const payload = await response.json();
        const upload = payload?.data?.upload;

        if (!upload) {
          throw new Error('Upload response malformed');
        }

        const uploadResult = await supabaseBrowser.storage
          .from(upload.bucket)
          .uploadToSignedUrl(upload.objectPath, upload.token, file);

        if (uploadResult.error) {
          throw uploadResult.error;
        }
      }

      event.target.value = '';
      onUploaded();
    } catch (error) {
      console.error('Gallery photo upload failed', error);
      onError?.('Gallery photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white">
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      {uploading ? 'Uploading…' : 'Upload photos'}
    </label>
  );
};

const SortableGalleryPhotoCard = ({
  photo,
  photoUrl,
  captionDraft,
  onCaptionChange,
  onSaveCaption,
  onSizeChange,
  onDelete,
}: {
  photo: ApiGalleryPhoto;
  photoUrl: string;
  captionDraft: string;
  onCaptionChange: (value: string) => void;
  onSaveCaption: () => void;
  onSizeChange: (value: ApiGalleryPhoto['size']) => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${isDragging ? 'opacity-70' : ''}`}
    >
      <div className="relative">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photo.caption || 'Gallery photo'}
            width={240}
            height={160}
            className="h-36 w-full object-contain bg-slate-100"
          />
        ) : (
          <div className="flex h-36 items-center justify-center bg-slate-100 text-[10px] text-slate-500">
            Loading preview…
          </div>
        )}
        <div className="absolute left-2 top-2 flex items-center gap-2">
          <button
            type="button"
            className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-rose-600 shadow-sm opacity-0 transition group-hover:opacity-100"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
        <div className="absolute right-2 top-2">
          <button
            type="button"
            className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm opacity-0 transition group-hover:opacity-100"
            {...attributes}
            {...listeners}
          >
            Drag
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="relative">
            <button
              type="button"
              className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={() => setIsSizeMenuOpen((prev) => !prev)}
            >
              size-{photo.size === 'normal' ? 'n' : photo.size === 'wide' ? 'w' : 's'}
            </button>
            {isSizeMenuOpen && (
              <div className="absolute left-0 mt-2 w-28 overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-lg">
                {sizeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`block w-full px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50 ${
                      photo.size === option ? 'bg-slate-100 font-semibold' : ''
                    }`}
                    onClick={() => {
                      onSizeChange(option);
                      setIsSizeMenuOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Caption</p>
        <div className="mt-2 flex items-center gap-2">
          <input
            className="w-full rounded border border-slate-200 px-2 py-2 text-xs text-slate-700"
            value={captionDraft}
            onChange={(event) => onCaptionChange(event.target.value)}
            placeholder="Add a caption"
          />
          <button
            type="button"
            className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-slate-800"
            onClick={onSaveCaption}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function GalleryManager() {
  const [photos, setPhotos] = useState<ApiGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<GalleryOrder>([]);
  const [drafts, setDrafts] = useState<Record<string, { caption: string }>>({});
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/gallery/photos', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to load gallery photos');
      }
      const payload = await response.json();
      const list = (payload?.data?.photos || []) as ApiGalleryPhoto[];
      setPhotos(list);
    } catch (error) {
      console.error('Failed to load gallery photos', error);
      setFeedback({ type: 'error', message: 'Could not load gallery photos' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos, refreshToken]);

  useEffect(() => {
    setOrder((prev) => {
      const sorted = sortGalleryPhotos(photos).map((photo) => photo.id);
      return prev.length ? prev : sorted;
    });
  }, [photos]);

  useEffect(() => {
    const paths = new Set<string>();
    photos.forEach((photo) => photo.storage_path && paths.add(photo.storage_path));
    const missing = Array.from(paths).filter((path) => !signedUrls[path]);
    if (missing.length === 0) return;

    let cancelled = false;
    const loadSignedUrls = async () => {
      try {
        const response = await fetch('/api/photos/signed/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ paths: missing }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch signed URLs');
        }

        const payload = await response.json();
        const urls = payload?.data?.urls;
        if (cancelled || !urls || typeof urls !== 'object') return;
        setSignedUrls((prev) => ({ ...prev, ...urls }));
      } catch (error) {
        console.warn('Failed to fetch signed URLs', error);
      }
    };

    void loadSignedUrls();
    return () => {
      cancelled = true;
    };
  }, [photos, signedUrls]);

  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      photos.forEach((photo) => {
        if (!next[photo.id]) {
          next[photo.id] = {
            caption: photo.caption || '',
          };
        }
      });
      return next;
    });
  }, [photos]);

  const orderedPhotos = useMemo(() => orderGalleryPhotos(photos, order), [photos, order]);

  const handleUploadError = (message: string) => {
    setFeedback({ type: 'error', message });
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this gallery photo? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/gallery/photos/${photoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete gallery photo');
      }
      setOrder((prev) => prev.filter((id) => id !== photoId));
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to delete gallery photo', error);
      setFeedback({ type: 'error', message: 'Could not delete gallery photo' });
    }
  };

  const handleReorder = async (nextOrder: string[]) => {
    try {
      const response = await fetch('/api/gallery/photos/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ order: nextOrder }),
      });
      if (!response.ok) {
        throw new Error('Failed to reorder gallery photos');
      }
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to reorder gallery photos', error);
      setFeedback({ type: 'error', message: 'Could not reorder gallery photos' });
      setRefreshToken((token) => token + 1);
    }
  };

  const handlePhotoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const orderedIds = orderedPhotos.map((photo) => photo.id);
    const oldIndex = orderedIds.indexOf(activeId);
    const newIndex = orderedIds.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0) return;
    const nextOrder = arrayMove(orderedIds, oldIndex, newIndex);
    setOrder(nextOrder);
    void handleReorder(nextOrder);
  };

  const handleUpdatePhoto = async (
    photoId: string,
    payload: { altText?: string | null; caption?: string | null; size?: ApiGalleryPhoto['size'] },
  ) => {
    try {
      const response = await fetch(`/api/gallery/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to update gallery photo');
      }
      setRefreshToken((token) => token + 1);
    } catch (error) {
      console.error('Failed to update gallery photo', error);
      setFeedback({ type: 'error', message: 'Could not update gallery photo' });
    }
  };

  const buildAltTextFromCaption = (caption: string) => {
    const trimmed = caption.trim();
    if (!trimmed) return null;
    return trimmed.replace(/\s+/g, '');
  };

  const handleSaveCaption = (photoId: string) => {
    const draft = drafts[photoId];
    if (!draft) return;
    const caption = draft.caption.trim();
    const altText = buildAltTextFromCaption(caption);
    void handleUpdatePhoto(photoId, { caption: caption || null, altText });
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Gallery</p>
            <h2 className="text-2xl font-semibold text-slate-900">Portfolio Gallery</h2>
            <p className="text-sm text-slate-500">Upload, reorder, and describe gallery images.</p>
          </div>
          <GalleryPhotoUploader
            onUploaded={() => setRefreshToken((token) => token + 1)}
            onError={handleUploadError}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Images</p>
            <p className="text-sm text-slate-500">Drag to reorder. Update size to control grid layout.</p>
          </div>
          {feedback && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {feedback.message}
            </span>
          )}
        </div>

        {loading && <p className="mt-4 text-sm text-slate-500">Loading gallery photos…</p>}
        {!loading && orderedPhotos.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">No gallery images uploaded yet.</p>
        )}

        {orderedPhotos.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhotoDragEnd}>
            <SortableContext items={orderedPhotos.map((photo) => photo.id)} strategy={rectSortingStrategy}>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {orderedPhotos.map((photo) => {
                  const photoUrl = signedUrls[photo.storage_path] || '';
                  const draft = drafts[photo.id] || { caption: photo.caption || '' };
                  return (
                    <SortableGalleryPhotoCard
                      key={photo.id}
                      photo={photo}
                      photoUrl={photoUrl}
                      captionDraft={draft.caption}
                      onCaptionChange={(value) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [photo.id]: {
                            caption: value,
                          },
                        }))
                      }
                      onSaveCaption={() => handleSaveCaption(photo.id)}
                      onSizeChange={(value) => handleUpdatePhoto(photo.id, { size: value })}
                      onDelete={() => handleDeletePhoto(photo.id)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  );
}
