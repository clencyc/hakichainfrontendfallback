import { supabaseAdmin } from './supabaseAdmin';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  user_type: 'client' | 'lawyer' | 'ngo' | 'donor';
  lsk_number?: string | null;
  company_name?: string | null;
  industry?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Check if a user exists in the database by email
 * This can be used by both custom auth and Clerk auth
 */
export async function getUserByEmail(email: string): Promise<UserData | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No user found
        return null;
      }
      console.error('Error fetching user by email:', error);
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Failed to get user by email:', error);
    throw error;
  }
}

/**
 * Check if an email belongs to a lawyer
 */
export async function isEmailRegisteredAsLawyer(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);
    return user?.user_type === 'lawyer' && !!user.lsk_number;
  } catch (error) {
    console.error('Error checking if email is lawyer:', error);
    return false;
  }
}

/**
 * Get user role by email
 */
export async function getUserRoleByEmail(email: string): Promise<string | null> {
  try {
    const user = await getUserByEmail(email);
    return user?.user_type || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}
