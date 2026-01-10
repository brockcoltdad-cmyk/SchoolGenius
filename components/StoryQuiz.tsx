'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, BookOpen, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

interface StoryQuizProps {
  storyId: string;
  storyTitle: string;
  questions: QuizQuestion[];
  childId: string;
  onComplete: (results: QuizResults) => void;
  onRetry?: () => void;
  onBackToReading?: () => void;
}

interface QuizResults {
  storyId: string;
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  coinsEarned: number;
  answers: { questionId: string; selected: string; correct: boolean }[];
}

export default function StoryQuiz({
  storyId,
  storyTitle,
  questions,
  childId,
  onComplete,
  onRetry,
  onBackToReading,
}: StoryQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string; correct: boolean }[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelectAnswer = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !question) return;

    const isCorrect = selectedAnswer === question.correct_answer;

    setAnswers(prev => [...prev, {
      questionId: question.id,
      selected: selectedAnswer,
      correct: isCorrect,
    }]);

    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        const allAnswers = [...answers, { questionId: question.id, selected: selectedAnswer, correct: isCorrect }];
        const correctCount = allAnswers.filter(a => a.correct).length;
        const percentage = Math.round((correctCount / questions.length) * 100);
        const passed = percentage >= 70;

        let coins = 0;
        if (percentage >= 90) coins = 50;
        else if (percentage >= 70) coins = 30;
        else if (percentage >= 50) coins = 10;

        const quizResults: QuizResults = {
          storyId,
          correct: correctCount,
          total: questions.length,
          percentage,
          passed,
          coinsEarned: coins,
          answers: allAnswers,
        };

        setResults(quizResults);
        setQuizComplete(true);
        onComplete(quizResults);
      }
    }, 1500);
  };

  if (quizComplete && results) {
    return (
      <div className="story-quiz max-w-2xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-7xl mb-4"
          >
            {results.percentage >= 90 ? '🏆' :
             results.percentage >= 70 ? '⭐' :
             results.percentage >= 50 ? '👍' : '📚'}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {results.passed ? 'Great Job!' : 'Keep Reading!'}
          </h2>

          <p className="text-gray-600 mb-6">{storyTitle}</p>

          <div className={`inline-block px-8 py-4 rounded-2xl mb-6 ${
            results.percentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <div className={`text-5xl font-bold ${
              results.percentage >= 70 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {results.correct}/{results.total}
            </div>
            <div className={`text-lg ${
              results.percentage >= 70 ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {results.percentage}% correct
            </div>
          </div>

          {results.coinsEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-lg font-bold">
                🪙 +{results.coinsEarned} coins
              </span>
            </motion.div>
          )}

          <div className="grid grid-cols-5 gap-2 mb-8 max-w-xs mx-auto">
            {results.answers.map((answer, idx) => (
              <div
                key={idx}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  answer.correct ? 'bg-green-500' : 'bg-red-400'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!results.passed && onBackToReading && (
              <button
                onClick={onBackToReading}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen size={20} />
                Re-read Story
              </button>
            )}

            {!results.passed && onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Try Quiz Again
              </button>
            )}

            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
            >
              {results.passed ? 'Continue →' : 'Back to Reading List'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="story-quiz max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-500">📝 Reading Quiz</span>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {question.question}
          </h3>

          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === letter;
              const isCorrect = letter === question.correct_answer;
              const showCorrect = showFeedback && isCorrect;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(letter)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center gap-3 ${
                    showCorrect
                      ? 'bg-green-100 border-green-500'
                      : showWrong
                      ? 'bg-red-100 border-red-500'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    showCorrect
                      ? 'bg-green-500 text-white'
                      : showWrong
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {showCorrect ? <CheckCircle size={18} /> :
                     showWrong ? <XCircle size={18} /> :
                     letter}
                  </span>

                  <span className={`text-lg ${
                    showCorrect ? 'text-green-700 font-bold' :
                    showWrong ? 'text-red-700' :
                    'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl mb-4 ${
                  selectedAnswer === question.correct_answer
                    ? 'bg-green-100'
                    : 'bg-red-100'
                }`}
              >
                {selectedAnswer === question.correct_answer ? (
                  <p className="text-green-700 font-bold flex items-center gap-2">
                    <CheckCircle size={20} />
                    Correct! 🎉
                  </p>
                ) : (
                  <p className="text-red-700">
                    <span className="font-bold flex items-center gap-2">
                      <XCircle size={20} />
                      Not quite.
                    </span>
                    {question.explanation && (
                      <span className="block mt-1 text-sm">{question.explanation}</span>
                    )}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!showFeedback && (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full py-4 bg-blue-500 text-white font-bold text-lg rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Check Answer'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export type { QuizResults, QuizQuestion };
