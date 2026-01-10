'use client';

import React, { useState, useEffect } from 'react';

interface PlaceValueVisualData {
  number: number;
}

interface PlaceValueVisualProps {
  data: PlaceValueVisualData;
  isPlaying?: boolean;
}

export default function PlaceValueVisual({ data, isPlaying = true }: PlaceValueVisualProps) {
  const [animatedBlocks, setAnimatedBlocks] = useState<{ type: 'hundred' | 'ten' | 'one'; index: number }[]>([]);

  const hundreds = Math.floor(data.number / 100);
  const tens = Math.floor((data.number % 100) / 10);
  const ones = data.number % 10;

  useEffect(() => {
    if (!isPlaying) return;

    const blocks: { type: 'hundred' | 'ten' | 'one'; index: number }[] = [];

    for (let i = 0; i < hundreds; i++) {
      blocks.push({ type: 'hundred', index: i });
    }
    for (let i = 0; i < tens; i++) {
      blocks.push({ type: 'ten', index: i });
    }
    for (let i = 0; i < ones; i++) {
      blocks.push({ type: 'one', index: i });
    }

    blocks.forEach((block, idx) => {
      setTimeout(() => {
        setAnimatedBlocks(prev => [...prev, block]);
      }, idx * 200);
    });

    return () => setAnimatedBlocks([]);
  }, [data.number, isPlaying, hundreds, tens, ones]);

  const renderBlock = (type: 'hundred' | 'ten' | 'one', index: number) => {
    const isVisible = animatedBlocks.some(b => b.type === type && b.index === index);

    if (type === 'hundred') {
      return (
        <div
          key={`${type}-${index}`}
          className={`transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        >
          <div className="grid grid-cols-10 gap-0.5 w-24 h-24 bg-blue-500 p-1 rounded shadow-lg">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="bg-blue-300 rounded-sm" />
            ))}
          </div>
        </div>
      );
    }

    if (type === 'ten') {
      return (
        <div
          key={`${type}-${index}`}
          className={`transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        >
          <div className="grid grid-cols-10 gap-0.5 w-24 h-6 bg-green-500 p-1 rounded shadow-lg">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-green-300 rounded-sm" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={`${type}-${index}`}
        className={`w-6 h-6 bg-yellow-500 rounded shadow-lg transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      />
    );
  };

  return (
    <div className="place-value-visual p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-purple-600 mb-2">{data.number}</div>
        <div className="text-sm text-gray-600">
          {hundreds > 0 && `${hundreds} hundred${hundreds > 1 ? 's' : ''} + `}
          {tens > 0 && `${tens} ten${tens > 1 ? 's' : ''} + `}
          {ones} one{ones !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {hundreds > 0 && (
          <div>
            <div className="text-sm font-semibold text-blue-600 mb-2">Hundreds</div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: hundreds }).map((_, i) => renderBlock('hundred', i))}
            </div>
          </div>
        )}

        {tens > 0 && (
          <div>
            <div className="text-sm font-semibold text-green-600 mb-2">Tens</div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: tens }).map((_, i) => renderBlock('ten', i))}
            </div>
          </div>
        )}

        {ones > 0 && (
          <div>
            <div className="text-sm font-semibold text-yellow-600 mb-2">Ones</div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: ones }).map((_, i) => renderBlock('one', i))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
