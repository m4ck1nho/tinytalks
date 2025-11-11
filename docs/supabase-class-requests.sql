-- Create class_requests table for students to request classes
CREATE TABLE IF NOT EXISTS class_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  preferred_date TIMESTAMPTZ,
  preferred_time TEXT,
  topic TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'awaiting_payment', 'payment_confirmed', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_class_requests_student_id ON class_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_class_requests_status ON class_requests(status);

-- Enable RLS
ALTER TABLE class_requests ENABLE ROW LEVEL SECURITY;

-- Policies for class_requests
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
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admins can update all requests
CREATE POLICY "Admins can update class requests"
  ON class_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admins can delete requests
CREATE POLICY "Admins can delete class requests"
  ON class_requests
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_class_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER class_requests_updated_at
  BEFORE UPDATE ON class_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_class_requests_updated_at();

