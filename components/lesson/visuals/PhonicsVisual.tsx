'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PhonicsVisualData {
  sound: string;
  sound_type: 'consonant' | 'vowel' | 'blend' | 'digraph';
  letters: string;
  mouth_description: string;
  example_word: string;
  example_emoji: string;
  related_words?: string[];
}

interface PhonicsVisualProps {
  data: PhonicsVisualData;
  isPlaying?: boolean;
}

export default function PhonicsVisual({ data, isPlaying = true }: PhonicsVisualProps) {
  const { sound, letters, mouth_description, example_word, example_emoji, related_words } = data;

  return (
    <div className="phonics-visual text-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-xl">
          <span className="text-5xl font-bold">{letters}</span>
          <span className="text-3xl">→</span>
          <span className="text-4xl font-medium">{sound}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="inline-block bg-yellow-50 border-2 border-yellow-200 rounded-xl px-6 py-4">
          <p className="text-lg text-gray-700">
            <span className="font-bold text-yellow-600">👄 How to say it: </span>
            {mouth_description}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-6 mb-8"
      >
        <motion.span
          animate={isPlaying ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-7xl"
        >
          {example_emoji}
        </motion.span>
        <div className="text-4xl font-bold">
          <span className="text-green-500">{letters}</span>
          <span className="text-gray-700">{example_word.replace(letters, '')}</span>
        </div>
      </motion.div>

      {related_words && related_words.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {related_words.map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + index * 0.15 }}
              className="bg-gray-100 px-4 py-2 rounded-lg text-xl font-medium text-gray-600"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
