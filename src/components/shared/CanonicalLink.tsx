'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BASE_URL = 'https://www.tinytalks.pro';

// Pages that should NOT have canonical tags (admin, dashboard, auth - noindex pages)
const EXCLUDED_PATHS = ['/admin', '/dashboard', '/auth'];

export default function CanonicalLink() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip canonical link for admin, dashboard, and auth pages (these are noindex)
    const isExcluded = EXCLUDED_PATHS.some(path => pathname.startsWith(path));
    if (isExcluded) {
      return;
    }

    // Remove any existing canonical links we might have added
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach((link) => {
      // Only remove if it's not from Next.js metadata (which should be in head from server)
      const href = link.getAttribute('href');
      if (href && !href.startsWith(BASE_URL)) {
        link.remove();
      }
    });

    // Ensure canonical URL is correct
    const canonicalUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
    
    // Check if canonical already exists with correct URL
    const existingCanonical = document.querySelector(`link[rel="canonical"][href="${canonicalUrl}"]`);
    
    if (!existingCanonical) {
      // Remove any incorrect canonicals first
      document.querySelectorAll('link[rel="canonical"]').forEach((link) => {
        if (link.getAttribute('href') !== canonicalUrl) {
          link.remove();
        }
      });

      // Add/update canonical link
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonicalUrl;
      
      // Insert at the beginning of head for priority
      const head = document.head;
      const firstChild = head.firstChild;
      if (firstChild) {
        head.insertBefore(link, firstChild);
      } else {
        head.appendChild(link);
      }
    }
  }, [pathname]);

  return null;
}

