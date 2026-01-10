'use client';

import React, { useState, useEffect } from 'react';

interface CodeBlockVisualData {
  blocks: { type: string; text: string; color: string }[];
}

interface CodeBlockVisualProps {
  data: CodeBlockVisualData;
  isPlaying?: boolean;
}

export default function CodeBlockVisual({ data, isPlaying = true }: CodeBlockVisualProps) {
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      setVisibleBlocks(data.blocks.map((_, i) => i));
      return;
    }

    setVisibleBlocks([]);
    data.blocks.forEach((_, index) => {
      setTimeout(() => {
        setVisibleBlocks(prev => [...prev, index]);
      }, index * 400);
    });
  }, [data.blocks, isPlaying]);

  const getBlockStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 border-blue-600',
      green: 'bg-green-500 border-green-600',
      yellow: 'bg-yellow-500 border-yellow-600',
      purple: 'bg-purple-500 border-purple-600',
      orange: 'bg-orange-500 border-orange-600',
      red: 'bg-red-500 border-red-600',
      pink: 'bg-pink-500 border-pink-600'
    };
    return colorMap[color] || 'bg-gray-500 border-gray-600';
  };

  return (
    <div className="code-block-visual p-8 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-slate-700 mb-2">Code Blocks</div>
        <div className="text-sm text-gray-600">Drag and drop programming</div>
      </div>

      <div className="max-w-lg mx-auto space-y-3">
        {data.blocks.map((block, index) => {
          const isVisible = visibleBlocks.includes(index);

          return (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div
                className={`${getBlockStyle(block.color)} rounded-lg shadow-lg border-4 p-4 text-white font-bold relative`}
                style={{
                  marginLeft: block.type === 'nested' ? '2rem' : '0'
                }}
              >
                <div className="flex items-center gap-3">
                  {block.type === 'event' && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full" />
                    </div>
                  )}

                  {block.type === 'action' && (
                    <div className="w-8 h-8 bg-white bg-opacity-30 rounded flex items-center justify-center">
                      ▶
                    </div>
                  )}

                  {block.type === 'loop' && (
                    <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                      🔁
                    </div>
                  )}

                  {block.type === 'condition' && (
                    <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                      ?
                    </div>
                  )}

                  <div className="flex-1 text-lg">{block.text}</div>
                </div>

                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
              </div>
            </div>
          );
        })}
      </div>

      {visibleBlocks.length === data.blocks.length && (
        <div className="mt-8 text-center">
          <div className="inline-block bg-green-100 px-6 py-3 rounded-full animate-bounce">
            <div className="text-green-800 font-bold">Program Ready!</div>
          </div>
        </div>
      )}
    </div>
  );
}
