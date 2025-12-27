import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Note: apex to www redirect should be configured in Vercel project settings
  // Go to: Vercel Dashboard -> Project -> Settings -> Domains -> Add Redirect Rule
  // Source: tinytalks.pro/*  Destination: https://www.tinytalks.pro/$1  (301)
  images: {
    remotePatterns: [
      // Own domain (for absolute URLs)
      {
        protocol: 'https',
        hostname: 'www.tinytalks.pro',
      },
      {
        protocol: 'https',
        hostname: 'tinytalks.pro',
      },
      // Supabase storage
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
      // Uploadthing
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
      },
      {
        protocol: 'http',
        hostname: '**.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: '**.uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      // Stock photo services
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      // Allow any https image as fallback
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
