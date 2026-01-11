// Quick test of Parent Help API after fix
console.log('⏳ Waiting 90 seconds for Vercel redeployment...')
await new Promise(resolve => setTimeout(resolve, 90000))

console.log('\n🧪 Testing Parent Help API...\n')

const PRODUCTION_URL = 'https://school-genius.vercel.app'

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

  console.log(`Status: ${response.status}`)

  if (response.ok) {
    const data = await response.json()
    console.log('✅ API is working!\n')
    console.log('Question: "What is SchoolGenius?"\n')
    console.log('Answer:')
    console.log(data.message)
    console.log('\n✅ Phase 3 deployment successful!')
  } else {
    const errorText = await response.text()
    console.log(`❌ API returned ${response.status}`)
    console.log(`Error: ${errorText}`)
  }
} catch (error) {
  console.log(`❌ Error: ${error.message}`)
}
