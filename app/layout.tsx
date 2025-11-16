import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import FaviconUpdater from '@/components/shared/FaviconUpdater';
import TitleUpdater from '@/components/shared/TitleUpdater';
import { YandexMetrica } from '@/components/shared/YandexMetrica';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://tinytalks.pro'),
  title: {
    default: 'TinyTalks — Онлайн-уроки английского для детей и взрослых | Асинхронное обучение',
    template: '%s | TinyTalks',
  },
  description: 'Учите английский в своём темпе с TinyTalks. Асинхронные уроки по 15 минут + индивидуальные занятия онлайн. Без стресса и давления. Пробное занятие бесплатно.',
  keywords: ['онлайн уроки английского', 'асинхронное обучение английскому', 'репетитор английского', 'английский для детей онлайн'],
  authors: [{ name: 'TinyTalks' }],
  creator: 'TinyTalks',
  publisher: 'TinyTalks',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://tinytalks.pro',
    siteName: 'TinyTalks',
    title: 'TinyTalks — Онлайн-уроки английского для детей и взрослых | Асинхронное обучение',
    description: 'Учите английский в своём темпе с TinyTalks. Асинхронные уроки по 15 минут + индивидуальные занятия онлайн. Без стресса и давления. Пробное занятие бесплатно.',
    images: [
      {
        url: 'https://tinytalks.pro/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyTalks - Изучайте английский онлайн',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyTalks - Изучайте английский онлайн',
    description: 'Персональное обучение английскому',
    images: ['https://tinytalks.pro/images/twitter-card.jpg'],
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
    canonical: 'https://tinytalks.pro',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Yandex Logo Manifest */}
        <link rel="yandex-tableau-widget" href="/manifest-yandex.json" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="a12c8b207a493225" />
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7536252176755420"
          crossOrigin="anonymous"
        />
        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105348968', 'ym');

              ym(105348968, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/105348968"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
      </head>
      <body className={inter.className}>
        <FaviconUpdater />
        <TitleUpdater />
        {children}
        <Analytics />
        <SpeedInsights />
        <YandexMetrica />
      </body>
    </html>
  );
}
