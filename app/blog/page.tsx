'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { CalendarIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogPage() {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('🔍 Fetching all blog posts...');
        const { data, error } = await db.getBlogPosts(true); // Only published posts
        
        if (error) {
          console.error('❌ Supabase error:', error);
          throw error;
        }
        
        console.log('✅ Blog posts fetched:', data?.length || 0, 'posts');
        
        // Map snake_case to camelCase and sort by date (newest first)
        const mappedPosts = (data || []).map(post => ({
          ...post,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          metaDescription: post.meta_description,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setPosts(mappedPosts);
        setFilteredPosts(mappedPosts);
      } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="pt-20 pb-12 sm:pt-24 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header - Clean and Simple */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                {t('blog.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('blog.description')}
              </p>
            </div>

            {/* Search Bar - Simplified */}
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

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">{t('blog.loading')}</p>
              </div>
            )}

            {/* No Results */}
            {!loading && filteredPosts.length === 0 && (
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
            {!loading && filteredPosts.length > 0 && !searchQuery && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                  {t('blog.mostRecent') || 'Most Recent Posts'}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.slice(0, 6).map((post) => (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post.id}
                      className="group cursor-pointer"
                    >
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
                          <span>{calculateReadingTime(post.content)} {t('blog.minRead')}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-500 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <span className="text-primary-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all inline-block">
                          {t('blog.readMore')}
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results or All Posts */}
            {!loading && filteredPosts.length > 0 && searchQuery && (
              <>
                <div className="mb-8 text-gray-600">
                  <p>
                    {t('blog.resultsCount')} {filteredPosts.length} {getArticleWord(filteredPosts.length)}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post.id}
                      className="group cursor-pointer"
                    >
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
                          <span>{calculateReadingTime(post.content)} {t('blog.minRead')}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-500 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <span className="text-primary-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all inline-block">
                          {t('blog.readMore')}
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
