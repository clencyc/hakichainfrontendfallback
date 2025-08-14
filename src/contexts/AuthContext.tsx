import { createContext, useState, useEffect, ReactNode } from 'react';
import { clarityService } from '../services/clarityService';

type UserRole = 'lawyer' | 'ngo' | 'donor' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lsk_number?: string; // For lawyers only
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
      // Generate a proper UUID v4 format
      const uuid = crypto.randomUUID();
      
      // This would be replaced with actual API call in production
      // Simulating successful login for demo purposes
      const mockUser: User = {
        id: uuid,
        name: email.split('@')[0],
        email,
        role: email.includes('lawyer') ? 'lawyer' : email.includes('ngo') ? 'ngo' : 'donor',
      };

      // Store user in local storage
      localStorage.setItem('hakichain_user', JSON.stringify(mockUser));
      setUser(mockUser);

      // Track login event and identify user in Clarity
      clarityService.identify(mockUser.id, undefined, undefined, mockUser.name);
      clarityService.setTag('userRole', mockUser.role || 'unknown');
      clarityService.trackEvent('User_Login');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      // Generate a proper UUID v4 format
      const uuid = crypto.randomUUID();
      
      // This would be replaced with actual API call in production
      // Simulating successful registration for demo purposes
      const mockUser: User = {
        id: uuid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        lsk_number: userData.lsk_number,
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