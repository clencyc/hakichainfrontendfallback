-- HakiChain Lawyer Registration Database Schema
-- Run this in your Supabase SQL Editor

-- Create lawyers table
CREATE TABLE IF NOT EXISTS lawyers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    auth_provider TEXT NOT NULL DEFAULT 'email', -- 'email', 'oauth_google', 'oauth_facebook', etc.
    provider_user_id TEXT, -- ID from the social provider
    provider_email TEXT, -- Email from the social provider
    
    -- Professional Information
    bar_number TEXT UNIQUE NOT NULL,
    specialization TEXT[] NOT NULL DEFAULT '{}',
    years_experience INTEGER NOT NULL DEFAULT 0,
    law_school TEXT NOT NULL,
    bio TEXT NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    languages TEXT[] DEFAULT '{}',
    
    -- Status and Verification
    status TEXT NOT NULL DEFAULT 'pending_verification', -- 'pending_verification', 'verified', 'rejected', 'suspended'
    verification_status TEXT NOT NULL DEFAULT 'unverified', -- 'unverified', 'document_submitted', 'verified', 'rejected'
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID, -- Admin user who verified
    verification_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Activity
    is_active BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
    total_cases INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_image_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bounties table
CREATE TABLE IF NOT EXISTS bounties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES lawyers(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL CHECK (budget > 0),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyers_clerk_user_id ON lawyers(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_lawyers_status ON lawyers(status);
CREATE INDEX IF NOT EXISTS idx_lawyers_specialization ON lawyers USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_clients_clerk_user_id ON clients(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_bounties_client_id ON bounties(client_id);
CREATE INDEX IF NOT EXISTS idx_bounties_lawyer_id ON bounties(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables
CREATE TRIGGER update_lawyers_updated_at BEFORE UPDATE ON lawyers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bounties_updated_at BEFORE UPDATE ON bounties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Lawyers can read their own data and verified lawyers are publicly readable
CREATE POLICY "Lawyers can view own profile" ON lawyers
    FOR SELECT USING (auth.uid()::text = clerk_user_id OR status = 'verified');

-- Lawyers can update their own data
CREATE POLICY "Lawyers can update own profile" ON lawyers
    FOR UPDATE USING (auth.uid()::text = clerk_user_id);

-- Anyone can insert lawyer profiles (for registration)
CREATE POLICY "Anyone can register as lawyer" ON lawyers
    FOR INSERT WITH CHECK (true);

-- Clients can read their own data
CREATE POLICY "Clients can view own profile" ON clients
    FOR SELECT USING (auth.uid()::text = clerk_user_id);

-- Clients can update their own data
CREATE POLICY "Clients can update own profile" ON clients
    FOR UPDATE USING (auth.uid()::text = clerk_user_id);

-- Anyone can insert client profiles (for registration)
CREATE POLICY "Anyone can register as client" ON clients
    FOR INSERT WITH CHECK (true);

-- Bounties are readable by everyone
CREATE POLICY "Bounties are publicly readable" ON bounties
    FOR SELECT USING (true);

-- Only clients can create bounties for themselves
CREATE POLICY "Clients can create bounties" ON bounties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM clients 
            WHERE id = client_id 
            AND clerk_user_id = auth.uid()::text
        )
    );

-- Clients can update their own bounties, lawyers can update assigned bounties
CREATE POLICY "Bounties can be updated by owner or assigned lawyer" ON bounties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM clients 
            WHERE id = client_id 
            AND clerk_user_id = auth.uid()::text
        ) OR 
        EXISTS (
            SELECT 1 FROM lawyers 
            WHERE id = lawyer_id 
            AND clerk_user_id = auth.uid()::text
        )
    );
