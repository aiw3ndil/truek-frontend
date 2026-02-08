'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, register as registerService, updateProfile } from '@/services/auth';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  language?: string;
  region?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  register: (username: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  isAuthenticated: () => boolean;
  updateUserProfile: (name: string, language: string, region: string, picture: File | string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchMe = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchMe();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const register = async (username: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const data = await registerService(username, email, password);
      localStorage.setItem('token', data.token);
      await fetchMe();
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (name: string, language: string, region: string, picture: File | string) => {
    const token = localStorage.getItem('token');
    if (token && user) {
      try {
        await updateProfile(token, name, language, region, picture);
        // Update user state locally to avoid race condition with fetchMe
        const updatedUser = { ...user, name, language, region };
        // If a new picture was uploaded, we can't know the new URL without a response
        // For now, we'll refetch from the server to get the new picture URL.
        // A better long-term solution would be for the API to return the updated user object.
        if (typeof picture === 'string') {
          updatedUser.picture = picture;
        }
        setUser(updatedUser);
        // We still need to fetch if a file was uploaded to get the new URL
        if (picture instanceof File) {
          await fetchMe();
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated, updateUserProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
