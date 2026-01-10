"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Sparkles, Trophy, Zap, Heart, Star, Frown, ThumbsUp } from 'lucide-react';

type Expression =
  | 'happy'
  | 'excited'
  | 'celebrating'
  | 'encouraging'
  | 'proud'
  | 'thinking'
  | 'concerned'
  | 'cheering';

interface GigiExpression {
  type: Expression;
  message?: string;
  duration?: number;
}

const expressionConfig: Record<Expression, {
  icon: any;
  color: string;
  animation: any;
  particles: boolean;
}> = {
  happy: {
    icon: Smile,
    color: 'from-yellow-400 to-orange-400',
    animation: { rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] },
    particles: false
  },
  excited: {
    icon: Zap,
    color: 'from-blue-400 to-purple-500',
    animation: { y: [0, -10, 0], scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] },
    particles: true
  },
  celebrating: {
    icon: Trophy,
    color: 'from-yellow-300 to-yellow-500',
    animation: {
      y: [0, -20, -10, -20, 0],
      rotate: [0, -15, 15, -15, 0],
      scale: [1, 1.3, 1.2, 1.3, 1]
    },
    particles: true
  },
  encouraging: {
    icon: ThumbsUp,
    color: 'from-green-400 to-green-600',
    animation: { y: [0, -5, 0], scale: [1, 1.1, 1] },
    particles: false
  },
  proud: {
    icon: Star,
    color: 'from-pink-400 to-purple-500',
    animation: { rotate: [0, 360], scale: [1, 1.2, 1] },
    particles: true
  },
  thinking: {
    icon: Sparkles,
    color: 'from-blue-300 to-blue-500',
    animation: { rotate: [0, 5, -5, 0] },
    particles: false
  },
  concerned: {
    icon: Frown,
    color: 'from-orange-400 to-red-400',
    animation: { y: [0, 2, 0], rotate: [0, -3, 3, 0] },
    particles: false
  },
  cheering: {
    icon: Heart,
    color: 'from-red-400 to-pink-500',
    animation: { scale: [1, 1.3, 1.1, 1.3, 1], rotate: [0, -10, 10, 0] },
    particles: true
  }
};

interface GigiCharacterWithExpressionsProps {
  expression?: Expression;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'corner' | 'center' | 'floating';
}

export function GigiCharacterWithExpressions({
  expression = 'happy',
  message,
  size = 'md',
  position = 'corner'
}: GigiCharacterWithExpressionsProps) {
  const config = expressionConfig[expression];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const positionClasses = {
    corner: 'fixed bottom-4 right-4 z-50',
    center: 'mx-auto',
    floating: 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50'
  };

  return (
    <div className={positionClasses[position]}>
      <motion.div
        className="relative"
        animate={config.animation}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      >
        <div className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br ${config.color}
          shadow-2xl
          flex items-center justify-center
          relative
          overflow-hidden
        `}>
          <Icon className="w-1/2 h-1/2 text-white" strokeWidth={2.5} />

          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          />
        </div>

        {config.particles && (
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-40px)`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-xl">
              <p className="text-sm font-medium">{message}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                <div className="border-8 border-transparent border-t-white dark:border-t-gray-800" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GigiExpressionManager({ children }: { children: React.ReactNode }) {
  const [currentExpression, setCurrentExpression] = useState<GigiExpression | null>(null);

  useEffect(() => {
    const handleExpression = (event: CustomEvent<GigiExpression>) => {
      setCurrentExpression(event.detail);

      if (event.detail.duration) {
        setTimeout(() => {
          setCurrentExpression(null);
        }, event.detail.duration);
      }
    };

    window.addEventListener('gigi-expression' as any, handleExpression);
    return () => window.removeEventListener('gigi-expression' as any, handleExpression);
  }, []);

  return (
    <>
      {children}
      <AnimatePresence>
        {currentExpression && (
          <GigiCharacterWithExpressions
            expression={currentExpression.type}
            message={currentExpression.message}
            position="corner"
            size="md"
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function triggerGigiExpression(
  type: Expression,
  message?: string,
  duration: number = 3000
) {
  window.dispatchEvent(
    new CustomEvent('gigi-expression', {
      detail: { type, message, duration }
    })
  );
}
