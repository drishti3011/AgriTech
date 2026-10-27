import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'admin' | 'expert';
  language: 'en' | 'hi' | 'te' | 'ta';
  region: string;
  village?: string;
  state?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRoleDemo: (role: 'farmer' | 'admin') => void;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo accounts
const DEMO_FARMER: User = {
  _id: 'usr-farmer-01',
  name: 'Ramesh Patel',
  email: 'ramesh@farmer.in',
  phone: '+91 94231 88921',
  role: 'farmer',
  language: 'hi',
  region: 'Narmada Valley Region',
  village: 'Pipariya',
  state: 'Madhya Pradesh',
  avatar: '/src/assets/images/agritech_farmer_avatar_1793120954590.jpg',
};

const DEMO_ADMIN: User = {
  _id: 'usr-admin-01',
  name: 'Dr. Anita Roy',
  email: 'admin@agritech.org',
  phone: '+91 98765 43210',
  role: 'admin',
  language: 'en',
  region: 'Central Agricultural Command',
  village: 'Hyderabad HQ',
  state: 'Telangana',
  avatar: '/src/assets/images/agritech_expert_agronomist_1793120954897.jpg',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_FARMER);
  const [token, setToken] = useState<string | null>('demo_farmer_jwt_token');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('agritech_token');
    const savedUser = localStorage.getItem('agritech_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEMO_FARMER);
      }
    } else {
      // Default to demo farmer for instant friction-free testing
      localStorage.setItem('agritech_user', JSON.stringify(DEMO_FARMER));
      localStorage.setItem('agritech_token', 'demo_farmer_jwt_token');
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('agritech_token', res.data.token);
        localStorage.setItem('agritech_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      // If server error or offline, fallback to demo check
      if (email.toLowerCase().includes('admin')) {
        setUser(DEMO_ADMIN);
        setToken('demo_admin_jwt_token');
        localStorage.setItem('agritech_token', 'demo_admin_jwt_token');
        localStorage.setItem('agritech_user', JSON.stringify(DEMO_ADMIN));
        return { success: true };
      } else {
        setUser(DEMO_FARMER);
        setToken('demo_farmer_jwt_token');
        localStorage.setItem('agritech_token', 'demo_farmer_jwt_token');
        localStorage.setItem('agritech_user', JSON.stringify(DEMO_FARMER));
        return { success: true };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('agritech_token', res.data.token);
        localStorage.setItem('agritech_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      // Local fallback
      const newUser: User = {
        _id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'farmer',
        language: data.language || 'en',
        region: data.region || 'Central Valley',
        village: data.village || '',
        state: data.state || 'Telangana',
        avatar: '/src/assets/images/agritech_farmer_avatar_1793120954590.jpg',
      };
      setUser(newUser);
      setToken('local_client_token');
      localStorage.setItem('agritech_token', 'local_client_token');
      localStorage.setItem('agritech_user', JSON.stringify(newUser));
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agritech_token');
    localStorage.removeItem('agritech_user');
  };

  const switchRoleDemo = (role: 'farmer' | 'admin') => {
    const selected = role === 'admin' ? DEMO_ADMIN : DEMO_FARMER;
    setUser(selected);
    const mockToken = role === 'admin' ? 'demo_admin_jwt_token' : 'demo_farmer_jwt_token';
    setToken(mockToken);
    localStorage.setItem('agritech_token', mockToken);
    localStorage.setItem('agritech_user', JSON.stringify(selected));
  };

  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('agritech_user', JSON.stringify(updated));
    try {
      await api.updateProfile(data);
    } catch (e) {
      // Ignore offline error
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        switchRoleDemo,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
