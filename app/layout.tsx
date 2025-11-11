import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { HtmlLangWrapper } from '@/components/shared/HtmlLangWrapper';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TinyTalks - Learn English with Confidence | Beginner to B1',
  description: 'Achieve B1 level English through personalized learning. Expert teaching, engaging methods, and flexible online classes for beginners of all ages.',
  keywords: 'English learning, B1 level, online English classes, beginner English, English teacher, language learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth" suppressHydrationWarning>
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
      </head>
      <body className={inter.className}>
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
