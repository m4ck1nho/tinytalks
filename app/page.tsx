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
    title: 'TinyTalks - Изучайте английский онлайн',
    description: 'Изучайте английский онлайн с персональным репетитором от начального до продвинутого уровня. Онлайн занятия с опытным преподавателем для русскоязычных.',
    keywords: ['английский онлайн', 'репетитор английского', 'онлайн уроки английского', 'изучение английского', 'английский для начинающих'],
    openGraph: {
      title: 'TinyTalks - Изучайте английский онлайн',
      description: 'Персональное обучение английскому от начального до продвинутого уровня',
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
    description: 'Профессиональное онлайн обучение английскому языку - от начального до продвинутого уровня. Персональные уроки с опытным преподавателем.',
    url: 'https://tinytalks.pro',
    logo: 'https://tinytalks.pro/images/logo.png',
    image: 'https://tinytalks.pro/images/og-image.jpg',
    email: 'info@tinytalks.pro',
    inLanguage: 'ru',
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
  };

  return (
    <>
      <StructuredData data={organizationSchema} />
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
