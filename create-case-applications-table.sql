-- Create case_applications table
CREATE TABLE IF NOT EXISTS case_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(case_id, lawyer_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS case_applications_case_id_idx ON case_applications(case_id);
CREATE INDEX IF NOT EXISTS case_applications_lawyer_id_idx ON case_applications(lawyer_id);
CREATE INDEX IF NOT EXISTS case_applications_status_idx ON case_applications(status);

-- Set up RLS policies
ALTER TABLE case_applications ENABLE ROW LEVEL SECURITY;

-- Allow lawyers to see their own applications
CREATE POLICY "Lawyers can see their own applications"
  ON case_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = lawyer_id);

-- Allow clients to see applications for their cases
CREATE POLICY "Clients can see applications for their cases"
  ON case_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Allow lawyers to insert their own applications
CREATE POLICY "Lawyers can insert their own applications"
  ON case_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = lawyer_id AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'lawyer'
    )
  );

-- Allow clients to update applications for their cases
CREATE POLICY "Clients can update applications for their cases"
  ON case_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_id
      AND cases.client_id = auth.uid()
    )
  );

-- Allow lawyers to update their own applications
CREATE POLICY "Lawyers can update their own applications"
  ON case_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);
