-- Check if is_available column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'lawyer_profiles'
        AND column_name = 'is_available'
    ) THEN
        ALTER TABLE lawyer_profiles ADD COLUMN is_available BOOLEAN DEFAULT true;
    END IF;
END $$;
