'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden pt-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 md:pt-6 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-8 z-10 pt-0">
            <div className="inline-block">
              <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
                {t('hero.badge')}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
              <br />
              <span className="text-secondary-900">{t('hero.subtitle')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed whitespace-pre-line">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth?mode=signup"
                className="group bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {t('hero.cta')}
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-secondary-900 text-secondary-900 px-8 py-4 rounded-lg font-semibold hover:bg-secondary-900 hover:text-white transition-all duration-300"
              >
                {t('hero.pricing')}
              </button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative h-[620px] md:h-[720px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/teacher-hero.jpg"
                alt={t('hero.imageAlt')}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

