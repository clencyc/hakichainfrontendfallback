import { useAuth, useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LawyerData {
  id: string;
  email: string;
  full_name: string;
  user_type: 'client' | 'lawyer';
  lsk_number: string | null;
  company_name: string | null;
  industry: string | null;
  created_at: string;
  updated_at: string;
}

export function useLawyerAuth() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [lawyerData, setLawyerData] = useState<LawyerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch lawyer data from Supabase when user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchLawyerData();
    }
  }, [isLoaded, isSignedIn, user]);

    const fetchLawyerData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .eq('user_type', 'lawyer')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No lawyer record found
          setLawyerData(null);
        } else {
          throw error;
        }
      } else {
        setLawyerData(data);
      }
    } catch (err) {
      console.error('Error fetching lawyer data:', err);
      setError('Failed to fetch lawyer profile');
    } finally {
      setLoading(false);
    }
  };

  const updateLawyerData = async (updates: Partial<LawyerData>) => {
    if (!user || !lawyerData) return false;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setLawyerData(data);
      return true;
    } catch (err) {
      console.error('Error updating lawyer data:', err);
      setError('Failed to update lawyer profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLawyerAccount = async () => {
    if (!user || !lawyerData) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      // Sign out from Clerk
      await signOut();
      setLawyerData(null);
      return true;
    } catch (err) {
      console.error('Error deleting lawyer account:', err);
      setError('Failed to delete account');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAuthProviderInfo = () => {
    if (!user) return null;

    const socialAccount = user.externalAccounts[0];
    return {
      provider: socialAccount?.provider || 'email',
      providerUserId: socialAccount?.providerUserId,
      providerEmail: socialAccount?.emailAddress,
      isEmailAuth: !socialAccount,
      isSocialAuth: !!socialAccount
    };
  };

  return {
    // Auth state
    isLoaded,
    isSignedIn,
    user,
    
    // Lawyer data
    lawyerData,
    loading,
    error,
    
    // Actions
    fetchLawyerData,
    updateLawyerData,
    deleteLawyerAccount,
    signOut,
    
    // Helper functions
    getAuthProviderInfo,
    isLawyerRegistered: !!lawyerData && lawyerData.user_type === 'lawyer',
    isLawyerVerified: !!lawyerData?.lsk_number, // Simplified: has LSK number = verified
    isLawyerActive: !!lawyerData, // Simplified: exists in DB = active
    canPractice: !!lawyerData?.lsk_number // Can practice if has LSK number
  };
}
