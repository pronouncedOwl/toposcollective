'use client';

import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function LazySection({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}: LazySectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  const getTransformClass = () => {
    if (!isIntersecting) {
      switch (direction) {
        case 'up':
          return 'translate-y-8';
        case 'down':
          return '-translate-y-8';
        case 'left':
          return 'translate-x-8';
        case 'right':
          return '-translate-x-8';
        case 'fade':
        default:
          return '';
      }
    }
    return '';
  };

  const getOpacityClass = () => {
    return isIntersecting ? 'opacity-100' : 'opacity-0';
  };

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${getTransformClass()}
        ${getOpacityClass()}
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}



