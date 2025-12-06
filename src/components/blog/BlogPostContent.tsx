'use client';

import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { BlogCTA } from './BlogCTA';

interface BlogPostContentProps {
  post: BlogPost;
  readingTime: number;
}

export function BlogPostContent({ post, readingTime }: BlogPostContentProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Назад ко всем статьям
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>{readingTime} мин чтения</span>
            </div>
          </div>
        </div>
      </div>

      {post.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title || 'Изображение статьи'}
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

        <BlogCTA />
      </article>
    </main>
  );
}
