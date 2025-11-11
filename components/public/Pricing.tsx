'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();
  
  const plans = [
    {
      key: 'trial',
      name: t('pricing.trial.name'),
      price: t('pricing.trial.price'),
      currency: t('pricing.trial.currency'),
      period: t('pricing.trial.period'),
      subtitle: t('pricing.trial.subtitle'),
      duration: t('pricing.trial.duration'),
      description: t('pricing.trial.description'),
      cta: t('pricing.trial.cta'),
      popular: false,
    },
    {
      key: 'individual',
      name: t('pricing.individual.name'),
      price: t('pricing.individual.price'),
      currency: t('pricing.individual.currency'),
      period: t('pricing.individual.period'),
      subtitle: t('pricing.individual.subtitle'),
      duration: t('pricing.individual.duration'),
      description: t('pricing.individual.description'),
      cta: t('pricing.individual.cta'),
      popular: false,
    },
    {
      key: 'async',
      name: t('pricing.async.name'),
      price: t('pricing.async.price'),
      currency: t('pricing.async.currency'),
      period: t('pricing.async.period'),
      subtitle: t('pricing.async.subtitle'),
      duration: t('pricing.async.duration'),
      description: t('pricing.async.description'),
      cta: t('pricing.async.cta'),
      popular: true,
    },
    {
      key: 'group',
      name: t('pricing.group.name'),
      price: t('pricing.group.price'),
      currency: t('pricing.group.currency'),
      period: t('pricing.group.period'),
      subtitle: t('pricing.group.subtitle'),
      duration: t('pricing.group.duration'),
      description: t('pricing.group.description'),
      cta: t('pricing.group.cta'),
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
            {t('pricing.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-6 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('pricing.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.key}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  {t('pricing.individual.popular')}
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

