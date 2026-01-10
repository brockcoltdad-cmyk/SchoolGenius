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
      .select('id, coins, parent_id')
      .eq('id', studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { data: themes } = await supabase
      .from('themes')
      .select('*')
      .order('price', { ascending: true })

    const { data: ownedThemes } = await supabase
      .from('student_themes')
      .select('theme_id')
      .eq('student_id', studentId)

    const { data: shopItems } = await supabase
      .from('shop_items')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })

    const { data: ownedItems } = await supabase
      .from('student_purchases')
      .select('item_id')
      .eq('student_id', studentId)

    const { data: parentPrizes } = await supabase
      .from('parent_prizes')
      .select('*')
      .eq('parent_id', student.parent_id)
      .eq('is_active', true)

    const { data: pendingRedemptions } = await supabase
      .from('prize_redemptions')
      .select('prize_id, status')
      .eq('student_id', studentId)
      .eq('status', 'pending')

    return NextResponse.json({
      coins: student.coins,
      themes: themes || [],
      ownedThemeIds: ownedThemes?.map(t => t.theme_id) || [],
      shopItems: shopItems || [],
      ownedItemIds: ownedItems?.map(i => i.item_id) || [],
      parentPrizes: parentPrizes || [],
      pendingPrizeIds: pendingRedemptions?.map(r => r.prize_id) || []
    })
  } catch (error) {
    console.error('Shop GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch shop data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, itemType, itemId } = await request.json()

    if (!studentId || !itemType || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    let price = 0
    let itemName = ''

    if (itemType === 'theme') {
      const { data: theme } = await supabase
        .from('themes')
        .select('*')
        .eq('id', itemId)
        .single()

      if (!theme) {
        return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
      }

      const { data: existing } = await supabase
        .from('student_themes')
        .select('id')
        .eq('student_id', studentId)
        .eq('theme_id', itemId)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Already owned' }, { status: 400 })
      }

      price = theme.price
      itemName = theme.name

      if (student.coins < price) {
        return NextResponse.json({ error: 'Not enough coins' }, { status: 400 })
      }

      await supabase.from('student_themes').insert({
        student_id: studentId,
        theme_id: itemId
      })

    } else if (itemType === 'item') {
      const { data: item } = await supabase
        .from('shop_items')
        .select('*')
        .eq('id', itemId)
        .single()

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }

      const { data: existing } = await supabase
        .from('student_purchases')
        .select('id')
        .eq('student_id', studentId)
        .eq('item_id', itemId)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Already owned' }, { status: 400 })
      }

      price = item.price
      itemName = item.name

      if (student.coins < price) {
        return NextResponse.json({ error: 'Not enough coins' }, { status: 400 })
      }

      await supabase.from('student_purchases').insert({
        student_id: studentId,
        item_id: itemId
      })

    } else if (itemType === 'prize') {
      const { data: prize } = await supabase
        .from('parent_prizes')
        .select('*')
        .eq('id', itemId)
        .single()

      if (!prize) {
        return NextResponse.json({ error: 'Prize not found' }, { status: 404 })
      }

      price = prize.coin_cost
      itemName = prize.name

      if (student.coins < price) {
        return NextResponse.json({ error: 'Not enough coins' }, { status: 400 })
      }

      await supabase.from('prize_redemptions').insert({
        student_id: studentId,
        prize_id: itemId,
        status: 'pending'
      })
    }

    await supabase
      .from('children')
      .update({ coins: student.coins - price })
      .eq('id', studentId)

    await supabase.from('coin_transactions').insert({
      student_id: studentId,
      amount: -price,
      reason: `Purchased: ${itemName}`
    })

    return NextResponse.json({
      success: true,
      newBalance: student.coins - price,
      message: `You bought ${itemName}!`
    })
  } catch (error) {
    console.error('Shop POST error:', error)
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 })
  }
}
