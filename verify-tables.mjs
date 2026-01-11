// Direct table verification
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 DIRECT TABLE VERIFICATION\n')

// Test with service role key (has full access)
async function testTable(tableName) {
  console.log(`\n📊 Testing: ${tableName}`)

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=5`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(`   Status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Table accessible`)
      console.log(`   📝 Rows returned: ${data.length}`)
      if (data.length > 0) {
        console.log(`   📋 Sample data:`)
        console.log(`      ${JSON.stringify(data[0], null, 2).split('\n').slice(0, 5).join('\n      ')}...`)
      }
    } else {
      const error = await response.text()
      console.log(`   ❌ Error: ${error.substring(0, 200)}`)
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`)
  }
}

await testTable('explanation_library')
await testTable('mistake_patterns')

// Test if tables exist in information_schema
console.log('\n\n📋 Checking information_schema...')
try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('explanation_library', 'mistake_patterns') ORDER BY table_name;`
    })
  })

  if (response.ok) {
    const data = await response.json()
    console.log(`   ✅ Found tables: ${JSON.stringify(data)}`)
  } else {
    console.log(`   Note: exec_sql RPC might not exist (this is OK)`)
  }
} catch (e) {
  console.log(`   Note: Could not query information_schema (this is OK)`)
}

console.log('\n\n💡 RECOMMENDATION:')
console.log('   Run these queries in Supabase SQL Editor:')
console.log('   1. SELECT * FROM explanation_library LIMIT 5;')
console.log('   2. SELECT * FROM mistake_patterns LIMIT 5;')
console.log('   3. SELECT * FROM explanation_coverage;')
