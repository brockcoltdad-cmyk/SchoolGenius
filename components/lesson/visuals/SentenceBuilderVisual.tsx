'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WordPart {
  word: string;
  part_of_speech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'article';
}

interface SentenceBuilderVisualData {
  words: WordPart[];
  show_labels?: boolean;
}

interface SentenceBuilderVisualProps {
  data: SentenceBuilderVisualData;
  isPlaying?: boolean;
}

const PART_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  noun: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'NOUN' },
  verb: { bg: 'bg-red-100', text: 'text-red-700', label: 'VERB' },
  adjective: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'ADJ' },
  adverb: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'ADV' },
  pronoun: { bg: 'bg-green-100', text: 'text-green-700', label: 'PRON' },
  preposition: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'PREP' },
  conjunction: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'CONJ' },
  article: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'ART' },
};

export default function SentenceBuilderVisual({ data, isPlaying = true }: SentenceBuilderVisualProps) {
  const { words, show_labels = true } = data;

  return (
    <div className="sentence-builder-visual text-center py-8">
      <div className="flex items-end justify-center gap-3 flex-wrap mb-8">
        {words.map((wordPart, index) => {
          const colors = PART_COLORS[wordPart.part_of_speech] || PART_COLORS.noun;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center"
            >
              {show_labels && (
                <span className={`text-xs font-bold ${colors.text} mb-1`}>
                  {colors.label}
                </span>
              )}

              <div className={`${colors.bg} ${colors.text} px-4 py-3 rounded-xl text-2xl font-bold`}>
                {wordPart.word}
              </div>
            </motion.div>
          );
        })}

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: words.length * 0.2 }}
          className="text-4xl font-bold text-gray-400 self-end pb-2"
        >
          .
        </motion.span>
      </div>

      {show_labels && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {Object.entries(PART_COLORS).slice(0, 4).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1 text-sm">
              <div className={`w-4 h-4 rounded ${value.bg}`} />
              <span className="text-gray-600 capitalize">{key}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
