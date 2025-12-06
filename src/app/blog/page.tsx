import { db } from '@/lib/supabase';
import { BlogPost } from '@/types';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { BlogList } from './BlogList';
import { BlogHeader } from './BlogHeader';
import type { Metadata } from 'next';

// Fetch blog posts on the server
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await db.getBlogPosts(true); // Only published posts
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return [];
    }
    
    // Map snake_case to camelCase and sort by date (newest first)
    const mappedPosts = (data || []).map(post => ({
      ...post,
      slug: post.slug,
      slug_en: post.slug_en,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      metaDescription: post.meta_description,
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return mappedPosts as BlogPost[];
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return [];
  }
}

// Always serve fresh data (blog posts change frequently)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Блог | Tiny Talks — Статьи об изучении английского',
  description: 'Полезные статьи и ресурсы для изучения английского языка. Советы, стратегии обучения и практические рекомендации от преподавателей Tiny Talks.',
  keywords: ['статьи об английском', 'изучение английского', 'советы по английскому', 'английский онлайн', 'репетитор английского', 'блог Tiny Talks'],
  openGraph: {
    title: 'Блог | Tiny Talks',
    description: 'Полезные статьи и ресурсы для изучения английского языка. Советы, стратегии обучения и практические рекомендации.',
    url: 'https://www.tinytalks.pro/blog',
    siteName: 'Tiny Talks',
    images: [
      {
        url: 'https://www.tinytalks.pro/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyTalks Blog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Блог | Tiny Talks',
    description: 'Полезные статьи и ресурсы для изучения английского языка. Советы, стратегии обучения и практические рекомендации.',
    images: ['https://www.tinytalks.pro/images/twitter-card.jpg'],
  },
  alternates: {
    canonical: 'https://www.tinytalks.pro/blog',
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
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <BlogHeader />
        <BlogList posts={posts} />
      </main>
      <Footer />
    </>
  );
}
