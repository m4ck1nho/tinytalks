-- =====================================================
-- TinyTalks Database Migration - Alternative Method
-- =====================================================
-- This script provides alternative ways to migrate data
-- without using file-based COPY commands
-- =====================================================

-- =====================================================
-- METHOD 1: Direct INSERT Statements (Recommended)
-- =====================================================
-- Run these queries in your OLD database to generate INSERT statements
-- Then copy and run the generated INSERT statements in your NEW database

-- =====================================================
-- 1. GENERATE INSERT STATEMENTS FOR BLOG POSTS
-- =====================================================
-- Run this in your OLD database and copy the output
SELECT 'INSERT INTO public.blog_posts (id, title, content, excerpt, image, slug, meta_description, published, created_at, updated_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(title) || ', ' ||
       quote_literal(content) || ', ' ||
       quote_literal(excerpt) || ', ' ||
       COALESCE(quote_literal(image), 'NULL') || ', ' ||
       quote_literal(slug) || ', ' ||
       COALESCE(quote_literal(meta_description), 'NULL') || ', ' ||
       published || ', ' ||
       quote_literal(created_at::text) || ', ' ||
       quote_literal(updated_at::text) || ');'
FROM public.blog_posts
ORDER BY created_at;

-- =====================================================
-- 2. GENERATE INSERT STATEMENTS FOR CONTACT MESSAGES
-- =====================================================
SELECT 'INSERT INTO public.contact_messages (id, name, email, message, read, created_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(name) || ', ' ||
       quote_literal(email) || ', ' ||
       quote_literal(message) || ', ' ||
       read || ', ' ||
       quote_literal(created_at::text) || ');'
FROM public.contact_messages
ORDER BY created_at;

-- =====================================================
-- 3. GENERATE INSERT STATEMENTS FOR REVIEWS
-- =====================================================
SELECT 'INSERT INTO public.reviews (id, name, content, rating, created_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(name) || ', ' ||
       quote_literal(content) || ', ' ||
       rating || ', ' ||
       quote_literal(created_at::text) || ');'
FROM public.reviews
ORDER BY created_at;

-- =====================================================
-- 4. GENERATE INSERT STATEMENTS FOR CLASSES
-- =====================================================
SELECT 'INSERT INTO public.classes (id, student_id, student_name, student_email, class_date, duration_minutes, class_type, topic, notes, status, payment_status, payment_amount, created_at, updated_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(student_id::text) || ', ' ||
       quote_literal(student_name) || ', ' ||
       quote_literal(student_email) || ', ' ||
       quote_literal(class_date::text) || ', ' ||
       duration_minutes || ', ' ||
       COALESCE(quote_literal(class_type), 'NULL') || ', ' ||
       COALESCE(quote_literal(topic), 'NULL') || ', ' ||
       COALESCE(quote_literal(notes), 'NULL') || ', ' ||
       quote_literal(status) || ', ' ||
       quote_literal(payment_status) || ', ' ||
       COALESCE(payment_amount::text, 'NULL') || ', ' ||
       quote_literal(created_at::text) || ', ' ||
       quote_literal(updated_at::text) || ');'
FROM public.classes
ORDER BY created_at;

-- =====================================================
-- 5. GENERATE INSERT STATEMENTS FOR HOMEWORK
-- =====================================================
SELECT 'INSERT INTO public.homework (id, student_id, student_name, student_email, title, description, due_date, status, submission_text, submission_file_url, submitted_at, teacher_feedback, grade, created_at, updated_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(student_id::text) || ', ' ||
       quote_literal(student_name) || ', ' ||
       quote_literal(student_email) || ', ' ||
       quote_literal(title) || ', ' ||
       quote_literal(description) || ', ' ||
       quote_literal(due_date::text) || ', ' ||
       quote_literal(status) || ', ' ||
       COALESCE(quote_literal(submission_text), 'NULL') || ', ' ||
       COALESCE(quote_literal(submission_file_url), 'NULL') || ', ' ||
       COALESCE(quote_literal(submitted_at::text), 'NULL') || ', ' ||
       COALESCE(quote_literal(teacher_feedback), 'NULL') || ', ' ||
       COALESCE(quote_literal(grade), 'NULL') || ', ' ||
       quote_literal(created_at::text) || ', ' ||
       quote_literal(updated_at::text) || ');'
FROM public.homework
ORDER BY created_at;

-- =====================================================
-- 6. GENERATE INSERT STATEMENTS FOR PAYMENT NOTIFICATIONS
-- =====================================================
SELECT 'INSERT INTO public.payment_notifications (id, student_id, student_name, student_email, class_id, amount, payment_method, payment_date, reference_number, message, status, created_at, updated_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(student_id::text) || ', ' ||
       quote_literal(student_name) || ', ' ||
       quote_literal(student_email) || ', ' ||
       COALESCE(quote_literal(class_id::text), 'NULL') || ', ' ||
       amount || ', ' ||
       quote_literal(payment_method) || ', ' ||
       quote_literal(payment_date::text) || ', ' ||
       COALESCE(quote_literal(reference_number), 'NULL') || ', ' ||
       COALESCE(quote_literal(message), 'NULL') || ', ' ||
       quote_literal(status) || ', ' ||
       quote_literal(created_at::text) || ', ' ||
       quote_literal(updated_at::text) || ');'
FROM public.payment_notifications
ORDER BY created_at;

-- =====================================================
-- 7. GENERATE INSERT STATEMENTS FOR CLASS REQUESTS
-- =====================================================
SELECT 'INSERT INTO public.class_requests (id, student_id, student_name, student_email, preferred_date, preferred_time, topic, message, status, admin_notes, created_at, updated_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(student_id::text) || ', ' ||
       quote_literal(student_name) || ', ' ||
       quote_literal(student_email) || ', ' ||
       COALESCE(quote_literal(preferred_date::text), 'NULL') || ', ' ||
       COALESCE(quote_literal(preferred_time), 'NULL') || ', ' ||
       COALESCE(quote_literal(topic), 'NULL') || ', ' ||
       COALESCE(quote_literal(message), 'NULL') || ', ' ||
       quote_literal(status) || ', ' ||
       COALESCE(quote_literal(admin_notes), 'NULL') || ', ' ||
       quote_literal(created_at::text) || ', ' ||
       quote_literal(updated_at::text) || ');'
FROM public.class_requests
ORDER BY created_at;

-- =====================================================
-- METHOD 2: Using Supabase Dashboard Table Editor
-- =====================================================
-- Alternative method using Supabase Dashboard:

-- 1. Go to your OLD Supabase project
-- 2. Navigate to Table Editor
-- 3. For each table, click "Export" button
-- 4. Choose CSV format
-- 5. Download the CSV files
-- 6. Go to your NEW Supabase project
-- 7. Navigate to Table Editor
-- 8. For each table, click "Insert" > "Import data from CSV"
-- 9. Upload the CSV files

-- =====================================================
-- METHOD 3: Manual Data Entry (For Small Datasets)
-- =====================================================
-- If you have small amounts of data, you can manually copy and paste:

-- Example for blog posts:
INSERT INTO public.blog_posts (id, title, content, excerpt, image, slug, meta_description, published, created_at, updated_at) VALUES 
('your-uuid-here', 'Your Title', 'Your Content', 'Your Excerpt', NULL, 'your-slug', NULL, true, '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- =====================================================
-- METHOD 4: Using Supabase CLI (Advanced)
-- =====================================================
-- If you have Supabase CLI installed:

-- 1. Export from old database:
-- supabase db dump --data-only --file=backup.sql

-- 2. Import to new database:
-- supabase db reset --file=backup.sql

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these in your NEW database to verify data migration:

-- Check record counts
SELECT 'Blog Posts' as table_name, COUNT(*) as record_count FROM public.blog_posts
UNION ALL
SELECT 'Contact Messages', COUNT(*) FROM public.contact_messages
UNION ALL
SELECT 'Reviews', COUNT(*) FROM public.reviews
UNION ALL
SELECT 'Classes', COUNT(*) FROM public.classes
UNION ALL
SELECT 'Homework', COUNT(*) FROM public.homework
UNION ALL
SELECT 'Payment Notifications', COUNT(*) FROM public.payment_notifications
UNION ALL
SELECT 'Class Requests', COUNT(*) FROM public.class_requests;

-- Check for any data integrity issues
SELECT 'Classes with invalid student_id' as issue, COUNT(*) as count 
FROM public.classes 
WHERE student_id IS NULL OR student_id = '00000000-0000-0000-0000-000000000000'
UNION ALL
SELECT 'Homework with invalid student_id', COUNT(*) 
FROM public.homework 
WHERE student_id IS NULL OR student_id = '00000000-0000-0000-0000-000000000000'
UNION ALL
SELECT 'Payment notifications with invalid student_id', COUNT(*) 
FROM public.payment_notifications 
WHERE student_id IS NULL OR student_id = '00000000-0000-0000-0000-000000000000';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Alternative migration methods provided!';
  RAISE NOTICE 'Choose the method that works best for your situation.';
  RAISE NOTICE 'Method 1 (INSERT statements) is recommended for most cases.';
END $$;
