-- =====================================================
-- TinyTalks Data Import Scripts
-- =====================================================
-- Run these scripts in your NEW database to import data
-- =====================================================

-- =====================================================
-- 1. IMPORT BLOG POSTS
-- =====================================================
-- First, create a temporary table to import CSV data
CREATE TEMP TABLE temp_blog_posts (
  id UUID,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  slug TEXT,
  meta_description TEXT,
  published BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Import CSV data (replace with your CSV file path)
COPY temp_blog_posts FROM '/path/to/blog_posts.csv' WITH CSV HEADER;

-- Insert data into actual table
INSERT INTO public.blog_posts (id, title, content, excerpt, image, slug, meta_description, published, created_at, updated_at)
SELECT id, title, content, excerpt, image, slug, meta_description, published, created_at, updated_at
FROM temp_blog_posts
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  image = EXCLUDED.image,
  slug = EXCLUDED.slug,
  meta_description = EXCLUDED.meta_description,
  published = EXCLUDED.published,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- 2. IMPORT CONTACT MESSAGES
-- =====================================================
CREATE TEMP TABLE temp_contact_messages (
  id UUID,
  name TEXT,
  email TEXT,
  message TEXT,
  read BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
);

COPY temp_contact_messages FROM '/path/to/contact_messages.csv' WITH CSV HEADER;

INSERT INTO public.contact_messages (id, name, email, message, read, created_at)
SELECT id, name, email, message, read, created_at
FROM temp_contact_messages
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  message = EXCLUDED.message,
  read = EXCLUDED.read;

-- =====================================================
-- 3. IMPORT REVIEWS
-- =====================================================
CREATE TEMP TABLE temp_reviews (
  id UUID,
  name TEXT,
  content TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
);

COPY temp_reviews FROM '/path/to/reviews.csv' WITH CSV HEADER;

INSERT INTO public.reviews (id, name, content, rating, created_at)
SELECT id, name, content, rating, created_at
FROM temp_reviews
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  content = EXCLUDED.content,
  rating = EXCLUDED.rating;

-- =====================================================
-- 4. IMPORT CLASSES
-- =====================================================
CREATE TEMP TABLE temp_classes (
  id UUID,
  student_id UUID,
  student_name TEXT,
  student_email TEXT,
  class_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  class_type TEXT,
  topic TEXT,
  notes TEXT,
  status TEXT,
  payment_status TEXT,
  payment_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

COPY temp_classes FROM '/path/to/classes.csv' WITH CSV HEADER;

INSERT INTO public.classes (id, student_id, student_name, student_email, class_date, duration_minutes, class_type, topic, notes, status, payment_status, payment_amount, created_at, updated_at)
SELECT id, student_id, student_name, student_email, class_date, duration_minutes, class_type, topic, notes, status, payment_status, payment_amount, created_at, updated_at
FROM temp_classes
ON CONFLICT (id) DO UPDATE SET
  student_id = EXCLUDED.student_id,
  student_name = EXCLUDED.student_name,
  student_email = EXCLUDED.student_email,
  class_date = EXCLUDED.class_date,
  duration_minutes = EXCLUDED.duration_minutes,
  class_type = EXCLUDED.class_type,
  topic = EXCLUDED.topic,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  payment_status = EXCLUDED.payment_status,
  payment_amount = EXCLUDED.payment_amount,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- 5. IMPORT HOMEWORK
-- =====================================================
CREATE TEMP TABLE temp_homework (
  id UUID,
  student_id UUID,
  student_name TEXT,
  student_email TEXT,
  title TEXT,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT,
  submission_text TEXT,
  submission_file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  teacher_feedback TEXT,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

COPY temp_homework FROM '/path/to/homework.csv' WITH CSV HEADER;

INSERT INTO public.homework (id, student_id, student_name, student_email, title, description, due_date, status, submission_text, submission_file_url, submitted_at, teacher_feedback, grade, created_at, updated_at)
SELECT id, student_id, student_name, student_email, title, description, due_date, status, submission_text, submission_file_url, submitted_at, teacher_feedback, grade, created_at, updated_at
FROM temp_homework
ON CONFLICT (id) DO UPDATE SET
  student_id = EXCLUDED.student_id,
  student_name = EXCLUDED.student_name,
  student_email = EXCLUDED.student_email,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  due_date = EXCLUDED.due_date,
  status = EXCLUDED.status,
  submission_text = EXCLUDED.submission_text,
  submission_file_url = EXCLUDED.submission_file_url,
  submitted_at = EXCLUDED.submitted_at,
  teacher_feedback = EXCLUDED.teacher_feedback,
  grade = EXCLUDED.grade,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- 6. IMPORT PAYMENT NOTIFICATIONS
-- =====================================================
CREATE TEMP TABLE temp_payment_notifications (
  id UUID,
  student_id UUID,
  student_name TEXT,
  student_email TEXT,
  class_id UUID,
  amount DECIMAL(10,2),
  payment_method TEXT,
  payment_date DATE,
  reference_number TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

COPY temp_payment_notifications FROM '/path/to/payment_notifications.csv' WITH CSV HEADER;

INSERT INTO public.payment_notifications (id, student_id, student_name, student_email, class_id, amount, payment_method, payment_date, reference_number, message, status, created_at, updated_at)
SELECT id, student_id, student_name, student_email, class_id, amount, payment_method, payment_date, reference_number, message, status, created_at, updated_at
FROM temp_payment_notifications
ON CONFLICT (id) DO UPDATE SET
  student_id = EXCLUDED.student_id,
  student_name = EXCLUDED.student_name,
  student_email = EXCLUDED.student_email,
  class_id = EXCLUDED.class_id,
  amount = EXCLUDED.amount,
  payment_method = EXCLUDED.payment_method,
  payment_date = EXCLUDED.payment_date,
  reference_number = EXCLUDED.reference_number,
  message = EXCLUDED.message,
  status = EXCLUDED.status,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- 7. IMPORT CLASS REQUESTS
-- =====================================================
CREATE TEMP TABLE temp_class_requests (
  id UUID,
  student_id UUID,
  student_name TEXT,
  student_email TEXT,
  preferred_date TIMESTAMP WITH TIME ZONE,
  preferred_time TEXT,
  topic TEXT,
  message TEXT,
  status TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

COPY temp_class_requests FROM '/path/to/class_requests.csv' WITH CSV HEADER;

INSERT INTO public.class_requests (id, student_id, student_name, student_email, preferred_date, preferred_time, topic, message, status, admin_notes, created_at, updated_at)
SELECT id, student_id, student_name, student_email, preferred_date, preferred_time, topic, message, status, admin_notes, created_at, updated_at
FROM temp_class_requests
ON CONFLICT (id) DO UPDATE SET
  student_id = EXCLUDED.student_id,
  student_name = EXCLUDED.student_name,
  student_email = EXCLUDED.student_email,
  preferred_date = EXCLUDED.preferred_date,
  preferred_time = EXCLUDED.preferred_time,
  topic = EXCLUDED.topic,
  message = EXCLUDED.message,
  status = EXCLUDED.status,
  admin_notes = EXCLUDED.admin_notes,
  updated_at = EXCLUDED.updated_at;

-- =====================================================
-- 8. CLEAN UP TEMPORARY TABLES
-- =====================================================
DROP TABLE temp_blog_posts;
DROP TABLE temp_contact_messages;
DROP TABLE temp_reviews;
DROP TABLE temp_classes;
DROP TABLE temp_homework;
DROP TABLE temp_payment_notifications;
DROP TABLE temp_class_requests;

-- =====================================================
-- 9. VERIFY DATA IMPORT
-- =====================================================
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

-- =====================================================
-- 10. COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'TinyTalks Data Import completed successfully!';
  RAISE NOTICE 'All data has been migrated to the new database.';
  RAISE NOTICE 'Remember to update your application environment variables.';
END $$;
