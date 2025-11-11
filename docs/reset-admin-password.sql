-- =====================================================
-- Reset Admin Password for TinyTalks
-- =====================================================
-- Run this in Supabase SQL Editor
-- Replace the email and new password with your own
-- =====================================================

-- METHOD 1: Update existing admin user password
-- Replace 'admin@tinytalks.com' with your actual admin email
-- Replace 'NewStrongPassword123!' with your new password

UPDATE auth.users
SET 
  encrypted_password = crypt('NewStrongPassword123!', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'admin@tinytalks.com';

-- =====================================================
-- METHOD 2: Create a completely new admin user
-- =====================================================
-- Use this if you want to create a fresh admin account
-- Uncomment and modify the details below:

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
  'newadmin@tinytalks.com', -- ⚠️ CHANGE THIS to your email
  crypt('NewStrongPassword123!', gen_salt('bf')), -- ⚠️ CHANGE THIS to your password
  NOW(),
  '{"role": "admin"}'::jsonb,
  NOW(),
  NOW(),
  '',
  ''
);
*/

-- =====================================================
-- METHOD 3: Check existing admin users
-- =====================================================
-- Run this first to see what admin users exist:

SELECT 
  id,
  email,
  raw_user_meta_data,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin'
   OR email LIKE '%admin%';

-- =====================================================
-- METHOD 4: Promote existing user to admin
-- =====================================================
-- If you have a regular user account and want to make it admin:

/*
UPDATE auth.users
SET 
  raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
      ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
    END,
  updated_at = NOW()
WHERE email = 'your-email@example.com'; -- ⚠️ CHANGE THIS to your email
*/

-- =====================================================
-- Verify the changes
-- =====================================================
-- After running any of the above methods, verify with:

SELECT 
  id,
  email,
  raw_user_meta_data,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';

