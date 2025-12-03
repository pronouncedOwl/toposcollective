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
  mainImage: string;
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
      mainImage: '/images/4613-unit-1-main.webp',
      images: [
        { code: '02-DFD-2', src: '/images/4613-grp-a/02-DFD-2.jpg', alt: '4613 Raintree Unit 1 - 02-DFD-2' },
        { code: '03-DFD-3', src: '/images/4613-grp-a/03-DFD-3.jpg', alt: '4613 Raintree Unit 1 - 03-DFD-3' },
        { code: '04-DFD-4', src: '/images/4613-grp-a/04-DFD-4.jpg', alt: '4613 Raintree Unit 1 - 04-DFD-4' },
        { code: '05-DFD-5', src: '/images/4613-grp-a/05-DFD-5.jpg', alt: '4613 Raintree Unit 1 - 05-DFD-5' },
        { code: '06-DFD-6', src: '/images/4613-grp-a/06-DFD-6.jpg', alt: '4613 Raintree Unit 1 - 06-DFD-6' },
        { code: '07-DFD-7', src: '/images/4613-grp-a/07-DFD-7.jpg', alt: '4613 Raintree Unit 1 - 07-DFD-7' },
        { code: '08-DFD-8', src: '/images/4613-grp-a/08-DFD-8.jpg', alt: '4613 Raintree Unit 1 - 08-DFD-8' },
        { code: '09-DFD-9', src: '/images/4613-grp-a/09-DFD-9.jpg', alt: '4613 Raintree Unit 1 - 09-DFD-9' },
        { code: '10-DFD-10', src: '/images/4613-grp-a/10-DFD-10.jpg', alt: '4613 Raintree Unit 1 - 10-DFD-10' },
        { code: '12-DFD-12', src: '/images/4613-grp-a/12-DFD-12.jpg', alt: '4613 Raintree Unit 1 - 12-DFD-12' },
        { code: '13-DFD-13', src: '/images/4613-grp-a/13-DFD-13.jpg', alt: '4613 Raintree Unit 1 - 13-DFD-13' },
        { code: '14-DFD-14', src: '/images/4613-grp-a/14-DFD-14.jpg', alt: '4613 Raintree Unit 1 - 14-DFD-14' },
        { code: '16-DFD-16', src: '/images/4613-grp-a/16-DFD-16.jpg', alt: '4613 Raintree Unit 1 - 16-DFD-16' },
        { code: '17-DFD-17', src: '/images/4613-grp-a/17-DFD-17.jpg', alt: '4613 Raintree Unit 1 - 17-DFD-17' },
        { code: '18-DFD-18', src: '/images/4613-grp-a/18-DFD-18.jpg', alt: '4613 Raintree Unit 1 - 18-DFD-18' },
        { code: '19-DFD-19', src: '/images/4613-grp-a/19-DFD-19.jpg', alt: '4613 Raintree Unit 1 - 19-DFD-19' },
        { code: '20-DFD-20', src: '/images/4613-grp-a/20-DFD-20.jpg', alt: '4613 Raintree Unit 1 - 20-DFD-20' },
      ],
    },
    {
      id: 'raintree-unit-2',
      name: '4613 Raintree Unit 2',
      details: '4 Bedroom + Office, 3 Bath, Pool',
      date: 'April 2025',
      mainImage: '/images/4613-unit-2-main.webp',
      images: [
        { code: '03-DFD-2', src: '/images/4613-grp-b/03-DFD-2.jpg', alt: '4613 Raintree Unit 2 - 03-DFD-2' },
        { code: '04-DFD-3', src: '/images/4613-grp-b/04-DFD-3.jpg', alt: '4613 Raintree Unit 2 - 04-DFD-3' },
        { code: '05-DFD-4', src: '/images/4613-grp-b/05-DFD-4.jpg', alt: '4613 Raintree Unit 2 - 05-DFD-4' },
        { code: '06-DFD-5', src: '/images/4613-grp-b/06-DFD-5.jpg', alt: '4613 Raintree Unit 2 - 06-DFD-5' },
        { code: '07-DFD-6', src: '/images/4613-grp-b/07-DFD-6.jpg', alt: '4613 Raintree Unit 2 - 07-DFD-6' },
        { code: '08-DFD-7', src: '/images/4613-grp-b/08-DFD-7.jpg', alt: '4613 Raintree Unit 2 - 08-DFD-7' },
        { code: '09-DFD-8', src: '/images/4613-grp-b/09-DFD-8.jpg', alt: '4613 Raintree Unit 2 - 09-DFD-8' },
        { code: '10-DFD-9', src: '/images/4613-grp-b/10-DFD-9.jpg', alt: '4613 Raintree Unit 2 - 10-DFD-9' },
        { code: '11-DFD-10', src: '/images/4613-grp-b/11-DFD-10.jpg', alt: '4613 Raintree Unit 2 - 11-DFD-10' },
        { code: '12-DFD-11', src: '/images/4613-grp-b/12-DFD-11.jpg', alt: '4613 Raintree Unit 2 - 12-DFD-11' },
        { code: '13-DFD-12', src: '/images/4613-grp-b/13-DFD-12.jpg', alt: '4613 Raintree Unit 2 - 13-DFD-12' },
        { code: '14-DFD-13', src: '/images/4613-grp-b/14-DFD-13.jpg', alt: '4613 Raintree Unit 2 - 14-DFD-13' },
        { code: '15-DFD-14', src: '/images/4613-grp-b/15-DFD-14.jpg', alt: '4613 Raintree Unit 2 - 15-DFD-14' },
        { code: '16-DFD-15', src: '/images/4613-grp-b/16-DFD-15.jpg', alt: '4613 Raintree Unit 2 - 16-DFD-15' },
        { code: '17-DFD-16', src: '/images/4613-grp-b/17-DFD-16.jpg', alt: '4613 Raintree Unit 2 - 17-DFD-16' },
        { code: '18-DFD-17', src: '/images/4613-grp-b/18-DFD-17.jpg', alt: '4613 Raintree Unit 2 - 18-DFD-17' },
        { code: '19-DFD-18', src: '/images/4613-grp-b/19-DFD-18.jpg', alt: '4613 Raintree Unit 2 - 19-DFD-18' },
        { code: '20-DFD-19', src: '/images/4613-grp-b/20-DFD-19.jpg', alt: '4613 Raintree Unit 2 - 20-DFD-19' },
        { code: '21-DFD-20', src: '/images/4613-grp-b/21-DFD-20.jpg', alt: '4613 Raintree Unit 2 - 21-DFD-20' },
        { code: '22-DFD-21', src: '/images/4613-grp-b/22-DFD-21.jpg', alt: '4613 Raintree Unit 2 - 22-DFD-21' },
        { code: '23-DFD-22', src: '/images/4613-grp-b/23-DFD-22.jpg', alt: '4613 Raintree Unit 2 - 23-DFD-22' },
        { code: '24-DFD-36', src: '/images/4613-grp-b/24-DFD-36.jpg', alt: '4613 Raintree Unit 2 - 24-DFD-36' },
        { code: '25-DFD-28', src: '/images/4613-grp-b/25-DFD-28.jpg', alt: '4613 Raintree Unit 2 - 25-DFD-28' },
        { code: '26-DFD-23', src: '/images/4613-grp-b/26-DFD-23.jpg', alt: '4613 Raintree Unit 2 - 26-DFD-23' },
        { code: '27-DFD-24', src: '/images/4613-grp-b/27-DFD-24.jpg', alt: '4613 Raintree Unit 2 - 27-DFD-24' },
        { code: '28-DFD-37', src: '/images/4613-grp-b/28-DFD-37.jpg', alt: '4613 Raintree Unit 2 - 28-DFD-37' },
        { code: '29-DFD-25', src: '/images/4613-grp-b/29-DFD-25.jpg', alt: '4613 Raintree Unit 2 - 29-DFD-25' },
        { code: '30-DFD-26', src: '/images/4613-grp-b/30-DFD-26.jpg', alt: '4613 Raintree Unit 2 - 30-DFD-26' },
        { code: '31-DFD-27', src: '/images/4613-grp-b/31-DFD-27.jpg', alt: '4613 Raintree Unit 2 - 31-DFD-27' },
        { code: '32-DFD-29', src: '/images/4613-grp-b/32-DFD-29.jpg', alt: '4613 Raintree Unit 2 - 32-DFD-29' },
        { code: '33-DFD-30', src: '/images/4613-grp-b/33-DFD-30.jpg', alt: '4613 Raintree Unit 2 - 33-DFD-30' },
        { code: '34-DFD-31', src: '/images/4613-grp-b/34-DFD-31.jpg', alt: '4613 Raintree Unit 2 - 34-DFD-31' },
        { code: '36-DFD-32', src: '/images/4613-grp-b/36-DFD-32.jpg', alt: '4613 Raintree Unit 2 - 36-DFD-32' },
        { code: '37-DFD-33', src: '/images/4613-grp-b/37-DFD-33.jpg', alt: '4613 Raintree Unit 2 - 37-DFD-33' },
        { code: '38-DFD-34', src: '/images/4613-grp-b/38-DFD-34.jpg', alt: '4613 Raintree Unit 2 - 38-DFD-34' },
        { code: '39-DFD-35', src: '/images/4613-grp-b/39-DFD-35.jpg', alt: '4613 Raintree Unit 2 - 39-DFD-35' },
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

                    {/* Main Image */}
                    <div className="mb-8">
                      <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={project.mainImage}
                          alt={`${project.name} - Main Image`}
                          fill
                          className="object-cover"
                        />
                      </div>
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

