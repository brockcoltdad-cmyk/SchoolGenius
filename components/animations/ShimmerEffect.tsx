'use client';

import { motion } from 'framer-motion';

interface ShimmerEffectProps {
  children: React.ReactNode;
  active?: boolean;
  speed?: number;
  color?: string;
  className?: string;
}

export default function ShimmerEffect({
  children,
  active = true,
  speed = 2,
  color = 'rgba(255, 255, 255, 0.5)',
  className = ''
}: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          }}
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}
