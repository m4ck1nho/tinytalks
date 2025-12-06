import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Условия использования | TinyTalks',
  description:
    'Правила оказания образовательных услуг TinyTalks: бронирование занятий, оплаты, возвраты и ответственность сторон.',
  path: '/terms-of-service',
  keywords: ['условия использования TinyTalks', 'договор TinyTalks', 'правила сервиса'],
  type: 'article',
});

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Условия использования
            </h1>
            
            <div className="prose prose-lg max-w-none
              prose-headings:text-secondary-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-ul:text-gray-700 prose-ol:text-gray-700">
              
              <p className="text-sm text-gray-500 mb-8">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">1. Общие положения</h2>
                <p>
                  Эти Условия использования регулируют использование вами веб-сайта и услуг TinyTalks. 
                  Используя наш сервис, вы соглашаетесь с этими условиями.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">2. Предоставление услуг</h2>
                <p>TinyTalks предоставляет онлайн-обучение английскому языку:</p>
                <ul>
                  <li>Индивидуальные занятия</li>
                  <li>Асинхронное микрообучение</li>
                  <li>Групповые занятия</li>
                </ul>
                <p>
                  Мы оставляем за собой право изменять, приостанавливать или прекращать любые аспекты 
                  наших услуг в любое время.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">3. Регистрация и учетные записи</h2>
                <p>При регистрации вы обязуетесь:</p>
                <ul>
                  <li>Предоставлять точную и актуальную информацию</li>
                  <li>Поддерживать безопасность вашей учетной записи</li>
                  <li>Нести ответственность за все действия под вашей учетной записью</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">4. Платежи и возвраты</h2>
                <h3 className="text-xl font-semibold text-secondary-900 mt-6 mb-3">4.1 Оплата</h3>
                <p>
                  Все платежи обрабатываются через защищенные платежные системы. 
                  Цены могут изменяться, но изменения не применяются к уже оплаченным занятиям.
                </p>
                
                <h3 className="text-xl font-semibold text-secondary-900 mt-6 mb-3">4.2 Возврат средств</h3>
                <p>
                  Возврат средств возможен в течение 7 дней после оплаты, если занятия еще не были проведены. 
                  Свяжитесь с нами для обработки возврата.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">5. Отмена и перенос занятий</h2>
                <p>
                  Занятия могут быть отменены или перенесены при уведомлении за 24 часа до начала занятия. 
                  Отмена менее чем за 24 часа может взиматься плата.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">6. Интеллектуальная собственность</h2>
                <p>
                  Все материалы курсов, контент и интеллектуальная собственность на сайте принадлежат TinyTalks 
                  и защищены авторским правом. Вы не можете копировать, распространять или использовать материалы 
                  в коммерческих целях без письменного разрешения.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">7. Ограничение ответственности</h2>
                <p>
                  TinyTalks не несет ответственности за любые косвенные, случайные или косвенные убытки, 
                  возникающие в результате использования наших услуг.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">8. Изменения условий</h2>
                <p>
                  Мы оставляем за собой право изменять эти Условия использования в любое время. 
                  Изменения вступают в силу после публикации на сайте.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">9. Контакты</h2>
                <p>
                  По вопросам, связанным с этими Условиями использования, обращайтесь:
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

