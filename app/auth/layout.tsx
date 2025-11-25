import type { Metadata } from 'next';
import { createPageMetadata, NOINDEX_ROBOTS } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Вход и регистрация | TinyTalks',
  description: 'Войдите или создайте аккаунт TinyTalks, чтобы получить доступ к личному кабинету и своим занятиям.',
  path: '/auth',
  robots: NOINDEX_ROBOTS,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

