import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Политика cookie | TinyTalks',
  description:
    'Узнайте, какие cookie использует TinyTalks, зачем они нужны и как вы можете управлять настройками файлов cookie.',
  path: '/cookie-policy',
  keywords: ['политика cookie', 'cookie-файлы', 'конфиденциальность TinyTalks'],
  type: 'article',
});

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Политика cookie
            </h1>
            
            <div className="prose prose-lg max-w-none
              prose-headings:text-secondary-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-ul:text-gray-700 prose-ol:text-gray-700">
              
              <p className="text-sm text-gray-500 mb-8">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">1. Что такое cookie</h2>
                <p>
                  Cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении веб-сайта. 
                  Они помогают сайту запоминать ваши предпочтения и улучшают ваш опыт использования.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">2. Как мы используем cookie</h2>
                <h3 className="text-xl font-semibold text-secondary-900 mt-6 mb-3">2.1 Необходимые cookie</h3>
                <p>
                  Эти cookie необходимы для работы сайта и не могут быть отключены:
                </p>
                <ul>
                  <li>Аутентификация и безопасность</li>
                  <li>Сохранение настроек сессии</li>
                  <li>Корзина покупок (если применимо)</li>
                </ul>

                <h3 className="text-xl font-semibold text-secondary-900 mt-6 mb-3">2.2 Аналитические cookie</h3>
                <p>
                  Мы используем аналитические cookie для понимания того, как посетители используют наш сайт:
                </p>
                <ul>
                  <li>Vercel Analytics — для анализа использования сайта</li>
                  <li>Vercel Speed Insights — для мониторинга производительности</li>
                </ul>

                <h3 className="text-xl font-semibold text-secondary-900 mt-6 mb-3">2.3 Маркетинговые cookie</h3>
                <p>
                  Мы можем использовать cookie для персонализации рекламы и отслеживания эффективности маркетинговых кампаний.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">3. Управление cookie</h2>
                <p>
                  Вы можете управлять cookie через настройки вашего браузера. Однако отключение некоторых cookie 
                  может повлиять на функциональность сайта.
                </p>
                <p>
                  <strong>Настройки cookie в популярных браузерах:</strong>
                </p>
                <ul>
                  <li>Google Chrome: Настройки → Конфиденциальность и безопасность → Файлы cookie</li>
                  <li>Mozilla Firefox: Настройки → Приватность и защита → Файлы cookie и данные сайтов</li>
                  <li>Safari: Настройки → Конфиденциальность → Управление данными веб-сайтов</li>
                  <li>Microsoft Edge: Настройки → Конфиденциальность, поиск и службы → Файлы cookie</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">4. Cookie третьих сторон</h2>
                <p>
                  Мы можем использовать услуги третьих сторон, которые устанавливают собственные cookie:
                </p>
                <ul>
                  <li>Google Analytics (если используется)</li>
                  <li>Vercel Analytics и Speed Insights</li>
                  <li>Платежные системы</li>
                </ul>
                <p>
                  Эти службы имеют свои собственные политики конфиденциальности и управления cookie.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">5. Изменения в политике cookie</h2>
                <p>
                  Мы можем обновлять эту Политику cookie время от времени. 
                  Дата последнего обновления указана в начале документа.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">6. Контакты</h2>
                <p>
                  По вопросам, связанным с использованием cookie, обращайтесь:
                </p>
                <p>
                  <strong>Email:</strong> info@tinytalks.pro<br />
                  <strong>Telegram:</strong> @TinytalksPro
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

