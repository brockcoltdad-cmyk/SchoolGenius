import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { lessonId, studentId, score, totalQuestions } = await request.json()

    if (!lessonId || !studentId || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: lesson } = await supabase
      .from('curriculum_lessons')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const scorePercent = Math.round((score / totalQuestions) * 100)

    let coinsEarned = lesson.coins_reward
    if (scorePercent === 100) coinsEarned += 10
    else if (scorePercent >= 80) coinsEarned += 5

    await supabase.from('curriculum_lessons').update({
      completed: true,
      score: scorePercent,
      completed_at: new Date().toISOString()
    }).eq('id', lessonId)

    const { data: student } = await supabase
      .from('children')
      .select('coins')
      .eq('id', studentId)
      .single()

    await supabase.from('children')
      .update({ coins: (student?.coins || 0) + coinsEarned })
      .eq('id', studentId)

    return NextResponse.json({ success: true, coinsEarned, scorePercent })
  } catch (error) {
    console.error('Lesson complete error:', error)
    return NextResponse.json({ error: 'Failed to complete lesson' }, { status: 500 })
  }
}
