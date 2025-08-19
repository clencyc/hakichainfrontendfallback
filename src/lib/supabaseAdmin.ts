import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zcozhagbhzkgylahvksq.supabase.co" ;
const supabaseServiceKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb3poYWdiaHprZ3lsYWh2a3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzMjg4MDAsImV4cCI6MjAxNzkwNDgwMH0.Pu-_JTjHXwYoqAM-J-DXV7LtGck7UZLHyQ9NJF_h3nE";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for admin operations');
}

// Admin client with service role key for operations that bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
// 