'use client';

import { useMemo, useState, useEffect } from 'react';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts: initialPosts }: BlogListProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts] = useState<BlogPost[]>(initialPosts);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
  }, [searchQuery, posts]);

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const locale = language === 'ru' ? 'ru-RU' : 'en-US';

  const getArticleWord = (count: number): string => {
    if (language === 'ru') {
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return t('blog.articles.one');
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return t('blog.articles.few');
      return t('blog.articles.many');
    }
    return count === 1 ? t('blog.articles.one') : t('blog.articles.few');
  };

  const POSTS_PER_PAGE = 6;
  const RECENT_LIMIT = 6;
  const isSearching = searchQuery.trim().length > 0;
  const showRecent = !isSearching && filteredPosts.length > RECENT_LIMIT;

  const recentPosts = useMemo(() => {
    if (!showRecent) return [];
    return filteredPosts.slice(0, RECENT_LIMIT);
  }, [filteredPosts, showRecent]);

  const totalPages = filteredPosts.length > 0 ? Math.ceil(filteredPosts.length / POSTS_PER_PAGE) : 1;

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const renderPostCard = (post: BlogPost) => (
    <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer">
      {post.image && (
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>
            {new Date(post.createdAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="mx-2">•</span>
          <span>
            {calculateReadingTime(post.content)} {t('blog.minRead')}
          </span>
        </div>

        <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-500 transition-colors leading-tight">
          {post.title}
        </h3>

        <p className="text-gray-600 line-clamp-3 leading-relaxed">{post.excerpt}</p>

        <span className="text-primary-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all inline-block">
          {t('blog.readMore')}
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-base bg-white"
            />
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block mb-4">
              <span className="text-6xl">📝</span>
            </div>
            <p className="text-xl text-gray-600 mb-4">
              {searchQuery ? t('blog.noResults') : t('blog.noPosts')}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
              >
                {t('blog.clearSearch')}
              </button>
            )}
          </div>
        )}

        {/* Most Recent Posts Section */}
        {recentPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              {t('blog.mostRecent') || 'Most Recent Posts'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => renderPostCard(post))}
            </div>
          </div>
        )}

        {/* Paginated Posts */}
        {filteredPosts.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  {isSearching ? t('blog.searchResults') : t('blog.allArticles') || t('blog.readMoreArticles')}
                </h2>
                <p>
                  {t('blog.resultsCount')} {filteredPosts.length} {getArticleWord(filteredPosts.length)}
                </p>
              </div>
              {totalPages > 1 && (
                <div className="text-sm text-gray-500">
                  {t('blog.pagination.page')} {currentPage} {t('blog.pagination.of')} {totalPages}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => renderPostCard(post))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border border-gray-300 font-semibold transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t('blog.pagination.previous')}
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border border-gray-300 font-semibold transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t('blog.pagination.next')}
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

