'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Loading...' }: LoadingAnimationProps) {
  const { currentTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <motion.div
        animate={{
          y: [-20, 0, -20],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-8xl"
      >
        {currentTheme.mascot}
      </motion.div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentTheme.colors.accent }}
          />
        ))}
      </div>

      <motion.p
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="text-lg font-semibold"
        style={{ color: currentTheme.colors.text }}
      >
        {message}
      </motion.p>
    </div>
  );
}
