-- Settings Table for TinyTalks Admin Panel
-- Run this SQL in your Supabase SQL Editor

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can delete settings" ON public.site_settings;

-- Allow anyone to read settings (public data)
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Allow authenticated admin users to insert
CREATE POLICY "Authenticated users can insert settings" ON public.site_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated admin users to update
CREATE POLICY "Authenticated users can update settings" ON public.site_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow authenticated admin users to delete
CREATE POLICY "Authenticated users can delete settings" ON public.site_settings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Insert default settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('favicon', '{"url": "/favicon.ico"}', 'Website favicon URL'),
  ('site_title', '{"title": "TinyTalks - Learn English with Confidence | Beginner to Advanced"}', 'Website title'),
  ('pricing_trial', '{"price": "0", "currency": "₽"}', 'Trial lesson pricing'),
  ('pricing_individual', '{"price": "2000", "currency": "₽"}', 'Individual lesson pricing'),
  ('pricing_async', '{"price": "1000", "currency": "₽"}', 'Asynchronous learning pricing'),
  ('pricing_group', '{"price": "1250", "currency": "₽"}', 'Group lesson pricing')
ON CONFLICT (key) DO NOTHING;

