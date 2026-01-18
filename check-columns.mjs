// Check actual columns in practice_problems table
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  // Get one item to see all columns
  const { data, error } = await supabase
    .from('practice_problems')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  if (data && data.length > 0) {
    console.log('COLUMNS IN practice_problems:')
    console.log('-----------------------------')
    const columns = Object.keys(data[0])
    columns.forEach(col => {
      const val = data[0][col]
      const type = typeof val
      console.log(`  ${col}: ${type}`)
    })

    console.log('\n\nSAMPLE ITEM (first one):')
    console.log(JSON.stringify(data[0], null, 2))
  }
}

main().catch(console.error)
