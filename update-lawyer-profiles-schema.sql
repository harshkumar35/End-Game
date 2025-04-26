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

-- Add image_url column to posts if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create post_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Enable Row Level Security on post_likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for post_likes
CREATE POLICY "Users can view their own likes" 
ON post_likes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes" 
ON post_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON post_likes FOR DELETE 
USING (auth.uid() = user_id);
