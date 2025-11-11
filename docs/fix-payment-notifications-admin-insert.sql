-- Fix: Allow admin to create payment notifications when marking classes as paid
-- Run this SQL in Supabase SQL Editor

-- Drop existing insert policy for payment_notifications if it exists
DROP POLICY IF EXISTS "Students can create payment notifications" ON payment_notifications;

-- Recreate insert policy to allow BOTH students AND admins
CREATE POLICY "Students and admins can create payment notifications"
ON payment_notifications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow if user is the student who owns the notification
  auth.uid() = student_id
  OR
  -- Allow if user is an admin
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Verify the policy was created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'payment_notifications' 
  AND policyname = 'Students and admins can create payment notifications';

