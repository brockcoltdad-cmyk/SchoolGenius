import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: prizes } = await supabase
      .from('parent_prizes')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: false })

    const { data: redemptions } = await supabase
      .from('prize_redemptions')
      .select('*, children(name), parent_prizes(name)')
      .eq('status', 'pending')

    return NextResponse.json({
      prizes: prizes || [],
      pendingRedemptions: redemptions || []
    })
  } catch (error) {
    console.error('Prizes GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch prizes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, coinCost } = await request.json()

    if (!name || !coinCost) {
      return NextResponse.json({ error: 'Name and cost required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: prize, error } = await supabase
      .from('parent_prizes')
      .insert({
        parent_id: user.id,
        name,
        description: description || null,
        coin_cost: coinCost,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, prize })
  } catch (error) {
    console.error('Prizes POST error:', error)
    return NextResponse.json({ error: 'Failed to create prize' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const prizeId = searchParams.get('id')

    if (!prizeId) {
      return NextResponse.json({ error: 'Prize ID required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await supabase
      .from('parent_prizes')
      .delete()
      .eq('id', prizeId)
      .eq('parent_id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Prizes DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete prize' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { redemptionId, action } = await request.json()

    if (!redemptionId || !action) {
      return NextResponse.json({ error: 'Redemption ID and action required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (action === 'fulfill') {
      await supabase
        .from('prize_redemptions')
        .update({ status: 'fulfilled', fulfilled_at: new Date().toISOString() })
        .eq('id', redemptionId)
    } else if (action === 'reject') {
      const { data: redemption } = await supabase
        .from('prize_redemptions')
        .select('*, parent_prizes(coin_cost), children(coins)')
        .eq('id', redemptionId)
        .single()

      if (redemption) {
        await supabase
          .from('children')
          .update({ coins: (redemption.children?.coins || 0) + (redemption.parent_prizes?.coin_cost || 0) })
          .eq('id', redemption.student_id)

        await supabase
          .from('prize_redemptions')
          .update({ status: 'rejected' })
          .eq('id', redemptionId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Prizes PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update redemption' }, { status: 500 })
  }
}
