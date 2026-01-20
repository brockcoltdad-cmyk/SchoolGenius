'use client';

import { useEffect, useState } from 'react';

// Same 6 themes used on Home/Login pages
const themes = [
  { name: 'Fortnite', primary: '#9333ea', secondary: '#06b6d4', gradient: 'from-purple-600 via-cyan-500 to-purple-600' },
  { name: 'Minecraft', primary: '#22c55e', secondary: '#84cc16', gradient: 'from-green-600 via-lime-500 to-green-600' },
  { name: 'Zombie', primary: '#16a34a', secondary: '#dc2626', gradient: 'from-green-700 via-red-600 to-green-700' },
  { name: 'Pirate', primary: '#f59e0b', secondary: '#78350f', gradient: 'from-amber-500 via-yellow-600 to-amber-700' },
  { name: 'WWE', primary: '#dc2626', secondary: '#fbbf24', gradient: 'from-red-600 via-yellow-500 to-red-600' },
  { name: 'Anime', primary: '#ec4899', secondary: '#8b5cf6', gradient: 'from-pink-500 via-purple-500 to-pink-500' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    // Read the same theme localStorage that Home/Login use
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
    <div className="min-h-screen bg-black text-white">
      {/* Animated gradient background - same as Home/Login */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-20 animate-pulse`}
          style={{ animationDuration: '4s' }}
        />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: theme.primary }}
        />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: theme.secondary }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
