import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, authStorage } from '../services/api';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, confirmPass?: string) => Promise<boolean>;
  logout: () => void;
  quickLoginDemo: (role: 'user' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(authStorage.getToken());
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const refreshUser = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        authStorage.removeToken();
        setToken(null);
      }
    } catch {
      setUser(null);
      authStorage.removeToken();
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email, password: pass });
      if (res.success && res.token) {
        authStorage.setToken(res.token);
        setToken(res.token);
        setUser(res.user);
        success(`Welcome back, ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Login failed. Check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string, confirmPass?: string): Promise<boolean> => {
    try {
      const res = await api.auth.register({
        name,
        email,
        password: pass,
        confirmPassword: confirmPass,
      });
      if (res.success && res.token) {
        authStorage.setToken(res.token);
        setToken(res.token);
        setUser(res.user);
        success(`Account created successfully. Welcome, ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Registration failed.');
      return false;
    }
  };

  const logout = () => {
    authStorage.removeToken();
    setToken(null);
    setUser(null);
    success('Logged out successfully.');
  };

  const quickLoginDemo = async (role: 'user' | 'admin') => {
    if (role === 'admin') {
      await login('admin@resumochi.ai', 'Admin@123');
    } else {
      await login('user@resumochi.ai', 'User@123');
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        quickLoginDemo,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
