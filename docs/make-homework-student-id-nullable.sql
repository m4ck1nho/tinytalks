-- Make student_id nullable in homework table
-- This allows assigning homework by email without requiring a registered student
-- Run this in Supabase SQL Editor

-- Step 1: Find and drop ALL foreign key constraints on student_id
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
        AND table_name = 'homework'
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%student_id%'
    ) LOOP
        EXECUTE 'ALTER TABLE public.homework DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Step 2: Make student_id nullable
ALTER TABLE public.homework 
ALTER COLUMN student_id DROP NOT NULL;

-- Step 3: Re-add the foreign key constraint (PostgreSQL FK constraints allow NULL by default)
ALTER TABLE public.homework 
ADD CONSTRAINT homework_student_id_fkey 
FOREIGN KEY (student_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Verify the change
SELECT 
    column_name, 
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'homework'
AND column_name = 'student_id';

-- Note: Now student_id can be NULL, allowing homework assignment by email only
-- The student_name and student_email fields will identify the student

