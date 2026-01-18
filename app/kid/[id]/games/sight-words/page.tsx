'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Star, RotateCcw, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import Confetti from '@/components/animations/Confetti';
import { useGames, SIGHT_WORDS_BY_GRADE } from '@/hooks/useGames';
import { createClient } from '@/lib/supabase/client';

type GameState = 'ready' | 'playing' | 'finished';

interface Bubble {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  isTarget: boolean;
}

export default function SightWordsGame() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const { saveScore, getScore } = useGames(kidId);

  const [grade, setGrade] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [targetWord, setTargetWord] = useState('');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);

  const gameRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleRef = useRef<NodeJS.Timeout | null>(null);
  const currentHighScore = getScore('sight-words')?.highScore || 0;

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
        setGrade(Math.min(data.grade_level, 2)); // Max grade 2 for this game
      }
    }
    loadGrade();
  }, [kidId]);

  // Get random word
  const getRandomWord = useCallback((isTarget: boolean) => {
    const words = SIGHT_WORDS_BY_GRADE[grade] || SIGHT_WORDS_BY_GRADE[0];
    if (isTarget) {
      return targetWord;
    }
    // Get a different word
    let word = words[Math.floor(Math.random() * words.length)];
    while (word === targetWord) {
      word = words[Math.floor(Math.random() * words.length)];
    }
    return word;
  }, [grade, targetWord]);

  // Set new target word
  const setNewTarget = useCallback(() => {
    const words = SIGHT_WORDS_BY_GRADE[grade] || SIGHT_WORDS_BY_GRADE[0];
    const word = words[Math.floor(Math.random() * words.length)];
    setTargetWord(word);
    return word;
  }, [grade]);

  // Create bubble
  const createBubble = useCallback((target: string) => {
    const isTarget = Math.random() < 0.4; // 40% chance of target word
    const bubble: Bubble = {
      id: Date.now() + Math.random(),
      word: isTarget ? target : getRandomWord(false),
      x: Math.random() * 80 + 10, // 10-90%
      y: 110, // Start below screen
      speed: Math.random() * 1 + 0.5, // Random speed
      isTarget
    };
    return bubble;
  }, [getRandomWord]);

  // Start game
  const startGame = () => {
    const target = setNewTarget();
    setBubbles([]);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setGameState('playing');

    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bubble spawner
    bubbleRef.current = setInterval(() => {
      setBubbles(prev => {
        // Add new bubble
        const newBubbles = [...prev, createBubble(target)];
        // Remove bubbles that are off screen
        return newBubbles.filter(b => b.y > -20);
      });
    }, 1500);
  };

  // End game
  const endGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (bubbleRef.current) clearInterval(bubbleRef.current);

    setGameState('finished');

    const result = await saveScore('sight-words', score);
    setEarnedCoins(result.coins);
    setIsHighScore(result.isHighScore);

    if (result.isHighScore) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [score, saveScore]);

  // Handle bubble click
  const popBubble = (bubble: Bubble) => {
    if (bubble.isTarget || bubble.word === targetWord) {
      // Correct! Pop it
      setScore(s => s + 1);
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));

      // Set new target after a few pops
      if (score > 0 && score % 5 === 0) {
        const newTarget = setNewTarget();
        // Update bubbles to use new target
        setBubbles(prev => prev.map(b => ({
          ...b,
          isTarget: Math.random() < 0.4,
          word: Math.random() < 0.4 ? newTarget : b.word
        })));
      }
    } else {
      // Wrong! Lose a life
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          endGame();
        }
        return newLives;
      });
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    }
  };

  // Move bubbles up
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
      setBubbles(prev =>
        prev.map(b => ({
          ...b,
          y: b.y - b.speed
        })).filter(b => b.y > -20)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (bubbleRef.current) clearInterval(bubbleRef.current);
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
                    <div className="text-white font-bold">{timeLeft}s</div>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < lives ? '' : 'opacity-30'}`}>
                          ❤️
                        </span>
                      ))}
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
                  <div className="text-8xl mb-6">🫧</div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                    Sight Word Pop
                  </h1>
                  <p className="text-white/70 mb-6">
                    Pop the bubbles with the correct sight word!<br />
                    Be careful - wrong words cost a life!
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
            {gameState === 'playing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Target Word */}
                <Card className={`${currentTheme.cardClass} p-4 mb-4 text-center`}>
                  <p className="text-white/50 text-sm mb-1">Find the word:</p>
                  <p className="text-4xl font-bold text-white">{targetWord}</p>
                </Card>

                {/* Score */}
                <div className="text-center mb-4">
                  <span className="text-white/60">Score: </span>
                  <span className="text-2xl font-bold text-white">{score}</span>
                </div>

                {/* Game Area */}
                <div
                  ref={gameRef}
                  className="relative h-[400px] bg-white/5 rounded-2xl overflow-hidden"
                >
                  <AnimatePresence>
                    {bubbles.map(bubble => (
                      <motion.button
                        key={bubble.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => popBubble(bubble)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${bubble.x}%`,
                          bottom: `${100 - bubble.y}%`
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400/80 to-purple-500/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span className="text-white font-bold text-lg">
                            {bubble.word}
                          </span>
                        </motion.div>
                      </motion.button>
                    ))}
                  </AnimatePresence>

                  {/* No bubbles message */}
                  {bubbles.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/30">Bubbles are coming...</p>
                    </div>
                  )}
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
                  ) : score >= 10 ? (
                    <Star className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
                  ) : (
                    <span className="text-8xl block mb-4">🫧</span>
                  )}

                  <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {isHighScore ? 'New High Score!' : score >= 10 ? 'Great Popping!' : 'Nice Try!'}
                  </h2>

                  <div className="inline-flex items-center gap-8 bg-white/10 rounded-2xl p-6 mb-8">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{score}</p>
                      <p className="text-white/60">Popped</p>
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
                        setBubbles([]);
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
