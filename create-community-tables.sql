-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[], -- for images/videos
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at);

-- Create community_comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS community_comments_post_id_idx ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS community_comments_user_id_idx ON community_comments(user_id);

-- Create community_likes table
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- only one like per user
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS community_likes_post_id_idx ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS community_likes_user_id_idx ON community_likes(user_id);

-- Set up RLS policies
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Anyone can read community posts"
  ON community_posts FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own posts
CREATE POLICY "Users can insert their own community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own community posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own community posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone to read comments
CREATE POLICY "Anyone can read community comments"
  ON community_comments FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own comments
CREATE POLICY "Users can insert their own community comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own community comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own community comments"
  ON community_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone to read likes
CREATE POLICY "Anyone can read community likes"
  ON community_likes FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own likes
CREATE POLICY "Users can insert their own community likes"
  ON community_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own likes
CREATE POLICY "Users can delete their own community likes"
  ON community_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update likes_count
CREATE OR REPLACE FUNCTION update_community_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
DROP TRIGGER IF EXISTS update_community_post_likes_count_trigger ON community_likes;
CREATE TRIGGER update_community_post_likes_count_trigger
AFTER INSERT OR DELETE ON community_likes
FOR EACH ROW
EXECUTE FUNCTION update_community_post_likes_count();

-- Create function to update comments_count
CREATE OR REPLACE FUNCTION update_community_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comments count
DROP TRIGGER IF EXISTS update_community_post_comments_count_trigger ON community_comments;
CREATE TRIGGER update_community_post_comments_count_trigger
AFTER INSERT OR DELETE ON community_comments
FOR EACH ROW
EXECUTE FUNCTION update_community_post_comments_count();
