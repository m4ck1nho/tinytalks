import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import FaviconUpdater from '@/components/shared/FaviconUpdater';
import TitleUpdater from '@/components/shared/TitleUpdater';
import CanonicalLink from '@/components/shared/CanonicalLink';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tinytalks.pro'),
  title: {
    default:
      'TinyTalks- Английский для начинающих, асинхронное обучение за 15 минут в день',
    template: '%s | Tiny Talks',
  },
  description:
    'Учите английский в своём темпе с TinyTalks. Асинхронные уроки по 15 минут + индивидуальные занятия онлайн. Без стресса и давления. Пробное занятие бесплатно.',
  keywords: [
    'онлайн уроки английского',
    'асинхронное обучение английскому',
    'репетитор английского',
    'английский для детей онлайн',
  ],
  authors: [{ name: 'TinyTalks' }],
  creator: 'TinyTalks',
  publisher: 'TinyTalks',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://www.tinytalks.pro',
    siteName: 'Tiny Talks',
    title:
      'TinyTalks- Английский для начинающих, асинхронное обучение за 15 минут в день',
    description:
      'Учите английский в своём темпе с Tiny Talks. Асинхронные уроки по 15 минут + индивидуальные занятия онлайн. Без стресса и давления. Пробное занятие бесплатно.',
    images: [
      {
        url: 'https://www.tinytalks.pro/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyTalks - Изучайте английский онлайн',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'TinyTalks- Английский для начинающих, асинхронное обучение за 15 минут в день',
    description:
      'TinyTalks- Английский для начинающих, асинхронное обучение за 15 минут в день',
    images: ['https://www.tinytalks.pro/images/twitter-card.jpg'],
    creator: '@tinytalks',
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
  alternates: {
    canonical: '/',
  },
  other: {
    'google-site-verification': 'a12c8b207a493225',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Yandex Logo Manifest */}
        <link rel="yandex-tableau-widget" href="/manifest-yandex.json" />

      </head>
      <body className={inter.className}>
        <CanonicalLink />
        <FaviconUpdater />
        <TitleUpdater />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
