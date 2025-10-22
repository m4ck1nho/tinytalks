-- =====================================================
-- Create Admin User for TinyTalks
-- =====================================================
-- Run this in Supabase SQL Editor
-- Replace the email and password with your own
-- =====================================================

-- METHOD 1: Create a new admin user from scratch
-- Uncomment and modify the email/password below:

/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@tinytalks.com', -- ⚠️ CHANGE THIS to your email
  crypt('YourStrongPassword123!', gen_salt('bf')), -- ⚠️ CHANGE THIS to your password
  NOW(),
  '{"role": "admin"}'::jsonb,
  NOW(),
  NOW(),
  '',
  ''
);
*/

-- =====================================================
-- METHOD 2: Promote an existing user to admin
-- =====================================================
-- If you already created a user through the UI,
-- use this to make them an admin.
-- Replace 'your-email@example.com' with the actual email

UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'admin@tinytalks.com'; -- ⚠️ CHANGE THIS to your email

-- =====================================================
-- Verify the admin user was created/updated
-- =====================================================
-- Run this to check if it worked:

SELECT 
  id,
  email,
  raw_user_meta_data,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@tinytalks.com'; -- ⚠️ CHANGE THIS to your email

-- You should see the role: "admin" in the raw_user_meta_data column

