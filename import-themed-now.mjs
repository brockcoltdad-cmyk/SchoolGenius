#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🎨 IMPORTING THEMED CONTENT')
console.log('='.repeat(80))
console.log()

const CONTENT = [
  { file: './themed-output/kid-stuck-responses-themed.json', table: 'kid_stuck_responses', name: 'Kid Stuck Responses' },
  { file: './themed-output/greeting-messages-themed.json', table: 'greeting_messages', name: 'Greeting Messages' },
  { file: './themed-output/achievement-celebrations-themed.json', table: 'achievement_celebrations', name: 'Achievement Celebrations' },
  { file: './themed-output/return-messages-themed.json', table: 'return_messages', name: 'Return Messages' },
  { file: './themed-output/transition-phrases-themed.json', table: 'transition_phrases', name: 'Transition Phrases' },
  { file: './themed-output/parent-struggle-guides.json', table: 'parent_struggle_guides', name: 'Parent Struggle Guides' },
  { file: './themed-output/subject-analogies-themed.json', table: 'subject_analogies', name: 'Subject Analogies' },
  { file: './themed-output/gigi-personality-themed.json', table: 'gigi_personality', name: 'Gigi Personality' }
]

async function importContent(mapping) {
  console.log(`📦 ${mapping.name}`)
  console.log(`   Table: ${mapping.table}`)

  try {
    const jsonContent = await readFile(mapping.file, 'utf-8')
    const data = JSON.parse(jsonContent)
    console.log(`   Items: ${data.length}`)

    if (data.length === 0) {
      console.log(`   ⚠️  No items - skipping`)
      console.log()
      return { success: true, count: 0, errors: 0 }
    }

    const BATCH_SIZE = 50
    let totalImported = 0
    let errors = 0

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE)
      const { data: inserted, error } = await supabase.from(mapping.table).insert(batch).select('id')

      if (error) {
        console.log(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
        errors += batch.length
      } else {
        totalImported += inserted?.length || batch.length
      }
    }

    if (errors > 0) {
      console.log(`   ⚠️  Imported: ${totalImported}, Failed: ${errors}`)
    } else {
      console.log(`   ✅ Imported: ${totalImported}`)
    }
    console.log()
    return { success: errors === 0, count: totalImported, errors }
  } catch (err) {
    console.error(`   ❌ Failed: ${err.message}`)
    console.log()
    return { success: false, count: 0, errors: -1 }
  }
}

async function main() {
  const startTime = Date.now()
  const results = []

  for (const mapping of CONTENT) {
    const result = await importContent(mapping)
    results.push({ name: mapping.name, ...result })
  }

  console.log('='.repeat(80))
  console.log('📊 SUMMARY')
  console.log('='.repeat(80))

  let totalSuccess = 0
  let totalFailed = 0

  results.forEach(r => {
    const status = r.success ? '✅' : '❌'
    console.log(`${status} ${r.name}: ${r.count} items`)
    totalSuccess += r.count
    totalFailed += r.errors
  })

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log()
  console.log(`✅ Total imported: ${totalSuccess} items`)
  if (totalFailed > 0) console.log(`❌ Failed: ${totalFailed} items`)
  console.log(`⏱️  Duration: ${duration} seconds`)
  console.log()
  console.log('🎉 IMPORT COMPLETE!')
  console.log('='.repeat(80))
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
