import Image from 'next/image';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import { getPublicProjectsByStatus, PublicProject } from '@/lib/projects-public';

const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const formatAddress = (project: PublicProject) => {
  const segments = [project.address_line1, project.city, project.state, project.postal_code].filter(Boolean);
  return segments.join(', ');
};

const formatUnitLabel = (project: PublicProject) => {
  const count = project.units?.length || project.total_units;
  if (!count) return 'Residences coming soon';
  const suffix = count === 1 ? 'Residence' : 'Residences';
  return `${count} ${suffix} in progress`;
};

const formatCompletionLabel = (project: PublicProject) => {
  const date = project.estimated_completion;
  if (!date) return 'Completion date to be announced';
  const friendly = new Date(date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
  return `Estimated Completion – ${friendly}`;
};

const getStaticMapUrl = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const size = '600x400';
  const zoom = '16';

  if (mapsApiKey) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${size}&markers=color:0x3b7d98|${encodedAddress}&key=${mapsApiKey}`;
  }

  return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
};

export default async function ComingSoonPage() {
  const projects = await getPublicProjectsByStatus('coming_soon');

  return (
    <div className="min-h-screen bg-white">
      <LazySection direction="fade" delay={0}>
        <div className="pt-32 pb-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <p className="mb-4 text-xl text-gray-600">In Progress</p>
              <h1 className="mb-6 text-giga font-bold text-gray-900">Projects Coming Soon</h1>
            </div>
          </div>
        </div>
      </LazySection>

      <div className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-16">
            {projects.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-lg text-gray-500">
                New residences are being designed. Check back soon for fresh announcements.
              </div>
            )}

            {projects.map((project, index) => {
              const address = formatAddress(project);
              const mapUrl = getStaticMapUrl(address);
              const isStaticMap = Boolean(mapsApiKey);

              return (
                <LazySection key={project.id} direction="up" delay={index * 120}>
                  <div className="border-b border-gray-200 pb-12 last:border-b-0">
                    <div className="grid items-start gap-8 md:grid-cols-2">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{project.city || 'Austin'}</p>
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">{project.name}</h2>
                        <p className="mb-2 text-xl text-gray-600">{formatUnitLabel(project)}</p>
                        <p className="text-lg text-gray-500">{formatCompletionLabel(project)}</p>
                      </div>
                      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-200 shadow-lg">
                        {isStaticMap ? (
                          <Image src={mapUrl} alt={`Map of ${project.name}`} fill className="object-cover" unoptimized />
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
                  </div>
                </LazySection>
              );
            })}
          </div>
        </div>
      </div>

      <LazySection direction="up" delay={400}>
        <div className="bg-gray-50 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Interested in Our Upcoming Projects?</h2>
            <p className="mb-8 text-lg text-gray-600">Building places you want to be.</p>
            <CTAButton href="/contact" size="lg">
              Contact Us
            </CTAButton>
          </div>
        </div>
      </LazySection>
    </div>
  );
}
