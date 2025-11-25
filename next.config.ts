import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure no blocking headers are set
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          // Explicitly DO NOT set X-Google-Extended-Opt-Out (this blocks Google)
        ],
      },
    ];
  },
  // Note: www to non-www redirect should be configured in Vercel project settings
  // Go to: Vercel Dashboard -> Your Project -> Settings -> Domains -> Add Redirect Rule
  // Source: www.tinytalks.pro/*  Destination: https://tinytalks.pro/$1  (301)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Allow common image hosting services
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      // Allow any https image (for maximum flexibility with URL feature)
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
