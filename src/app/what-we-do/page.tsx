'use client';

import LazySection from '@/components/LazySection';
import Button from '@/components/Button';
import TestimonialCard from '@/components/TestimonialCard';
import FAQ from '@/components/FAQ';
import Image from 'next/image';

export default function WhatWeDoPage() {
  const faqs = [
    {
      question: "How long does each project take?",
      answer: "From acquisition to the final product closed and funded we project a 16 month timeline."
    },
    {
      question: "Are your homes already spoken for?",
      answer: "Topos Collective homes are developed to be listed and sold. Some homes will be pre-sold before completion. Please reach out to be the first to know about any new projects."
    },
    {
      question: "Do all of your new homes come with a warranty?",
      answer: "Yes. All new construction includes a 1-2-6 warranty. One year on workmanship and materials; coverage for two years on the delivery portion of systems (the wiring, piping, and ductwork in the electrical, plumbing, heating, cooling, ventilation, and mechanical systems); and coverage for 6 years on major structural defects."
    },
    {
      question: "Where do I submit my warranty claims?",
      answer: "Please follow instructions from your welcome email and submit your claim through info@toposcollective.com. If it is an emergency, dial 911."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="relative min-h-screen flex items-center bg-gray-800">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1920&h=1080"
              alt="Background"
              fill
              className="object-cover"
              style={{ filter: 'brightness(0.4) contrast(1.1)' }}
              priority
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 w-full pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-white uppercase tracking-wider mb-4">
                  What We Do
                </p>
                <h1 className="text-giga font-bold text-white mb-6">
                  Building Places To Call Home.
                </h1>
                <p className="text-lg text-gray-200 leading-relaxed mb-8">
                  ⚡ With planning, communication and commitment to excellence, we believe the hundreds of steps in the process of residential new construction can be done seamlessly and consistently in order to plan for a profit.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-bold text-white mb-2">Our Commitment</p>
                    <p className="text-gray-300 opacity-80">
                      Nothing matters more to us than our commitment to our vision and delivering on our commitments.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">Our Strengths</p>
                    <p className="text-gray-300 opacity-80">
                      Bringing concept to life strategically and efficiently.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-9 grid-rows-1 items-center gap-4">
                  {/* First Image - Pedernales */}
                  <div className="col-start-1 col-end-7 row-start-1">
                    <div className="relative">
                      <Image
                        src="/images/pedernales-front-2.jpeg"
                        alt="Pedernales Project"
                        width={400}
                        height={600}
                        className="w-full h-96 object-cover border-2 border-white"
                        style={{
                          borderTopLeftRadius: '200px',
                          borderTopRightRadius: '200px',
                          borderBottomLeftRadius: '12px',
                          borderBottomRightRadius: '12px'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Second Image - Richmond */}
                  <div className="col-start-5 col-end-10 row-start-1">
                    <div className="relative">
                      <Image
                        src="/images/richmond-project.jpg"
                        alt="Richmond Project"
                        width={400}
                        height={600}
                        className="w-full h-96 object-cover border-2 border-white"
                        style={{
                          borderTopLeftRadius: '400px',
                          borderTopRightRadius: '400px',
                          borderBottomLeftRadius: '12px',
                          borderBottomRightRadius: '12px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* What We Do Process Section */}
      <LazySection direction="fade" delay={200}>
        <div className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-giga font-bold text-gray-900 mb-8">
                What We Do
              </h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                We believe that the home should be all about the customer. For the past 24 years our team has been dedicated to building homes that exceed the customer&apos;s expectations. Eco-friendly design+materials, setting expectations, superior communication and timely delivery are required. We then provide expert guidance to make each projects a success.
              </p>
            </div>

            {/* Process Steps Grid */}
            <div className="space-y-8">
              {/* First Row */}
              <div className="grid md:grid-cols-3 gap-6">
                <LazySection direction="right" delay={300}>
                  <div className="h-full bg-gray-100 rounded-lg p-8">
                    <div className="mb-4">
                      <p className="text-xl text-[#3b7d98] font-light tracking-wider mb-2">01</p>
                      <p className="text-lg font-bold text-gray-900">Financial Analysis</p>
                    </div>
                    <div className="opacity-80">
                      <p className="text-gray-700"><span className="text-[#3b7d98] font-semibold">We find the deal and underwrite the opportunity.</span> Our comprehensive market analysis ensures every project delivers optimal returns for investors.</p>
                    </div>
                  </div>
                </LazySection>

                <LazySection direction="up" delay={400}>
                  <div className="h-full bg-white border border-gray-200 rounded-lg p-8">
                    <div className="mb-4">
                      <p className="text-xl text-[#3b7d98] font-light tracking-wider mb-2">02</p>
                      <p className="text-lg font-bold text-gray-900">Acquisition</p>
                    </div>
                    <div className="opacity-80">
                      <p className="text-gray-700"><span className="text-[#3b7d98] font-semibold">We acquire the property.</span> Strategic site selection and negotiation expertise secure prime locations for exceptional developments.</p>
                    </div>
                  </div>
                </LazySection>

                <LazySection direction="left" delay={500}>
                  <div className="h-full bg-gray-100 rounded-lg p-8">
                    <div className="mb-4">
                      <p className="text-xl text-[#3b7d98] font-light tracking-wider mb-2">03</p>
                      <p className="text-lg font-bold text-gray-900">Design</p>
                    </div>
                    <div className="opacity-80">
                      <p className="text-gray-700"><span className="text-[#3b7d98] font-semibold">We curate the end result.</span> Every design decision prioritizes sustainability, functionality, and the unique needs of Austin&apos;s growing communities.</p>
                    </div>
                  </div>
                </LazySection>
              </div>

              {/* Second Row */}
              <div className="grid md:grid-cols-3 gap-6">
                <LazySection direction="right" delay={600}>
                  <div className="h-full bg-white border border-gray-200 rounded-lg p-8">
                    <div className="mb-4">
                      <p className="text-xl text-[#3b7d98] font-light tracking-wider mb-2">04</p>
                      <p className="text-lg font-bold text-gray-900">Project Management</p>
                    </div>
                    <div className="opacity-80">
                      <p className="text-gray-700"><span className="text-[#3b7d98] font-semibold">We manage bringing the vision to life.</span> Our experienced team coordinates every detail to ensure seamless execution from concept to completion.</p>
                    </div>
                  </div>
                </LazySection>

                <LazySection direction="up" delay={700}>
                  <div className="h-full bg-gray-100 rounded-lg p-8">
                    <div className="mb-4">
                      <p className="text-xl text-[#3b7d98] font-light tracking-wider mb-2">05</p>
                      <p className="text-lg font-bold text-gray-900">Construction Management</p>
                    </div>
                    <div className="opacity-80">
                      <p className="text-gray-700"><span className="text-[#3b7d98] font-semibold">We build it.</span> Quality craftsmanship and eco-friendly materials create homes that exceed expectations while respecting our environment.</p>
                    </div>
                  </div>
                </LazySection>

                <LazySection direction="left" delay={800}>
                  <div className="h-full bg-white border border-gray-200 rounded-lg p-8">
                    <div className="mb-4">
                      <p className="text-xl text-[#3b7d98] font-light tracking-wider mb-2">06</p>
                      <p className="text-lg font-bold text-gray-900">Sales</p>
                    </div>
                    <div className="opacity-80">
                      <p className="text-gray-700"><span className="text-[#3b7d98] font-semibold">We market and sell the vision to our happy customers.</span> Our proven track record and transparent communication build lasting relationships with both buyers and investors.</p>
                    </div>
                  </div>
                </LazySection>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Testimonial Section */}
      <LazySection direction="fade" delay={900}>
        <div className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <TestimonialCard
              quote="Alan Avery went above and beyond and we're grateful."
              author="The Bonefioles"
              role="Client"
              imageSrc="https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg5fHxwZXJzb258ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&q=60&w=200&h=200&crop=face"
              imageAlt="The Bonefioles"
              stars="★★★★★"
            />
          </div>
        </div>
      </LazySection>

      {/* FAQ Section */}
      <LazySection direction="up" delay={1000}>
        <div className="py-20 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-giga font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
            </div>
            
            <FAQ faqs={faqs} />
          </div>
        </div>
      </LazySection>

      {/* Final CTA Section */}
      <LazySection direction="fade" delay={1200}>
        <div className="relative overflow-hidden rounded-lg border-t-8 border-[#3b7d98]">
          <div className="relative min-h-[400px] flex items-center bg-gray-800">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="https://toposcollective.com/wp-content/uploads/2024/04/742-Pedernales-kitchen.jpeg"
                alt="Pedernales Kitchen"
                fill
                className="object-cover"
                style={{ filter: 'brightness(0.5) contrast(1.1)' }}
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 w-full">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  {/* Left Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      We believe in meticulous attention to detail <br />so you can relax.
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-white">
                        <span className="text-[#3b7d98] font-bold mr-2">✓</span>
                        <span>Simplified investing</span>
                      </div>
                      <div className="flex items-center text-white">
                        <span className="text-[#3b7d98] font-bold mr-2">✓</span>
                        <span>Precision in organizing and delivering new construction projects</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content - Button */}
                  <div className="flex-shrink-0">
                    <Button
                      href="https://calendar.app.google/L5Qd8yhJA7yjfY7d6"
                      variant="primary"
                      size="lg"
                      className="bg-[#3b7d98] hover:bg-[#2d5f75] text-white px-8 py-4"
                    >
                      Schedule a consultation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>
    </div>
  );
}
