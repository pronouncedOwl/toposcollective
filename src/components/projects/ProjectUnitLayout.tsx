import Image from 'next/image';
import Link from 'next/link';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import UnitGallery from '@/components/UnitGallery';
import type { ProjectUnitPageData } from '@/lib/projects-view';

type ProjectUnitLayoutProps = {
  data: ProjectUnitPageData;
  backHref: string;
  backLabel: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
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
  const { project, unit, heroImage, gallery, floorplanUrl, formattedPrice, stats, availability, address, mapUrl, isStaticMap } =
    data;
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
  const highlightItems =
    project.status === 'completed'
      ? [
          { label: 'Asking Price', value: formattedPrice ?? '-' },
          { label: 'Selling Price', value: soldPrice ?? '-' },
          { label: 'Expected Completion', value: expectedCompletion ?? '-' },
          { label: 'Actual Completion', value: actualCompletion ?? '-' },
          { label: 'Time on Market', value: timeOnMarket ? `${timeOnMarket} days` : '-' },
        ]
      : [
          { label: 'Unit Code', value: unit.unit_code || unit.id },
          { label: 'Project', value: project.name },
          { label: 'Availability', value: availability },
          { label: 'Location', value: project.city || 'Austin' },
        ];

  return (
    <div className="min-h-screen bg-white">
      <LazySection direction="fade" delay={0}>
        <div className="bg-gray-50 pt-28 pb-16">
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

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)] lg:items-center">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.35em] text-gray-400">
                  {project.city || 'Austin'}, {project.state || 'Texas'}
                </p>
                <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                  {unit.name || project.name}
                </h1>
                {address && <p className="mb-4 text-lg text-gray-600">{address}</p>}
                {formattedPrice ? (
                  <p className="mb-6 text-3xl font-semibold text-gray-900">{formattedPrice}</p>
                ) : (
                  <p className="mb-6 text-lg font-medium text-gray-600">Contact for pricing</p>
                )}

                <div className="flex flex-wrap gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex min-w-[140px] flex-1 items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
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

              <div className="relative">
                <div className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:h-[420px]">
                  {heroImage ? (
                    <Image src={heroImage} alt={`${unit.name} main`} fill sizes="100vw" className="object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                      No unit imagery yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      <div className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <LazySection direction="up" delay={120}>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr),minmax(0,0.8fr)]">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">Overview</p>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">Inside the residence</h2>
                <p className="text-lg text-gray-600">
                  {unit.long_description ||
                    unit.description ||
                    project.long_description ||
                    'Refined materials, natural light, and thoughtful spatial flow.'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-400">Highlights</p>
                <div className="space-y-3 text-gray-600">
                  {highlightItems.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between ${
                        index === highlightItems.length - 1 ? '' : 'border-b border-gray-200 pb-3'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-500">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

          {mapUrl && (
            <LazySection direction="up" delay={280}>
              <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8">
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
