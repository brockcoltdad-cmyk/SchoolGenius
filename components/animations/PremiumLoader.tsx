'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import GigiCharacter from './GigiCharacter';

interface PremiumLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function PremiumLoader({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
}: PremiumLoaderProps) {
  const { currentTheme } = useTheme();

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const gigiSize = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center"
    >
      <GigiCharacter size={gigiSize[size]} showName={false} showGreeting={false} />

      <motion.div
        className={`mt-4 font-semibold ${sizeClasses[size]}`}
        style={{ color: currentTheme.colors.primary }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {message}
      </motion.div>

      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: currentTheme.colors.primary }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.background})`,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center py-12">
      {content}
    </div>
  );
}
