'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-lg flex items-center justify-center font-bold text-lg">
                TT
              </div>
              <span className="text-xl font-bold">TinyTalks</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Ваше путешествие к свободному владению английским начинается здесь.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://t.me/TinytalksPro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.559z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/79315390543" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.52 3.48A11.78 11.78 0 0 0 3.47 20.53L2 22l1.6-.47A11.78 11.78 0 0 0 12 23.76h.01a11.76 11.76 0 0 0 8.33-20.28zM12 21.4h-.01a9.36 9.36 0 0 1-4.78-1.29l-.34-.2-2.84.84.82-2.76-.22-.32a9.37 9.37 0 1 1 17.09-5.1A9.31 9.31 0 0 1 12 21.4zm5-7.25c-.27-.13-1.6-.8-1.85-.9s-.43-.13-.62.13-.71.9-.87 1.09-.32.19-.59.06a7.57 7.57 0 0 1-2.23-1.38 8.35 8.35 0 0 1-1.55-1.93c-.16-.27 0-.42.11-.55.11-.11.27-.32.4-.48l.13-.21c.06-.13.02-.25-.01-.34s-.61-1.47-.83-2-.44-.46-.62-.47-.35-.01-.54-.01a1 1 0 0 0-.71.33 3 3 0 0 0-.93 2.2 5.27 5.27 0 0 0 1.09 2.79 12 12 0 0 0 4.58 4.05 15 15 0 0 0 1.47.54 3.54 3.54 0 0 0 1.63.1 2.67 2.67 0 0 0 1.76-1.24 2.16 2.16 0 0 0 .15-1.21c-.06-.11-.24-.17-.51-.3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">О нас</a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Цены</a>
              </li>
              <li>
                <a href="#reviews" className="text-gray-400 hover:text-white transition-colors">Отзывы</a>
              </li>
              <li>
                <a href="#blog" className="text-gray-400 hover:text-white transition-colors">Блог</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:info@tinytalks.pro" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@tinytalks.pro
                </a>
              </li>
              <li>
                <a href="https://t.me/TinytalksPro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.559z"/>
                  </svg>
                  @TinytalksPro
                </a>
              </li>
              <li>
                <a href="https://wa.me/79315390543" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.78 11.78 0 0 0 3.47 20.53L2 22l1.6-.47A11.78 11.78 0 0 0 12 23.76h.01a11.76 11.76 0 0 0 8.33-20.28zM12 21.4h-.01a9.36 9.36 0 0 1-4.78-1.29l-.34-.2-2.84.84.82-2.76-.22-.32a9.37 9.37 0 1 1 17.09-5.1A9.31 9.31 0 0 1 12 21.4zm5-7.25c-.27-.13-1.6-.8-1.85-.9s-.43-.13-.62.13-.71.9-.87 1.09-.32.19-.59.06a7.57 7.57 0 0 1-2.23-1.38 8.35 8.35 0 0 1-1.55-1.93c-.16-.27 0-.42.11-.55.11-.11.27-.32.4-.48l.13-.21c.06-.13.02-.25-.01-.34s-.61-1.47-.83-2-.44-.46-.62-.47-.35-.01-.54-.01a1 1 0 0 0-.71.33 3 3 0 0 0-.93 2.2 5.27 5.27 0 0 0 1.09 2.79 12 12 0 0 0 4.58 4.05 15 15 0 0 0 1.47.54 3.54 3.54 0 0 0 1.63.1 2.67 2.67 0 0 0 1.76-1.24 2.16 2.16 0 0 0 .15-1.21c-.06-.11-.24-.17-.51-.3z"/>
                  </svg>
                  +79315390543
                </a>
              </li>
              <li>Онлайн-занятия</li>
              <li>Доступно по всему миру</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} TinyTalks. Все права защищены.
            </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                      <a href="/privacy-policy" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                      <a href="/terms-of-service" className="hover:text-white transition-colors">Условия использования</a>
                      <a href="/cookie-policy" className="hover:text-white transition-colors">Политика cookie</a>
                    </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
