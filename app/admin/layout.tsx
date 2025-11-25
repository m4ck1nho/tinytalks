import type { Metadata } from 'next';
import { createPageMetadata, NOINDEX_ROBOTS } from '@/lib/seo';
import AdminShell from './AdminShell';

export const metadata: Metadata = createPageMetadata({
  title: 'Админ-панель TinyTalks',
  description: 'Защищённая панель TinyTalks для управления уроками, блогом и настройками школы.',
  path: '/admin',
  robots: NOINDEX_ROBOTS,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

