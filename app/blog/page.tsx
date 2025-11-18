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
  title: 'Blog | TinyTalks - English Learning Tips & Guides',
  description: 'Explore our collection of helpful resources and articles to support your English learning journey. Get tips, learning strategies, and insights to accelerate your English progress.',
  keywords: ['learn english online', 'english tutor', 'online english lessons', 'английский онлайн', 'репетитор английского', 'english learning blog', 'english tips'],
  openGraph: {
    title: 'Blog | TinyTalks',
    description: 'Explore our collection of helpful resources and articles to support your English learning journey.',
    url: 'https://tinytalks.pro/blog',
    siteName: 'TinyTalks',
    images: [
      {
        url: 'https://tinytalks.pro/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TinyTalks Blog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | TinyTalks',
    description: 'Explore our collection of helpful resources and articles to support your English learning journey.',
    images: ['https://tinytalks.pro/images/twitter-card.jpg'],
  },
  alternates: {
    canonical: 'https://tinytalks.pro/blog',
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
