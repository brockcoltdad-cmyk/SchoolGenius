'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface CountingObjectsProps {
  count: number
  maxCount?: number
  emoji?: string
  animate?: boolean
  groupSize?: number
  showTotal?: boolean
  onCountComplete?: () => void
  colorScheme?: 'red' | 'blue' | 'green' | 'rainbow'
}

// Object themes
const emojiThemes = {
  fruits: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝'],
  animals: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁'],
  space: ['⭐', '🌟', '✨', '💫', '🌙', '☀️', '🪐', '🚀'],
  school: ['📚', '✏️', '📝', '🎨', '📐', '🔬', '🎵', '⚽'],
  food: ['🍕', '🍔', '🌮', '🍩', '🧁', '🍪', '🍫', '🍬'],
}

const colorSchemes = {
  red: ['#FF6B6B', '#FF8E8E', '#FFB4B4'],
  blue: ['#4ECDC4', '#45B7D1', '#96CEB4'],
  green: ['#98FB98', '#90EE90', '#3CB371'],
  rainbow: ['#FF6B6B', '#FFA07A', '#FFD93D', '#98FB98', '#87CEEB', '#DDA0DD'],
}

// Single bouncy object
const BouncyObject = ({
  index,
  emoji,
  delay,
  isRevealed,
  isHighlighted,
  color,
  groupIndex,
}: {
  index: number
  emoji: string
  delay: number
  isRevealed: boolean
  isHighlighted: boolean
  color: string
  groupIndex: number
}) => {
  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: 60, height: 60 }}
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={isRevealed ? {
        scale: 1,
        opacity: 1,
        y: 0,
      } : {
        scale: 0,
        opacity: 0,
        y: 50,
      }}
      transition={{
        delay: delay,
        type: 'spring',
        stiffness: 400,
        damping: 15,
        // OVERSHOOT
        mass: 0.8,
      }}
    >
      {/* Glow background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: isHighlighted ? [1, 1.3, 1] : 1,
          opacity: isHighlighted ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          duration: 0.8,
          repeat: isHighlighted ? Infinity : 0,
        }}
      />

      {/* Object */}
      <motion.span
        className="text-4xl relative z-10 select-none"
        animate={{
          // SQUASH & STRETCH idle animation
          scaleY: [1, 0.9, 1.1, 1],
          scaleX: [1, 1.1, 0.9, 1],
          y: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.1,
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.3,
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.3 },
        }}
      >
        {emoji}
      </motion.span>

      {/* Number label */}
      <motion.div
        className="absolute -bottom-2 -right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: isRevealed ? 1 : 0 }}
        transition={{ delay: delay + 0.2, type: 'spring' }}
      >
        <span className="text-xs font-bold text-gray-700">{index + 1}</span>
      </motion.div>
    </motion.div>
  )
}

export default function CountingObjects({
  count,
  maxCount = 20,
  emoji = '🍎',
  animate = true,
  groupSize = 5,
  showTotal = true,
  onCountComplete,
  colorScheme = 'rainbow',
}: CountingObjectsProps) {
  const [revealedCount, setRevealedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const colors = colorSchemes[colorScheme]
  const displayCount = Math.min(count, maxCount)

  // Animate objects appearing one by one
  useEffect(() => {
    if (!animate) {
      setRevealedCount(displayCount)
      setIsComplete(true)
      return
    }

    setRevealedCount(0)
    setIsComplete(false)

    const interval = setInterval(() => {
      setRevealedCount(prev => {
        if (prev >= displayCount) {
          clearInterval(interval)
          setIsComplete(true)
          onCountComplete?.()
          return prev
        }
        return prev + 1
      })
    }, 400)

    return () => clearInterval(interval)
  }, [count, displayCount, animate, onCountComplete])

  // Group objects for visual organization
  const groups: number[][] = []
  for (let i = 0; i < displayCount; i += groupSize) {
    groups.push(Array.from({ length: Math.min(groupSize, displayCount - i) }, (_, j) => i + j))
  }

  return (
    <div className="flex flex-col items-center p-6">
      {/* Objects grid */}
      <div className="flex flex-col gap-4 mb-6">
        {groups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            className="flex gap-2 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.2 }}
          >
            {/* Group bracket */}
            <motion.div
              className="w-2 h-full bg-gray-200 rounded-full mr-2"
              style={{ minHeight: 60 }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: groupIndex * 0.3 }}
            />

            {/* Objects in group */}
            {group.map((index) => (
              <BouncyObject
                key={index}
                index={index}
                emoji={emoji}
                delay={animate ? index * 0.15 : 0}
                isRevealed={index < revealedCount}
                isHighlighted={index === revealedCount - 1}
                color={colors[index % colors.length]}
                groupIndex={groupIndex}
              />
            ))}

            {/* Group count */}
            <motion.div
              className="ml-2 px-3 py-1 bg-gray-100 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.min(revealedCount, (groupIndex + 1) * groupSize) > groupIndex * groupSize ? 1 : 0 }}
            >
              <span className="text-sm font-semibold text-gray-600">
                {Math.min(revealedCount - groupIndex * groupSize, groupSize)}/{groupSize}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Total counter */}
      {showTotal && (
        <motion.div
          className="flex items-center gap-4 bg-white rounded-2xl shadow-xl px-8 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-2xl font-bold text-gray-600">Total:</span>

          <motion.div
            className="relative"
            key={revealedCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <span className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {revealedCount}
            </span>
          </motion.div>

          <span className="text-4xl">{emoji}</span>
        </motion.div>
      )}

      {/* Celebration on complete */}
      <AnimatePresence>
        {isComplete && count > 0 && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="text-2xl font-bold text-green-500"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              🎉 {count} {emoji} counted! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equation display */}
      {groups.length > 1 && isComplete && (
        <motion.div
          className="mt-4 px-6 py-3 bg-yellow-50 rounded-xl border-2 border-yellow-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="font-mono text-lg">
            {groups.map((g, i) => (
              <span key={i}>
                {g.length}
                {i < groups.length - 1 ? ' + ' : ''}
              </span>
            ))}
            {' = '}
            <span className="font-bold text-blue-600">{displayCount}</span>
          </span>
        </motion.div>
      )}
    </div>
  )
}

export { emojiThemes, colorSchemes }
