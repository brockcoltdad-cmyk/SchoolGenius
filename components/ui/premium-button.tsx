'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '@/lib/theme-context';
import { getButtonStyleClasses } from '@/lib/theme-helpers';
import { cn } from '@/lib/utils';

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function PremiumButton({
  children,
  onClick,
  disabled = false,
  className = '',
  style,
  variant = 'primary',
  size = 'md',
}: PremiumButtonProps) {
  const { currentTheme } = useTheme();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const themeButtonStyles = getButtonStyleClasses(currentTheme.style.buttonStyle);

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
        themeButtonStyles,
        sizeClasses[size],
        className
      )}
      style={style}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
