// Check if 'standard' column exists and try to add it
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('\n=== CHECKING FOR STANDARD COLUMN ===\n')

  // Try to select the standard column
  const { data, error } = await supabase
    .from('practice_problems')
    .select('standard')
    .limit(1)

  if (error) {
    if (error.message.includes('does not exist')) {
      console.log('Column "standard" does NOT exist.')
      console.log('\nTo add it, run this SQL in Supabase SQL Editor:')
      console.log('--------------------------------------------')
      console.log('ALTER TABLE practice_problems ADD COLUMN standard TEXT;')
      console.log('--------------------------------------------')
      console.log('\nOr run via API:')

      // Try to add column via RPC (may not work depending on permissions)
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        query: 'ALTER TABLE practice_problems ADD COLUMN IF NOT EXISTS standard TEXT;'
      })

      if (rpcError) {
        console.log('\nCould not add column via API (expected).')
        console.log('Please add the column manually in Supabase Dashboard:')
        console.log('1. Go to Supabase Dashboard')
        console.log('2. Table Editor > practice_problems')
        console.log('3. Click "Add Column"')
        console.log('4. Name: standard, Type: text')
        console.log('5. Save')
      } else {
        console.log('\nColumn added successfully!')
      }
    } else {
      console.log('Error:', error.message)
    }
  } else {
    console.log('Column "standard" EXISTS.')
    console.log('Sample value:', data[0]?.standard || 'NULL')
    console.log('\nReady to run fix-arizona-standards.mjs')
  }
}

main().catch(console.error)
