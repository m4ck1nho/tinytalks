'use client';

import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPostContentProps {
  post: BlogPost;
  readingTime: number;
}

export function BlogPostContent({ post, readingTime }: BlogPostContentProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('blog.backToAll')}
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4 leading-tight">
            {post.title}
          </h1>

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
              <span>{readingTime} {t('blog.minRead')}</span>
            </div>
          </div>
        </div>
      </div>

      {post.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

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
            prose-img:rounded-lg prose-img:my-8 prose-img:shadow-md prose-img:max-w-full prose-img:h-auto prose-img:w-auto prose-img:block
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
            prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-6
            prose-blockquote:italic prose-blockquote:text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t('blog.readMoreArticles')}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
