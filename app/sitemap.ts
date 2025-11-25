import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tinytalks.pro';
  
  // Static pages
  const importantPages: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const staticPages: MetadataRoute.Sitemap = importantPages.map((page) => ({
    url: `${baseUrl}${page.path === '/' ? '' : page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Fetch all published blog posts
  const blogPosts: MetadataRoute.Sitemap = [];
  try {
    const { data, error } = await db.getBlogPosts(true); // Only published posts
    
    if (!error && data) {
      // Add Russian blog posts only - English pages removed and redirecting to homepage
      data.forEach((post: { slug: string; slug_en?: string; updated_at: string }) => {
        blogPosts.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Combine static and dynamic pages
  return [...staticPages, ...blogPosts];
}

