import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tinytalks.pro';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch all published blog posts
  const blogPosts: MetadataRoute.Sitemap = [];
  try {
    const { data, error } = await db.getBlogPosts(true); // Only published posts
    
    if (!error && data) {
      // Add both Russian and English versions
      data.forEach((post: { slug: string; slug_en?: string; updated_at: string }) => {
        // Add Russian version
        blogPosts.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });
        
        // Add English version if available
        if (post.slug_en) {
          blogPosts.push({
            url: `${baseUrl}/en/blog/${post.slug_en}`,
            lastModified: new Date(post.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Combine static and dynamic pages
  return [...staticPages, ...blogPosts];
}

