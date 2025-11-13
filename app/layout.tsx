import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { HtmlLangWrapper } from '@/components/shared/HtmlLangWrapper';
import { Analytics } from '@vercel/analytics/next';
import FaviconUpdater from '@/components/shared/FaviconUpdater';
import TitleUpdater from '@/components/shared/TitleUpdater';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TinyTalks - Learn English with Confidence | Beginner to Advanced',
  description: 'Achieve Advanced level English through personalized learning. Expert teaching, engaging methods, and flexible online classes for beginners of all ages.',
  keywords: 'English learning, Advanced level, online English classes, beginner English, English teacher, language learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
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
        <LanguageProvider>
          <HtmlLangWrapper>
            {children}
          </HtmlLangWrapper>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
