'use client';

import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="pt-32 pb-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-giga font-bold text-gray-900 mb-6">
                Investors Welcome
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8">
                Become a Topos Collective Investor Partner
              </h2>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Content Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <LazySection direction="up" delay={100}>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                At Topos Collective, our ability to guide every aspect of the development process makes us the perfect partner to deliver the vision and earn a return on your investment.
              </p>
              
              <p>
                We prioritize creating projects that are not only high-quality and market-aware but also socially responsible, reflecting our dedication to building long-lasting relationships.
              </p>
              
              <p>
                When you invest with us, you&apos;re joining a collective that values long-term success, rooted in trust and collaboration. Together, we craft enduring value, driven by our shared commitment to excellence and meaningful partnerships.
              </p>
            </div>
          </LazySection>
        </div>
      </div>

      {/* Investment Structure Section */}
      <LazySection direction="up" delay={200}>
        <div className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Investment Structure
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Project Size */}
              <LazySection direction="up" delay={300}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Project Size
                  </h3>
                  <div className="h-px bg-gray-300 mb-6"></div>
                  <p className="text-2xl font-bold text-[#3b7d98]">
                    $1M – 5M+
                  </p>
                </div>
              </LazySection>

              {/* Target IRR */}
              <LazySection direction="up" delay={400}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Target IRR
                  </h3>
                  <div className="h-px bg-gray-300 mb-6"></div>
                  <p className="text-2xl font-bold text-[#3b7d98]">
                    17%+
                  </p>
                </div>
              </LazySection>

              {/* Project Duration */}
              <LazySection direction="up" delay={500}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Project Duration
                  </h3>
                  <div className="h-px bg-gray-300 mb-6"></div>
                  <p className="text-2xl font-bold text-[#3b7d98]">
                    15 – 24 Months
                  </p>
                </div>
              </LazySection>
            </div>

            <LazySection direction="fade" delay={600}>
              <p className="text-center text-gray-600 italic">
                Project details, capital needs and returns can vary widely.
              </p>
            </LazySection>
          </div>
        </div>
      </LazySection>

      {/* CTA Section */}
      <LazySection direction="up" delay={700}>
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <CTAButton href="/contact" size="lg">
              Get Started
            </CTAButton>
          </div>
        </div>
      </LazySection>
    </div>
  );
}

