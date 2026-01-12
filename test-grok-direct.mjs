// Test Grok API directly to see if it's working
import { config } from 'dotenv'

config()

const XAI_API_KEY = process.env.XAI_API_KEY

console.log('\n🧪 TESTING GROK API DIRECTLY\n')
console.log('=' .repeat(70))

if (!XAI_API_KEY) {
  console.log('❌ XAI_API_KEY not found in .env file')
  process.exit(1)
}

console.log(`✅ API Key found: ${XAI_API_KEY.substring(0, 12)}...`)

const testQuestion = "How do I add a child?"

const prompt = `You are creating helpful FAQ content for SchoolGenius, an AI-powered K-12 learning platform.

QUESTION: "${testQuestion}"
CATEGORY: child_management

Generate a clear, helpful answer for parents. Follow these guidelines:

1. TONE: Friendly, warm, professional - like a helpful customer support agent
2. LENGTH: 2-4 paragraphs (150-300 words)
3. STRUCTURE:
   - Start with a direct answer
   - Provide step-by-step instructions if applicable
   - Add helpful tips or context
   - End with encouragement or reassurance

Write ONLY the answer text. No headers, no "Answer:", just the helpful response.`

console.log('\n📝 Sending test question to Grok API...')
console.log(`Question: "${testQuestion}"\n`)

try {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-3",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    })
  })

  console.log(`Response status: ${response.status}`)

  if (response.ok) {
    const data = await response.json()
    console.log('\n✅ SUCCESS! Grok API is working!\n')
    console.log('Generated answer:')
    console.log('─'.repeat(70))
    console.log(data.choices?.[0]?.message?.content || 'No content')
    console.log('─'.repeat(70))
    console.log('\n✅ Grok API is functioning correctly!')
    console.log('\nThe issue must be with the Edge Function or database insertion.')
  } else {
    const errorText = await response.text()
    console.log('\n❌ Grok API Error:')
    console.log(errorText)
  }
} catch (error) {
  console.log(`\n❌ Exception: ${error.message}`)
}

console.log('\n' + '=' .repeat(70) + '\n')
