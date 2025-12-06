'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('🔍 Attempting to fetch blog posts...');
        const { data, error } = await db.getBlogPosts(true); // Only published posts
        
        if (error) {
          console.error('❌ Supabase error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          throw error;
        }
        
        console.log('✅ Blog posts fetched:', data?.length || 0, 'posts');
        console.log('First post data:', data?.[0]);
        
        // Map snake_case to camelCase and limit to 3 most recent
        const mappedPosts = (data || []).map(post => ({
          ...post,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          metaDescription: post.meta_description,
        })).slice(0, 3);
        
        setPosts(mappedPosts);
      } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        console.error('📋 Error details:', JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mx-auto mb-4"></div>
            <div className="text-gray-600">Загрузка статей...</div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
            Учебные ресурсы
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-6 mb-4">
            Советы и руководства для изучающих английский
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Узнайте полезные советы, стратегии обучения и идеи, которые ускорят ваш прогресс в английском
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Посмотреть все статьи
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/60 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
            >
              {post.image && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <CalendarIcon className="w-4 h-4 text-primary-500" />
                    {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                
                <h3 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                    <span className="text-primary-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Читать далее
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
