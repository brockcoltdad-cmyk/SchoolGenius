'use client'

import { useState, useEffect } from 'react'

export default function TestThemesPage() {
  const [theme, setTheme] = useState('battle')
  const [ageGroup, setAgeGroup] = useState('k2')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const themes = ['battle', 'princess', 'dinosaur', 'space', 'ninja']
  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  useEffect(() => {
    fetchData()
  }, [theme, ageGroup])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/test-themed-content?theme=${theme}&ageGroup=${ageGroup}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching themed content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🎨 Themed Content Test Page</h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full border rounded p-2"
              >
                {themes.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age Group:</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full border rounded p-2"
              >
                {ageGroups.map(ag => (
                  <option key={ag} value={ag}>
                    {ag === 'k2' && 'K-2 (Ages 5-8)'}
                    {ag === 'grades35' && 'Grades 3-5 (Ages 8-11)'}
                    {ag === 'grades68' && 'Grades 6-8 (Ages 11-14)'}
                    {ag === 'grades912' && 'Grades 9-12 (Ages 14-18)'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-xl">Loading themed content...</div>
          </div>
        )}

        {/* Results */}
        {!loading && data && (
          <div className="space-y-6">
            {/* Counts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">📊 Content Counts</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Kid Stuck Responses</div>
                  <div className="text-3xl font-bold">{data.counts?.kidStuck || 0}</div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Greetings</div>
                  <div className="text-3xl font-bold">{data.counts?.greetings || 0}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <div className="text-sm text-gray-600">Achievements</div>
                  <div className="text-3xl font-bold">{data.counts?.achievements || 0}</div>
                </div>
              </div>
            </div>

            {/* Kid Stuck Responses */}
            {data.samples?.kidStuck?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">💬 Kid Stuck Responses</h2>
                <div className="space-y-3">
                  {data.samples.kidStuck.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">
                        {item.question_type} • {item.subject} • {item.response_tone}
                      </div>
                      <div className="text-lg mt-1">{item.response}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Greetings */}
            {data.samples?.greetings?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">👋 Greeting Messages</h2>
                <div className="space-y-3">
                  {data.samples.greetings.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">
                        {item.time_of_day} • {item.energy_level}
                      </div>
                      <div className="text-lg mt-1">{item.greeting}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {data.samples?.achievements?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">🎉 Achievement Celebrations</h2>
                <div className="space-y-3">
                  {data.samples.achievements.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">
                        {item.achievement_type} • {item.excitement_level}
                      </div>
                      <div className="text-lg mt-1 font-semibold">{item.main_message}</div>
                      {item.secondary_message && (
                        <div className="text-base text-gray-600 mt-1">{item.secondary_message}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gigi Personality */}
            {data.samples?.gigiPersonality?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">🤖 Gigi Personality</h2>
                <div className="space-y-3">
                  {data.samples.gigiPersonality.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-pink-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">
                        {item.category} • {item.tone}
                      </div>
                      <div className="text-lg mt-1">{item.phrase}</div>
                      <div className="text-sm text-gray-400 mt-1">Use: {item.when_to_use}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Analogies */}
            {data.samples?.analogies?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">🧠 Subject Analogies</h2>
                <div className="space-y-3">
                  {data.samples.analogies.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-yellow-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">
                        {item.subject} • {item.concept} • {item.difficulty}
                      </div>
                      <div className="text-lg mt-1 font-semibold">{item.analogy}</div>
                      <div className="text-base text-gray-600 mt-1">{item.explanation}</div>
                      <div className="text-sm text-gray-400 mt-1">Use: {item.when_to_use}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {Object.values(data.errors || {}).some(e => e) && (
              <div className="bg-red-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-red-600">⚠️ Errors</h2>
                <pre className="text-sm">{JSON.stringify(data.errors, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
