'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Sparkles, Trophy, Lock, Star } from 'lucide-react';
import Link from 'next/link';
import CountingObjectsVisual from '@/components/lesson/visuals/CountingObjectsVisual';
import LetterVisual from '@/components/lesson/visuals/LetterVisual';
import CodeBlockVisual from '@/components/lesson/visuals/CodeBlockVisual';
import { THEME_SKINS, getRarityColor, getRarityGlow } from '@/lib/theme-skins';
import { Button } from '@/components/ui/button';

const THEME_OPTIONS = [
  { id: 'battle', name: 'Battle Royale', emoji: '⚔️', gradient: 'from-purple-600 via-pink-600 to-purple-600' },
  { id: 'builder', name: 'Block Builder', emoji: '⛏️', gradient: 'from-emerald-600 via-green-600 to-emerald-600' },
  { id: 'pirate', name: 'Pirate Adventure', emoji: '🏴‍☠️', gradient: 'from-blue-600 via-cyan-600 to-blue-600' },
  { id: 'zombie', name: 'Zombie Survival', emoji: '🧟', gradient: 'from-green-600 via-lime-600 to-green-600' },
  { id: 'anime', name: 'Ninja Training', emoji: '⚡', gradient: 'from-pink-600 via-purple-600 to-pink-600' },
  { id: 'wwe', name: 'Wrestling Champ', emoji: '💪', gradient: 'from-yellow-600 via-red-600 to-yellow-600' },
];

export default function DemoLessonsPage() {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  const currentTheme = THEME_OPTIONS[selectedTheme];
  const themeSkins = THEME_SKINS[currentTheme.id as keyof typeof THEME_SKINS] || THEME_SKINS.default;

  const handleReplay = (demoIndex: number) => {
    setReplayKey(prev => prev + 1);
    setActiveDemo(demoIndex);
  };

  useEffect(() => {
    setReplayKey(prev => prev + 1);
  }, [selectedTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">Interactive Demo</h1>
              <p className="text-gray-400 text-sm">Try out our learning experience</p>
            </div>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold">
                Sign Up Free
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-black text-white mb-4">Pick Your Theme</h2>
          <p className="text-xl text-gray-300 mb-8">All lessons adapt to your favorite world!</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {THEME_OPTIONS.map((theme, index) => (
              <motion.button
                key={theme.id}
                onClick={() => setSelectedTheme(index)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-6 rounded-2xl font-black transition-all ${
                  selectedTheme === index
                    ? `bg-gradient-to-br ${theme.gradient} shadow-2xl border-4 border-white/50`
                    : 'bg-gray-800/80 hover:bg-gray-700/80 border-4 border-gray-700'
                }`}
              >
                {selectedTheme === index && (
                  <motion.div
                    layoutId="selectedTheme"
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10">
                  <motion.div
                    animate={selectedTheme === index ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 2, repeat: selectedTheme === index ? Infinity : 0 }}
                    className="text-5xl mb-2"
                  >
                    {theme.emoji}
                  </motion.div>
                  <div className={`text-sm font-black ${selectedTheme === index ? 'text-white' : 'text-gray-400'}`}>
                    {theme.name}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Demo Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-6 pb-16 space-y-12"
        >
          {/* Demo 1: Math */}
          <DemoSection
            title="Math Problem"
            description="Count objects and solve equations"
            gradient={currentTheme.gradient}
            onReplay={() => handleReplay(0)}
            isActive={activeDemo === 0}
          >
            <CountingObjectsVisual
              key={`math-${replayKey}`}
              data={{
                emoji: "🍎",
                groups: [3, 2],
                operation: 'add',
                show_equation: true
              }}
              isPlaying={true}
            />
          </DemoSection>

          {/* Demo 2: Phonics */}
          <DemoSection
            title="Phonics Lesson"
            description="Learn letters and sounds"
            gradient={currentTheme.gradient}
            onReplay={() => handleReplay(1)}
            isActive={activeDemo === 1}
          >
            <LetterVisual
              key={`phonics-${replayKey}`}
              data={{
                letter: "A",
                letterLower: "a",
                keyword: "apple",
                emoji: "🍎",
                example_words: ["ant", "ask", "at"],
                example_emojis: ["🐜", "🙋", "📍"]
              }}
              isPlaying={true}
            />
          </DemoSection>

          {/* Demo 3: Coding */}
          <DemoSection
            title="Coding Challenge"
            description="Build programs with drag-and-drop blocks"
            gradient={currentTheme.gradient}
            onReplay={() => handleReplay(2)}
            isActive={activeDemo === 2}
          >
            <CodeBlockVisual
              key={`code-${replayKey}`}
              data={{
                blocks: [
                  { type: 'event', text: 'When game starts', color: 'yellow' },
                  { type: 'action', text: 'Move forward 50 steps', color: 'blue' },
                  { type: 'action', text: 'Turn right 90 degrees', color: 'blue' },
                  { type: 'loop', text: 'Repeat 3 times', color: 'orange' },
                ]
              }}
              isPlaying={true}
            />
          </DemoSection>

          {/* Demo 4: Shop Preview */}
          <DemoSection
            title="Theme Shop"
            description="Unlock skins and customize your character"
            gradient={currentTheme.gradient}
            onReplay={() => handleReplay(3)}
            isActive={activeDemo === 3}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
              {themeSkins.slice(0, 4).map((skin, index) => (
                <motion.div
                  key={skin.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-4 transition-all hover:scale-105"
                    style={{
                      borderColor: getRarityColor(skin.rarity),
                      boxShadow: getRarityGlow(skin.rarity),
                    }}
                  >
                    {/* Rarity Badge */}
                    <div className="absolute top-2 right-2">
                      <div
                        className="px-2 py-1 rounded-full text-xs font-black uppercase"
                        style={{ backgroundColor: getRarityColor(skin.rarity), color: 'white' }}
                      >
                        {skin.rarity}
                      </div>
                    </div>

                    {/* Character Icon */}
                    <div className="text-6xl mb-4 text-center">{skin.icon}</div>

                    {/* Name */}
                    <h3 className="text-white font-black text-center mb-2">{skin.name}</h3>

                    {/* Description */}
                    <p className="text-gray-400 text-xs text-center mb-4">{skin.description}</p>

                    {/* Lock or Price */}
                    {index === 0 ? (
                      <div className="flex items-center justify-center gap-2 bg-green-600/20 text-green-400 py-2 rounded-lg font-bold text-sm">
                        <Trophy className="h-4 w-4" />
                        Unlocked
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 bg-gray-700/50 text-gray-300 py-2 rounded-lg font-bold text-sm">
                        <Lock className="h-4 w-4" />
                        {skin.coinCost} Coins
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 bg-yellow-600/20 border-2 border-yellow-500/50 text-yellow-300 px-6 py-3 rounded-full font-bold">
                <Lock className="h-5 w-5" />
                Sign up to unlock and purchase skins!
              </div>
            </div>
          </DemoSection>

          {/* Big CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl p-12 border-4 border-white/10 max-w-4xl mx-auto">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                {currentTheme.emoji}
              </motion.div>

              <h2 className={`text-5xl font-black mb-4 bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                Ready to Start Learning?
              </h2>

              <p className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of kids already mastering math, reading, coding, and more in their favorite themes!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentTheme.gradient} text-white font-black text-2xl px-12 py-6 rounded-full shadow-2xl border-4 border-white/20`}
                  >
                    <Sparkles className="h-6 w-6" />
                    Start Free Trial
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">1000+ Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-400" />
                  <span className="font-bold">Progress Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="font-bold">50+ Themes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface DemoSectionProps {
  title: string;
  description: string;
  gradient: string;
  onReplay: () => void;
  isActive: boolean;
  children: React.ReactNode;
}

function DemoSection({ title, description, gradient, onReplay, isActive, children }: DemoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border-4 border-white/10 overflow-hidden"
    >
      {/* Section Header */}
      <div className={`bg-gradient-to-r ${gradient} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black text-white mb-1">{title}</h3>
            <p className="text-white/80 font-semibold">{description}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={onReplay}
            className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all border-2 border-white/50"
          >
            <RotateCcw className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Demo Content */}
      <div className="bg-white p-8">
        {children}
      </div>

      {/* CTA Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-center border-t-4 border-white/10">
        <p className="text-gray-300 text-lg mb-4 font-semibold">
          Want to keep going? Create a free account to unlock 1,000+ lessons!
        </p>
        <Link href="/signup">
          <Button size="lg" className={`bg-gradient-to-r ${gradient} hover:opacity-90 font-black text-lg`}>
            Sign Up Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
