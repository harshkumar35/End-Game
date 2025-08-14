-- First, let's check if the lawyer_profiles table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT,
    experience INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    bio TEXT,
    is_available BOOLEAN DEFAULT true,
    bar_registration_number TEXT,
    languages TEXT[] DEFAULT '{}',
    education TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    court_experience TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add missing columns to lawyer_profiles table
ALTER TABLE lawyer_profiles 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS bar_registration_number TEXT,
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS education TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS court_experience TEXT[] DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_specialization ON lawyer_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_is_available ON lawyer_profiles(is_available);

-- Enable RLS
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public lawyer profiles are viewable by everyone" ON lawyer_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own lawyer profile" ON lawyer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lawyer profile" ON lawyer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample lawyer data for testing
INSERT INTO users (id, email, full_name, role, phone, location, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', 'lawyer', '+91-9876543210', 'Mumbai, Maharashtra', NULL),
('22222222-2222-2222-2222-222222222222', 'priya.sharma@example.com', 'Priya Sharma', 'lawyer', '+91-9876543211', 'Delhi, India', NULL),
('33333333-3333-3333-3333-333333333333', 'rajesh.kumar@example.com', 'Rajesh Kumar', 'lawyer', '+91-9876543212', 'Bangalore, Karnataka', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lawyer_profiles (user_id, specialization, experience, hourly_rate, bio, is_available, bar_registration_number, languages, education, certifications, court_experience) VALUES
('11111111-1111-1111-1111-111111111111', 'Corporate Law', 8, 2500, 'Experienced corporate lawyer specializing in mergers, acquisitions, and business law. I have successfully handled over 200 corporate cases and helped numerous startups with legal compliance.', true, 'BAR/2015/MH/1234', '{"English", "Hindi", "Marathi"}', '{"LLB from Mumbai University (2014)", "LLM in Corporate Law from National Law School (2016)"}', '{"Best Corporate Lawyer Award 2022", "Certified Company Secretary"}', '{"Bombay High Court", "Supreme Court of India", "NCLT Mumbai"}'),
('22222222-2222-2222-2222-222222222222', 'Family Law', 12, 1800, 'Dedicated family law attorney with extensive experience in divorce, child custody, and matrimonial disputes. I provide compassionate legal support during difficult family situations.', true, 'BAR/2011/DL/5678', '{"English", "Hindi", "Punjabi"}', '{"LLB from Delhi University (2010)", "Diploma in Family Counseling (2012)"}', '{"Excellence in Family Law Practice 2021", "Certified Mediator"}', '{"Delhi High Court", "Family Courts Delhi", "Supreme Court of India"}'),
('33333333-3333-3333-3333-333333333333', 'Criminal Defense', 15, 3000, 'Senior criminal defense lawyer with a proven track record in handling complex criminal cases. Specializing in white-collar crimes, fraud cases, and criminal appeals.', true, 'BAR/2008/KA/9012', '{"English", "Hindi", "Kannada", "Tamil"}', '{"LLB from Bangalore University (2007)", "LLM in Criminal Law from NLSIU (2009)", "Advanced Course in Cyber Law (2018)"}', '{"Outstanding Criminal Lawyer Award 2020", "Cyber Law Specialist Certification"}', '{"Karnataka High Court", "Sessions Courts Bangalore", "Supreme Court of India", "Cyber Crime Courts"}'
)
ON CONFLICT (user_id) DO NOTHING;
