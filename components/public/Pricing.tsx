'use client';

import { CheckIcon } from '@heroicons/react/24/outline';

export default function Pricing() {
  const plans = [
    {
      name: 'Group Classes',
      price: '1,250',
      currency: '₽',
      period: 'per lesson',
      description: 'Perfect for social learners who enjoy group dynamics',
      features: [
        'Small groups (4-6 students)',
        '45-minute lessons',
        '2-3 times per week',
        'Interactive activities',
        'Speaking practice',
        'Progress reports',
        'Homework assignments',
        'Learning materials included',
      ],
      popular: false,
      cta: 'Join Group',
    },
    {
      name: 'Private Lessons',
      price: '2,500',
      currency: '₽',
      period: 'per lesson',
      description: 'One-on-one attention for faster progress',
      features: [
        'Individual attention',
        '50-minute lessons',
        'Flexible scheduling',
        'Personalized curriculum',
        'Custom learning materials',
        'Detailed progress tracking',
        'Regular feedback',
        'Faster progress guaranteed',
      ],
      popular: true,
      cta: 'Start Learning',
    },
    {
      name: 'Intensive Course',
      price: '10,000',
      currency: '₽',
      period: 'total (8 sessions)',
      description: 'Accelerated learning with focused content',
      features: [
        '8 intensive sessions',
        'Small group (4-6 students)',
        '3 times per week',
        'Themed learning modules',
        'Interactive games',
        'Progress tracking',
        'Certificate of completion',
        'Special course materials',
      ],
      popular: false,
      cta: 'Get Started',
    },
  ];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
            Pricing Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible options to fit your schedule, budget, and learning style
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-600">{plan.currency}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{plan.period}</div>
                </div>
                
                <button
                  onClick={scrollToContact}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 mb-8 ${
                    plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
                
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">What&apos;s included:</div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <CheckIcon className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Not sure which plan is right for you?{' '}
            <button onClick={scrollToContact} className="text-primary-500 font-semibold hover:underline">
              Contact us for a free consultation
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

