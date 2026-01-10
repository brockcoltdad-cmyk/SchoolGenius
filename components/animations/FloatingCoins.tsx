'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

interface FloatingCoinsProps {
  amount: number;
  x?: number;
  y?: number;
  onComplete?: () => void;
}

export default function FloatingCoins({ amount, x = 50, y = 50, onComplete }: FloatingCoinsProps) {
  const { currentTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{
        x: `${x}%`,
        y: `${y}%`,
        opacity: 0,
        scale: 0.5,
        rotate: 0,
      }}
      animate={{
        y: `${y - 20}%`,
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.8],
        rotate: 360,
      }}
      transition={{
        duration: 2,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="fixed pointer-events-none z-50 text-4xl font-bold"
      style={{
        color: currentTheme.colors.accent,
        textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
      }}
    >
      +{amount}
      <motion.span
        animate={{
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
        className="ml-1"
      >
        ✨
      </motion.span>
    </motion.div>
  );
}
