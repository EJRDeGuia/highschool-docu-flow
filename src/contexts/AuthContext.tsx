import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the user roles
export type UserRole = 'student' | 'registrar' | 'admin';

// Define the user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  avatar?: string;
}

// Define the auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the auth provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const sessionKey = rememberMe ? 'user' : 'sessionUser';
        
        // Check for remembered session first, then session-only
        let storedUser = localStorage.getItem(sessionKey);
        if (!storedUser && rememberMe) {
          // If remember me is true but no stored user, clear the flag
          localStorage.removeItem('rememberMe');
        }
        
        // For session-only users, also check sessionStorage
        if (!storedUser && !rememberMe) {
          storedUser = sessionStorage.getItem('sessionUser');
        }
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('sessionUser');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  // Login function with remember me support
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Fetch user from Supabase database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        throw new Error('User not found');
      }
      
      // For demo purposes, we're not doing real password validation
      if (password !== 'password') {
        throw new Error('Invalid password');
      }
      
      // Format the user object to match our User interface
      const loggedInUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        studentId: data.student_id || undefined,
        avatar: data.avatar || '/placeholder.svg',
      };
      
      setUser(loggedInUser);
      
      // Handle session persistence based on remember me preference
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('rememberMe', 'true');
        // Clear any session-only data
        sessionStorage.removeItem('sessionUser');
      } else {
        sessionStorage.setItem('sessionUser', JSON.stringify(loggedInUser));
        // Clear any persistent data
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('sessionUser');
  };

  // Helper function to check if user has required role
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // Provide auth context
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
