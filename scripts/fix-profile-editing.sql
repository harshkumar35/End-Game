-- Ensure users table has all necessary columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure lawyer_profiles table has all necessary columns
ALTER TABLE lawyer_profiles 
ADD COLUMN IF NOT EXISTS languages TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing records to have updated_at
UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;
UPDATE lawyer_profiles SET updated_at = NOW() WHERE updated_at IS NULL;

-- Create or replace function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lawyer_profiles_updated_at ON lawyer_profiles;
CREATE TRIGGER update_lawyer_profiles_updated_at 
    BEFORE UPDATE ON lawyer_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Update RLS policies for lawyer_profiles
DROP POLICY IF EXISTS "Lawyers can view own profile" ON lawyer_profiles;
CREATE POLICY "Lawyers can view own profile" ON lawyer_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Lawyers can update own profile" ON lawyer_profiles;
CREATE POLICY "Lawyers can update own profile" ON lawyer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Lawyers can insert own profile" ON lawyer_profiles;
CREATE POLICY "Lawyers can insert own profile" ON lawyer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow public to view lawyer profiles (for the lawyers directory)
DROP POLICY IF EXISTS "Anyone can view lawyer profiles" ON lawyer_profiles;
CREATE POLICY "Anyone can view lawyer profiles" ON lawyer_profiles
    FOR SELECT USING (true);

-- Allow public to view basic user info for lawyers
DROP POLICY IF EXISTS "Anyone can view lawyer user info" ON users;
CREATE POLICY "Anyone can view lawyer user info" ON users
    FOR SELECT USING (role = 'lawyer');

COMMIT;
