'use client';

import { useState } from 'react';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const images = [
    {
      src: '/images/about-story.jpg',
      alt: 'Pedernales Project',
      size: 'normal'
    },
    {
      src: '/images/richmond-project.jpg',
      alt: 'Richmond Bathroom',
      size: 'tall'
    },
    {
      src: '/images/project-image.jpg',
      alt: 'Modern Kitchen',
      size: 'wide'
    },
    {
      src: '/images/gallery-1.jpg',
      alt: 'East 10th Street Project',
      size: 'tall'
    },
    {
      src: '/images/gallery-2.jpg',
      alt: 'DFD Project 28',
      size: 'normal'
    },
    {
      src: '/images/gallery-3.jpg',
      alt: 'DFD Project 5',
      size: 'wide'
    },
    {
      src: '/images/gallery-4.jpg',
      alt: 'DFD Project 18',
      size: 'tall'
    },
    {
      src: '/images/gallery-5.jpg',
      alt: 'DFD Project 6',
      size: 'normal'
    },
    {
      src: '/images/gallery-7.jpg',
      alt: 'Mansel Project 9',
      size: 'tall'
    },
    {
      src: '/images/gallery-8.jpg',
      alt: 'Mansel Project 36',
      size: 'wide'
    },
    {
      src: '/images/gallery-9.jpg',
      alt: 'Mansel Project 12',
      size: 'normal'
    },
    {
      src: '/images/gallery-10.jpg',
      alt: 'Mansel Project 15',
      size: 'tall'
    },
    {
      src: '/images/gallery-11.jpg',
      alt: 'Mansel Project 7',
      size: 'wide'
    },
    {
      src: '/images/gallery-12.jpg',
      alt: 'Garland Avenue Project 19',
      size: 'normal'
    },
    {
      src: '/images/gallery-13.jpg',
      alt: 'Garland Avenue Project 30',
      size: 'tall'
    },
    {
      src: '/images/gallery-14.jpg',
      alt: 'Garland Avenue Project 34',
      size: 'wide'
    },
    {
      src: '/images/gallery-15.jpg',
      alt: 'Garland Avenue Project 7',
      size: 'normal'
    },
    {
      src: '/images/gallery-17.jpg',
      alt: 'Glissman Project 31',
      size: 'tall'
    },
    {
      src: '/images/gallery-18.jpg',
      alt: 'DFD Project 33',
      size: 'wide'
    },
    {
      src: '/images/gallery-19.jpg',
      alt: 'DFD Project 2',
      size: 'normal'
    },
    {
      src: '/images/gallery-20.jpg',
      alt: 'DFD Project 5',
      size: 'tall'
    },
    {
      src: '/images/gallery-21.jpg',
      alt: 'DFD Project 15',
      size: 'wide'
    },
    {
      src: '/images/gallery-22.jpg',
      alt: 'DFD Project 10',
      size: 'normal'
    },
    {
      src: '/images/gallery-23.jpg',
      alt: 'East 10th Street Project 9',
      size: 'tall'
    },
    {
      src: '/images/gallery-24.jpg',
      alt: 'East 10th Street Project 15',
      size: 'wide'
    },
    {
      src: '/images/gallery-25.jpg',
      alt: 'East 10th Street Project 17',
      size: 'normal'
    },
    {
      src: '/images/gallery-26.jpg',
      alt: 'East 10th Street Project 23',
      size: 'tall'
    },
    {
      src: '/images/gallery-27.jpg',
      alt: 'East 10th Street Project 7',
      size: 'wide'
    },
    {
      src: '/images/gallery-28.jpg',
      alt: 'East 10th Street Project 28',
      size: 'normal'
    },
    {
      src: '/images/gallery-29.jpg',
      alt: 'East 10th Street Project 27',
      size: 'tall'
    },
    {
      src: '/images/gallery-30.jpg',
      alt: 'East 10th Street Project 26',
      size: 'wide'
    },
    {
      src: '/images/gallery-31.jpg',
      alt: 'East 10th Street Project 13',
      size: 'normal'
    },
    {
      src: '/images/gallery-32.jpg',
      alt: 'East 10th Street Project 3',
      size: 'tall'
    },
    {
      src: '/images/gallery-33.jpg',
      alt: 'Mansel Project 1',
      size: 'wide'
    },
    {
      src: '/images/gallery-34.jpg',
      alt: 'Mansel Project 13',
      size: 'normal'
    },
    {
      src: '/images/gallery-35.jpg',
      alt: 'Mansel Project 14',
      size: 'tall'
    },
    {
      src: '/images/gallery-36.jpg',
      alt: 'East 10th Street Unit 2 Project 3',
      size: 'wide'
    },
    {
      src: '/images/gallery-37.jpg',
      alt: 'East 10th Street Unit 2 Project 10',
      size: 'normal'
    },
    {
      src: '/images/gallery-38.jpg',
      alt: 'East 10th Street Unit 2 Project 21',
      size: 'tall'
    },
    {
      src: '/images/gallery-39.jpg',
      alt: 'East 10th Street Unit 2 Project 32',
      size: 'wide'
    },
    {
      src: '/images/gallery-40.jpg',
      alt: 'East 10th Street Unit 2 Project 39',
      size: 'normal'
    },
    {
      src: '/images/gallery-41.jpg',
      alt: 'Richmond Project 1',
      size: 'tall'
    },
    {
      src: '/images/gallery-42.jpg',
      alt: 'Richmond Project 11',
      size: 'wide'
    },
    {
      src: '/images/gallery-43.jpg',
      alt: 'Richmond Project 18',
      size: 'normal'
    },
    {
      src: '/images/gallery-44.jpg',
      alt: 'Pedernales Project 19',
      size: 'tall'
    },
    {
      src: '/images/gallery-45.jpg',
      alt: 'DFD Project 2',
      size: 'wide'
    },
    {
      src: '/images/gallery-46.jpg',
      alt: 'East 10th Street Primary Project 10',
      size: 'normal'
    },
    {
      src: '/images/gallery-47.jpg',
      alt: 'East 10th Street Primary Project 22',
      size: 'tall'
    },
    {
      src: '/images/gallery-48.jpg',
      alt: 'East 10th Street Project 5',
      size: 'wide'
    },
    {
      src: '/images/gallery-49.jpg',
      alt: 'Richmond Project 19',
      size: 'normal'
    },
    {
      src: '/images/gallery-50.jpg',
      alt: 'Pedernales Project 2',
      size: 'tall'
    },
    {
      src: '/images/gallery-51.jpg',
      alt: 'Pedernales Project 22',
      size: 'wide'
    },
    {
      src: '/images/gallery-52.jpg',
      alt: 'Richmond Project 25',
      size: 'normal'
    },
    {
      src: '/images/gallery-53.jpg',
      alt: 'Richmond Project 3',
      size: 'tall'
    },
    {
      src: '/images/gallery-54.jpg',
      alt: 'Pedernales Project 32',
      size: 'wide'
    },
    {
      src: '/images/gallery-55.jpg',
      alt: 'Pedernales Project 4',
      size: 'normal'
    },
    {
      src: '/images/gallery-56.jpg',
      alt: 'Richmond Project 41',
      size: 'tall'
    },
    {
      src: '/images/gallery-57.jpg',
      alt: 'Pedernales Project 6',
      size: 'wide'
    },
    {
      src: '/images/gallery-58.jpg',
      alt: 'Mansel Project 7',
      size: 'normal'
    },
    {
      src: '/images/gallery-59.jpg',
      alt: 'Mansel Project 9',
      size: 'tall'
    },
    {
      src: '/images/gallery-60.jpg',
      alt: 'Balcony Project',
      size: 'wide'
    },
    {
      src: '/images/gallery-61.jpg',
      alt: 'Pedernales Front 1',
      size: 'normal'
    },
    {
      src: '/images/gallery-62.jpg',
      alt: 'Glissman Project 40',
      size: 'tall'
    },
    {
      src: '/images/gallery-63.jpg',
      alt: 'Glissman Project 31',
      size: 'wide'
    },
    {
      src: '/images/gallery-64.jpg',
      alt: 'Glissman Project 4',
      size: 'normal'
    },
    {
      src: '/images/gallery-65.jpg',
      alt: 'Glissman Project 10',
      size: 'tall'
    },
    {
      src: '/images/gallery-66.jpg',
      alt: 'Glissman Project 23',
      size: 'wide'
    },
    {
      src: '/images/gallery-67.jpg',
      alt: 'DFD Project 2 (2025)',
      size: 'normal'
    },
    {
      src: '/images/gallery-68.jpg',
      alt: 'DFD Project 5 (2025)',
      size: 'tall'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Work We Are Proud Of
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Image Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => {
              // Determine grid span based on size
              const getGridSpan = (size: string | undefined) => {
                switch (size) {
                  case 'tall':
                    return 'md:row-span-2';
                  case 'wide':
                    return 'md:col-span-2 lg:col-span-1';
                  default:
                    return '';
                }
              };

              // Determine height based on size
              const getHeight = (size: string | undefined) => {
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
                <div 
                  key={index}
                  className={`bg-gray-200 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ${getGridSpan(image.size)}`}
                  onClick={() => openModal(index)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className={`w-full ${getHeight(image.size)} object-cover`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Portfolio Notice */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Full Portfolio of Projects and Referral List Available Upon Request
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Building places you want to be.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-[#3b7d98] hover:bg-[#2d5f75] text-white px-8 py-4 rounded-full font-semibold transition-colors"
          >
            Contact Us for Full Portfolio
          </a>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-full w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button with Counter */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
              <span className="text-white text-sm bg-black bg-opacity-60 px-3 py-1 rounded-full">
                {selectedImage + 1} of {images.length}
              </span>
              <button
                onClick={closeModal}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all text-2xl font-bold border-2 border-white"
              >
                ✕
              </button>
            </div>

            {/* Navigation Arrows */}
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

            {/* Image */}
            <div className="relative">
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}