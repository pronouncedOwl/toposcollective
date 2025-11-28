'use client';
import { useEffect, useState } from 'react';

// Turnstile options interface
interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  tabindex?: number;
  language?: string;
  [key: string]: unknown;
}

// Extend Window interface for Turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
    };
    turnstileLoaded?: boolean;
  }
}

interface TurnstileProviderProps {
  children: React.ReactNode;
}

export default function TurnstileProvider({ children }: TurnstileProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if Turnstile is already loaded
      if (window.turnstile && window.turnstileLoaded) {
        return;
      }

      // Check if script is already in the document
      const existingScript = document.querySelector('script[src*="turnstile"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.turnstileLoaded = true;
        };
        document.head.appendChild(script);
      } else {
        // Script exists but might not be loaded yet
        const checkTurnstile = () => {
          if (window.turnstile) {
            window.turnstileLoaded = true;
          } else {
            setTimeout(checkTurnstile, 100);
          }
        };
        checkTurnstile();
      }
    }
  }, []);

  return <>{children}</>;
}

// Hook to use Turnstile
export function useTurnstile() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkTurnstile = () => {
      if (window.turnstile && window.turnstileLoaded) {
        setIsReady(true);
      } else {
        setTimeout(checkTurnstile, 100);
      }
    };
    checkTurnstile();
  }, []);

  return { isReady };
}

