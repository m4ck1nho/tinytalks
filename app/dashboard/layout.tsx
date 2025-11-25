import type { Metadata } from 'next';
import { createPageMetadata, NOINDEX_ROBOTS } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Личный кабинет TinyTalks',
  description: 'Управляйте расписанием, оплатами и домашними заданиями в личном кабинете TinyTalks.',
  path: '/dashboard',
  robots: NOINDEX_ROBOTS,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

