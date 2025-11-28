'use client';

import { useState } from 'react';
import Image from 'next/image';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';

interface ProjectImage {
  code: string;
  src: string;
  alt: string;
}

interface Project {
  id: string;
  name: string;
  details: string;
  date: string;
  images: ProjectImage[];
}

export default function CompletedPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});

  const projects: Project[] = [
    {
      id: 'raintree-unit-1',
      name: '4613 Raintree Unit 1',
      details: '2 Bedroom, 2.5 Bath, Pool',
      date: 'April 2025',
      images: [
        { code: '02-DFD-2', src: '/images/gallery-2.jpg', alt: 'DFD Project 28' },
        { code: '07-DFD-7', src: '/images/gallery-7.jpg', alt: 'Mansel Project 9' },
        { code: '10-DFD-10', src: '/images/gallery-10.jpg', alt: 'Mansel Project 15' },
        { code: '12-DFD-12', src: '/images/gallery-12.jpg', alt: 'Garland Avenue Project 19' },
        { code: '15-DFD-15', src: '/images/gallery-15.jpg', alt: 'Garland Avenue Project 7' },
        { code: '18-DFD-18', src: '/images/gallery-18.jpg', alt: 'DFD Project 33' },
      ],
    },
    {
      id: 'raintree-unit-2',
      name: '4613 Raintree Unit 2',
      details: '4 Bedroom + Office, 3 Bath, Pool',
      date: 'April 2025',
      images: [
        { code: '04-DFD-3', src: '/images/gallery-4.jpg', alt: 'DFD Project 18' },
        { code: '06-DFD-5', src: '/images/gallery-6.jpg', alt: 'Gallery Image 6' },
        { code: '07-DFD-6', src: '/images/gallery-7.jpg', alt: 'Mansel Project 9' },
        { code: '08-DFD-7', src: '/images/gallery-8.jpg', alt: 'Mansel Project 36' },
        { code: '11-DFD-11', src: '/images/gallery-11.jpg', alt: 'Mansel Project 7' },
        { code: '13-DFD-13', src: '/images/gallery-13.jpg', alt: 'Garland Avenue Project 30' },
        { code: '14-DFD-14', src: '/images/gallery-14.jpg', alt: 'Garland Avenue Project 34' },
        { code: '16-DFD-16', src: '/images/gallery-16.jpg', alt: 'Gallery Image 16' },
        { code: '17-DFD-17', src: '/images/gallery-17.jpg', alt: 'Glissman Project 31' },
        { code: '19-DFD-19', src: '/images/gallery-19.jpg', alt: 'DFD Project 2' },
        { code: '20-DFD-20', src: '/images/gallery-20.jpg', alt: 'DFD Project 5' },
        { code: '21-DFD-21', src: '/images/gallery-21.jpg', alt: 'DFD Project 15' },
      ],
    },
  ];

  const imagesPerPage = 4;
  
  const getCurrentPageImages = (project: Project) => {
    const page = currentPage[project.id] || 0;
    const start = page * imagesPerPage;
    return project.images.slice(start, start + imagesPerPage);
  };

  const getTotalPages = (project: Project) => {
    return Math.ceil(project.images.length / imagesPerPage);
  };

  const openModal = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      if (project) {
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      }
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      if (project) {
        setCurrentImageIndex((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
      }
    }
  };

  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="pt-32 pb-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-giga font-bold text-gray-900 mb-6">
                Completed Projects
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Showcasing our successful residential developments
              </p>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Projects List */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-24">
            {projects.map((project, projectIndex) => {
              const totalPages = getTotalPages(project);
              const currentPageNum = currentPage[project.id] || 0;
              const pageImages = getCurrentPageImages(project);

              return (
                <LazySection key={project.id} direction="up" delay={projectIndex * 100}>
                  <div className="border-b border-gray-200 pb-16 last:border-b-0">
                    <div className="mb-8">
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {project.name}
                      </h2>
                      <p className="text-xl text-gray-600 mb-2">{project.details}</p>
                      <p className="text-lg text-gray-500">{project.date}</p>
                    </div>

                    {/* Image Gallery Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {pageImages.map((image) => (
                        <div
                          key={image.code}
                          className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openModal(project.id)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mb-6">
                        {/* Always show page 1 */}
                        <button
                          onClick={() => setCurrentPage({ ...currentPage, [project.id]: 0 })}
                          className={`px-3 py-1 text-sm font-medium ${
                            currentPageNum === 0
                              ? 'text-[#3b7d98] border-b-2 border-[#3b7d98]'
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          1
                        </button>
                        
                        {/* Show current page if it's not 1 or last */}
                        {currentPageNum > 1 && currentPageNum < totalPages - 1 && (
                          <>
                            {currentPageNum > 2 && <span className="text-gray-400">…</span>}
                            <button
                              onClick={() => setCurrentPage({ ...currentPage, [project.id]: currentPageNum })}
                              className="px-3 py-1 text-sm font-medium text-[#3b7d98] border-b-2 border-[#3b7d98]"
                            >
                              {currentPageNum + 1}
                            </button>
                          </>
                        )}
                        
                        {/* Show ellipsis before last page if needed */}
                        {currentPageNum < totalPages - 2 && <span className="text-gray-400">…</span>}
                        
                        {/* Show last page if more than 1 page */}
                        {totalPages > 1 && (
                          <button
                            onClick={() => setCurrentPage({ ...currentPage, [project.id]: totalPages - 1 })}
                            className={`px-3 py-1 text-sm font-medium ${
                              currentPageNum === totalPages - 1
                                ? 'text-[#3b7d98] border-b-2 border-[#3b7d98]'
                                : 'text-gray-700 hover:text-gray-900'
                            }`}
                          >
                            {totalPages}
                          </button>
                        )}
                        
                        {/* Next arrow */}
                        {currentPageNum < totalPages - 1 && (
                          <button
                            onClick={() => setCurrentPage({ ...currentPage, [project.id]: currentPageNum + 1 })}
                            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                          >
                            ►
                          </button>
                        )}
                      </div>
                    )}

                    {/* Click for images button */}
                    <div className="text-center">
                      <button
                        onClick={() => openModal(project.id)}
                        className="text-[#3b7d98] hover:text-[#2d5f75] font-semibold underline transition-colors"
                      >
                        Click for Images
                      </button>
                    </div>
                  </div>
                </LazySection>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <LazySection direction="up" delay={400}>
        <div className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Interested in Our Work?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Building places you want to be.
            </p>
            <CTAButton href="/contact" size="lg">
              Contact Us
            </CTAButton>
          </div>
        </div>
      </LazySection>

      {/* Image Modal */}
      {selectedProjectData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-full w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button with Counter */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
              <span className="text-white text-sm bg-black bg-opacity-60 px-3 py-1 rounded-full">
                {currentImageIndex + 1} of {selectedProjectData.images.length}
              </span>
              <button
                onClick={closeModal}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all text-2xl font-bold border-2 border-white"
              >
                ✕
              </button>
            </div>

            {/* Navigation Arrows */}
            {selectedProjectData.images.length > 1 && (
              <>
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
              </>
            )}

            {/* Image */}
            <div className="relative">
              <Image
                src={selectedProjectData.images[currentImageIndex].src}
                alt={selectedProjectData.images[currentImageIndex].alt}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Thumbnail Strip */}
            {selectedProjectData.images.length > 1 && (
              <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
                {selectedProjectData.images.map((image, idx) => (
                  <button
                    key={image.code}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 ${
                      idx === currentImageIndex ? 'border-white' : 'border-transparent opacity-60'
                    } hover:opacity-100 transition-opacity`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
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

