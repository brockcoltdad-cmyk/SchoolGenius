'use client'

import { useEffect, useState } from 'react'
import { generateWeeklySummary, WeeklySummary } from '@/hooks/useWeeklySummary'
import { generateReportText } from '@/hooks/useProgressReport'

interface WeeklyProgressCardProps {
  childId: string
  variant?: 'kid' | 'parent'
}

export default function WeeklyProgressCard({ childId, variant = 'kid' }: WeeklyProgressCardProps) {
  const [summary, setSummary] = useState<WeeklySummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await generateWeeklySummary(childId)
      setSummary(data)
      setLoading(false)
    }
    load()
  }, [childId])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <p className="text-gray-500">Unable to load progress</p>
      </div>
    )
  }

  // Kid-friendly view
  if (variant === 'kid') {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
        <h2 className="text-xl font-bold mb-4">This Week&apos;s Progress</h2>

        {/* Big numbers */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{summary.totalProblems}</div>
            <div className="text-sm opacity-90">Problems</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{summary.correctCount}</div>
            <div className="text-sm opacity-90">Correct</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{summary.accuracy}%</div>
            <div className="text-sm opacity-90">Accuracy</div>
          </div>
        </div>

        {/* Gigi's message */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🦒</div>
            <p className="text-sm leading-relaxed">
              {generateReportText(summary)}
            </p>
          </div>
        </div>

        {/* Subject badges */}
        {summary.subjectBreakdown.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.subjectBreakdown.map((subject) => (
              <span
                key={subject.subject}
                className="bg-white/20 px-3 py-1 rounded-full text-sm"
              >
                {subject.subject}: {subject.accuracy}%
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Parent view
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Weekly Progress: {summary.childName}
      </h2>
      <p className="text-sm text-gray-500 mb-4">Week of {summary.weekStart}</p>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.totalProblems}</div>
          <div className="text-sm text-gray-600">Total Problems</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.correctCount}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{summary.accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
      </div>

      {/* Subject breakdown table */}
      {summary.subjectBreakdown.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Subject Breakdown</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Subject</th>
                  <th className="text-center p-3 font-medium text-gray-600">Problems</th>
                  <th className="text-center p-3 font-medium text-gray-600">Correct</th>
                  <th className="text-center p-3 font-medium text-gray-600">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {summary.subjectBreakdown.map((subject) => (
                  <tr key={subject.subject} className="border-t border-gray-200">
                    <td className="p-3 font-medium">{subject.subject}</td>
                    <td className="p-3 text-center">{subject.problems}</td>
                    <td className="p-3 text-center">{subject.correct}</td>
                    <td className="p-3 text-center">
                      <span className={`font-medium ${
                        subject.accuracy >= 80 ? 'text-green-600' :
                        subject.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {subject.accuracy}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No activity message */}
      {summary.totalProblems === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-700">No activity recorded this week</p>
        </div>
      )}
    </div>
  )
}
