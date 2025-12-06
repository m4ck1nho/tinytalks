'use client';

import { useEffect } from 'react';

export function AnalyticsClient() {
  useEffect(() => {
    // Initialize Google Analytics if available
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (measurementId && typeof window !== 'undefined') {
      try {
        // Dynamically import react-ga4 only when needed
        import('react-ga4').then((ReactGA) => {
          ReactGA.default.initialize(measurementId);
          ReactGA.default.send({ hitType: 'pageview', page: window.location.pathname });
        });
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.startsWith('#') ? hash.slice(1) : hash;
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  return null;
}

