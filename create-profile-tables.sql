-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create educations table
CREATE TABLE IF NOT EXISTS educations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add headline column to lawyer_profiles if it doesn't exist
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS headline TEXT;

-- Add phone and location columns to users if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for experiences
CREATE POLICY "Users can view their own experiences" 
ON experiences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" 
ON experiences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" 
ON experiences FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" 
ON experiences FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for educations
CREATE POLICY "Users can view their own educations" 
ON educations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own educations" 
ON educations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own educations" 
ON educations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own educations" 
ON educations FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for skills
CREATE POLICY "Users can view their own skills" 
ON skills FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" 
ON skills FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" 
ON skills FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" 
ON skills FOR DELETE 
USING (auth.uid() = user_id);
