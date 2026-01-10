'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VariableBoxVisualData {
  variable_name: string;
  value: string | number;
  value_type?: 'string' | 'number' | 'boolean';
  show_code?: boolean;
  animate_assignment?: boolean;
}

interface VariableBoxVisualProps {
  data: VariableBoxVisualData;
  isPlaying?: boolean;
}

export default function VariableBoxVisual({ data, isPlaying = true }: VariableBoxVisualProps) {
  const { variable_name, value, value_type = 'string', show_code = true, animate_assignment = true } = data;
  const [phase, setPhase] = useState<'box' | 'label' | 'value' | 'complete'>('box');

  useEffect(() => {
    if (!isPlaying || !animate_assignment) {
      setPhase('complete');
      return;
    }

    const timers = [
      setTimeout(() => setPhase('label'), 800),
      setTimeout(() => setPhase('value'), 1600),
      setTimeout(() => setPhase('complete'), 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isPlaying, animate_assignment]);

  const displayValue = value_type === 'string' ? `"${value}"` : String(value);
  const valueColor = value_type === 'string' ? 'text-green-600' : value_type === 'number' ? 'text-blue-600' : 'text-purple-600';

  return (
    <div className="variable-box-visual text-center py-8">
      <div className="flex items-center justify-center gap-4 mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase !== 'box' ? 1 : 0,
              y: phase !== 'box' ? 0 : 10
            }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-lg font-mono font-bold"
          >
            {variable_name}
          </motion.div>

          <div className="w-40 h-24 border-4 border-dashed border-gray-400 rounded-xl bg-white flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase === 'value' || phase === 'complete' ? 1 : 0,
                scale: phase === 'value' || phase === 'complete' ? 1 : 0,
              }}
              className={`text-3xl font-bold font-mono ${valueColor}`}
            >
              {displayValue}
            </motion.span>
          </div>
        </motion.div>
      </div>

      {show_code && phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-mono text-xl"
        >
          <span className="text-purple-400">{variable_name}</span>
          <span className="text-white"> = </span>
          <span className={value_type === 'string' ? 'text-green-400' : 'text-blue-400'}>
            {displayValue}
          </span>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'complete' ? 1 : 0 }}
        className="mt-6 text-lg text-gray-600"
      >
        The variable <strong>{variable_name}</strong> now holds the value <strong>{displayValue}</strong>
      </motion.p>
    </div>
  );
}
