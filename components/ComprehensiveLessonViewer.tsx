'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, Lightbulb, HelpCircle, CheckCircle, XCircle, Trophy } from 'lucide-react';
import VisualLessonPlayer from './lesson/VisualLessonPlayer';

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer';
  options?: string[];
  correct_answer: string;
  hint?: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface LessonData {
  id: string;
  title: string;
  subtitle?: string;
  subject: string;
  grade_level: number;
  skill_name: string;

  hook: {
    type: 'question' | 'scenario' | 'video' | 'fact';
    content: string;
    emoji?: string;
  };

  teach: {
    steps: any[];
    rule_summary?: string;
  };

  guided_practice: Question[];
  independent_practice: Question[];
  quiz: Question[];
}

interface LessonViewerProps {
  lesson: LessonData;
  childId: string;
  onComplete: (results: LessonResults) => void;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

interface LessonResults {
  lessonId: string;
  phases: {
    hook: boolean;
    teach: boolean;
    guided: { correct: number; total: number };
    independent: { correct: number; total: number };
    quiz: { correct: number; total: number; percentage: number };
  };
  totalTime: number;
  coinsEarned: number;
  starsEarned: number;
}

type Phase = 'hook' | 'teach' | 'guided' | 'independent' | 'quiz' | 'results';

export default function ComprehensiveLessonViewer({
  lesson,
  childId,
  onComplete,
  theme = { primaryColor: 'blue', secondaryColor: 'purple' }
}: LessonViewerProps) {
  const [phase, setPhase] = useState<Phase>('hook');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime] = useState(Date.now());

  const [phaseResults, setPhaseResults] = useState({
    guided: { correct: 0, total: 0 },
    independent: { correct: 0, total: 0 },
    quiz: { correct: 0, total: 0 },
  });

  const getCurrentQuestions = (): Question[] => {
    switch (phase) {
      case 'guided': return lesson.guided_practice;
      case 'independent': return lesson.independent_practice;
      case 'quiz': return lesson.quiz;
      default: return [];
    }
  };

  const currentQuestions = getCurrentQuestions();
  const currentQuestion = currentQuestions[questionIndex];

  const submitAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    if (isCorrect) {
      setPhaseResults(prev => ({
        ...prev,
        [phase]: {
          correct: prev[phase as keyof typeof prev].correct + 1,
          total: prev[phase as keyof typeof prev].total + 1,
        }
      }));

      setTimeout(() => {
        setFeedback(null);
        setAttempts(0);
        setShowHint(false);

        if (questionIndex < currentQuestions.length - 1) {
          setQuestionIndex(prev => prev + 1);
        } else {
          advancePhase();
        }
      }, 1500);
    } else {
      setAttempts(prev => prev + 1);
      setPhaseResults(prev => ({
        ...prev,
        [phase]: {
          ...prev[phase as keyof typeof prev],
          total: prev[phase as keyof typeof prev].total + 1,
        }
      }));

      if (attempts >= 2) {
        setTimeout(() => {
          setFeedback(null);
          setAttempts(0);
          setShowHint(false);

          if (questionIndex < currentQuestions.length - 1) {
            setQuestionIndex(prev => prev + 1);
          } else {
            advancePhase();
          }
        }, 2000);
      } else {
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const advancePhase = () => {
    setQuestionIndex(0);
    setAttempts(0);
    setShowHint(false);

    const phaseOrder: Phase[] = ['hook', 'teach', 'guided', 'independent', 'quiz', 'results'];
    const currentIndex = phaseOrder.indexOf(phase);

    if (currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1]);
    }
  };

  const calculateResults = (): LessonResults => {
    const quizPercentage = phaseResults.quiz.total > 0
      ? Math.round((phaseResults.quiz.correct / phaseResults.quiz.total) * 100)
      : 0;

    let stars = 0;
    let coins = 10;

    if (quizPercentage >= 90) {
      stars = 3;
      coins += 50;
    } else if (quizPercentage >= 70) {
      stars = 2;
      coins += 30;
    } else if (quizPercentage >= 50) {
      stars = 1;
      coins += 15;
    }

    return {
      lessonId: lesson.id,
      phases: {
        hook: true,
        teach: true,
        guided: phaseResults.guided,
        independent: phaseResults.independent,
        quiz: { ...phaseResults.quiz, percentage: quizPercentage },
      },
      totalTime: Math.round((Date.now() - startTime) / 1000),
      coinsEarned: coins,
      starsEarned: stars,
    };
  };

  useEffect(() => {
    if (phase === 'results') {
      const results = calculateResults();
      onComplete(results);
    }
  }, [phase]);

  const PhaseIndicator = () => {
    const phases: { key: Phase; label: string; icon: React.ReactNode }[] = [
      { key: 'hook', label: 'Start', icon: <Lightbulb size={16} /> },
      { key: 'teach', label: 'Learn', icon: <Play size={16} /> },
      { key: 'guided', label: 'Practice', icon: <HelpCircle size={16} /> },
      { key: 'independent', label: 'Try It', icon: <ChevronRight size={16} /> },
      { key: 'quiz', label: 'Quiz', icon: <CheckCircle size={16} /> },
    ];

    const currentIdx = phases.findIndex(p => p.key === phase);

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {phases.map((p, idx) => (
          <React.Fragment key={p.key}>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              idx < currentIdx
                ? 'bg-green-100 text-green-700'
                : idx === currentIdx
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {p.icon}
              <span className="hidden sm:inline">{p.label}</span>
            </div>
            {idx < phases.length - 1 && (
              <div className={`w-8 h-0.5 ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="lesson-viewer max-w-4xl mx-auto p-4">
      {phase !== 'results' && <PhaseIndicator />}

      <AnimatePresence mode="wait">
        {phase === 'hook' && (
          <motion.div
            key="hook"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="text-6xl mb-6">{lesson.hook.emoji || '🤔'}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{lesson.title}</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              {lesson.hook.content}
            </p>
            <button
              onClick={advancePhase}
              className="px-8 py-4 bg-blue-500 text-white text-xl font-bold rounded-2xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              Let's Learn! →
            </button>
          </motion.div>
        )}

        {phase === 'teach' && (
          <motion.div
            key="teach"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <VisualLessonPlayer
              lessonTitle={lesson.title}
              lessonSubtitle={lesson.subtitle}
              steps={lesson.teach.steps}
              onComplete={advancePhase}
              theme={theme}
            />
          </motion.div>
        )}

        {['guided', 'independent', 'quiz'].includes(phase) && currentQuestion && (
          <motion.div
            key={`${phase}-${questionIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                phase === 'guided' ? 'bg-purple-100 text-purple-700' :
                phase === 'independent' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {phase === 'guided' ? '👥 Guided Practice' :
                 phase === 'independent' ? '✏️ Independent Practice' :
                 '📝 Quiz'}
              </span>
              <span className="text-gray-500">
                {questionIndex + 1} / {currentQuestions.length}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="grid gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => submitAnswer(option)}
                    disabled={feedback !== null}
                    className={`p-4 text-left text-lg font-medium rounded-xl border-2 transition-all ${
                      feedback !== null && option.toLowerCase() === currentQuestion.correct_answer.toLowerCase()
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : feedback === 'incorrect' && answers[currentQuestion.id] === option
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true_false' && (
              <div className="flex gap-4 justify-center">
                {['True', 'False'].map(option => (
                  <button
                    key={option}
                    onClick={() => submitAnswer(option)}
                    disabled={feedback !== null}
                    className={`px-12 py-4 text-xl font-bold rounded-xl border-2 transition-all ${
                      feedback !== null && option.toLowerCase() === currentQuestion.correct_answer.toLowerCase()
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : feedback === 'incorrect' && answers[currentQuestion.id] === option
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                    feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle className="text-green-600" size={24} />
                      <span className="text-green-700 font-bold">Correct! Great job!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600" size={24} />
                      <span className="text-red-700 font-bold">
                        {attempts >= 2
                          ? `The answer is: ${currentQuestion.correct_answer}`
                          : 'Not quite. Try again!'}
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {phase === 'guided' && currentQuestion.hint && !showHint && feedback !== 'correct' && (
              <button
                onClick={() => setShowHint(true)}
                className="mt-4 text-blue-500 hover:text-blue-700 flex items-center gap-2"
              >
                <Lightbulb size={18} />
                Need a hint?
              </button>
            )}

            {showHint && currentQuestion.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
              >
                <p className="text-yellow-800">
                  <strong>Hint:</strong> {currentQuestion.hint}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <div className="text-6xl mb-4">
              {calculateResults().starsEarned === 3 ? '🏆' :
               calculateResults().starsEarned === 2 ? '⭐' :
               calculateResults().starsEarned === 1 ? '👍' : '📚'}
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {calculateResults().starsEarned >= 2 ? 'Great Job!' : 'Keep Practicing!'}
            </h2>

            <p className="text-gray-600 mb-6">You completed {lesson.title}</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(star => (
                <span key={star} className={`text-4xl ${
                  star <= calculateResults().starsEarned ? 'opacity-100' : 'opacity-20'
                }`}>
                  ⭐
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">
                  {calculateResults().phases.quiz.percentage}%
                </div>
                <div className="text-blue-700 text-sm">Quiz Score</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">
                  +{calculateResults().coinsEarned}
                </div>
                <div className="text-yellow-700 text-sm">Coins Earned</div>
              </div>
            </div>

            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-2xl hover:bg-green-600 transition-colors"
            >
              Continue →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
