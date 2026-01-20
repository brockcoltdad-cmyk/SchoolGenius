'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Sparkles, Star, ArrowRight, Zap, Trophy, Target, CheckCircle2, ChevronRight, Menu, X, Calculator, Book, SpellCheck2, Keyboard, Code, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

const themes = [
  {
    id: 'fortnite',
    name: 'Battle Royale',
    emoji: '🎮',
    description: 'Drop in and conquer',
    gradient: 'from-purple-600 via-pink-600 to-purple-600',
    playerEmoji: '🎮',
    level: 45,
    currency: 2850,
    streak: 18,
    ranking: 127,
    stat1: 342,
    stat2: 1289,
    stat3: 891,
    currentXP: 2400,
    maxXP: 3000,
  },
  {
    id: 'minecraft',
    name: 'Block Builder',
    emoji: '⛏️',
    description: 'Mine and craft knowledge',
    gradient: 'from-emerald-600 via-green-600 to-emerald-600',
    playerEmoji: '⛏️',
    level: 38,
    currency: 3421,
    streak: 22,
    ranking: 34,
    stat1: 1567,
    stat2: 234,
    stat3: 8912,
    currentXP: 2500,
    maxXP: 3000,
  },
  {
    id: 'zombie',
    name: 'Zombie Survival',
    emoji: '🧟',
    description: 'Survive and thrive',
    gradient: 'from-green-600 via-lime-600 to-green-600',
    playerEmoji: '🧟',
    level: 29,
    currency: 1876,
    streak: 21,
    ranking: 83,
    stat1: 2341,
    stat2: 156,
    stat3: 67,
    currentXP: 1950,
    maxXP: 2500,
  },
  {
    id: 'pirate',
    name: 'Pirate Adventure',
    emoji: '🏴‍☠️',
    description: 'Sail the seven seas',
    gradient: 'from-blue-600 via-cyan-600 to-blue-600',
    playerEmoji: '🏴‍☠️',
    level: 31,
    currency: 3421,
    streak: 15,
    ranking: 56,
    stat1: 789,
    stat2: 42,
    stat3: 128,
    currentXP: 2100,
    maxXP: 2800,
  },
  {
    id: 'wwe',
    name: 'Wrestling Champ',
    emoji: '💪',
    description: 'Become a champion',
    gradient: 'from-yellow-600 via-red-600 to-yellow-600',
    playerEmoji: '💪',
    level: 23,
    currency: 1247,
    streak: 12,
    ranking: 47,
    stat1: 8,
    stat2: 156,
    stat3: 234,
    currentXP: 1800,
    maxXP: 2500,
  },
  {
    id: 'anime',
    name: 'Ninja Training',
    emoji: '⚡',
    description: 'Master your powers',
    gradient: 'from-pink-600 via-purple-600 to-pink-600',
    playerEmoji: '⚡',
    level: 52,
    currency: 4567,
    streak: 28,
    ranking: 23,
    stat1: 9001,
    stat2: 567,
    stat3: 3421,
    currentXP: 2800,
    maxXP: 3200,
  },
];

const subjects = [
  {
    name: 'Mathematics',
    icon: Calculator,
    color: 'blue',
    gradients: {
      bg: 'from-blue-600/20 to-cyan-600/20',
      border: 'border-blue-500',
      text: 'text-blue-400'
    },
    examples: [
      {
        title: 'Kindergarten: Count the Objects',
        visual: (
          <div className="flex flex-wrap gap-3 justify-center">
            {['🍎', '🍎', '🍎', '🍎', '🍎'].map((emoji, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-4xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        ),
        code: <div className="text-4xl font-black text-blue-400">1 + 1 + 1 + 1 + 1 = 5</div>
      },
      {
        title: '3rd Grade: Multiplication Mastery',
        visual: (
          <div className="grid grid-cols-4 gap-2">
            {Array(12).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-10 w-10 bg-blue-500/30 border-2 border-blue-400 rounded-lg flex items-center justify-center text-blue-300 font-bold"
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        ),
        code: <div className="text-3xl font-black text-blue-400">3 × 4 = 12</div>
      },
      {
        title: '8th Grade: Algebra Challenge',
        visual: (
          <div className="space-y-3">
            <div className="text-2xl font-mono text-blue-300">2x + 5 = 13</div>
            <div className="text-xl text-blue-400">2x = 13 - 5</div>
            <div className="text-xl text-blue-400">2x = 8</div>
            <div className="text-2xl font-black text-blue-500">x = 4</div>
          </div>
        ),
        code: <div className="text-3xl font-black text-blue-400">Solve: 2x + 5 = 13</div>
      },
      {
        title: '12th Grade: Calculus Limits',
        visual: (
          <div className="space-y-2">
            <div className="text-3xl font-mono text-blue-300">
              lim<sub className="text-lg">x→2</sub> (x² - 4) / (x - 2)
            </div>
            <div className="text-xl text-blue-400 font-mono">= lim<sub>x→2</sub> (x + 2)(x - 2) / (x - 2)</div>
            <div className="text-2xl font-black text-blue-500">= 4</div>
          </div>
        ),
        code: <div className="text-2xl font-mono text-blue-400">lim<sub>x→2</sub> (x² - 4)/(x - 2) = 4</div>
      }
    ]
  },
  {
    name: 'Reading',
    icon: Book,
    color: 'green',
    gradients: {
      bg: 'from-green-600/20 to-emerald-600/20',
      border: 'border-green-500',
      text: 'text-green-400'
    },
    examples: [
      {
        title: 'K-1st: Phonics & Sight Words',
        visual: (
          <div className="space-y-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl font-black text-green-400"
            >
              CAT
            </motion.div>
            <div className="flex gap-2 justify-center">
              {['C', 'A', 'T'].map((letter, i) => (
                <div key={i} className="px-4 py-2 bg-green-500/30 border-2 border-green-400 rounded-lg text-2xl font-bold text-green-300">
                  {letter}
                </div>
              ))}
            </div>
          </div>
        ),
        code: <div className="text-3xl font-black text-green-400">🐱 C-A-T spells CAT!</div>
      },
      {
        title: '3rd-5th: Story Comprehension',
        visual: (
          <div className="text-left space-y-2 px-4">
            <p className="text-green-300 leading-relaxed">
              &quot;The curious fox wandered through the moonlit forest, searching for adventure...&quot;
            </p>
            <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" /> Lexile Level: 650L
            </div>
          </div>
        ),
        code: <div className="text-2xl font-black text-green-400">Read & Answer Questions</div>
      },
      {
        title: '6th-8th: Literary Analysis',
        visual: (
          <div className="text-left space-y-2 px-4">
            <p className="text-green-300 italic text-sm">
              &quot;To be, or not to be, that is the question...&quot;
            </p>
            <div className="text-green-400 font-bold text-xs">Analyze: Theme, Metaphor, Character</div>
          </div>
        ),
        code: <div className="text-2xl font-black text-green-400">Shakespeare Analysis</div>
      },
      {
        title: '9th-12th: Advanced Literature',
        visual: (
          <div className="text-left space-y-2 px-4">
            <p className="text-green-300 text-sm">
              Analyze symbolism, narrative structure, and thematic elements in classic literature
            </p>
            <div className="text-green-400 font-bold text-xs">Essay Writing • Critical Thinking</div>
          </div>
        ),
        code: <div className="text-2xl font-black text-green-400">Write Literary Essays</div>
      }
    ]
  },
  {
    name: 'Spelling',
    icon: SpellCheck2,
    color: 'pink',
    gradients: {
      bg: 'from-pink-600/20 to-rose-600/20',
      border: 'border-pink-500',
      text: 'text-pink-400'
    },
    examples: [
      {
        title: 'K-1st: Letter Sounds',
        visual: (
          <div className="space-y-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl"
            >
              🔊
            </motion.div>
            <div className="text-4xl font-black text-pink-400">B</div>
            <div className="text-pink-300">Sound: /b/ (ball)</div>
          </div>
        ),
        code: <div className="text-3xl font-black text-pink-400">Listen → Type the Letter</div>
      },
      {
        title: '2nd-3rd: Word Patterns',
        visual: (
          <div className="space-y-3">
            <div className="text-3xl font-black text-pink-400">magic E</div>
            <div className="space-y-1 text-pink-300">
              <div>cap → cape</div>
              <div>mad → made</div>
              <div>hop → hope</div>
            </div>
          </div>
        ),
        code: <div className="text-2xl font-black text-pink-400">Silent E Rule Pattern</div>
      },
      {
        title: '4th-5th: Complex Words',
        visual: (
          <div className="space-y-2">
            <div className="text-2xl font-black text-pink-400">unnecessary</div>
            <div className="text-pink-300 text-sm">un-nec-es-sar-y</div>
            <div className="flex gap-1 justify-center flex-wrap">
              {['un', 'nec', 'es', 'sar', 'y'].map((part, i) => (
                <div key={i} className="px-2 py-1 bg-pink-500/30 border border-pink-400 rounded text-pink-300 text-xs">
                  {part}
                </div>
              ))}
            </div>
          </div>
        ),
        code: <div className="text-2xl font-black text-pink-400">Hear → Spell Correctly</div>
      },
      {
        title: '6th-8th: Advanced Vocabulary',
        visual: (
          <div className="space-y-2">
            <div className="text-2xl font-black text-pink-400">accommodate</div>
            <div className="text-pink-300 text-sm">Two C&apos;s, Two M&apos;s!</div>
            <div className="text-pink-400 text-xs italic">verb: to provide lodging or space</div>
          </div>
        ),
        code: <div className="text-xl font-black text-pink-400">Master Tricky Spellings</div>
      }
    ]
  },
  {
    name: 'Typing',
    icon: Keyboard,
    color: 'cyan',
    gradients: {
      bg: 'from-cyan-600/20 to-blue-600/20',
      border: 'border-cyan-500',
      text: 'text-cyan-400'
    },
    examples: [
      {
        title: 'K-2nd: Home Row Basics',
        visual: (
          <div className="space-y-3">
            <div className="flex gap-1 justify-center">
              {['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'].map((key, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ delay: i * 0.1, duration: 1.5, repeat: Infinity }}
                  className="h-10 w-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-cyan-300 font-bold"
                >
                  {key}
                </motion.div>
              ))}
            </div>
            <div className="text-cyan-400 text-sm">Home Row Position</div>
          </div>
        ),
        code: <div className="text-2xl font-black text-cyan-400">Learn Keyboard Layout</div>
      },
      {
        title: '3rd-5th: Speed Building',
        visual: (
          <div className="space-y-3">
            <div className="text-cyan-300 font-mono">The quick brown fox jumps...</div>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400">25</div>
                <div className="text-xs text-cyan-300">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400">95%</div>
                <div className="text-xs text-cyan-300">Accuracy</div>
              </div>
            </div>
          </div>
        ),
        code: <div className="text-2xl font-black text-cyan-400">Increase Speed & Accuracy</div>
      },
      {
        title: '6th-8th: Touch Typing',
        visual: (
          <div className="space-y-2">
            <div className="font-mono text-cyan-300 text-sm">
              Type without looking at keys!
            </div>
            <div className="flex gap-3 justify-center">
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-400">45</div>
                <div className="text-xs text-cyan-300">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-400">98%</div>
                <div className="text-xs text-cyan-300">Accuracy</div>
              </div>
            </div>
          </div>
        ),
        code: <div className="text-xl font-black text-cyan-400">Master Touch Typing</div>
      },
      {
        title: '9th-12th: Professional Skills',
        visual: (
          <div className="space-y-2">
            <div className="font-mono text-cyan-300 text-xs">
              Professional typing for essays, emails, code
            </div>
            <div className="flex gap-3 justify-center">
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-400">70+</div>
                <div className="text-xs text-cyan-300">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-400">99%</div>
                <div className="text-xs text-cyan-300">Accuracy</div>
              </div>
            </div>
          </div>
        ),
        code: <div className="text-xl font-black text-cyan-400">Career-Ready Typing</div>
      }
    ]
  },
  {
    name: 'Coding',
    icon: Code,
    color: 'yellow',
    gradients: {
      bg: 'from-yellow-600/20 to-amber-600/20',
      border: 'border-yellow-500',
      text: 'text-yellow-400'
    },
    examples: [
      {
        title: 'K-2nd: Sequencing',
        visual: (
          <div className="space-y-2">
            <div className="flex gap-2 justify-center">
              {['1️⃣', '2️⃣', '3️⃣', '4️⃣'].map((emoji, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ delay: i * 0.2, duration: 1, repeat: Infinity }}
                  className="text-3xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
            <div className="text-yellow-400 text-sm">Put steps in order!</div>
          </div>
        ),
        code: (
          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 font-mono text-xs text-left">
            <div className="text-yellow-400">move forward</div>
            <div className="text-yellow-400">turn right</div>
            <div className="text-yellow-400">move forward</div>
          </div>
        )
      },
      {
        title: '3rd-5th: Loops & Patterns',
        visual: (
          <div className="space-y-2">
            <div className="text-yellow-400 text-sm">Draw a square!</div>
            <div className="h-16 w-16 border-4 border-yellow-400 mx-auto"></div>
          </div>
        ),
        code: (
          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 font-mono text-xs text-left">
            <div className="text-purple-400">repeat</div>
            <div className="text-yellow-400 ml-4">move 50</div>
            <div className="text-yellow-400 ml-4">turn 90°</div>
            <div className="text-purple-400">4 times</div>
          </div>
        )
      },
      {
        title: '6th-8th: Real JavaScript',
        visual: (
          <div className="space-y-1">
            <div className="text-yellow-400 text-sm">Variables & Functions</div>
            <div className="h-12 w-12 bg-yellow-500/30 rounded mx-auto flex items-center justify-center text-yellow-400 font-bold">42</div>
          </div>
        ),
        code: (
          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 font-mono text-xs text-left">
            <div><span className="text-purple-400">let</span> <span className="text-blue-400">score</span> = <span className="text-green-400">0</span>;</div>
            <div><span className="text-purple-400">function</span> <span className="text-yellow-400">addPoints</span>() {'{'}</div>
            <div className="ml-4"><span className="text-blue-400">score</span> += <span className="text-green-400">10</span>;</div>
            <div>{'}'}</div>
          </div>
        )
      },
      {
        title: '9th-12th: Python & Algorithms',
        visual: (
          <div className="space-y-1">
            <div className="text-yellow-400 text-sm">Real Programming</div>
            <div className="text-yellow-300 font-mono text-xs">Lists, Loops, Functions</div>
          </div>
        ),
        code: (
          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 font-mono text-xs text-left">
            <div><span className="text-purple-400">def</span> <span className="text-yellow-400">factorial</span>(n):</div>
            <div className="ml-4"><span className="text-purple-400">if</span> n == <span className="text-green-400">1</span>:</div>
            <div className="ml-8"><span className="text-purple-400">return</span> <span className="text-green-400">1</span></div>
            <div className="ml-4"><span className="text-purple-400">return</span> n * factorial(n-<span className="text-green-400">1</span>)</div>
          </div>
        )
      }
    ]
  },
  {
    name: 'Language Arts',
    icon: PenTool,
    color: 'orange',
    gradients: {
      bg: 'from-orange-600/20 to-amber-600/20',
      border: 'border-orange-500',
      text: 'text-orange-400'
    },
    examples: [
      {
        title: 'K-1st: Sentence Building',
        visual: (
          <div className="space-y-2">
            <div className="flex gap-2 justify-center flex-wrap">
              {['The', 'cat', 'sat', '.'].map((word, i) => (
                <div key={i} className="px-3 py-1 bg-orange-500/30 border-2 border-orange-400 rounded text-orange-300 font-bold">
                  {word}
                </div>
              ))}
            </div>
          </div>
        ),
        code: <div className="text-2xl font-black text-orange-400">Build Simple Sentences</div>
      },
      {
        title: '2nd-4th: Parts of Speech',
        visual: (
          <div className="space-y-2 text-sm">
            <div className="text-orange-300">
              <span className="text-blue-400 font-bold">The dog</span>{' '}
              <span className="text-green-400 font-bold">ran</span>{' '}
              <span className="text-purple-400 font-bold">quickly</span>
            </div>
            <div className="flex gap-2 justify-center text-xs">
              <div className="text-blue-400">noun</div>
              <div className="text-green-400">verb</div>
              <div className="text-purple-400">adverb</div>
            </div>
          </div>
        ),
        code: <div className="text-xl font-black text-orange-400">Identify Grammar Parts</div>
      },
      {
        title: '5th-8th: Paragraph Writing',
        visual: (
          <div className="space-y-1 text-left px-4">
            <div className="text-orange-400 font-bold text-xs">Topic Sentence</div>
            <div className="text-orange-300 text-xs leading-relaxed">
              Supporting details with proper structure, transitions, and conclusion.
            </div>
          </div>
        ),
        code: <div className="text-xl font-black text-orange-400">Write Structured Essays</div>
      },
      {
        title: '9th-12th: Advanced Writing',
        visual: (
          <div className="space-y-1 text-left px-4">
            <div className="text-orange-400 font-bold text-xs">Thesis • Arguments • Evidence</div>
            <div className="text-orange-300 text-xs">
              College-level essays with proper citations
            </div>
          </div>
        ),
        code: <div className="text-lg font-black text-orange-400">Master Academic Writing</div>
      }
    ]
  }
];

function SubjectShowcase({ currentTheme }: { currentTheme: typeof themes[0] }) {
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => {
        const nextExample = (prev + 1) % subjects[currentSubject].examples.length;
        if (nextExample === 0) {
          setCurrentSubject((prevSubject) => (prevSubject + 1) % subjects.length);
        }
        return nextExample;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [currentSubject]);

  const subject = subjects[currentSubject];
  const example = subject.examples[currentExample];
  const Icon = subject.icon;

  return (
    <div className="relative z-30 bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            What Your Child Will Learn
          </h2>
          <p className="text-xl text-gray-400">Interactive lessons from K-12 across all subjects</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-black text-white mb-6"
            >
              All 6 Subjects:
            </motion.div>
            {subjects.map((subj, idx) => {
              const SubjIcon = subj.icon;
              const isActive = idx === currentSubject;
              return (
                <motion.button
                  key={subj.name}
                  onClick={() => {
                    setCurrentSubject(idx);
                    setCurrentExample(0);
                  }}
                  whileHover={{ x: 10 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${subj.gradients.bg} ${subj.gradients.border} border-4`
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isActive ? `bg-${subj.color}-500/20` : 'bg-gray-800'}`}>
                    <SubjIcon className={`h-6 w-6 ${isActive ? subj.gradients.text : 'text-gray-500'}`} />
                  </div>
                  <div className="text-left">
                    <div className={`font-black text-lg ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {subj.name}
                    </div>
                    <div className="text-xs text-gray-500">K-{subj.name === 'Spelling' ? '8th' : '12th'} Grade</div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeSubject"
                      className="ml-auto"
                    >
                      <ChevronRight className={`h-6 w-6 ${subj.gradients.text}`} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSubject}-${currentExample}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`bg-gradient-to-br ${subject.gradients.bg} backdrop-blur-xl rounded-3xl p-8 border-4 ${subject.gradients.border} shadow-2xl min-h-[500px] flex flex-col`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-${subject.color}-500/30`}>
                  <Icon className={`h-8 w-8 ${subject.gradients.text}`} />
                </div>
                <div>
                  <div className={`text-2xl font-black ${subject.gradients.text}`}>
                    {subject.name}
                  </div>
                  <div className="text-sm text-gray-400">{example.title}</div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/10"
                >
                  {example.visual}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/10"
                >
                  {example.code}
                </motion.div>
              </div>

              <div className="flex gap-2 justify-center">
                {subject.examples.map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: idx === currentExample ? 1.2 : 1,
                      opacity: idx === currentExample ? 1 : 0.3
                    }}
                    className={`h-2 rounded-full ${
                      idx === currentExample ? `w-8 bg-${subject.color}-400` : `w-2 bg-gray-600`
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentTheme.gradient} text-white font-black text-xl px-8 py-4 rounded-full shadow-2xl border-4 border-white/20`}
            >
              <Sparkles className="h-6 w-6" />
              Start Learning Now
              <ArrowRight className="h-6 w-6" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('schoolgenius-theme');
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (index >= 0 && index < themes.length) {
        setSelectedTheme(index);
      }
    }
  }, []);

  const currentTheme = themes[selectedTheme];
  const config = themeDashboardConfigs[currentTheme.id];

  const handleThemeChange = (index: number) => {
    if (index === selectedTheme) return;
    setIsChanging(true);
    // Save to localStorage
    localStorage.setItem('schoolgenius-theme', index.toString());
    setTimeout(() => {
      setSelectedTheme(index);
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Compact Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50"
              >
                <Brain className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <div className="text-xl font-black text-white">School Genius</div>
                <div className="text-[10px] text-gray-400 font-semibold">AI-Powered Learning</div>
              </div>
            </Link>

            {/* Compact Theme Selector */}
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-bold mr-2">Pick Your Theme:</span>
              <div className="flex items-center gap-2">
                {themes.map((theme, index) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeChange(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative h-10 w-10 rounded-lg font-black text-xl transition-all ${
                      selectedTheme === index
                        ? `bg-gradient-to-r ${theme.gradient} shadow-lg border-2 border-white/50`
                        : 'bg-gray-800/50 hover:bg-gray-700/50 border-2 border-gray-700'
                    }`}
                  >
                    {theme.emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-400 font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold shadow-lg shadow-blue-500/50">
                  Start Free
                  <Sparkles className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MASSIVE Hero Section */}
      <div className="pt-[72px] min-h-[85vh] flex items-center relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentTheme.gradient.includes('purple') ? 'rgba(168,85,247,0.4)' : 'rgba(59,130,246,0.4)'}, transparent)`,
            backgroundSize: '200% 200%',
          }}
        />

        <div className="mx-auto max-w-7xl px-6 py-16 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT COLUMN - Value Prop */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Theme Badge */}
              <motion.div
                key={selectedTheme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 mb-6 bg-black/60 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-white/10"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  {currentTheme.emoji}
                </motion.div>
                <div>
                  <div className={`text-xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                    {currentTheme.name}
                  </div>
                  <div className="text-gray-400 text-xs font-semibold">{currentTheme.description}</div>
                </div>
              </motion.div>

              {/* HUGE Headline */}
              <motion.h1
                key={`headline-${selectedTheme}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6"
              >
                Personalized
                <br />
                <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                  AI Learning
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-gray-300 leading-relaxed mb-8 font-medium"
              >
                <Zap className="inline h-7 w-7 text-yellow-400 mr-2" />
                Learning that <span className="text-white font-bold">adapts in real-time</span> to your child—wrapped in themes they absolutely love.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <div className="flex items-center gap-2 bg-blue-600/20 border-2 border-blue-500/50 rounded-full px-5 py-3 backdrop-blur-xl">
                  <Trophy className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-bold">Progress Tracking</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-600/20 border-2 border-purple-500/50 rounded-full px-5 py-3 backdrop-blur-xl">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-bold">Adaptive Difficulty</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-600/20 border-2 border-yellow-500/50 rounded-full px-5 py-3 backdrop-blur-xl">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-bold">Engaging Rewards</span>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-2xl px-10 py-6 rounded-full shadow-2xl border-4 border-white/20"
                  >
                    <Sparkles className="h-7 w-7" />
                    Start Your Free Trial Now
                    <ArrowRight className="h-7 w-7" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN - Why This Works */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              key={`why-${selectedTheme}`}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 border-4 border-white/10 shadow-2xl"
              >
                <div className={`text-5xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent mb-6`}>
                  Why This Works
                </div>

                <p className="text-white text-xl leading-relaxed mb-8 font-medium">
                  Our AI <span className="text-cyan-400 font-bold">analyzes learning patterns in real-time</span> and adjusts difficulty automatically.
                  Every lesson, quiz, and challenge is personalized—while your child thinks they&apos;re just playing!
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-bold text-lg">Scan Your School Syllabus</div>
                      <div className="text-gray-400">Upload your school&apos;s syllabus and we automatically build lessons to match</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-bold text-lg">Homework Help with AI</div>
                      <div className="text-gray-400">Scan homework to get instant help and build personalized lessons</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-bold text-lg">Real-Time Adaptation</div>
                      <div className="text-gray-400">Instantly adjusts to your child&apos;s skill level and progress</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-white font-bold text-lg">Engagement Through Themes</div>
                      <div className="text-gray-400">Kids stay motivated with their favorite worlds</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  <span className="text-sm font-bold text-blue-400">Powered by Advanced AI Technology</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="relative z-30 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className={`text-4xl font-black bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent mb-2`}>
              See It In Action
            </h2>
            <p className="text-gray-400 text-lg mb-8">Interactive preview of your child&apos;s dashboard</p>

            {/* Big Theme Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-white font-bold text-xl mb-6">Pick a Theme to See the Interaction:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {themes.map((theme, index) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeChange(index)}
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
                        layoutId="selectedPreviewTheme"
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10">
                      <motion.div
                        animate={selectedTheme === index ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 2, repeat: selectedTheme === index ? Infinity : 0 }}
                        className="text-6xl mb-3"
                      >
                        {theme.emoji}
                      </motion.div>
                      <div className={`text-lg font-black ${selectedTheme === index ? 'text-white' : 'text-gray-400'}`}>
                        {theme.name}
                      </div>
                      <div className={`text-xs mt-1 ${selectedTheme === index ? 'text-white/80' : 'text-gray-500'}`}>
                        {theme.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTheme}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: isChanging ? 0.5 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <DashboardTemplate
              themeId={currentTheme.id}
              colors={config.colors}
              content={config.content}
              subjects={config.subjects}
              bottomNav={config.bottomNav}
              playerName="YOUR CHILD"
              playerEmoji={currentTheme.playerEmoji}
              level={currentTheme.level}
              currency={currentTheme.currency}
              streak={currentTheme.streak}
              ranking={currentTheme.ranking}
              stat1Value={currentTheme.stat1}
              stat2Value={currentTheme.stat2}
              stat3Value={currentTheme.stat3}
              currentXP={currentTheme.currentXP}
              maxXP={currentTheme.maxXP}
              leaderboardLink="/signup"
              kidId="demo"
              previewMode={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Subject Showcase */}
      <SubjectShowcase currentTheme={currentTheme} />

      {/* Slide-out Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-b from-gray-900 to-black border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>

                <h3 className="text-3xl font-black text-white mb-6">More Details</h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                      <Target className="h-5 w-5" />
                      How It Works
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Our AI engine continuously monitors your child&apos;s progress, identifying strengths and areas for improvement.
                      It then generates personalized content that challenges them at just the right level.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                      <Brain className="h-5 w-5" />
                      Adaptive Learning
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Every question answered, every lesson completed feeds into our learning model.
                      The system adapts in real-time, ensuring optimal difficulty and engagement.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                      <Star className="h-5 w-5" />
                      Engagement Through Gamification
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Kids earn rewards, level up, and compete on leaderboards—all while mastering academic concepts.
                      Learning becomes an adventure they look forward to every day.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <Link href="/signup">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold py-6">
                        Get Started Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Sidebar Toggle */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setSidebarOpen(true)}
        className="fixed top-32 right-0 bg-gradient-to-l from-blue-600 to-cyan-600 text-white font-bold px-4 py-6 rounded-l-xl shadow-2xl z-40 hover:px-6 transition-all"
      >
        <Menu className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
