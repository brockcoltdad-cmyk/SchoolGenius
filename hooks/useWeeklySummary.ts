import { createClient } from '@/lib/supabase/client'

export interface WeeklySummary {
  childId: string
  childName: string
  weekStart: string
  totalProblems: number
  correctCount: number
  accuracy: number
  subjectBreakdown: {
    subject: string
    problems: number
    correct: number
    accuracy: number
  }[]
}

// Get Monday of current week
function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function generateWeeklySummary(childId: string): Promise<WeeklySummary | null> {
  const supabase = createClient()

  const weekStart = getWeekStart()
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  // Get child name
  const { data: child } = await supabase
    .from('children')
    .select('name')
    .eq('id', childId)
    .single()

  if (!child) return null

  // Get answer attempts for this week
  const { data: attempts } = await supabase
    .from('answer_attempts')
    .select('subject, correct')
    .eq('child_id', childId)
    .gte('answered_at', weekStart.toISOString())
    .lt('answered_at', weekEnd.toISOString())

  // Aggregate totals and by subject
  const subjectMap = new Map<string, { problems: number; correct: number }>()
  let totalProblems = 0
  let correctCount = 0

  for (const attempt of attempts || []) {
    totalProblems++
    if (attempt.correct) correctCount++

    const existing = subjectMap.get(attempt.subject) || { problems: 0, correct: 0 }
    existing.problems++
    if (attempt.correct) existing.correct++
    subjectMap.set(attempt.subject, existing)
  }

  const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    problems: data.problems,
    correct: data.correct,
    accuracy: data.problems > 0 ? Math.round((data.correct / data.problems) * 100) : 0
  }))

  return {
    childId,
    childName: child.name,
    weekStart: weekStart.toISOString().split('T')[0],
    totalProblems,
    correctCount,
    accuracy: totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 0,
    subjectBreakdown
  }
}

// Save to weekly_progress table
export async function saveWeeklySummary(summary: WeeklySummary): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('weekly_progress')
    .upsert({
      child_id: summary.childId,
      week_start_date: summary.weekStart,
      total_problems: summary.totalProblems,
      correct_count: summary.correctCount,
      subjects_practiced: summary.subjectBreakdown.map(s => s.subject)
    }, {
      onConflict: 'child_id,week_start_date'
    })

  if (error) {
    console.error('Failed to save weekly summary:', error.message)
    return false
  }
  return true
}

// Generate and save in one call
export async function generateAndSaveWeeklySummary(childId: string): Promise<WeeklySummary | null> {
  const summary = await generateWeeklySummary(childId)
  if (summary) {
    await saveWeeklySummary(summary)
  }
  return summary
}
