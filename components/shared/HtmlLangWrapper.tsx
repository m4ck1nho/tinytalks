'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export function HtmlLangWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial language from localStorage if available, otherwise use context
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      const initialLang = (savedLanguage === 'en' || savedLanguage === 'ru') 
        ? savedLanguage 
        : language;
      document.documentElement.lang = initialLang;
    }
  }, []);

  useEffect(() => {
    // Update the html lang attribute when language changes
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  return <>{children}</>;
}

