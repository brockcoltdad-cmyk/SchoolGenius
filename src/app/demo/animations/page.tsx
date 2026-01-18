'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import KeyboardHands from '@/components/animations/KeyboardHands'
import FractionPie from '@/components/animations/FractionPie'
import NumberLine from '@/components/animations/NumberLine'
import CountingObjects from '@/components/animations/CountingObjects'
import MathHands from '@/components/animations/MathHands'

export default function AnimationsDemo() {
  const [activeTab, setActiveTab] = useState('keyboard')

  const tabs = [
    { id: 'keyboard', name: '⌨️ Keyboard Hands', color: 'blue' },
    { id: 'fraction', name: '🥧 Fraction Pie', color: 'orange' },
    { id: 'numberline', name: '🐸 Number Line', color: 'green' },
    { id: 'counting', name: '🍎 Counting', color: 'red' },
    { id: 'mathhands', name: '🖐️ Math Hands', color: 'purple' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨ SchoolGenius Animations ✨
          </motion.h1>
          <p className="text-gray-600 mt-2">
            Disney/Pixar Quality - Squash, Stretch, Anticipation, Overshoot
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-full font-semibold text-sm md:text-base ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Animation Display */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Keyboard Hands */}
          {activeTab === 'keyboard' && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
                ⌨️ Keyboard Hands - Typing Lessons K-7
              </h2>
              <KeyboardHands
                targetKey="f"
                showLabels={true}
                skinTone="light"
                isAnimating={true}
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {['Squash on press', 'Finger glow', 'Celebration particles', 'Breathing idle'].map((feature) => (
                  <div key={feature} className="bg-blue-50 rounded-lg p-2 text-center text-blue-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fraction Pie */}
          {activeTab === 'fraction' && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">
                🥧 Fraction Pie - Visual Math
              </h2>
              <div className="flex justify-center">
                <FractionPie
                  numerator={3}
                  denominator={4}
                  animate={true}
                  showLabels={true}
                  colorScheme="rainbow"
                  size={250}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {['Slice pop-in', 'Squash & stretch', 'Sparkle celebration', 'Hover effects'].map((feature) => (
                  <div key={feature} className="bg-orange-50 rounded-lg p-2 text-center text-orange-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Number Line */}
          {activeTab === 'numberline' && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
                🐸 Number Line - Hopping Frog
              </h2>
              <NumberLine
                min={0}
                max={10}
                start={2}
                hops={[3, 2, 1]}
                showFrog={true}
                animate={true}
                highlightRange={[2, 8]}
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {['Jump animation', 'Arc trails', 'Leg stretch', 'Eye tracking'].map((feature) => (
                  <div key={feature} className="bg-green-50 rounded-lg p-2 text-center text-green-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Counting Objects */}
          {activeTab === 'counting' && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
                🍎 Counting Objects - Bouncy Items
              </h2>
              <CountingObjects
                count={12}
                emoji="🍎"
                animate={true}
                groupSize={5}
                showTotal={true}
                colorScheme="rainbow"
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {['Bounce entrance', 'Idle wiggle', 'Group counting', 'Celebration'].map((feature) => (
                  <div key={feature} className="bg-red-50 rounded-lg p-2 text-center text-red-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Math Hands */}
          {activeTab === 'mathhands' && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
                🖐️ Math Hands - 9x Finger Trick
              </h2>
              <div className="text-center mb-4">
                <span className="text-xl bg-purple-100 px-4 py-2 rounded-full">
                  9 × 7 = ?
                </span>
              </div>
              <MathHands
                foldedFingers={[6]} // Fold finger 7 (index 6)
                highlightFingers={[6]}
                showLabels={true}
                animate={true}
                skinTone="light"
                equation="9 × 7"
                result={63}
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {['Finger fold', 'Count display', '9x trick', 'Breathing'].map((feature) => (
                  <div key={feature} className="bg-purple-50 rounded-lg p-2 text-center text-purple-700">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Animation Principles Reference */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-xl text-gray-800 mb-4">
            ✨ Disney/Pixar Animation Principles Applied
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: '🫳', name: 'Squash & Stretch' },
              { icon: '⏳', name: 'Anticipation' },
              { icon: '〰️', name: 'Ease In/Out' },
              { icon: '📈', name: 'Overshoot' },
              { icon: '💨', name: 'Follow Through' },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 text-center"
              >
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{p.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          All animations ready for SchoolGenius K-7 lessons
        </div>
      </motion.div>
    </div>
  )
}
