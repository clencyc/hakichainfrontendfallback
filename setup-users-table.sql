-- Drop the existing table
DROP TABLE IF EXISTS public.users CASCADE;

-- Create simplified users table
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('client', 'lawyer', 'ngo', 'donor')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Lawyer-specific fields (simplified)
    lsk_number TEXT, -- Changed from bar_number to lsk_number
    
    -- Client-specific fields
    company_name TEXT,
    industry TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_lsk_number ON public.users(lsk_number) WHERE lsk_number IS NOT NULL;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow anyone to insert new users (for registration)
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- Allow service role to do everything (for admin operations)
CREATE POLICY "Service role can do everything" ON public.users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create simplified database function for user creation
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_email TEXT,
    user_full_name TEXT,
    user_type TEXT,
    user_lsk_number TEXT DEFAULT NULL,
    user_company_name TEXT DEFAULT NULL,
    user_industry TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    result JSON;
BEGIN
    -- Generate new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Insert the new user
    INSERT INTO public.users (
        id, email, full_name, user_type, lsk_number, company_name, industry
    ) VALUES (
        new_user_id, user_email, user_full_name, user_type, user_lsk_number,
        user_company_name, user_industry
    );
    
    -- Return the created user data
    SELECT json_build_object(
        'id', id,
        'email', email,
        'full_name', full_name,
        'user_type', user_type,
        'lsk_number', lsk_number,
        'company_name', company_name,
        'industry', industry,
        'created_at', created_at,
        'updated_at', updated_at
    ) INTO result
    FROM public.users
    WHERE id = new_user_id;
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
END;
$$;
