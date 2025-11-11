'use client';

import Image from 'next/image';
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Reviews() {
  const { t } = useLanguage();
  const reviews = [
    {
      name: 'Анна К.',
      content:
        'Евгения, добрый вечер! Спасибо! Прогресс чувствуется, сама приходит, чтобы ей помогли с домашним заданием. И оценки стали лучше по английскому.',
      rating: 5,
      image: '/images/АннаК.jpg',
    },
    {
      name: 'Юлия К.',
      content:
        'Женя, асинхронная неделя + один урок в неделю онлайн — идеально. Очень довольна и чувствую результат, потому что впервые работаю с языком ежедневно.',
      rating: 5,
      image: '/images/ЮлияKreview.jpg',
    },
    {
      name: 'Иван Д.',
      content:
        'Формат асинхрона — огонь! Удобно, гибко и виден прогресс. Спасибо за грамотную организацию процесса. Для занятых — must have.',
      rating: 5,
      image: '/images/ИванДReview.jpg',
    },
    {
      name: 'Екатерина С.',
      content:
        'Евгения, спасибо большое! Вы — внимательный и приятный преподаватель. Чувствуется профессионализм. С удовольствием иду на занятие, потому что интересно, что же на этот раз вы подготовили!',
      rating: 5,
      image: '/images/ReviewKate.jpg',
    },
    {
      name: 'Анастасия Б.',
      content:
        'Хочу поделиться впечатлением о первом занятии моего сына в группе по английскому языку. Урок прошёл в очень тёплой и дружелюбной атмосфере. Сын вышел с занятия с горящими глазами и сказал, что ему всё очень понравилось. Спасибо за отличный старт! Будем с радостью продолжать.',
      rating: 5,
    },
    {
      name: 'Мария Л.',
      content:
        'Дочка (8 лет) была увлечена и включена во всё занятие. Занимаемся по системе Phonics — чётко, понятно и в игровой форме. Спасибо за профессиональный подход и доброжелательную атмосферу!',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = reviews.length;

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-secondary-100 text-secondary-900 text-sm font-semibold px-4 py-2 rounded-full">
            {t('reviews.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-6 mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('reviews.description')}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <button
            type="button"
            onClick={showPrevious}
            aria-label={t('reviews.carousel.previous')}
            className="hidden md:flex absolute left-[-3rem] top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-white/90 border border-secondary-100 rounded-full shadow-lg shadow-secondary-200/60 hover:bg-secondary-50 transition-all duration-200"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>

          <div className="overflow-hidden rounded-3xl border border-secondary-100/60 shadow-xl shadow-secondary-200/30 bg-white/80 px-2 sm:px-4 md:px-6">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${totalSlides * 100}%`,
                transform: `translateX(-${(currentIndex * 100) / totalSlides}%)`,
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2 sm:px-4 md:px-6"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  <div className="h-full flex flex-col justify-between rounded-3xl bg-gradient-to-br from-white via-secondary-50/30 to-white border border-white shadow-lg shadow-secondary-200/40 px-6 sm:px-10 py-10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="flex gap-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>

                    <p className="text-gray-800 text-lg leading-relaxed italic relative">
                      <span className="absolute -top-5 left-0 text-6xl text-secondary-200/80">&ldquo;</span>
                      <span className="block pl-6 pr-2">{review.content}</span>
                    </p>

                    <div className="flex items-center gap-4 pt-6 border-t border-secondary-100">
                      {review.image ? (
                        <Image
                          src={review.image}
                          alt={review.name}
                          width={64}
                          height={64}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-secondary-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                          {review.name.charAt(0)}
                        </div>
                      )}

                      <div className="font-semibold text-secondary-900 text-lg">{review.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex md:hidden justify-center gap-3">
            <button
              type="button"
              onClick={showPrevious}
              aria-label={t('reviews.carousel.previous')}
              className="flex items-center justify-center w-10 h-10 bg-white/95 border border-secondary-100 rounded-full shadow-md hover:bg-secondary-50 transition-all duration-200"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={t('reviews.carousel.next')}
              className="flex items-center justify-center w-10 h-10 bg-white/95 border border-secondary-100 rounded-full shadow-md hover:bg-secondary-50 transition-all duration-200"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <button
            type="button"
            onClick={showNext}
            aria-label={t('reviews.carousel.next')}
            className="hidden md:flex absolute right-[-3rem] top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-white/90 border border-secondary-100 rounded-full shadow-lg shadow-secondary-200/60 hover:bg-secondary-50 transition-all duration-200"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${t('reviews.carousel.goTo')} ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index ? 'bg-secondary-900' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

