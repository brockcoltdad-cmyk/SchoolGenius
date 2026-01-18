#!/usr/bin/env node

/**
 * SMART SEEDING - Batch Generator
 *
 * Generates age-appropriate content in batches of 50
 * Same approach as generate-explanations-direct.mjs (which worked!)
 *
 * Run multiple times to complete all content
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

// Configuration
const BATCH_SIZE = 50  // Process 50 items per run
const DELAY_MS = 5000  // 5 seconds between calls

console.log('🌱 SMART SEEDING - Batch Generator')
console.log('='.repeat(80))
console.log(`Batch size: ${BATCH_SIZE} items per run`)
console.log(`Delay: ${DELAY_MS / 1000} seconds between calls`)
console.log(`Estimated time: ~${Math.round(BATCH_SIZE * 5 / 60)} minutes\n`)

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
    throw new Error(`Grok API ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Parse JSON from response
function parseJSON(content) {
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content
  return JSON.parse(jsonString)
}

// Define all content to generate
const contentToGenerate = []

// Kid stuck responses (340 items)
const questionTypes = [
  { type: 'dont_get_it', question: "I don't get it", count: 4 },
  { type: 'this_is_hard', question: 'This is hard', count: 4 },
  { type: 'help', question: 'Help!', count: 3 },
  { type: 'confused', question: "I'm confused", count: 3 },
  { type: 'explain_again', question: 'Can you explain again?', count: 3 }
]

const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

const ageStyles = {
  k2: 'K-2 (ages 5-8): Super simple, very excited, lots of emojis 🎉⭐',
  grades35: '3-5 (ages 8-11): Friendly teacher, encouraging 🎯💡',
  grades68: '6-8 (ages 11-14): Mature peer, respectful 💪✓',
  grades912: '9-12 (ages 14-18): Professional, academic ✓📊'
}

// Build list of all items to generate
for (const qt of questionTypes) {
  for (let v = 0; v < qt.count; v++) {
    for (const subject of subjects) {
      for (const ageGroup of ageGroups) {
        contentToGenerate.push({
          table: 'kid_stuck_responses',
          type: 'stuck_response',
          data: { qt, subject, ageGroup, variation: v + 1 }
        })
      }
    }
  }
}

console.log(`Total items to generate: ${contentToGenerate.length}`)
console.log(`This run: First ${Math.min(BATCH_SIZE, contentToGenerate.length)} items\n`)

// Main generation function
async function generateBatch() {
  const startTime = Date.now()
  let success = 0
  let errors = 0

  const batch = contentToGenerate.slice(0, BATCH_SIZE)

  for (let i = 0; i < batch.length; i++) {
    const item = batch[i]

    try {
      console.log(`\n[${i + 1}/${batch.length}] Generating ${item.type}...`)

      if (item.type === 'stuck_response') {
        const { qt, subject, ageGroup } = item.data

        const prompt = `A student says: "${qt.question}" while learning ${subject}.
Age group: ${ageGroup}
Style: ${ageStyles[ageGroup]}

Generate a helpful response (under 50 words, warm, encouraging, hints not answers).

Return ONLY valid JSON:
{"question_type":"${qt.type}","subject":"${subject}","age_group":"${ageGroup}","response":"your response here","response_tone":"encouraging"}`

        console.log(`  ${qt.question} | ${subject} | ${ageGroup}`)

        const content = await callGrok(prompt)
        const data = parseJSON(content)

        const { error } = await supabase
          .from('kid_stuck_responses')
          .insert(data)

        if (error) throw error

        console.log(`  ✅ Saved: "${data.response.substring(0, 50)}..."`)
        success++
      }

      await new Promise(resolve => setTimeout(resolve, DELAY_MS))

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`)
      errors++
    }

    // Checkpoint every 10 items
    if ((i + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
      console.log(`\n📊 Checkpoint: ${success} success, ${errors} errors, ${elapsed} min elapsed`)
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 BATCH COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${batch.length}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(3)}`)
  console.log(`\n📈 Progress: ${success}/${contentToGenerate.length} total items`)
  console.log(`\n✨ Run again to continue generating remaining items!`)
}

// Run it
generateBatch().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
