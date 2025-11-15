import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности TinyTalks - как мы собираем, используем и защищаем ваши персональные данные.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://tinytalks.pro/privacy-policy',
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Политика конфиденциальности
            </h1>
            
            <div className="prose prose-lg max-w-none
              prose-headings:text-secondary-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-ul:text-gray-700 prose-ol:text-gray-700">
              
              <p className="text-sm text-gray-500 mb-8">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">1. Введение</h2>
                <p>
                  TinyTalks (&quot;мы&quot;, &quot;наш&quot;, &quot;нас&quot;) обязуется защищать вашу конфиденциальность. 
                  Эта Политика конфиденциальности объясняет, как мы собираем, используем и защищаем ваши персональные данные 
                  при использовании нашего веб-сайта и услуг.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">2. Собираемая информация</h2>
                <h3 className="text-xl font-semibold text-secondary-900 mt-6 mb-3">2.1 Персональные данные</h3>
                <p>Мы можем собирать следующую информацию:</p>
                <ul>
                  <li>Имя и контактная информация (email, телефон)</li>
                  <li>Информация об обучении (уровень, цели, прогресс)</li>
                  <li>Платежная информация (обрабатывается через защищенные платежные системы)</li>
                  <li>Данные об использовании веб-сайта</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">3. Использование информации</h2>
                <p>Мы используем собранную информацию для:</p>
                <ul>
                  <li>Предоставления и улучшения наших образовательных услуг</li>
                  <li>Обработки регистраций и платежей</li>
                  <li>Связи с вами по поводу ваших занятий</li>
                  <li>Персонализации вашего опыта обучения</li>
                  <li>Анализа использования сайта для улучшения сервиса</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">4. Защита данных</h2>
                <p>
                  Мы применяем соответствующие технические и организационные меры для защиты ваших персональных данных 
                  от несанкционированного доступа, изменения, раскрытия или уничтожения.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">5. Ваши права</h2>
                <p>Вы имеете право:</p>
                <ul>
                  <li>Получить доступ к вашим персональным данным</li>
                  <li>Исправить неточные данные</li>
                  <li>Удалить ваши данные</li>
                  <li>Отозвать согласие на обработку данных</li>
                  <li>Подать жалобу в надзорный орган</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mt-8 mb-4">6. Контакты</h2>
                <p>
                  По вопросам, связанным с этой Политикой конфиденциальности, обращайтесь:
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

