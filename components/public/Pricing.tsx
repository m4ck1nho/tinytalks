'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';

export default function Pricing() {
  const [pricingSettings, setPricingSettings] = useState<Record<string, { price: string; currency: string }>>({});

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await db.getSettings();
        if (!error && data) {
          const pricing: Record<string, { price: string; currency: string }> = {};
          data.forEach((setting: { key: string; value: Record<string, unknown> }) => {
            if (setting.key.startsWith('pricing_')) {
              const planKey = setting.key.replace('pricing_', '');
              const value = setting.value;
              if (
                value &&
                typeof value === 'object' &&
                typeof value.price === 'string' &&
                typeof value.currency === 'string'
              ) {
                pricing[planKey] = {
                  price: value.price,
                  currency: value.currency,
                };
              }
            }
          });
          setPricingSettings(pricing);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      }
    };

    fetchPricing();
  }, []);

  const getPrice = (planKey: string, fallback: string): string => {
    return pricingSettings[planKey]?.price || fallback;
  };

  const getCurrency = (planKey: string, fallback: string): string => {
    return pricingSettings[planKey]?.currency || fallback;
  };

  const plans = [
    {
      key: 'trial',
      name: 'Пробное занятие',
      price: getPrice('trial', '0'),
      currency: getCurrency('trial', '₽'),
      period: 'рублей',
      subtitle: 'Попробуй перед стартом — бесплатно',
      duration: '25 минут',
      description: 'На пробном занятии мы узнаем твой уровень, обсудим цели и составим план обучения.\n\nТы поймёшь, какой формат подходит именно тебе.',
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      key: 'individual',
      name: 'Индивидуальное занятие',
      price: getPrice('individual', '2000'),
      currency: getCurrency('individual', '₽'),
      period: '/ занятие',
      subtitle: 'Полное внимание преподавателя только для тебя',
      duration: '60 мин',
      description: 'Индивидуальные занятия — это твой личный темп и программа, подстроенная под тебя.\n\nМы разбираем грамматику, говорим на актуальные темы, тренируем произношение и решаем именно те задачи, которые важны тебе.',
      cta: 'Записаться',
      popular: false,
    },
    {
      key: 'async',
      name: 'Асинхронное микрообучение',
      price: getPrice('async', '1000'),
      currency: getCurrency('async', '₽'),
      period: '/ неделя',
      subtitle: 'Учись в удобное время — маленькими шагами',
      duration: '15 минут в день',
      description: 'Короткие уроки, практические задания и моя обратная связь — всё это в твоём ритме.\n\nТы проходишь уроки тогда, когда удобно, и постепенно набираешь уверенность, не теряя мотивацию.\n\nИдеально для тех, кто хочет гибко учить английский.',
      cta: 'Начать обучение',
      popular: true,
    },
    {
      key: 'group',
      name: 'Асинхронные занятия + 1 онлайн-урок в неделю',
      price: getPrice('group', '3250'),
      currency: getCurrency('group', '₽'),
      period: '/ неделя',
      subtitle: 'Учись в своём ритме и закрепляй знания в прямом эфире',
      duration: 'Асинхронный формат + 1 онлайн-занятие в неделю',
      description: '- Удобные асинхронные уроки\n- Одно онлайн-занятие в неделю\n- Короткие задания и персональная обратная связь\n\nТы изучаешь материал тогда, когда удобно, а на еженедельной онлайн-встрече мы разбираем вопросы, тренируем речь и укрепляем уверенность. Идеально для тех, кому нужна гибкость и регулярная живая практика.',
      cta: 'Записаться на план',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
            Тарифные планы
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-6 mb-4">
            Выберите свой путь обучения
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Гибкие варианты цен, разработанные для ваших потребностей и бюджета
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Популярный
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm font-semibold mb-2">{plan.subtitle}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-secondary-900">{plan.price}</span>
                    <span className="text-xl text-gray-600">{plan.currency}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{plan.period}</div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-700">- {plan.duration}</div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {plan.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
