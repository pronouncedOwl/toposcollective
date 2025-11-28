'use client';

import Image from 'next/image';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';

interface Project {
  id: string;
  name: string;
  address: string;
  units: string;
  completionDate: string;
}

export default function ComingSoonPage() {
  const getMapUrl = (address: string) => {
    // Google Maps Static API - requires API key for production
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const size = '400x300';
    const zoom = '16';
    
    if (apiKey) {
      // Use Static Maps API for image
      return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${size}&markers=color:0x3b7d98|${encodedAddress}&key=${apiKey}`;
    }
    
    // Fallback: Use Google Maps search URL for iframe embed
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.0!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDE2JzAyLjAiTiA5N8KwNDQnMzUuMiJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&q=${encodedAddress}`;
  };

  const getMapEmbedUrl = (address: string) => {
    // Google Maps embed URL - works without API key
    const encodedAddress = encodeURIComponent(address);
    // Using the standard Google Maps embed format
    return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  const projects: Project[] = [
    {
      id: '404-w-55th-half-st',
      name: '404 W 55th Half St',
      address: '404 W 55th Half St, Austin, TX',
      units: '1 Unit Coming Soon',
      completionDate: 'Estimated Completion – Jan 2026',
    },
    {
      id: '901-shady-lane',
      name: '901 Shady Lane',
      address: '901 Shady Lane, Austin, TX',
      units: '2 Units Coming Soon',
      completionDate: 'Estimated Completion – March 2026',
    },
    {
      id: '5106-glissman',
      name: '5106 Glissman',
      address: '5106 Glissman, Austin, TX',
      units: '2 Units Coming Soon',
      completionDate: 'Estimated Completion – March 2026',
    },
    {
      id: '703-orland-blvd',
      name: '703 Orland Blvd',
      address: '703 Orland Blvd, Austin, TX',
      units: '3 Units Coming Soon',
      completionDate: 'Estimated Completion – May 2026',
    },
    {
      id: '1174-oak-grove-ave',
      name: '1174 Oak Grove Ave',
      address: '1174 Oak Grove Ave, Austin, TX',
      units: '3 Unit Coming Soon',
      completionDate: 'Estimated Completion – June 2026',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="pt-32 pb-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-4">In Progress</p>
              <h1 className="text-giga font-bold text-gray-900 mb-6">
                Projects Coming Soon
              </h1>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Projects List */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-16">
            {projects.map((project, projectIndex) => (
              <LazySection key={project.id} direction="up" delay={projectIndex * 100}>
                <div className="border-b border-gray-200 pb-12 last:border-b-0">
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {project.name}
                      </h2>
                      <p className="text-xl text-gray-600 mb-2">{project.units}</p>
                      <p className="text-lg text-gray-500">{project.completionDate}</p>
                    </div>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg bg-gray-200">
                      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        <Image
                          src={getMapUrl(project.address)}
                          alt={`Map of ${project.name}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <iframe
                          src={getMapEmbedUrl(project.address)}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                          title={`Map of ${project.name}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </LazySection>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <LazySection direction="up" delay={400}>
        <div className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Interested in Our Upcoming Projects?
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
    </div>
  );
}
