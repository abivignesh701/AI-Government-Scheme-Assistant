require('dotenv').config();
const { Client } = require('pg');

const sql = `
-- Drop old tables
DROP TABLE IF EXISTS application_trackings CASCADE;
DROP TABLE IF EXISTS citizen_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS field_status CASCADE;
DROP TYPE IF EXISTS subject_type CASCADE;
DROP TYPE IF EXISTS profile_status CASCADE;
DROP TYPE IF EXISTS field_source CASCADE;
DROP TYPE IF EXISTS application_tracking_state CASCADE;

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'RESEARCHER', 'REVIEWER');
CREATE TYPE subject_type AS ENUM ('SELF', 'SOMEONE_ELSE');
CREATE TYPE profile_status AS ENUM ('DRAFT', 'REVIEWED', 'READY_FOR_EVALUATION');
CREATE TYPE application_tracking_state AS ENUM (
    'NOT_STARTED', 'PREPARING_DOCUMENTS', 'REFERRED_TO_OFFICIAL_PORTAL',
    'USER_MARKED_SUBMITTED', 'AWAITING_OFFICIAL_UPDATE', 
    'USER_MARKED_COMPLETED', 'STOPPED', 'UNKNOWN'
);

-- PROFILES for user metadata (linked to Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'hi')),
    role user_role DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CITIZEN PROFILES
CREATE TABLE citizen_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_type subject_type NOT NULL,
    
    age JSONB,
    state JSONB,
    district JSONB,
    family_size JSONB,
    annual_family_income JSONB,
    occupation JSONB,
    existing_health_coverage JSONB,
    special_categories JSONB,
    
    status profile_status DEFAULT 'DRAFT',
    profile_version INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_citizen_profiles_owner_user_id ON citizen_profiles(owner_user_id);

-- APPLICATION TRACKING
CREATE TABLE application_trackings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    scheme_id TEXT NOT NULL,
    evaluation_id TEXT NOT NULL,
    state application_tracking_state DEFAULT 'NOT_STARTED',
    checklist_state JSONB DEFAULT '{}'::jsonb,
    external_reference_optional TEXT,
    user_notes_optional TEXT,
    last_user_update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(owner_user_id, profile_id, scheme_id)
);

CREATE INDEX idx_application_trackings_owner_profile_scheme ON application_trackings(owner_user_id, profile_id, scheme_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_trackings ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own citizen profiles" ON citizen_profiles FOR SELECT USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can insert own citizen profiles" ON citizen_profiles FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Users can update own citizen profiles" ON citizen_profiles FOR UPDATE USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can delete own citizen profiles" ON citizen_profiles FOR DELETE USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can view own applications" ON application_trackings FOR SELECT USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can insert own applications" ON application_trackings FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Users can update own applications" ON application_trackings FOR UPDATE USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can delete own applications" ON application_trackings FOR DELETE USING (auth.uid() = owner_user_id);

-- AUTOMATIC PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, preferred_language)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'en')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

`;

async function run() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });
  try {
    await client.connect();
    console.log("Connected to Supabase.");
    await client.query(sql);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Error migrating:", err);
  } finally {
    await client.end();
  }
}

run();
