-- TinyTalks Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT,
  slug TEXT NOT NULL UNIQUE,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table (optional)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
-- Allow anyone to read published posts
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

-- Allow authenticated users (admin) to insert
CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update
CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for contact_messages
-- Allow anyone to insert (submit contact form)
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read messages
CREATE POLICY "Authenticated users can read messages" ON public.contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update messages
CREATE POLICY "Authenticated users can update messages" ON public.contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete messages
CREATE POLICY "Authenticated users can delete messages" ON public.contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for reviews
-- Allow anyone to read reviews
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

-- Only authenticated users can manage reviews
CREATE POLICY "Authenticated users can manage reviews" ON public.reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true),
       ('blog-content', 'blog-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-images
CREATE POLICY "Anyone can read blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Storage policies for blog-content
CREATE POLICY "Anyone can read blog content images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-content');

CREATE POLICY "Authenticated users can upload blog content images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-content' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog content images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-content' AND auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'TinyTalks database setup completed successfully!';
END $$;

