-- =====================================================
-- TinyTalks Complete Database Migration Script
-- =====================================================
-- This script creates a complete copy of your current database
-- Run this in your NEW Supabase project SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CORE TABLES
-- =====================================================

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

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CLASS MANAGEMENT TABLES
-- =====================================================

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  class_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  class_type TEXT,
  topic TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid')),
  payment_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create homework table
CREATE TABLE IF NOT EXISTS public.homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'reviewed', 'completed')),
  submission_text TEXT,
  submission_file_url TEXT,
  submitted_at TIMESTAMPTZ,
  teacher_feedback TEXT,
  grade TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_notifications table
CREATE TABLE IF NOT EXISTS public.payment_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  class_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_date DATE NOT NULL,
  reference_number TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create class_requests table
CREATE TABLE IF NOT EXISTS public.class_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  preferred_date TIMESTAMPTZ,
  preferred_time TEXT,
  topic TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'awaiting_payment', 'payment_confirmed', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

-- Classes indexes
CREATE INDEX IF NOT EXISTS idx_classes_student_id ON classes(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_class_date ON classes(class_date);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_payment_status ON classes(payment_status);

-- Homework indexes
CREATE INDEX IF NOT EXISTS idx_homework_student_id ON homework(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_due_date ON homework(due_date);
CREATE INDEX IF NOT EXISTS idx_homework_status ON homework(status);

-- Payment notifications indexes
CREATE INDEX IF NOT EXISTS idx_payment_notifications_student_id ON payment_notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_class_id ON payment_notifications(class_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_status ON payment_notifications(status);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_payment_date ON payment_notifications(payment_date);

-- Class requests indexes
CREATE INDEX IF NOT EXISTS idx_class_requests_student_id ON class_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_class_requests_status ON class_requests(status);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. BLOG POSTS POLICIES
-- =====================================================

-- Allow anyone to read published posts
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

-- Allow authenticated users (admin) to insert
CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users (admin) to update
CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users (admin) to delete
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 6. CONTACT MESSAGES POLICIES
-- =====================================================

-- Allow anyone to insert (submit contact form)
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read messages
CREATE POLICY "Authenticated users can read messages" ON public.contact_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only authenticated users can update messages
CREATE POLICY "Authenticated users can update messages" ON public.contact_messages
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete messages
CREATE POLICY "Authenticated users can delete messages" ON public.contact_messages
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 7. REVIEWS POLICIES
-- =====================================================

-- Allow anyone to read reviews
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

-- Only authenticated users can manage reviews
CREATE POLICY "Authenticated users can manage reviews" ON public.reviews
  FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 8. CLASSES POLICIES
-- =====================================================

-- Students can view their own classes
CREATE POLICY "Students can view own classes" ON classes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Admins can view all classes
CREATE POLICY "Admins can view all classes" ON classes
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can insert classes
CREATE POLICY "Admins can create classes" ON classes
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can update classes
CREATE POLICY "Admins can update classes" ON classes
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can delete classes
CREATE POLICY "Admins can delete classes" ON classes
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =====================================================
-- 9. HOMEWORK POLICIES
-- =====================================================

-- Students can view their own homework
CREATE POLICY "Students can view own homework" ON homework
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Admins can view all homework
CREATE POLICY "Admins can view all homework" ON homework
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can create homework
CREATE POLICY "Admins can create homework" ON homework
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Students can update their own homework (submit)
CREATE POLICY "Students can submit homework" ON homework
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Admins can update all homework
CREATE POLICY "Admins can update all homework" ON homework
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can delete homework
CREATE POLICY "Admins can delete homework" ON homework
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =====================================================
-- 10. PAYMENT NOTIFICATIONS POLICIES
-- =====================================================

-- Students can view their own payment notifications
CREATE POLICY "Students can view own payment notifications" ON payment_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Admins can view all payment notifications
CREATE POLICY "Admins can view all payment notifications" ON payment_notifications
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Students and admins can create payment notifications
CREATE POLICY "Students and admins can create payment notifications"
ON payment_notifications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = student_id
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Admins can update all payment notifications
CREATE POLICY "Admins can update payment notifications" ON payment_notifications
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can delete payment notifications
CREATE POLICY "Admins can delete payment notifications" ON payment_notifications
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =====================================================
-- 11. CLASS REQUESTS POLICIES
-- =====================================================

-- Students can create their own requests
CREATE POLICY "Students can create class requests"
  ON class_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Students can view their own requests
CREATE POLICY "Students can view own class requests"
  ON class_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all class requests"
  ON class_requests
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can update all requests
CREATE POLICY "Admins can update class requests"
  ON class_requests
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admins can delete requests
CREATE POLICY "Admins can delete class requests"
  ON class_requests
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- =====================================================
-- 12. STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true),
       ('blog-content', 'blog-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-images
CREATE POLICY "Anyone can read blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

-- Storage policies for blog-content
CREATE POLICY "Anyone can read blog content images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-content');

CREATE POLICY "Authenticated users can upload blog content images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-content' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog content images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-content' AND auth.uid() IS NOT NULL);

-- =====================================================
-- 13. TRIGGER FUNCTIONS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables with updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homework_updated_at
BEFORE UPDATE ON homework
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_notifications_updated_at
BEFORE UPDATE ON payment_notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_requests_updated_at
BEFORE UPDATE ON class_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'TinyTalks Complete Database Migration completed successfully!';
  RAISE NOTICE 'All tables, policies, indexes, and triggers have been created.';
  RAISE NOTICE 'You can now copy your data from the old database.';
END $$;
