'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LevelUpCelebrationProps {
  show: boolean;
  level: number;
  message?: string;
  onComplete?: () => void;
}

export function LevelUpCelebration({
  show,
  level,
  message = 'LEVEL UP!',
  onComplete,
}: LevelUpCelebrationProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl pointer-events-none"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent mb-4"
                   style={{
                     textShadow: '0 0 60px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 165, 0, 0.6)',
                     WebkitTextStroke: '3px rgba(0,0,0,0.3)'
                   }}>
                {message}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-5xl font-bold text-white flex items-center justify-center gap-4"
              >
                <Trophy className="w-16 h-16 text-yellow-400" />
                <span>Level {level}</span>
                <Trophy className="w-16 h-16 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Burst Effect */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * 22.5 * Math.PI / 180) * 250,
                  y: Math.sin(i * 22.5 * Math.PI / 180) * 250,
                }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
                className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                style={{ filter: 'blur(4px)' }}
              />
            ))}

            {/* Stars */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.5, 1],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </motion.div>
            ))}

            {/* Sparkles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface VictoryCelebrationProps {
  show: boolean;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
}

export function VictoryCelebration({
  show,
  title = 'VICTORY!',
  subtitle,
  onComplete,
}: VictoryCelebrationProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl pointer-events-none"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-9xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent mb-4"
                   style={{
                     textShadow: '0 0 60px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 165, 0, 0.6)',
                     WebkitTextStroke: '3px rgba(0,0,0,0.3)'
                   }}>
                {title}
              </div>
              {subtitle && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-3xl font-bold text-white"
                >
                  {subtitle}
                </motion.div>
              )}
            </motion.div>

            {/* Victory Burst Effect */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * 30 * Math.PI / 180) * 200,
                  y: Math.sin(i * 30 * Math.PI / 180) * 200,
                }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
                className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                style={{ filter: 'blur(4px)' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
