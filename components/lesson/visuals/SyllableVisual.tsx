'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SyllableVisualData {
  word: string;
  syllables: string[];
  syllable_type?: string;
}

interface SyllableVisualProps {
  data: SyllableVisualData;
  isPlaying?: boolean;
}

const SYLLABLE_COLORS = [
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-orange-400',
  'bg-pink-400',
  'bg-teal-400',
];

export default function SyllableVisual({ data, isPlaying = true }: SyllableVisualProps) {
  const { word, syllables, syllable_type } = data;
  const [activeSyllable, setActiveSyllable] = useState(-1);

  useEffect(() => {
    if (!isPlaying) return;

    let index = 0;
    const interval = setInterval(() => {
      setActiveSyllable(index);
      index++;
      if (index >= syllables.length) {
        clearInterval(interval);
        setTimeout(() => setActiveSyllable(-2), 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, syllables.length]);

  return (
    <div className="syllable-visual text-center py-8">
      {syllable_type && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-500 mb-4"
        >
          {syllable_type}
        </motion.p>
      )}

      <div className="flex items-center justify-center gap-3 mb-8">
        {syllables.map((syllable, index) => (
          <React.Fragment key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: activeSyllable === index ? 1.15 : 1,
              }}
              transition={{ delay: index * 0.2 }}
              className={`px-6 py-4 rounded-xl text-3xl font-bold text-white shadow-lg ${
                SYLLABLE_COLORS[index % SYLLABLE_COLORS.length]
              } ${activeSyllable === index ? 'ring-4 ring-yellow-300' : ''}`}
            >
              {syllable}
            </motion.div>

            {index < syllables.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl text-gray-400"
              >
                •
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: activeSyllable === -2 ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
        className="text-5xl font-bold text-gray-700"
      >
        {word}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-gray-500"
      >
        <span className="text-2xl">👏</span>
        <span className="ml-2 text-lg">{syllables.length} claps = {syllables.length} syllables</span>
      </motion.div>
    </div>
  );
}
