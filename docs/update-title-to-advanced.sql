-- Update site title from B1 to Advanced
-- Run this SQL in your Supabase SQL Editor if you've already set up the site_settings table

UPDATE public.site_settings
SET value = '{"title": "TinyTalks - Learn English with Confidence | Beginner to Advanced"}',
    updated_at = NOW()
WHERE key = 'site_title';

