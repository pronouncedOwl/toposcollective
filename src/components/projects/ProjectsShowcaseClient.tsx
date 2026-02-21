'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import type { ProjectShowcaseItem } from '@/lib/projects-view';

type ProjectsShowcaseClientProps = {
  title: string;
  projects: ProjectShowcaseItem[];
  emptyState: string;
  ctaHeading: string;
  ctaBody: string;
  ctaHref: string;
  ctaLabel: string;
};

const imagesPerPage = 4;

const HouseIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatPrice = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

import { getRandomStrip } from '@/lib/image-utils';

const getProjectThumbnail = (project: ProjectShowcaseItem): { url: string; alt: string } | null => {
  // 1. First project hero image (heroStripCandidates[0] should be a hero photo if available)
  if (project.heroStripCandidates.length > 0) {
    return project.heroStripCandidates[0];
  }
  
  // 2. First unit photo
  const unitWithPhoto = project.units.find((unit) => unit.heroImage);
  if (unitWithPhoto?.heroImage) {
    return {
      url: unitWithPhoto.heroImage,
      alt: `${project.name} ${unitWithPhoto.name} photo`,
    };
  }
  
  // 3. Return null to indicate we should use the house icon
  return null;
};

const formatUnitSummary = (project: ProjectShowcaseItem): string => {
  if (project.units.length === 0) return 'Unit info coming soon!';
  
  const unitCount = project.units.length;
  const countLabel = `${unitCount} unit${unitCount === 1 ? '' : 's'}`;
  
  // Calculate bedroom range
  const bedrooms = project.units.map((u) => u.bedrooms).filter((b): b is number => b !== null);
  let bedroomRange = '';
  if (bedrooms.length > 0) {
    const minBedrooms = Math.min(...bedrooms);
    const maxBedrooms = Math.max(...bedrooms);
    if (minBedrooms === maxBedrooms) {
      bedroomRange = `${minBedrooms}bd`;
    } else {
      bedroomRange = `${minBedrooms}bd–${maxBedrooms}bd`;
    }
  }
  
  // Calculate square feet range
  const squareFeet = project.units.map((u) => u.squareFeet).filter((sf): sf is number => sf !== null);
  let squareFeetRange = '';
  if (squareFeet.length > 0) {
    const minSqft = Math.min(...squareFeet);
    const maxSqft = Math.max(...squareFeet);
    if (minSqft === maxSqft) {
      squareFeetRange = `${minSqft.toLocaleString('en-US')} sqft`;
    } else {
      squareFeetRange = `${minSqft.toLocaleString('en-US')}–${maxSqft.toLocaleString('en-US')} sqft`;
    }
  }
  
  // Build the summary
  const parts = [countLabel];
  if (bedroomRange) parts.push(bedroomRange);
  if (squareFeetRange) parts.push(squareFeetRange);
  
  return parts.join(' · ');
};

const formatShortCompletion = (completionLabel: string): string => {
  // Extract date from completionLabel which is in format "Estimated completion August 2026" or "Completed August 2026"
  const match = completionLabel.match(/(Estimated completion|Completed)\s+(\w+)\s+(\d{4})/);
  if (!match) {
    // Handle cases like "Completion date forthcoming"
    return completionLabel;
  }
  
  const [, prefix, monthName, year] = match;
  const monthMap: Record<string, string> = {
    January: '1',
    February: '2',
    March: '3',
    April: '4',
    May: '5',
    June: '6',
    July: '7',
    August: '8',
    September: '9',
    October: '10',
    November: '11',
    December: '12',
  };
  
  const monthNum = monthMap[monthName];
  if (!monthNum) return completionLabel;
  
  const shortPrefix = prefix === 'Estimated completion' ? 'Est Complete' : 'Completed';
  return `${shortPrefix} ${monthNum}.${year}`;
};

export default function ProjectsShowcaseClient({
  title,
  projects,
  emptyState,
  ctaHeading,
  ctaBody,
  ctaHref,
  ctaLabel,
}: ProjectsShowcaseClientProps) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const heroStripByProject = useMemo(
    () => new Map(projects.map((project) => [project.id, getRandomStrip(project.heroStripCandidates, 4)])),
    [projects]
  );

  const openModal = (projectId: string, unitId: string, index = 0) => {
    setSelectedProjectId(projectId);
    setSelectedUnitId(unitId);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedProjectId(null);
    setSelectedUnitId(null);
    setCurrentImageIndex(0);
  };

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;
  const selectedUnit = selectedProject?.units.find((unit) => unit.id === selectedUnitId) || null;

  const nextImage = () => {
    if (!selectedUnit) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedUnit.gallery.length);
  };

  const prevImage = () => {
    if (!selectedUnit) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedUnit.gallery.length - 1 : prev - 1));
  };

  const getUnitPageKey = (projectId: string, unitId: string) => `${projectId}-${unitId}`;

  const paginatedImages = (unit: ProjectShowcaseItem['units'][number], pageKey: string) => {
    const page = currentPage[pageKey] || 0;
    const start = page * imagesPerPage;
    return {
      page,
      start,
      images: unit.gallery.slice(start, start + imagesPerPage),
      totalPages: Math.max(1, Math.ceil(unit.gallery.length / imagesPerPage)),
    };
  };

  const updatePage = (pageKey: string, nextPage: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [pageKey]: nextPage,
    }));
  };

  const toggleExpanded = (projectId: string) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  return (
    <div className="min-h-screen bg-white">
      <LazySection direction="fade" delay={0}>
        <div className="bg-gray-50 pt-32 pb-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-giga font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      </LazySection>

      <div className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-lg text-gray-500">
              {emptyState}
            </div>
          )}

          <div className="space-y-10">
            {projects.map((project, index) => {
              const isExpanded = expandedProjectId === project.id;
              const heroStrip = heroStripByProject.get(project.id) ?? [];
              const thumbnail = getProjectThumbnail(project);
              const unitSummary = formatUnitSummary(project);
              const shortCompletion = formatShortCompletion(project.completionLabel);

              return (
                <LazySection key={project.id} direction="up" delay={index * 120}>
                  <div className={`rounded-3xl border border-gray-200 bg-white shadow-sm ${!isExpanded ? 'p-5 md:p-6' : 'p-8 md:p-10'}`}>
                    {!isExpanded ? (
                      // List View (collapsed)
                      <div className="flex flex-wrap items-start gap-6">
                        {/* Thumbnail */}
                        <div className="relative h-24 w-[134px] flex-shrink-0 overflow-hidden rounded-2xl border border-[#3b7d98]/75 bg-gray-100 shadow-sm md:h-32 md:w-[179px]">
                          {thumbnail ? (
                            <Image
                              src={thumbnail.url}
                              alt={thumbnail.alt}
                              fill
                              sizes="128px"
                              className="object-contain object-center rounded-2xl"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <HouseIcon className="h-12 w-12" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">{project.name}</h2>
                          <p className="mb-2 text-sm text-gray-500">{unitSummary}</p>
                          <p className="mb-4 text-sm text-gray-400">{shortCompletion}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/project/${project.slug}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#3b7d98] bg-[#3b7d98] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2d5f75]"
                            >
                              View project page →
                            </Link>
                            <button
                              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#3b7d98] transition hover:bg-gray-50"
                              onClick={() => toggleExpanded(project.id)}
                              aria-expanded={false}
                              aria-controls={`project-${project.id}`}
                            >
                              Expand details
                              <span aria-hidden className="text-xs">
                                ▾
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Expanded View
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{project.name}</h2>
                            <p className="mb-2 text-sm text-gray-500">{unitSummary}</p>
                            <p className="mb-2 text-base text-gray-600">{project.description || project.details}</p>
                            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{project.completionLabel}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/project/${project.slug}`}
                              className="inline-flex items-center gap-2 rounded-full border border-[#3b7d98] bg-[#3b7d98] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d5f75]"
                            >
                              View project page →
                            </Link>
                            <button
                              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-[#3b7d98] transition hover:bg-gray-50"
                              onClick={() => toggleExpanded(project.id)}
                              aria-expanded={true}
                              aria-controls={`project-${project.id}`}
                            >
                              Hide details
                              <span aria-hidden className="text-base">
                                ▴
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* 4-image gallery */}
                        {heroStrip.length > 0 && (
                          <div className="mt-6 flex h-36 w-full gap-1 md:h-[168px]">
                            {heroStrip.map((image, imageIndex) => (
                              <div key={image.url} className="relative h-full flex-1 overflow-hidden rounded-2xl border border-[#3b7d98]/75 bg-gray-100 shadow-sm">
                                <Image
                                  src={image.url}
                                  alt={image.alt || `${project.name} image ${imageIndex + 1}`}
                                  fill
                                  sizes="(min-width: 768px) 25vw, 50vw"
                                  className="object-contain object-center rounded-2xl"
                                />
                              </div>
                            ))}
                          </div>
                        )}
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
            <h2 className="mb-6 text-3xl font-bold text-gray-900">{ctaHeading}</h2>
            <p className="mb-8 text-lg text-gray-600">{ctaBody}</p>
            <CTAButton href={ctaHref} size="lg">
              {ctaLabel}
            </CTAButton>
          </div>
        </div>
      </LazySection>

      {selectedProject && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeModal}>
          <div className="relative w-full max-w-6xl max-h-full" onClick={(event) => event.stopPropagation()}>
            <div className="absolute right-4 top-4 z-10 flex items-center gap-3">
              <span className="rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {currentImageIndex + 1} of {selectedUnit.gallery.length}
              </span>
              <button className="rounded-full border-2 border-white bg-black/60 px-3 py-1 text-xl font-bold text-white" onClick={closeModal}>
                ✕
              </button>
            </div>

            {selectedUnit.gallery.length > 1 && (
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
                src={selectedUnit.gallery[currentImageIndex].url}
                alt={selectedUnit.gallery[currentImageIndex].alt}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-full rounded-lg object-contain"
              />
            </div>

            {selectedUnit.gallery.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
                {selectedUnit.gallery.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 ${
                      index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60'
                    }`}
                  >
                    <Image src={image.url} alt={image.alt} fill sizes="80px" className="object-cover"  />
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
