'use client';

import { motion } from 'framer-motion';

interface PulseGlowProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export default function PulseGlow({
  color,
  size = 'md',
  intensity = 'medium',
  className = ''
}: PulseGlowProps) {
  const sizeMap = {
    sm: 'h-24 w-24',
    md: 'h-40 w-40',
    lg: 'h-56 w-56',
  };

  const opacityMap = {
    low: [0.1, 0.2, 0.1],
    medium: [0.2, 0.4, 0.2],
    high: [0.3, 0.6, 0.3],
  };

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none ${sizeMap[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, ${color}, transparent)`,
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: opacityMap[intensity],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
