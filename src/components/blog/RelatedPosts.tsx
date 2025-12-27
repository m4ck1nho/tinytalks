'use client';

import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const FALLBACK_IMAGE = '/images/og-image.jpg';
const SITE_URL = 'https://www.tinytalks.pro';

const resolveImageUrl = (url?: string | null) => {
  if (!url || url.trim() === '') return FALLBACK_IMAGE;
  if (url.startsWith('http')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface RelatedPostsProps {
  currentPostSlug: string;
  posts: BlogPost[];
  limit?: number;
}

export function RelatedPosts({ currentPostSlug, posts, limit = 3 }: RelatedPostsProps) {
  // Filter out current post and get related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentPostSlug && post.published)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-secondary-900 mb-8">Читайте также</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {(
              <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                <Image
                  src={resolveImageUrl(post.image)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt || post.metaDescription || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors group/link"
              >
                Читать далее
                <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

