'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface BlogCTAProps {
  variant?: 'default' | 'minimal';
  customText?: {
    heading?: string;
    description?: string;
    primaryButton?: string;
    secondaryButton?: string;
  };
}

export function BlogCTA({ variant = 'default', customText }: BlogCTAProps) {
  const router = useRouter();

  const defaultText = {
    heading: 'Готовы начать учить английский эффективно?',
    description: 'Присоединяйтесь к TinyTalks и начните свое путешествие в изучении английского с опытным преподавателем. Первое занятие — бесплатно!',
    primaryButton: 'Записаться на бесплатный урок',
    secondaryButton: 'Посмотреть цены',
  };

  const text = { ...defaultText, ...customText };

  if (variant === 'minimal') {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-600 mb-4">{text.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {text.primaryButton}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300"
          >
            {text.secondaryButton}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-orange-50 rounded-xl p-8 md:p-12 text-center shadow-lg">
        <h3 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
          {text.heading}
        </h3>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
          {text.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            {text.primaryButton}
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-500 border-2 border-primary-500 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 text-lg"
          >
            {text.secondaryButton}
          </Link>
        </div>
      </div>
    </div>
  );
}

