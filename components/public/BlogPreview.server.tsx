import { db } from '@/lib/supabase';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/lib/i18n-server';

interface BlogPreviewProps {
  translations: Record<string, unknown>;
  locale: Language;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await db.getBlogPosts(true); // Only published posts
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return [];
    }
    
    // Map snake_case to camelCase and limit to 3 most recent
    const mappedPosts = (data || []).map(post => ({
      ...post,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      metaDescription: post.meta_description,
    })).slice(0, 3);
    
    return mappedPosts as BlogPost[];
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPreview({ translations, locale }: BlogPreviewProps) {
  const posts = await getBlogPosts();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    return typeof value === 'string' ? value : key;
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
            {t('blog.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-6 mb-4">
            {t('blog.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('blog.previewDescription')}
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t('blog.viewAll')}
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
                    {new Date(post.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
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
                      {t('blog.readMore')}
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

