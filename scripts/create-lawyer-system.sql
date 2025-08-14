-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    phone TEXT,
    location TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop and recreate lawyer_profiles table to ensure it has all columns
DROP TABLE IF EXISTS lawyer_profiles CASCADE;

CREATE TABLE lawyer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT NOT NULL DEFAULT 'General Practice',
    experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 1000,
    bio TEXT DEFAULT 'I am a lawyer ready to help with your legal needs.',
    is_available BOOLEAN DEFAULT true,
    bar_registration_number TEXT,
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    education TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    court_experience TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_specialization ON lawyer_profiles(specialization);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Lawyer profiles are viewable by everyone" ON lawyer_profiles;
DROP POLICY IF EXISTS "Users can insert their own lawyer profile" ON lawyer_profiles;
DROP POLICY IF EXISTS "Users can update their own lawyer profile" ON lawyer_profiles;

-- Create policies for users table
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Create policies for lawyer_profiles table
CREATE POLICY "Lawyer profiles are viewable by everyone" ON lawyer_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own lawyer profile" ON lawyer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lawyer profile" ON lawyer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample lawyers for testing
INSERT INTO users (id, email, full_name, role, phone, location) VALUES
('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', 'lawyer', '+91-9876543210', 'Mumbai, Maharashtra'),
('22222222-2222-2222-2222-222222222222', 'priya.sharma@example.com', 'Priya Sharma', 'lawyer', '+91-9876543211', 'Delhi, India'),
('33333333-3333-3333-3333-333333333333', 'rajesh.kumar@example.com', 'Rajesh Kumar', 'lawyer', '+91-9876543212', 'Bangalore, Karnataka')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lawyer_profiles (user_id, specialization, experience, hourly_rate, bio, is_available, bar_registration_number, languages, education, certifications) VALUES
('11111111-1111-1111-1111-111111111111', 'Corporate Law', 8, 2500, 'Experienced corporate lawyer specializing in business law and mergers.', true, 'BAR/2015/MH/1234', '{"English", "Hindi", "Marathi"}', '{"LLB from Mumbai University", "LLM in Corporate Law"}', '{"Best Corporate Lawyer Award 2022"}'),
('22222222-2222-2222-2222-222222222222', 'Family Law', 12, 1800, 'Dedicated family law attorney with extensive experience in divorce and custody cases.', true, 'BAR/2011/DL/5678', '{"English", "Hindi", "Punjabi"}', '{"LLB from Delhi University", "Diploma in Family Counseling"}', '{"Excellence in Family Law Practice 2021"}'),
('33333333-3333-3333-3333-333333333333', 'Criminal Defense', 15, 3000, 'Senior criminal defense lawyer with proven track record in complex cases.', true, 'BAR/2008/KA/9012', '{"English", "Hindi", "Kannada"}', '{"LLB from Bangalore University", "LLM in Criminal Law"}', '{"Outstanding Criminal Lawyer Award 2020"}'
)
ON CONFLICT (user_id) DO NOTHING;
