-- =====================================================
-- Teacher Dashboard Database Schema
-- =====================================================
-- Run this in Supabase SQL Editor
-- Creates tables for Schedule, Homework, and Payments
-- =====================================================

-- Create classes/lessons table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  class_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  class_type TEXT, -- e.g., "Individual", "Group", "Trial"
  topic TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  payment_status TEXT DEFAULT 'unpaid', -- 'unpaid', 'pending', 'paid'
  payment_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create homework table
CREATE TABLE IF NOT EXISTS public.homework (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'assigned', -- 'assigned', 'submitted', 'reviewed', 'completed'
  submission_text TEXT,
  submission_file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  teacher_feedback TEXT,
  grade TEXT, -- e.g., "A", "B+", "85%", etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment notifications table
CREATE TABLE IF NOT EXISTS public.payment_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT, -- e.g., "Bank Transfer", "Cash", "PayPal"
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reference_number TEXT, -- Transaction ID or reference
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected'
  teacher_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for Classes
-- =====================================================

-- Students can view their own classes
CREATE POLICY "Students can view their own classes" ON public.classes
  FOR SELECT USING (
    auth.uid() = student_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can insert classes
CREATE POLICY "Admins can insert classes" ON public.classes
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can update classes
CREATE POLICY "Admins can update classes" ON public.classes
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete classes
CREATE POLICY "Admins can delete classes" ON public.classes
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- =====================================================
-- RLS Policies for Homework
-- =====================================================

-- Students can view their own homework
CREATE POLICY "Students can view their own homework" ON public.homework
  FOR SELECT USING (
    auth.uid() = student_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can create homework
CREATE POLICY "Admins can create homework" ON public.homework
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Students can update their own homework (for submissions)
-- Admins can update any homework
CREATE POLICY "Students can update their homework" ON public.homework
  FOR UPDATE USING (
    auth.uid() = student_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete homework
CREATE POLICY "Admins can delete homework" ON public.homework
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- =====================================================
-- RLS Policies for Payment Notifications
-- =====================================================

-- Students can view their own payment notifications
-- Admins can view all
CREATE POLICY "Users can view relevant payment notifications" ON public.payment_notifications
  FOR SELECT USING (
    auth.uid() = student_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Students can create payment notifications
CREATE POLICY "Students can create payment notifications" ON public.payment_notifications
  FOR INSERT WITH CHECK (
    auth.uid() = student_id
  );

-- Only admins can update payment notifications (to confirm/reject)
CREATE POLICY "Admins can update payment notifications" ON public.payment_notifications
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Only admins can delete payment notifications
CREATE POLICY "Admins can delete payment notifications" ON public.payment_notifications
  FOR DELETE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- =====================================================
-- Create updated_at triggers
-- =====================================================

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homework_updated_at
BEFORE UPDATE ON public.homework
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_notifications_updated_at
BEFORE UPDATE ON public.payment_notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Create indexes for better performance
-- =====================================================

CREATE INDEX idx_classes_student_id ON public.classes(student_id);
CREATE INDEX idx_classes_class_date ON public.classes(class_date);
CREATE INDEX idx_classes_payment_status ON public.classes(payment_status);
CREATE INDEX idx_homework_student_id ON public.homework(student_id);
CREATE INDEX idx_homework_due_date ON public.homework(due_date);
CREATE INDEX idx_homework_status ON public.homework(status);
CREATE INDEX idx_payment_notifications_student_id ON public.payment_notifications(student_id);
CREATE INDEX idx_payment_notifications_status ON public.payment_notifications(status);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Teacher Dashboard tables created successfully!';
  RAISE NOTICE 'Tables: classes, homework, payment_notifications';
END $$;

