-- =====================================================
-- QUICK FIX: Update Supabase RLS Policies for Vercel
-- =====================================================
-- Copy and paste this entire file into Supabase SQL Editor
-- This will fix the blog post creation issue on Vercel
-- =====================================================

-- Step 1: Drop old incorrect policies
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON public.reviews;

DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog content images" ON storage.objects;

-- Step 2: Create correct policies using auth.uid() instead of auth.role()

-- Policies for blog_posts
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Policies for contact_messages
CREATE POLICY "Authenticated users can read messages" ON public.contact_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update messages" ON public.contact_messages
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete messages" ON public.contact_messages
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Policies for reviews
CREATE POLICY "Authenticated users can manage reviews" ON public.reviews
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Storage policies for blog-images
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

-- Storage policies for blog-content
CREATE POLICY "Authenticated users can upload blog content images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-content' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog content images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-content' AND auth.uid() IS NOT NULL);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Policies updated successfully! Your blog should now work on Vercel.';
END $$;

