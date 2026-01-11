// Test diagnostic endpoint
console.log('⏳ Waiting 90 seconds for Vercel redeployment...')
await new Promise(resolve => setTimeout(resolve, 90000))

console.log('\n🔍 Checking environment variables...\n')

const PRODUCTION_URL = 'https://school-genius.vercel.app'

try {
  const response = await fetch(`${PRODUCTION_URL}/api/parent-help-test`)
  const data = await response.json()

  console.log('Environment Check:')
  console.log(`  Anthropic API Key exists: ${data.anthropicKeyExists ? '✅' : '❌'}`)
  console.log(`  Anthropic API Key length: ${data.anthropicKeyLength}`)
  console.log(`  Supabase URL exists: ${data.supabaseUrlExists ? '✅' : '❌'}`)
  console.log(`  Supabase Key exists: ${data.supabaseKeyExists ? '✅' : '❌'}`)

  if (!data.anthropicKeyExists) {
    console.log('\n⚠️  ANTHROPIC_API_KEY is not set in Vercel!')
    console.log('   You need to add it in Vercel dashboard → Settings → Environment Variables')
  }

  console.log('\n🧪 Testing Parent Help API with error details...\n')

  const testResponse = await fetch(`${PRODUCTION_URL}/api/parent-help`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parentId: '00000000-0000-0000-0000-000000000000',
      messages: [{ role: 'user', content: 'Test' }]
    })
  })

  console.log(`Status: ${testResponse.status}`)

  const testData = await testResponse.json()
  console.log('Response:', JSON.stringify(testData, null, 2))

} catch (error) {
  console.log(`❌ Error: ${error.message}`)
}
