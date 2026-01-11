// Test if Grok API (XAI_API_KEY) is working in Supabase Edge Functions
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🧪 TESTING GROK API ACCESS\n')
console.log('=' .repeat(70))

// Test local env first
const localGrokKey = process.env.XAI_API_KEY
console.log('\n📍 Local Environment:')
console.log(`   XAI_API_KEY exists: ${localGrokKey ? '✅ YES' : '❌ NO'}`)
if (localGrokKey) {
  console.log(`   Key length: ${localGrokKey.length} characters`)
  console.log(`   Key prefix: ${localGrokKey.substring(0, 8)}...`)
}

// Test if Edge Functions can access it
console.log('\n📍 Supabase Edge Functions:')
console.log('   Testing generate-parent-faq...')

try {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-parent-faq`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()

  if (response.ok) {
    console.log(`   ✅ Function responded: ${response.status}`)
    console.log(`   Message: ${data.message || data.status}`)

    if (data.error?.includes('XAI_API_KEY')) {
      console.log('\n❌ XAI_API_KEY IS NOT SET IN SUPABASE!\n')
      console.log('You need to add it in Supabase Dashboard:\n')
      console.log('1. Go to https://supabase.com/dashboard')
      console.log('2. Select your project (eczpdbkslqbduiesbqcm)')
      console.log('3. Go to Settings → Edge Functions → Environment Variables')
      console.log('4. Click "Add Environment Variable"')
      console.log('5. Name: XAI_API_KEY')
      console.log(`6. Value: ${localGrokKey || 'YOUR_GROK_API_KEY'}`)
      console.log('7. Click Save')
      console.log('8. Re-run this test\n')
    } else {
      console.log('   ✅ Grok API key is accessible!')
    }
  } else {
    console.log(`   ⚠️  Error: ${response.status}`)
    console.log(`   ${JSON.stringify(data, null, 2)}`)
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`)
}

console.log('\n' + '=' .repeat(70))
console.log('\nIf XAI_API_KEY is not set, you MUST add it to Supabase before generating content.\n')
