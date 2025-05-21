
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student@school.edu',
    role: 'student',
    studentId: '2023-1234',
    avatar: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'registrar@school.edu',
    role: 'registrar',
    avatar: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@school.edu',
    role: 'admin',
    avatar: '/placeholder.svg',
  },
];

// Create the auth provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching email
    const foundUser = DEMO_USERS.find(user => user.email === email);
    
    if (foundUser && password === 'password') {
      // For demonstration, any password works as 'password'
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Provide auth context
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
