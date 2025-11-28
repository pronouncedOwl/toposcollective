'use client';

import Image from 'next/image';
import LazySection from '@/components/LazySection';
import CTAButton from '@/components/CTAButton';
import HeroImage from '@/components/HeroImage';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={100}>
        <HeroImage
          title="Taking you to Exceptional Places"
          subtitle="Topos • From Ancient Greek τόπος (tópos, 'place')"
          imageSrc="/images/header-image.jpg"
          className="h-screen pt-24"
          darkOverlay="bg-black/50"
        />
      </LazySection>

      {/* Quote Section */}
      <LazySection direction="up" delay={200}>
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              &ldquo;Oh, the Places You&rsquo;ll Go&rdquo;
            </h2>
            <p className="text-lg text-gray-600">– Dr. Seuss</p>
          </div>
        </div>
      </LazySection>

      {/* Services Section */}
      <LazySection direction="up" delay={300}>
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <LazySection direction="fade" delay={100}>
              <div className="text-center mb-12">
                <p className="text-lg text-gray-600 mb-8">
                  As a first-choice developer within our sector, our professional process applies techniques from a variety of business and construction disciplines.
                </p>
              </div>
            </LazySection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <LazySection direction="right" delay={200}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src="/images/residential-construction.jpg"
                      alt="Residential New Construction - Modern Kitchen"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Residential New Construction</h3>
                    <p className="text-gray-600">
                      Discover timeless elegance and modern comfort in our meticulously crafted residential new construction homes, where every detail is thoughtfully designed to exceed your expectations.
                    </p>
                  </div>
                </div>
              </LazySection>

              <LazySection direction="up" delay={300}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src="/images/outdoor-spaces.jpg"
                      alt="Exceptional Outdoor Spaces - Backyard Design"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Exceptional Outdoor Spaces</h3>
                    <p className="text-gray-600">
                      Experience the seamless fusion of nature and architecture in our outdoor spaces, where lush landscapes and thoughtfully designed amenities provide an oasis of tranquility for every homeowner.
                    </p>
                  </div>
                </div>
              </LazySection>

              <LazySection direction="left" delay={400}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src="/images/outsized-returns.jpg"
                      alt="Outsized Returns - Financial Success"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Outsized Returns</h3>
                    <p className="text-gray-600">
                      Strategic insights, thoughtful decisions, and impeccable timing converge to elevate financial success far beyond expectations.
                    </p>
                  </div>
                </div>
              </LazySection>
            </div>
          </div>
        </div>
      </LazySection>

      {/* How We Work Section */}
      <LazySection direction="up" delay={400}>
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <LazySection direction="fade" delay={100}>
              <h2 className="text-giga font-bold mb-12 text-center text-gray-900">How We Work</h2>
            </LazySection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <LazySection direction="right" delay={200}>
                <div className="text-center">
                  <p className="text-4xl text-[#3b7d98] mb-6" style={{fontStyle: 'normal', fontWeight: '300', letterSpacing: '2px'}}>01</p>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Conception</h3>
                  <p className="text-gray-600">
                    We complete due diligence, underwriting and design to create a customized conception plan to achieve integrity of space and profitability.
                  </p>
                </div>
              </LazySection>

              <LazySection direction="up" delay={300}>
                <div className="text-center">
                  <p className="text-4xl text-[#3b7d98] mb-6" style={{fontStyle: 'normal', fontWeight: '300', letterSpacing: '2px'}}>02</p>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Execution</h3>
                  <p className="text-gray-600">
                    We work to ensure the project is managed efficiently and construction is executed in a timely manner to achieve the best possible end product.
                  </p>
                </div>
              </LazySection>

              <LazySection direction="left" delay={400}>
                <div className="text-center">
                  <p className="text-4xl text-[#3b7d98] mb-6" style={{fontStyle: 'normal', fontWeight: '300', letterSpacing: '2px'}}>03</p>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Delivery</h3>
                  <p className="text-gray-600">
                    We deliver the product to market to achieve the highest return in the shortest amount of time to achieve the project&rsquo;s financial goals.
                  </p>
                </div>
              </LazySection>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Success Section */}
      <LazySection direction="up" delay={500}>
        <div className="relative py-20 bg-gray-900 text-white">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('/images/success-section.jpg')`,
            }}
          />
          
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <LazySection direction="fade" delay={100}>
              <h2 className="text-giga font-bold mb-8 text-center">Success</h2>
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-300">
                Proven track record of successfully built homes for over 20 years
              </h3>
            </LazySection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <LazySection direction="right" delay={200}>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-400 mb-4">120k+</div>
                  <h4 className="text-xl font-semibold mb-2">Square Feet Built</h4>
                </div>
              </LazySection>

              <LazySection direction="left" delay={300}>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-400 mb-4">20+</div>
                  <h4 className="text-xl font-semibold mb-2">Years</h4>
                </div>
              </LazySection>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Our Story Section */}
      <LazySection direction="up" delay={600}>
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <LazySection direction="right" delay={100}>
                <div>
                  <h2 className="text-giga font-bold mb-6 text-gray-900">Our Story</h2>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-700">Who are we</h3>
                  <p className="text-xl text-gray-600 mb-8">
                    People with a passion for building exceptional places
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="text-2xl text-green-500 mr-3">✓</div>
                      <h4 className="text-lg font-semibold text-gray-900">Experienced Builders</h4>
                    </div>
                    <div className="flex items-center">
                      <div className="text-2xl text-green-500 mr-3">✓</div>
                      <h4 className="text-lg font-semibold text-gray-900">Beautifully designed projects</h4>
                    </div>
                  </div>

                  <CTAButton href="/team" size="lg">
                    Meet Our Team
                  </CTAButton>
                </div>
              </LazySection>

              <LazySection direction="left" delay={200}>
                <div className="relative">
                  <Image
                    src="/images/team-image.jpg"
                    alt="Topos Collective Team"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl w-full h-auto"
                  />
                </div>
              </LazySection>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Final CTA */}
      <LazySection direction="up" delay={800}>
        <div className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-giga font-bold mb-8">
              Building places you want to be.
            </h2>
            <CTAButton href="/contact" size="lg">
              Get Started
            </CTAButton>
          </div>
        </div>
      </LazySection>
    </div>
  );
}