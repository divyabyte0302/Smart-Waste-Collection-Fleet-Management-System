import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user.types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; phone?: string; address?: string; city?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartwaste_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smartwaste_jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('smartwaste_jwt_token');
      if (savedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('smartwaste_user_data', JSON.stringify(profile));
        } catch {
          // Token invalid or expired
          localStorage.removeItem('smartwaste_jwt_token');
          localStorage.removeItem('smartwaste_user_data');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('smartwaste_jwt_token', data.token);
    localStorage.setItem('smartwaste_user_data', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string; address?: string; city?: string }): Promise<User> => {
    const data = await authService.register(payload);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('smartwaste_jwt_token', data.token);
    localStorage.setItem('smartwaste_user_data', JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('smartwaste_user_data', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
