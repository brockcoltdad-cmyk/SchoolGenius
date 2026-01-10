'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showGlow?: boolean;
}

export function AnimatedProgress({
  value,
  max = 100,
  className,
  showGlow = true,
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = (value / max) * 100;
  const isComplete = percentage >= 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn('relative w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(displayValue / max) * 100}%` }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        className={cn(
          'h-full rounded-full relative',
          isComplete
            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
            : 'bg-gradient-to-r from-blue-400 to-cyan-500'
        )}
      >
        {showGlow && isComplete && (
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(34, 197, 94, 0.4)',
                '0 0 40px rgba(34, 197, 94, 0.8)',
                '0 0 20px rgba(34, 197, 94, 0.4)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full"
          />
        )}

        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={displayValue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs font-bold text-gray-700 dark:text-gray-300 drop-shadow-md"
        >
          {Math.round((displayValue / max) * 100)}%
        </motion.span>
      </div>
    </div>
  );
}
