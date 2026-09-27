'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  mounted: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

const themeListeners = new Set<() => void>();

function notify() {
  themeListeners.forEach((l) => l());
}

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

let activeTheme: Theme = 'dark';
let initialized = false;

function getThemeSnapshot(): Theme {
  if (typeof window !== 'undefined' && !initialized) {
    initialized = true;
    try {
      const stored = localStorage.getItem('aura-theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        activeTheme = stored;
      }
    } catch {
      // ignore storage errors
    }
  }
  return activeTheme;
}

function getServerThemeSnapshot(): Theme {
  return 'dark';
}

const emptySubscribe = () => () => {};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('aura-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    activeTheme = newTheme;
    notify();
  };

  const toggleTheme = () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    notify();
  };

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
