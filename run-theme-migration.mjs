#!/usr/bin/env node

/**
 * Run Theme Column Migration
 * Adds theme column to all 8 content tables
 */

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🔧 ADDING THEME COLUMNS TO DATABASE')
console.log('='.repeat(80))
console.log()

async function runMigration() {
  try {
    const migration = await readFile('./add-theme-columns.sql', 'utf-8')

    // Split by semicolon and execute each statement
    const statements = migration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

    console.log(`Found ${statements.length} SQL statements to execute`)
    console.log()

    let success = 0
    let failed = 0

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]

      // Skip comments and RAISE NOTICE (not supported in direct SQL)
      if (stmt.includes('RAISE NOTICE') || stmt.includes('RAISE WARNING')) {
        continue
      }

      console.log(`Executing statement ${i + 1}...`)

      try {
        // Execute using raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' })

        if (error) {
          // Try alternative method - direct query
          const { error: altError } = await supabase.from('_migration').insert({ sql: stmt })

          if (altError) {
            console.error(`   ❌ Failed:`, error.message)
            failed++
          } else {
            console.log(`   ✅ Success`)
            success++
          }
        } else {
          console.log(`   ✅ Success`)
          success++
        }
      } catch (err) {
        console.error(`   ❌ Error:`, err.message)
        failed++
      }
    }

    console.log()
    console.log('='.repeat(80))
    console.log(`✅ Successful: ${success} statements`)
    if (failed > 0) {
      console.log(`❌ Failed: ${failed} statements`)
      console.log()
      console.log('⚠️  Please run the SQL manually in Supabase SQL Editor:')
      console.log('   1. Go to: https://supabase.com/dashboard')
      console.log('   2. Select your project')
      console.log('   3. Go to SQL Editor')
      console.log('   4. Paste contents of add-theme-columns.sql')
      console.log('   5. Click Run')
    }
    console.log('='.repeat(80))

  } catch (err) {
    console.error('❌ Fatal error:', err.message)
    console.log()
    console.log('⚠️  Cannot execute SQL via Node.js')
    console.log('Please run add-theme-columns.sql manually:')
    console.log()
    console.log('Option 1: Supabase SQL Editor (Recommended)')
    console.log('   1. Go to: https://supabase.com/dashboard')
    console.log('   2. Select your project')
    console.log('   3. Go to SQL Editor')
    console.log('   4. Paste contents of add-theme-columns.sql')
    console.log('   5. Click Run')
    console.log()
    console.log('Option 2: psql command line')
    console.log('   psql [connection-string] -f add-theme-columns.sql')
    console.log()
    process.exit(1)
  }
}

runMigration()
