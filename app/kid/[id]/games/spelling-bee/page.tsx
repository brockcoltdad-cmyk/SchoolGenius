'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Star, RotateCcw, Play, Volume2, Delete, Check, X } from 'lucide-react';
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

export default function SpellingBeeGame() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const { saveScore, getScore } = useGames(kidId);

  const [grade, setGrade] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentHighScore = getScore('spelling-bee')?.highScore || 0;
  const totalWords = 10; // 10 words per game

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

  // Text-to-speech for word
  const speakWord = useCallback(async (word: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word, childId: kidId })
      });

      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      } else {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
    } catch (err) {
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  }, [isPlaying, kidId]);

  // Start game
  const startGame = () => {
    const gradeWords = SPELLING_WORDS_BY_GRADE[grade] || SPELLING_WORDS_BY_GRADE[0];
    // Shuffle and pick 10 words
    const shuffled = [...gradeWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, totalWords));
    setCurrentWordIndex(0);
    setScore(0);
    setUserInput('');
    setGameState('playing');

    // Focus input and speak first word
    setTimeout(() => {
      inputRef.current?.focus();
      speakWord(shuffled[0]);
    }, 500);
  };

  // Check answer
  const checkAnswer = () => {
    const currentWord = words[currentWordIndex];
    const correct = userInput.toLowerCase().trim() === currentWord.toLowerCase();

    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
    setGameState('feedback');
  };

  // Next word
  const nextWord = () => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(i => i + 1);
      setUserInput('');
      setIsCorrect(null);
      setGameState('playing');

      setTimeout(() => {
        inputRef.current?.focus();
        speakWord(words[currentWordIndex + 1]);
      }, 300);
    } else {
      endGame();
    }
  };

  // End game
  const endGame = async () => {
    setGameState('finished');

    // Score is out of 10, multiply by 10 for percentage-like scoring
    const finalScore = score * 10;

    const result = await saveScore('spelling-bee', finalScore);
    setEarnedCoins(result.coins);
    setIsHighScore(result.isHighScore);

    if (result.isHighScore) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Handle keyboard input
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

                {(gameState === 'playing' || gameState === 'feedback') && (
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
                  <div className="text-8xl mb-6">🐝</div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                    Spelling Bee
                  </h1>
                  <p className="text-white/70 mb-6">
                    Listen to the word and spell it correctly!<br />
                    You&apos;ll have 10 words to spell.
                  </p>

                  {currentHighScore > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400">
                      <Trophy className="h-5 w-5" />
                      <span>High Score: {currentHighScore}%</span>
                    </div>
                  )}

                  <div className="mb-6 p-4 bg-white/10 rounded-xl">
                    <p className="text-sm text-white/60 mb-2">Grade {grade === 0 ? 'K' : grade} Words</p>
                    <p className="text-white text-sm">
                      {(SPELLING_WORDS_BY_GRADE[grade] || []).slice(0, 5).join(', ')}...
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
                    Start Spelling
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* PLAYING STATE */}
            {gameState === 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Progress */}
                <div className="flex justify-center gap-2 mb-8">
                  {Array.from({ length: totalWords }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < currentWordIndex
                          ? 'bg-green-500'
                          : i === currentWordIndex
                          ? 'bg-white'
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                <Card className={`${currentTheme.cardClass} p-8`}>
                  {/* Score */}
                  <div className="text-center mb-6">
                    <span className="text-white/60">Score: </span>
                    <span className="text-2xl font-bold text-white">{score}/{currentWordIndex}</span>
                  </div>

                  {/* Listen Button */}
                  <div className="text-center mb-8">
                    <motion.button
                      onClick={() => speakWord(words[currentWordIndex])}
                      disabled={isPlaying}
                      whileTap={{ scale: 0.95 }}
                      className={`p-8 rounded-full ${isPlaying ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'} transition-colors`}
                    >
                      <Volume2 className={`h-16 w-16 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
                    </motion.button>
                    <p className="text-white/50 mt-4">
                      {isPlaying ? 'Listening...' : 'Tap to hear the word'}
                    </p>
                  </div>

                  {/* Input */}
                  <div className="mb-6">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your spelling..."
                      className="w-full p-4 text-2xl text-center bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  </div>

                  <Button
                    onClick={checkAnswer}
                    disabled={!userInput.trim()}
                    className="w-full py-6 text-lg"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Check Spelling
                  </Button>
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
                  {/* Result Icon */}
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
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500">
                        <X className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </motion.div>

                  <h2 className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Not Quite!'}
                  </h2>

                  <p className="text-white/70 mb-2">The word was:</p>
                  <p className="text-4xl font-bold text-white mb-2">{words[currentWordIndex]}</p>

                  {!isCorrect && (
                    <p className="text-white/50 mb-4">
                      You spelled: <span className="text-red-400">{userInput}</span>
                    </p>
                  )}

                  <Button
                    onClick={nextWord}
                    className="mt-6 px-8"
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
                  ) : score >= 7 ? (
                    <Star className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
                  ) : (
                    <span className="text-8xl block mb-4">🐝</span>
                  )}

                  <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {isHighScore ? 'New High Score!' : score >= 7 ? 'Great Spelling!' : 'Keep Practicing!'}
                  </h2>

                  <div className="inline-flex items-center gap-8 bg-white/10 rounded-2xl p-6 mb-8">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{score}</p>
                      <p className="text-white/60">Correct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{score * 10}%</p>
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
                        setCurrentWordIndex(0);
                        setUserInput('');
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
