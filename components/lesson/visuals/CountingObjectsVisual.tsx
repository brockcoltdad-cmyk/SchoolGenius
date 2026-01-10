'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountingObjectsVisualData {
  emoji: string;
  groups: number[];
  operation: 'add' | 'subtract' | 'count';
  show_equation?: boolean;
  crossed_out?: number;
}

interface CountingObjectsVisualProps {
  data: CountingObjectsVisualData;
  isPlaying?: boolean;
}

export default function CountingObjectsVisual({ data, isPlaying = true }: CountingObjectsVisualProps) {
  const { emoji, groups, operation, show_equation = true, crossed_out = 0 } = data;
  const [visibleCount, setVisibleCount] = useState(0);

  const total = groups.reduce((a, b) => a + b, 0);
  const result = operation === 'subtract' ? total - crossed_out : total;

  useEffect(() => {
    if (!isPlaying) return;

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= total) clearInterval(interval);
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, total]);

  return (
    <div className="counting-objects-visual text-center py-6">
      <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
        {groups.map((count, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <div className="flex flex-wrap justify-center gap-3 p-4 bg-blue-50 rounded-2xl max-w-xs">
              {Array.from({ length: count }, (_, i) => {
                const globalIndex = groups.slice(0, groupIndex).reduce((a, b) => a + b, 0) + i;
                const isCrossed = operation === 'subtract' && globalIndex < crossed_out;
                const isVisible = globalIndex < visibleCount;

                return (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: isVisible ? 1 : 0,
                      rotate: isVisible ? 0 : -180,
                      opacity: isCrossed ? 0.3 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`text-5xl ${isCrossed ? 'line-through' : ''}`}
                  >
                    {emoji}
                  </motion.span>
                );
              })}
            </div>

            {groupIndex < groups.length - 1 && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-bold text-blue-500"
              >
                {operation === 'add' ? '+' : '−'}
              </motion.span>
            )}
          </React.Fragment>
        ))}

        {visibleCount >= total && (
          <>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl font-bold text-gray-400"
            >
              =
            </motion.span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center"
            >
              <span className="text-4xl font-bold text-white">{result}</span>
            </motion.div>
          </>
        )}
      </div>

      {show_equation && visibleCount >= total && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-700"
        >
          {groups.join(operation === 'add' ? ' + ' : ' − ')} = {result}
        </motion.p>
      )}
    </div>
  );
}
