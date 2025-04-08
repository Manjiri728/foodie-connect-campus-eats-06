
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would make an API call
      // Mock login for demo purposes
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role: email.includes('staff') ? 'staff' : 'student',
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      // Redirect staff users to staff dashboard
      if (mockUser.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setLoading(true);
      // Mock signup
      const mockUser: User = {
        id: '1',
        name,
        email,
        role,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      // Redirect staff users to staff dashboard
      if (mockUser.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Please check your information and try again.",
      });
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
