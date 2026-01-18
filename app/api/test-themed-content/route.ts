import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme') || 'battle'
    const ageGroup = searchParams.get('ageGroup') || 'k2'

    // Test 1: Kid Stuck Responses
    const { data: kidStuck, error: kidStuckError } = await supabase
      .from('kid_stuck_responses')
      .select('*')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .limit(3)

    // Test 2: Greeting Messages
    const { data: greetings, error: greetingsError } = await supabase
      .from('greeting_messages')
      .select('*')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .limit(2)

    // Test 3: Achievement Celebrations
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievement_celebrations')
      .select('*')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .limit(2)

    // Test 4: Gigi Personality
    const { data: gigiPersonality, error: gigiError } = await supabase
      .from('gigi_personality')
      .select('*')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .limit(2)

    // Test 5: Subject Analogies
    const { data: analogies, error: analogiesError } = await supabase
      .from('subject_analogies')
      .select('*')
      .eq('theme', theme)
      .eq('age_group', ageGroup)
      .limit(2)

    // Test 6: Count all themed content
    const { count: kidStuckCount } = await supabase
      .from('kid_stuck_responses')
      .select('*', { count: 'exact', head: true })
      .eq('theme', theme)

    const { count: greetingsCount } = await supabase
      .from('greeting_messages')
      .select('*', { count: 'exact', head: true })
      .eq('theme', theme)

    const { count: achievementsCount } = await supabase
      .from('achievement_celebrations')
      .select('*', { count: 'exact', head: true })
      .eq('theme', theme)

    return NextResponse.json({
      success: true,
      theme,
      ageGroup,
      samples: {
        kidStuck: kidStuck || [],
        greetings: greetings || [],
        achievements: achievements || [],
        gigiPersonality: gigiPersonality || [],
        analogies: analogies || []
      },
      counts: {
        kidStuck: kidStuckCount || 0,
        greetings: greetingsCount || 0,
        achievements: achievementsCount || 0
      },
      errors: {
        kidStuck: kidStuckError?.message,
        greetings: greetingsError?.message,
        achievements: achievementsError?.message,
        gigi: gigiError?.message,
        analogies: analogiesError?.message
      }
    })
  } catch (error) {
    console.error('Test themed content error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
