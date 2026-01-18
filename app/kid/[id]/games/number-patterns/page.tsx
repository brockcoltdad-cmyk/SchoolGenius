'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Star, RotateCcw, Play, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import Confetti from '@/components/animations/Confetti';
import { useGames } from '@/hooks/useGames';
import { createClient } from '@/lib/supabase/client';

type GameState = 'ready' | 'playing' | 'feedback' | 'finished';

interface Pattern {
  numbers: number[];
  answer: number;
  rule: string;
}

function generatePattern(grade: number): Pattern {
  const patterns: (() => Pattern)[] = [];

  // Add by constant (all grades)
  patterns.push(() => {
    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * (grade + 3)) + 1;
    const numbers = [start, start + step, start + step * 2, start + step * 3];
    return { numbers, answer: start + step * 4, rule: `Add ${step}` };
  });

  // Subtract by constant (grade 1+)
  if (grade >= 1) {
    patterns.push(() => {
      const start = Math.floor(Math.random() * 20) + 30;
      const step = Math.floor(Math.random() * (grade + 2)) + 1;
      const numbers = [start, start - step, start - step * 2, start - step * 3];
      return { numbers, answer: start - step * 4, rule: `Subtract ${step}` };
    });
  }

  // Multiply by 2 (grade 2+)
  if (grade >= 2) {
    patterns.push(() => {
      const start = Math.floor(Math.random() * 3) + 1;
      const numbers = [start, start * 2, start * 4, start * 8];
      return { numbers, answer: start * 16, rule: 'Multiply by 2' };
    });
  }

  // Skip counting by 5s or 10s (grade 1+)
  if (grade >= 1) {
    patterns.push(() => {
      const step = Math.random() > 0.5 ? 5 : 10;
      const start = step;
      const numbers = [start, start + step, start + step * 2, start + step * 3];
      return { numbers, answer: start + step * 4, rule: `Count by ${step}s` };
    });
  }

  // Squares (grade 3+)
  if (grade >= 3) {
    patterns.push(() => {
      const numbers = [1, 4, 9, 16];
      return { numbers, answer: 25, rule: 'Square numbers' };
    });
  }

  // Fibonacci-like (grade 4+)
  if (grade >= 4) {
    patterns.push(() => {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const numbers = [a, b, a + b, b + (a + b)];
      return { numbers, answer: (a + b) + (b + (a + b)), rule: 'Add previous two' };
    });
  }

  const patternFn = patterns[Math.floor(Math.random() * patterns.length)];
  return patternFn();
}

function generateChoices(correctAnswer: number): number[] {
  const choices = new Set<number>([correctAnswer]);

  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrongAnswer = correctAnswer + offset;
    if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
      choices.add(wrongAnswer);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}

export default function NumberPatternsGame() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const { saveScore, getScore } = useGames(kidId);

  const [grade, setGrade] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentRound, setCurrentRound] = useState(0);
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentHighScore = getScore('number-patterns')?.highScore || 0;
  const totalRounds = 10;

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
        setGrade(Math.max(1, data.grade_level));
      }
    }
    loadGrade();
  }, [kidId]);

  // Generate new pattern
  const nextPattern = useCallback(() => {
    const newPattern = generatePattern(grade);
    setPattern(newPattern);
    setChoices(generateChoices(newPattern.answer));
    setSelectedAnswer(null);
    setShowHint(false);
  }, [grade]);

  // Start game
  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    setGameState('playing');
    nextPattern();
  };

  // Handle answer
  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null || !pattern) return;

    setSelectedAnswer(answer);
    const correct = answer === pattern.answer;

    if (correct) {
      setScore(s => s + (showHint ? 5 : 10));
    }

    setGameState('feedback');
  };

  // Next round
  const nextRound = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(r => r + 1);
      setGameState('playing');
      nextPattern();
    } else {
      endGame();
    }
  };

  // End game
  const endGame = async () => {
    setGameState('finished');

    const result = await saveScore('number-patterns', score);
    setEarnedCoins(result.coins);
    setIsHighScore(result.isHighScore);

    if (result.isHighScore) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
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

                {gameState !== 'ready' && gameState !== 'finished' && (
                  <div className="text-white/80">
                    Round {currentRound + 1} of {totalRounds}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-2xl px-4 py-8">
            {/* READY STATE */}
            {gameState === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Card className={`${currentTheme.cardClass} p-8`}>
                  <div className="text-8xl mb-6">🔢</div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                    Number Patterns
                  </h1>
                  <p className="text-white/70 mb-6">
                    Find the pattern and guess the next number!<br />
                    Look carefully at how the numbers change.
                  </p>

                  {currentHighScore > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400">
                      <Trophy className="h-5 w-5" />
                      <span>High Score: {currentHighScore}</span>
                    </div>
                  )}

                  <Button
                    onClick={startGame}
                    size="lg"
                    className="text-lg px-8 py-6"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Game
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* PLAYING STATE */}
            {gameState === 'playing' && pattern && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Score */}
                <div className="text-center mb-6">
                  <span className="text-white/60">Score: </span>
                  <span className="text-2xl font-bold text-white">{score}</span>
                </div>

                <Card className={`${currentTheme.cardClass} p-8`}>
                  {/* Pattern Display */}
                  <div className="text-center mb-8">
                    <p className="text-white/50 mb-4">What comes next?</p>
                    <div className="flex justify-center items-center gap-3 flex-wrap">
                      {pattern.numbers.map((num, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-xl text-2xl font-bold text-white"
                        >
                          {num}
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl text-3xl font-bold text-white border-2 border-dashed border-white/30"
                      >
                        ?
                      </motion.div>
                    </div>
                  </div>

                  {/* Hint */}
                  {showHint && (
                    <div className="text-center mb-6 p-3 bg-yellow-500/20 rounded-xl">
                      <p className="text-yellow-400">Hint: {pattern.rule}</p>
                    </div>
                  )}

                  {/* Hint Button */}
                  {!showHint && (
                    <div className="text-center mb-6">
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-white/50 hover:text-white/70 text-sm flex items-center gap-1 mx-auto"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Need a hint? (-5 pts)
                      </button>
                    </div>
                  )}

                  {/* Choices */}
                  <div className="grid grid-cols-2 gap-4">
                    {choices.map((choice, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleAnswer(choice)}
                        whileTap={{ scale: 0.95 }}
                        className="p-6 rounded-2xl text-3xl font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                      >
                        {choice}
                      </motion.button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* FEEDBACK STATE */}
            {gameState === 'feedback' && pattern && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className={`${currentTheme.cardClass} p-8 text-center`}>
                  {selectedAnswer === pattern.answer ? (
                    <>
                      <div className="text-8xl mb-4">🎉</div>
                      <h2 className="text-3xl font-bold text-green-400 mb-2">Correct!</h2>
                    </>
                  ) : (
                    <>
                      <div className="text-8xl mb-4">🤔</div>
                      <h2 className="text-3xl font-bold text-red-400 mb-2">Not Quite!</h2>
                    </>
                  )}

                  <p className="text-white/70 mb-2">The answer was:</p>
                  <p className="text-4xl font-bold text-white mb-2">{pattern.answer}</p>
                  <p className="text-white/50 mb-6">Pattern: {pattern.rule}</p>

                  <Button
                    onClick={nextRound}
                    className="px-8"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  >
                    {currentRound < totalRounds - 1 ? 'Next Pattern' : 'See Results'}
                  </Button>
                </Card>
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
                  ) : (
                    <Star className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                  )}

                  <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {isHighScore ? 'New High Score!' : 'Great Pattern Finding!'}
                  </h2>

                  <div className="inline-flex items-center gap-8 bg-white/10 rounded-2xl p-6 mb-8">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{score}</p>
                      <p className="text-white/60">Score</p>
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
                        setScore(0);
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Play Again
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
