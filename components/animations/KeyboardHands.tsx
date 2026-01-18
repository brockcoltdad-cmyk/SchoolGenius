/**
 * =========================================
 * TO BE REPLACED WITH RIVE
 * =========================================
 * This is SVG + Framer Motion - NOT real Rive.
 * Replace with actual .riv file: /public/rive/keyboard-hands.riv
 * See: library/RIVE-INSTRUCTIONS.md
 * =========================================
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'

// Finger assignments for each key
const fingerMap: Record<string, { hand: 'left' | 'right'; finger: number; name: string }> = {
  // Left pinky (finger 0)
  'a': { hand: 'left', finger: 0, name: 'pinky' },
  'q': { hand: 'left', finger: 0, name: 'pinky' },
  'z': { hand: 'left', finger: 0, name: 'pinky' },
  '1': { hand: 'left', finger: 0, name: 'pinky' },
  // Left ring (finger 1)
  's': { hand: 'left', finger: 1, name: 'ring' },
  'w': { hand: 'left', finger: 1, name: 'ring' },
  'x': { hand: 'left', finger: 1, name: 'ring' },
  '2': { hand: 'left', finger: 1, name: 'ring' },
  // Left middle (finger 2)
  'd': { hand: 'left', finger: 2, name: 'middle' },
  'e': { hand: 'left', finger: 2, name: 'middle' },
  'c': { hand: 'left', finger: 2, name: 'middle' },
  '3': { hand: 'left', finger: 2, name: 'middle' },
  // Left index (finger 3)
  'f': { hand: 'left', finger: 3, name: 'index' },
  'r': { hand: 'left', finger: 3, name: 'index' },
  'v': { hand: 'left', finger: 3, name: 'index' },
  'g': { hand: 'left', finger: 3, name: 'index' },
  't': { hand: 'left', finger: 3, name: 'index' },
  'b': { hand: 'left', finger: 3, name: 'index' },
  '4': { hand: 'left', finger: 3, name: 'index' },
  '5': { hand: 'left', finger: 3, name: 'index' },
  // Right index (finger 3)
  'j': { hand: 'right', finger: 3, name: 'index' },
  'u': { hand: 'right', finger: 3, name: 'index' },
  'm': { hand: 'right', finger: 3, name: 'index' },
  'h': { hand: 'right', finger: 3, name: 'index' },
  'y': { hand: 'right', finger: 3, name: 'index' },
  'n': { hand: 'right', finger: 3, name: 'index' },
  '6': { hand: 'right', finger: 3, name: 'index' },
  '7': { hand: 'right', finger: 3, name: 'index' },
  // Right middle (finger 2)
  'k': { hand: 'right', finger: 2, name: 'middle' },
  'i': { hand: 'right', finger: 2, name: 'middle' },
  ',': { hand: 'right', finger: 2, name: 'middle' },
  '8': { hand: 'right', finger: 2, name: 'middle' },
  // Right ring (finger 1)
  'l': { hand: 'right', finger: 1, name: 'ring' },
  'o': { hand: 'right', finger: 1, name: 'ring' },
  '.': { hand: 'right', finger: 1, name: 'ring' },
  '9': { hand: 'right', finger: 1, name: 'ring' },
  // Right pinky (finger 0)
  ';': { hand: 'right', finger: 0, name: 'pinky' },
  'p': { hand: 'right', finger: 0, name: 'pinky' },
  '/': { hand: 'right', finger: 0, name: 'pinky' },
  '0': { hand: 'right', finger: 0, name: 'pinky' },
  // Thumbs
  ' ': { hand: 'right', finger: 4, name: 'thumb' },
}

// Finger colors (gradient from pinky to thumb)
const fingerColors = {
  left: ['#FF6B9D', '#FF8E72', '#FFB347', '#87CEEB', '#98FB98'],  // Pink to green
  right: ['#DDA0DD', '#B19CD9', '#87CEEB', '#98D8C8', '#F0E68C'], // Purple to yellow
}

// Skin tone options
const skinTones = {
  light: { base: '#FFDAB9', shadow: '#DEB887', highlight: '#FFE4C4' },
  medium: { base: '#D2691E', shadow: '#A0522D', highlight: '#DEB887' },
  dark: { base: '#8B4513', shadow: '#654321', highlight: '#A0522D' },
}

interface KeyboardHandsProps {
  targetKey?: string
  highlightKeys?: string[]
  showLabels?: boolean
  skinTone?: 'light' | 'medium' | 'dark'
  onKeyPress?: (key: string) => void
  isAnimating?: boolean
  grade?: number // 0-7, affects animation complexity
}

// Single Finger Component with Disney-quality animation
const Finger = ({
  fingerIndex,
  hand,
  isPressed,
  isHighlighted,
  fingerName,
  skinTone,
  showLabel,
}: {
  fingerIndex: number
  hand: 'left' | 'right'
  isPressed: boolean
  isHighlighted: boolean
  fingerName: string
  skinTone: typeof skinTones.light
  showLabel: boolean
}) => {
  // Finger dimensions (thumb is wider and shorter)
  const isThumb = fingerIndex === 4
  const fingerWidth = isThumb ? 28 : 18 - fingerIndex * 1.5
  const fingerHeight = isThumb ? 35 : 50 - fingerIndex * 5

  // Position fingers in a natural curve
  const xOffset = hand === 'left'
    ? 20 + fingerIndex * 22
    : 20 + (4 - fingerIndex) * 22
  const yOffset = isThumb ? 70 : 10 + Math.abs(fingerIndex - 2) * 8

  return (
    <motion.g
      style={{ originX: xOffset + fingerWidth / 2, originY: yOffset + fingerHeight }}
    >
      {/* Finger shadow */}
      <motion.ellipse
        cx={xOffset + fingerWidth / 2}
        cy={yOffset + fingerHeight + 5}
        rx={fingerWidth / 2 - 2}
        ry={4}
        fill="rgba(0,0,0,0.2)"
        animate={{
          ry: isPressed ? 6 : 4,
          opacity: isPressed ? 0.4 : 0.2,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Main finger body */}
      <motion.rect
        x={xOffset}
        y={yOffset}
        width={fingerWidth}
        height={fingerHeight}
        rx={fingerWidth / 2}
        fill={skinTone.base}
        stroke={skinTone.shadow}
        strokeWidth={1.5}
        // ANTICIPATION: Wind up before press
        animate={{
          y: isPressed ? yOffset + 8 : yOffset,
          height: isPressed ? fingerHeight - 5 : fingerHeight, // SQUASH
          scaleX: isPressed ? 1.1 : 1, // STRETCH on squash
          filter: isHighlighted ? 'brightness(1.2)' : 'brightness(1)',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          // EASE IN/OUT
          mass: 0.8,
        }}
      />

      {/* Fingernail */}
      <motion.ellipse
        cx={xOffset + fingerWidth / 2}
        cy={yOffset + 8}
        rx={fingerWidth / 3}
        ry={5}
        fill={skinTone.highlight}
        opacity={0.7}
        animate={{
          cy: isPressed ? yOffset + 12 : yOffset + 8,
          ry: isPressed ? 4 : 5, // Squash the nail too
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />

      {/* Highlight glow when this finger should be used */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.ellipse
            cx={xOffset + fingerWidth / 2}
            cy={yOffset + fingerHeight / 2}
            rx={fingerWidth / 2 + 8}
            ry={fingerHeight / 2 + 8}
            fill="none"
            stroke={fingerColors[hand][fingerIndex]}
            strokeWidth={3}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </AnimatePresence>

      {/* Finger label */}
      {showLabel && (
        <motion.text
          x={xOffset + fingerWidth / 2}
          y={yOffset + fingerHeight + 20}
          textAnchor="middle"
          fontSize={10}
          fill="#666"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {fingerName.charAt(0).toUpperCase()}
        </motion.text>
      )}
    </motion.g>
  )
}

// Complete Hand Component
const Hand = ({
  hand,
  pressedFinger,
  highlightedFinger,
  skinTone,
  showLabels,
}: {
  hand: 'left' | 'right'
  pressedFinger: number | null
  highlightedFinger: number | null
  skinTone: typeof skinTones.light
  showLabels: boolean
}) => {
  const fingerNames = ['pinky', 'ring', 'middle', 'index', 'thumb']
  const isLeft = hand === 'left'

  return (
    <motion.g
      // Subtle breathing animation - MAKE IT FEEL ALIVE
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Palm */}
      <motion.path
        d={isLeft
          ? 'M 15 60 Q 15 100 60 110 Q 105 100 105 60 L 105 80 Q 60 95 15 80 Z'
          : 'M 15 60 Q 15 100 60 110 Q 105 100 105 60 L 105 80 Q 60 95 15 80 Z'
        }
        fill={skinTone.base}
        stroke={skinTone.shadow}
        strokeWidth={1.5}
        // Palm squash when any finger presses
        animate={{
          scaleY: pressedFinger !== null ? 0.95 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      {/* Wrist */}
      <motion.rect
        x={30}
        y={105}
        width={60}
        height={25}
        rx={5}
        fill={skinTone.base}
        stroke={skinTone.shadow}
        strokeWidth={1}
      />

      {/* Fingers */}
      {[0, 1, 2, 3, 4].map((fingerIndex) => (
        <Finger
          key={fingerIndex}
          fingerIndex={fingerIndex}
          hand={hand}
          isPressed={pressedFinger === fingerIndex}
          isHighlighted={highlightedFinger === fingerIndex}
          fingerName={fingerNames[fingerIndex]}
          skinTone={skinTone}
          showLabel={showLabels}
        />
      ))}

      {/* Hand label */}
      <motion.text
        x={60}
        y={145}
        textAnchor="middle"
        fontSize={12}
        fill="#888"
        fontWeight="600"
      >
        {isLeft ? 'LEFT' : 'RIGHT'}
      </motion.text>
    </motion.g>
  )
}

// Main KeyboardHands Component
export default function KeyboardHands({
  targetKey,
  highlightKeys = [],
  showLabels = true,
  skinTone = 'light',
  onKeyPress,
  isAnimating = false,
  grade = 3,
}: KeyboardHandsProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [celebrateKey, setCelebrateKey] = useState<string | null>(null)
  const tone = skinTones[skinTone]

  // Get finger info for a key
  const getFingerInfo = useCallback((key: string) => {
    return fingerMap[key.toLowerCase()] || null
  }, [])

  // Handle key press animation
  const animateKeyPress = useCallback((key: string) => {
    setPressedKey(key)

    // ANTICIPATION delay before press
    setTimeout(() => {
      // Key is now "pressed"
      onKeyPress?.(key)

      // OVERSHOOT - bounce back
      setTimeout(() => {
        setPressedKey(null)
        setCelebrateKey(key)

        // Clear celebration
        setTimeout(() => setCelebrateKey(null), 500)
      }, 150)
    }, 50)
  }, [onKeyPress])

  // Auto-animate target key for demos
  useEffect(() => {
    if (isAnimating && targetKey) {
      const interval = setInterval(() => {
        animateKeyPress(targetKey)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAnimating, targetKey, animateKeyPress])

  // Determine which fingers to highlight/press
  const targetInfo = targetKey ? getFingerInfo(targetKey) : null
  const pressedInfo = pressedKey ? getFingerInfo(pressedKey) : null

  // All highlighted keys
  const highlightedFingers = {
    left: null as number | null,
    right: null as number | null,
  }

  if (targetInfo) {
    highlightedFingers[targetInfo.hand] = targetInfo.finger
  }

  highlightKeys.forEach(key => {
    const info = getFingerInfo(key)
    if (info) {
      highlightedFingers[info.hand] = info.finger
    }
  })

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main SVG container */}
      <svg
        viewBox="0 0 280 160"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect
          x="0"
          y="0"
          width="280"
          height="160"
          rx="12"
          fill="url(#bgGradient)"
        />

        {/* Left Hand */}
        <g transform="translate(10, 5)">
          <Hand
            hand="left"
            pressedFinger={pressedInfo?.hand === 'left' ? pressedInfo.finger : null}
            highlightedFinger={highlightedFingers.left}
            skinTone={tone}
            showLabels={showLabels}
          />
        </g>

        {/* Right Hand */}
        <g transform="translate(150, 5)">
          <Hand
            hand="right"
            pressedFinger={pressedInfo?.hand === 'right' ? pressedInfo.finger : null}
            highlightedFinger={highlightedFingers.right}
            skinTone={tone}
            showLabels={showLabels}
          />
        </g>

        {/* Target key indicator */}
        {targetKey && targetInfo && (
          <motion.g
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.rect
              x={targetInfo.hand === 'left' ? 40 : 190}
              y={-5}
              width={50}
              height={24}
              rx={12}
              fill={fingerColors[targetInfo.hand][targetInfo.finger]}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text
              x={targetInfo.hand === 'left' ? 65 : 215}
              y={12}
              textAnchor="middle"
              fontSize={14}
              fontWeight="bold"
              fill="white"
            >
              {targetKey.toUpperCase()}
            </text>
          </motion.g>
        )}
      </svg>

      {/* Celebration particles */}
      <AnimatePresence>
        {celebrateKey && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  backgroundColor: fingerColors.left[i % 5],
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8) * 60,
                  y: Math.sin((i * Math.PI * 2) / 8) * 40 - 20,
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1], // Springy overshoot
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finger instruction text */}
      {targetKey && targetInfo && (
        <motion.div
          className="text-center mt-4 text-lg font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: fingerColors[targetInfo.hand][targetInfo.finger] }}
        >
          Use your <span className="capitalize">{targetInfo.hand}</span>{' '}
          <span className="capitalize">{targetInfo.name}</span> finger!
        </motion.div>
      )}

      {/* Interactive demo button */}
      {targetKey && (
        <motion.button
          className="mt-4 mx-auto block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => animateKeyPress(targetKey)}
        >
          Press {targetKey.toUpperCase()}
        </motion.button>
      )}
    </div>
  )
}

// Export finger map for external use
export { fingerMap, fingerColors, skinTones }
