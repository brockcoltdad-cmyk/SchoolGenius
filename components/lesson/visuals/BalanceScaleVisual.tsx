'use client';

import React, { useState, useEffect } from 'react';

interface BalanceScaleVisualData {
  left_side: string;
  right_side: string;
}

interface BalanceScaleVisualProps {
  data: BalanceScaleVisualData;
  isPlaying?: boolean;
}

export default function BalanceScaleVisual({ data, isPlaying = true }: BalanceScaleVisualProps) {
  const [tilt, setTilt] = useState(0);
  const [showEquation, setShowEquation] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setTilt(0);
      setShowEquation(true);
      return;
    }

    setShowEquation(false);
    setTimeout(() => setTilt(0), 500);
    setTimeout(() => setShowEquation(true), 1000);
  }, [data, isPlaying]);

  return (
    <div className="balance-scale-visual p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-cyan-600 mb-2">Balance Scale</div>
        <div className={`text-lg text-gray-600 transition-all duration-500 ${showEquation ? 'opacity-100' : 'opacity-0'}`}>
          {data.left_side} = {data.right_side}
        </div>
      </div>

      <div className="relative h-64 flex items-center justify-center">
        <div className="absolute top-0 w-2 h-32 bg-gray-700 rounded" style={{ left: '50%', transform: 'translateX(-50%)' }} />

        <div
          className="relative w-full transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          <div className="absolute left-1/2 top-1/2 w-96 h-2 bg-gray-800 rounded" style={{ transform: 'translate(-50%, -50%)' }} />

          <div className="absolute left-0 top-1/2" style={{ transform: 'translate(0, -50%)' }}>
            <div className="w-2 h-16 bg-gray-700 mx-auto" />
            <div
              className={`bg-gradient-to-br from-blue-400 to-blue-600 w-32 h-24 rounded-lg shadow-2xl flex items-center justify-center text-white font-bold text-xl transition-all duration-1000 ${
                showEquation ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
            >
              {data.left_side}
            </div>
          </div>

          <div className="absolute right-0 top-1/2" style={{ transform: 'translate(0, -50%)' }}>
            <div className="w-2 h-16 bg-gray-700 mx-auto" />
            <div
              className={`bg-gradient-to-br from-green-400 to-green-600 w-32 h-24 rounded-lg shadow-2xl flex items-center justify-center text-white font-bold text-xl transition-all duration-1000 ${
                showEquation ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
            >
              {data.right_side}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-48 h-4 bg-gray-800 rounded-full" />
      </div>

      <div className={`mt-8 text-center transition-all duration-1000 ${showEquation ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-cyan-100 p-4 rounded-lg inline-block">
          <div className="text-cyan-800 font-semibold">
            Both sides are balanced!
          </div>
        </div>
      </div>
    </div>
  );
}
