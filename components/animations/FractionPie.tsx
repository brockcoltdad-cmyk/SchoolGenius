/**
 * =========================================
 * TO BE REPLACED WITH RIVE
 * =========================================
 * This is SVG + Framer Motion - NOT real Rive.
 * Replace with actual .riv file: /public/rive/fraction-pie.riv
 * See: library/RIVE-INSTRUCTIONS.md
 * =========================================
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface FractionPieProps {
  numerator: number
  denominator: number
  showLabels?: boolean
  animate?: boolean
  colorScheme?: 'warm' | 'cool' | 'rainbow'
  size?: number
  onSliceClick?: (sliceIndex: number) => void
}

// Color schemes
const colorSchemes = {
  warm: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8C42', '#FF6B9D'],
  cool: ['#4ECDC4', '#45B7D1', '#96CEB4', '#88D8B0', '#A8E6CF'],
  rainbow: ['#FF6B6B', '#FFA07A', '#FFD93D', '#96CEB4', '#45B7D1', '#DDA0DD', '#FF6B9D', '#98D8C8'],
}

export default function FractionPie({
  numerator,
  denominator,
  showLabels = true,
  animate = true,
  colorScheme = 'rainbow',
  size = 200,
  onSliceClick,
}: FractionPieProps) {
  const [activeSlice, setActiveSlice] = useState<number | null>(null)
  const [revealedSlices, setRevealedSlices] = useState<number[]>([])
  const colors = colorSchemes[colorScheme]

  // Calculate slice paths
  const createSlicePath = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total
    const startAngle = index * angle - Math.PI / 2
    const endAngle = startAngle + angle

    const radius = size / 2 - 10
    const centerX = size / 2
    const centerY = size / 2

    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)

    const largeArcFlag = angle > Math.PI ? 1 : 0

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  // Animate slices revealing one by one
  useEffect(() => {
    if (animate) {
      setRevealedSlices([])
      const timeouts: NodeJS.Timeout[] = []

      for (let i = 0; i < numerator; i++) {
        const timeout = setTimeout(() => {
          setRevealedSlices(prev => [...prev, i])
        }, i * 300 + 500)
        timeouts.push(timeout)
      }

      return () => timeouts.forEach(clearTimeout)
    } else {
      setRevealedSlices(Array.from({ length: numerator }, (_, i) => i))
    }
  }, [numerator, animate])

  // Get label position for a slice
  const getLabelPosition = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total
    const midAngle = index * angle + angle / 2 - Math.PI / 2
    const labelRadius = (size / 2 - 10) * 0.65

    return {
      x: size / 2 + labelRadius * Math.cos(midAngle),
      y: size / 2 + labelRadius * Math.sin(midAngle),
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Main pie */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-0">
          {/* Shadow */}
          <ellipse
            cx={size / 2}
            cy={size / 2 + 8}
            rx={size / 2 - 15}
            ry={20}
            fill="rgba(0,0,0,0.1)"
          />

          {/* Pie crust (border) */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="#DEB887"
            stroke="#A0522D"
            strokeWidth={3}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          />

          {/* All slices (background - unfilled) */}
          {Array.from({ length: denominator }).map((_, i) => (
            <motion.path
              key={`bg-${i}`}
              d={createSlicePath(i, denominator)}
              fill="#FFF8DC"
              stroke="#DEB887"
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
              }}
            />
          ))}

          {/* Filled slices (numerator) */}
          <AnimatePresence>
            {Array.from({ length: denominator }).map((_, i) => {
              const isFilled = revealedSlices.includes(i)
              const isActive = activeSlice === i

              return (
                <motion.path
                  key={`slice-${i}`}
                  d={createSlicePath(i, denominator)}
                  fill={isFilled ? colors[i % colors.length] : 'transparent'}
                  stroke={isFilled ? '#fff' : 'transparent'}
                  strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    opacity: isFilled ? 1 : 0,
                    // SQUASH & STRETCH on reveal
                    scaleX: isFilled ? [0.8, 1.1, 1] : 1,
                    scaleY: isFilled ? [1.2, 0.9, 1] : 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  onMouseEnter={() => setActiveSlice(i)}
                  onMouseLeave={() => setActiveSlice(null)}
                  onClick={() => onSliceClick?.(i)}
                  // ANTICIPATION - slight pull back before pop
                  whileHover={{
                    scale: 1.08,
                    filter: 'brightness(1.1)',
                  }}
                  whileTap={{ scale: 0.95 }}
                />
              )
            })}
          </AnimatePresence>

          {/* Slice labels */}
          {showLabels && denominator <= 12 && Array.from({ length: denominator }).map((_, i) => {
            const pos = getLabelPosition(i, denominator)
            const isFilled = revealedSlices.includes(i)

            return (
              <motion.text
                key={`label-${i}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size / 12}
                fontWeight="bold"
                fill={isFilled ? '#fff' : '#A0522D'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {i + 1}
              </motion.text>
            )
          })}

          {/* Center decoration */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 10}
            fill="#FFD93D"
            stroke="#FFA500"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
            }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 300,
            }}
          />
        </svg>

        {/* Sparkles on completion */}
        <AnimatePresence>
          {revealedSlices.length === numerator && numerator > 0 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: size / 2,
                    top: size / 2,
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 6) * 80,
                    y: Math.sin((i * Math.PI * 2) / 6) * 80,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 * i,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Fraction display */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex flex-col items-center bg-white rounded-2xl px-8 py-4 shadow-lg">
          <motion.span
            className="text-4xl font-bold text-blue-600"
            animate={{
              scale: revealedSlices.length === numerator ? [1, 1.2, 1] : 1,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {revealedSlices.length}
          </motion.span>
          <div className="w-16 h-1 bg-gray-800 my-1 rounded-full" />
          <span className="text-4xl font-bold text-gray-700">{denominator}</span>
        </div>

        {showLabels && (
          <motion.p
            className="mt-3 text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {revealedSlices.length} out of {denominator} slices
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

export { colorSchemes }
