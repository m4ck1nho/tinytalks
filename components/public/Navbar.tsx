'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                TinyTalks
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollToSection('about')}
              className="relative px-5 py-2.5 text-gray-700 font-semibold rounded-xl hover:text-blue-600 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="relative px-5 py-2.5 text-gray-700 font-semibold rounded-xl hover:text-blue-600 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Pricing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="relative px-5 py-2.5 text-gray-700 font-semibold rounded-xl hover:text-blue-600 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Reviews</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="relative px-5 py-2.5 text-gray-700 font-semibold rounded-xl hover:text-blue-600 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Blog</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {/* CTA Button with futuristic glow */}
            <button
              onClick={() => scrollToSection('contact')}
              className="relative ml-4 px-8 py-3 rounded-xl font-bold text-white overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                Contact Us
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button with futuristic design */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
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
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-blue-100/50">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-5 py-3 text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left px-5 py-3 text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all duration-300"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="block w-full text-left px-5 py-3 text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all duration-300"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="block w-full text-left px-5 py-3 text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all duration-300"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-center px-5 py-3 mt-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

