/**
 * =========================================
 * TO BE REPLACED WITH RIVE
 * =========================================
 * This is SVG + Framer Motion - NOT real Rive.
 * Replace with actual .riv file: /public/rive/math-hands.riv
 * See: library/RIVE-INSTRUCTIONS.md
 * =========================================
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface MathHandsProps {
  foldedFingers?: number[] // Which fingers are folded (0-9, 0=left pinky, 9=right pinky)
  highlightFingers?: number[]
  showLabels?: boolean
  animate?: boolean
  skinTone?: 'light' | 'medium' | 'dark'
  onFingerClick?: (fingerIndex: number) => void
  equation?: string
  result?: number
}

// Skin tones
const skinTones = {
  light: { base: '#FFDAB9', shadow: '#DEB887', highlight: '#FFE4C4', nail: '#FFE4E1' },
  medium: { base: '#D2B48C', shadow: '#BC8F8F', highlight: '#DEB887', nail: '#F5DEB3' },
  dark: { base: '#8B7355', shadow: '#6B4423', highlight: '#A0522D', nail: '#D2B48C' },
}

// Single finger component
const Finger = ({
  x,
  y,
  width,
  height,
  isFolded,
  isHighlighted,
  fingerIndex,
  skinTone,
  showLabel,
  onClick,
  hand,
}: {
  x: number
  y: number
  width: number
  height: number
  isFolded: boolean
  isHighlighted: boolean
  fingerIndex: number
  skinTone: typeof skinTones.light
  showLabel: boolean
  onClick?: () => void
  hand: 'left' | 'right'
}) => {
  const foldY = isFolded ? y + height * 0.6 : y
  const foldHeight = isFolded ? height * 0.4 : height

  return (
    <motion.g
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    >
      {/* Finger shadow */}
      <motion.ellipse
        cx={x + width / 2}
        cy={y + height + 5}
        rx={width / 2}
        ry={4}
        fill="rgba(0,0,0,0.15)"
        animate={{
          ry: isFolded ? 2 : 4,
          cy: isFolded ? foldY + foldHeight + 3 : y + height + 5,
        }}
      />

      {/* Main finger body */}
      <motion.rect
        x={x}
        y={foldY}
        width={width}
        height={foldHeight}
        rx={width / 2}
        fill={skinTone.base}
        stroke={skinTone.shadow}
        strokeWidth={1.5}
        animate={{
          y: foldY,
          height: foldHeight,
          // SQUASH when folding
          scaleX: isFolded ? 1.15 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />

      {/* Fingernail */}
      <motion.ellipse
        cx={x + width / 2}
        cy={foldY + 6}
        rx={width / 3}
        ry={4}
        fill={skinTone.nail}
        stroke={skinTone.shadow}
        strokeWidth={0.5}
        animate={{
          cy: foldY + 6,
          opacity: isFolded ? 0 : 1,
        }}
      />

      {/* Highlight ring when selected */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.ellipse
            cx={x + width / 2}
            cy={foldY + foldHeight / 2}
            rx={width / 2 + 8}
            ry={foldHeight / 2 + 8}
            fill="none"
            stroke="#FFD700"
            strokeWidth={3}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Finger number label */}
      {showLabel && (
        <motion.text
          x={x + width / 2}
          y={y + height + 18}
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          fill={isFolded ? '#999' : '#333'}
          animate={{ opacity: isFolded ? 0.5 : 1 }}
        >
          {fingerIndex + 1}
        </motion.text>
      )}

      {/* Folded indicator */}
      {isFolded && (
        <motion.text
          x={x + width / 2}
          y={foldY + foldHeight / 2 + 4}
          textAnchor="middle"
          fontSize={8}
          fill={skinTone.shadow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✓
        </motion.text>
      )}
    </motion.g>
  )
}

// Complete hand
const Hand = ({
  isLeft,
  foldedFingers,
  highlightedFingers,
  skinTone,
  showLabels,
  onFingerClick,
  offsetX,
}: {
  isLeft: boolean
  foldedFingers: number[]
  highlightedFingers: number[]
  skinTone: typeof skinTones.light
  showLabels: boolean
  onFingerClick?: (finger: number) => void
  offsetX: number
}) => {
  // Finger configs (thumb is different)
  const fingerConfigs = isLeft
    ? [
        { x: 10, y: 25, w: 14, h: 35 },  // Pinky (0)
        { x: 28, y: 15, w: 15, h: 45 },  // Ring (1)
        { x: 47, y: 8, w: 16, h: 52 },   // Middle (2)
        { x: 67, y: 15, w: 15, h: 45 },  // Index (3)
        { x: 90, y: 45, w: 18, h: 30 },  // Thumb (4)
      ]
    : [
        { x: 90, y: 25, w: 14, h: 35 },  // Pinky (5)
        { x: 72, y: 15, w: 15, h: 45 },  // Ring (6)
        { x: 52, y: 8, w: 16, h: 52 },   // Middle (7)
        { x: 32, y: 15, w: 15, h: 45 },  // Index (8)
        { x: 5, y: 45, w: 18, h: 30 },   // Thumb (9)
      ]

  const baseIndex = isLeft ? 0 : 5

  return (
    <motion.g
      transform={`translate(${offsetX}, 0)`}
      // Subtle breathing
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Palm */}
      <motion.path
        d={isLeft
          ? 'M 15 60 Q 10 90 30 105 L 90 105 Q 110 90 105 60 Z'
          : 'M 10 60 Q 5 90 25 105 L 85 105 Q 105 90 100 60 Z'
        }
        fill={skinTone.base}
        stroke={skinTone.shadow}
        strokeWidth={2}
      />

      {/* Wrist */}
      <rect
        x={isLeft ? 25 : 20}
        y={100}
        width={70}
        height={25}
        rx={5}
        fill={skinTone.base}
        stroke={skinTone.shadow}
        strokeWidth={1.5}
      />

      {/* Fingers */}
      {fingerConfigs.map((config, i) => {
        const globalIndex = baseIndex + i
        return (
          <Finger
            key={i}
            x={config.x}
            y={config.y}
            width={config.w}
            height={config.h}
            isFolded={foldedFingers.includes(globalIndex)}
            isHighlighted={highlightedFingers.includes(globalIndex)}
            fingerIndex={globalIndex}
            skinTone={skinTone}
            showLabel={showLabels}
            onClick={() => onFingerClick?.(globalIndex)}
            hand={isLeft ? 'left' : 'right'}
          />
        )
      })}

      {/* Hand label */}
      <text
        x={isLeft ? 55 : 55}
        y={140}
        textAnchor="middle"
        fontSize={12}
        fill="#666"
        fontWeight="600"
      >
        {isLeft ? 'LEFT' : 'RIGHT'}
      </text>
    </motion.g>
  )
}

export default function MathHands({
  foldedFingers = [],
  highlightFingers = [],
  showLabels = true,
  animate = true,
  skinTone = 'light',
  onFingerClick,
  equation,
  result,
}: MathHandsProps) {
  const [currentFolded, setCurrentFolded] = useState<number[]>([])
  const tone = skinTones[skinTone]

  // Animate folding one by one
  useEffect(() => {
    if (!animate) {
      setCurrentFolded(foldedFingers)
      return
    }

    setCurrentFolded([])
    foldedFingers.forEach((finger, index) => {
      setTimeout(() => {
        setCurrentFolded(prev => [...prev, finger])
      }, index * 300 + 500)
    })
  }, [foldedFingers, animate])

  // Count fingers up and down
  const upCount = 10 - currentFolded.length
  const downCount = currentFolded.length

  // For 9x trick: count fingers on each side of folded finger
  const leftOfFolded = currentFolded.length === 1 ? currentFolded[0] : null
  const rightOfFolded = leftOfFolded !== null ? 9 - leftOfFolded : null

  return (
    <div className="flex flex-col items-center">
      {/* Equation display */}
      {equation && (
        <motion.div
          className="mb-4 px-6 py-3 bg-blue-50 rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-2xl font-bold text-blue-600">{equation}</span>
        </motion.div>
      )}

      {/* Hands SVG */}
      <svg width="280" height="160" className="overflow-visible">
        {/* Background */}
        <rect
          x="0"
          y="0"
          width="280"
          height="160"
          rx="12"
          fill="linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)"
        />
        <defs>
          <linearGradient id="handsBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="280" height="160" rx="12" fill="url(#handsBg)" />

        {/* Left hand */}
        <Hand
          isLeft={true}
          foldedFingers={currentFolded}
          highlightedFingers={highlightFingers}
          skinTone={tone}
          showLabels={showLabels}
          onFingerClick={onFingerClick}
          offsetX={10}
        />

        {/* Right hand */}
        <Hand
          isLeft={false}
          foldedFingers={currentFolded}
          highlightedFingers={highlightFingers}
          skinTone={tone}
          showLabels={showLabels}
          onFingerClick={onFingerClick}
          offsetX={150}
        />
      </svg>

      {/* Counting display */}
      <motion.div
        className="mt-4 flex gap-6 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Fingers up */}
        <div className="text-center px-4 py-2 bg-green-100 rounded-xl">
          <div className="text-sm text-green-600 font-medium">Fingers Up</div>
          <motion.div
            className="text-3xl font-bold text-green-700"
            key={upCount}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            {upCount}
          </motion.div>
        </div>

        {/* Fingers down */}
        <div className="text-center px-4 py-2 bg-orange-100 rounded-xl">
          <div className="text-sm text-orange-600 font-medium">Fingers Down</div>
          <motion.div
            className="text-3xl font-bold text-orange-700"
            key={downCount}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            {downCount}
          </motion.div>
        </div>

        {/* Result (for 9x trick) */}
        {result !== undefined && (
          <motion.div
            className="text-center px-6 py-2 bg-purple-100 rounded-xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <div className="text-sm text-purple-600 font-medium">Answer</div>
            <div className="text-4xl font-bold text-purple-700">{result}</div>
          </motion.div>
        )}
      </motion.div>

      {/* 9x multiplication trick explanation */}
      {leftOfFolded !== null && rightOfFolded !== null && (
        <motion.div
          className="mt-4 px-6 py-3 bg-yellow-50 rounded-xl border-2 border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-center">
            <span className="text-lg">
              <span className="font-bold text-green-600">{leftOfFolded}</span>
              {' fingers left, '}
              <span className="font-bold text-orange-600">{rightOfFolded}</span>
              {' fingers right = '}
              <span className="font-bold text-purple-600 text-2xl">{leftOfFolded}{rightOfFolded}</span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export { skinTones }
