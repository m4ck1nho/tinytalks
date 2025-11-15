'use client';

import Image from 'next/image';
import { AcademicCapIcon, UserGroupIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

export default function About() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Асинхронное обучение',
      description: 'Ежедневные задания по 15 минут с обратной связью от преподавателя',
    },
    {
      icon: UserGroupIcon,
      title: 'Индивидуальный подход',
      description: 'Каждый студент получает персональный план обучения',
    },
    {
      icon: SparklesIcon,
      title: 'Онлайн обучение',
      description: 'Интерактивные уроки, которые делают изучение английского приятным и эффективным',
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: 'Фокус на разговорной речи',
      description: 'Упор на разговорный английский и реальное общение',
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
                alt="Евгения Пенькова — преподаватель английского языка"
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
                О TinyTalks
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">
              Я - Пенькова Евгения, преподаватель английского языка и создатель проекта TinyTalks
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="whitespace-pre-line">
                TinyTalks вырос из моего желания сделать изучение английского простым , современным и понятным.
              </p>
              
              <p className="whitespace-pre-line">
                Я вижу, как часто ученики боятся «ошибиться», теряют мотивацию или думают, что &quot;им просто не дано&quot;.

Моя цель — показать, что это не так.

На моих занятиях нет спешки и давления — только поддержка, доброжелательная атмосфера и понятные шаги к результату.
              </p>
              
              <p className="whitespace-pre-line">
                Я верю, что каждый может говорить по-английски, если учиться в комфортном темпе и получать обратную связь,
которая вдохновляет, а не пугает.
              </p>
              
              <p className="font-semibold text-gray-900">
                TinyTalks — это место, где учиться легко, приятно и по-настоящему.
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
