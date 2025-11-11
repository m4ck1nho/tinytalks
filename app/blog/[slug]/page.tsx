'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/supabase';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { CalendarIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { t, language } = useLanguage();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'failed' | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('📖 Fetching blog post with slug:', slug);
        
        const { data, error } = await db.getBlogPosts();
        
        if (error) {
          console.error('❌ Error fetching posts:', error);
          throw error;
        }

        // Find the post by slug
        const foundPost = data?.find(p => p.slug === slug);
        
        if (!foundPost) {
          console.error('❌ Post not found with slug:', slug);
        setError('not_found');
          return;
        }

        // Only show if published (unless admin)
        if (!foundPost.published) {
          console.error('❌ Post is not published');
        setError('not_found');
          return;
        }

        console.log('✅ Blog post loaded:', foundPost.title);
        
        // Map database fields to component format
        const mappedPost = {
          ...foundPost,
          createdAt: foundPost.created_at,
          updatedAt: foundPost.updated_at,
          metaDescription: foundPost.meta_description,
        };
        
        setPost(mappedPost);
      } catch (err) {
        console.error('❌ Error loading blog post:', err);
      setError('failed');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Calculate reading time (rough estimate: 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  const locale = language === 'ru' ? 'ru-RU' : 'en-US';

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('blog.loadingSingle')}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    const title = t('blog.notFoundTitle');
    const message = t('blog.notFoundMessage');
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">{title}</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <button
              onClick={() => router.push('/#blog')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {t('blog.backToBlog')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
        {/* Hero Section with Featured Image */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-primary-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Back Button */}
            <button
              onClick={() => router.push('/#blog')}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors group bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t('blog.backToAll')}
            </button>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span>{calculateReadingTime(post.content)} {t('blog.minRead')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image (if exists) */}
        {post.image && (
          <div className="relative py-12 bg-white/30 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-8 sm:p-12">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-secondary-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-secondary-900
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-secondary-900
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-600
                prose-strong:text-secondary-900 prose-strong:font-semibold
                prose-ul:my-6 prose-li:text-gray-700
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
                prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:px-6
                prose-blockquote:italic prose-blockquote:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Back to Blog CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/#blog')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {t('blog.readMoreArticles')}
            </button>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

