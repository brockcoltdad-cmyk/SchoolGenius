'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Star, RotateCcw, Play, Shuffle, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import Confetti from '@/components/animations/Confetti';
import { useGames, SPELLING_WORDS_BY_GRADE } from '@/hooks/useGames';
import { createClient } from '@/lib/supabase/client';

type GameState = 'ready' | 'playing' | 'feedback' | 'finished';

function scrambleWord(word: string): string {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  // Make sure it's actually scrambled
  if (letters.join('') === word && word.length > 1) {
    return scrambleWord(word);
  }
  return letters.join('');
}

export default function WordScrambleGame() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const { saveScore, getScore } = useGames(kidId);

  const [grade, setGrade] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);
  const [hint, setHint] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);

  const currentHighScore = getScore('word-scramble')?.highScore || 0;
  const totalWords = 10;

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

  // Start game
  const startGame = () => {
    const gradeWords = SPELLING_WORDS_BY_GRADE[grade] || SPELLING_WORDS_BY_GRADE[1];
    // Filter words that are at least 4 letters
    const validWords = gradeWords.filter(w => w.length >= 4);
    const shuffled = [...validWords].sort(() => Math.random() - 0.5);
    const gameWords = shuffled.slice(0, totalWords);

    setWords(gameWords);
    setCurrentWordIndex(0);
    setScore(0);
    setHintsUsed(0);
    setUserInput('');
    setHint('');
    setScrambled(scrambleWord(gameWords[0]));
    setGameState('playing');
  };

  // Use hint
  const useHint = () => {
    const currentWord = words[currentWordIndex];
    if (hint.length < currentWord.length - 1) {
      setHint(currentWord.substring(0, hint.length + 1));
      setHintsUsed(h => h + 1);
    }
  };

  // Check answer
  const checkAnswer = () => {
    const currentWord = words[currentWordIndex];
    const correct = userInput.toLowerCase().trim() === currentWord.toLowerCase();

    setIsCorrect(correct);
    if (correct) {
      // Score: 10 points minus 2 per hint used
      setScore(s => s + Math.max(10 - hintsUsed * 2, 2));
    }
    setGameState('feedback');
  };

  // Next word
  const nextWord = () => {
    if (currentWordIndex < totalWords - 1) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      setUserInput('');
      setHint('');
      setIsCorrect(null);
      setScrambled(scrambleWord(words[nextIdx]));
      setGameState('playing');
    } else {
      endGame();
    }
  };

  // End game
  const endGame = async () => {
    setGameState('finished');

    const result = await saveScore('word-scramble', score);
    setEarnedCoins(result.coins);
    setIsHighScore(result.isHighScore);

    if (result.isHighScore) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (gameState === 'playing' && userInput.trim()) {
        checkAnswer();
      } else if (gameState === 'feedback') {
        nextWord();
      }
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

                {gameState === 'playing' && (
                  <div className="text-white/80">
                    Word {currentWordIndex + 1} of {totalWords}
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
                  <div className="text-8xl mb-6">🔀</div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                    Word Scramble
                  </h1>
                  <p className="text-white/70 mb-6">
                    Unscramble the letters to find the hidden word!<br />
                    Use hints if you get stuck (but they cost points).
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
                {/* Score */}
                <div className="text-center mb-6">
                  <span className="text-white/60">Score: </span>
                  <span className="text-2xl font-bold text-white">{score}</span>
                </div>

                <Card className={`${currentTheme.cardClass} p-8`}>
                  {/* Scrambled Word */}
                  <div className="text-center mb-8">
                    <p className="text-white/50 mb-4">Unscramble this word:</p>
                    <motion.div
                      key={scrambled}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex justify-center gap-2 flex-wrap"
                    >
                      {scrambled.split('').map((letter, i) => (
                        <motion.div
                          key={i}
                          initial={{ rotateY: 180 }}
                          animate={{ rotateY: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-lg text-2xl font-bold text-white uppercase"
                        >
                          {letter}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Hint */}
                  {hint && (
                    <div className="text-center mb-4">
                      <p className="text-white/50 text-sm">Hint: Starts with &quot;{hint}...&quot;</p>
                    </div>
                  )}

                  {/* Input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your answer..."
                      className="w-full p-4 text-2xl text-center bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={useHint}
                      variant="outline"
                      className="flex-1"
                      disabled={hint.length >= words[currentWordIndex]?.length - 1}
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Hint (-2 pts)
                    </Button>
                    <Button
                      onClick={checkAnswer}
                      disabled={!userInput.trim()}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Check
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* FEEDBACK STATE */}
            {gameState === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className={`${currentTheme.cardClass} p-8 text-center`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4"
                  >
                    {isCorrect ? (
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500">
                        <Check className="h-12 w-12 text-white" />
                      </div>
                    ) : (
                      <div className="text-8xl">🤔</div>
                    )}
                  </motion.div>

                  <h2 className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Not Quite!'}
                  </h2>

                  <p className="text-white/70 mb-2">The word was:</p>
                  <p className="text-4xl font-bold text-white mb-4">{words[currentWordIndex]}</p>

                  <Button
                    onClick={nextWord}
                    className="px-8"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  >
                    {currentWordIndex < totalWords - 1 ? 'Next Word' : 'See Results'}
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
                    {isHighScore ? 'New High Score!' : 'Great Job!'}
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
