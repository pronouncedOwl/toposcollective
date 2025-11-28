'use client';

import Image from 'next/image';

interface TeamMemberProfileProps {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    authorImage: string;
  };
  imagePosition?: 'left' | 'right';
  className?: string;
}

export default function TeamMemberProfile({
  name,
  title,
  description,
  imageSrc,
  imageAlt,
  testimonial,
  imagePosition = 'left',
  className = ""
}: TeamMemberProfileProps) {
  return (
    <div className={`bg-white py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`grid md:grid-cols-2 gap-8 items-center ${imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
          {/* Image Column */}
          <div className={`${imagePosition === 'right' ? 'md:order-2' : ''}`}>
            <div className="relative">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={683}
                height={1024}
                className="w-3/4 h-auto object-cover rounded-lg mx-auto"
                style={{ aspectRatio: '2/3' }}
              />
            </div>
          </div>

          {/* Content Column */}
          <div className={`${imagePosition === 'right' ? 'md:order-1' : ''} p-6 md:p-0`}>
            <div className="space-y-6">
              {/* Title and Name */}
              <div>
                <p className="text-sm text-[#3b7d98] font-medium tracking-wider uppercase mb-2">
                  {title}
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {name}
                </h2>
              </div>

              {/* Description */}
              <div className="opacity-80">
                <p className="text-gray-700 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Separator */}
              <hr className="border-gray-200" />

              {/* Testimonial */}
              <div className="space-y-4">
                <div>
                  <h6 className="text-lg font-bold text-gray-900 leading-relaxed">
                    "{testimonial.quote}"
                  </h6>
                </div>

                {/* Testimonial Author */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={testimonial.authorImage}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      style={{ aspectRatio: '1/1' }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      <em>{testimonial.author}</em>
                    </p>
                    <p className="text-gray-400">/</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-yellow-400 text-lg tracking-wider">★★★★★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
