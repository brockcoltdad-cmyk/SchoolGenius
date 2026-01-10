'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Hop {
  direction: 'right' | 'left';
  amount: number;
}

interface NumberLineVisualData {
  min: number;
  max: number;
  start: number;
  hops: Hop[];
  character?: string;
  show_result?: boolean;
}

interface NumberLineVisualProps {
  data: NumberLineVisualData;
  isPlaying?: boolean;
}

export default function NumberLineVisual({ data, isPlaying = true }: NumberLineVisualProps) {
  const { min, max, start, hops, character = '🐸', show_result = true } = data;
  const [currentHop, setCurrentHop] = useState(-1);
  const [position, setPosition] = useState(start);

  const range = max - min;
  const getX = (value: number) => ((value - min) / range) * 100;

  const positions = [start];
  let pos = start;
  hops.forEach(hop => {
    pos += hop.direction === 'right' ? hop.amount : -hop.amount;
    positions.push(pos);
  });

  useEffect(() => {
    if (!isPlaying) return;

    let hopIndex = -1;
    const interval = setInterval(() => {
      hopIndex++;
      if (hopIndex < hops.length) {
        setCurrentHop(hopIndex);
        setPosition(positions[hopIndex + 1]);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, hops.length]);

  return (
    <div className="number-line-visual py-8 px-4">
      <div className="relative h-20 mb-4">
        <motion.div
          animate={{ left: `${getX(position)}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="absolute -translate-x-1/2 text-6xl"
          style={{ bottom: 0 }}
        >
          <motion.span
            animate={currentHop >= 0 ? { y: [0, -30, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {character}
          </motion.span>
        </motion.div>
      </div>

      <div className="relative h-16">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 rounded" />

        {Array.from({ length: range + 1 }, (_, i) => {
          const value = min + i;
          const isEndpoint = positions.includes(value);

          return (
            <div
              key={value}
              className="absolute top-1/2 -translate-x-1/2"
              style={{ left: `${getX(value)}%` }}
            >
              <div className={`w-0.5 ${isEndpoint ? 'h-6 bg-blue-500' : 'h-4 bg-gray-400'} -mt-3`} />
              <div className={`text-center mt-2 ${isEndpoint ? 'font-bold text-blue-600 text-lg' : 'text-gray-600'}`}>
                {value}
              </div>
            </div>
          );
        })}

        {hops.map((hop, index) => {
          if (index > currentHop) return null;

          const fromX = getX(positions[index]);
          const toX = getX(positions[index + 1]);
          const width = Math.abs(toX - fromX);
          const left = Math.min(fromX, toX);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute"
              style={{ left: `${left}%`, width: `${width}%`, top: '-40px' }}
            >
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 40">
                <motion.path
                  d={hop.direction === 'right'
                    ? "M 0 40 Q 50 0 100 40"
                    : "M 100 40 Q 50 0 0 40"}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </svg>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">
                {hop.direction === 'right' ? '+' : '−'}{hop.amount}
              </div>
            </motion.div>
          );
        })}
      </div>

      {show_result && currentHop === hops.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <span className="bg-green-500 text-white text-2xl font-bold px-6 py-3 rounded-xl">
            Answer: {positions[positions.length - 1]}
          </span>
        </motion.div>
      )}
    </div>
  );
}
