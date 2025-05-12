"use client";
import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '@/actions/userActions'; 

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'currentUser_sqlite'; // Changed key

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current user from localStorage for session persistence
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse current user from localStorage:", e);
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const result = await loginUser(email, pass);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(result.user));
      setLoading(false);
      return true;
    }
    setLoading(false);
    console.error("Login failed:", result.error);
    return false;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const result = await registerUser(name, email, pass);
    if (result.success && result.user) {
      // Optionally log in the user immediately after registration
      setUser(result.user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(result.user));
      setLoading(false);
      return true;
    }
    setLoading(false);
    console.error("Registration failed:", result.error);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
