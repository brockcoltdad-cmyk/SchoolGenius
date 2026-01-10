'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface MagicPageTransitionProps {
  children: React.ReactNode;
}

export default function MagicPageTransition({ children }: MagicPageTransitionProps) {
  const { currentTheme } = useTheme();

  return (
    <>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 origin-bottom"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
        }}
      >
        <div className="flex h-full items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-9xl"
          >
            {currentTheme.mascot}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  );
}
