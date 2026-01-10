import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json()
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

    const { data: allAchievements } = await supabase.from('achievements').select('*')
    const { data: earnedAchievements } = await supabase
      .from('student_achievements')
      .select('achievement_id')
      .eq('student_id', studentId)

    const earnedIds = new Set(earnedAchievements?.map(a => a.achievement_id) || [])

    const { count: lessonsCompleted } = await supabase
      .from('curriculum_lessons')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('completed', true)

    const newlyEarned: string[] = []
    let coinsAwarded = 0

    for (const achievement of allAchievements || []) {
      if (earnedIds.has(achievement.id)) continue

      let earned = false
      if (achievement.requirement_type === 'lessons_completed') {
        earned = (lessonsCompleted || 0) >= achievement.requirement_value
      } else if (achievement.requirement_type === 'coins_earned') {
        earned = (student.coins || 0) >= achievement.requirement_value
      }

      if (earned) {
        await supabase.from('student_achievements').insert({
          student_id: studentId,
          achievement_id: achievement.id
        })
        newlyEarned.push(achievement.name)
        coinsAwarded += achievement.coin_reward
      }
    }

    if (coinsAwarded > 0) {
      await supabase.from('children')
        .update({ coins: student.coins + coinsAwarded })
        .eq('id', studentId)
    }

    return NextResponse.json({ success: true, newlyEarned, coinsAwarded })
  } catch (error) {
    console.error('Achievement check error:', error)
    return NextResponse.json({ error: 'Check failed' }, { status: 500 })
  }
}
