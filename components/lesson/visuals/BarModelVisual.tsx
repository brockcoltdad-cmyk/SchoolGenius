'use client';

import React, { useState, useEffect } from 'react';

interface BarModelVisualData {
  parts: number[];
  total?: number;
}

interface BarModelVisualProps {
  data: BarModelVisualData;
  isPlaying?: boolean;
}

export default function BarModelVisual({ data, isPlaying = true }: BarModelVisualProps) {
  const [visibleParts, setVisibleParts] = useState<number[]>([]);

  const total = data.total || data.parts.reduce((sum, part) => sum + part, 0);
  const maxValue = Math.max(total, ...data.parts);

  useEffect(() => {
    if (!isPlaying) {
      setVisibleParts(data.parts.map((_, i) => i));
      return;
    }

    setVisibleParts([]);
    data.parts.forEach((_, index) => {
      setTimeout(() => {
        setVisibleParts(prev => [...prev, index]);
      }, index * 400);
    });
  }, [data.parts, isPlaying]);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500'
  ];

  return (
    <div className="bar-model-visual p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-orange-600 mb-2">Singapore Bar Model</div>
        <div className="text-lg text-gray-600">
          Total: <span className="font-bold text-purple-600">{total}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-1 h-20 items-end">
          {data.parts.map((part, index) => {
            const widthPercent = (part / maxValue) * 100;
            const isVisible = visibleParts.includes(index);

            return (
              <div
                key={index}
                className={`${colors[index % colors.length]} rounded-t transition-all duration-700 flex items-center justify-center text-white font-bold text-lg relative ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  width: `${widthPercent}%`,
                  height: '100%',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'bottom'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {part}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t-4 border-gray-800 pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Parts:</div>
            <div className="flex gap-2">
              {data.parts.map((part, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded ${colors[index % colors.length]} text-white font-semibold transition-all duration-500 ${
                    visibleParts.includes(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}
                >
                  {part}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="text-center text-purple-800 font-semibold">
            {data.parts.join(' + ')} = {total}
          </div>
        </div>
      </div>
    </div>
  );
}
