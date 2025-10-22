'use client';

import { StarIcon } from '@heroicons/react/24/solid';

export default function Reviews() {
  const reviews = [
    {
      name: 'Anna K.',
      content: 'I started as a complete beginner and reached B1 level in just 8 months! Evgenia&apos;s teaching methods are incredibly effective and the lessons are always engaging.',
      rating: 5,
      role: 'Business Professional',
    },
    {
      name: 'Dmitry S.',
      content: 'The personalized approach made all the difference. I can now confidently communicate in English for my work meetings. Highly recommend TinyTalks!',
      rating: 5,
      role: 'Software Engineer',
    },
    {
      name: 'Maria L.',
      content: 'Best English teacher I\'ve had! The lessons are well-structured and fun. I especially love the speaking practice - it really builds confidence.',
      rating: 5,
      role: 'Student',
    },
    {
      name: 'Pavel M.',
      content: 'I was nervous about learning English as an adult, but Evgenia made it comfortable and enjoyable. My progress has exceeded my expectations!',
      rating: 5,
      role: 'Entrepreneur',
    },
    {
      name: 'Elena R.',
      content: 'The flexible scheduling and online format fit perfectly into my busy life. The quality of teaching is outstanding - worth every penny!',
      rating: 5,
      role: 'Marketing Manager',
    },
    {
      name: 'Sergei V.',
      content: 'After trying several language schools, I finally found TinyTalks. The individual attention and customized lessons helped me achieve my goals quickly.',
      rating: 5,
      role: 'Medical Professional',
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-secondary-100 text-secondary-900 text-sm font-semibold px-4 py-2 rounded-full">
            Student Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of satisfied students who achieved their English learning goals with TinyTalks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              
              {/* Review Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;{review.content}&quot;
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-800 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-600">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">100+</div>
            <div className="text-gray-600">Happy Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary-900 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">5+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}

