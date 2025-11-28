'use client';

import LazySection from '@/components/LazySection';
import Button from '@/components/Button';
import TestimonialCard from '@/components/TestimonialCard';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="py-20 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-giga font-bold text-gray-900 mb-6">
                About us.
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Our development team is highly experienced and well-versed in residential construction and financial management. You can trust our expertise to achieve the best outcome in each project.
              </p>
              <Button
                href="/team"
                variant="primary"
                size="lg"
                className="bg-[#3b7d98] hover:bg-[#2d5f75]"
              >
                Meet Our Team
              </Button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src="/images/about-story.jpg"
                  alt="Modern House Exterior"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="relative">
                <Image
                  src="/images/project-image.jpg"
                  alt="Modern Interior Design"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Testimonial Section */}
      <LazySection direction="up" delay={200}>
        <div className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <TestimonialCard
              quote="Alan Avery and his team are very efficient, excellent problem solvers, and great team players… I would highly recommend Alan and his team for any and every project that they chose to build."
              author="Jack"
              role="Trade Partner"
              imageSrc="https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTg5fHxwZXJzb258ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&q=60&w=200&h=200&crop=face"
              imageAlt="Jack"
              stars="★★★★★"
            />
          </div>
        </div>
      </LazySection>

      {/* It Starts With Why Section */}
      <LazySection direction="up" delay={400}>
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-giga font-bold text-gray-900 mb-8">
              It Starts With Why?
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                A passion for our home, Austin, Texas, and shaping its future for our people.
              </p>
              
              <p>
                We at Topos Collective are crafting exceptional homes while remaining dedicated to building vibrant communities in Austin, Texas. Founded with a vision to make a meaningful impact, we strive to create neighborhoods where people thrive and families flourish. Our commitment extends beyond constructing houses; it's about fostering a sense of belonging and enhancing the quality of life for all. By prioritizing density and compressing costs without compromising quality, we aim to make homeownership attainable for more individuals and families in the Austin area in the long run.
              </p>
              
              <p>
                At Topos Collective, we understand the importance of delivering value, not only to our homeowners but also to our investors. Together, we're building more than just homes; we're building a legacy of positive change in our community.
              </p>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Logo Section */}
      <LazySection direction="up" delay={600}>
        <div className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              <div className="flex justify-center">
                <Image
                  src="/images/favicon-logo.png"
                  alt="Topos Collective Logo"
                  width={141}
                  height={141}
                  className="h-auto max-w-[141px]"
                />
              </div>
              
              <div className="flex justify-center">
                <Image
                  src="/images/logo-1.png"
                  alt="Partner Logo 1"
                  width={213}
                  height={107}
                  className="h-auto max-w-[213px]"
                />
              </div>
              
              <div className="flex justify-center">
                <Image
                  src="/images/logo-2.png"
                  alt="Partner Logo 2"
                  width={147}
                  height={147}
                  className="h-auto max-w-[147px]"
                />
              </div>
              
              <div className="flex justify-center">
                <Image
                  src="/images/logo-3.png"
                  alt="Partner Logo 3"
                  width={291}
                  height={58}
                  className="h-auto max-w-[291px]"
                />
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Topos Collective Name Section */}
      <LazySection direction="up" delay={800}>
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-giga font-bold text-gray-900 text-center mb-12">
              Topos Collective
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed opacity-80">
              <p className="text-center text-xl">
                What's in a name?
              </p>
              
              <p className="text-center italic">
                From Ancient Greek topos means "place".
              </p>
              
              <p>
                In simple terms, "Topos" refers to a place or location. A topos in topology is a way of studying and categorizing spaces, which are mathematical objects that capture the idea of "shape" or "structure."
              </p>
              
              <p>
                Topos theory, or Topology, is a branch of mathematics that provides a framework for understanding and comparing different kinds of spaces. The study of geometric properties and spatial relations unaffected by the continuous change of shape or size of figures. The way the parts of something are organized or connected
              </p>
              
              <p>
                A family of open subsets of an abstract space such that the union and the intersection of any two of them are members of the family, and which includes the space itself and the empty set. A topological space is a set endowed with a structure, called a topology, which allows defining continuous deformation of subspaces, and, more generally, all kinds of continuity.
              </p>
              
              <p className="text-center italic">
                Yeah that's right. We just nerded out that hard.
              </p>
              
              <p>
                Topos Collective, a real estate development company, derives its name from the principles of topology, emphasizing the transformative power of spatial relationships and connectivity. With a commitment to creating harmonious and interconnected living spaces, Topos Collective pioneers innovative designs that seamlessly blend aesthetics, functionality, and community dynamics in our developments.
              </p>
              
              <p>
                Guided by the belief that each "Topos" signifies a unique place, the company employs the theory of topology as a guiding framework in designing and constructing their developments. Topos Collective meticulously applies these principles to craft environments that not only reflect aesthetic excellence but also maximize the potential for community cohesion and sustainable living.
              </p>
            </div>
          </div>
        </div>
      </LazySection>


      {/* Our Amazing Team Section */}
      <LazySection direction="up" delay={800}>
        <div className="py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-giga font-bold text-white mb-8">
                Our Amazing Team
              </h2>
              
              <div className="max-w-3xl mx-auto mb-8 opacity-80">
                <p className="text-center text-lg">
                  Our founders are highly experienced and well-versed in construction, real estate, financial analysis and operations. Trust in our expertise to achieve the best outcome for each project.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button
                  href="/careers"
                  variant="primary"
                  size="lg"
                  className="bg-[#3b7d98] hover:bg-[#2d5f75]"
                >
                  View Open Positions
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {/* Alan Avery */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/alan-avery.png"
                    alt="Alan Avery"
                    width={800}
                    height={600}
                    className="w-full h-64 object-cover border-b-4 border-[#3b7d98]"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4">
                    <p className="text-sm opacity-80">Founder</p>
                    <p className="text-lg font-semibold text-[#3b7d98]">Alan Avery</p>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Experience and success in construction and development.
                  </p>
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/averybuildingcompany/" className="text-white hover:text-[#3b7d98] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/alan-a-avery-095016b/" className="text-white hover:text-[#3b7d98] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Michelle Mullins */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/michelle-mullins.jpg"
                    alt="Michelle Mullins"
                    width={800}
                    height={600}
                    className="w-full h-64 object-cover border-b-4 border-[#3b7d98]"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4">
                    <p className="text-sm opacity-80">Founder</p>
                    <p className="text-lg font-semibold text-[#3b7d98]">Michelle Mullins</p>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Construction and project management success driven by impact on people and community.
                  </p>
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/michmull11/" className="text-white hover:text-[#3b7d98] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/michelle-mullins-crpm-2b139066/" className="text-white hover:text-[#3b7d98] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Katie Showell */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/katie-showell.png"
                    alt="Katie Showell"
                    width={800}
                    height={600}
                    className="w-full h-64 object-cover border-b-4 border-[#3b7d98]"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4">
                    <p className="text-sm opacity-80">Founder</p>
                    <p className="text-lg font-semibold text-[#3b7d98]">Katie Showell</p>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Operations, finance, and real estate success from billion dollar corporate companies to startups.
                  </p>
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/katie.showell/" className="text-white hover:text-[#3b7d98] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/katieashlynshowell/" className="text-white hover:text-[#3b7d98] transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"/>
                      </svg>
                    </a>
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
