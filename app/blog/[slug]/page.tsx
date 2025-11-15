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

// Fetch all blog post slugs for static generation (Russian slugs)
async function getAllBlogPostSlugs(): Promise<string[]> {
  try {
    const { data, error } = await db.getBlogPosts(true); // Only published posts
    
    if (error || !data) {
      console.error('❌ Error fetching blog post slugs:', error);
      return [];
    }
    
    // Return all Russian slugs from published posts
    return data
      .map((post: { slug: string }) => post.slug)
      .filter((slug: string) => slug && slug.trim() !== '');
  } catch (error) {
    console.error('❌ Error fetching blog post slugs:', error);
    return [];
  }
}

// Generate static params at build time (equivalent to getStaticPaths)
export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  
  // Return array of params for static generation (Russian slugs)
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Enable ISR: Revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Force static generation (prefer static, but allow dynamic if needed)
export const dynamic = 'force-static';

// Fetch blog post data on the server (Russian slug)
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Decode URL-encoded slug
    const decodedSlug = decodeURIComponent(slug);
    
    // Try exact match first (Russian slug)
    let { data, error } = await db.getPublishedBlogPostByRuSlug(decodedSlug);

    // If not found, try with original slug
    if ((error || !data) && decodedSlug !== slug) {
      const result = await db.getPublishedBlogPostByRuSlug(slug);
      if (!result.error && result.data) {
        data = result.data;
        error = null;
      }
    }

    if (error || !data) {
      // Fallback: Try fetching all posts and match manually
      const { data: allPosts, error: allError } = await db.getBlogPosts(true);
      if (!allError && allPosts) {
        const matchingPost = allPosts.find((p: Record<string, unknown>) => {
          if (!p.published || typeof p.published !== 'boolean') return false;
          
          // Try multiple matching strategies
          const dbSlug = (p.slug as string) || '';
          const urlSlug = decodedSlug || slug;
          
          return (
            dbSlug === urlSlug ||
            dbSlug === slug ||
            dbSlug.toLowerCase() === urlSlug.toLowerCase() ||
            decodeURIComponent(dbSlug) === decodeURIComponent(urlSlug) ||
            encodeURIComponent(dbSlug) === encodeURIComponent(urlSlug)
          );
        });
        
        if (matchingPost) {
          return {
            ...matchingPost,
            createdAt: matchingPost.created_at as string,
            updatedAt: matchingPost.updated_at as string,
            metaDescription: matchingPost.meta_description as string | undefined,
          } as BlogPost;
        }
      }
      
      return null;
    }

    // Map database fields to component format
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

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const baseUrl = 'https://tinytalks.pro';

  if (!post) {
    return {
      title: 'Post Not Found | TinyTalks',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  // Strip HTML tags from content for meta description
  const plainTextContent = post.content.replace(/<[^>]*>/g, '').substring(0, 160);
  const description = post.metaDescription || post.excerpt || plainTextContent;
  const finalDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const postUrl = `${baseUrl}/blog/${slug}`;
  const enPostUrl = post.slug_en ? `${baseUrl}/en/blog/${post.slug_en}` : null;

  // Build hreflang alternates
  const alternates: Metadata['alternates'] = {
    canonical: postUrl,
    languages: {},
  };

  // Add Russian version
  alternates.languages!['ru'] = postUrl;
  
  // Add English version if available
  if (enPostUrl) {
    alternates.languages!['en'] = enPostUrl;
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
      locale: 'ru_RU',
      alternateLocale: enPostUrl ? ['en_US'] : undefined,
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Calculate reading time (rough estimate: 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  // Format dates for schema
  const datePublished = new Date(post.created_at).toISOString().split('T')[0];
  const dateModified = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : datePublished;
  
  // JSON-LD structured data for BlogPosting
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting' as const,
    headline: post.title,
    description: post.metaDescription || post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160),
    image: post.image || 'https://tinytalks.pro/images/og-image.jpg',
    author: {
      '@type': 'Person' as const,
      name: 'Evgenia Penkova',
      url: 'https://tinytalks.pro',
    },
    publisher: {
      '@type': 'Organization' as const,
      name: 'TinyTalks',
      logo: {
        '@type': 'ImageObject' as const,
        url: 'https://tinytalks.pro/icon.png',
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': `https://tinytalks.pro/blog/${slug}`,
    },
  };

  return (
    <>
      <StructuredData data={articleSchema} />
      <Navbar />
      <BlogPostContent post={post} calculateReadingTime={calculateReadingTime} />
      <Footer />
    </>
  );
}

