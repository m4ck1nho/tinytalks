/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tinytalks.pro',
  generateRobotsTxt: false, // Using static robots.txt file instead
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/dashboard/*',
    '/auth/*',
    '/api/*',
    '/test-supabase/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/auth/', '/api/'],
      },
    ],
    additionalSitemaps: [],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    } else if (path === '/blog') {
      priority = 0.8;
      changefreq = 'daily';
    } else if (path.startsWith('/blog/')) {
      priority = 0.7;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

