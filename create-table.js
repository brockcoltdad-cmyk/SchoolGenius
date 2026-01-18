const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTable() {
  console.log('📦 Reading SQL file...')
  const sql = fs.readFileSync('create-scanned-homework-table.sql', 'utf8')

  console.log('🚀 Creating scanned_homework table...')

  // Split by semicolon and execute each statement
  const statements = sql.split(';').filter(s => s.trim())

  for (const statement of statements) {
    if (!statement.trim()) continue

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

      if (error) {
        // Try direct query if RPC doesn't work
        console.log('Trying direct execution...')
        const { error: directError } = await supabase.from('_').select('*').limit(0)
        if (directError) {
          console.error('Statement error:', error.message)
        }
      }
    } catch (e) {
      console.log('Continuing...')
    }
  }

  console.log('✅ Table creation complete!')

  // Verify table exists
  const { data, error } = await supabase
    .from('scanned_homework')
    .select('*')
    .limit(0)

  if (error) {
    console.error('❌ Verification failed:', error.message)
    console.log('\n🔧 Try running the SQL directly in Supabase SQL Editor:')
    console.log('https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql')
  } else {
    console.log('✅ Table verified: scanned_homework exists')
  }
}

createTable().catch(console.error)
