
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'student' | 'teacher';

// Define user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Predefined users for demo
const DEMO_USERS = [
  { id: '1', email: 'Rani@gmail.com', password: '123', name: 'Rani', role: 'student' as UserRole },
  { id: '2', email: 'Abed@gmail.com', password: '123', name: 'Abed', role: 'teacher' as UserRole },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dvld_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = (email: string, password: string): boolean => {
    const userFound = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (userFound) {
      const { password, ...userWithoutPassword } = userFound;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('dvld_user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  // Register function (for students only)
  const register = (email: string, password: string, name: string): boolean => {
    const existingUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      toast.error('Email already registered');
      return false;
    }

    // Create new user (would store in DB in a real app)
    const newUser = {
      id: `student_${Date.now()}`,
      email,
      password,
      name,
      role: 'student' as UserRole,
    };

    DEMO_USERS.push(newUser);

    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('dvld_user', JSON.stringify(userWithoutPassword));
    toast.success(`Welcome, ${name}!`);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dvld_user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
