'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ArrayVisualData {
  rows: number;
  columns: number;
  emoji?: string;
  show_equation?: boolean;
}

interface ArrayVisualProps {
  data: ArrayVisualData;
  isPlaying?: boolean;
}

export default function ArrayVisual({ data, isPlaying = true }: ArrayVisualProps) {
  const { rows, columns, emoji = '⚫', show_equation = true } = data;
  const [visibleRows, setVisibleRows] = useState(0);
  const total = rows * columns;

  useEffect(() => {
    if (!isPlaying) return;

    let row = 0;
    const interval = setInterval(() => {
      row++;
      setVisibleRows(row);
      if (row >= rows) clearInterval(interval);
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying, rows]);

  return (
    <div className="array-visual text-center py-6">
      <div className="inline-block bg-blue-50 p-6 rounded-2xl mb-6">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-3 justify-center">
            {Array.from({ length: columns }, (_, colIndex) => (
              <motion.span
                key={colIndex}
                initial={{ scale: 0 }}
                animate={{ scale: rowIndex < visibleRows ? 1 : 0 }}
                transition={{ delay: colIndex * 0.1, type: 'spring' }}
                className="text-3xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold">
          {rows} rows
        </span>
        <span className="text-2xl text-gray-400">×</span>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold">
          {columns} columns
        </span>
      </div>

      {show_equation && visibleRows >= rows && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl font-bold"
        >
          <span className="text-blue-600">{rows}</span>
          <span className="text-gray-600"> × </span>
          <span className="text-purple-600">{columns}</span>
          <span className="text-gray-600"> = </span>
          <span className="text-green-600">{total}</span>
        </motion.p>
      )}
    </div>
  );
}
