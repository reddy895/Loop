'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  role: string;
  avatar?: string;
  emailAlerts: boolean;
  weeklyDigest: boolean;
  aiAutoTagging: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, companyName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_praveen_1',
  name: 'Praveen Kumar',
  email: 'praveen@acmesaas.com',
  jobTitle: 'Senior Staff Product Lead',
  role: 'ADMIN',
  emailAlerts: true,
  weeklyDigest: true,
  aiAutoTagging: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // Lazy state initializers eliminate setState inside useEffect cascades
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('loop_auth_token');
      } catch {
        return null;
      }
    }
    return null;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('loop_auth_user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return !!localStorage.getItem('loop_auth_token');
      } catch {
        return false;
      }
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.data) {
        const loggedUser: UserProfile = {
          id: data.data.user?.id || 'usr_' + Date.now(),
          name: data.data.user?.name || email.split('@')[0],
          email: data.data.user?.email || email,
          jobTitle: data.data.user?.jobTitle || 'Product Manager',
          role: data.data.user?.role || 'ADMIN',
          emailAlerts: data.data.user?.emailAlerts ?? true,
          weeklyDigest: data.data.user?.weeklyDigest ?? true,
          aiAutoTagging: data.data.user?.aiAutoTagging ?? true,
        };
        const authToken = data.data.token || 'loop_token_' + Date.now();

        setUser(loggedUser);
        setToken(authToken);
        setIsAuthenticated(true);

        localStorage.setItem('loop_auth_token', authToken);
        localStorage.setItem('loop_auth_user', JSON.stringify(loggedUser));
        return { success: true };
      }

      return {
        success: false,
        error: data.message || (res.status === 429 ? 'Too many login attempts. Please wait.' : 'Invalid email or password.'),
      };
    } catch {
      // Offline fallback for pre-seeded dev environment
      if (email.toLowerCase() === 'praveen@acmesaas.com' && (pass === 'password123' || pass.length >= 6)) {
        const loggedUser = { ...DEFAULT_USER };
        const authToken = 'loop_token_seeded_praveen';
        setUser(loggedUser);
        setToken(authToken);
        setIsAuthenticated(true);
        localStorage.setItem('loop_auth_token', authToken);
        localStorage.setItem('loop_auth_user', JSON.stringify(loggedUser));
        return { success: true };
      }
      return { success: false, error: 'Network error: could not connect to authentication server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    companyName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: pass,
          companyName: companyName?.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.data) {
        const newUser: UserProfile = {
          id: data.data.user?.id || 'usr_' + Date.now(),
          name: data.data.user?.name || name,
          email: data.data.user?.email || email,
          jobTitle: data.data.user?.jobTitle || 'Administrator',
          role: data.data.user?.role || 'ADMIN',
          emailAlerts: true,
          weeklyDigest: true,
          aiAutoTagging: true,
        };
        const authToken = data.data.token || 'loop_token_' + Date.now();

        setUser(newUser);
        setToken(authToken);
        setIsAuthenticated(true);

        localStorage.setItem('loop_auth_token', authToken);
        localStorage.setItem('loop_auth_user', JSON.stringify(newUser));
        return { success: true };
      }

      return {
        success: false,
        error: data.message || (res.status === 409 ? 'An account with this email already exists.' : 'Registration failed.'),
      };
    } catch {
      return { success: false, error: 'Network error: could not connect to registration service.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('loop_auth_token');
      localStorage.removeItem('loop_auth_user');
      router.push('/login');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not logged in' };
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('loop_auth_user', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: token ? `Bearer ${token}` : '',
          'x-user-id': user.id,
        },
        body: JSON.stringify(updates),
      });
    } catch {
      // Ignored for optimistic UI updates
    }
    return { success: true };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token ? `Bearer ${token}` : '',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.message || 'Incorrect current password.' };
    } catch {
      return { success: false, error: 'Network error: could not update password.' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.message || 'Failed to submit password recovery request.' };
    } catch {
      return { success: false, error: 'Network error: unable to send password recovery instructions.' };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.message || 'Password reset token is invalid or expired.' };
    } catch {
      return { success: false, error: 'Network error: unable to reset password.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
