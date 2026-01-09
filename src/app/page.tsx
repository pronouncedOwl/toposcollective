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
          imageSrc="/images/header-image.jpg"
          className="h-screen pt-24"
          darkOverlay="bg-black/50"
        />
      </LazySection>

      {/* Services Section */}
      <LazySection direction="up" delay={300}>
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            {/* Quote Section with Pill */}
            <LazySection direction="fade" delay={100}>
              <div className="max-w-4xl mx-auto mb-12">
                {/* Gray Pill */}
                <div className="flex justify-start mb-8">
                  <div className="rounded-full bg-gray-200 px-4 py-1.5">
                    <p className="text-sm font-medium" style={{ color: '#3b7d98' }}>
                      TOPOS • FROM ANCIENT GREEK ΤΌΠΟΣ (TÓPOS, &ldquo;PLACE&rdquo;)
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
                    &ldquo;Oh, the Places You&rsquo;ll Go&rdquo;
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">– Dr. Seuss</p>
                </div>
              </div>
            </LazySection>
            
            <LazySection direction="fade" delay={200}>
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
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">Residential New Construction</h3>
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
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">Exceptional Outdoor Spaces</h3>
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
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900">Outsized Returns</h3>
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
              <h2 className="text-giga font-semibold mb-12 text-center text-gray-900">How We Work</h2>
            </LazySection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <LazySection direction="right" delay={200}>
                <div className="text-center">
                  <p className="text-4xl text-[#3b7d98] mb-6" style={{fontStyle: 'normal', fontWeight: '300', letterSpacing: '2px'}}>01</p>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Conception</h3>
                  <p className="text-gray-600">
                    We complete due diligence, underwriting and design to create a customized conception plan to achieve integrity of space and profitability.
                  </p>
                </div>
              </LazySection>

              <LazySection direction="up" delay={300}>
                <div className="text-center">
                  <p className="text-4xl text-[#3b7d98] mb-6" style={{fontStyle: 'normal', fontWeight: '300', letterSpacing: '2px'}}>02</p>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Execution</h3>
                  <p className="text-gray-600">
                    We work to ensure the project is managed efficiently and construction is executed in a timely manner to achieve the best possible end product.
                  </p>
                </div>
              </LazySection>

              <LazySection direction="left" delay={400}>
                <div className="text-center">
                  <p className="text-4xl text-[#3b7d98] mb-6" style={{fontStyle: 'normal', fontWeight: '300', letterSpacing: '2px'}}>03</p>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Delivery</h3>
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
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <LazySection direction="right" delay={200}>
                <div>
                  <h2 className="text-lg font-medium mb-6" style={{ color: '#3b7d98' }}>
                    SUCCESS
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-900">
                    Proven track record of successfully built homes for over 20 years
                  </h3>
                  
                  {/* Stats Box */}
                  <div className="bg-white rounded-lg border border-gray-300 p-6 mb-8 shadow-sm">
                    <div className="flex">
                      {/* Left Section */}
                      <div className="flex-1 pr-6">
                        <div className="mb-2">
                          <div className="text-4xl font-semibold" style={{ color: '#3b7d98' }}>
                            120k+
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Square Feet Built</h4>
                        </div>
                      </div>
                      
                      {/* Vertical Separator */}
                      <div className="w-px bg-gray-300 mx-6"></div>
                      
                      {/* Right Section */}
                      <div className="flex-1 pl-6">
                        <div className="mb-2">
                          <div className="text-4xl font-semibold" style={{ color: '#3b7d98' }}>
                            20+
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Years</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Our Story Button */}
                  <CTAButton href="/about" size="lg" className="bg-[#3b7d98] hover:bg-[#2d5f75] text-white !font-medium">
                    Our Story
                  </CTAButton>
                </div>
              </LazySection>

              {/* Right Column - Image */}
              <LazySection direction="left" delay={300}>
                <div className="relative">
                  <Image
                    src="/images/success-section.jpg"
                    alt="Success"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-xl object-cover"
                    style={{ aspectRatio: '4/3' }}
                  />
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
              {/* Image Column - Now Left */}
              <LazySection direction="right" delay={100}>
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

              {/* Text Column - Now Right */}
              <LazySection direction="left" delay={200}>
                <div>
                  <h2 className="text-giga font-semibold mb-6 text-gray-900">Our Story</h2>
                  <h3 className="text-lg font-medium mb-6" style={{ color: '#3b7d98' }}>Who are we</h3>
                  <p className="text-xl text-gray-600 mb-8">
                    People with a passion for building exceptional places
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="text-2xl text-gray-900 mr-3">✓</div>
                      <h4 className="text-lg font-medium text-gray-900">Experienced Builders</h4>
                    </div>
                    <div className="flex items-center">
                      <div className="text-2xl text-gray-900 mr-3">✓</div>
                      <h4 className="text-lg font-medium text-gray-900">Beautifully designed projects</h4>
                    </div>
                  </div>

                  <CTAButton href="/team" size="lg">
                    Meet Our Team
                  </CTAButton>
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
            <h2 className="text-giga font-semibold mb-8">
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