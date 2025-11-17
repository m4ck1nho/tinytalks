'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-md mb-6">
            Свяжитесь с нами
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Начните свое путешествие в английском сегодня
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Есть вопросы? Готовы начать? Отправьте нам сообщение, и мы свяжемся с вами как можно скорее!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {/* Email Card */}
          <a
            href="mailto:info@tinytalks.pro"
            className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <EnvelopeIcon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  Электронная почта
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">
                  info@tinytalks.pro
                </p>
              </div>
            </div>
          </a>

          {/* Telegram Card */}
          <a
            href="https://t.me/TinytalksPro"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.559z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Telegram
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                  @TinytalksPro
                </p>
              </div>
            </div>
          </a>

        {/* WhatsApp Card */}
        <a
          href="https://wa.me/79315390543"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
              <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.78 11.78 0 0 0 3.47 20.53L2 22l1.6-.47A11.78 11.78 0 0 0 12 23.76h.01a11.76 11.76 0 0 0 8.33-20.28zM12 21.4h-.01a9.36 9.36 0 0 1-4.78-1.29l-.34-.2-2.84.84.82-2.76-.22-.32a9.37 9.37 0 1 1 17.09-5.1A9.31 9.31 0 0 1 12 21.4zm5-7.25c-.27-.13-1.6-.8-1.85-.9s-.43-.13-.62.13-.71.9-.87 1.09-.32.19-.59.06a7.57 7.57 0 0 1-2.23-1.38 8.35 8.35 0 0 1-1.55-1.93c-.16-.27 0-.42.11-.55.11-.11.27-.32.4-.48l.13-.21c.06-.13.02-.25-.01-.34s-.61-1.47-.83-2-.44-.46-.62-.47-.35-.01-.54-.01a1 1 0 0 0-.71.33 3 3 0 0 0-.93 2.2 5.27 5.27 0 0 0 1.09 2.79 12 12 0 0 0 4.58 4.05 15 15 0 0 0 1.47.54 3.54 3.54 0 0 0 1.63.1 2.67 2.67 0 0 0 1.76-1.24 2.16 2.16 0 0 0 .15-1.21c-.06-.11-.24-.17-.51-.3z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                WhatsApp
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-green-600 transition-colors">
                Напишите нам в WhatsApp
              </p>
            </div>
          </div>
        </a>
        </div>
      </div>
    </section>
  );
}
