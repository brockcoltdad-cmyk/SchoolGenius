// Final test of Parent Help API
console.log('⏳ Waiting 90 seconds for Vercel redeployment...')
await new Promise(resolve => setTimeout(resolve, 90000))

console.log('\n🧪 FINAL TEST: Parent Help API\n')
console.log('=' .repeat(60))

const PRODUCTION_URL = 'https://school-genius.vercel.app'

console.log('\n📝 Test Question: "What is SchoolGenius?"\n')

try {
  const response = await fetch(`${PRODUCTION_URL}/api/parent-help`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parentId: '00000000-0000-0000-0000-000000000000',
      messages: [
        { role: 'user', content: 'What is SchoolGenius?' }
      ]
    })
  })

  console.log(`Status: ${response.status}\n`)

  if (response.ok) {
    const data = await response.json()
    console.log('✅ SUCCESS! Parent Help API is working!\n')
    console.log('AI Response:')
    console.log('─'.repeat(60))
    console.log(data.message)
    console.log('─'.repeat(60))
    console.log('\n🎉 Phase 3 deployment COMPLETE and VERIFIED!\n')
    console.log('📍 What parents can do now:')
    console.log('   1. Go to https://school-genius.vercel.app/dashboard')
    console.log('   2. Look for blue help button (bottom-right corner)')
    console.log('   3. Click and ask any question about SchoolGenius')
    console.log('   4. Get instant AI-powered answers\n')
  } else {
    const errorData = await response.json()
    console.log('❌ API still returning error:\n')
    console.log(JSON.stringify(errorData, null, 2))
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}`)
}

console.log('\n' + '=' .repeat(60))
