-- =====================================================
-- Teacher Availability Schema
-- =====================================================
-- This table stores teacher's weekly availability schedule
-- =====================================================

-- Create teacher_availability table
CREATE TABLE IF NOT EXISTS public.teacher_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week, start_time, end_time)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_teacher_availability_day ON teacher_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_teacher_availability_available ON teacher_availability(is_available);

-- Enable RLS
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can insert availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can update availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can delete availability" ON teacher_availability;
DROP POLICY IF EXISTS "Students can view availability" ON teacher_availability;

-- Policies for teacher_availability
-- Only admins can manage availability
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

-- Update class_requests table to include new fields
ALTER TABLE public.class_requests 
  ADD COLUMN IF NOT EXISTS lessons_per_week INTEGER,
  ADD COLUMN IF NOT EXISTS total_lessons INTEGER,
  ADD COLUMN IF NOT EXISTS first_class_free BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS preferred_schedules TEXT, -- JSON string for multiple day/time selections
  ADD COLUMN IF NOT EXISTS weekly_schedule TEXT, -- JSON string for weekly recurring schedule {day_of_week, time}
  ADD COLUMN IF NOT EXISTS payment_preference TEXT CHECK (payment_preference IN ('weekly', 'all_at_once')), -- Payment preference
  ADD COLUMN IF NOT EXISTS teacher_edits TEXT; -- JSON string of teacher's proposed changes

-- Drop existing constraint if it exists, then add it
ALTER TABLE public.class_requests
  DROP CONSTRAINT IF EXISTS check_min_lessons;

-- Add constraint to ensure total_lessons >= 4
ALTER TABLE public.class_requests
  ADD CONSTRAINT check_min_lessons CHECK (total_lessons IS NULL OR total_lessons >= 4);

-- Update status constraint to include teacher_edited
ALTER TABLE public.class_requests
  DROP CONSTRAINT IF EXISTS class_requests_status_check;

ALTER TABLE public.class_requests
  ADD CONSTRAINT class_requests_status_check CHECK (status IN ('pending', 'awaiting_payment', 'payment_confirmed', 'approved', 'rejected', 'teacher_edited'));

-- Create class_packages table to track student packages
CREATE TABLE IF NOT EXISTS public.class_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_schedule TEXT NOT NULL, -- JSON string of WeeklyScheduleSlot[]
  total_lessons INTEGER NOT NULL,
  completed_lessons INTEGER DEFAULT 0,
  payment_preference TEXT NOT NULL CHECK (payment_preference IN ('weekly', 'all_at_once')),
  first_four_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_class_packages_student_id ON class_packages(student_id);

-- Enable RLS
ALTER TABLE class_packages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Students can view own packages" ON class_packages;
DROP POLICY IF EXISTS "Admins can view all packages" ON class_packages;
DROP POLICY IF EXISTS "Admins can manage packages" ON class_packages;

-- Policies for class_packages
CREATE POLICY "Students can view own packages"
  ON class_packages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all packages"
  ON class_packages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage packages"
  ON class_packages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

