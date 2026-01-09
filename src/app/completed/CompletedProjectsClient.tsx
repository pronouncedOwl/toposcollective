'use client';

import { useState } from 'react';
import Image from 'next/image';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';

export type CompletedProject = {
  id: string;
  name: string;
  details: string;
  completionLabel: string;
  heroImage?: string | null;
  gallery: {
    id: string;
    url: string;
    alt: string;
  }[];
};

const imagesPerPage = 4;

export default function CompletedProjectsClient({ projects }: { projects: CompletedProject[] }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  const openModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProjectId(null);
    setCurrentImageIndex(0);
  };

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;

  const nextImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.gallery.length);
  };

  const prevImage = () => {
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.gallery.length - 1 : prev - 1));
  };

  const paginatedImages = (project: CompletedProject) => {
    const page = currentPage[project.id] || 0;
    const start = page * imagesPerPage;
    return project.gallery.slice(start, start + imagesPerPage);
  };

  const totalPages = (project: CompletedProject) => Math.ceil(project.gallery.length / imagesPerPage);

  return (
    <div className="min-h-screen bg-white">
      <LazySection direction="fade" delay={0}>
        <div className="bg-gray-50 pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-giga font-bold text-gray-900">Completed Projects</h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">Showcasing our successful residential developments</p>
          </div>
        </div>
      </LazySection>

      <div className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-lg text-gray-500">
              We&apos;re completing new residences soon. Once keys are delivered, you&apos;ll see them here.
            </div>
          )}

          <div className="space-y-24">
            {projects.map((project, index) => {
              const gallerySlice = paginatedImages(project);
              const total = totalPages(project);
              const current = currentPage[project.id] || 0;
              const hero = project.heroImage || project.gallery[0]?.url || '';

              return (
                <LazySection key={project.id} direction="up" delay={index * 120}>
                  <div className="border-b border-gray-200 pb-16 last:border-b-0">
                    <div className="mb-8">
                      <h2 className="mb-4 text-4xl font-bold text-gray-900">{project.name}</h2>
                      <p className="mb-2 text-xl text-gray-600">{project.details}</p>
                      <p className="text-lg text-gray-500">{project.completionLabel}</p>
                    </div>

                    {hero && (
                      <div className="mb-8">
                        <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96 lg:h-[500px]">
                          <Image src={hero} alt={`${project.name} hero image`} fill className="object-cover" />
                        </div>
                      </div>
                    )}

                    {gallerySlice.length > 0 && (
                      <>
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                          {gallerySlice.map((image) => (
                            <button key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-200 transition hover:opacity-90" onClick={() => openModal(project.id)}>
                              <Image src={image.url} alt={image.alt} fill className="object-cover" />
                            </button>
                          ))}
                        </div>

                        {total > 1 && (
                          <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
                            {Array.from({ length: total }).map((_, pageIndex) => (
                              <button
                                key={`${project.id}-page-${pageIndex}`}
                                onClick={() => setCurrentPage({ ...currentPage, [project.id]: pageIndex })}
                                className={`rounded-full px-3 py-1 ${
                                  current === pageIndex ? 'bg-[#3b7d98] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {pageIndex + 1}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="text-center">
                          <button className="font-semibold text-[#3b7d98] underline underline-offset-4 transition hover:text-[#2d5f75]" onClick={() => openModal(project.id)}>
                            Click for Images
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </LazySection>
              );
            })}
          </div>
        </div>
      </div>

      <LazySection direction="up" delay={300}>
        <div className="bg-gray-50 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Interested in Our Work?</h2>
            <p className="mb-8 text-lg text-gray-600">Building places you want to be.</p>
            <CTAButton href="/contact" size="lg">
              Contact Us
            </CTAButton>
          </div>
        </div>
      </LazySection>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeModal}>
          <div className="relative w-full max-w-6xl max-h-full" onClick={(event) => event.stopPropagation()}>
            <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
              <span className="rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {currentImageIndex + 1} of {selectedProject.gallery.length}
              </span>
              <button className="rounded-full border-2 border-white bg-black/60 px-3 py-1 text-xl font-bold text-white" onClick={closeModal}>
                ✕
              </button>
            </div>

            {selectedProject.gallery.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-white bg-black/50 p-4 text-2xl text-white"
                  onClick={prevImage}
                >
                  ◀
                </button>
                <button
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-white bg-black/50 p-4 text-2xl text-white"
                  onClick={nextImage}
                >
                  ▶
                </button>
              </>
            )}

            <div className="relative">
              <Image
                src={selectedProject.gallery[currentImageIndex].url}
                alt={selectedProject.gallery[currentImageIndex].alt}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-full rounded-lg object-contain"
              />
            </div>

            {selectedProject.gallery.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
                {selectedProject.gallery.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 ${
                      index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60'
                    }`}
                  >
                    <Image src={image.url} alt={image.alt} fill className="object-cover" />
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

