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

    const { data: student } = await supabase
      .from('children')
      .select('*')
      .eq('id', studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value', { ascending: true })

    const { data: earnedAchievements } = await supabase
      .from('student_achievements')
      .select('achievement_id, earned_at')
      .eq('child_id', studentId)

    const earnedIds = earnedAchievements?.map(a => a.achievement_id) || []
    const earnedMap = new Map(earnedAchievements?.map(a => [a.achievement_id, a.earned_at]) || [])

    const { count: lessonsCompleted } = await supabase
      .from('curriculum_lessons')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', studentId)
      .eq('completed', true)

    const { count: perfectScores } = await supabase
      .from('curriculum_lessons')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', studentId)
      .eq('completed', true)
      .gte('score', 100)

    const { count: storiesCreated } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', studentId)

    const { count: chatMessages } = await supabase
      .from('gigi_chats')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', studentId)
      .eq('sender', 'user')

    const { data: streaks } = await supabase
      .from('daily_streaks')
      .select('date')
      .eq('child_id', studentId)
      .order('date', { ascending: false })
      .limit(365)

    let currentStreak = 0
    if (streaks && streaks.length > 0) {
      const today = new Date().toISOString().split('T')[0]
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

    const stats = {
      lessonsCompleted: lessonsCompleted || 0,
      perfectScores: perfectScores || 0,
      coinsEarned: student.coins || 0,
      currentStreak: currentStreak,
      storiesCreated: storiesCreated || 0,
      chatMessages: chatMessages || 0
    }

    const achievements = allAchievements?.map(achievement => {
      let progress = 0
      let current = 0

      switch (achievement.requirement_type) {
        case 'lessons_completed':
          current = stats.lessonsCompleted
          progress = Math.min(100, (current / achievement.requirement_value) * 100)
          break
        case 'perfect_scores':
          current = stats.perfectScores
          progress = Math.min(100, (current / achievement.requirement_value) * 100)
          break
        case 'coins_earned':
          current = stats.coinsEarned
          progress = Math.min(100, (current / achievement.requirement_value) * 100)
          break
        case 'streak_days':
          current = stats.currentStreak
          progress = Math.min(100, (current / achievement.requirement_value) * 100)
          break
        case 'stories_created':
          current = stats.storiesCreated
          progress = Math.min(100, (current / achievement.requirement_value) * 100)
          break
        case 'items_purchased':
          current = stats.chatMessages > 0 ? 1 : 0
          progress = current >= achievement.requirement_value ? 100 : 0
          break
      }

      return {
        ...achievement,
        earned: earnedIds.includes(achievement.id),
        earnedAt: earnedMap.get(achievement.id) || null,
        progress: Math.round(progress),
        current: current
      }
    }) || []

    return NextResponse.json({
      achievements,
      stats,
      totalEarned: earnedIds.length,
      totalAchievements: allAchievements?.length || 0
    })
  } catch (error) {
    console.error('Achievements GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}
