import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { useEvents } from './EventContext'; // <-- import EventContext hook

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use refetchEvents from EventContext
  const { refetchEvents } = useEvents();

  // Check if user is already logged in on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          await authAPI.verifyToken();
          setUser(JSON.parse(storedUser));
          console.log('Token verified, user loaded:', JSON.parse(storedUser));
          
          // Fetch events after token verification
          await refetchEvents();
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      console.log('Login successful:', user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Fetch events immediately after login
      await refetchEvents();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      console.error('Login error:', message);
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.signup(email, password, name);
      const { token, user } = response.data;

      console.log('Signup successful:', user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      // Fetch events immediately after signup
      await refetchEvents();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      console.error('Signup error:', message);
      throw new Error(message);
    }
  };

  const logout = () => {
    console.log('Logging out...');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
