'use client';

import CTAButton from './CTAButton';

type Props = {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc: string;
  className?: string;
  darkOverlay?: string;
  width?: string;
};

export default function HeroImage({
  title,
  subtitle,
  ctaText,
  ctaHref,
  imageSrc,
  className = 'h-[70svh] md:h-[85svh]',
  darkOverlay = 'bg-black/40',
  width = 'w-full',
}: Props) {
  return (
    <section className={`relative ${width} ${className} overflow-hidden mx-auto`}>
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      />

      <div className={`absolute inset-0 ${darkOverlay}`} />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-giga font-semibold mb-6 leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {ctaText && ctaHref && (
            <div className="mt-8">
              <CTAButton href={ctaHref} size="lg">
                {ctaText}
              </CTAButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



