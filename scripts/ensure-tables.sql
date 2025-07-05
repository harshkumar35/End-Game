-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'lawyer', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lawyer_profiles table
CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    location TEXT DEFAULT '',
    bio TEXT,
    education TEXT[],
    certifications TEXT[],
    languages TEXT[] DEFAULT '{"English"}',
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    bar_council_number TEXT,
    practice_areas TEXT[],
    court_experience TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    case_type TEXT NOT NULL,
    location TEXT,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    urgency TEXT CHECK (urgency IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create case_applications table
CREATE TABLE IF NOT EXISTS case_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    proposed_fee DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(case_id, lawyer_id)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    document_type TEXT NOT NULL,
    template_data JSONB,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Lawyer profiles policies
CREATE POLICY "Anyone can view lawyer profiles" ON lawyer_profiles FOR SELECT USING (true);
CREATE POLICY "Lawyers can update own profile" ON lawyer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Lawyers can insert own profile" ON lawyer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Anyone can view likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON post_likes FOR ALL USING (auth.uid() = user_id);

-- Cases policies
CREATE POLICY "Anyone can view open cases" ON cases FOR SELECT USING (status = 'open' OR auth.uid() = client_id);
CREATE POLICY "Clients can create cases" ON cases FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own cases" ON cases FOR UPDATE USING (auth.uid() = client_id);

-- Case applications policies
CREATE POLICY "Case owners and applicants can view applications" ON case_applications 
    FOR SELECT USING (
        auth.uid() = lawyer_id OR 
        auth.uid() IN (SELECT client_id FROM cases WHERE id = case_id)
    );
CREATE POLICY "Lawyers can create applications" ON case_applications FOR INSERT WITH CHECK (auth.uid() = lawyer_id);
CREATE POLICY "Lawyers can update own applications" ON case_applications FOR UPDATE USING (auth.uid() = lawyer_id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lawyer_profiles_updated_at BEFORE UPDATE ON lawyer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'post_comments' THEN
            UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_TABLE_NAME = 'post_likes' THEN
            UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'post_comments' THEN
            UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        ELSIF TG_TABLE_NAME = 'post_likes' THEN
            UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Add count update triggers
CREATE TRIGGER update_post_comments_count AFTER INSERT OR DELETE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_post_counts();
CREATE TRIGGER update_post_likes_count AFTER INSERT OR DELETE ON post_likes FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Insert sample data
INSERT INTO users (id, email, full_name, role, phone) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'john.lawyer@example.com', 'John Smith', 'lawyer', '+91-9876543210'),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane.advocate@example.com', 'Jane Doe', 'lawyer', '+91-9876543211'),
    ('550e8400-e29b-41d4-a716-446655440003', 'client.user@example.com', 'Client User', 'client', '+91-9876543212')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lawyer_profiles (user_id, specialization, experience_years, location, bio, hourly_rate, rating, total_reviews, is_verified) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 
     '{"Criminal Law", "Civil Law"}', 
     8, 
     'Mumbai, Maharashtra', 
     'Experienced criminal and civil lawyer with 8 years of practice in Mumbai High Court.',
     2500.00,
     4.5,
     25,
     true),
    ('550e8400-e29b-41d4-a716-446655440002', 
     '{"Family Law", "Property Law"}', 
     5, 
     'Delhi, NCR', 
     'Specialized in family disputes and property matters. Fluent in Hindi and English.',
     2000.00,
     4.2,
     18,
     true)
ON CONFLICT (user_id) DO NOTHING;
