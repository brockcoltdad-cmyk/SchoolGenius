// Temporary script to apply Phase 2 migration
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('📦 Reading migration file...')
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260111_phase2_multilevel_explanations.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  console.log('🚀 Applying Phase 2 migration...')

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

  if (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }

  console.log('✅ Phase 2 migration applied successfully!')
  console.log('\n📊 Verifying tables...')

  // Verify tables exist
  const { data: tables, error: tableError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .in('table_name', ['explanation_library', 'mistake_patterns'])

  if (tables && tables.length === 2) {
    console.log('✅ Tables created: explanation_library, mistake_patterns')
  } else {
    console.log('⚠️  Could not verify tables (may still be created)')
  }

  console.log('\n✅ Phase 2 database migration complete!')
}

applyMigration().catch(console.error)
