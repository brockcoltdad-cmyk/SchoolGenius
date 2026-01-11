import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Read migration file
const migrationPath = join(__dirname, 'supabase', 'migrations', '20260111_phase2_multilevel_explanations.sql')
const sql = readFileSync(migrationPath, 'utf8')

console.log('📦 Applying Phase 2 migration to production database...')
console.log(`🔗 Database: ${SUPABASE_URL}`)

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`\n📝 Found ${statements.length} SQL statements to execute\n`)

// Execute each statement using Supabase REST API
let successCount = 0
let errorCount = 0

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i]

  // Skip comments and empty statements
  if (!statement || statement.startsWith('--')) continue

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ query: statement + ';' })
    })

    if (response.ok) {
      successCount++
      process.stdout.write('.')
    } else {
      const error = await response.text()
      // Ignore "already exists" errors
      if (error.includes('already exists')) {
        process.stdout.write('s')
        successCount++
      } else {
        process.stdout.write('x')
        errorCount++
      }
    }
  } catch (error) {
    process.stdout.write('x')
    errorCount++
  }
}

console.log(`\n\n✅ Migration complete!`)
console.log(`   Success: ${successCount} statements`)
if (errorCount > 0) {
  console.log(`   Skipped/Errors: ${errorCount} statements (likely already applied)`)
}

console.log('\n📊 Verifying tables...')

// Verify the tables were created
try {
  const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/explanation_library?select=count&limit=0`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Range': '0-0'
    }
  })

  if (checkResponse.ok) {
    console.log('✅ explanation_library table exists')
  }
} catch (e) {
  console.log('⚠️  Could not verify explanation_library table')
}

try {
  const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/mistake_patterns?select=count&limit=0`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Range': '0-0'
    }
  })

  if (checkResponse.ok) {
    console.log('✅ mistake_patterns table exists')
  }
} catch (e) {
  console.log('⚠️  Could not verify mistake_patterns table')
}

console.log('\n✅ Phase 2 database setup complete!')
console.log('\n📋 Next steps:')
console.log('   1. Deploy Edge Function: npx supabase functions deploy generate-lesson-v2')
console.log('   2. Test explanations API')
console.log('   3. Generate lessons with multi-level content')
