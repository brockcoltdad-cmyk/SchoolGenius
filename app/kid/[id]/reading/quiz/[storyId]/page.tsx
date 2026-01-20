'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Lightbulb, Star, Trophy, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';
import Confetti from '@/components/animations/Confetti';
import { createClient } from '@/lib/supabase/client';

interface ComprehensionQuestion {
  question_number: number;
  question_type: string;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation?: string;
  explanations_by_level?: {
    level_1?: string;
    level_2?: string;
    level_3?: string;
    level_4?: string;
    level_5?: string;
    level_6?: string;
  };
}

interface Story {
  id: string;
  title: string;
  category: string;
  comprehension_questions: ComprehensionQuestion[];
}

export default function ReadingQuizPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const storyId = params.storyId as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      const supabase = createClient();

      const { data } = await supabase
        .from('stories')
        .select('id, title, category, comprehension_questions')
        .eq('id', storyId)
        .single();

      if (data) {
        setStory(data);
      }

      setLoading(false);
    }

    fetchQuiz();
  }, [storyId]);

  const questions = story?.comprehension_questions || [];
  const question = questions[currentQuestion];

  const handleSelectAnswer = (answer: string) => {
    if (isCorrect !== null) return; // Already answered
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !question) return;

    const correct = selectedAnswer === question.correct_answer;
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);

    if (correct) {
      // First try = full points, subsequent tries = partial
      const points = attempts === 0 ? 10 : Math.max(1, 10 - attempts * 2);
      setScore(prev => prev + points);
      setShowExplanation(true);
    } else {
      // Show hint for wrong answers
      setHintLevel(prev => Math.min(prev + 1, 6));
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setHintLevel(0);
      setAttempts(0);
    } else {
      // Quiz complete!
      setQuizComplete(true);
      setShowConfetti(true);

      // Save progress
      const supabase = createClient();
      await supabase.from('reading_progress').upsert({
        child_id: kidId,
        story_id: storyId,
        completed: true,
        score: score,
        completed_at: new Date().toISOString()
      }, { onConflict: 'child_id,story_id' });
    }
  };

  const getHint = () => {
    if (!question?.explanations_by_level) {
      // Fallback hints if no custom ones
      const hints = [
        "Read the question again carefully.",
        "Look back at the story for clues.",
        "Think about what happened in the story.",
        "Eliminate answers that don't make sense.",
        "The answer is in the story - you can find it!",
        `Hint: The correct answer is ${question?.correct_answer}`
      ];
      return hints[hintLevel - 1] || hints[0];
    }

    const levelKey = `level_${hintLevel}` as keyof typeof question.explanations_by_level;
    return question.explanations_by_level[levelKey] || question.explanation || "Keep trying!";
  };

  const getAnswerChoices = () => {
    if (!question) return [];
    return [
      { letter: 'A', text: question.choice_a },
      { letter: 'B', text: question.choice_b },
      { letter: 'C', text: question.choice_c },
      { letter: 'D', text: question.choice_d },
    ];
  };

  if (loading) {
    return (
      <PageTransition>
        <ThemedBackground>
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-6xl"
            >
              ❓
            </motion.div>
          </div>
        </ThemedBackground>
      </PageTransition>
    );
  }

  if (!story || questions.length === 0) {
    return (
      <PageTransition>
        <ThemedBackground>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">😔</span>
              <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                No Quiz Available
              </h2>
              <p className="opacity-70 mb-4" style={{ color: currentTheme.colors.text }}>
                This story doesn&apos;t have questions yet.
              </p>
              <Link href={`/kid/${kidId}/reading`} className="underline" style={{ color: currentTheme.colors.primary }}>
                Back to Library
              </Link>
            </div>
          </div>
        </ThemedBackground>
      </PageTransition>
    );
  }

  // Quiz Complete Screen
  if (quizComplete) {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

    return (
      <PageTransition>
        <ThemedBackground>
          <ThemeDecorations />
          {showConfetti && <Confetti active={true} />}

          <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-full max-w-md"
            >
              <Card className={`${currentTheme.cardClass} text-center p-8`}>
                <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500" />

                <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                  Quiz Complete!
                </h1>

                <p className="text-xl mb-4" style={{ color: currentTheme.colors.text }}>
                  {story.title}
                </p>

                <div className="mb-6">
                  <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: i <= stars ? 1 : 0.3 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <Star
                          className={`h-12 w-12 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    {score} points
                  </p>
                  <p className="opacity-70" style={{ color: currentTheme.colors.text }}>
                    {percentage}% correct
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => router.push(`/kid/${kidId}/reading/category/${encodeURIComponent(story.category)}`)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    Read Another Story
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/kid/${kidId}`)}
                    className="w-full"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </ThemedBackground>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-24">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
              <Link
                href={`/kid/${kidId}/reading/story/${storyId}`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Story
              </Link>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1" style={{ color: currentTheme.colors.text }}>
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{score}</span>
                </div>
                <div className="text-sm" style={{ color: currentTheme.colors.text }}>
                  {currentQuestion + 1} / {questions.length}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-2xl px-4 py-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className={`${currentTheme.cardClass} mb-6`}>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {question?.question_type?.replace('_', ' ').toUpperCase() || 'QUESTION'}
                      </span>
                    </div>

                    <h2
                      className="text-xl font-bold mb-6"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {question?.question_text}
                    </h2>

                    {/* Answer Choices */}
                    <div className="space-y-3">
                      {getAnswerChoices().map(choice => (
                        <motion.button
                          key={choice.letter}
                          onClick={() => handleSelectAnswer(choice.letter)}
                          disabled={isCorrect !== null}
                          whileHover={{ scale: isCorrect === null ? 1.02 : 1 }}
                          whileTap={{ scale: isCorrect === null ? 0.98 : 1 }}
                          className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                            selectedAnswer === choice.letter
                              ? isCorrect === null
                                ? 'ring-2 ring-blue-500 bg-blue-500/20'
                                : isCorrect
                                  ? 'ring-2 ring-green-500 bg-green-500/20'
                                  : 'ring-2 ring-red-500 bg-red-500/20'
                              : choice.letter === question?.correct_answer && isCorrect === false
                                ? 'ring-2 ring-green-500 bg-green-500/20'
                                : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              selectedAnswer === choice.letter
                                ? isCorrect === null
                                  ? 'bg-blue-500 text-white'
                                  : isCorrect
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                : 'bg-white/20'
                            }`}
                            style={{
                              color:
                                selectedAnswer !== choice.letter
                                  ? currentTheme.colors.text
                                  : undefined,
                            }}
                          >
                            {selectedAnswer === choice.letter && isCorrect !== null ? (
                              isCorrect ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )
                            ) : (
                              choice.letter
                            )}
                          </span>
                          <span style={{ color: currentTheme.colors.text }}>{choice.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Hint Panel */}
            <AnimatePresence>
              {hintLevel > 0 && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-500/30">
                    <div className="p-4 flex items-start gap-3">
                      <GigiCharacter size="sm" showName={false} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          <span className="font-bold text-yellow-700">Hint {hintLevel} of 6</span>
                        </div>
                        <p className="text-gray-700">{getHint()}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {isCorrect === null ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
                >
                  Check Answer
                </Button>
              ) : isCorrect ? (
                <Button
                  onClick={handleNextQuestion}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              ) : (
                <Button
                  onClick={handleTryAgain}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && question?.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-green-50/80 border-green-200">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="font-bold text-green-700">Great job!</span>
                      </div>
                      <p className="text-green-800">{question.explanation}</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
