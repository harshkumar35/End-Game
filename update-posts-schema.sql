-- Add image_url column to posts if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for post images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload their own post images
CREATE POLICY "Users can upload their own post images"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[1]
  AND bucket_id = 'posts'
);

-- Set up storage policy to allow public access to post images
CREATE POLICY "Post images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');
