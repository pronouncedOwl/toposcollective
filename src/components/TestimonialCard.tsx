'use client';

import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  stars?: string;
  className?: string;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  imageSrc,
  imageAlt,
  stars = "★★★★★",
  className = ""
}: TestimonialCardProps) {
  return (
    <div className={`bg-gray-900 text-white p-2 rounded-lg ${className}`}>
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Stars */}
        <p className="text-yellow-400 text-lg tracking-wider">
          {stars}
        </p>
        
        {/* Quote */}
        <div className="max-w-2xl">
          <p className="text-xl text-gray-200 leading-relaxed">
            "{quote}"
          </p>
        </div>
        
        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={40}
              height={40}
              className="rounded-full object-cover"
              style={{ aspectRatio: '1/1' }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold text-white">
              <em>{author}</em>
            </p>
            <p className="text-gray-400">/</p>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
