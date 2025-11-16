import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Pricing from '@/components/public/Pricing';
import Reviews from '@/components/public/Reviews';
import BlogPreview from '@/components/public/BlogPreview';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import { AnalyticsClient } from '@/components/shared/AnalyticsClient';
import { StructuredData } from '@/components/shared/StructuredData';
import type { Metadata } from 'next';

// Force static generation for homepage
export const dynamic = 'force-static';

// Generate metadata for SEO
export function generateMetadata(): Metadata {
  const baseUrl = 'https://tinytalks.pro';

  return {
    title: 'TinyTalks — Онлайн-уроки английского для детей и взрослых | Асинхронное обучение',
    description: 'Учите английский в своём темпе с TinyTalks. Асинхронные уроки по 15 минут + индивидуальные занятия онлайн. Без стресса и давления. Пробное занятие бесплатно.',
    keywords: ['онлайн уроки английского', 'асинхронное обучение английскому', 'репетитор английского', 'английский для детей онлайн'],
    openGraph: {
      title: 'TinyTalks — Онлайн-уроки английского для детей и взрослых | Асинхронное обучение',
      description: 'Учите английский в своём темпе с TinyTalks. Асинхронные уроки по 15 минут + индивидуальные занятия онлайн. Без стресса и давления. Пробное занятие бесплатно.',
      url: baseUrl,
      siteName: 'TinyTalks',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'TinyTalks - Изучайте английский онлайн',
        },
      ],
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TinyTalks - Изучайте английский онлайн',
      description: 'Персональное обучение английскому',
      images: [`${baseUrl}/images/twitter-card.jpg`],
    },
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function Home() {
  // JSON-LD structured data for EducationalOrganization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization' as const,
    name: 'TinyTalks',
    description: 'Онлайн-школа английского языка с асинхронным обучением',
    url: 'https://tinytalks.pro',
    logo: {
      '@type': 'ImageObject' as const,
      url: 'https://tinytalks.pro/web-app-manifest-512x512.png',
      width: 512,
      height: 512,
    },
    image: {
      '@type': 'ImageObject' as const,
      url: 'https://tinytalks.pro/web-app-manifest-512x512.png',
      width: 512,
      height: 512,
    },
    email: 'info@tinytalks.pro',
    inLanguage: 'ru',
    founder: {
      '@type': 'Person' as const,
      name: 'Евгения Пенькова',
    },
    addressCountry: 'RU',
    contactPoint: {
      '@type': 'ContactPoint' as const,
      email: 'info@tinytalks.pro',
      contactType: 'Customer Service',
      availableLanguage: ['Russian'],
    },
    areaServed: [
      {
        '@type': 'Country' as const,
        name: 'Russia',
      },
      {
        '@type': 'Country' as const,
        name: 'Kazakhstan',
      },
      {
        '@type': 'Country' as const,
        name: 'Belarus',
      },
      {
        '@type': 'Place' as const,
        name: 'Worldwide',
      },
    ],
    offers: [
      {
        '@type': 'Offer' as const,
        name: 'Пробное занятие',
        description: 'Бесплатное 25-минутное пробное занятие по английскому',
        price: '0',
        priceCurrency: 'RUB',
      },
      {
        '@type': 'Offer' as const,
        name: 'Индивидуальное занятие',
        description: '60-минутное индивидуальное занятие по английскому',
        price: '2000',
        priceCurrency: 'RUB',
      },
      {
        '@type': 'Offer' as const,
        name: 'Асинхронное микрообучение',
        description: 'Еженедельная программа асинхронного изучения английского',
        price: '1000',
        priceCurrency: 'RUB',
        priceSpecification: {
          '@type': 'UnitPriceSpecification' as const,
          price: '1000',
          priceCurrency: 'RUB',
          unitText: 'в неделю',
        },
      },
    ],
    address: {
      '@type': 'VirtualLocation' as const,
      name: 'Онлайн-занятия',
    },
    sameAs: [
      'https://t.me/TinytalksPro',
      'https://www.instagram.com/tinytalks.pro',
    ],
    aggregateRating: {
      '@type': 'AggregateRating' as const,
      ratingValue: '5',
      reviewCount: '6',
    },
  };

  // Individual Review schemas
  const reviewSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Review' as const,
      author: {
        '@type': 'Person' as const,
        name: 'Анна К.',
      },
      reviewBody: 'Евгения, добрый вечер! Спасибо! Прогресс чувствуется, сама приходит, чтобы ей помогли с домашним заданием. И оценки стали лучше по английскому.',
      reviewRating: {
        '@type': 'Rating' as const,
        ratingValue: '5',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Review' as const,
      author: {
        '@type': 'Person' as const,
        name: 'Юлия К.',
      },
      reviewBody: 'Женя, асинхронная неделя + один урок в неделю онлайн — идеально. Очень довольна и чувствую результат, потому что впервые работаю с языком ежедневно.',
      reviewRating: {
        '@type': 'Rating' as const,
        ratingValue: '5',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Review' as const,
      author: {
        '@type': 'Person' as const,
        name: 'Иван Д.',
      },
      reviewBody: 'Формат асинхрона — огонь! Удобно, гибко и виден прогресс. Спасибо за грамотную организацию процесса. Для занятых — must have.',
      reviewRating: {
        '@type': 'Rating' as const,
        ratingValue: '5',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Review' as const,
      author: {
        '@type': 'Person' as const,
        name: 'Екатерина С.',
      },
      reviewBody: 'Евгения, спасибо большое! Вы — внимательный и приятный преподаватель. Чувствуется профессионализм. С удовольствием иду на занятие, потому что интересно, что же на этот раз вы подготовили!',
      reviewRating: {
        '@type': 'Rating' as const,
        ratingValue: '5',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Review' as const,
      author: {
        '@type': 'Person' as const,
        name: 'Анастасия Б.',
      },
      reviewBody: 'Хочу поделиться впечатлением о первом занятии моего сына в группе по английскому языку. Урок прошёл в очень тёплой и дружелюбной атмосфере. Сын вышел с занятия с горящими глазами и сказал, что ему всё очень понравилось. Спасибо за отличный старт! Будем с радостью продолжать.',
      reviewRating: {
        '@type': 'Rating' as const,
        ratingValue: '5',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Review' as const,
      author: {
        '@type': 'Person' as const,
        name: 'Мария Л.',
      },
      reviewBody: 'Дочка (8 лет) была увлечена и включена во всё занятие. Занимаемся по системе Phonics — чётко, понятно и в игровой форме. Спасибо за профессиональный подход и доброжелательную атмосферу!',
      reviewRating: {
        '@type': 'Rating' as const,
        ratingValue: '5',
      },
    },
  ];

  return (
    <>
      <StructuredData data={organizationSchema} />
      {reviewSchemas.map((review, index) => (
        <StructuredData key={index} data={review} />
      ))}
      <AnalyticsClient />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <div id="about">
          <About />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="reviews">
          <Reviews />
        </div>
        <div id="blog">
          <BlogPreview />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <Footer />
      </main>
    </>
  );
}
