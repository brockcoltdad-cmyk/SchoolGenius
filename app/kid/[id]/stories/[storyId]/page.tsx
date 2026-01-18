'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Volume2, VolumeX, BookOpen, CheckCircle, XCircle,
  ChevronRight, Star, Trophy, RotateCcw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import { useStoryLibrary, Story } from '@/hooks/useStoryLibrary';
import { createClient } from '@/lib/supabase/client';
import Confetti from '@/components/animations/Confetti';

type Phase = 'reading' | 'quiz' | 'complete';

export default function StoryReaderPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const storyId = params.storyId as string;

  const { stories, loading, markComplete } = useStoryLibrary(kidId);

  const [story, setStory] = useState<Story | null>(null);
  const [phase, setPhase] = useState<Phase>('reading');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Find the story
  useEffect(() => {
    if (!loading && stories.length > 0) {
      const found = stories.find(s => s.id === storyId);
      if (found) {
        setStory(found);
        // Enable audio for younger grades
        setAudioEnabled(found.gradeLevel <= 3);
      }
    }
  }, [stories, storyId, loading]);

  // Text-to-speech
  const speakText = useCallback(async (text: string) => {
    if (!audioEnabled || isPlaying) return;

    setIsPlaying(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 500), childId: kidId })
      });

      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlaying(false);
    }
  }, [audioEnabled, isPlaying, kidId]);

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (!story || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === story.questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
    }

    setShowExplanation(true);
  };

  // Go to next question
  const nextQuestion = () => {
    if (!story) return;

    if (currentQuestion < story.questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      finishQuiz();
    }
  };

  // Finish quiz and save progress
  const finishQuiz = async () => {
    if (!story) return;

    const finalScore = Math.round((score / story.questions.length) * 100);
    setPhase('complete');
    setShowConfetti(true);

    // Save progress
    await markComplete(story.id, finalScore);

    // Add coins
    const supabase = createClient();
    const baseCoins = 25;
    const bonusCoins = finalScore >= 90 ? 15 : finalScore >= 70 ? 10 : 5;
    const totalCoins = baseCoins + bonusCoins;

    try {
      await supabase.rpc('add_coins', {
        p_child_id: kidId,
        p_amount: totalCoins,
        p_reason: `Story completed: ${story.title} - ${finalScore}%`
      });
    } catch (err) {
      console.error('Error adding coins:', err);
    }

    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Reset quiz
  const retakeQuiz = () => {
    setPhase('quiz');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowExplanation(false);
  };

  if (loading) {
    return (
      <ThemedBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      </ThemedBackground>
    );
  }

  if (!story) {
    return (
      <ThemedBackground>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <BookOpen className="h-16 w-16 text-white/30 mb-4" />
          <p className="text-white/70 mb-4">Story not found</p>
          <Link href={`/kid/${kidId}/stories`}>
            <Button>Back to Library</Button>
          </Link>
        </div>
      </ThemedBackground>
    );
  }

  const questions = story.questions || [];
  const currentQ = questions[currentQuestion];
  const finalScore = Math.round((score / questions.length) * 100);

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
                  href={`/kid/${kidId}/stories`}
                  className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Library
                </Link>

                <div className="flex items-center gap-4">
                  {phase === 'reading' && (
                    <button
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {audioEnabled ? (
                        <Volume2 className="h-5 w-5 text-white" />
                      ) : (
                        <VolumeX className="h-5 w-5 text-white/50" />
                      )}
                    </button>
                  )}

                  {phase === 'quiz' && (
                    <div className="flex items-center gap-2 text-white/80">
                      <span>Question {currentQuestion + 1}/{questions.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-4xl px-4 py-8">
            {/* READING PHASE */}
            {phase === 'reading' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Story Title */}
                <div className="text-center mb-8">
                  <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-white/70 mb-3">
                    {story.lexileLevel}L • Grade {story.gradeLevel === 0 ? 'K' : story.gradeLevel}
                  </span>
                  <h1 className="text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    {story.title}
                  </h1>
                </div>

                {/* Story Content */}
                <Card className={`${currentTheme.cardClass} p-8 mb-8`}>
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {story.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 leading-relaxed text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {audioEnabled && (
                    <button
                      onClick={() => speakText(story.content)}
                      disabled={isPlaying}
                      className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                    >
                      <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                      {isPlaying ? 'Reading...' : 'Read Aloud'}
                    </button>
                  )}
                </Card>

                {/* Take Quiz Button */}
                <div className="text-center">
                  <Button
                    onClick={() => setPhase('quiz')}
                    size="lg"
                    className="text-lg px-8 py-6"
                    style={{
                      background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  >
                    <span className="flex items-center gap-2">
                      Take the Quiz
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </Button>
                  <p className="text-white/50 text-sm mt-3">
                    {questions.length} questions • Earn coins!
                  </p>
                </div>
              </motion.div>
            )}

            {/* QUIZ PHASE */}
            {phase === 'quiz' && currentQ && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Progress */}
                <div className="flex justify-center gap-2 mb-8">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < currentQuestion
                          ? 'bg-green-500'
                          : i === currentQuestion
                          ? 'bg-white'
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Question */}
                <Card className={`${currentTheme.cardClass} p-8`}>
                  <h2 className="text-2xl font-bold text-center mb-8" style={{ color: currentTheme.colors.text }}>
                    {currentQ.question}
                  </h2>

                  {/* Options */}
                  <div className="grid gap-4">
                    {currentQ.options.map((option, i) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrectAnswer = option === currentQ.correctAnswer;
                      const showCorrect = showExplanation && isCorrectAnswer;
                      const showWrong = showExplanation && isSelected && !isCorrectAnswer;

                      return (
                        <motion.button
                          key={i}
                          onClick={() => handleAnswer(option)}
                          disabled={selectedAnswer !== null}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl text-left text-lg font-medium transition-all ${
                            showCorrect
                              ? 'bg-green-500 text-white ring-4 ring-green-300'
                              : showWrong
                              ? 'bg-red-500 text-white ring-4 ring-red-300'
                              : isSelected
                              ? 'bg-white/30 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {option}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                      >
                        <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {isCorrect ? (
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-400" />
                            )}
                            <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                              {isCorrect ? 'Correct!' : 'Not quite!'}
                            </span>
                          </div>
                          <p className="text-white/80">{currentQ.explanation}</p>
                        </div>

                        <Button
                          onClick={nextQuestion}
                          className="w-full mt-4"
                          style={{
                            background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                          }}
                        >
                          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )}

            {/* COMPLETE PHASE */}
            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className={`${currentTheme.cardClass} p-8`}>
                  {/* Icon */}
                  {finalScore >= 70 ? (
                    <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
                  ) : (
                    <Star className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                  )}

                  {/* Message */}
                  <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {finalScore >= 90 ? 'Amazing!' : finalScore >= 70 ? 'Great Job!' : 'Good Try!'}
                  </h2>
                  <p className="text-white/70 mb-6">
                    You finished "{story.title}"
                  </p>

                  {/* Score */}
                  <div className="inline-flex items-center gap-8 bg-white/10 rounded-2xl p-6 mb-8">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{score}</p>
                      <p className="text-white/60">Correct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{finalScore}%</p>
                      <p className="text-white/60">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-yellow-400">
                        +{finalScore >= 90 ? 40 : finalScore >= 70 ? 35 : 30}
                      </p>
                      <p className="text-white/60">Coins</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={retakeQuiz}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retake Quiz
                    </Button>
                    <Link href={`/kid/${kidId}/stories`}>
                      <Button
                        style={{
                          background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                        }}
                      >
                        Back to Library
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
