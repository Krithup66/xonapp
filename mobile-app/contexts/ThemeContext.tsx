/**
 * Theme Context - จัดการ Dark/Light Mode
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode, ThemeColors, getTheme } from '../utils/theme';

interface ThemeContextType {
  mode: ThemeMode;
  theme: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemColorScheme || 'dark');
  
  // Sync with system theme changes
  useEffect(() => {
    // Optional: Auto-follow system theme
    // setMode(systemColorScheme || 'dark');
  }, [systemColorScheme]);
  
  const theme = getTheme(mode);
  
  const toggleTheme = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };
  
  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
