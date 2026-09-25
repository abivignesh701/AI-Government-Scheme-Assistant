-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================================
-- Users Table
-- =======================================================
-- (Note: If you plan to use Supabase Auth, you typically link 
-- to auth.users, but here we maintain the custom users table 
-- as defined in your MongoDB schema)
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'RESEARCHER', 'REVIEWER');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta', 'hi')),
    role user_role DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- Citizen Profiles
-- =======================================================
CREATE TYPE field_status AS ENUM ('KNOWN', 'UNKNOWN', 'NOT_APPLICABLE');
CREATE TYPE subject_type AS ENUM ('SELF', 'SOMEONE_ELSE');
CREATE TYPE profile_status AS ENUM ('DRAFT', 'REVIEWED', 'READY_FOR_EVALUATION');
CREATE TYPE field_source AS ENUM ('USER_FORM', 'VOICE_TRANSCRIPT', 'OCR', 'AI_EXTRACTED', 'USER_CONFIRMED');

CREATE TABLE citizen_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_type subject_type NOT NULL,
    
    -- Using JSONB for FieldMetadataSchema to match the flexible structure 
    -- and source/status tracking from the NoSQL schema
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

-- =======================================================
-- Application Tracking
-- =======================================================
CREATE TYPE application_tracking_state AS ENUM (
    'NOT_STARTED', 'PREPARING_DOCUMENTS', 'REFERRED_TO_OFFICIAL_PORTAL',
    'USER_MARKED_SUBMITTED', 'AWAITING_OFFICIAL_UPDATE', 
    'USER_MARKED_COMPLETED', 'STOPPED', 'UNKNOWN'
);

CREATE TABLE application_trackings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    scheme_id TEXT NOT NULL,
    evaluation_id TEXT NOT NULL,
    state application_tracking_state DEFAULT 'NOT_STARTED',
    checklist_state JSONB DEFAULT '{}'::jsonb, -- Map of String -> 'HAVE' | 'NEED' | 'NOT_SURE'
    external_reference_optional TEXT,
    user_notes_optional TEXT,
    last_user_update_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensures one tracking record per user + profile + scheme
    UNIQUE(owner_user_id, profile_id, scheme_id)
);

CREATE INDEX idx_application_trackings_owner_profile_scheme ON application_trackings(owner_user_id, profile_id, scheme_id);
