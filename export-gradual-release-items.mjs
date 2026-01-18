#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('='.repeat(70))
console.log('EXPORTING GRADUAL RELEASE FORMAT ITEMS (i_do/we_do/you_do)')
console.log('='.repeat(70))

async function run() {
  // Get all items that have i_do but no tier1 (the gradual release format)
  console.log('\nFetching items with i_do/we_do/you_do format...\n')

  let allItems = []
  let offset = 0
  const batchSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('*')
      .is('tier1', null)
      .not('i_do', 'is', null)
      .range(offset, offset + batchSize - 1)

    if (error) {
      console.log('Error:', error.message)
      break
    }

    if (!data || data.length === 0) break

    allItems = allItems.concat(data)
    console.log(`  Fetched ${allItems.length} items so far...`)
    offset += batchSize

    if (data.length < batchSize) break
  }

  console.log(`\nTotal items with gradual release format: ${allItems.length}`)

  // Group by grade
  const byGrade = {}
  allItems.forEach(item => {
    const g = item.grade || 'null'
    if (!byGrade[g]) byGrade[g] = []
    byGrade[g].push(item)
  })

  console.log('\nBy grade:')
  Object.entries(byGrade).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([grade, items]) => {
    console.log(`  Grade ${grade}: ${items.length} items`)
  })

  // Save to file
  const outputFile = 'backups/gradual-release-format-items.json'
  writeFileSync(outputFile, JSON.stringify(allItems, null, 2))
  console.log(`\nSaved to: ${outputFile}`)

  // Also get items that are truly empty (no tier1, no i_do)
  console.log('\n' + '='.repeat(70))
  console.log('CHECKING FOR TRULY EMPTY ITEMS (no tier1, no i_do)')
  console.log('='.repeat(70))

  const { data: emptyItems, error: emptyErr } = await supabase
    .from('practice_problems')
    .select('id, grade, skill, source_file')
    .is('tier1', null)
    .is('i_do', null)
    .limit(100)

  if (emptyItems && emptyItems.length > 0) {
    console.log(`\nFound ${emptyItems.length}+ items with NO tier1 AND NO i_do:`)
    emptyItems.slice(0, 10).forEach(item => {
      console.log(`  ${item.id} | Grade ${item.grade} | ${item.source_file}`)
    })

    // Count total empty
    const { count: totalEmpty } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .is('tier1', null)
      .is('i_do', null)

    console.log(`\nTotal truly empty items: ${totalEmpty}`)

    // Save these too
    const { data: allEmpty } = await supabase
      .from('practice_problems')
      .select('*')
      .is('tier1', null)
      .is('i_do', null)

    if (allEmpty && allEmpty.length > 0) {
      writeFileSync('backups/simple-format-items.json', JSON.stringify(allEmpty, null, 2))
      console.log(`Saved to: backups/simple-format-items.json`)
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('EXPORT COMPLETE')
  console.log('='.repeat(70))
}

run()
