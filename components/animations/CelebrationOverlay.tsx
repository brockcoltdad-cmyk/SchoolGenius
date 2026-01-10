'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Confetti from './Confetti';
import FloatingCoins from './FloatingCoins';

type CelebrationType = 'correct' | 'wrong' | 'complete' | 'coins';

interface CelebrationOverlayProps {
  type: CelebrationType | null;
  coinAmount?: number;
  onComplete?: () => void;
}

export default function CelebrationOverlay({ type, coinAmount = 5, onComplete }: CelebrationOverlayProps) {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (type) {
      setShowEffect(true);
      const timer = setTimeout(() => {
        setShowEffect(false);
        onComplete?.();
      }, type === 'complete' ? 3000 : 1500);

      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  return (
    <AnimatePresence>
      {type === 'correct' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-green-500 pointer-events-none z-40"
          />
          <FloatingCoins amount={coinAmount} />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="text-9xl">✓</div>
          </motion.div>
        </>
      )}

      {type === 'wrong' && (
        <motion.div
          animate={{
            x: [-20, 20, -20, 20, -10, 10, 0],
          }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none z-40"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.5 }}
            className="w-full h-full bg-red-500"
          />
        </motion.div>
      )}

      {type === 'complete' && (
        <>
          <Confetti active={showEffect} />
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              rotate: [180, 0, 0],
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 shadow-2xl">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-9xl"
              >
                🏆
              </motion.div>
              <div className="text-5xl font-bold text-white drop-shadow-lg">
                Lesson Complete!
              </div>
            </div>
          </motion.div>
        </>
      )}

      {type === 'coins' && <FloatingCoins amount={coinAmount} />}
    </AnimatePresence>
  );
}
