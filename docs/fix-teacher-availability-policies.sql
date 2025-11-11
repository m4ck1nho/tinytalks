-- Fix Teacher Availability RLS Policies
-- Run this script to update the RLS policies for teacher_availability table
-- This fixes the issue where policies use auth.users instead of auth.jwt()

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can insert availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can update availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can delete availability" ON teacher_availability;
DROP POLICY IF EXISTS "Students can view availability" ON teacher_availability;

-- Recreate policies with correct auth.jwt() approach
CREATE POLICY "Admins can view availability"
  ON teacher_availability
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert availability"
  ON teacher_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update availability"
  ON teacher_availability
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete availability"
  ON teacher_availability
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Students can view availability (to check if teacher is available)
CREATE POLICY "Students can view availability"
  ON teacher_availability
  FOR SELECT
  TO authenticated
  USING (is_available = true);

