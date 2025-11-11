-- =====================================================
-- Teacher Edit Feature Migration
-- =====================================================
-- This script adds support for teacher editing approved requests
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add teacher_edits column to class_requests table
ALTER TABLE public.class_requests 
  ADD COLUMN IF NOT EXISTS teacher_edits TEXT; -- JSON string of teacher's proposed changes

-- Update status constraint to include teacher_edited
-- First, drop the existing constraint if it exists
ALTER TABLE public.class_requests
  DROP CONSTRAINT IF EXISTS class_requests_status_check;

-- Add the updated constraint with teacher_edited status
ALTER TABLE public.class_requests
  ADD CONSTRAINT class_requests_status_check CHECK (status IN ('pending', 'awaiting_payment', 'payment_confirmed', 'approved', 'rejected', 'teacher_edited'));

