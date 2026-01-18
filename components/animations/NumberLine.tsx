/**
 * =========================================
 * TO BE REPLACED WITH RIVE
 * =========================================
 * This is SVG + Framer Motion - NOT real Rive.
 * Replace with actual .riv file: /public/rive/number-line.riv
 * See: library/RIVE-INSTRUCTIONS.md
 * =========================================
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'

interface NumberLineProps {
  min?: number
  max?: number
  start?: number
  end?: number
  hops?: number[]
  showFrog?: boolean
  animate?: boolean
  onHopComplete?: (position: number) => void
  width?: number
  highlightRange?: [number, number]
}

// Frog character component with Disney-quality animation
const Frog = ({
  x,
  isJumping,
  direction,
}: {
  x: number
  isJumping: boolean
  direction: 'left' | 'right'
}) => {
  return (
    <motion.g
      animate={{
        x,
        scaleX: direction === 'left' ? -1 : 1,
      }}
      transition={{
        x: {
          type: 'spring',
          stiffness: 100,
          damping: 15,
        },
        scaleX: { duration: 0.2 },
      }}
    >
      {/* Shadow */}
      <motion.ellipse
        cx={0}
        cy={45}
        rx={15}
        ry={5}
        fill="rgba(0,0,0,0.2)"
        animate={{
          ry: isJumping ? 3 : 5,
          opacity: isJumping ? 0.1 : 0.2,
        }}
      />

      {/* Body */}
      <motion.ellipse
        cx={0}
        cy={isJumping ? 10 : 30}
        rx={20}
        ry={isJumping ? 12 : 15}
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth={2}
        animate={{
          cy: isJumping ? 0 : 30,
          ry: isJumping ? 18 : 15, // STRETCH when jumping
          rx: isJumping ? 15 : 20, // SQUASH width
          scaleY: isJumping ? 1.3 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 15,
        }}
      />

      {/* Belly */}
      <motion.ellipse
        cx={0}
        cy={isJumping ? 5 : 35}
        rx={12}
        ry={8}
        fill="#A5D6A7"
        animate={{
          cy: isJumping ? 5 : 35,
        }}
      />

      {/* Left eye */}
      <motion.g animate={{ y: isJumping ? -25 : 0 }}>
        <circle cx={-8} cy={15} r={8} fill="white" stroke="#2E7D32" strokeWidth={1} />
        <motion.circle
          cx={-8}
          cy={15}
          r={4}
          fill="#1a1a1a"
          animate={{
            cy: isJumping ? 13 : 15,
          }}
        />
        <circle cx={-6} cy={13} r={1.5} fill="white" />
      </motion.g>

      {/* Right eye */}
      <motion.g animate={{ y: isJumping ? -25 : 0 }}>
        <circle cx={8} cy={15} r={8} fill="white" stroke="#2E7D32" strokeWidth={1} />
        <motion.circle
          cx={8}
          cy={15}
          r={4}
          fill="#1a1a1a"
          animate={{
            cy: isJumping ? 13 : 15,
          }}
        />
        <circle cx={10} cy={13} r={1.5} fill="white" />
      </motion.g>

      {/* Smile */}
      <motion.path
        d="M -6 28 Q 0 34 6 28"
        fill="none"
        stroke="#2E7D32"
        strokeWidth={2}
        strokeLinecap="round"
        animate={{
          d: isJumping ? 'M -8 18 Q 0 26 8 18' : 'M -6 28 Q 0 34 6 28',
        }}
      />

      {/* Left leg */}
      <motion.ellipse
        cx={-15}
        cy={40}
        rx={8}
        ry={5}
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth={1}
        animate={{
          cy: isJumping ? 25 : 40,
          rx: isJumping ? 6 : 8,
          ry: isJumping ? 8 : 5,
          rotate: isJumping ? -30 : 0,
        }}
        style={{ transformOrigin: '-15px 40px' }}
      />

      {/* Right leg */}
      <motion.ellipse
        cx={15}
        cy={40}
        rx={8}
        ry={5}
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth={1}
        animate={{
          cy: isJumping ? 25 : 40,
          rx: isJumping ? 6 : 8,
          ry: isJumping ? 8 : 5,
          rotate: isJumping ? 30 : 0,
        }}
        style={{ transformOrigin: '15px 40px' }}
      />
    </motion.g>
  )
}

export default function NumberLine({
  min = 0,
  max = 10,
  start = 0,
  end,
  hops = [],
  showFrog = true,
  animate = true,
  onHopComplete,
  width = 600,
  highlightRange,
}: NumberLineProps) {
  const [currentPosition, setCurrentPosition] = useState(start)
  const [isJumping, setIsJumping] = useState(false)
  const [hopIndex, setHopIndex] = useState(0)
  const [showArc, setShowArc] = useState<number | null>(null)
  const [completedHops, setCompletedHops] = useState<number[]>([])

  const range = max - min
  const padding = 50
  const lineWidth = width - padding * 2
  const tickSpacing = lineWidth / range

  // Convert number to x position
  const numberToX = useCallback((num: number) => {
    return padding + (num - min) * tickSpacing
  }, [min, tickSpacing, padding])

  // Animate hops
  useEffect(() => {
    if (!animate || hops.length === 0) return

    const performHop = () => {
      if (hopIndex >= hops.length) {
        onHopComplete?.(currentPosition)
        return
      }

      setIsJumping(true)
      setShowArc(hopIndex)

      // Jump duration
      setTimeout(() => {
        const newPosition = currentPosition + hops[hopIndex]
        setCurrentPosition(newPosition)
        setCompletedHops(prev => [...prev, hopIndex])

        // Land
        setTimeout(() => {
          setIsJumping(false)
          setShowArc(null)
          setHopIndex(prev => prev + 1)
        }, 300)
      }, 400)
    }

    const timer = setTimeout(performHop, 1200)
    return () => clearTimeout(timer)
  }, [hopIndex, hops, currentPosition, animate, onHopComplete])

  // Reset animation
  const resetAnimation = () => {
    setCurrentPosition(start)
    setHopIndex(0)
    setCompletedHops([])
    setIsJumping(false)
    setShowArc(null)
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={180} className="overflow-visible">
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={width}
          height={180}
          fill="url(#grassGradient)"
          rx={10}
        />

        <defs>
          <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="60%" stopColor="#98FB98" />
            <stop offset="100%" stopColor="#90EE90" />
          </linearGradient>
        </defs>

        {/* Number line base */}
        <motion.line
          x1={padding}
          y1={120}
          x2={width - padding}
          y2={120}
          stroke="#5D4037"
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Tick marks and numbers */}
        {Array.from({ length: range + 1 }).map((_, i) => {
          const num = min + i
          const x = numberToX(num)
          const isHighlighted = highlightRange && num >= highlightRange[0] && num <= highlightRange[1]

          return (
            <motion.g
              key={num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {/* Tick mark */}
              <line
                x1={x}
                y1={115}
                x2={x}
                y2={125}
                stroke="#5D4037"
                strokeWidth={3}
              />

              {/* Number */}
              <motion.text
                x={x}
                y={145}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
                fill={isHighlighted ? '#FF6B6B' : '#5D4037'}
                animate={{
                  scale: isHighlighted ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: isHighlighted ? Infinity : 0 }}
              >
                {num}
              </motion.text>

              {/* Highlight circle */}
              {isHighlighted && (
                <motion.circle
                  cx={x}
                  cy={120}
                  r={12}
                  fill="rgba(255, 107, 107, 0.3)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.g>
          )
        })}

        {/* Jump arcs */}
        <AnimatePresence>
          {completedHops.map((hopIdx) => {
            const hopValue = hops[hopIdx]
            const startPos = start + hops.slice(0, hopIdx).reduce((a, b) => a + b, 0)
            const startX = numberToX(startPos)
            const endX = numberToX(startPos + hopValue)
            const midX = (startX + endX) / 2
            const arcHeight = 50

            return (
              <motion.path
                key={`arc-${hopIdx}`}
                d={`M ${startX} 115 Q ${midX} ${115 - arcHeight} ${endX} 115`}
                fill="none"
                stroke="#FF6B6B"
                strokeWidth={3}
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.5 }}
              />
            )
          })}
        </AnimatePresence>

        {/* Current arc being drawn */}
        {showArc !== null && (
          <motion.path
            d={`M ${numberToX(currentPosition)} 115 Q ${numberToX(currentPosition + hops[showArc] / 2)} ${115 - 60} ${numberToX(currentPosition + hops[showArc])} 115`}
            fill="none"
            stroke="#4CAF50"
            strokeWidth={4}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Hop labels */}
        {completedHops.map((hopIdx) => {
          const hopValue = hops[hopIdx]
          const startPos = start + hops.slice(0, hopIdx).reduce((a, b) => a + b, 0)
          const midX = numberToX(startPos + hopValue / 2)

          return (
            <motion.text
              key={`label-${hopIdx}`}
              x={midX}
              y={55}
              textAnchor="middle"
              fontSize={14}
              fontWeight="bold"
              fill="#FF6B6B"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              +{hopValue}
            </motion.text>
          )
        })}

        {/* Frog */}
        {showFrog && (
          <g transform={`translate(0, 65)`}>
            <Frog
              x={numberToX(currentPosition)}
              isJumping={isJumping}
              direction={hops[hopIndex] > 0 ? 'right' : 'left'}
            />
          </g>
        )}

        {/* Start and end markers */}
        <motion.circle
          cx={numberToX(start)}
          cy={120}
          r={8}
          fill="#4CAF50"
          stroke="white"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />

        {end !== undefined && (
          <motion.circle
            cx={numberToX(end)}
            cy={120}
            r={8}
            fill="#FF6B6B"
            stroke="white"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </svg>

      {/* Controls */}
      <div className="mt-4 flex gap-4">
        <motion.button
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetAnimation}
        >
          🔄 Reset
        </motion.button>

        <div className="px-4 py-2 bg-white rounded-lg shadow">
          <span className="font-semibold">Position: </span>
          <motion.span
            className="text-2xl font-bold text-green-600"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            key={currentPosition}
          >
            {currentPosition}
          </motion.span>
        </div>
      </div>
    </div>
  )
}
