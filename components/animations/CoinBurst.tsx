'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';

interface CoinBurstProps {
  show: boolean;
  count: number;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export default function CoinBurst({ show, count, position, onComplete }: CoinBurstProps) {
  const [coins, setCoins] = useState<Array<{ id: number; angle: number; distance: number; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const numCoins = Math.min(count, 20);
      const newCoins = Array.from({ length: numCoins }, (_, i) => ({
        id: i,
        angle: (360 / numCoins) * i,
        distance: 100 + Math.random() * 100,
        delay: i * 0.05,
      }));
      setCoins(newCoins);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, count, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: position?.x ?? '50%',
            top: position?.y ?? '50%',
          }}
        >
          {coins.map((coin) => {
            const radian = (coin.angle * Math.PI) / 180;
            const x = Math.cos(radian) * coin.distance;
            const y = Math.sin(radian) * coin.distance;

            return (
              <motion.div
                key={coin.id}
                initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x,
                  y,
                  scale: [0, 1.5, 1, 0.5, 0],
                  rotate: [0, 180, 360, 540, 720],
                  opacity: [0, 1, 1, 0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: coin.delay,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="absolute"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                  <Crown className="h-6 w-6 text-yellow-900" />
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="text-5xl font-black text-yellow-500 drop-shadow-lg">
              +{count}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
