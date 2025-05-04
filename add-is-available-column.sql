-- Add is_available column to lawyer_profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'lawyer_profiles' AND column_name = 'is_available'
  ) THEN
    ALTER TABLE lawyer_profiles ADD COLUMN is_available BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_is_available ON lawyer_profiles(is_available);

-- Update existing profiles to be available by default
UPDATE lawyer_profiles SET is_available = true WHERE is_available IS NULL;
