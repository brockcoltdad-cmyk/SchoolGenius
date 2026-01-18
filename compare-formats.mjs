#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  console.log('='.repeat(70))
  console.log('FORMAT COMPARISON: CORRECT vs WRONG')
  console.log('='.repeat(70))

  // Get a CORRECT format item (has tier1)
  console.log('\n' + '='.repeat(70))
  console.log('CORRECT FORMAT (has tier1/tier2) - What we NEED')
  console.log('='.repeat(70))

  const { data: correct } = await supabase
    .from('practice_problems')
    .select('*')
    .not('tier1', 'is', null)
    .eq('grade', 0)
    .limit(1)

  if (correct && correct[0]) {
    console.log('\n' + JSON.stringify(correct[0], null, 2))
  }

  // Get a WRONG format item (no tier1)
  console.log('\n' + '='.repeat(70))
  console.log('WRONG FORMAT (missing tier1/tier2) - What we HAVE')
  console.log('='.repeat(70))

  const { data: wrong } = await supabase
    .from('practice_problems')
    .select('*')
    .is('tier1', null)
    .eq('grade', 3)
    .limit(1)

  if (wrong && wrong[0]) {
    console.log('\n' + JSON.stringify(wrong[0], null, 2))
  }

  // Summary of differences
  console.log('\n' + '='.repeat(70))
  console.log('KEY DIFFERENCES')
  console.log('='.repeat(70))
  console.log(`
CORRECT FORMAT HAS:
  ✓ tier1.teach - Teaching explanation
  ✓ tier1.steps[] - Step-by-step breakdown
  ✓ tier1.steps[].visual - Visual component type + data
  ✓ tier1.steps[].voice_text - What Gigi says
  ✓ tier1.steps[].duration - Timing in ms
  ✓ tier2 - Simpler version for struggling kids
  ✓ visual_type - Type of visual to show

WRONG FORMAT HAS:
  ✓ question - The problem
  ✓ answer - The answer
  ✓ explanation - Text explanation
  ✗ NO tier1/tier2
  ✗ NO visual components
  ✗ NO voice_text for Gigi
  ✗ NO step-by-step breakdown
`)
}

run()
