'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n-server';
import { getTranslations } from '@/lib/i18n-server';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
  initialTranslations?: Record<string, any>;
}

export function LanguageProvider({ children, initialLanguage = 'ru', initialTranslations }: LanguageProviderProps) {
  // Initialize with server-provided translations for SSR
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, any>>(
    initialTranslations || getTranslations(initialLanguage)
  );

  useEffect(() => {
    // Load saved language from localStorage (after mount)
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'ru') {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Only load translations if they differ from what was server-rendered
    if (language !== initialLanguage || !initialTranslations) {
      import(`@/locales/${language}.json`)
        .then((module) => setTranslations(module.default))
        .catch((error) => console.error('Error loading translations:', error));
    }
  }, [language, initialLanguage, initialTranslations]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
