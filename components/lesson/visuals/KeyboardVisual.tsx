'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface KeyboardVisualData {
  highlight_keys: string[];
  finger_labels?: boolean;
  show_home_row?: boolean;
  pressed_key?: string;
}

interface KeyboardVisualProps {
  data: KeyboardVisualData;
  isPlaying?: boolean;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

const HOME_ROW = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

const FINGER_COLORS: Record<string, string> = {
  a: 'bg-pink-300', q: 'bg-pink-300', z: 'bg-pink-300',
  s: 'bg-orange-300', w: 'bg-orange-300', x: 'bg-orange-300',
  d: 'bg-yellow-300', e: 'bg-yellow-300', c: 'bg-yellow-300',
  f: 'bg-green-300', r: 'bg-green-300', v: 'bg-green-300', t: 'bg-green-300', g: 'bg-green-300', b: 'bg-green-300',
  j: 'bg-green-300', u: 'bg-green-300', m: 'bg-green-300', y: 'bg-green-300', h: 'bg-green-300', n: 'bg-green-300',
  k: 'bg-yellow-300', i: 'bg-yellow-300', ',': 'bg-yellow-300',
  l: 'bg-orange-300', o: 'bg-orange-300', '.': 'bg-orange-300',
  ';': 'bg-pink-300', p: 'bg-pink-300', '/': 'bg-pink-300',
};

export default function KeyboardVisual({ data, isPlaying = true }: KeyboardVisualProps) {
  const { highlight_keys, finger_labels = true, show_home_row = true, pressed_key } = data;

  return (
    <div className="keyboard-visual py-6">
      <div className="inline-block bg-gray-800 p-4 rounded-xl">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-1 mb-1"
            style={{ marginLeft: rowIndex * 20 }}
          >
            {row.map(key => {
              const isHighlighted = highlight_keys.includes(key);
              const isHomeRow = HOME_ROW.includes(key);
              const isPressed = pressed_key === key;
              const fingerColor = finger_labels ? FINGER_COLORS[key] : 'bg-gray-200';

              return (
                <motion.div
                  key={key}
                  animate={{
                    scale: isPressed ? 0.9 : 1,
                    backgroundColor: isHighlighted ? '#3b82f6' : undefined,
                  }}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold uppercase
                    ${isHighlighted ? 'bg-blue-500 text-white ring-4 ring-blue-300' : fingerColor}
                    ${isHomeRow && show_home_row ? 'border-b-4 border-gray-500' : ''}
                  `}
                >
                  {key}
                </motion.div>
              );
            })}
          </div>
        ))}

        <div className="flex justify-center mt-1">
          <motion.div
            animate={{ scale: pressed_key === ' ' ? 0.95 : 1 }}
            className="w-64 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
          >
            SPACE
          </motion.div>
        </div>
      </div>

      {finger_labels && (
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-pink-300 rounded" />
            <span>Pinky</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-300 rounded" />
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-300 rounded" />
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-300 rounded" />
            <span>Index</span>
          </div>
        </div>
      )}
    </div>
  );
}
