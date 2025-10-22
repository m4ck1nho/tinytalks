-- Fix Class Requests Policies
-- Run this to update the RLS policies for class_requests table

-- First, drop existing policies
DROP POLICY IF EXISTS "Students can create class requests" ON class_requests;
DROP POLICY IF EXISTS "Students can view own class requests" ON class_requests;
DROP POLICY IF EXISTS "Admins can view all class requests" ON class_requests;
DROP POLICY IF EXISTS "Admins can update class requests" ON class_requests;
DROP POLICY IF EXISTS "Admins can delete class requests" ON class_requests;

-- Recreate policies with correct logic

-- Students can insert their own requests
CREATE POLICY "Students can create class requests"
  ON class_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Students can view their own requests
CREATE POLICY "Students can view own class requests"
  ON class_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all class requests"
  ON class_requests
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admins can update all requests
CREATE POLICY "Admins can update class requests"
  ON class_requests
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Admins can delete requests
CREATE POLICY "Admins can delete class requests"
  ON class_requests
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

