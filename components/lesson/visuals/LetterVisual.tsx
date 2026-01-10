'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LetterVisualData {
  letter: string;
  letterLower?: string;
  keyword: string;
  emoji: string;
  image_url?: string;
  sound_description?: string;
  example_words?: string[];
  example_emojis?: string[];
}

interface LetterVisualProps {
  data: LetterVisualData;
  isPlaying?: boolean;
}

export default function LetterVisual({ data, isPlaying = true }: LetterVisualProps) {
  const { letter, letterLower, keyword, emoji, example_words, example_emojis } = data;

  return (
    <div className="letter-visual text-center py-8">
      <div className="flex items-center justify-center gap-8 mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl"
        >
          <span className="text-8xl font-bold text-white">{letter}</span>
        </motion.div>

        {letterLower && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
            className="w-28 h-28 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl"
          >
            <span className="text-7xl font-bold text-white">{letterLower}</span>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-6 mb-8"
      >
        <motion.span
          animate={isPlaying ? {
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-8xl"
        >
          {emoji}
        </motion.span>
        <div className="text-left">
          <p className="text-4xl font-bold text-gray-800">
            <span className="text-blue-500">{letter}</span> is for{' '}
            <span className="text-purple-600">{keyword}</span>
          </p>
        </div>
      </motion.div>

      {example_words && example_words.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-6 flex-wrap"
        >
          {example_words.map((word, index) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.2 }}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"
            >
              {example_emojis?.[index] && (
                <span className="text-2xl">{example_emojis[index]}</span>
              )}
              <span className="text-xl font-medium text-gray-700">{word}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
