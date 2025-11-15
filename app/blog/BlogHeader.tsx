'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function BlogHeader() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16">
      {/* Header - Clean and Simple */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('blog.description')}
        </p>
      </div>
    </div>
  );
}

