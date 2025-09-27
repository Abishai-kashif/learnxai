'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check session validity and restore user state
  const validateSession = async () => {
    try {
      const sessionData = await apiClient.validateSession();
      if (sessionData.is_valid && sessionData.user) {
        setUser(sessionData.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('No valid session found:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh access token using refresh token
  const refreshSession = async () => {
    try {
      await apiClient.refreshSession();
      // After successful refresh, validate session to get updated user data
      await validateSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await apiClient.login(email, password);
      
      // After successful login, validate session to get user data
      await validateSession();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await apiClient.signup(name, email, password);
      
      // After successful signup, validate session to get user data
      await validateSession();
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Redirect to auth page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  };

  // Initialize authentication state on mount
  useEffect(() => {
    validateSession();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    // Refresh token every 14 minutes (assuming 15-minute access token expiry)
    const refreshInterval = setInterval(() => {
      refreshSession().catch((error) => {
        console.error('Auto-refresh failed:', error);
        // If refresh fails, user will be logged out on next API call
      });
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};