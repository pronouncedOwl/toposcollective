'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryPhoto } from '@/lib/gallery-public';

type GalleryClientProps = {
  photos: GalleryPhoto[];
};

export default function GalleryClient({ photos }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? photos.length - 1 : selectedImage - 1);
    }
  };

  const getGridSpan = (size: GalleryPhoto['size']) => {
    switch (size) {
      case 'tall':
        return 'md:row-span-2';
      case 'wide':
        return 'md:col-span-2 lg:col-span-1';
      default:
        return '';
    }
  };

  const getHeight = (size: GalleryPhoto['size']) => {
    switch (size) {
      case 'tall':
        return 'h-96 md:h-full';
      case 'wide':
        return 'h-64 md:h-80';
      default:
        return 'h-64';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`bg-gray-200 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ${getGridSpan(
              photo.size,
            )}`}
            onClick={() => openModal(index)}
          >
            <div className={`relative w-full ${getHeight(photo.size)}`}>
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImage !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-full w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
              <span className="text-white text-sm bg-black bg-opacity-60 px-3 py-1 rounded-full">
                {selectedImage + 1} of {photos.length}
              </span>
              <button
                onClick={closeModal}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all text-2xl font-bold border-2 border-white"
              >
                ✕
              </button>
            </div>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-4 transition-all text-2xl font-bold border-2 border-white"
            >
              ◀
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-4 transition-all text-2xl font-bold border-2 border-white"
            >
              ▶
            </button>

            <div className="relative h-[80vh] w-full">
              <Image
                src={photos[selectedImage].url}
                alt={photos[selectedImage].alt}
                fill
                sizes="100vw"
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
