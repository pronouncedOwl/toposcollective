import Image from 'next/image';
import Link from 'next/link';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import UnitGallery from '@/components/UnitGallery';
import type { ProjectUnitPageData } from '@/lib/projects-view';
import { getRandomStrip } from '@/lib/image-utils';

type ProjectUnitLayoutProps = {
  data: ProjectUnitPageData;
  backHref: string;
  backLabel: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

const formatUnitSummary = (unit: ProjectUnitPageData['unit']): string => {
  const parts = [];
  
  if (unit.bedrooms !== null) {
    parts.push(`${unit.bedrooms}bd`);
  }
  if (unit.bathrooms !== null) {
    parts.push(`${unit.bathrooms}ba`);
  }
  if (unit.square_feet !== null) {
    parts.push(`${unit.square_feet.toLocaleString('en-US')} sqft`);
  }
  
  return parts.join(' · ') || 'Unit details';
};

export default function ProjectUnitLayout({
  data,
  backHref,
  backLabel,
  ctaPrimaryLabel,
  ctaPrimaryHref = '/contact',
  ctaSecondaryLabel,
  ctaSecondaryHref = '/contact',
}: ProjectUnitLayoutProps) {
  const { project, unit, heroImage, heroStripCandidates, gallery, floorplanUrl, formattedPrice, stats, availability, address, mapUrl, isStaticMap, completionLabel } =
    data;
  
  // Use the same random strip logic as the project list expanded view
  const heroStrip = getRandomStrip(heroStripCandidates, 4);
  const unitSummary = formatUnitSummary(unit);
  const soldPrice =
    unit.sold_price === null || unit.sold_price === undefined
      ? null
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(unit.sold_price);
  const expectedCompletion = project.estimated_completion
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(project.estimated_completion),
      )
    : null;
  const actualCompletion = project.actual_completion
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(project.actual_completion),
      )
    : null;
  const timeOnMarket = unit.time_on_market_days ?? null;
  const isSold = availability.toLowerCase().includes('sold');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Using expanded view layout */}
      <LazySection direction="fade" delay={0}>
        <div className="bg-white pt-32 pb-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={backHref}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 transition hover:text-gray-600"
              >
                {backLabel}
              </Link>
              <span
                className={
                  isSold
                    ? 'rounded-full bg-rose-600 px-6 py-2 text-sm font-bold uppercase tracking-[0.3em] text-white shadow-lg'
                    : 'rounded-full border border-gray-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500'
                }
              >
                {availability}
              </span>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{unit.name || project.name}</h1>
                  <p className="mb-2 text-sm text-gray-500">{unitSummary}</p>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{completionLabel}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CTAButton href={ctaPrimaryHref} size="md">
                    {ctaPrimaryLabel}
                  </CTAButton>
                  {ctaSecondaryLabel && (
                    <CTAButton href={ctaSecondaryHref} size="md" className="bg-gray-900 hover:bg-gray-800">
                      {ctaSecondaryLabel}
                    </CTAButton>
                  )}
                </div>
              </div>

              {/* 4-image gallery (or fewer if not enough images) */}
              {heroStrip.length > 0 && (
                <div className="mt-6 flex h-36 w-full gap-1 md:h-[168px]">
                  {heroStrip.map((image, imageIndex) => (
                    <div key={image.url} className="relative h-full w-[calc(25%-0.1875rem)] overflow-hidden rounded-2xl border border-[#3b7d98]/75 bg-gray-100 shadow-sm">
                      <Image
                        src={image.url}
                        alt={image.alt || `${unit.name || project.name} image ${imageIndex + 1}`}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-contain object-center rounded-2xl"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </LazySection>

      <div className="bg-white pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4">
          <LazySection direction="up" delay={120}>
            {unit.long_description && (
              <p className="text-lg text-gray-600">
                {unit.long_description}
              </p>
            )}
          </LazySection>

          {floorplanUrl && (
            <LazySection direction="up" delay={180}>
              <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Floorplan</p>
                    <h3 className="text-2xl font-semibold text-gray-900">Layout at a glance</h3>
                  </div>
                  <CTAButton href={floorplanUrl} size="sm" className="bg-gray-900 hover:bg-gray-800">
                    View Full Plan
                  </CTAButton>
                </div>
                <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white md:h-[420px]">
                  <Image src={floorplanUrl} alt={`${unit.name} floorplan`} fill sizes="100vw" className="object-contain" />
                </div>
              </div>
            </LazySection>
          )}

          {gallery.length > 0 && (
            <LazySection direction="up" delay={240}>
              <div className="mt-16">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Photos</p>
                    <h3 className="text-2xl font-semibold text-gray-900">Gallery</h3>
                  </div>
                  <p className="text-sm text-gray-500">{gallery.length} images</p>
                </div>
                <UnitGallery images={gallery} />
              </div>
            </LazySection>
          )}

          {project.long_description && (
            <LazySection direction="up" delay={260}>
              <div className="mt-16">
                <div className="mb-12">
                  <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">Project</p>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900">About the project</h2>
                  <p className="text-lg text-gray-600">
                    {project.long_description}
                  </p>
                </div>
              </div>
            </LazySection>
          )}

          {mapUrl && (
            <LazySection direction="up" delay={280}>
              <div className={`rounded-2xl border border-gray-200 bg-gray-50 p-8 ${project.long_description ? 'mt-16' : 'mt-16'}`}>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Location</p>
                    <h3 className="text-2xl font-semibold text-gray-900">View on the map</h3>
                  </div>
                  <p className="text-sm text-gray-500">{address}</p>
                </div>
                <div className="relative h-72 w-full overflow-hidden rounded-xl border border-gray-200 bg-white md:h-96">
                  {isStaticMap ? (
                    <Image src={mapUrl} alt={`Map of ${unit.name || project.name}`} fill sizes="100vw" className="object-cover" unoptimized />
                  ) : (
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full"
                      title={`Map of ${unit.name || project.name}`}
                    />
                  )}
                </div>
              </div>
            </LazySection>
          )}
        </div>
      </div>

      <LazySection direction="up" delay={300}>
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Invest or buy with Topos</h2>
            <p className="mb-8 text-lg text-gray-600">
              We partner with investors and future homeowners. Share your goals and we will follow up with upcoming opportunities.
            </p>
            <CTAButton href="/contact" size="lg">
              Start the conversation
            </CTAButton>
          </div>
        </div>
      </LazySection>
    </div>
  );
}
