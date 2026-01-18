#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('='.repeat(70))
console.log('CLEANUP: Deleting items WITHOUT tier1/tier2')
console.log('Keeping ONLY properly formatted items')
console.log('='.repeat(70))

async function run() {
  // First, count what we have
  console.log('\nBEFORE CLEANUP:\n')

  const { count: total } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  const { count: withTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier1', 'is', null)

  const { count: withoutTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('tier1', null)

  console.log(`  Total items: ${total}`)
  console.log(`  WITH tier1 (KEEP): ${withTier1}`)
  console.log(`  WITHOUT tier1 (DELETE): ${withoutTier1}`)

  // Delete items without tier1 in batches
  console.log('\nDeleting items without tier1...\n')

  let deleted = 0
  let batchNum = 0

  while (true) {
    batchNum++

    // Get IDs to delete (batch of 1000)
    const { data: toDelete } = await supabase
      .from('practice_problems')
      .select('id')
      .is('tier1', null)
      .limit(1000)

    if (!toDelete || toDelete.length === 0) break

    const ids = toDelete.map(item => item.id)

    // Delete them
    const { error } = await supabase
      .from('practice_problems')
      .delete()
      .in('id', ids)

    if (error) {
      console.log(`  Batch ${batchNum} ERROR: ${error.message}`)
      break
    }

    deleted += ids.length
    console.log(`  Batch ${batchNum}: Deleted ${ids.length} items (total: ${deleted})`)
  }

  // Verify
  console.log('\n' + '='.repeat(70))
  console.log('AFTER CLEANUP:')
  console.log('='.repeat(70))

  const { count: remaining } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  const { count: remainingWithTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier1', 'is', null)

  const { count: remainingWithoutTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('tier1', null)

  console.log(`\n  Total remaining: ${remaining}`)
  console.log(`  WITH tier1: ${remainingWithTier1}`)
  console.log(`  WITHOUT tier1: ${remainingWithoutTier1}`)

  // Breakdown by grade
  console.log('\nBy grade:')
  for (let grade = 0; grade <= 12; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('grade', grade)

    if (count > 0) {
      const ageGroup = grade <= 7 ? 'UNDER 13' : '14+'
      console.log(`  Grade ${grade}: ${count} items [${ageGroup}]`)
    }
  }

  if (remainingWithoutTier1 === 0) {
    console.log('\n✓ SUCCESS: Database is clean! Only tier1/tier2 items remain.')
  } else {
    console.log(`\n⚠ WARNING: ${remainingWithoutTier1} items still without tier1`)
  }
}

run()
