import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Fix: Correct the URL and API key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zcozhagbhzkgylahvksq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb3poYWdiaHprZ3lsYWh2a3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjgwMDMsImV4cCI6MjA2NDY0NDAwM30.k7Db8fzFEjLEM6McBicNyrlrBmbJDA5Yzbrsjd0Jwbc';

// Validate that we have proper values
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Invalid Supabase URL:', supabaseUrl);
}

if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
  console.error('Invalid Supabase Anon Key:', supabaseAnonKey);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});