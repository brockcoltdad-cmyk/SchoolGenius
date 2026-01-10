import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const subjectId = searchParams.get('subjectId')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('foundation_progress')
      .select('*, subjects(name, icon, color)')
      .eq('student_id', studentId)

    if (subjectId) {
      query = query.eq('subject_id', subjectId)
    }

    const { data, error } = await query.order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ progress: data })
  } catch (error) {
    console.error('Foundation GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, subjectId, topic, correct } = await request.json()

    if (!studentId || !subjectId || !topic) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: existing } = await supabase
      .from('foundation_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)
      .eq('topic', topic)
      .single()

    if (existing) {
      const newMastery = correct
        ? Math.min(100, existing.mastery_level + 10)
        : Math.max(0, existing.mastery_level - 5)

      const { data, error } = await supabase
        .from('foundation_progress')
        .update({
          mastery_level: newMastery,
          attempts: existing.attempts + 1,
          last_practiced: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error

      if (newMastery >= 100 && existing.mastery_level < 100) {
        const { data: student } = await supabase
          .from('children')
          .select('coins')
          .eq('id', studentId)
          .single()

        if (student) {
          await supabase
            .from('children')
            .update({ coins: student.coins + 20 })
            .eq('id', studentId)
        }

        await supabase.from('coin_transactions').insert({
          student_id: studentId,
          amount: 20,
          reason: `Mastered ${topic}!`
        })
      }

      return NextResponse.json({ progress: data, mastered: newMastery >= 100 })
    } else {
      const { data, error } = await supabase
        .from('foundation_progress')
        .insert({
          student_id: studentId,
          subject_id: subjectId,
          topic: topic,
          mastery_level: correct ? 10 : 0,
          attempts: 1,
          last_practiced: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ progress: data, mastered: false })
    }
  } catch (error) {
    console.error('Foundation POST error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
