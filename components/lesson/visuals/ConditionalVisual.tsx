'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface ConditionalVisualData {
  condition: string;
  if_true: string;
  if_false: string;
}

interface ConditionalVisualProps {
  data: ConditionalVisualData;
  isPlaying?: boolean;
}

export default function ConditionalVisual({ data, isPlaying = true }: ConditionalVisualProps) {
  const [showCondition, setShowCondition] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [highlightPath, setHighlightPath] = useState<'true' | 'false' | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setShowCondition(true);
      setShowPaths(true);
      setHighlightPath(null);
      return;
    }

    setShowCondition(false);
    setShowPaths(false);
    setHighlightPath(null);

    setTimeout(() => setShowCondition(true), 300);
    setTimeout(() => setShowPaths(true), 800);
    setTimeout(() => setHighlightPath('true'), 1500);
    setTimeout(() => setHighlightPath('false'), 2200);
    setTimeout(() => setHighlightPath(null), 2900);
  }, [data, isPlaying]);

  return (
    <div className="conditional-visual p-8 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-violet-600 mb-2">If/Else Branching</div>
        <div className="text-sm text-gray-600">Making decisions in code</div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-8">
          <div
            className={`bg-yellow-400 border-4 border-yellow-500 rounded-xl p-6 shadow-2xl transition-all duration-700 ${
              showCondition ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-900 mb-2">IF</div>
              <div className="text-xl font-mono text-yellow-900">{data.condition}</div>
            </div>
          </div>

          <div className="flex items-start gap-8 w-full">
            <div className="flex-1 flex flex-col items-center gap-4">
              <div
                className={`transition-all duration-700 ${
                  showPaths ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-green-600 font-bold">TRUE</div>
                  <ArrowRight className="text-green-600" />
                </div>
              </div>

              <div
                className={`bg-green-400 border-4 rounded-xl p-6 shadow-lg w-full transition-all duration-700 ${
                  showPaths ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                } ${
                  highlightPath === 'true' ? 'border-green-600 ring-4 ring-green-300 scale-105' : 'border-green-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-green-900 mb-2">THEN</div>
                  <div className="text-lg font-mono text-green-900">{data.if_true}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-4">
              <div
                className={`transition-all duration-700 ${
                  showPaths ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-red-600 font-bold">FALSE</div>
                  <ArrowRight className="text-red-600" />
                </div>
              </div>

              <div
                className={`bg-red-400 border-4 rounded-xl p-6 shadow-lg w-full transition-all duration-700 ${
                  showPaths ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                } ${
                  highlightPath === 'false' ? 'border-red-600 ring-4 ring-red-300 scale-105' : 'border-red-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-red-900 mb-2">ELSE</div>
                  <div className="text-lg font-mono text-red-900">{data.if_false}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-8 text-center transition-all duration-700 ${showPaths ? 'opacity-100' : 'opacity-0'}`}>
        <div className="inline-block bg-violet-100 px-6 py-3 rounded-lg">
          <div className="text-violet-800 font-semibold">
            The code takes different paths based on the condition!
          </div>
        </div>
      </div>
    </div>
  );
}
