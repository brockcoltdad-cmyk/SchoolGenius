'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import KeyboardHands, { fingerMap } from '@/components/animations/KeyboardHands'

export default function KeyboardHandsDemo() {
  const [targetKey, setTargetKey] = useState('f')
  const [skinTone, setSkinTone] = useState<'light' | 'medium' | 'dark'>('light')
  const [isAnimating, setIsAnimating] = useState(false)
  const [grade, setGrade] = useState(3)

  const homeRowKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']
  const topRowKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
  const bottomRowKeys = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🖐️ Keyboard Hands Animation
          </motion.h1>
          <p className="text-gray-600 mt-2">
            Disney/Pixar quality - Squash, Stretch, Anticipation, Overshoot
          </p>
        </div>

        {/* Main Animation Display */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        >
          <KeyboardHands
            targetKey={targetKey}
            highlightKeys={[targetKey]}
            showLabels={true}
            skinTone={skinTone}
            isAnimating={isAnimating}
            grade={grade}
            onKeyPress={(key) => console.log('Pressed:', key)}
          />
        </motion.div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Key Selection */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Select Target Key</h3>

            {/* Home Row */}
            <div className="mb-2">
              <span className="text-xs text-gray-500 mr-2">Home Row:</span>
              <div className="inline-flex gap-1">
                {homeRowKeys.map((key) => (
                  <motion.button
                    key={key}
                    className={`w-10 h-10 rounded-lg font-bold text-lg ${
                      targetKey === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTargetKey(key)}
                  >
                    {key.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Top Row */}
            <div className="mb-2">
              <span className="text-xs text-gray-500 mr-2">Top Row:</span>
              <div className="inline-flex gap-1 flex-wrap">
                {topRowKeys.map((key) => (
                  <motion.button
                    key={key}
                    className={`w-10 h-10 rounded-lg font-bold text-lg ${
                      targetKey === key
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTargetKey(key)}
                  >
                    {key.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mb-2">
              <span className="text-xs text-gray-500 mr-2">Bottom Row:</span>
              <div className="inline-flex gap-1">
                {bottomRowKeys.map((key) => (
                  <motion.button
                    key={key}
                    className={`w-10 h-10 rounded-lg font-bold text-lg ${
                      targetKey === key
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTargetKey(key)}
                  >
                    {key.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Spacebar */}
            <div>
              <motion.button
                className={`px-12 py-2 rounded-lg font-bold ${
                  targetKey === ' '
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTargetKey(' ')}
              >
                SPACEBAR
              </motion.button>
            </div>
          </div>

          {/* Skin Tone Selection */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Skin Tone</h3>
            <div className="flex gap-3">
              {(['light', 'medium', 'dark'] as const).map((tone) => (
                <motion.button
                  key={tone}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    skinTone === tone
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSkinTone(tone)}
                >
                  {tone}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Auto Animation Toggle */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Auto Animation</h3>
            <motion.button
              className={`px-6 py-3 rounded-xl font-bold ${
                isAnimating
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? '⏹️ Stop Animation' : '▶️ Auto Animate'}
            </motion.button>
          </div>

          {/* Current Key Info */}
          {targetKey && fingerMap[targetKey.toLowerCase()] && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="font-semibold text-gray-700 mb-2">Current Key Info</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {targetKey === ' ' ? '␣' : targetKey.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">Key</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600 capitalize">
                    {fingerMap[targetKey.toLowerCase()]?.hand}
                  </div>
                  <div className="text-xs text-gray-500">Hand</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-pink-600 capitalize">
                    {fingerMap[targetKey.toLowerCase()]?.name}
                  </div>
                  <div className="text-xs text-gray-500">Finger</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Animation Principles Checklist */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            ✨ Disney/Pixar Animation Principles Applied
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Squash & Stretch', icon: '🫳', desc: 'Fingers compress on press' },
              { name: 'Anticipation', icon: '⏳', desc: 'Wind-up before action' },
              { name: 'Ease In/Out', icon: '〰️', desc: 'Spring physics motion' },
              { name: 'Overshoot', icon: '📈', desc: 'Bounce past and settle' },
              { name: 'Secondary Motion', icon: '🌊', desc: 'Palm responds to fingers' },
              { name: 'Breathing', icon: '💨', desc: 'Subtle idle movement' },
              { name: 'Particles', icon: '✨', desc: 'Celebration effects' },
              { name: 'Glow Effects', icon: '💫', desc: 'Highlighted key pulse' },
            ].map((principle) => (
              <motion.div
                key={principle.name}
                className="bg-green-50 rounded-lg p-3 border border-green-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-2xl mb-1">{principle.icon}</div>
                <div className="font-semibold text-green-700 text-sm">{principle.name}</div>
                <div className="text-xs text-gray-500">{principle.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
