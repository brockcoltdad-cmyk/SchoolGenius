#!/usr/bin/env node

/**
 * Test Parent Helper with Grok
 */

import 'dotenv/config'

const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

console.log('🧪 TESTING PARENT HELPER WITH GROK\n')

if (!GROK_API_KEY) {
  console.log('❌ XAI_API_KEY not found in .env')
  process.exit(1)
}

const testPrompt = `You are the SchoolGenius Parent Helper. You help parents with the platform.

Parent Question: "How do I add a new child to my account?"`

console.log('📞 Calling Grok API...\n')

try {
  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [
        {
          role: 'system',
          content: testPrompt
        },
        {
          role: 'user',
          content: 'How do I add a new child to my account?'
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.log(`❌ API Error: ${response.status}`)
    console.log(errorText)
    process.exit(1)
  }

  const data = await response.json()
  const answer = data.choices?.[0]?.message?.content

  console.log('✅ GROK RESPONSE:\n')
  console.log('─'.repeat(70))
  console.log(answer)
  console.log('─'.repeat(70))
  console.log('\n✅ Parent Helper is working with Grok!')
  console.log('\n📋 Next Steps:')
  console.log('   1. Deploy to production (git push)')
  console.log('   2. Test on live site')
  console.log('   3. Generate FAQ library')

} catch (error) {
  console.log(`\n❌ Error: ${error.message}`)
  process.exit(1)
}
