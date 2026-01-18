import { NextResponse } from 'next/server'
import {
  getStudentTheme,
  getKidStuckResponse,
  getGreeting,
  getAchievementCelebration,
  getTransitionPhrase,
  getTimeOfDay
} from '@/lib/themed-content'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const kidId = searchParams.get('kidId')
    const type = searchParams.get('type')

    if (!kidId) {
      return NextResponse.json({ error: 'kidId required' }, { status: 400 })
    }

    // Get student's theme and age group
    const { theme, ageGroup } = await getStudentTheme(kidId)

    // Handle different content types
    switch (type) {
      case 'greeting': {
        const timeOfDay = getTimeOfDay()
        const greeting = await getGreeting(theme, ageGroup, timeOfDay)
        return NextResponse.json({ greeting, theme, ageGroup })
      }

      case 'stuck': {
        const subject = searchParams.get('subject') || 'Math'
        const questionType = searchParams.get('questionType') || 'dont_get_it'
        const response = await getKidStuckResponse(theme, ageGroup, subject, questionType)
        return NextResponse.json({ response, theme, ageGroup })
      }

      case 'achievement': {
        const achievementType = searchParams.get('achievementType') || 'lesson_complete'
        const subject = searchParams.get('subject') || undefined
        const celebration = await getAchievementCelebration(theme, ageGroup, achievementType, subject)
        return NextResponse.json({ ...celebration, theme, ageGroup })
      }

      case 'transition': {
        const fromPhase = searchParams.get('fromPhase') || 'rules'
        const toPhase = searchParams.get('toPhase') || 'demo'
        const subject = searchParams.get('subject') || 'Math'
        const phrase = await getTransitionPhrase(theme, ageGroup, fromPhase, toPhase, subject)
        return NextResponse.json({ phrase, theme, ageGroup })
      }

      case 'theme': {
        // Just return theme info
        return NextResponse.json({ theme, ageGroup })
      }

      default:
        return NextResponse.json({ error: 'Invalid type. Use: greeting, stuck, achievement, transition, theme' }, { status: 400 })
    }
  } catch (error) {
    console.error('Themed content API error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
