import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type Theme = 'battle' | 'princess' | 'dinosaur' | 'space' | 'ninja' | 'neutral'
export type AgeGroup = 'k2' | 'grades35' | 'grades68' | 'grades912'

interface StudentThemeData {
  theme: Theme
  ageGroup: AgeGroup
}

/**
 * Get student's active theme and age group
 * Falls back to neutral theme and k2 age group if not found
 */
export async function getStudentTheme(kidId: string): Promise<StudentThemeData> {
  try {
    // Fetch kid's profile to get grade/age
    const { data: kid, error: kidError } = await supabase
      .from('children')
      .select('grade_level')
      .eq('id', kidId)
      .single()

    console.log('Kid data:', kid, 'Error:', kidError)
    if (kidError) {
      console.error('Failed to fetch kid data:', kidError)
      throw kidError
    }

    // Fetch active theme
    const { data: themeData, error: themeError } = await supabase
      .from('student_themes')
      .select('theme')
      .eq('student_id', kidId)
      .eq('is_active', true)
      .single()

    // Determine age group from grade
    const grade = kid?.grade_level || 'K'
    const ageGroup = getAgeGroupFromGrade(grade)

    console.log('Theme data:', themeData, 'Theme error:', themeError)
    console.log('Final result:', { theme: themeData?.theme || 'neutral', ageGroup })

    return {
      theme: (themeData?.theme as Theme) || 'neutral',
      ageGroup
    }
  } catch (error) {
    console.error('Error fetching student theme:', error)
    return {
      theme: 'neutral',
      ageGroup: 'k2'
    }
  }
}

/**
 * Convert grade to age group
 */
function getAgeGroupFromGrade(grade: string | number): AgeGroup {
  const gradeStr = grade.toString().toUpperCase()

  if (gradeStr === 'K' || gradeStr === '1' || gradeStr === '2') return 'k2'
  if (gradeStr === '3' || gradeStr === '4' || gradeStr === '5') return 'grades35'
  if (gradeStr === '6' || gradeStr === '7' || gradeStr === '8') return 'grades68'
  if (gradeStr === '9' || gradeStr === '10' || gradeStr === '11' || gradeStr === '12') return 'grades912'

  return 'k2' // Default fallback
}

/**
 * Get a random "kid stuck" response for when student needs help
 */
export async function getKidStuckResponse(
  theme: Theme,
  ageGroup: AgeGroup,
  subject: string = 'Math',
  questionType: string = 'dont_get_it'
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('kid_stuck_responses')
      .select('response')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .eq('subject', subject)
      .eq('question_type', questionType)

    if (error) throw error
    if (!data || data.length === 0) {
      return "No worries! Let's try a different way! 💪✨"
    }

    // Return random response from matches
    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex].response
  } catch (error) {
    console.error('Error fetching kid stuck response:', error)
    return "No worries! Let's try a different way! 💪✨"
  }
}

/**
 * Get a random greeting message
 */
export async function getGreeting(
  theme: Theme,
  ageGroup: AgeGroup,
  timeOfDay: 'morning' | 'afternoon' | 'evening' = 'afternoon'
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('greeting_messages')
      .select('greeting')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .eq('time_of_day', timeOfDay)

    if (error) throw error
    if (!data || data.length === 0) {
      return "Welcome back! Ready to learn? 🌟"
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex].greeting
  } catch (error) {
    console.error('Error fetching greeting:', error)
    return "Welcome back! Ready to learn? 🌟"
  }
}

/**
 * Get a random achievement celebration
 */
export async function getAchievementCelebration(
  theme: Theme,
  ageGroup: AgeGroup,
  achievementType: string = 'lesson_complete',
  subject?: string
): Promise<{ main: string; secondary?: string }> {
  try {
    const query = supabase
      .from('achievement_celebrations')
      .select('main_message, secondary_message')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .eq('achievement_type', achievementType)

    if (subject) {
      query.eq('subject', subject)
    }

    const { data, error } = await query

    if (error) throw error
    if (!data || data.length === 0) {
      return {
        main: "Amazing work! 🎉",
        secondary: "You're getting better every day! 🌟"
      }
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    return {
      main: data[randomIndex].main_message,
      secondary: data[randomIndex].secondary_message || undefined
    }
  } catch (error) {
    console.error('Error fetching achievement celebration:', error)
    return {
      main: "Amazing work! 🎉",
      secondary: "You're getting better every day! 🌟"
    }
  }
}

/**
 * Get a transition phrase between lesson phases
 */
export async function getTransitionPhrase(
  theme: Theme,
  ageGroup: AgeGroup,
  fromPhase: string,
  toPhase: string,
  subject: string = 'Math'
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('transition_phrases')
      .select('phrase')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .eq('from_phase', fromPhase)
      .eq('to_phase', toPhase)
      .eq('subject', subject)

    if (error) throw error
    if (!data || data.length === 0) {
      return "Let's keep going! 🚀"
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex].phrase
  } catch (error) {
    console.error('Error fetching transition phrase:', error)
    return "Let's keep going! 🚀"
  }
}

/**
 * Get time of day based on current hour
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
