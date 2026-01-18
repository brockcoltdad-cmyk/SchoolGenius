#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('='.repeat(70))
console.log('CLEANUP V2: Deleting items WITHOUT tier1')
console.log('='.repeat(70))

async function run() {
  // Count before
  const { count: before } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  const { count: toDelete } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('tier1', null)

  console.log(`\nTotal items: ${before}`)
  console.log(`Items to delete (no tier1): ${toDelete}`)

  // Delete directly using filter (not .in())
  console.log('\nDeleting all items where tier1 is NULL...')

  const { error, count } = await supabase
    .from('practice_problems')
    .delete()
    .is('tier1', null)

  if (error) {
    console.log('Error:', error.message)
    console.log('Error details:', JSON.stringify(error, null, 2))
  } else {
    console.log(`Deleted successfully`)
  }

  // Verify
  const { count: after } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  const { count: remaining } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('tier1', null)

  console.log('\n' + '='.repeat(70))
  console.log('RESULT:')
  console.log('='.repeat(70))
  console.log(`\nItems before: ${before}`)
  console.log(`Items after: ${after}`)
  console.log(`Items deleted: ${before - after}`)
  console.log(`Items still without tier1: ${remaining}`)

  if (remaining === 0) {
    console.log('\n✓ SUCCESS: All items now have tier1/tier2!')
  }

  // Show by grade
  console.log('\nRemaining by grade:')
  for (let g = 0; g <= 12; g++) {
    const { count: c } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('grade', g)
    if (c > 0) console.log(`  Grade ${g}: ${c}`)
  }
}

run()
