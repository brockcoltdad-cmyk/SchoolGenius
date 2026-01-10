'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessRippleProps {
  show: boolean;
  message?: string;
  color?: string;
  onComplete?: () => void;
}

export default function SuccessRipple({
  show,
  message = 'Success!',
  color = '#10b981',
  onComplete
}: SuccessRippleProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 1500);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
              className="absolute rounded-full border-4"
              style={{
                borderColor: color,
                width: 100,
                height: 100,
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 10 }}
            className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 8 }}
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: color }}
            >
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold"
              style={{ color }}
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
