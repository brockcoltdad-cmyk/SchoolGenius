'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/lib/theme-context';
import { ThemeDecorations } from './ThemeDecorations';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemedBackgroundProps {
  children: ReactNode;
}

export function ThemedBackground({ children }: ThemedBackgroundProps) {
  const { currentTheme } = useTheme();
  const isBattle = currentTheme.id === 'battle';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTheme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen bg-gradient-to-br ${currentTheme.colors.background} relative`}
        style={{
          color: currentTheme.colors.text,
        }}
      >
        {isBattle && (
          <>
            <div
              className="fixed inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px),
                  repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)
                `,
              }}
            />
            <div
              className="fixed inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            <div className="fixed inset-0 bg-gradient-to-br from-red-950/30 via-transparent to-amber-950/20 pointer-events-none" />
            <div
              className="fixed inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)',
              }}
            />
          </>
        )}
        <ThemeDecorations />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
