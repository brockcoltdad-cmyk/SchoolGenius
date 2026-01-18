import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /api/children/[id] - Get child info
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('children')
      .select('id, name, grade_level, preferred_voice_type, current_theme, coins, xp, level, current_streak')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching child:', error)
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/children/[id] - Update child info
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    // Allowed fields to update
    const allowedFields = ['preferred_voice_type', 'current_theme', 'name', 'grade_level']
    const updates: Record<string, any> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('children')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating child:', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
