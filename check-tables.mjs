#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🔍 Checking which tables exist and are accessible...\n')

const tables = [
  'kid_stuck_responses',
  'greeting_messages',
  'achievement_celebrations',
  'return_messages',
  'transition_phrases',
  'parent_struggle_guides',
  'subject_analogies',
  'gigi_personality'
]

for (const table of tables) {
  const { data, error } = await supabase.from(table).select('*').limit(1)

  if (error) {
    console.log(`❌ ${table}: ${error.message}`)
  } else {
    console.log(`✅ ${table}: Accessible (${data?.length || 0} rows found)`)
  }
}
