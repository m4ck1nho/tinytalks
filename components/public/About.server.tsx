import Image from 'next/image';
import { AcademicCapIcon, UserGroupIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/lib/i18n-server';

interface AboutProps {
  translations: Record<string, unknown>;
  locale: Language;
}

export default function About({ translations }: AboutProps) {
  const t = (key: string) => {
    const keys = key.split('.');
    let value: unknown = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };
  
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
                alt={t('about.imageAlt')}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                unoptimized
                priority
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
            
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">
              {t('about.title')}
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="whitespace-pre-line">
                {t('about.intro1')}
              </p>
              
              <p className="whitespace-pre-line">
                {t('about.intro2')}
              </p>
              
              <p className="whitespace-pre-line">
                {t('about.intro3')}
              </p>
              
              <p className="font-semibold text-gray-900">
                {t('about.cta')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-orange-500 shadow-lg hover:shadow-lg hover:scale-110 transition-all duration-300 relative"
            >
              <div className="absolute inset-0 rounded-xl border-2 border-orange-500 animate-pulse opacity-30"></div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-4 transition-transform duration-300 hover:scale-125">
                <feature.icon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

