'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoopAnimationVisualData {
  character: string;
  action: 'walk' | 'jump' | 'spin' | 'wave';
  times: number;
  show_code?: boolean;
  code_snippet?: string;
}

interface LoopAnimationVisualProps {
  data: LoopAnimationVisualData;
  isPlaying?: boolean;
}

export default function LoopAnimationVisual({ data, isPlaying = true }: LoopAnimationVisualProps) {
  const { character, action, times, show_code = true, code_snippet } = data;
  const [currentLoop, setCurrentLoop] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    let loop = 0;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentLoop(loop + 1);

      setTimeout(() => setIsAnimating(false), 600);

      loop++;
      if (loop >= times) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, times]);

  const getAnimation = () => {
    if (!isAnimating) return {};

    switch (action) {
      case 'walk':
        return { x: [0, 50, 0] };
      case 'jump':
        return { y: [0, -40, 0] };
      case 'spin':
        return { rotate: [0, 360] };
      case 'wave':
        return { rotate: [0, 20, -20, 20, 0] };
      default:
        return {};
    }
  };

  const defaultCode = `for i in range(${times}):\n    ${character}.${action}()`;

  return (
    <div className="loop-animation-visual text-center py-6">
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: times }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i < currentLoop ? 1 : 0.8,
              backgroundColor: i < currentLoop ? '#22c55e' : '#e5e7eb',
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
          >
            {i + 1}
          </motion.div>
        ))}
      </div>

      <div className="h-32 flex items-center justify-center">
        <motion.span
          animate={getAnimation()}
          transition={{ duration: 0.5 }}
          className="text-8xl"
        >
          {character}
        </motion.span>
      </div>

      <motion.p
        animate={{ scale: isAnimating ? 1.1 : 1 }}
        className="text-2xl font-bold text-gray-700 mb-6"
      >
        {currentLoop === 0
          ? `Ready to ${action} ${times} times!`
          : currentLoop < times
          ? `${action.charAt(0).toUpperCase() + action.slice(1)}ing... (${currentLoop}/${times})`
          : `Done! ${action.charAt(0).toUpperCase() + action.slice(1)}ed ${times} times! ✓`
        }
      </motion.p>

      {show_code && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-block bg-gray-900 text-left px-6 py-4 rounded-xl font-mono text-lg"
        >
          <pre className="text-green-400">
            {code_snippet || defaultCode}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
