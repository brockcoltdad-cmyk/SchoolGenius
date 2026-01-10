'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '@/lib/theme-context';
import { getCardStyleClasses } from '@/lib/theme-helpers';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  delay?: number;
}

export default function PremiumCard({
  children,
  className = '',
  style,
  onClick,
  hoverable = true,
  delay = 0,
}: PremiumCardProps) {
  const { currentTheme } = useTheme();
  const themeCardStyles = getCardStyleClasses(currentTheme.style.cardStyle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hoverable ? { y: -8, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        themeCardStyles,
        onClick ? 'cursor-pointer hover:shadow-2xl' : '',
        className
      )}
      style={style}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
