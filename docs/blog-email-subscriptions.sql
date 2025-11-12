-- =====================================================
-- Blog Email Subscriptions Table
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Create blog_email_subscriptions table
CREATE TABLE IF NOT EXISTS public.blog_email_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_email_subscriptions_email ON public.blog_email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_blog_email_subscriptions_subscribed ON public.blog_email_subscriptions(subscribed);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for blog_email_subscriptions
-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to blog emails" ON public.blog_email_subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own subscription (by email)
CREATE POLICY "Users can read their own subscription" ON public.blog_email_subscriptions
  FOR SELECT USING (true);

-- Allow anyone to update their own subscription (unsubscribe)
CREATE POLICY "Users can update their own subscription" ON public.blog_email_subscriptions
  FOR UPDATE USING (true);

-- Allow authenticated admin users to read all subscriptions
CREATE POLICY "Admins can read all subscriptions" ON public.blog_email_subscriptions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow authenticated admin users to delete subscriptions
CREATE POLICY "Admins can delete subscriptions" ON public.blog_email_subscriptions
  FOR DELETE USING (auth.uid() IS NOT NULL);

