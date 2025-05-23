-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(case_id, lawyer_id)
);

-- Add RLS policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own applications
CREATE POLICY "Lawyers can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = lawyer_id);

-- Allow case owners to view applications for their cases
CREATE POLICY "Case owners can view applications for their cases"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = applications.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Allow lawyers to insert their own applications
CREATE POLICY "Lawyers can insert their own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = lawyer_id);

-- Allow lawyers to update their own applications
CREATE POLICY "Lawyers can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = lawyer_id);

-- Allow case owners to update application status
CREATE POLICY "Case owners can update application status"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = applications.case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Create indexes for faster queries
CREATE INDEX applications_case_id_idx ON applications(case_id);
CREATE INDEX applications_lawyer_id_idx ON applications(lawyer_id);
