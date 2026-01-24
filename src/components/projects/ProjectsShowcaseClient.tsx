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
  unitLinkBase: string;
};

const imagesPerPage = 4;
const formatPrice = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const getRandomStrip = (images: ProjectShowcaseItem['heroStripCandidates'], max: number) => {
  const unique = Array.from(new Map(images.map((image) => [image.url, image])).values());
  if (unique.length <= max) return unique;
  const shuffled = [...unique];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, max);
};

export default function ProjectsShowcaseClient({
  title,
  projects,
  emptyState,
  ctaHeading,
  ctaBody,
  ctaHref,
  ctaLabel,
  unitLinkBase,
}: ProjectsShowcaseClientProps) {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id ?? null);
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

  const buildUnitSummary = (project: ProjectShowcaseItem) => {
    if (project.units.length === 0) return 'No units available';
    const summary = project.units
      .slice(0, 2)
      .map((unit) => `${unit.name}: ${unit.details}`)
      .join(' • ');
    const countLabel = `${project.units.length} unit${project.units.length === 1 ? '' : 's'}`;
    return summary ? `${countLabel} · ${summary}` : countLabel;
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

              return (
                <LazySection key={project.id} direction="up" delay={index * 120}>
                  <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{project.name}</h2>
                        <p className="mb-2 text-lg text-gray-600">{project.description || project.details}</p>
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{project.completionLabel}</p>
                      </div>
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        onClick={() => toggleExpanded(project.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`project-${project.id}`}
                      >
                        {isExpanded ? 'Hide details' : 'Expand details'}
                        <span aria-hidden className="text-base">
                          {isExpanded ? '▴' : '▾'}
                        </span>
                      </button>
                    </div>

                    <div className="mt-6">
                      {!isExpanded && (
                        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr),minmax(0,0.7fr)] md:items-center">
                          <div className="space-y-3 text-gray-600">
                            <p className="text-base">{project.description || project.details}</p>
                            <p className="text-sm text-gray-500">{buildUnitSummary(project)}</p>
                            <div className="flex flex-wrap items-center gap-4">
                              <button
                                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-gray-400 transition hover:text-gray-600"
                                onClick={() => toggleExpanded(project.id)}
                              >
                                Expand project
                                <span aria-hidden>→</span>
                              </button>
                              <Link
                                href={`/project/${project.slug}`}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3b7d98] underline underline-offset-4 transition hover:text-[#2d5f75]"
                              >
                                View project page
                              </Link>
                            </div>
                          </div>
                          {heroStrip.length > 0 && (
                            <div className="flex h-24 w-full gap-1 overflow-hidden rounded-2xl bg-gray-100 shadow-md md:h-28">
                              {heroStrip.map((image, imageIndex) => (
                                <div key={image.url} className="relative h-full flex-1 overflow-hidden">
                                  <Image
                                    src={image.url}
                                    alt={image.alt || `${project.name} image ${imageIndex + 1}`}
                                    fill
                                    sizes="(min-width: 768px) 25vw, 50vw"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {isExpanded && heroStrip.length > 0 && (
                        <div className="flex h-28 w-full gap-1 overflow-hidden rounded-2xl bg-gray-100 shadow-md md:h-32">
                          {heroStrip.map((image, imageIndex) => (
                            <div key={image.url} className="relative h-full flex-1 overflow-hidden">
                              <Image
                                src={image.url}
                                alt={image.alt || `${project.name} image ${imageIndex + 1}`}
                                fill
                                sizes="(min-width: 768px) 25vw, 50vw"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div id={`project-${project.id}`} className="mt-8">
                        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                          <div className="max-w-3xl">
                            {project.longDescription && (
                              <p className="text-lg text-gray-600">{project.longDescription}</p>
                            )}
                          </div>
                          <Link
                            href={`/project/${project.slug}`}
                            className="inline-flex items-center gap-2 rounded-full border border-[#3b7d98] bg-white px-4 py-2 text-sm font-semibold text-[#3b7d98] transition hover:bg-[#3b7d98] hover:text-white"
                          >
                            View project page →
                          </Link>
                        </div>

                        <div className="grid gap-10 md:grid-cols-2">
                          {project.units.map((unit, unitIndex) => {
                            const pageKey = getUnitPageKey(project.id, unit.id);
                            const { page, start, images, totalPages } = paginatedImages(unit, pageKey);
                            const unitMain = unit.heroImage || unit.gallery[0]?.url || '';
                            const unitSlug = unit.unitCode || unit.id;
                            const isLastAndOdd = unitIndex === project.units.length - 1 && project.units.length % 2 === 1;
                            return (
                              <div
                                key={unit.id}
                                className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${
                                  isLastAndOdd ? 'md:col-span-2 md:mx-auto md:max-w-[calc(50%-1.25rem)]' : ''
                                }`}
                              >
                                <div className="mb-6">
                                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Unit</p>
                                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{unit.name}</h3>
                                  <p className="text-lg text-gray-600">{unit.shortDescription || unit.details}</p>
                                  {unit.squareFeet ? (
                                    <p className="mt-1 text-sm font-medium uppercase tracking-wide text-gray-500">
                                      {unit.squareFeet.toLocaleString('en-US')} Sq ft
                                    </p>
                                  ) : null}
                                  {formatPrice(unit.price) && (
                                    <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(unit.price)}</p>
                                  )}
                                  <Link
                                    href={`${unitLinkBase}/${unitSlug}`}
                                    className="mt-3 inline-flex text-sm font-semibold text-[#3b7d98] underline underline-offset-4 transition hover:text-[#2d5f75]"
                                  >
                                    View Unit
                                  </Link>
                                </div>

                                {unitMain && (
                                  <button className="mb-6 w-full" onClick={() => openModal(project.id, unit.id)}>
                                    <div className="relative h-56 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm md:h-72">
                                      <Image
                                        src={unitMain}
                                        alt={`${project.name} ${unit.name} main`}
                                        fill
                                        className="object-cover blur-xl scale-110 opacity-60"
                                        aria-hidden
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <Image
                                          src={unitMain}
                                          alt={`${project.name} ${unit.name} main`}
                                          fill
                                          sizes="(min-width: 1024px) 50vw, 100vw"
                                          className="object-contain"
                                        />
                                      </div>
                                    </div>
                                  </button>
                                )}

                                {unit.gallery.length > 0 && (
                                  <>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                      {images.map((image, imageIndex) => (
                                        <button
                                          key={image.id}
                                          className="relative aspect-square overflow-hidden rounded-lg bg-gray-200 transition hover:opacity-90"
                                          onClick={() => openModal(project.id, unit.id, start + imageIndex)}
                                        >
                                          <Image src={image.url} alt={image.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                                        </button>
                                      ))}
                                    </div>
                                    {totalPages > 1 && (
                                      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                        <button
                                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                                          onClick={() => updatePage(pageKey, Math.max(0, page - 1))}
                                          disabled={page === 0}
                                        >
                                          ◀ Prev
                                        </button>
                                        <span>
                                          Page {page + 1} of {totalPages}
                                        </span>
                                        <button
                                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                                          onClick={() => updatePage(pageKey, Math.min(totalPages - 1, page + 1))}
                                          disabled={page >= totalPages - 1}
                                        >
                                          Next ▶
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
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
                    <Image src={image.url} alt={image.alt} fill sizes="80px" className="object-cover" />
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
