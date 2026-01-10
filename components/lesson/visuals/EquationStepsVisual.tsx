'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

interface EquationStepsVisualData {
  steps: string[];
}

interface EquationStepsVisualProps {
  data: EquationStepsVisualData;
  isPlaying?: boolean;
}

export default function EquationStepsVisual({ data, isPlaying = true }: EquationStepsVisualProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      setVisibleSteps(data.steps.map((_, i) => i));
      return;
    }

    setVisibleSteps([]);
    data.steps.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, index]);
      }, index * 800);
    });
  }, [data.steps, isPlaying]);

  return (
    <div className="equation-steps-visual p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-indigo-600 mb-2">Step-by-Step Solution</div>
        <div className="text-sm text-gray-600">Follow each step carefully</div>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {data.steps.map((step, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`bg-white p-6 rounded-lg shadow-lg border-l-4 transition-all duration-700 ${
                visibleSteps.includes(index)
                  ? 'opacity-100 translate-x-0 border-indigo-500'
                  : 'opacity-0 -translate-x-8 border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-mono text-gray-800">{step}</div>
                </div>
              </div>
            </div>

            {index < data.steps.length - 1 && (
              <div
                className={`flex justify-center transition-all duration-500 ${
                  visibleSteps.includes(index) ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ArrowDown className="text-indigo-400" size={24} />
              </div>
            )}
          </div>
        ))}
      </div>

      {visibleSteps.length === data.steps.length && (
        <div className="mt-8 text-center animate-bounce">
          <div className="inline-block bg-green-100 px-6 py-3 rounded-full">
            <div className="text-green-800 font-bold">Solution Complete!</div>
          </div>
        </div>
      )}
    </div>
  );
}
