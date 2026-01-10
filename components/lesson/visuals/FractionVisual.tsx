'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FractionVisualData {
  type: 'pie' | 'bar';
  numerator: number;
  denominator: number;
  label?: string;
  color?: string;
}

interface FractionVisualProps {
  data: FractionVisualData;
  isPlaying?: boolean;
}

export default function FractionVisual({ data, isPlaying = true }: FractionVisualProps) {
  const { type, numerator, denominator, label, color = 'blue' } = data;

  if (type === 'pie') {
    const sliceAngle = 360 / denominator;

    return (
      <div className="fraction-visual text-center py-6">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />

            {Array.from({ length: denominator }, (_, i) => {
              const isFilled = i < numerator;
              const startAngle = i * sliceAngle - 90;
              const endAngle = startAngle + sliceAngle;

              const start = {
                x: 50 + 45 * Math.cos((startAngle * Math.PI) / 180),
                y: 50 + 45 * Math.sin((startAngle * Math.PI) / 180),
              };
              const end = {
                x: 50 + 45 * Math.cos((endAngle * Math.PI) / 180),
                y: 50 + 45 * Math.sin((endAngle * Math.PI) / 180),
              };

              return (
                <motion.path
                  key={i}
                  d={`M 50 50 L ${start.x} ${start.y} A 45 45 0 0 1 ${end.x} ${end.y} Z`}
                  fill={isFilled ? '#3b82f6' : 'transparent'}
                  stroke="#6b7280"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                />
              );
            })}
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-block"
        >
          <div className="text-5xl font-bold text-blue-600">{numerator}</div>
          <div className="border-t-4 border-gray-800 my-1" />
          <div className="text-5xl font-bold text-gray-700">{denominator}</div>
        </motion.div>

        {label && (
          <p className="mt-4 text-xl text-gray-600">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="fraction-visual text-center py-6">
      <div className="flex justify-center gap-1 mb-6">
        {Array.from({ length: denominator }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-16 h-20 rounded-lg border-2 border-gray-300 ${
              i < numerator ? 'bg-blue-400' : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-4xl font-bold"
      >
        <span className="text-blue-600">{numerator}</span>
        <span className="text-gray-400"> / </span>
        <span className="text-gray-700">{denominator}</span>
      </motion.div>
    </div>
  );
}
