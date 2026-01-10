'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OutputVisualData {
  code: string;
  output: string;
  typing_effect?: boolean;
}

interface OutputVisualProps {
  data: OutputVisualData;
  isPlaying?: boolean;
}

export default function OutputVisual({ data, isPlaying = true }: OutputVisualProps) {
  const { code, output, typing_effect = true } = data;
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const showTimer = setTimeout(() => setShowOutput(true), 1000);

    if (typing_effect && showOutput) {
      let index = 0;
      const typeInterval = setInterval(() => {
        setDisplayedOutput(output.slice(0, index + 1));
        index++;
        if (index >= output.length) clearInterval(typeInterval);
      }, 50);

      return () => clearInterval(typeInterval);
    } else if (showOutput) {
      setDisplayedOutput(output);
    }

    return () => clearTimeout(showTimer);
  }, [isPlaying, showOutput, output, typing_effect]);

  return (
    <div className="output-visual py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-xl p-4 mb-4 max-w-md mx-auto"
      >
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="ml-2">code.py</span>
        </div>
        <pre className="text-green-400 font-mono text-lg">{code}</pre>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showOutput ? 1 : 0 }}
        className="text-4xl text-gray-400 my-4"
      >
        ↓
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showOutput ? 1 : 0, y: showOutput ? 0 : 20 }}
        className="bg-black rounded-xl p-4 max-w-md mx-auto"
      >
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
          <span>OUTPUT</span>
        </div>
        <div className="text-white font-mono text-xl">
          {displayedOutput}
          {typing_effect && displayedOutput.length < output.length && (
            <span className="animate-pulse">▋</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
