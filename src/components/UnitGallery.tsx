'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type UnitGalleryProps = {
  images: { id: string; url: string; alt: string }[];
};

const columns = 4;
const maxRows = 4;
const rowHeight = 192;
const rowGap = 16;

// Signed URLs with tokens don't work well with Next.js Image optimization
const isSignedUrl = (url: string) => url.includes('token=');

export default function UnitGallery({ images }: UnitGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedImageIndex(index);
  const closeModal = () => setSelectedImageIndex(null);
  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };
  const prevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
  };

  const maxHeight = useMemo(() => {
    return maxRows * rowHeight + (maxRows - 1) * rowGap;
  }, []);

  if (images.length === 0) return null;

  const hasOverflow = images.length > columns * maxRows;

  return (
    <div className="relative">
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-[max-height] duration-300 ease-in-out"
        style={expanded || !hasOverflow ? undefined : { maxHeight, overflow: 'hidden' }}
      >
        {images.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openModal(index)}
            className="group relative h-48 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              unoptimized={isSignedUrl(photo.url)}
            />
          </button>
        ))}
      </div>

      {!expanded && hasOverflow && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center">
          <div className="h-24 w-full bg-gradient-to-t from-white via-white/80 to-transparent" />
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="pointer-events-auto absolute bottom-4 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md"
          >
            Expand gallery
          </button>
        </div>
      )}

      {expanded && hasOverflow && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm"
          >
            Collapse gallery
          </button>
        </div>
      )}

      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeModal}>
          <div className="relative w-full max-w-6xl max-h-full" onClick={(event) => event.stopPropagation()}>
            <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
              <span className="rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {selectedImageIndex + 1} of {images.length}
              </span>
              <button
                type="button"
                className="rounded-full border-2 border-white bg-black/60 px-3 py-1 text-xl font-bold text-white"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-white bg-black/50 p-4 text-2xl text-white"
                  onClick={prevImage}
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-white bg-black/50 p-4 text-2xl text-white"
                  onClick={nextImage}
                >
                  ▶
                </button>
              </>
            )}

            <div className="relative">
              <Image
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-full rounded-lg object-contain"
                unoptimized={isSignedUrl(images[selectedImageIndex].url)}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 ${
                      index === selectedImageIndex ? 'border-white' : 'border-transparent opacity-60'
                    }`}
                  >
                    <Image src={image.url} alt={image.alt} fill sizes="80px" className="object-cover" unoptimized={isSignedUrl(image.url)} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
