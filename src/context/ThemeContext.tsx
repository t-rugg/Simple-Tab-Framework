'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'light' | 'dark';

interface ThemeContextType {
  themeName: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeName;
      const initialTheme = savedTheme && (savedTheme === 'light' || savedTheme === 'dark')
        ? savedTheme
        : 'light';
      setThemeName(initialTheme);
      setMounted(true);
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('theme', themeName);
      document.documentElement.setAttribute('data-theme', themeName);
    }
  }, [themeName, mounted]);

  const toggleTheme = () => {
    setThemeName(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
