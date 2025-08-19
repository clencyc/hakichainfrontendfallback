import { createContext, useState, useEffect, ReactNode } from 'react';
import { clarityService } from '../services/clarityService';
import { supabaseAdmin } from '../lib/supabaseAdmin';

type UserRole = 'lawyer' | 'ngo' | 'donor' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lsk_number?: string; // For lawyers only
  organization?: string; // For NGOs only
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

  const login = async (email: string, _password: string) => {
    try {
      // Check if user exists in your database
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database error during login:', checkError);
        throw new Error('Login failed due to database error');
      }

      if (!existingUser) {
        throw new Error('No account found with this email. Please register first.');
      }

      console.log('Found user in database:', existingUser);

      // Create user object from database data
      const user: User = {
        id: existingUser.id,
        name: existingUser.full_name,
        email: existingUser.email,
        role: existingUser.user_type,
        lsk_number: existingUser.lsk_number,
        organization: existingUser.company_name
      };

      // Store user in local storage
      localStorage.setItem('hakichain_user', JSON.stringify(user));
      setUser(user);

      // Track login event and identify user in Clarity
      clarityService.identify(user.id, undefined, undefined, user.name);
      clarityService.setTag('userRole', user.role || 'unknown');
      clarityService.trackEvent('User_Login');

      console.log(`User logged in as ${user.role}:`, user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw new Error('Failed to verify email');
      }

      // Generate a proper UUID v4 format
      const uuid = crypto.randomUUID();
      
      // Prepare data for your simplified users table
      const userRecord = {
        id: uuid,
        email: userData.email,
        full_name: userData.name,
        user_type: userData.role, // 'lawyer' | 'ngo' | 'donor'
        lsk_number: userData.role === 'lawyer' ? userData.lsk_number : null,
        company_name: userData.role === 'ngo' ? userData.organization : null,
        industry: userData.role === 'ngo' ? 'Non-Profit' : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to your users table in Supabase using admin client (bypasses RLS)
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userRecord])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Registration failed: ${error.message}`);
      }

      console.log('User saved to database:', data);

      // Create user object for local state
      const mockUser: User = {
        id: uuid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        lsk_number: userData.lsk_number,
        organization: userData.organization
      };

      // Store user in local storage
      localStorage.setItem('hakichain_user', JSON.stringify(mockUser));
      setUser(mockUser);

      // Track registration event and identify user in Clarity
      clarityService.identify(mockUser.id, undefined, undefined, mockUser.name);
      clarityService.setTag('userRole', mockUser.role || 'unknown');
      clarityService.trackEvent('User_Registration');

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
          // Don't throw error here - registration should still succeed even if email fails
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't throw error here - registration should still succeed even if email fails
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