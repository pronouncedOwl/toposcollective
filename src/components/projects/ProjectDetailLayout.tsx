import Image from 'next/image';
import Link from 'next/link';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import UnitGallery from '@/components/UnitGallery';
import UnitCarousel from '@/components/projects/UnitCarousel';
import type { ProjectPageData } from '@/lib/projects-view';
import { getRandomStrip } from '@/lib/image-utils';

type ProjectDetailLayoutProps = {
  data: ProjectPageData;
};

const formatUnitSummary = (units: ProjectPageData['units']): string => {
  if (units.length === 0) return 'Unit info coming soon!';
  
  const unitCount = units.length;
  const countLabel = `${unitCount} unit${unitCount === 1 ? '' : 's'}`;
  
  // Calculate bedroom range
  const bedrooms = units.map((u) => u.bedrooms).filter((b): b is number => b !== null);
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
  const squareFeet = units.map((u) => u.squareFeet).filter((sf): sf is number => sf !== null);
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

export default function ProjectDetailLayout({ data }: ProjectDetailLayoutProps) {
  const { project, heroImages, heroStripCandidates, gallery, completionLabel, address, mapUrl, isStaticMap, units } = data;
  
  // Use the same random strip logic as the project list expanded view
  const heroStrip = getRandomStrip(heroStripCandidates, 4);
  const unitSummary = formatUnitSummary(units);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Using expanded view layout */}
      <LazySection direction="fade" delay={0}>
        <div className="bg-white pt-32 pb-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={project.status === 'completed' ? '/completed' : '/coming-soon'}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 transition hover:text-gray-600"
              >
                ← Back to {project.status === 'completed' ? 'Completed' : 'Coming Soon'}
              </Link>
              <span className="rounded-full border border-gray-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                {project.status === 'completed' ? 'Completed' : 'Coming Soon'}
              </span>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{project.name}</h1>
                  <p className="mb-2 text-sm text-gray-500">{unitSummary}</p>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{completionLabel}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CTAButton href="/contact" size="md">
                    Contact Us
                  </CTAButton>
                  <CTAButton href="/contact" size="md" className="bg-gray-900 hover:bg-gray-800">
                    Investor Inquiries
                  </CTAButton>
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
            </div>
          </div>
        </div>
      </LazySection>

      {/* Project Overview */}
      <div className="bg-white pb-16 pt-8">
        <div className="mx-auto max-w-6xl px-4">
          <LazySection direction="up" delay={120}>
            <div className="mb-12">
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">Overview</p>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">About this project</h2>
              <p className="max-w-3xl text-lg text-gray-600">
                {project.long_description || project.short_description || 'A thoughtfully designed residential development.'}
              </p>
            </div>
          </LazySection>

          {/* Units Grid */}
          {units.length > 0 && (
            <LazySection direction="up" delay={180}>
              <div className="mb-16">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Residences</p>
                    <h3 className="text-2xl font-semibold text-gray-900">Units in this project</h3>
                  </div>
                  <p className="text-sm text-gray-500">{units.length} unit{units.length === 1 ? '' : 's'}</p>
                </div>
                <UnitCarousel units={units} projectSlug={project.slug} projectName={project.name} />
              </div>
            </LazySection>
          )}

          {/* Project Gallery */}
          {gallery.length > 0 && (
            <LazySection direction="up" delay={240}>
              <div className="mb-16">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Photos</p>
                    <h3 className="text-2xl font-semibold text-gray-900">Project Gallery</h3>
                  </div>
                  <p className="text-sm text-gray-500">{gallery.length} images</p>
                </div>
                <UnitGallery images={gallery} />
              </div>
            </LazySection>
          )}

          {/* Map Section */}
          {mapUrl && (
            <LazySection direction="up" delay={280}>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Location</p>
                    <h3 className="text-2xl font-semibold text-gray-900">View on the map</h3>
                  </div>
                  <p className="text-sm text-gray-500">{address}</p>
                </div>
                <div className="relative h-72 w-full overflow-hidden rounded-xl border border-gray-200 bg-white md:h-96">
                  {isStaticMap ? (
                    <Image
                      src={mapUrl}
                      alt={`Map of ${project.name}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      unoptimized
                    />
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
                      title={`Map of ${project.name}`}
                    />
                  )}
                </div>
              </div>
            </LazySection>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <LazySection direction="up" delay={300}>
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Invest or buy with Topos</h2>
            <p className="mb-8 text-lg text-gray-600">
              We partner with investors and future homeowners. Share your goals and we will follow up with upcoming
              opportunities.
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
