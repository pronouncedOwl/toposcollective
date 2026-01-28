import Image from 'next/image';
import Link from 'next/link';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import UnitGallery from '@/components/UnitGallery';
import type { ProjectPageData } from '@/lib/projects-view';

type ProjectDetailLayoutProps = {
  data: ProjectPageData;
};

export default function ProjectDetailLayout({ data }: ProjectDetailLayoutProps) {
  const { project, heroImages, gallery, completionLabel, address, mapUrl, isStaticMap, units } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="bg-gray-50 pt-28 pb-16">
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

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)] lg:items-center">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.35em] text-gray-400">
                  {project.city || 'Austin'}, {project.state || 'Texas'}
                </p>
                <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{project.name}</h1>
                {address && <p className="mb-4 text-lg text-gray-600">{address}</p>}
                <p className="mb-6 text-lg font-medium text-gray-500">{completionLabel}</p>

                <div className="flex flex-wrap gap-3">
                  <div className="flex min-w-[140px] flex-1 items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Units</p>
                    <p className="text-lg font-semibold text-gray-900">{units.length}</p>
                  </div>
                  {project.total_units && project.total_units > units.length && (
                    <div className="flex min-w-[140px] flex-1 items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Total Planned</p>
                      <p className="text-lg font-semibold text-gray-900">{project.total_units}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <CTAButton href="/contact" size="md">
                    Contact Us
                  </CTAButton>
                  <CTAButton href="/contact" size="md" className="bg-gray-900 hover:bg-gray-800">
                    Investor Inquiries
                  </CTAButton>
                </div>
              </div>

              {/* Hero Image Strip */}
              <div className="relative">
                {heroImages.length > 0 ? (
                  <div className="flex h-[340px] w-full gap-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:h-[420px]">
                    {heroImages.slice(0, 4).map((image, index) => (
                      <div key={image.url} className="relative h-full flex-1 overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt || `${project.name} image ${index + 1}`}
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[340px] w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xl md:h-[420px]">
                    <span className="text-sm text-gray-500">No project imagery yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Project Overview */}
      <div className="bg-white py-16">
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
                <div className="grid gap-8 md:grid-cols-2">
                  {units.map((unit, index) => {
                    const isLastAndOdd = index === units.length - 1 && units.length % 2 === 1;
                    const unitSlug = unit.unitCode || unit.id;
                    const isSold = unit.availability.toLowerCase().includes('sold');

                    return (
                      <div
                        key={unit.id}
                        className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${
                          isLastAndOdd ? 'md:col-span-2 md:mx-auto md:max-w-[calc(50%-1rem)]' : ''
                        }`}
                      >
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Unit</p>
                            <h4 className="text-xl font-semibold text-gray-900">{unit.name}</h4>
                          </div>
                          <span
                            className={
                              isSold
                                ? 'rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white'
                                : 'rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'
                            }
                          >
                            {unit.availability}
                          </span>
                        </div>

                        {unit.heroImage && (
                          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <Image
                              src={unit.heroImage}
                              alt={`${unit.name} main`}
                              fill
                              sizes="(min-width: 1024px) 50vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                        )}

                        <p className="mb-3 text-gray-600">{unit.shortDescription || unit.details}</p>

                        <div className="mb-4 flex flex-wrap gap-2">
                          {unit.bedrooms !== null && (
                            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                              {unit.bedrooms} bed{unit.bedrooms === 1 ? '' : 's'}
                            </span>
                          )}
                          {unit.bathrooms !== null && (
                            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                              {unit.bathrooms} bath{unit.bathrooms === 1 ? '' : 's'}
                            </span>
                          )}
                          {unit.squareFeet !== null && (
                            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                              {unit.squareFeet.toLocaleString('en-US')} sqft
                            </span>
                          )}
                        </div>

                        {unit.formattedPrice && (
                          <p className="mb-4 text-lg font-semibold text-gray-900">{unit.formattedPrice}</p>
                        )}

                        <Link
                          href={`/units/${project.slug}/${unitSlug}`}
                          className="inline-flex text-sm font-semibold text-[#3b7d98] underline underline-offset-4 transition hover:text-[#2d5f75]"
                        >
                          View Unit Details →
                        </Link>
                      </div>
                    );
                  })}
                </div>
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
