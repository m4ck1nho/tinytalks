import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
