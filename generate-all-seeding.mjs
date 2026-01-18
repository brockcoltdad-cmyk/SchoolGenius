import { createClient } from '@supabase/supabase-js'

// Supabase setup - requires env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Grok API setup - requires XAI_API_KEY env var
const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

// Configuration
const DELAY_MS = 5000  // 5 seconds between calls
const BATCH_SIZE = 50  // Save checkpoint every 50 items

console.log('🌱 SMART SEEDING - All 2,280 Age-Appropriate Items')
console.log('='.repeat(80))
console.log('Generating kid stuck responses, analogies, transitions, etc.')
console.log('This will take ~3 hours. Running in background...\n')

const startTime = Date.now()
let totalSuccess = 0
let totalErrors = 0

// Call Grok API
async function callGrok(prompt) {
  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`Grok API ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Parse JSON from Grok response (handles markdown wrapping)
function parseJSON(content) {
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content
  return JSON.parse(jsonString)
}

// ============================================================================
// GENERATE ALL CONTENT
// ============================================================================

async function generateAll() {
  // ========== SECTION 1: Kid Stuck Responses (340 items) ==========
  console.log('\n📚 Generating Kid Stuck Responses (340 items)...')

  const questionTypes = [
    { type: 'dont_get_it', question: 'I don\\'t get it', count: 4 },
    { type: 'this_is_hard', question: 'This is hard', count: 4 },
    { type: 'help', question: 'Help!', count: 3 },
    { type: 'confused', question: 'I\\'m confused', count: 3 },
    { type: 'explain_again', question: 'Can you explain again?', count: 3 }
  ]

  const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  const ageStyles = {
    k2: 'Super simple, very excited, lots of emojis 🎉⭐💪',
    grades35: 'Friendly teacher, encouraging, regular emojis 🎯💡',
    grades68: 'Mature peer, respectful, selective emojis 💪✓',
    grades912: 'Professional, academic, minimal emojis ✓📊'
  }

  let itemNum = 0

  for (const qt of questionTypes) {
    for (let v = 0; v < qt.count; v++) {
      for (const subject of subjects) {
        for (const ageGroup of ageGroups) {
          itemNum++

          try {
            console.log(`[${itemNum}/340] ${qt.question} | ${subject} | ${ageGroup}`)

            const prompt = `A student says: "${qt.question}" while learning ${subject}.
Age group: ${ageGroup}
Style: ${ageStyles[ageGroup]}

Generate a helpful response (under 50 words, warm, hints not answers).

Return ONLY this JSON:
{"question_type":"${qt.type}","subject":"${subject}","age_group":"${ageGroup}","response":"your reply here","response_tone":"encouraging"}`

            const content = await callGrok(prompt)
            const data = parseJSON(content)

            const { error } = await supabase
              .from('kid_stuck_responses')
              .insert(data)

            if (error) throw error

            console.log(`  ✅ Saved`)
            totalSuccess++

            await new Promise(resolve => setTimeout(resolve, DELAY_MS))

          } catch (error) {
            console.error(`  ❌ Error: ${error.message}`)
            totalErrors++
          }
        }
      }
    }
  }

  // ========== Continue with other sections... ==========
  // (Will add all 8 sections)

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('🎉 SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${totalSuccess}`)
  console.log(`❌ Errors: ${totalErrors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
}

// Run it
generateAll().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
