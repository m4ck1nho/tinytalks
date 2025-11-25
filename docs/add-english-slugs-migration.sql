-- Migration: Add English slug support for blog posts
-- Run this in your Supabase SQL Editor

-- Add slug_en column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_en ON public.blog_posts(slug_en);

-- Update existing posts: Generate English slugs from existing Russian slugs
-- This is a helper query - you may want to manually update each post
-- Example: slug 'pochemu-vazhno-delat-malenkie-shagi-kazhdyy-den' 
-- becomes slug_en 'why-small-daily-steps-matter-english-learning'

-- Note: You'll need to manually set slug_en for each existing post
-- Or use a translation service/API to convert slugs

COMMENT ON COLUMN public.blog_posts.slug_en IS 'English version of the slug for /en/blog/[slug] routes';

