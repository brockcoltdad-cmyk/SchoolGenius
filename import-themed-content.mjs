#!/usr/bin/env node

/**
 * IMPORT THEMED CONTENT TO SUPABASE
 *
 * Imports all 8 themed content JSON files into Supabase
 * - Adds theme column to tables if needed
 * - Bulk imports all themed content
 * - Reports success/failure for each content type
 *
 * Usage: node import-themed-content.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🎨 IMPORTING THEMED CONTENT TO SUPABASE')
console.log('='.repeat(80))
console.log()

// Map of JSON files to database tables
const CONTENT_MAPPING = [
  {
    file: './themed-output/kid-stuck-responses-themed.json',
    table: 'kid_stuck_responses',
    name: 'Kid Stuck Responses'
  },
  {
    file: './themed-output/greeting-messages-themed.json',
    table: 'greeting_messages',
    name: 'Greeting Messages'
  },
  {
    file: './themed-output/achievement-celebrations-themed.json',
    table: 'achievement_celebrations',
    name: 'Achievement Celebrations'
  },
  {
    file: './themed-output/return-messages-themed.json',
    table: 'return_messages',
    name: 'Return Messages'
  },
  {
    file: './themed-output/transition-phrases-themed.json',
    table: 'transition_phrases',
    name: 'Transition Phrases'
  },
  {
    file: './themed-output/parent-struggle-guides.json',
    table: 'parent_struggle_guides',
    name: 'Parent Struggle Guides'
  },
  {
    file: './themed-output/subject-analogies-themed.json',
    table: 'subject_analogies',
    name: 'Subject Analogies'
  },
  {
    file: './themed-output/gigi-personality-themed.json',
    table: 'gigi_personality',
    name: 'Gigi Personality'
  }
]

async function addThemeColumns() {
  console.log('📋 Step 1: Adding theme column to tables...')

  try {
    const migration = await readFile('./add-theme-columns.sql', 'utf-8')

    // Execute the migration SQL
    const { error } = await supabase.rpc('exec_sql', { sql: migration })

    if (error) {
      // If RPC doesn't exist, try direct SQL execution (Supabase REST API doesn't support this)
      // We'll skip this and assume columns exist or will be added manually
      console.log('⚠️  Cannot execute SQL via API - please run add-theme-columns.sql manually first')
      console.log('   Run: psql [your-connection-string] -f add-theme-columns.sql')
      console.log('   Or copy/paste the SQL into Supabase SQL Editor')
      console.log()
      return false
    }

    console.log('✅ Theme columns added successfully')
    console.log()
    return true
  } catch (err) {
    console.log('⚠️  Could not read migration file:', err.message)
    console.log('   Continuing anyway - columns may already exist')
    console.log()
    return true
  }
}

async function importContent(mapping) {
  console.log(`📦 Importing ${mapping.name}...`)
  console.log(`   File: ${mapping.file}`)
  console.log(`   Table: ${mapping.table}`)

  try {
    // Read JSON file
    const jsonContent = await readFile(mapping.file, 'utf-8')
    const data = JSON.parse(jsonContent)

    console.log(`   Items to import: ${data.length}`)

    if (data.length === 0) {
      console.log(`   ⚠️  No items to import - skipping`)
      return { success: true, count: 0 }
    }

    // Bulk insert in batches of 100 (Supabase limit)
    const BATCH_SIZE = 100
    let totalImported = 0
    let errors = 0

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE)

      const { data: inserted, error } = await supabase
        .from(mapping.table)
        .insert(batch)
        .select('id')

      if (error) {
        console.error(`   ❌ Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message)
        errors += batch.length
      } else {
        totalImported += inserted?.length || batch.length
        process.stdout.write(`   Progress: ${Math.min(i + BATCH_SIZE, data.length)}/${data.length}\r`)
      }
    }

    console.log(`   ✅ Imported: ${totalImported} items`)
    if (errors > 0) {
      console.log(`   ⚠️  Errors: ${errors} items failed`)
    }
    console.log()

    return { success: errors === 0, count: totalImported, errors }
  } catch (err) {
    console.error(`   ❌ Failed:`, err.message)
    console.log()
    return { success: false, count: 0, errors: -1 }
  }
}

async function main() {
  const startTime = Date.now()

  // Step 1: Add theme columns
  await addThemeColumns()

  // Step 2: Import all content
  console.log('📦 Step 2: Importing all themed content...')
  console.log()

  const results = []

  for (const mapping of CONTENT_MAPPING) {
    const result = await importContent(mapping)
    results.push({
      name: mapping.name,
      table: mapping.table,
      ...result
    })
  }

  // Step 3: Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('='.repeat(80))
  console.log('📊 IMPORT SUMMARY')
  console.log('='.repeat(80))
  console.log()

  let totalItems = 0
  let totalSuccess = 0
  let totalFailed = 0

  results.forEach(r => {
    const status = r.success ? '✅' : '❌'
    console.log(`${status} ${r.name}`)
    console.log(`   Table: ${r.table}`)
    console.log(`   Imported: ${r.count} items`)
    if (r.errors > 0) {
      console.log(`   Errors: ${r.errors} items`)
    }
    console.log()

    totalItems += r.count
    if (r.success) totalSuccess += r.count
    else totalFailed += r.count
  })

  console.log('='.repeat(80))
  console.log(`✅ Successfully imported: ${totalSuccess} items`)
  if (totalFailed > 0) {
    console.log(`❌ Failed: ${totalFailed} items`)
  }
  console.log(`⏱️  Duration: ${duration} seconds`)
  console.log()

  // Verify counts in database
  console.log('🔍 Verifying database counts...')
  console.log()

  for (const mapping of CONTENT_MAPPING) {
    const { count, error } = await supabase
      .from(mapping.table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`   ${mapping.name}: Error - ${error.message}`)
    } else {
      console.log(`   ${mapping.name}: ${count} total items in database`)
    }
  }

  console.log()
  console.log('='.repeat(80))
  console.log('🎉 IMPORT COMPLETE!')
  console.log('='.repeat(80))
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
