import { createClient } from '@supabase/supabase-js';

// Use Node.js environment variables for server-side usage
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  throw new Error('Missing or invalid SUPABASE_URL in environment variables');
}

if (!supabaseServiceKey || supabaseServiceKey.length < 100) {
  throw new Error('Missing or invalid SUPABASE_SERVICE_ROLE_KEY or ANON_KEY in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});
