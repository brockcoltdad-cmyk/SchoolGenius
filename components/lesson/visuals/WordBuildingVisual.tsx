'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WordBuildingVisualData {
  sounds: string[];
  word: string;
  emoji: string;
  blend_speed?: 'slow' | 'medium' | 'fast';
}

interface WordBuildingVisualProps {
  data: WordBuildingVisualData;
  isPlaying?: boolean;
}

export default function WordBuildingVisual({ data, isPlaying = true }: WordBuildingVisualProps) {
  const { sounds, word, emoji, blend_speed = 'medium' } = data;
  const [phase, setPhase] = useState<'separate' | 'blending' | 'blended'>('separate');

  const speedMs = { slow: 2000, medium: 1500, fast: 1000 }[blend_speed];

  useEffect(() => {
    if (!isPlaying) return;

    const blendTimer = setTimeout(() => setPhase('blending'), speedMs);
    const blendedTimer = setTimeout(() => setPhase('blended'), speedMs * 2);

    return () => {
      clearTimeout(blendTimer);
      clearTimeout(blendedTimer);
    };
  }, [isPlaying, speedMs]);

  return (
    <div className="word-building-visual text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-8">
        {sounds.map((sound, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -30 }}
            animate={{
              opacity: 1,
              y: 0,
              x: phase === 'blending' || phase === 'blended'
                ? (index - (sounds.length - 1) / 2) * -20
                : 0,
              scale: phase === 'blended' ? 0.9 : 1,
            }}
            transition={{
              delay: index * 0.3,
              x: { duration: 0.5 },
              scale: { duration: 0.3 }
            }}
            className={`w-20 h-24 rounded-xl flex items-center justify-center text-5xl font-bold shadow-lg ${
              phase === 'blended'
                ? 'bg-green-500 text-white'
                : 'bg-blue-100 text-blue-600 border-4 border-blue-300'
            }`}
          >
            {sound}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== 'separate' ? 1 : 0 }}
        className="text-4xl text-gray-400 mb-6"
      >
        ↓
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: phase === 'blended' ? 1 : 0,
          scale: phase === 'blended' ? 1 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex items-center justify-center gap-6"
      >
        <motion.span
          animate={phase === 'blended' ? {
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-7xl"
        >
          {emoji}
        </motion.span>
        <span className="text-6xl font-bold text-green-600">{word}</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xl text-gray-500"
      >
        {phase === 'separate' && "Listen to each sound..."}
        {phase === 'blending' && "Now blend them together..."}
        {phase === 'blended' && `${sounds.join('-')} makes "${word}"!`}
      </motion.p>
    </div>
  );
}
