#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('📦 Importing Subject Analogies...\n')

const jsonContent = await readFile('./themed-output/subject-analogies-themed.json', 'utf-8')
const data = JSON.parse(jsonContent)

console.log(`Items to import: ${data.length}`)

const BATCH_SIZE = 50
let totalImported = 0

for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE)
  const { data: inserted, error } = await supabase.from('subject_analogies').insert(batch).select('id')

  if (error) {
    console.log(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
  } else {
    totalImported += inserted?.length || batch.length
  }
}

console.log(`\n✅ Imported: ${totalImported} items`)
console.log('🎉 Done!')
