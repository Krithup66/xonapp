/**
 * User Context - จัดการข้อมูลผู้ใช้สำหรับทั้งแอป
 * รองรับระบบ Community และระบบอื่นๆ
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile, AuthUser, UserState } from '../types/user.types';

// AsyncStorage - fallback if package not installed
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fallback to in-memory storage if AsyncStorage is not available
  console.warn('AsyncStorage not available, using in-memory storage');
  const memoryStorage: { [key: string]: string | null } = {};
  AsyncStorage = {
    getItem: async (key: string) => memoryStorage[key] || null,
    setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
    removeItem: async (key: string) => { delete memoryStorage[key]; },
  };
}

interface UserContextType extends UserState {
  login: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@xonapp:user';
const TOKEN_STORAGE_KEY = '@xonapp:token';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // โหลดข้อมูลผู้ใช้จาก AsyncStorage เมื่อเริ่มแอป
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      setIsLoading(true);
      const [userData, token] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(TOKEN_STORAGE_KEY),
      ]);

      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error loading user from storage:', err);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (authUser: AuthUser) => {
    try {
      setIsLoading(true);
      setError(null);

      // สร้าง User object จาก AuthUser
      const userData: User = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // บันทึกลง AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData)),
        authUser.token && AsyncStorage.setItem(TOKEN_STORAGE_KEY, authUser.token),
      ]);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // ลบข้อมูลจาก AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
      ]);

      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err: any) {
      console.error('Error logging out:', err);
      setError(err.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      setIsLoading(true);
      setError(null);

      const updatedUser: User = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      // อัปเดต AsyncStorage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    // TODO: ดึงข้อมูลผู้ใช้ใหม่จาก API
    // ตอนนี้ใช้ข้อมูลจาก AsyncStorage
    await loadUserFromStorage();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
