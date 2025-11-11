-- =====================================================
-- TinyTalks Data Export Scripts
-- =====================================================
-- Run these scripts in your OLD database to export data
-- =====================================================

-- =====================================================
-- 1. EXPORT BLOG POSTS
-- =====================================================
COPY (
  SELECT 
    id,
    title,
    content,
    excerpt,
    image,
    slug,
    meta_description,
    published,
    created_at,
    updated_at
  FROM public.blog_posts
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 2. EXPORT CONTACT MESSAGES
-- =====================================================
COPY (
  SELECT 
    id,
    name,
    email,
    message,
    read,
    created_at
  FROM public.contact_messages
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 3. EXPORT REVIEWS
-- =====================================================
COPY (
  SELECT 
    id,
    name,
    content,
    rating,
    created_at
  FROM public.reviews
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 4. EXPORT CLASSES
-- =====================================================
COPY (
  SELECT 
    id,
    student_id,
    student_name,
    student_email,
    class_date,
    duration_minutes,
    class_type,
    topic,
    notes,
    status,
    payment_status,
    payment_amount,
    created_at,
    updated_at
  FROM public.classes
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 5. EXPORT HOMEWORK
-- =====================================================
COPY (
  SELECT 
    id,
    student_id,
    student_name,
    student_email,
    title,
    description,
    due_date,
    status,
    submission_text,
    submission_file_url,
    submitted_at,
    teacher_feedback,
    grade,
    created_at,
    updated_at
  FROM public.homework
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 6. EXPORT PAYMENT NOTIFICATIONS
-- =====================================================
COPY (
  SELECT 
    id,
    student_id,
    student_name,
    student_email,
    class_id,
    amount,
    payment_method,
    payment_date,
    reference_number,
    message,
    status,
    created_at,
    updated_at
  FROM public.payment_notifications
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 7. EXPORT CLASS REQUESTS
-- =====================================================
COPY (
  SELECT 
    id,
    student_id,
    student_name,
    student_email,
    preferred_date,
    preferred_time,
    topic,
    message,
    status,
    admin_notes,
    created_at,
    updated_at
  FROM public.class_requests
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 8. EXPORT USERS (if you want to migrate user accounts)
-- =====================================================
-- Note: This exports user metadata, not passwords
COPY (
  SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    updated_at
  FROM auth.users
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =====================================================
-- 9. ALTERNATIVE: EXPORT ALL DATA AS INSERT STATEMENTS
-- =====================================================

-- Blog Posts as INSERT statements
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
FROM public.blog_posts;

-- Contact Messages as INSERT statements
SELECT 'INSERT INTO public.contact_messages (id, name, email, message, read, created_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(name) || ', ' ||
       quote_literal(email) || ', ' ||
       quote_literal(message) || ', ' ||
       read || ', ' ||
       quote_literal(created_at::text) || ');'
FROM public.contact_messages;

-- Reviews as INSERT statements
SELECT 'INSERT INTO public.reviews (id, name, content, rating, created_at) VALUES (' ||
       quote_literal(id::text) || ', ' ||
       quote_literal(name) || ', ' ||
       quote_literal(content) || ', ' ||
       rating || ', ' ||
       quote_literal(created_at::text) || ');'
FROM public.reviews;

-- Classes as INSERT statements
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
FROM public.classes;

-- Homework as INSERT statements
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
FROM public.homework;

-- Payment Notifications as INSERT statements
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
FROM public.payment_notifications;

-- Class Requests as INSERT statements
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
FROM public.class_requests;
