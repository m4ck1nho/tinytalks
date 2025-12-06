import { notFound } from 'next/navigation';
import { db } from '@/lib/supabase';
import { BlogPost } from '@/types';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { StructuredData } from '@/components/shared/StructuredData';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAllEnglishBlogPostSlugs(): Promise<string[]> {
  try {
    const { data, error } = await db.getBlogPosts(true);
    
    if (error || !data) {
      console.error('❌ Error fetching English blog post slugs:', error);
      return [];
    }
    
    return data
      .map((post: { slug_en?: string }) => post.slug_en)
      .filter((slug: string | undefined): slug is string => !!slug && slug.trim() !== '');
  } catch (error) {
    console.error('❌ Error fetching English blog post slugs:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllEnglishBlogPostSlugs();
  
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export const revalidate = 3600;
export const dynamic = 'force-static';

async function getBlogPostByEnSlug(slug: string): Promise<BlogPost | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    
    let { data, error } = await db.getPublishedBlogPostByEnSlug(decodedSlug);

    if ((error || !data) && decodedSlug !== slug) {
      const result = await db.getPublishedBlogPostByEnSlug(slug);
      if (!result.error && result.data) {
        data = result.data;
        error = null;
      }
    }

    if (error || !data) {
      return null;
    }

    return {
      ...data,
      slug: data.slug,
      slug_en: data.slug_en,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      metaDescription: data.meta_description,
    } as BlogPost;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostByEnSlug(slug);
  const baseUrl = 'https://tinytalks.pro';

  if (!post) {
    return {
      title: 'Post Not Found | TinyTalks',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  const plainTextContent = post.content.replace(/<[^>]*>/g, '').substring(0, 160);
  const description = post.metaDescription || post.excerpt || plainTextContent;
  const finalDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const postUrl = `${baseUrl}/en/blog/${slug}`;
  const ruPostUrl = post.slug ? `${baseUrl}/blog/${post.slug}` : null;

  const alternates: Metadata['alternates'] = {
    canonical: postUrl,
    languages: {},
  };

  alternates.languages!['en'] = postUrl;
  
  if (ruPostUrl) {
    alternates.languages!['ru'] = ruPostUrl;
  }

  return {
    title: `${post.title} | TinyTalks Blog`,
    description: finalDescription,
    keywords: ['learn english online', 'english tutor', 'online english lessons', 'английский онлайн', 'репетитор английского', 'english learning blog'],
    openGraph: {
      title: post.title,
      description: finalDescription,
      url: postUrl,
      siteName: 'TinyTalks',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: ['TinyTalks'],
      locale: 'en_US',
      alternateLocale: ruPostUrl ? ['ru_RU'] : undefined,
      images: post.image 
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: `${baseUrl}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: finalDescription,
      images: post.image ? [post.image] : [`${baseUrl}/images/twitter-card.jpg`],
    },
    alternates,
  };
}

export default async function EnglishBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  const post = await getBlogPostByEnSlug(slug);

  if (!post) {
    notFound();
  }

  // Calculate reading time on server (rough estimate: 200 words per minute)
  const words = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  const datePublished = new Date(post.created_at).toISOString().split('T')[0];
  const dateModified = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : datePublished;
  
  // Extract keywords from title and content for schema
  const extractKeywords = (title: string, content: string): string[] => {
    const commonKeywords = ['english', 'learning', 'study', 'lessons', 'tutor', 'online'];
    const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const contentWords = content.replace(/<[^>]*>/g, '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const uniqueWords = [...new Set([...titleWords, ...contentWords, ...commonKeywords])];
    return uniqueWords.slice(0, 10);
  };

  const keywords = extractKeywords(post.title, post.content);
  const postImage = post.image || 'https://tinytalks.pro/images/og-image.jpg';
  const imageUrl = postImage.startsWith('http') ? postImage : `https://tinytalks.pro${postImage.startsWith('/') ? '' : '/'}${postImage}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting' as const,
    headline: post.title,
    description: post.metaDescription || post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160),
    image: {
      '@type': 'ImageObject' as const,
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person' as const,
      name: 'Evgenia Penkova',
      url: 'https://tinytalks.pro',
      description: 'English teacher, founder of TinyTalks',
    },
    publisher: {
      '@type': 'Organization' as const,
      name: 'TinyTalks',
      logo: {
        '@type': 'ImageObject' as const,
        url: 'https://tinytalks.pro/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    keywords: keywords.join(', '),
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': `https://tinytalks.pro/en/blog/${slug}`,
    },
  };

  return (
    <>
      <StructuredData data={articleSchema} />
      <Navbar />
      <BlogPostContent post={post} readingTime={readingTime} />
      <Footer />
    </>
  );
}
