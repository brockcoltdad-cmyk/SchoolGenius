'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import {
  BookOpen, Play, HelpCircle, CheckCircle, XCircle,
  ArrowRight, ArrowLeft, Star, Trophy, Lightbulb,
  SkipForward, Home
} from 'lucide-react'

interface LessonViewerProps {
  studentId: string
  subjectCode: string
  skillId: string
}

type Phase = 'rules' | 'demo' | 'guided' | 'independent' | 'challenge' | 'quiz' | 'complete'

interface Question {
  problem: string
  answer: string
  choices?: string[]
}

export default function LessonViewer({ studentId, subjectCode, skillId }: LessonViewerProps) {
  const [loading, setLoading] = useState(true)
  const [lesson, setLesson] = useState<any>(null)
  const [skillName, setSkillName] = useState<string>('')
  const [phase, setPhase] = useState<Phase>('rules')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [demoStep, setDemoStep] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    loadLesson()
  }, [subjectCode, skillId])

  async function loadLesson() {
    setLoading(true)

    // Get skill name from curriculum_skills
    const { data: skillData } = await supabase
      .from('curriculum_skills')
      .select('skill_name')
      .eq('id', skillId)
      .maybeSingle()

    if (skillData) {
      setSkillName(skillData.skill_name)
    }

    // Get lesson content by skill_id
    const { data } = await supabase
      .from('lesson_content')
      .select('*')
      .eq('skill_id', skillId)
      .maybeSingle()

    if (data) setLesson(data)
    setLoading(false)
  }

  function getCurrentQuestions(): Question[] {
    if (!lesson) return []
    let questions: any[] = []
    switch (phase) {
      case 'guided':
        questions = lesson.guided_practice || []
        break
      case 'independent':
        questions = lesson.independent_practice || []
        // Normalize: build choices from answer + wrong_answers
        questions = questions.map(q => ({
          problem: q.problem,
          answer: q.answer,
          choices: q.wrong_answers ? [q.answer, ...q.wrong_answers].sort(() => Math.random() - 0.5) : undefined
        }))
        break
      case 'challenge':
        questions = lesson.challenge_problems || []
        break
      case 'quiz':
        questions = lesson.quiz_questions || []
        questions = questions.map(q => ({
          problem: q.question,
          answer: q.correct_answer,
          choices: q.options
        }))
        break
      default:
        return []
    }
    return questions
  }

  function handleAnswerSelect(answer: string) {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  function checkAnswer() {
    const questions = getCurrentQuestions()
    const current = questions[questionIndex]
    const correct = selectedAnswer === current.answer
    setIsCorrect(correct)
    setShowResult(true)
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
    if (correct) setCoinsEarned(prev => prev + 5)
  }

  function nextQuestion() {
    const questions = getCurrentQuestions()
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      advancePhase()
    }
  }

  function advancePhase() {
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    const phases: Phase[] = ['rules', 'demo', 'guided', 'independent', 'challenge', 'quiz', 'complete']
    const currentIndex = phases.indexOf(phase)
    if (currentIndex < phases.length - 1) setPhase(phases[currentIndex + 1])
  }

  function restartLesson() {
    setPhase('rules')
    setScore({ correct: 0, total: 0 })
    setCoinsEarned(0)
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  async function completeLesson() {
    const percentage = Math.round((score.correct / score.total) * 100)
    await supabase.from('student_skill_progress').upsert({
      student_id: studentId,
      subject_code: subjectCode,
      skill_code: skillId,
      completed: percentage >= 80,
      best_score: percentage,
      attempts: 1,
      questions_correct: score.correct,
      questions_answered: score.total,
      last_practiced: new Date().toISOString()
    }, { onConflict: 'student_id,skill_code' })
    const finalCoins = coinsEarned + (percentage >= 80 ? 50 : 0)
    await supabase.rpc('add_coins', { p_child_id: studentId, p_amount: finalCoins })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lesson Coming Soon!</h1>
        <p className="text-gray-500 mb-6">This lesson is being prepared just for you.</p>
        <a href={`/kid/${studentId}`} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600">Go Back</a>
      </div>
    )
  }

  // PHASE: RULES
  if (phase === 'rules') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{lesson.skill_name}</h1>
          </div>
          <p className="text-white/80">Let's learn the rules!</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Rules & Concepts
          </h2>
          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{lesson.rules_text || 'No rules available'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={advancePhase} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
            <SkipForward className="w-5 h-5" /> Skip
          </button>
          <button onClick={advancePhase} className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-medium hover:bg-blue-600 flex items-center justify-center gap-2">
            Got It! <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // PHASE: DEMO
  if (phase === 'demo') {
    const demos = lesson.demo_problems || []
    const currentDemo = demos[demoStep]
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Watch and Learn</h1>
          </div>
          <p className="text-white/80">Example {demoStep + 1} of {demos.length || 1}</p>
        </div>
        {currentDemo && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <p className="text-lg font-medium text-gray-800">{currentDemo.problem}</p>
            </div>
            <h3 className="font-bold text-gray-700 mb-3">Step by Step:</h3>
            <div className="space-y-3">
              {currentDemo.steps?.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">{i + 1}</div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-gray-700"><span className="font-bold text-yellow-600">Answer: </span>{currentDemo.answer}</p>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          {demoStep > 0 && (
            <button onClick={() => setDemoStep(prev => prev - 1)} className="bg-gray-100 text-gray-600 px-6 py-4 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
          )}
          <button onClick={advancePhase} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
            <SkipForward className="w-5 h-5" /> Skip
          </button>
          <button onClick={() => { if (demos.length > 0 && demoStep < demos.length - 1) setDemoStep(prev => prev + 1); else advancePhase(); }}
            className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-medium hover:bg-blue-600 flex items-center justify-center gap-2">
            {demos.length > 0 && demoStep < demos.length - 1 ? 'Next' : 'Practice'} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // PHASE: QUESTIONS (guided, independent, challenge, quiz)
  if (['guided', 'independent', 'challenge', 'quiz'].includes(phase)) {
    const questions = getCurrentQuestions()
    const current = questions[questionIndex]
    const phaseInfo = {
      guided: { title: 'Guided Practice', color: 'from-blue-500 to-cyan-500', icon: HelpCircle },
      independent: { title: 'Independent Practice', color: 'from-orange-500 to-amber-500', icon: Star },
      challenge: { title: 'Challenge Round', color: 'from-red-500 to-pink-500', icon: Trophy },
      quiz: { title: 'Mastery Quiz', color: 'from-purple-500 to-violet-500', icon: CheckCircle }
    }
    const info = phaseInfo[phase as keyof typeof phaseInfo]
    const Icon = info.icon

    if (!current) {
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <p>No questions available</p>
          <button onClick={advancePhase} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl">Continue</button>
        </div>
      )
    }

    const choices = current.choices || [current.answer, 'Option B', 'Option C', 'Option D']

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className={`bg-gradient-to-br ${info.color} rounded-2xl p-6 text-white mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">{info.title}</h1>
                <p className="text-white/80">Question {questionIndex + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{score.correct}/{score.total}</div>
              <div className="text-sm text-white/80">Score</div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-lg font-medium text-gray-800">{current.problem}</p>
          </div>
          <div className="space-y-3">
            {choices.map((choice: string, i: number) => {
              let style = 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400'
              if (showResult) {
                if (choice === current.answer) style = 'bg-green-100 border-2 border-green-500'
                else if (choice === selectedAnswer) style = 'bg-red-100 border-2 border-red-500'
              } else if (selectedAnswer === choice) {
                style = 'bg-blue-100 border-2 border-blue-500'
              }
              return (
                <button key={i} onClick={() => handleAnswerSelect(choice)} disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${style}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">{String.fromCharCode(65 + i)}</div>
                    <span>{choice}</span>
                    {showResult && choice === current.answer && <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />}
                    {showResult && choice === selectedAnswer && choice !== current.answer && <XCircle className="w-6 h-6 text-red-500 ml-auto" />}
                  </div>
                </button>
              )
            })}
          </div>
          {showResult && (
            <div className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '🎉 Correct! +5 coins' : `❌ The answer is: ${current.answer}`}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!showResult ? (
            <button onClick={checkAnswer} disabled={!selectedAnswer}
              className={`flex-1 py-4 rounded-xl font-medium ${selectedAnswer ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Check Answer
            </button>
          ) : (
            <button onClick={nextQuestion} className="flex-1 bg-green-500 text-white py-4 rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2">
              {questionIndex < questions.length - 1 ? 'Next' : 'Continue'} <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {coinsEarned > 0 && (
          <div className="fixed bottom-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">🪙 {coinsEarned}</div>
        )}
      </div>
    )
  }

  // PHASE: COMPLETE
  if (phase === 'complete') {
    const percentage = Math.round((score.correct / score.total) * 100) || 0
    const passed = percentage >= 80
    const finalCoins = coinsEarned + (passed ? 50 : 0)

    useEffect(() => { completeLesson() }, [])

    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className={`rounded-2xl p-8 mb-6 ${passed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-orange-400 to-amber-500'}`}>
          <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>
          <h1 className="text-3xl font-bold text-white mb-2">{passed ? 'Skill Complete!' : 'Keep Practicing!'}</h1>
          <p className="text-white/90">{passed ? 'You mastered this skill!' : 'You need 80% to pass.'}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-5xl font-bold text-gray-800 mb-2">{percentage}%</div>
          <p className="text-gray-500">{score.correct} of {score.total} correct</p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="bg-yellow-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-600">🪙 {finalCoins}</div>
              <div className="text-sm text-yellow-700">Coins Earned</div>
            </div>
            {passed && (
              <div className="bg-green-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">⭐ +1</div>
                <div className="text-sm text-green-700">Skill Mastered</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {!passed && (
            <button onClick={restartLesson} className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-medium hover:bg-blue-600">Try Again</button>
          )}
          <a href={`/kid/${studentId}`} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
            <Home className="w-5 h-5" /> Dashboard
          </a>
        </div>
      </div>
    )
  }

  return null
}
