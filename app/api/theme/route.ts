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

    const { data: activeTheme } = await supabase
      .from('student_themes')
      .select('*, themes(*)')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .single()

    const { data: ownedThemes } = await supabase
      .from('student_themes')
      .select('theme_id, themes(*)')
      .eq('student_id', studentId)

    const { data: defaultTheme } = await supabase
      .from('themes')
      .select('*')
      .eq('price', 0)
      .single()

    return NextResponse.json({
      activeTheme: activeTheme?.themes || defaultTheme,
      ownedThemes: ownedThemes?.map(t => t.themes) || [defaultTheme]
    })
  } catch (error) {
    console.error('Theme GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, themeId } = await request.json()

    if (!studentId || !themeId) {
      return NextResponse.json({ error: 'Student ID and Theme ID required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: theme } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single()

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }

    if (theme.price > 0) {
      const { data: owned } = await supabase
        .from('student_themes')
        .select('id')
        .eq('student_id', studentId)
        .eq('theme_id', themeId)
        .single()

      if (!owned) {
        return NextResponse.json({ error: 'Theme not owned' }, { status: 403 })
      }
    }

    await supabase
      .from('student_themes')
      .update({ is_active: false })
      .eq('student_id', studentId)

    const { data: existing } = await supabase
      .from('student_themes')
      .select('id')
      .eq('student_id', studentId)
      .eq('theme_id', themeId)
      .single()

    if (existing) {
      await supabase
        .from('student_themes')
        .update({ is_active: true })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('student_themes')
        .insert({
          student_id: studentId,
          theme_id: themeId,
          is_active: true
        })
    }

    return NextResponse.json({ success: true, theme })
  } catch (error) {
    console.error('Theme POST error:', error)
    return NextResponse.json({ error: 'Failed to apply theme' }, { status: 500 })
  }
}
