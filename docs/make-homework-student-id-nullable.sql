-- Make student_id nullable in homework table
-- This allows assigning homework by email without requiring a registered student
-- Run this in Supabase SQL Editor

-- First, drop the foreign key constraint
ALTER TABLE public.homework 
DROP CONSTRAINT IF EXISTS homework_student_id_fkey;

-- Make student_id nullable
ALTER TABLE public.homework 
ALTER COLUMN student_id DROP NOT NULL;

-- Re-add the foreign key constraint but allow NULL
ALTER TABLE public.homework 
ADD CONSTRAINT homework_student_id_fkey 
FOREIGN KEY (student_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Note: Now student_id can be NULL, allowing homework assignment by email only
-- The student_name and student_email fields will identify the student

