'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'circle' | 'button';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ variant = 'text', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <motion.div
            className={`h-4 rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 ${className}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 100%' }}
          />
        );
      case 'card':
        return (
          <motion.div
            className={`h-48 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 ${className}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 100%' }}
          />
        );
      case 'circle':
        return (
          <motion.div
            className={`h-16 w-16 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 ${className}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 100%' }}
          />
        );
      case 'button':
        return (
          <motion.div
            className={`h-12 rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 ${className}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 100%' }}
          />
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-4 last:mb-0">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
