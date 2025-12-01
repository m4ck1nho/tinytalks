import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tinytalks.pro';

  // Static pages (top-level routes only)
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

  // Dynamic blog pages from Supabase (only published posts)
  const blogPosts: MetadataRoute.Sitemap = [];
  try {
    const { data, error } = await db.getBlogPosts(true);

    if (!error && data) {
      data.forEach(
        (post: { slug: string; updated_at: string | null | undefined }) => {
          if (!post.slug) return;

          blogPosts.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_at
              ? new Date(post.updated_at)
              : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        },
      );
    }
  } catch (error) {
    // Fail gracefully so build doesn't crash if Supabase is unavailable
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...blogPosts];
}

