'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Transformation {
  before: string;
  after: string;
  change_highlight?: string;
}

interface SpellingRuleVisualData {
  rule_name: string;
  rule_short: string;
  transformations: Transformation[];
  magic_character?: string;
}

interface SpellingRuleVisualProps {
  data: SpellingRuleVisualData;
  isPlaying?: boolean;
}

export default function SpellingRuleVisual({ data, isPlaying = true }: SpellingRuleVisualProps) {
  const { rule_name, rule_short, transformations, magic_character = '✨' } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'before' | 'transforming' | 'after'>('before');

  useEffect(() => {
    if (!isPlaying) return;

    const phaseTimer = setInterval(() => {
      setPhase(prev => {
        if (prev === 'before') return 'transforming';
        if (prev === 'transforming') return 'after';
        setActiveIndex(i => (i + 1) % transformations.length);
        return 'before';
      });
    }, 1200);

    return () => clearInterval(phaseTimer);
  }, [isPlaying, transformations.length]);

  const current = transformations[activeIndex];

  return (
    <div className="spelling-rule-visual text-center py-6">
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-purple-600 mb-2"
      >
        {rule_name}
      </motion.h3>
      <p className="text-lg text-gray-600 mb-8">{rule_short}</p>

      <div className="flex items-center justify-center gap-6 mb-8">
        <motion.div
          animate={{
            opacity: phase === 'after' ? 0.4 : 1,
            scale: phase === 'before' ? 1.1 : 1,
          }}
          className="bg-red-50 border-2 border-red-200 rounded-xl px-6 py-4"
        >
          <span className="text-4xl font-bold text-red-600">{current.before}</span>
        </motion.div>

        <motion.div
          animate={{ scale: phase === 'transforming' ? 1.3 : 1 }}
          className="text-4xl"
        >
          {phase === 'transforming' ? magic_character : '→'}
        </motion.div>

        <motion.div
          animate={{
            opacity: phase === 'before' ? 0.4 : 1,
            scale: phase === 'after' ? 1.1 : 1,
          }}
          className="bg-green-50 border-2 border-green-200 rounded-xl px-6 py-4"
        >
          <span className="text-4xl font-bold text-green-600">{current.after}</span>
        </motion.div>
      </div>

      <div className="flex justify-center gap-2">
        {transformations.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === activeIndex ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
