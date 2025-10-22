'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/supabase';
import { UserCircleIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      setUser(user as { email?: string } | null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10' 
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with gradient */}
          <div className="flex-shrink-0 group">
            <Link href="/" className="relative inline-block">
              <span className="text-3xl font-black bg-gradient-to-r from-primary-500 via-secondary-900 to-primary-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                TinyTalks
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-900 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollToSection('about')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">{t('nav.about')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">{t('nav.pricing')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">{t('reviews.badge')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">{t('nav.blog')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
              className="relative px-4 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden flex items-center gap-2"
              title={language === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
            >
              <LanguageIcon className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-bold">{language === 'en' ? 'РУС' : 'ENG'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {/* User Auth Button */}
            {user ? (
              <Link
                href="/dashboard"
                className="relative ml-2 px-6 py-3 rounded-xl font-bold text-white overflow-hidden group flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-primary-500 group-hover:bg-primary-600 transition-colors"></div>
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <UserCircleIcon className="relative z-10 w-5 h-5" />
                <span className="relative z-10">{t('nav.dashboard')}</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="relative ml-2 px-8 py-3 rounded-xl font-bold text-white overflow-hidden group"
              >
                <div className="absolute inset-0 bg-primary-500 group-hover:bg-primary-600 transition-colors"></div>
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <span className="relative z-10">{t('nav.login')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button with futuristic design */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 text-secondary-900 hover:from-primary-100 hover:to-secondary-100 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with futuristic glass effect */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-primary-100/50">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              {t('nav.pricing')}
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              {t('reviews.badge')}
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              {t('nav.blog')}
            </button>

            {/* Mobile Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <LanguageIcon className="w-5 h-5" />
              <span className="font-bold">{language === 'en' ? 'Русский' : 'English'}</span>
            </button>
            
            {/* Mobile Auth Button */}
            {user ? (
              <Link
                href="/dashboard"
                className="block w-full text-center px-5 py-3 mt-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link
                href="/auth"
                className="block w-full text-center px-5 py-3 mt-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

