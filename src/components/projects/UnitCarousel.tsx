'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectPageData } from '@/lib/projects-view';

const truncateDescription = (text: string, maxWords: number = 25): string => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

type UnitCarouselProps = {
  units: ProjectPageData['units'];
  projectSlug: string;
  projectName: string;
};

export default function UnitCarousel({ units, projectSlug, projectName }: UnitCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const unitsPerView = 3;
  const maxIndex = Math.max(0, units.length - unitsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - unitsPerView));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + unitsPerView));
  };

  const visibleUnits = units.slice(currentIndex, currentIndex + unitsPerView);
  const endIndex = Math.min(currentIndex + unitsPerView, units.length);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleUnits.map((unit) => {
          const unitSlug = unit.unitCode || unit.id;
          const isSold = unit.availability.toLowerCase().includes('sold');

          return (
            <div
              key={unit.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Unit</p>
                  <h4 className="text-xl font-semibold text-gray-900">{unit.name}</h4>
                </div>
                <span
                  className={
                    isSold
                      ? 'rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white'
                      : 'rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'
                  }
                >
                  {unit.availability}
                </span>
              </div>

              {(unit.bedrooms !== null || unit.bathrooms !== null || unit.squareFeet !== null) && (
                <p className="mb-2 text-xs text-gray-500">
                  {[
                    unit.bedrooms !== null ? `${unit.bedrooms} bd` : null,
                    unit.bathrooms !== null ? `${unit.bathrooms} ba` : null,
                    unit.squareFeet !== null ? `${unit.squareFeet.toLocaleString('en-US')} sqft` : null,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              )}

              {unit.heroImage && (
                <div className="relative mb-4 mx-auto h-[230px] w-4/5 overflow-hidden rounded-2xl border border-[#3b7d98]/75 bg-gray-100 shadow-sm">
                  <Image
                    src={unit.heroImage}
                    alt={`${unit.name} main`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 80vw"
                    className="object-contain object-center rounded-2xl"
                  />
                </div>
              )}

              {unit.formattedPrice && (
                <p className="mb-4 text-lg font-semibold text-gray-900">{unit.formattedPrice}</p>
              )}

              <Link
                href={`/units/${projectSlug}/${unitSlug}`}
                className="inline-flex text-sm font-semibold text-[#3b7d98] underline underline-offset-4 transition hover:text-[#2d5f75]"
              >
                View Unit Details →
              </Link>
            </div>
          );
        })}
      </div>

      {units.length > unitsPerView && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ◀ Prev
          </button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1}-{endIndex} of {units.length}
          </span>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
