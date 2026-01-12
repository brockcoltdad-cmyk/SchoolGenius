'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { getThemeMessage } from '@/lib/theme-encouragement-messages'

interface Question {
  question: string
  correct_answer: string
  wrong_answers: string[]
  explanation?: string
}

interface QuizComponentProps {
  questions: Question[]
  title?: string
  onComplete?: (score: number, total: number) => void
  passingScore?: number
}

export default function QuizComponent({ questions, title = 'Quiz', onComplete, passingScore = 80 }: QuizComponentProps) {
  const { currentTheme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isComplete, setIsComplete] = useState(false)
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([])

  useEffect(() => {
    if (questions.length > 0) shuffleChoices(0)
  }, [questions])

  function shuffleChoices(index: number) {
    const q = questions[index]
    if (!q) return
    const allChoices = [q.correct_answer, ...q.wrong_answers]
    setShuffledChoices(allChoices.sort(() => Math.random() - 0.5))
  }

  function checkAnswer() {
    if (!selectedAnswer) return
    const current = questions[currentIndex]
    const isCorrect = selectedAnswer === current.correct_answer
    setShowResult(true)
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }))
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      shuffleChoices(currentIndex + 1)
    } else {
      setIsComplete(true)
      if (onComplete) onComplete(score.correct, questions.length)
    }
  }

  if (isComplete) {
    const percentage = Math.round((score.correct / questions.length) * 100)
    const passed = percentage >= passingScore

    // Get theme-aware completion message
    const completionMessage = passed
      ? getThemeMessage(currentTheme.id, 'complete')
      : getThemeMessage(currentTheme.id, 'struggling')

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
          <span className="text-4xl">{passed ? '🎉' : '💪'}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{completionMessage}</h2>
        <div className="text-4xl font-bold text-gray-800 my-4">{percentage}%</div>
        <p className="text-gray-500 mb-6">You got {score.correct} out of {questions.length} correct</p>
        <button onClick={() => { setCurrentIndex(0); setScore({ correct: 0, total: 0 }); setIsComplete(false); shuffleChoices(0); }}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 mx-auto">
          <RotateCcw className="w-5 h-5" /> Try Again
        </button>
      </div>
    )
  }

  const current = questions[currentIndex]
  if (!current) return null
  const choices = shuffledChoices.length > 0 ? shuffledChoices : [current.correct_answer, ...current.wrong_answers]

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">{title}</h2>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
      <div className="p-6">
        <p className="text-lg font-medium text-gray-800 mb-6">{current.question}</p>
        <div className="space-y-3 mb-6">
          {choices.map((choice, i) => {
            let style = 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400'
            if (showResult) {
              if (choice === current.correct_answer) style = 'bg-green-50 border-2 border-green-500'
              else if (choice === selectedAnswer) style = 'bg-red-50 border-2 border-red-500'
            } else if (selectedAnswer === choice) style = 'bg-blue-50 border-2 border-blue-500'
            return (
              <button key={i} onClick={() => !showResult && setSelectedAnswer(choice)} disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all ${style}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm">{String.fromCharCode(65 + i)}</div>
                  <span className="flex-1">{choice}</span>
                  {showResult && choice === current.correct_answer && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showResult && choice === selectedAnswer && choice !== current.correct_answer && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            )
          })}
        </div>
        {!showResult ? (
          <button onClick={checkAnswer} disabled={!selectedAnswer}
            className={`w-full py-4 rounded-xl font-medium ${selectedAnswer ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Check Answer
          </button>
        ) : (
          <button onClick={nextQuestion} className="w-full bg-green-500 text-white py-4 rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2">
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
