export const dynamic = 'force-dynamic';

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const today = new Date().toISOString().split('T')[0]

    const { data: todayStreak } = await supabase
      .from('daily_streaks')
      .select('lessons_completed, coins_earned')
      .eq('child_id', studentId)
      .eq('date', today)
      .single()

    const { data: streaks } = await supabase
      .from('daily_streaks')
      .select('date')
      .eq('child_id', studentId)
      .order('date', { ascending: false })
      .limit(365)

    let currentStreak = 0
    if (streaks && streaks.length > 0) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      if (streaks[0].date === today || streaks[0].date === yesterday) {
        currentStreak = 1
        for (let i = 1; i < streaks.length; i++) {
          const prevDate = new Date(streaks[i - 1].date)
          const currDate = new Date(streaks[i].date)
          const diffDays = (prevDate.getTime() - currDate.getTime()) / 86400000
          if (diffDays === 1) {
            currentStreak++
          } else {
            break
          }
        }
      }
    }

    return NextResponse.json({
      lessonsToday: todayStreak?.lessons_completed || 0,
      coinsToday: todayStreak?.coins_earned || 0,
      currentStreak: currentStreak
    })
  } catch (error) {
    console.error('Progress GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
