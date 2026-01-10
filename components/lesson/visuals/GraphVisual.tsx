'use client';

import React, { useState, useEffect } from 'react';

interface GraphVisualData {
  points: { x: number; y: number }[];
}

interface GraphVisualProps {
  data: GraphVisualData;
  isPlaying?: boolean;
}

export default function GraphVisual({ data, isPlaying = true }: GraphVisualProps) {
  const [visiblePoints, setVisiblePoints] = useState<number[]>([]);

  const maxX = Math.max(...data.points.map(p => Math.abs(p.x)), 5);
  const maxY = Math.max(...data.points.map(p => Math.abs(p.y)), 5);
  const gridRange = Math.max(maxX, maxY) + 1;

  useEffect(() => {
    if (!isPlaying) {
      setVisiblePoints(data.points.map((_, i) => i));
      return;
    }

    setVisiblePoints([]);
    data.points.forEach((_, index) => {
      setTimeout(() => {
        setVisiblePoints(prev => [...prev, index]);
      }, index * 500);
    });
  }, [data.points, isPlaying]);

  const toSVGCoords = (x: number, y: number) => {
    const centerX = 200;
    const centerY = 200;
    const scale = 160 / gridRange;
    return {
      x: centerX + x * scale,
      y: centerY - y * scale
    };
  };

  return (
    <div className="graph-visual p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-teal-600 mb-2">Coordinate Plane</div>
        <div className="text-sm text-gray-600">Plotting points on a graph</div>
      </div>

      <div className="flex justify-center">
        <svg width="400" height="400" className="bg-white rounded-lg shadow-lg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width="400" height="400" fill="url(#grid)" />

          <line x1="200" y1="0" x2="200" y2="400" stroke="#6b7280" strokeWidth="2" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#6b7280" strokeWidth="2" />

          {[-gridRange, -Math.floor(gridRange/2), Math.floor(gridRange/2), gridRange].map(tick => {
            if (tick === 0) return null;
            const pos = toSVGCoords(tick, 0);
            return (
              <g key={`x-${tick}`}>
                <line x1={pos.x} y1="195" x2={pos.x} y2="205" stroke="#6b7280" strokeWidth="2" />
                <text x={pos.x} y="220" textAnchor="middle" className="text-xs fill-gray-600">{tick}</text>
              </g>
            );
          })}

          {[-gridRange, -Math.floor(gridRange/2), Math.floor(gridRange/2), gridRange].map(tick => {
            if (tick === 0) return null;
            const pos = toSVGCoords(0, tick);
            return (
              <g key={`y-${tick}`}>
                <line x1="195" y1={pos.y} x2="205" y2={pos.y} stroke="#6b7280" strokeWidth="2" />
                <text x="185" y={pos.y + 5} textAnchor="end" className="text-xs fill-gray-600">{tick}</text>
              </g>
            );
          })}

          {visiblePoints.length > 1 && (
            <polyline
              points={visiblePoints.map(i => {
                const point = data.points[i];
                const coords = toSVGCoords(point.x, point.y);
                return `${coords.x},${coords.y}`;
              }).join(' ')}
              fill="none"
              stroke="#0891b2"
              strokeWidth="3"
              className="transition-all duration-500"
            />
          )}

          {data.points.map((point, index) => {
            const coords = toSVGCoords(point.x, point.y);
            const isVisible = visiblePoints.includes(index);

            return (
              <g key={index}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="8"
                  className={`transition-all duration-500 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  fill="#0891b2"
                  stroke="white"
                  strokeWidth="3"
                />
                <text
                  x={coords.x}
                  y={coords.y - 15}
                  textAnchor="middle"
                  className={`text-xs font-bold fill-teal-600 transition-all duration-500 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  ({point.x}, {point.y})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-block bg-teal-100 px-6 py-3 rounded-lg">
          <div className="text-teal-800 font-semibold">
            {data.points.length} point{data.points.length !== 1 ? 's' : ''} plotted
          </div>
        </div>
      </div>
    </div>
  );
}
