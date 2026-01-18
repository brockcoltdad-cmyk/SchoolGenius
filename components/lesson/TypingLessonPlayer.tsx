'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Zap, Target, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTypingLesson } from '@/hooks/useTypingLesson';

// Keyboard layout
const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

const HOME_ROW = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

const FINGER_COLORS: Record<string, string> = {
  a: 'bg-pink-400', q: 'bg-pink-400', z: 'bg-pink-400', '1': 'bg-pink-400',
  s: 'bg-orange-400', w: 'bg-orange-400', x: 'bg-orange-400', '2': 'bg-orange-400',
  d: 'bg-yellow-400', e: 'bg-yellow-400', c: 'bg-yellow-400', '3': 'bg-yellow-400',
  f: 'bg-green-400', r: 'bg-green-400', v: 'bg-green-400', t: 'bg-green-400', g: 'bg-green-400', b: 'bg-green-400', '4': 'bg-green-400', '5': 'bg-green-400',
  j: 'bg-green-400', u: 'bg-green-400', m: 'bg-green-400', y: 'bg-green-400', h: 'bg-green-400', n: 'bg-green-400', '6': 'bg-green-400', '7': 'bg-green-400',
  k: 'bg-yellow-400', i: 'bg-yellow-400', ',': 'bg-yellow-400', '8': 'bg-yellow-400',
  l: 'bg-orange-400', o: 'bg-orange-400', '.': 'bg-orange-400', '9': 'bg-orange-400',
  ';': 'bg-pink-400', p: 'bg-pink-400', '/': 'bg-pink-400', '0': 'bg-pink-400',
  ' ': 'bg-purple-400',
};

// Practice texts by phase
const PRACTICE_TEXTS: Record<number, string[]> = {
  1: [ // Home Row
    'asdf jkl;',
    'sad lad fad',
    'add all fall',
    'ask dad sad',
    'flask salad',
  ],
  2: [ // Top Row
    'were you there',
    'type your words',
    'we try our way',
    'quiet puppy',
    'we write poetry',
  ],
  3: [ // Bottom Row
    'come back now',
    'zoom zoom zoom',
    'mix the box',
    'calm and brave',
    'next to me',
  ],
  4: [ // All Letters
    'the quick brown fox',
    'jumps over lazy dog',
    'pack my box with',
    'five dozen jugs',
    'how vexingly quick',
  ],
  5: [ // Speed Building
    'The quick brown fox jumps over the lazy dog.',
    'Pack my box with five dozen liquor jugs.',
    'How vexingly quick daft zebras jump!',
    'The five boxing wizards jump quickly.',
    'Sphinx of black quartz, judge my vow.',
  ],
};

interface TypingLessonPlayerProps {
  kidId: string;
  skillId: string;
  phase?: number; // 1-7 phases
  onComplete: (score: number, wpm: number, accuracy: number) => void;
  onBack: () => void;
}

export default function TypingLessonPlayer({
  kidId,
  skillId,
  phase = 1,
  onComplete,
  onBack
}: TypingLessonPlayerProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // NEW: Fetch practice texts from database (with fallback to hardcoded)
  const { practiceTexts: dbTexts, loading: dbLoading, error: dbError } = useTypingLesson(0);

  // State
  const [currentPhase, setCurrentPhase] = useState<'rules' | 'practice' | 'test' | 'complete'>('rules');
  const [practiceTexts, setPracticeTexts] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [targetText, setTargetText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // WPM targets by grade (we'll determine based on phase)
  const getWpmTarget = (phase: number): number => {
    const targets: Record<number, number> = {
      1: 10,  // Home row
      2: 15,  // Top row
      3: 15,  // Bottom row
      4: 20,  // All letters
      5: 25,  // Speed building
      6: 35,  // Advanced
      7: 50,  // Professional
    };
    return targets[phase] || 15;
  };

  // Initialize practice texts - prefer database, fallback to hardcoded
  useEffect(() => {
    if (dbLoading) return;

    // Try database texts first for this phase
    const dbPhaseTexts = dbTexts[phase] || [];
    if (dbPhaseTexts.length > 0) {
      console.log(`✅ Using DATABASE typing: ${dbPhaseTexts.length} texts (phase ${phase})`);
      setPracticeTexts(dbPhaseTexts);
      setTargetText(dbPhaseTexts[0] || '');
    } else {
      // Fallback to hardcoded
      const texts = PRACTICE_TEXTS[Math.min(phase, 5)] || PRACTICE_TEXTS[4];
      console.log(`⚠️ Using HARDCODED typing: ${texts.length} texts (phase ${phase})`);
      if (dbError) console.log(`   DB Error: ${dbError}`);
      setPracticeTexts(texts);
      setTargetText(texts[0] || '');
    }
  }, [phase, dbTexts, dbLoading, dbError]);

  // Focus input on mount and phase change
  useEffect(() => {
    if (currentPhase === 'practice' || currentPhase === 'test') {
      inputRef.current?.focus();
    }
  }, [currentPhase]);

  // Calculate WPM in real-time
  useEffect(() => {
    if (!startTime || typedText.length === 0) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = typedText.length / 5; // standard: 5 chars = 1 word
    const currentWpm = Math.round(wordsTyped / timeElapsed);
    setWpm(currentWpm > 0 ? currentWpm : 0);
  }, [typedText, startTime]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    setPressedKey(key);

    // Start timer on first keystroke
    if (!startTime && key.length === 1) {
      setStartTime(Date.now());
      startTimeRef.current = Date.now();
    }

    // Clear pressed key after animation
    setTimeout(() => setPressedKey(null), 100);
  }, [startTime]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTyped = e.target.value;
    const expectedChar = targetText[newTyped.length - 1];
    const typedChar = newTyped[newTyped.length - 1];

    // Check for errors
    if (typedChar && typedChar !== expectedChar) {
      setErrors(prev => prev + 1);
    }

    setTypedText(newTyped);
    setTotalChars(prev => prev + 1);

    // Calculate accuracy
    const correctChars = newTyped.split('').filter((char, i) => char === targetText[i]).length;
    const currentAccuracy = Math.round((correctChars / newTyped.length) * 100);
    setAccuracy(currentAccuracy > 0 ? currentAccuracy : 100);

    // Check if text is complete
    if (newTyped.length >= targetText.length) {
      handleTextComplete();
    }
  };

  // Handle text completion
  const handleTextComplete = () => {
    const nextIndex = currentTextIndex + 1;

    if (nextIndex < practiceTexts.length) {
      // Move to next text
      setCurrentTextIndex(nextIndex);
      setTargetText(practiceTexts[nextIndex]);
      setTypedText('');
    } else {
      // All texts complete
      setIsComplete(true);
      setShowResult(true);
      calculateFinalScore();
    }
  };

  // Calculate final score and save
  const calculateFinalScore = async () => {
    const wpmTarget = getWpmTarget(phase);
    const baseCoins = 10;
    const wpmBonus = wpm >= wpmTarget ? 15 : 0;
    const accuracyBonus = accuracy >= 90 ? 10 : accuracy >= 80 ? 5 : 0;
    const totalCoins = baseCoins + wpmBonus + accuracyBonus;

    setCoinsEarned(totalCoins);

    // Save progress to database
    try {
      // Award coins
      await supabase.rpc('add_coins', {
        p_child_id: kidId,
        p_amount: totalCoins,
        p_reason: `Typing lesson phase ${phase} - ${wpm} WPM, ${accuracy}% accuracy`
      });

      // Save typing progress
      await supabase.from('typing_progress').upsert({
        child_id: kidId,
        current_phase: phase,
        best_wpm: wpm,
        best_accuracy: accuracy,
        updated_at: new Date().toISOString()
      }, { onConflict: 'child_id' });

      // Save attempt
      await supabase.from('typing_attempts').insert({
        child_id: kidId,
        phase: phase,
        wpm: wpm,
        accuracy: accuracy,
        errors: errors,
        time_seconds: startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0,
        passed: wpm >= wpmTarget && accuracy >= 80
      });
    } catch (err) {
      console.error('Failed to save typing progress:', err);
    }
  };

  // Reset and try again
  const handleRetry = () => {
    setCurrentTextIndex(0);
    setTargetText(practiceTexts[0] || '');
    setTypedText('');
    setErrors(0);
    setTotalChars(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    setShowResult(false);
    inputRef.current?.focus();
  };

  // Get the next key to type
  const getNextKey = (): string => {
    const nextChar = targetText[typedText.length];
    return nextChar || '';
  };

  // Get highlight keys (current key + home row for reference)
  const getHighlightKeys = (): string[] => {
    const nextKey = getNextKey().toLowerCase();
    if (!nextKey) return HOME_ROW;
    return [nextKey];
  };

  // Render character with color coding
  const renderTargetText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'text-gray-400'; // Not yet typed

      if (index < typedText.length) {
        if (typedText[index] === char) {
          className = 'text-green-500'; // Correct
        } else {
          className = 'text-red-500 bg-red-100'; // Wrong
        }
      } else if (index === typedText.length) {
        className = 'text-blue-600 bg-blue-100 font-bold'; // Current
      }

      return (
        <span key={index} className={`${className} text-2xl font-mono`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  // Phase-specific rules
  const getRulesContent = () => {
    const rules: Record<number, { title: string; description: string; keys: string }> = {
      1: {
        title: 'Home Row Keys',
        description: 'Keep your fingers on the home row. This is where your fingers rest and return to after each keystroke.',
        keys: 'A S D F    J K L ;'
      },
      2: {
        title: 'Top Row Keys',
        description: 'Reach up from the home row to type the top row letters. Return your fingers to home row after each key.',
        keys: 'Q W E R T    Y U I O P'
      },
      3: {
        title: 'Bottom Row Keys',
        description: 'Reach down from the home row to type the bottom row letters. Keep your wrists steady.',
        keys: 'Z X C V B    N M , . /'
      },
      4: {
        title: 'All Letters Practice',
        description: 'Now you know all the letter keys! Practice typing words using all the rows.',
        keys: 'All letter keys'
      },
      5: {
        title: 'Speed Building',
        description: 'Time to build your speed! Try to type faster while keeping accuracy above 80%.',
        keys: 'Full sentences'
      },
    };

    return rules[Math.min(phase, 5)] || rules[4];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{wpm} WPM</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="font-bold">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* RULES PHASE */}
        {currentPhase === 'rules' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              Phase {phase}: {getRulesContent().title}
            </h1>
            <p className="text-white/80 text-lg mb-8">
              {getRulesContent().description}
            </p>

            {/* Visual keyboard showing relevant keys */}
            <div className="mb-8">
              <div className="inline-block bg-gray-800 p-6 rounded-2xl shadow-2xl">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center gap-2 mb-2"
                    style={{ marginLeft: rowIndex * 24 }}
                  >
                    {row.map(key => {
                      const isHomeRow = HOME_ROW.includes(key);
                      const fingerColor = FINGER_COLORS[key] || 'bg-gray-300';

                      return (
                        <div
                          key={key}
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold uppercase
                            ${fingerColor} ${isHomeRow ? 'ring-4 ring-white/50' : ''}
                            shadow-lg transition-transform hover:scale-105
                          `}
                        >
                          {key}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Space bar */}
                <div className="flex justify-center mt-2">
                  <div className="w-72 h-12 bg-purple-400 rounded-xl flex items-center justify-center text-gray-700 font-bold shadow-lg">
                    SPACE
                  </div>
                </div>
              </div>
            </div>

            {/* Finger guide */}
            <div className="flex justify-center gap-6 mb-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-pink-400 rounded" />
                <span>Pinky</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-400 rounded" />
                <span>Ring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-400 rounded" />
                <span>Middle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-400 rounded" />
                <span>Index</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-400 rounded" />
                <span>Thumb</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPhase('practice')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-2xl
                shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105"
            >
              Start Typing!
            </button>
          </motion.div>
        )}

        {/* PRACTICE PHASE */}
        {(currentPhase === 'practice' || currentPhase === 'test') && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress indicator */}
            <div className="flex justify-center gap-2">
              {practiceTexts.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < currentTextIndex
                      ? 'bg-green-500'
                      : i === currentTextIndex
                      ? 'bg-blue-500'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Text display */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
              <p className="text-center mb-4 text-white/60">
                Type the text below:
              </p>
              <div className="bg-gray-900/50 rounded-2xl p-6 mb-6 text-center min-h-[80px]">
                {renderTargetText()}
              </div>

              {/* Hidden input for capturing keystrokes */}
              <input
                ref={inputRef}
                type="text"
                value={typedText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 pointer-events-auto"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {/* Click to focus message */}
              <p className="text-center text-white/40 text-sm mb-4">
                Click anywhere and start typing
              </p>

              {/* Stats bar */}
              <div className="flex justify-center gap-8 text-white/80">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{wpm}</p>
                  <p className="text-sm">WPM</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{accuracy}%</p>
                  <p className="text-sm">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{errors}</p>
                  <p className="text-sm">Errors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {currentTextIndex + 1}/{practiceTexts.length}
                  </p>
                  <p className="text-sm">Progress</p>
                </div>
              </div>
            </div>

            {/* Interactive Keyboard */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
              <div className="flex justify-center">
                <div className="inline-block bg-gray-800 p-4 rounded-2xl shadow-2xl">
                  {KEYBOARD_ROWS.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-center gap-1.5 mb-1.5"
                      style={{ marginLeft: rowIndex * 20 }}
                    >
                      {row.map(key => {
                        const isHighlighted = getHighlightKeys().includes(key);
                        const isHomeRow = HOME_ROW.includes(key);
                        const isPressed = pressedKey === key;
                        const fingerColor = FINGER_COLORS[key] || 'bg-gray-300';

                        return (
                          <motion.div
                            key={key}
                            animate={{
                              scale: isPressed ? 0.85 : 1,
                              y: isPressed ? 2 : 0,
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold uppercase
                              transition-all duration-100
                              ${isHighlighted
                                ? 'bg-blue-500 text-white ring-4 ring-blue-300 shadow-lg shadow-blue-500/50'
                                : fingerColor
                              }
                              ${isHomeRow ? 'border-b-4 border-gray-600' : ''}
                              ${isPressed ? 'shadow-inner' : 'shadow-md'}
                            `}
                          >
                            {key}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Space bar */}
                  <div className="flex justify-center mt-1.5">
                    <motion.div
                      animate={{
                        scale: pressedKey === ' ' ? 0.95 : 1,
                        y: pressedKey === ' ' ? 2 : 0,
                      }}
                      className={`w-64 h-10 rounded-lg flex items-center justify-center font-bold
                        ${getNextKey() === ' '
                          ? 'bg-blue-500 text-white ring-4 ring-blue-300'
                          : 'bg-purple-400 text-gray-700'
                        }
                      `}
                    >
                      SPACE
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Next key hint */}
              <p className="text-center mt-4 text-white/60">
                Next key: <span className="text-blue-400 font-bold text-xl uppercase">
                  {getNextKey() === ' ' ? 'SPACE' : getNextKey() || '-'}
                </span>
              </p>
            </div>
          </motion.div>
        )}

        {/* RESULTS */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center"
          >
            <div className="mb-6">
              {wpm >= getWpmTarget(phase) && accuracy >= 80 ? (
                <>
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Amazing!</h2>
                  <p className="text-white/80">You passed Phase {phase}!</p>
                </>
              ) : (
                <>
                  <Star className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Good Try!</h2>
                  <p className="text-white/80">Keep practicing to improve!</p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-2xl p-4">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{wpm}</p>
                <p className="text-white/60">WPM</p>
                <p className="text-xs text-white/40">Target: {getWpmTarget(phase)}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{accuracy}%</p>
                <p className="text-white/60">Accuracy</p>
                <p className="text-xs text-white/40">Target: 80%</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">+{coinsEarned}</p>
                <p className="text-white/60">Coins</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl
                  hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => onComplete(coinsEarned, wpm, accuracy)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl
                  shadow-lg hover:shadow-green-500/30 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Click overlay to focus input */}
        {(currentPhase === 'practice' || currentPhase === 'test') && !showResult && (
          <div
            className="fixed inset-0 cursor-text"
            onClick={() => inputRef.current?.focus()}
          />
        )}
      </div>
    </div>
  );
}
