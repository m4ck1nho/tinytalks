import { getTranslations, type Language } from '@/lib/i18n-server';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero.server';
import About from '@/components/public/About.server';
import Pricing from '@/components/public/Pricing.server';
import Reviews from '@/components/public/Reviews.server';
import BlogPreview from '@/components/public/BlogPreview.server';
import Contact from '@/components/public/Contact.server';
import Footer from '@/components/public/Footer';
import { AnalyticsClient } from '@/components/shared/AnalyticsClient';
import { StructuredData } from '@/components/shared/StructuredData';
import type { Metadata } from 'next';

// Force static generation for homepage (default language: Russian)
export const dynamic = 'force-static';

// Default locale for static generation
const DEFAULT_LOCALE: Language = 'ru';

// Generate metadata for SEO (using default locale for static generation)
export function generateMetadata(): Metadata {
  const translations = getTranslations(DEFAULT_LOCALE);
  const baseUrl = 'https://tinytalks.pro';

  return {
    title: (translations.hero as any)?.title || 'TinyTalks - Learn English Online',
    description: 'Learn English online with personalized tutoring from beginner to advanced. Online lessons with native-level instructor for Russian speakers.',
    keywords: ['learn english online', 'english tutor', 'online english lessons', 'английский онлайн', 'репетитор английского'],
    openGraph: {
      title: 'TinyTalks - Learn English Online',
      description: 'Personalized English tutoring from beginner to advanced',
      url: baseUrl,
      siteName: 'TinyTalks',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'TinyTalks - Learn English Online',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TinyTalks - Learn English Online',
      description: 'Personalized English tutoring',
      images: [`${baseUrl}/images/twitter-card.jpg`],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default async function Home() {
  // For static generation, use default locale
  // Client-side language switching will still work via LanguageContext
  const locale: Language = DEFAULT_LOCALE;
  
  // Pre-render translations on the server (default: Russian)
  const translations = getTranslations(locale);

  // JSON-LD structured data for EducationalOrganization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization' as const,
    name: 'TinyTalks',
    description: 'Professional English teaching online - from beginner to advanced. Personalized lessons with experienced instructor.',
    url: 'https://tinytalks.pro',
    logo: 'https://tinytalks.pro/icon.png',
    image: 'https://tinytalks.pro/images/og-image.jpg',
    email: 'info@tinytalks.pro',
    contactPoint: {
      '@type': 'ContactPoint' as const,
      email: 'info@tinytalks.pro',
      contactType: 'Customer Service',
      availableLanguage: ['Russian', 'English'],
    },
    areaServed: {
      '@type': 'Place' as const,
      name: 'Worldwide',
    },
    offers: [
      {
        '@type': 'Offer' as const,
        name: 'Trial Lesson',
        description: 'Free 25-minute trial English lesson',
        price: '0',
        priceCurrency: 'RUB',
      },
      {
        '@type': 'Offer' as const,
        name: 'Individual Lesson',
        description: '60-minute individual English lesson',
        price: '2000',
        priceCurrency: 'RUB',
      },
      {
        '@type': 'Offer' as const,
        name: 'Asynchronous Learning',
        description: 'Weekly asynchronous English learning program',
        price: '1000',
        priceCurrency: 'RUB',
        priceSpecification: {
          '@type': 'UnitPriceSpecification' as const,
          price: '1000',
          priceCurrency: 'RUB',
          unitText: 'per week',
        },
      },
    ],
    address: {
      '@type': 'VirtualLocation' as const,
      name: 'Online Classes',
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
        <Hero translations={translations} locale={locale} />
        <div id="about">
          <About translations={translations} locale={locale} />
        </div>
        <div id="pricing">
          <Pricing translations={translations} locale={locale} />
        </div>
        <div id="reviews">
          <Reviews translations={translations} locale={locale} />
        </div>
        <div id="blog">
          <BlogPreview translations={translations} locale={locale} />
        </div>
        <div id="contact">
          <Contact translations={translations} locale={locale} />
        </div>
        <Footer />
      </main>
    </>
  );
}
