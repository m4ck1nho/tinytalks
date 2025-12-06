'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase';
import { UserCircleIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      setUser(user as { email?: string; user_metadata?: { full_name?: string } } | null);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      setUser(user as { email?: string; user_metadata?: { full_name?: string } } | null);
      if (!user) {
        setIsDropdownOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getUserFirstName = () => {
    if (!user) return '';
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ')[0];
    }
    // Fallback to email username
    return user.email?.split('@')[0] || 'User';
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    const isHomePage = window.location.pathname === '/';
    
    if (isHomePage) {
      // On home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      // On other pages, navigate to home page with hash
      router.push(`/#${sectionId}`);
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
              <span className="relative z-10">О нас</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Цены</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Отзывы</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <Link
              href="/blog"
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Блог</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="relative px-5 py-2.5 text-secondary-900 font-semibold rounded-xl hover:text-primary-500 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Контакты</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* User Auth Button */}
            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative px-4 py-2.5 rounded-xl font-semibold text-secondary-900 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-primary-300 hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <UserCircleIcon className="w-5 h-5 text-primary-500" />
                  <span>{getUserFirstName()}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-out">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      Личный кабинет
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Выход
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="relative ml-2 px-8 py-3 rounded-xl font-bold text-white overflow-hidden group"
              >
                <div className="absolute inset-0 bg-primary-500 group-hover:bg-primary-600 transition-colors"></div>
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <span className="relative z-10">Вход / Регистрация</span>
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
              О нас
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              Цены
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              Отзывы
            </button>
            <Link
              href="/blog"
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Блог
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-5 py-3 text-secondary-900 font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-500 rounded-xl transition-all duration-300"
            >
              Контакты
            </button>

            {/* Mobile Auth Button */}
            {user ? (
              <div className="mt-3 space-y-2">
                <div className="px-5 py-2 text-sm text-gray-600 flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">{getUserFirstName()}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-5 py-3 rounded-xl font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Личный кабинет
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center px-5 py-3 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Выход
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="block w-full text-center px-5 py-3 mt-3 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Вход / Регистрация
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

