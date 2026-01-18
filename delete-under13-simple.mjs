#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('='.repeat(60))
console.log('DELETING UNDER-13 SIMPLE FORMAT ITEMS')
console.log('='.repeat(60))

// These are the source_file patterns from continue-seeding.mjs
const filesToDelete = [
  'seeding-math-g5.json',
  'seeding-math-g8.json',
  'seeding-reading-g2.json',
  'seeding-reading-g3.json',
  'seeding-writing-g3.json',
  'seeding-writing-g4.json'
]

async function run() {
  // First, count what we're about to delete
  console.log('\nCounting items to delete...\n')

  let totalToDelete = 0
  for (const file of filesToDelete) {
    const { count, error } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('source_file', file)

    if (error) {
      console.log(`  Error counting ${file}: ${error.message}`)
    } else {
      console.log(`  ${file}: ${count} items`)
      totalToDelete += count || 0
    }
  }

  console.log(`\nTotal to delete: ${totalToDelete} items`)
  console.log('\nDeleting...\n')

  // Delete each source file's items
  let totalDeleted = 0
  for (const file of filesToDelete) {
    const { error, count } = await supabase
      .from('practice_problems')
      .delete()
      .eq('source_file', file)

    if (error) {
      console.log(`  ERROR deleting ${file}: ${error.message}`)
    } else {
      console.log(`  Deleted: ${file}`)
      totalDeleted++
    }
  }

  // Verify deletion
  console.log('\n' + '='.repeat(60))
  console.log('VERIFICATION')
  console.log('='.repeat(60))

  let remainingCount = 0
  for (const file of filesToDelete) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('source_file', file)

    console.log(`  ${file}: ${count || 0} remaining`)
    remainingCount += count || 0
  }

  if (remainingCount === 0) {
    console.log('\n SUCCESS: All under-13 simple format items deleted!')
  } else {
    console.log(`\n WARNING: ${remainingCount} items still remain`)
  }

  // Show what's left in total
  const { count: totalRemaining } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  console.log(`\nTotal items remaining in practice_problems: ${totalRemaining}`)
  console.log('='.repeat(60))
}

run()
