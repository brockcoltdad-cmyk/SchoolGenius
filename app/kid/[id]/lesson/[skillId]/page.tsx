'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Play, CheckCircle, Star, ChevronRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoProblem {
  problem: string;
  answer: string;
  explanation: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface LessonContent {
  id: string;
  skill_id: string;
  skill_name: string;
  subject_code: string;
  rules_text: string;
  demo_problems: DemoProblem[];
  quiz_questions: QuizQuestion[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const skillId = params.skillId as string;
  
  const supabase = createClient();

  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'rules' | 'demo' | 'practice' | 'quiz' | 'complete'>('rules');
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [showDemoAnswer, setShowDemoAnswer] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [practiceResult, setPracticeResult] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const { data, error } = await supabase
          .from('lesson_content')
          .select('*')
          .eq('skill_id', skillId)
          .single();
        if (error) throw error;
        setLesson(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [skillId]);

  const phases = ['rules', 'demo', 'practice', 'quiz', 'complete'];
  const currentPhaseIndex = phases.indexOf(currentPhase);

  const handleNextDemo = () => {
    if (!lesson) return;
    setShowDemoAnswer(false);
    if (currentDemoIndex < lesson.demo_problems.length - 1) {
      setCurrentDemoIndex(prev => prev + 1);
    } else {
      setCurrentPhase('practice');
    }
  };

  const practiceProblems = lesson?.quiz_questions?.slice(0, 3) || [];

  const handlePracticeSubmit = () => {
    if (!practiceProblems[practiceIndex]) return;
    const correct = selectedAnswer === practiceProblems[practiceIndex].correct_answer;
    setPracticeResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setPracticeScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 5);
    }
  };

  const handleNextPractice = () => {
    setSelectedAnswer(null);
    setPracticeResult(null);
    if (practiceIndex < practiceProblems.length - 1) {
      setPracticeIndex(prev => prev + 1);
    } else {
      setCurrentPhase('quiz');
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
    }
  };

  const quizQuestions = lesson?.quiz_questions || [];

  const handleQuizSubmit = () => {
    if (!quizQuestions[currentQuizIndex] || !selectedAnswer) return;
    const correct = selectedAnswer === quizQuestions[currentQuizIndex].correct_answer;
    setQuizResult(correct ? 'correct' : 'wrong');
    setShowExplanation(true);
    if (correct) {
      setQuizScore(prev => prev + 1);
      setCoinsEarned(prev => prev + 10);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setQuizResult(null);
    setShowExplanation(false);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setCurrentPhase('complete');
      saveProgress();
    }
  };

  const saveProgress = async () => {
    try {
      const totalQuestions = quizQuestions.length;
      const percentage = totalQuestions > 0 ? Math.round((quizScore / totalQuestions) * 100) : 0;
      const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
      await supabase.from('lesson_progress').upsert({
        child_id: kidId,
        skill_id: skillId,
        subject_code: lesson?.subject_code,
        skill_name: lesson?.skill_name,
        completed: true,
        score: percentage,
        stars: stars,
        completed_at: new Date().toISOString()
      }, { onConflict: 'child_id,skill_id' });
      if (coinsEarned > 0) {
        const { data: child } = await supabase.from('children').select('coins').eq('id', kidId).single();
        if (child) {
          await supabase.from('children').update({ coins: (child.coins || 0) + coinsEarned }).eq('id', kidId);
        }
      }
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold text-xl">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <p className="text-white font-bold text-xl mb-4">😕 Lesson not found</p>
          <p className="text-white/70 mb-6">{error || 'This lesson is not available yet.'}</p>
          <button onClick={() => router.back()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{lesson.skill_name}</h1>
              <p className="text-white/60 text-sm">{lesson.subject_code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full">
            <span className="text-2xl">🪙</span>
            <span className="text-yellow-400 font-bold">+{coinsEarned}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between mb-8">
          {['rules', 'demo', 'practice', 'quiz'].map((phase, index) => (
            <div key={phase} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentPhase === phase ? 'bg-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/50' : index < currentPhaseIndex ? 'bg-green-500 text-white' : 'bg-white/20 text-white/60'}`}>
                {index < currentPhaseIndex ? <CheckCircle className="w-6 h-6" /> : <span className="text-lg">{['📚', '🎬', '✏️', '⭐'][index]}</span>}
              </div>
              {index < 3 && <div className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 rounded transition-all ${index < currentPhaseIndex ? 'bg-green-500' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentPhase} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">

            {currentPhase === 'rules' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><span className="text-3xl">📚</span>Learn the Rules</h2>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">{lesson.rules_text || 'No rules available.'}</p>
                </div>
                <button onClick={() => setCurrentPhase('demo')} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />Watch Examples<ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {currentPhase === 'demo' && lesson.demo_problems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-3xl">🎬</span>Watch & Learn</h2>
                <p className="text-white/60 mb-6">Example {currentDemoIndex + 1} of {lesson.demo_problems.length}</p>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-xl font-bold mb-4">{lesson.demo_problems[currentDemoIndex].problem}</p>
                  {showDemoAnswer ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-4">
                        <p className="text-green-400 font-bold text-2xl">Answer: {lesson.demo_problems[currentDemoIndex].answer}</p>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                        <p className="text-blue-300">💡 {lesson.demo_problems[currentDemoIndex].explanation}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <button onClick={() => setShowDemoAnswer(true)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl">Show Answer</button>
                  )}
                </div>
                {showDemoAnswer && (
                  <button onClick={handleNextDemo} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                    {currentDemoIndex < lesson.demo_problems.length - 1 ? <>Next Example <ChevronRight className="w-5 h-5" /></> : <>Start Practice <ChevronRight className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            )}

            {currentPhase === 'practice' && practiceProblems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-3xl">✏️</span>Practice Time</h2>
                <p className="text-white/60 mb-6">Question {practiceIndex + 1} of {practiceProblems.length}</p>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-xl font-bold mb-6">{practiceProblems[practiceIndex].question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {practiceProblems[practiceIndex].options.map((option, idx) => (
                      <button key={idx} onClick={() => !practiceResult && setSelectedAnswer(option)} disabled={!!practiceResult} className={`p-4 rounded-xl text-left font-bold transition-all ${practiceResult ? option === practiceProblems[practiceIndex].correct_answer ? 'bg-green-500 text-white' : option === selectedAnswer ? 'bg-red-500 text-white' : 'bg-white/10 text-white/50' : selectedAnswer === option ? 'bg-blue-500 text-white scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}>{option}</button>
                    ))}
                  </div>
                </div>
                {practiceResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 ${practiceResult === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <p className={`font-bold ${practiceResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>{practiceResult === 'correct' ? '🎉 Correct! +5 coins' : '❌ Not quite!'}</p>
                    <p className="text-white/80 mt-2">{practiceProblems[practiceIndex].explanation}</p>
                  </motion.div>
                )}
                {!practiceResult ? (
                  <button onClick={handlePracticeSubmit} disabled={!selectedAnswer} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl">Check Answer</button>
                ) : (
                  <button onClick={handleNextPractice} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                    {practiceIndex < practiceProblems.length - 1 ? <>Next Question <ChevronRight className="w-5 h-5" /></> : <>Start Quiz <Star className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            )}

            {currentPhase === 'quiz' && quizQuestions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-3xl">⭐</span>Quiz Time</h2>
                <p className="text-white/60 mb-6">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-xl font-bold mb-6">{quizQuestions[currentQuizIndex].question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizQuestions[currentQuizIndex].options.map((option, idx) => (
                      <button key={idx} onClick={() => !quizResult && setSelectedAnswer(option)} disabled={!!quizResult} className={`p-4 rounded-xl text-left font-bold transition-all ${quizResult ? option === quizQuestions[currentQuizIndex].correct_answer ? 'bg-green-500 text-white' : option === selectedAnswer ? 'bg-red-500 text-white' : 'bg-white/10 text-white/50' : selectedAnswer === option ? 'bg-yellow-500 text-black scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}>{option}</button>
                    ))}
                  </div>
                </div>
                {showExplanation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 ${quizResult === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <p className={`font-bold ${quizResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>{quizResult === 'correct' ? '🎉 Correct! +10 coins' : '❌ Not quite!'}</p>
                    <p className="text-white/80 mt-2">{quizQuestions[currentQuizIndex].explanation}</p>
                  </motion.div>
                )}
                {!quizResult ? (
                  <button onClick={handleQuizSubmit} disabled={!selectedAnswer} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl">Submit Answer</button>
                ) : (
                  <button onClick={handleNextQuiz} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
                    {currentQuizIndex < quizQuestions.length - 1 ? <>Next Question <ChevronRight className="w-5 h-5" /></> : <>See Results <Trophy className="w-5 h-5" /></>}
                  </button>
                )}
              </div>
            )}

            {currentPhase === 'complete' && (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}><div className="text-8xl mb-6">🏆</div></motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">Lesson Complete!</h2>
                <div className="bg-white/10 rounded-xl p-6 mb-6 inline-block">
                  <p className="text-white/60 mb-2">Quiz Score</p>
                  <p className="text-4xl font-bold text-white">{quizScore} / {quizQuestions.length}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3].map((star) => (<Star key={star} className={`w-8 h-8 ${(quizScore / quizQuestions.length) >= (star * 0.33) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />))}
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-xl p-4 mb-8"><p className="text-yellow-400 text-2xl font-bold">🪙 +{coinsEarned} Coins Earned!</p></div>
                <button onClick={() => router.back()} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-xl">Back to Lessons</button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
