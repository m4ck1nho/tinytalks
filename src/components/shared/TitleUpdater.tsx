'use client';

import { useEffect } from 'react';
import { db } from '@/lib/supabase';

export default function TitleUpdater() {
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined' || !document) {
      return;
    }

    const updateTitle = async () => {
      try {
        const { data, error } = await db.getSetting('site_title');
        if (!error && data?.value?.title) {
          // Update document title
          if (document.title !== data.value.title) {
            document.title = data.value.title;
          }
        }
      } catch (error) {
        // Silent fail - use default title if settings fail
        console.warn('Failed to update title from settings:', error);
      }
    };

    // Small delay to ensure DOM is fully ready
    const timeoutId = setTimeout(updateTitle, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

