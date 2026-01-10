'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SightWordVisualData {
  word: string;
  sentence: string;
  word_position: number;
  image_emoji?: string;
  color?: string;
}

interface SightWordVisualProps {
  data: SightWordVisualData;
  isPlaying?: boolean;
}

export default function SightWordVisual({ data, isPlaying = true }: SightWordVisualProps) {
  const { word, sentence, word_position, image_emoji, color = 'yellow' } = data;
  const words = sentence.split(' ');

  return (
    <div className="sight-word-visual text-center py-8">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <span className="text-8xl font-bold text-yellow-500 drop-shadow-lg">
          {word}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg px-8 py-6 inline-block mb-6"
      >
        <p className="text-3xl">
          {words.map((w, index) => (
            <span key={index}>
              {index === word_position ? (
                <motion.span
                  animate={isPlaying ? {
                    backgroundColor: ['#FEF3C7', '#FDE68A', '#FEF3C7'],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-yellow-200 px-2 py-1 rounded font-bold text-yellow-700"
                >
                  {w}
                </motion.span>
              ) : (
                <span className="text-gray-700">{w}</span>
              )}
              {index < words.length - 1 && ' '}
            </span>
          ))}
        </p>
      </motion.div>

      {image_emoji && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="text-7xl"
        >
          {image_emoji}
        </motion.div>
      )}
    </div>
  );
}
