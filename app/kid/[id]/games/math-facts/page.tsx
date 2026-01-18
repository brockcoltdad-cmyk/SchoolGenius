'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Star, RotateCcw, Play, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import Confetti from '@/components/animations/Confetti';
import { useGames, MATH_FACTS_BY_GRADE } from '@/hooks/useGames';
import { createClient } from '@/lib/supabase/client';

type GameState = 'ready' | 'playing' | 'finished';

interface Problem {
  a: number;
  b: number;
  operation: string;
  answer: number;
}

function generateProblem(operations: string[], maxNumber: number): Problem {
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let a: number, b: number, answer: number;

  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * (maxNumber + 1));
      b = Math.floor(Math.random() * (maxNumber + 1));
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * (maxNumber + 1));
      b = Math.floor(Math.random() * (a + 1)); // Ensure non-negative result
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * (maxNumber + 1));
      b = Math.floor(Math.random() * (maxNumber + 1));
      answer = a * b;
      break;
    case '÷':
      b = Math.floor(Math.random() * maxNumber) + 1; // Avoid division by 0
      answer = Math.floor(Math.random() * (maxNumber + 1));
      a = b * answer; // Ensure clean division
      break;
    default:
      a = 1;
      b = 1;
      answer = 2;
  }

  return { a, b, operation, answer };
}

function generateChoices(correctAnswer: number): number[] {
  const choices = new Set<number>([correctAnswer]);

  while (choices.size < 4) {
    // Generate wrong answers close to correct answer
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrongAnswer = Math.max(0, correctAnswer + offset);
    if (wrongAnswer !== correctAnswer) {
      choices.add(wrongAnswer);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}

export default function MathFactsGame() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;

  const { saveScore, getScore } = useGames(kidId);

  const [grade, setGrade] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentHighScore = getScore('math-facts')?.highScore || 0;

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
        setGrade(data.grade_level);
      }
    }
    loadGrade();
  }, [kidId]);

  // Generate new problem
  const nextProblem = useCallback(() => {
    const config = MATH_FACTS_BY_GRADE[grade] || MATH_FACTS_BY_GRADE[0];
    const newProblem = generateProblem(config.operations, config.maxNumber);
    setProblem(newProblem);
    setChoices(generateChoices(newProblem.answer));
    setSelectedAnswer(null);
    setShowResult(false);
  }, [grade]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(60);
    nextProblem();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End game
  const endGame = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('finished');

    // Save score
    const result = await saveScore('math-facts', score);
    setEarnedCoins(result.coins);
    setIsHighScore(result.isHighScore);

    if (result.isHighScore) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [score, saveScore]);

  // Handle answer selection
  const handleAnswer = (answer: number) => {
    if (showResult || !problem) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const correct = answer === problem.answer;

    if (correct) {
      const newScore = score + 1 + Math.floor(streak / 3); // Bonus for streaks
      setScore(newScore);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    // Move to next problem after delay
    setTimeout(() => {
      nextProblem();
    }, correct ? 300 : 800);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
                    <div className="text-white font-bold text-xl">
                      {timeLeft}s
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-semibold">{streak}</span>
                    </div>
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
                  <div className="text-8xl mb-6">⚡</div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                    Math Facts Blitz
                  </h1>
                  <p className="text-white/70 mb-6">
                    Answer as many math facts as you can in 60 seconds!<br />
                    Build streaks for bonus points.
                  </p>

                  {currentHighScore > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400">
                      <Trophy className="h-5 w-5" />
                      <span>High Score: {currentHighScore}</span>
                    </div>
                  )}

                  <div className="mb-6 p-4 bg-white/10 rounded-xl">
                    <p className="text-sm text-white/60 mb-2">Grade {grade === 0 ? 'K' : grade} Mode:</p>
                    <p className="text-white">
                      {MATH_FACTS_BY_GRADE[grade]?.operations.join(', ')} up to {MATH_FACTS_BY_GRADE[grade]?.maxNumber}
                    </p>
                  </div>

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
            {gameState === 'playing' && problem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Score */}
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-white mb-2">{score}</div>
                  <div className="text-white/50">points</div>
                </div>

                {/* Problem */}
                <Card className={`${currentTheme.cardClass} p-8 mb-8`}>
                  <motion.div
                    key={`${problem.a}-${problem.operation}-${problem.b}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-bold text-white mb-8">
                      {problem.a} {problem.operation} {problem.b} = ?
                    </div>

                    {/* Choices */}
                    <div className="grid grid-cols-2 gap-4">
                      {choices.map((choice, i) => {
                        const isSelected = selectedAnswer === choice;
                        const isCorrect = choice === problem.answer;
                        const showCorrect = showResult && isCorrect;
                        const showWrong = showResult && isSelected && !isCorrect;

                        return (
                          <motion.button
                            key={i}
                            onClick={() => handleAnswer(choice)}
                            disabled={showResult}
                            whileTap={{ scale: 0.95 }}
                            className={`p-6 rounded-2xl text-3xl font-bold transition-all ${
                              showCorrect
                                ? 'bg-green-500 text-white ring-4 ring-green-300'
                                : showWrong
                                ? 'bg-red-500 text-white ring-4 ring-red-300'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {choice}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </Card>

                {/* Timer Bar */}
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      width: `${(timeLeft / 60) * 100}%`
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
                  ) : (
                    <Star className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                  )}

                  <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {isHighScore ? 'New High Score!' : 'Great Game!'}
                  </h2>

                  <div className="inline-flex items-center gap-8 bg-white/10 rounded-2xl p-6 mb-8">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{score}</p>
                      <p className="text-white/60">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{bestStreak}</p>
                      <p className="text-white/60">Best Streak</p>
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
