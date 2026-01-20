import { createClient } from '@/lib/supabase/client'
import { sendEmail } from './resend'
import {
  weeklySummaryEmail,
  achievementEmail,
  streakMilestoneEmail,
  testResultEmail
} from './templates'
import { generateWeeklySummary } from '@/hooks/useWeeklySummary'

// Get parent's notification preferences and email
async function getParentPreferences(childId: string): Promise<{
  email: string
  parentName: string
  preferences: {
    weekly_summary: boolean
    achievement_unlocked: boolean
    streak_milestone: boolean
    test_results: boolean
  }
} | null> {
  const supabase = createClient()

  // Get child's parent_id
  const { data: child } = await supabase
    .from('children')
    .select('parent_id, name')
    .eq('id', childId)
    .single()

  if (!child) return null

  // Get parent's notification preferences
  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('parent_id', child.parent_id)
    .single()

  if (!prefs) {
    // No preferences set, use defaults (all enabled)
    // Get parent email from auth
    const { data: user } = await supabase.auth.admin.getUserById(child.parent_id)
    if (!user?.user?.email) return null

    return {
      email: user.user.email,
      parentName: user.user.user_metadata?.name || 'Parent',
      preferences: {
        weekly_summary: true,
        achievement_unlocked: true,
        streak_milestone: true,
        test_results: true
      }
    }
  }

  return {
    email: prefs.email,
    parentName: 'Parent', // Could be enhanced to store parent name
    preferences: {
      weekly_summary: prefs.weekly_summary,
      achievement_unlocked: prefs.achievement_unlocked,
      streak_milestone: prefs.streak_milestone,
      test_results: prefs.test_results
    }
  }
}

// Get child name
async function getChildName(childId: string): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('children')
    .select('name')
    .eq('id', childId)
    .single()
  return data?.name || null
}

// ============================================
// TRIGGER: Weekly Summary
// Called by cron job every Sunday
// ============================================
export async function sendWeeklySummaryEmail(childId: string): Promise<boolean> {
  const parent = await getParentPreferences(childId)
  if (!parent || !parent.preferences.weekly_summary) return false

  const summary = await generateWeeklySummary(childId)
  if (!summary) return false

  const { subject, html } = weeklySummaryEmail({
    parentName: parent.parentName,
    childName: summary.childName,
    totalProblems: summary.totalProblems,
    correctCount: summary.correctCount,
    accuracy: summary.accuracy,
    subjects: summary.subjectBreakdown.map(s => s.subject),
    weekStart: summary.weekStart
  })

  const result = await sendEmail({ to: parent.email, subject, html })
  return result.success
}

// ============================================
// TRIGGER: Achievement Unlocked
// Called when child earns an achievement
// ============================================
export async function sendAchievementEmail({
  childId,
  achievementName,
  achievementDescription
}: {
  childId: string
  achievementName: string
  achievementDescription: string
}): Promise<boolean> {
  const parent = await getParentPreferences(childId)
  if (!parent || !parent.preferences.achievement_unlocked) return false

  const childName = await getChildName(childId)
  if (!childName) return false

  const { subject, html } = achievementEmail({
    parentName: parent.parentName,
    childName,
    achievementName,
    achievementDescription
  })

  const result = await sendEmail({ to: parent.email, subject, html })
  return result.success
}

// ============================================
// TRIGGER: Streak Milestone
// Called when streak hits 7, 30, or 100 days
// ============================================
export async function sendStreakMilestoneEmail({
  childId,
  days
}: {
  childId: string
  days: number
}): Promise<boolean> {
  // Only send for milestone days
  if (![7, 30, 100].includes(days)) return false

  const parent = await getParentPreferences(childId)
  if (!parent || !parent.preferences.streak_milestone) return false

  const childName = await getChildName(childId)
  if (!childName) return false

  const { subject, html } = streakMilestoneEmail({
    parentName: parent.parentName,
    childName,
    days
  })

  const result = await sendEmail({ to: parent.email, subject, html })
  return result.success
}

// ============================================
// TRIGGER: Test Result
// Called after placement or weekly test
// ============================================
export async function sendTestResultEmail({
  childId,
  testType,
  score,
  totalQuestions,
  passed
}: {
  childId: string
  testType: string
  score: number
  totalQuestions: number
  passed: boolean
}): Promise<boolean> {
  const parent = await getParentPreferences(childId)
  if (!parent || !parent.preferences.test_results) return false

  const childName = await getChildName(childId)
  if (!childName) return false

  const { subject, html } = testResultEmail({
    parentName: parent.parentName,
    childName,
    testType,
    score,
    totalQuestions,
    passed
  })

  const result = await sendEmail({ to: parent.email, subject, html })
  return result.success
}

// ============================================
// BATCH: Send weekly summaries for all children
// Called by cron job every Sunday
// ============================================
export async function sendAllWeeklySummaries(): Promise<{ sent: number; failed: number }> {
  const supabase = createClient()

  // Get all children
  const { data: children } = await supabase
    .from('children')
    .select('id')

  if (!children) return { sent: 0, failed: 0 }

  let sent = 0
  let failed = 0

  for (const child of children) {
    const success = await sendWeeklySummaryEmail(child.id)
    if (success) sent++
    else failed++
  }

  return { sent, failed }
}
