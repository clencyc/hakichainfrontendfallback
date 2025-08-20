import { createContext, useState, useEffect, ReactNode } from 'react';
import { clarityService } from '../services/clarityService';
import { supabase } from '../lib/supabase';

type UserRole = 'lawyer' | 'ngo' | 'donor' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lsk_number?: string; // For lawyers only
  organization?: string; // For NGOs only
  email_confirmed?: boolean; // New: track if email is confirmed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for stored user data
    const storedUser = localStorage.getItem('hakichain_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[LOGIN] Attempting login with:', { email, passwordLength: password.length });
      // Use Supabase Auth signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('[LOGIN] Supabase response:', { data, error });
      if (error) {
        console.error('[LOGIN] Supabase error:', error);
      }
      if (!data.user) {
        console.warn('[LOGIN] No user returned from Supabase:', data);
      }
      if (error || !data.user) {
        throw new Error(error?.message || 'Login failed');
      }
      const userMeta = data.user.user_metadata || {};
      const user: User = {
        id: data.user.id,
        name: userMeta.full_name || '',
        email: data.user.email || '',
        role: userMeta.user_type || null,
        lsk_number: userMeta.lsk_number,
        organization: userMeta.organization,
      };
      console.log('[LOGIN] User object created:', user);
      localStorage.setItem('hakichain_user', JSON.stringify(user));
      setUser(user);
      clarityService.identify(user.id, undefined, undefined, user.name);
      clarityService.setTag('userRole', user.role || 'unknown');
      clarityService.trackEvent('User_Login');
      console.log('[LOGIN] Login successful, user set and tracked.');
    } catch (error) {
      console.error('[LOGIN] Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      // Use Supabase Auth signUp
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            user_type: userData.role,
            lsk_number: userData.lsk_number,
            organization: userData.organization,
          },
        },
      });
      if (error || !data.user) {
        throw new Error(error?.message || 'Registration failed');
      }
      const userMeta = data.user.user_metadata || {};
      // Check if email is confirmed (for new users, this will be false)
      const email_confirmed = !!data.user.confirmed_at;
      const newUser: User = {
        id: data.user.id,
        name: userMeta.full_name || '',
        email: data.user.email || '',
        role: userMeta.user_type || null,
        lsk_number: userMeta.lsk_number,
        organization: userMeta.organization,
        email_confirmed,
      };
      localStorage.setItem('hakichain_user', JSON.stringify(newUser));
      setUser(newUser);
      clarityService.identify(newUser.id, undefined, undefined, newUser.name);
      clarityService.setTag('userRole', newUser.role || 'unknown');
      clarityService.trackEvent('User_Registration');
      if (!email_confirmed) {
        // Log a message to prompt the user to confirm their email
        console.warn('Registration successful! Please check your email and confirm your account to enable full access.');
      }
      // Send welcome email after successful registration
      try {
        console.log('Sending welcome email to:', userData.email);
        const emailResponse = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            name: userData.name,
            role: userData.role,
            lsk_number: userData.lsk_number,
          }),
        });
        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('Welcome email sent successfully:', emailResult);
        } else {
          console.warn('Welcome email failed:', emailResult);
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    // Track logout event before clearing user data
    clarityService.trackEvent('User_Logout');
    
    localStorage.removeItem('hakichain_user');
    setUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};