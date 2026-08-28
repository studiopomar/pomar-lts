'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SeasonTheme = 'summer' | 'autumn' | 'night';

export interface SeasonThemeInfo {
  id: SeasonTheme;
  emoji: string;
  nameKey: string;
}

export const SEASONS: SeasonThemeInfo[] = [
  { id: 'summer', emoji: '🌿', nameKey: 'themeSummer' },
  { id: 'autumn', emoji: '🍂', nameKey: 'themeAutumn' },
  { id: 'night', emoji: '🌙', nameKey: 'themeNight' },
];

interface ThemeContextType {
  theme: SeasonTheme;
  setTheme: (theme: SeasonTheme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'summer',
  setTheme: () => {},
  cycleTheme: () => {},
});

const STORAGE_KEY = 'studio_pomar_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SeasonTheme>('summer');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as SeasonTheme | null;
      if (savedTheme && (savedTheme === 'summer' || savedTheme === 'autumn' || savedTheme === 'night')) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'summer');
      }
    } catch {
      // Fallback
    }
  }, []);

  const setTheme = (newTheme: SeasonTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch {
      // Ignore storage errors
    }
  };

  const cycleTheme = () => {
    const order: SeasonTheme[] = ['summer', 'autumn', 'night'];
    const nextIdx = (order.indexOf(theme) + 1) % order.length;
    setTheme(order[nextIdx]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
