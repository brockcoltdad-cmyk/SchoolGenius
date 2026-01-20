'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, LogOut, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import ParentHelpButton from '@/components/ParentHelpButton';

// Same 6 themes as Home/Login/Dashboard pages
const themes = [
  { id: 'fortnite', name: 'Battle Royale', emoji: '🎮', gradient: 'from-purple-600 via-pink-600 to-purple-600', primary: '#9333ea', border: 'border-purple-500/50' },
  { id: 'minecraft', name: 'Block Builder', emoji: '⛏️', gradient: 'from-emerald-600 via-green-600 to-emerald-600', primary: '#22c55e', border: 'border-emerald-500/50' },
  { id: 'zombie', name: 'Zombie Survival', emoji: '🧟', gradient: 'from-green-600 via-lime-600 to-green-600', primary: '#16a34a', border: 'border-green-500/50' },
  { id: 'pirate', name: 'Pirate Adventure', emoji: '🏴‍☠️', gradient: 'from-amber-500 via-yellow-600 to-amber-700', primary: '#f59e0b', border: 'border-amber-500/50' },
  { id: 'wwe', name: 'Wrestling Champ', emoji: '💪', gradient: 'from-red-600 via-yellow-500 to-red-600', primary: '#dc2626', border: 'border-red-500/50' },
  { id: 'anime', name: 'Ninja Training', emoji: '⚡', gradient: 'from-pink-500 via-purple-500 to-pink-500', primary: '#ec4899', border: 'border-pink-500/50' },
];

// Export theme styles for child components (backwards compatibility)
export const themeStyles = {
  default: themes[0],
  dark: themes[0],
  nature: themes[1],
  ocean: themes[3],
  sunset: themes[5],
};

export type ThemeStyleKey = keyof typeof themeStyles;

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function DashboardShell({
  children,
  title,
  subtitle,
  showBackButton = false,
  backHref = '/dashboard',
}: DashboardShellProps) {
  const { user, signOut } = useAuth();
  const [themeIndex, setThemeIndex] = useState(0);

  // Read theme from localStorage (same as Home/Login pages)
  useEffect(() => {
    const saved = localStorage.getItem('schoolgenius-theme');
    if (saved) {
      const index = parseInt(saved, 10);
      if (!isNaN(index) && index >= 0 && index < themes.length) {
        setThemeIndex(index);
      }
    }
  }, []);

  const theme = themes[themeIndex];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation - Dark themed matching Home/Login */}
      <nav className="sticky top-0 z-50 border-b-2 border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link href={backHref}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
              )}
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} shadow-xl`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                >
                  <Brain className="h-7 w-7 text-white" />
                </motion.div>
                <span className="text-2xl font-black text-white group-hover:text-gray-300 transition-colors">
                  School Genius
                </span>
              </Link>
            </div>

            {/* Theme indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <span className="text-2xl">{theme.emoji}</span>
              <span className="text-white font-bold">{theme.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/monitoring">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-purple-500/50 bg-purple-500/20 hover:bg-purple-500/30 font-bold text-purple-300"
                >
                  <Activity className="h-4 w-4" />
                  AI Monitor
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={signOut}
                className="flex items-center gap-2 border-2 border-white/20 bg-white/10 hover:bg-white/20 font-bold text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* Optional Title Section */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4 inline-block text-6xl"
            >
              {theme.emoji}
            </motion.div>
            <h1 className="mb-3 text-5xl font-black tracking-tight lg:text-6xl">
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="text-2xl font-bold text-gray-400">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {children}
      </main>

      {user && <ParentHelpButton parentId={user.id} />}
    </div>
  );
}

// Export hook for getting theme in child components
export function useDashboardTheme() {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('schoolgenius-theme');
    if (saved) {
      const index = parseInt(saved, 10);
      if (!isNaN(index) && index >= 0 && index < themes.length) {
        setThemeIndex(index);
      }
    }
  }, []);

  const theme = themes[themeIndex];

  // Return compatible format for existing components
  return {
    theme: {
      emoji: theme.emoji,
      gradient: theme.gradient,
      bgGradient: 'from-black to-black', // Not used anymore
      accent: theme.primary,
      border: theme.border,
      bgGlow: theme.primary,
      text: `text-[${theme.primary}]`,
    },
    isDark: true, // Always dark now
    themeId: theme.id,
  };
}
