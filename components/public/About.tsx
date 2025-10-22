'use client';

import Image from 'next/image';
import { AcademicCapIcon, UserGroupIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: AcademicCapIcon,
      title: t('about.features.expert.title'),
      description: t('about.features.expert.description'),
    },
    {
      icon: UserGroupIcon,
      title: t('about.features.personalized.title'),
      description: t('about.features.personalized.description'),
    },
    {
      icon: SparklesIcon,
      title: t('about.features.engaging.title'),
      description: t('about.features.engaging.description'),
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: t('about.features.speaking.title'),
      description: t('about.features.speaking.description'),
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative order-2 md:order-1">
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/teacher-about.jpg"
                alt="Evgenia Penkova - English Teacher"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-6 order-1 md:order-2">
            <div className="inline-block">
              <span className="bg-secondary-100 text-secondary-900 text-sm font-semibold px-4 py-2 rounded-full">
                {t('about.badge')}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('about.title')}
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                {t('about.intro1')}
              </p>
              
              <p>
                {t('about.intro2')}
              </p>
              
              <p>
                {t('about.intro3')}
              </p>
              
              <p className="font-semibold text-gray-900">
                {t('about.cta')}
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-800 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">100+</span> {t('about.trustBadge')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

