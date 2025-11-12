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
import BlogSubscribeForm from '@/components/public/BlogSubscribeForm';

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
        <div className="min-h-screen flex items-center justify-center bg-white">
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
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">{title}</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <button
              onClick={() => router.push('/blog')}
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
      <main className="min-h-screen bg-white">
        {/* Header Section - Clean and Simple */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
              onClick={() => router.push('/blog')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {t('blog.backToAll')}
            </button>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>{calculateReadingTime(post.content)} {t('blog.minRead')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image (if exists) */}
        {post.image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-secondary-900
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-secondary-900
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-secondary-900
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-600
              prose-strong:text-secondary-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:space-y-2 prose-li:text-gray-700 prose-li:leading-relaxed
              prose-ol:my-6 prose-ol:space-y-2 prose-li:text-gray-700 prose-li:leading-relaxed
              prose-img:rounded-lg prose-img:my-8 prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
              prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-6
              prose-blockquote:italic prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Email Subscription Section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <BlogSubscribeForm variant="compact" />
          </div>

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {t('blog.ctaTitle') || 'Ready to Start Learning?'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t('blog.ctaDescription') || 'Join TinyTalks today and start your language learning journey with expert teachers.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/#pricing')}
                  className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t('blog.ctaButton') || 'Get Started'}
                </button>
                <button
                  onClick={() => router.push('/blog')}
                  className="px-8 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t('blog.readMoreArticles')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

