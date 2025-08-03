import { createClient } from '@supabase/supabase-js';

// Get environment variables with better error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that we have proper values
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Missing or invalid VITE_SUPABASE_URL in environment variables');
  throw new Error('Supabase URL is required');
}

if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
  console.error('Missing or invalid VITE_SUPABASE_ANON_KEY in environment variables');
  throw new Error('Supabase Anon Key is required');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey.length);
console.log('Supabase Key preview:', supabaseAnonKey.substring(0, 50) + '...');

// Test if the key is a valid JWT
try {
  const parts = supabaseAnonKey.split('.');
  if (parts.length === 3) {
    const payload = JSON.parse(atob(parts[1]));
    console.log('JWT payload:', payload);
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error('🚨 JWT TOKEN IS EXPIRED!');
    } else {
      console.log('✅ JWT token is valid and not expired');
    }
  }
} catch (e) {
  console.error('❌ Invalid JWT format:', e);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});