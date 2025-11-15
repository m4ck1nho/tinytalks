import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { HtmlLangWrapper } from '@/components/shared/HtmlLangWrapper';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import FaviconUpdater from '@/components/shared/FaviconUpdater';
import TitleUpdater from '@/components/shared/TitleUpdater';
import { getTranslations, type Language } from '@/lib/i18n-server';

const inter = Inter({ subsets: ['latin'] });

// Default locale for server-side rendering
const DEFAULT_LOCALE: Language = 'ru';

export const metadata: Metadata = {
  metadataBase: new URL('https://tinytalks.pro'),
  title: {
    default: 'TinyTalks - Learn English Online',
    template: '%s | TinyTalks',
  },
  description: 'Learn English online with personalized tutoring from beginner to advanced. Online lessons with native-level instructor for Russian speakers.',
  keywords: ['learn english online', 'english tutor', 'online english lessons', 'английский онлайн', 'репетитор английского', 'English learning', 'Advanced level', 'online English classes', 'beginner English', 'English teacher', 'language learning'],
  authors: [{ name: 'TinyTalks' }],
  creator: 'TinyTalks',
  publisher: 'TinyTalks',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ru_RU'],
    url: 'https://tinytalks.pro',
    siteName: 'TinyTalks',
    title: 'TinyTalks - Learn English Online',
    description: 'Personalized English tutoring from beginner to advanced',
    images: [
      {
        url: 'https://tinytalks.pro/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyTalks - Learn English Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyTalks - Learn English Online',
    description: 'Personalized English tutoring',
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
    languages: {
      'en': 'https://tinytalks.pro',
      'ru': 'https://tinytalks.pro',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-render translations on the server for SSR
  const initialTranslations = getTranslations(DEFAULT_LOCALE);

  return (
    <html lang={DEFAULT_LOCALE} className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedLanguage = localStorage.getItem('language');
                  if (savedLanguage === 'en' || savedLanguage === 'ru') {
                    document.documentElement.lang = savedLanguage;
                  }
                } catch (e) {
                  // localStorage not available, use default
                }
              })();
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7536252176755420"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <FaviconUpdater />
        <TitleUpdater />
        <LanguageProvider initialLanguage={DEFAULT_LOCALE} initialTranslations={initialTranslations}>
          <HtmlLangWrapper>
            {children}
          </HtmlLangWrapper>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
