'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/supabase';

export default function FaviconUpdater() {
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Ensure we're in the browser and document is ready
    if (typeof window === 'undefined' || typeof document === 'undefined' || !document.head) {
      return;
    }

    mountedRef.current = true;

    const updateFavicon = async () => {
      // Check if component is still mounted
      if (!mountedRef.current) {
        return;
      }

      // Double-check document still exists (can be null during unmount)
      if (!document || !document.head || !mountedRef.current) {
        return;
      }

      try {
        const { data, error } = await db.getSetting('favicon');
        
        // Check again after async operation
        if (!mountedRef.current || !document || !document.head) {
          return;
        }

        if (!error && data?.value?.url) {
          // Create new favicon link without removing old ones
          // Browsers will typically use the most recently added favicon
          // This avoids DOM manipulation issues during React hydration/StrictMode
          try {
            // Verify document still exists and component is mounted before creating element
            if (!mountedRef.current || !document || !document.head) {
              return;
            }

            // Check if we already have this favicon to avoid duplicates
            const existingLink = document.querySelector(`link[rel="icon"][href="${data.value.url}"]`);
            if (existingLink) {
              // Already exists, no need to add again
              return;
            }

            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = data.value.url.endsWith('.svg') ? 'image/svg+xml' : 
                       data.value.url.endsWith('.png') ? 'image/png' : 'image/x-icon';
            link.href = data.value.url;
            
            // Prepend to head so it takes priority over existing favicons
            // Final check before appending
            if (mountedRef.current && document.head) {
              // Use prepend instead of appendChild to give it higher priority
              // This way browsers will prefer our favicon without needing to remove old ones
              const firstChild = document.head.firstChild;
              if (firstChild) {
                document.head.insertBefore(link, firstChild);
              } else {
                document.head.appendChild(link);
              }
            }
          } catch (appendError) {
            // Non-critical error - default favicon will be used
            // Only log in development to avoid console noise
            if (process.env.NODE_ENV === 'development') {
              console.warn('Could not append favicon link:', appendError);
            }
          }
        }
      } catch {
        // Silent fail - use default favicon if settings fail
        // This is expected if database is not available or user is not authenticated
      }
    };

    // Small delay to ensure DOM is fully ready and avoid hydration issues
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        updateFavicon();
      }
    }, 100);

    return () => {
      // Mark as unmounted
      mountedRef.current = false;
      
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return null;
}

