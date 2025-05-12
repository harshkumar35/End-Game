-- Add is_available column if it doesn't exist
ALTER TABLE lawyer_profiles 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
