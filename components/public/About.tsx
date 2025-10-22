'use client';

import Image from 'next/image';
import { AcademicCapIcon, UserGroupIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

export default function About() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Expert Teaching',
      description: 'Years of experience in teaching English to beginners of all ages',
    },
    {
      icon: UserGroupIcon,
      title: 'Personalized Approach',
      description: 'Every student gets a customized learning plan tailored to their goals',
    },
    {
      icon: SparklesIcon,
      title: 'Engaging Methods',
      description: 'Interactive lessons that make learning English enjoyable and effective',
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: 'Speaking Focus',
      description: 'Emphasis on conversational English and real-world communication',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative order-2 md:order-1">
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/teacher-about.jpg"
                alt="Evgenia Penkova - English Teacher"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-6 order-1 md:order-2">
            <div className="inline-block">
              <span className="bg-secondary-100 text-secondary-900 text-sm font-semibold px-4 py-2 rounded-full">
                About TinyTalks
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Meet Your English Teacher
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Hello! I&apos;m <span className="font-semibold text-gray-900">Evgenia Penkova</span>, 
                the founder of TinyTalks. With over 5 years of experience teaching English, 
                I&apos;ve helped hundreds of students achieve their language learning goals.
              </p>
              
              <p>
                My teaching philosophy is simple: language learning should be enjoyable, 
                personalized, and focused on real communication. I believe that every student 
                has the potential to master English when given the right support and guidance.
              </p>
              
              <p>
                At TinyTalks, we specialize in taking beginners to B1 level proficiency through 
                a combination of structured lessons, conversational practice, and engaging activities. 
                Whether you&apos;re learning for work, travel, or personal growth, I&apos;m here to support 
                you every step of the way.
              </p>
              
              <p className="font-semibold text-gray-900">
                Let&apos;s embark on this English learning journey together!
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-800 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">100+</span> students trust TinyTalks
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

