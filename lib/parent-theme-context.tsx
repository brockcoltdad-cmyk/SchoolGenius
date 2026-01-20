'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ParentThemeId = 'default' | 'dark' | 'nature' | 'ocean' | 'sunset';

export interface ParentTheme {
  id: ParentThemeId;
  name: string;
  description: string;
  colors: {
    // Background
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    bgCardHover: string;
    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    // Accents
    accentPrimary: string;
    accentSecondary: string;
    accentSuccess: string;
    accentWarning: string;
    accentDanger: string;
    // Borders
    borderLight: string;
    borderMedium: string;
    // Gradients
    gradientPrimary: string;
    gradientAccent: string;
  };
  isDark: boolean;
}

export const parentThemes: Record<ParentThemeId, ParentTheme> = {
  default: {
    id: 'default',
    name: 'Classic',
    description: 'Clean blue and white professional look',
    colors: {
      bgPrimary: 'bg-slate-50',
      bgSecondary: 'bg-white',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-slate-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      accentPrimary: 'text-blue-600',
      accentSecondary: 'text-indigo-600',
      accentSuccess: 'text-emerald-600',
      accentWarning: 'text-amber-600',
      accentDanger: 'text-red-600',
      borderLight: 'border-slate-100',
      borderMedium: 'border-slate-200',
      gradientPrimary: 'from-blue-600 to-indigo-600',
      gradientAccent: 'from-blue-500 to-purple-500',
    },
    isDark: false,
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes, perfect for night',
    colors: {
      bgPrimary: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgCard: 'bg-slate-800',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      accentPrimary: 'text-blue-400',
      accentSecondary: 'text-purple-400',
      accentSuccess: 'text-emerald-400',
      accentWarning: 'text-amber-400',
      accentDanger: 'text-red-400',
      borderLight: 'border-slate-700',
      borderMedium: 'border-slate-600',
      gradientPrimary: 'from-blue-500 to-purple-600',
      gradientAccent: 'from-purple-500 to-pink-500',
    },
    isDark: true,
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'Calming greens and earth tones',
    colors: {
      bgPrimary: 'bg-stone-50',
      bgSecondary: 'bg-white',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-stone-50',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-600',
      textMuted: 'text-stone-400',
      accentPrimary: 'text-emerald-600',
      accentSecondary: 'text-teal-600',
      accentSuccess: 'text-green-600',
      accentWarning: 'text-amber-600',
      accentDanger: 'text-red-600',
      borderLight: 'border-stone-100',
      borderMedium: 'border-stone-200',
      gradientPrimary: 'from-emerald-600 to-teal-600',
      gradientAccent: 'from-green-500 to-emerald-500',
    },
    isDark: false,
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and refreshing teals',
    colors: {
      bgPrimary: 'bg-cyan-50',
      bgSecondary: 'bg-white',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-cyan-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      accentPrimary: 'text-cyan-600',
      accentSecondary: 'text-blue-600',
      accentSuccess: 'text-teal-600',
      accentWarning: 'text-amber-600',
      accentDanger: 'text-red-600',
      borderLight: 'border-cyan-100',
      borderMedium: 'border-cyan-200',
      gradientPrimary: 'from-cyan-600 to-blue-600',
      gradientAccent: 'from-teal-500 to-cyan-500',
    },
    isDark: false,
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and soft purples',
    colors: {
      bgPrimary: 'bg-orange-50',
      bgSecondary: 'bg-white',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-orange-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      accentPrimary: 'text-orange-600',
      accentSecondary: 'text-purple-600',
      accentSuccess: 'text-emerald-600',
      accentWarning: 'text-amber-600',
      accentDanger: 'text-red-600',
      borderLight: 'border-orange-100',
      borderMedium: 'border-orange-200',
      gradientPrimary: 'from-orange-500 to-purple-600',
      gradientAccent: 'from-amber-500 to-orange-500',
    },
    isDark: false,
  },
};

interface ParentThemeContextType {
  currentTheme: ParentTheme;
  themeId: ParentThemeId;
  setTheme: (themeId: ParentThemeId) => void;
  themes: typeof parentThemes;
}

const ParentThemeContext = createContext<ParentThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'schoolgenius-parent-theme';

export function ParentThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ParentThemeId>('default');
  const [mounted, setMounted] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ParentThemeId;
    if (saved && parentThemes[saved]) {
      setThemeId(saved);
    }
    setMounted(true);
  }, []);

  // Save theme when changed
  const setTheme = (newThemeId: ParentThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem(STORAGE_KEY, newThemeId);
  };

  const currentTheme = parentThemes[themeId];

  // Apply dark mode class to body
  useEffect(() => {
    if (mounted) {
      if (currentTheme.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [currentTheme.isDark, mounted]);

  // Always render children - use default theme until mounted to prevent hydration issues
  // but still allow links to work during initial server render
  return (
    <ParentThemeContext.Provider value={{ currentTheme, themeId, setTheme, themes: parentThemes }}>
      {children}
    </ParentThemeContext.Provider>
  );
}

export function useParentTheme() {
  const context = useContext(ParentThemeContext);
  if (context === undefined) {
    throw new Error('useParentTheme must be used within a ParentThemeProvider');
  }
  return context;
}

// Helper to get theme-aware classes
export function getThemeClasses(theme: ParentTheme) {
  return {
    // Page background
    pageBg: `${theme.colors.bgPrimary} min-h-screen`,
    // Cards
    card: `${theme.colors.bgCard} ${theme.colors.borderLight} border rounded-xl shadow-sm`,
    cardHover: `${theme.colors.bgCard} ${theme.colors.bgCardHover} ${theme.colors.borderLight} border rounded-xl shadow-sm transition-colors`,
    // Text
    heading: `${theme.colors.textPrimary} font-bold`,
    body: theme.colors.textSecondary,
    muted: theme.colors.textMuted,
    // Buttons
    buttonPrimary: `bg-gradient-to-r ${theme.colors.gradientPrimary} text-white font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity`,
    buttonSecondary: `${theme.colors.bgCard} ${theme.colors.textPrimary} ${theme.colors.borderMedium} border font-medium rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors`,
    // Accents
    accent: theme.colors.accentPrimary,
    success: theme.colors.accentSuccess,
    warning: theme.colors.accentWarning,
    danger: theme.colors.accentDanger,
  };
}
