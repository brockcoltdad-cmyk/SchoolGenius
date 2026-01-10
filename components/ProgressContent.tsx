'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SUBJECTS = [
  { id: 'math', name: 'Math', icon: '🔢', color: 'bg-blue-500' },
  { id: 'reading', name: 'Reading', icon: '📚', color: 'bg-green-500' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-purple-500' },
  { id: 'writing', name: 'Writing', icon: '✏️', color: 'bg-yellow-500' },
  { id: 'social-studies', name: 'Social Studies', icon: '🌍', color: 'bg-teal-500' },
  { id: 'art', name: 'Art', icon: '🎨', color: 'bg-pink-500' },
]

interface ProgressContentProps {
  student: {
    id: string
    name: string
    grade_level: string
    coins: number
    current_streak: number
    longest_streak: number
  }
}

export default function ProgressContent({ student }: ProgressContentProps) {
  const totalLessons = 0
  const totalTime = 0
  const averageScore = 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/kid/${student.id}`} className="text-gray-500 hover:text-gray-700">← Back</Link>
            <div className="flex items-center gap-2">
              <span className="text-3xl">📊</span>
              <h1 className="font-bold text-indigo-600 text-xl">My Progress</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-indigo-100">Grade {student.grade_level}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">🔥 {student.current_streak || 0}</div>
                <p className="text-indigo-100">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-500">🪙 {student.coins || 0}</div>
              <p className="text-sm text-gray-500">Total Coins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-500">📚 {totalLessons}</div>
              <p className="text-sm text-gray-500">Lessons Done</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-500">⏱️ {totalTime}m</div>
              <p className="text-sm text-gray-500">Time Learning</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-500">🎯 {averageScore}%</div>
              <p className="text-sm text-gray-500">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">🔥 Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-orange-500">{student.current_streak || 0} days</p>
                <p className="text-sm text-gray-500">Current streak</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-400">{student.longest_streak || 0} days</p>
                <p className="text-sm text-gray-500">Longest streak</p>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs text-gray-400 mb-1">{day}</div>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                    i < (student.current_streak || 0) % 7 ? 'bg-orange-500 text-white' : 'bg-gray-100'
                  }`}>
                    {i < (student.current_streak || 0) % 7 ? '🔥' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">📚 Subject Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SUBJECTS.map((subject) => {
              const progress = Math.floor(Math.random() * 30)
              return (
                <div key={subject.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{subject.icon}</span>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">📝 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📋</div>
              <p>Complete some lessons to see your activity!</p>
              <Link href={`/kid/${student.id}`}>
                <button className="mt-4 text-indigo-600 hover:underline">Start Learning →</button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
