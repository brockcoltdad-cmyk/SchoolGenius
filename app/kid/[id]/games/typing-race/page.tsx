'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Star, RotateCcw, Play, Zap, Clock, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import Confetti from '@/components/animations/Confetti';
import { useGames, TYPING_WORDS_BY_GRADE } from '@/hooks/useGames';
import { createClient } from '@/lib/supabase/client';

type GameState = 'ready' | 'countdown' | 'playing' | 'finished';

export default function TypingRaceGame() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const { saveScore, getScore } = useGames(kidId);

  const [grade, setGrade] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [countdown, setCountdown] = useState(3);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [correctWords, setCorrectWords] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentHighScore = getScore('typing-race')?.highScore || 0;
  const gameDuration = 60; // 60 seconds
  const totalWords = 15; // Words to type

  // Load child's grade level
  useEffect(() => {
    async function loadGrade() {
      const supabase = createClient();
      const { data } = await supabase
        .from('children')
        .select('grade_level')
        .eq('id', kidId)
        .single();

      if (data?.grade_level !== undefined) {
        setGrade(Math.max(1, data.grade_level)); // Minimum grade 1 for typing
      }
    }
    loadGrade();
  }, [kidId]);

  // Generate words for the game
  const generateWords = useCallback(() => {
    const gradeWords = TYPING_WORDS_BY_GRADE[grade] || TYPING_WORDS_BY_GRADE[1];
    const shuffled = [...gradeWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalWords);
  }, [grade]);

  // Start countdown
  const startCountdown = () => {
    setWords(generateWords());
    setGameState('countdown');
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start game
  const startGame = () => {
    setGameState('playing');
    setCurrentWordIndex(0);
    setUserInput('');
    setCorrectWords(0);
    setErrors(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);

    inputRef.current?.focus();

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        if (newTime >= gameDuration) {
          endGame();
          return gameDuration;
        }
        return newTime;
      });
    }, 1000);
  };

  // End game
  const endGame = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('finished');

    // Calculate final WPM
    const timeInMinutes = Math.max(elapsedTime / 60, 0.1);
    const finalWpm = Math.round(correctWords / timeInMinutes);
    setWpm(finalWpm);

    // Calculate accuracy
    const totalAttempts = correctWords + errors;
    const finalAccuracy = totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 100;
    setAccuracy(finalAccuracy);

    // Score = WPM (capped at 100 for reasonable kids scores)
    const score = Math.min(finalWpm, 100);

    const result = await saveScore('typing-race', score);
    setEarnedCoins(result.coins);
    setIsHighScore(result.isHighScore);

    if (result.isHighScore) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [correctWords, errors, elapsedTime, saveScore]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // Check if word is complete (space pressed or exact match)
    if (value.endsWith(' ') || value === words[currentWordIndex]) {
      const typedWord = value.trim();
      const targetWord = words[currentWordIndex];

      if (typedWord === targetWord) {
        setCorrectWords(c => c + 1);
      } else {
        setErrors(e => e + 1);
      }

      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(i => i + 1);
        setUserInput('');
      } else {
        // All words typed
        endGame();
      }
    }
  };

  // Update WPM in real-time
  useEffect(() => {
    if (gameState === 'playing' && elapsedTime > 0) {
      const timeInMinutes = elapsedTime / 60;
      setWpm(Math.round(correctWords / timeInMinutes));
    }
  }, [correctWords, elapsedTime, gameState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Get character status for display
  const getCharStatus = (charIndex: number): 'correct' | 'incorrect' | 'pending' => {
    if (charIndex >= userInput.length) return 'pending';
    const targetWord = words[currentWordIndex];
    if (charIndex >= targetWord.length) return 'incorrect';
    return userInput[charIndex] === targetWord[charIndex] ? 'correct' : 'incorrect';
  };

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />
        {showConfetti && <Confetti active={true} />}

        <div className="min-h-screen relative z-10 pb-24">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl sticky top-0 z-20">
            <div className="mx-auto max-w-4xl px-4 py-4">
              <div className="flex items-center justify-between">
                <Link
                  href={`/kid/${kidId}/games`}
                  className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Games
                </Link>

                {gameState === 'playing' && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">{gameDuration - elapsedTime}s</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Zap className="h-4 w-4" />
                      <span className="font-bold">{wpm} WPM</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-4 py-8">
            {/* READY STATE */}
            {gameState === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Card className={`${currentTheme.cardClass} p-8`}>
                  <div className="text-8xl mb-6">🏎️</div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                    Typing Race
                  </h1>
                  <p className="text-white/70 mb-6">
                    Type the words as fast as you can!<br />
                    Press space after each word. You have 60 seconds.
                  </p>

                  {currentHighScore > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400">
                      <Trophy className="h-5 w-5" />
                      <span>Best WPM: {currentHighScore}</span>
                    </div>
                  )}

                  <div className="mb-6 p-4 bg-white/10 rounded-xl">
                    <p className="text-sm text-white/60 mb-2">Grade {grade} Words</p>
                    <p className="text-white text-sm">
                      {(TYPING_WORDS_BY_GRADE[grade] || []).slice(0, 5).join(' • ')}...
                    </p>
                  </div>

                  <Button
                    onClick={startCountdown}
                    size="lg"
                    className="text-lg px-8 py-6"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Race
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* COUNTDOWN STATE */}
            {gameState === 'countdown' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Card className={`${currentTheme.cardClass} p-16`}>
                  <motion.div
                    key={countdown}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="text-9xl font-bold text-white"
                  >
                    {countdown}
                  </motion.div>
                  <p className="text-white/70 mt-4">Get ready...</p>
                </Card>
              </motion.div>
            )}

            {/* PLAYING STATE */}
            {gameState === 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Stats */}
                <div className="flex justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{correctWords}</div>
                    <div className="text-white/50 text-sm">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">{errors}</div>
                    <div className="text-white/50 text-sm">Errors</div>
                  </div>
                </div>

                {/* Words Display */}
                <Card className={`${currentTheme.cardClass} p-8 mb-4`}>
                  <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {words.map((word, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-lg text-lg font-mono transition-colors ${
                          i < currentWordIndex
                            ? 'bg-green-500/20 text-green-400'
                            : i === currentWordIndex
                            ? 'bg-white/20 text-white ring-2 ring-white/50'
                            : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {i === currentWordIndex ? (
                          // Show character-by-character feedback
                          word.split('').map((char, charIndex) => {
                            const status = getCharStatus(charIndex);
                            return (
                              <span
                                key={charIndex}
                                className={
                                  status === 'correct' ? 'text-green-400' :
                                  status === 'incorrect' ? 'text-red-400 bg-red-400/20' :
                                  'text-white'
                                }
                              >
                                {char}
                              </span>
                            );
                          })
                        ) : word}
                      </span>
                    ))}
                  </div>

                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Start typing..."
                    className="w-full p-4 text-2xl text-center bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 font-mono"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </Card>

                {/* Timer Bar */}
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      width: `${((gameDuration - elapsedTime) / gameDuration) * 100}%`
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* FINISHED STATE */}
            {gameState === 'finished' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className={`${currentTheme.cardClass} p-8`}>
                  {isHighScore ? (
                    <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
                  ) : wpm >= 30 ? (
                    <Star className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
                  ) : (
                    <span className="text-8xl block mb-4">🏎️</span>
                  )}

                  <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {isHighScore ? 'New Record!' : wpm >= 30 ? 'Great Speed!' : 'Good Effort!'}
                  </h2>

                  <div className="inline-flex items-center gap-6 bg-white/10 rounded-2xl p-6 mb-8 flex-wrap justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{wpm}</p>
                      <p className="text-white/60">WPM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{correctWords}</p>
                      <p className="text-white/60">Words</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{accuracy}%</p>
                      <p className="text-white/60">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-yellow-400">+{earnedCoins}</p>
                      <p className="text-white/60">Coins</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => {
                        setGameState('ready');
                        setCorrectWords(0);
                        setErrors(0);
                        setWpm(0);
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Race Again
                    </Button>
                    <Link href={`/kid/${kidId}/games`}>
                      <Button
                        style={{
                          background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                        }}
                      >
                        Back to Games
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )}
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
