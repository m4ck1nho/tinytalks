'use client';

import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="inline-block">
              <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
                Learn English with Confidence
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Achieve <span className="text-primary-500">B1 Level</span> English
              <br />
              <span className="text-secondary-900">Through Personalized Learning</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Welcome to TinyTalks! Whether you&apos;re a complete beginner or looking to improve your skills, 
              our tailored approach helps you reach B1 proficiency with confidence and ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToContact}
                className="group bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-secondary-900 text-secondary-900 px-8 py-4 rounded-lg font-semibold hover:bg-secondary-900 hover:text-white transition-all duration-300"
              >
                View Pricing
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">5+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative h-[600px] md:h-[700px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-900/20 z-10"></div>
              <Image
                src="/images/teacher-hero.jpg"
                alt="English Teacher"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

