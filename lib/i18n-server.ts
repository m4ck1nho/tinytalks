import enTranslations from '@/locales/en.json';
import ruTranslations from '@/locales/ru.json';

export type Language = 'en' | 'ru';

const translations = {
  en: enTranslations,
  ru: ruTranslations,
};

/**
 * Server-side translation function
 * Pre-renders translations on the server for SEO
 */
export function getTranslations(locale: Language = 'ru'): typeof enTranslations {
  return translations[locale] || translations.ru;
}

/**
 * Server-side translation helper function
 */
export function t(locale: Language, key: string): string {
  const messages = getTranslations(locale);
  const keys = key.split('.');
  let value: any = messages;
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Get all supported locales
 */
export function getLocales(): Language[] {
  return ['en', 'ru'];
}

/**
 * Detect language from headers or default to 'ru'
 */
export function getLocaleFromHeaders(headers: Headers): Language {
  const acceptLanguage = headers.get('accept-language') || '';
  if (acceptLanguage.includes('en')) {
    return 'en';
  }
  return 'ru';
}

