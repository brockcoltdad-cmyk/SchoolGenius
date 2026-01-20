import { createClient } from '@/lib/supabase/client'

// ============================================
// 1. ANSWER TRACKING
// Call this when a kid submits an answer
// ============================================
export async function trackAnswer({
  childId,
  problemId,
  subject,
  correct
}: {
  childId: string
  problemId: string
  subject: string
  correct: boolean
}) {
  const supabase = createClient()

  const { error } = await supabase
    .from('answer_attempts')
    .insert({
      child_id: childId,
      problem_id: problemId,
      subject: subject,
      correct: correct,
      answered_at: new Date().toISOString()
    })

  if (error) console.error('Failed to track answer:', error.message)
  return !error
}

// ============================================
// 2. SESSION TRACKING
// Call startSession when kid enters a subject
// Call endSession when they leave or after inactivity
// ============================================
export async function startSession({
  childId,
  subject
}: {
  childId: string
  subject: string
}): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('learning_sessions')
    .insert({
      child_id: childId,
      subject: subject,
      started_at: new Date().toISOString(),
      problems_completed: 0
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to start session:', error.message)
    return null
  }

  return data.id
}

export async function endSession({
  sessionId,
  problemsCompleted
}: {
  sessionId: string
  problemsCompleted: number
}) {
  const supabase = createClient()

  const { error } = await supabase
    .from('learning_sessions')
    .update({
      ended_at: new Date().toISOString(),
      problems_completed: problemsCompleted
    })
    .eq('id', sessionId)

  if (error) console.error('Failed to end session:', error.message)
  return !error
}

// ============================================
// 3. SKILL MASTERY TRACKING
// Call when kid passes/fails a skill assessment
// ============================================
export async function trackSkillAttempt({
  childId,
  skillId,
  passed
}: {
  childId: string
  skillId: string
  passed: boolean
}) {
  const supabase = createClient()

  // Check for existing record
  const { data: existing } = await supabase
    .from('skill_mastery')
    .select('id, attempts, passed')
    .eq('child_id', childId)
    .eq('skill_id', skillId)
    .single()

  if (existing) {
    // Update existing record
    const updateData: { attempts: number; passed?: boolean; passed_at?: string } = {
      attempts: existing.attempts + 1
    }

    // Once passed, stays passed
    if (passed && !existing.passed) {
      updateData.passed = true
      updateData.passed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('skill_mastery')
      .update(updateData)
      .eq('id', existing.id)

    if (error) console.error('Failed to update skill mastery:', error.message)
    return !error
  } else {
    // Create new record
    const { error } = await supabase
      .from('skill_mastery')
      .insert({
        child_id: childId,
        skill_id: skillId,
        attempts: 1,
        passed: passed,
        passed_at: passed ? new Date().toISOString() : null
      })

    if (error) console.error('Failed to track skill mastery:', error.message)
    return !error
  }
}

// ============================================
// 4. TEST RESULT TRACKING
// Call after placement test or weekly test
// ============================================
export async function trackTestResult({
  childId,
  testType,
  subject,
  score,
  totalQuestions
}: {
  childId: string
  testType: 'placement' | 'weekly' | 'diagnostic'
  subject: string
  score: number
  totalQuestions: number
}) {
  const supabase = createClient()

  const { error } = await supabase
    .from('test_results')
    .insert({
      child_id: childId,
      test_type: testType,
      subject: subject,
      score: score,
      total_questions: totalQuestions,
      taken_at: new Date().toISOString()
    })

  if (error) console.error('Failed to track test result:', error.message)
  return !error
}
