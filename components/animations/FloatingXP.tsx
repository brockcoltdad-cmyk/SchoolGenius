"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, Trophy, Target } from 'lucide-react';

interface FloatingXPProps {
  amount: number;
  x: number;
  y: number;
  onComplete?: () => void;
  variant?: 'xp' | 'coins' | 'stars' | 'achievement' | 'combo';
}

const variantConfig = {
  xp: {
    color: 'from-blue-400 to-blue-600',
    icon: Zap,
    prefix: '+',
    suffix: ' XP'
  },
  coins: {
    color: 'from-yellow-400 to-yellow-600',
    icon: Sparkles,
    prefix: '+',
    suffix: ' coins'
  },
  stars: {
    color: 'from-purple-400 to-purple-600',
    icon: Star,
    prefix: '+',
    suffix: ' ⭐'
  },
  achievement: {
    color: 'from-green-400 to-green-600',
    icon: Trophy,
    prefix: '',
    suffix: ' Achievement!'
  },
  combo: {
    color: 'from-orange-400 to-red-600',
    icon: Target,
    prefix: '',
    suffix: 'x COMBO!'
  }
};

export function FloatingXP({
  amount,
  x,
  y,
  onComplete,
  variant = 'xp'
}: FloatingXPProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.8],
        y: -100,
      }}
      transition={{
        duration: 2,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        bg-gradient-to-r ${config.color}
        text-white font-bold text-xl
        shadow-2xl backdrop-blur-sm
        border-2 border-white/30
      `}>
        <Icon className="w-6 h-6" />
        <span>
          {config.prefix}{amount}{config.suffix}
        </span>
      </div>

      <motion.div
        className="absolute inset-0 rounded-full blur-xl opacity-50"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 2] }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(circle, ${config.color.split(' ')[1].replace('to-', '')} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
}

interface FloatingXPManagerProps {
  children: React.ReactNode;
}

interface XPInstance {
  id: string;
  amount: number;
  x: number;
  y: number;
  variant: 'xp' | 'coins' | 'stars' | 'achievement' | 'combo';
}

export function FloatingXPManager({ children }: FloatingXPManagerProps) {
  const [xpInstances, setXpInstances] = useState<XPInstance[]>([]);

  useEffect(() => {
    const handleXPGain = (event: CustomEvent) => {
      const { amount, x, y, variant = 'xp' } = event.detail;
      const id = Math.random().toString(36).substr(2, 9);

      setXpInstances(prev => [...prev, { id, amount, x, y, variant }]);
    };

    window.addEventListener('xp-gained' as any, handleXPGain);
    return () => window.removeEventListener('xp-gained' as any, handleXPGain);
  }, []);

  const removeXP = (id: string) => {
    setXpInstances(prev => prev.filter(xp => xp.id !== id));
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {xpInstances.map(xp => (
          <FloatingXP
            key={xp.id}
            amount={xp.amount}
            x={xp.x}
            y={xp.y}
            variant={xp.variant}
            onComplete={() => removeXP(xp.id)}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

export function triggerXPGain(
  amount: number,
  x: number,
  y: number,
  variant: 'xp' | 'coins' | 'stars' | 'achievement' | 'combo' = 'xp'
) {
  window.dispatchEvent(
    new CustomEvent('xp-gained', {
      detail: { amount, x, y, variant }
    })
  );
}
