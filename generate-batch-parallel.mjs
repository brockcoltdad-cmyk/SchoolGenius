#!/usr/bin/env node

/**
 * PARALLEL BATCH GENERATOR
 *
 * Usage: node generate-batch-parallel.mjs <batch_num> <api_key_num>
 * Example: node generate-batch-parallel.mjs 3 1
 *
 * Generates 50 items per batch, can run multiple in parallel
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

// Get batch number and key number from command line
const BATCH_NUM = parseInt(process.argv[2]) || 3
const KEY_NUM = parseInt(process.argv[3]) || 1

// Two API keys for parallel processing
const API_KEYS = {
  1: 'process.env.XAI_API_KEY',
  2: 'process.env.XAI_API_KEY'
}

const GROK_API_KEY = API_KEYS[KEY_NUM]
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DELAY_MS = 5000
const BATCH_SIZE = 50

console.log(`🌱 PARALLEL BATCH ${BATCH_NUM} (Key ${KEY_NUM})`)
console.log('='.repeat(80))

// Create output directory
if (!existsSync('./seeding-output')) {
  await mkdir('./seeding-output', { recursive: true })
}

// Call Grok
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

  if (!response.ok) throw new Error(`Grok ${response.status}`)

  const data = await response.json()
  return data.choices[0].message.content
}

// Parse JSON
function parseJSON(content) {
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content
  return JSON.parse(jsonString)
}

const startTime = Date.now()
let totalSuccess = 0
let totalErrors = 0

// Kid stuck responses configuration
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

const allResponses = []
let itemNum = 0
const START_ITEM = (BATCH_NUM - 1) * BATCH_SIZE
const END_ITEM = START_ITEM + BATCH_SIZE

console.log(`Items ${START_ITEM + 1} to ${END_ITEM}\n`)

// Generate all combinations
for (const qt of questionTypes) {
  for (let v = 0; v < qt.count; v++) {
    for (const subject of subjects) {
      for (const ageGroup of ageGroups) {
        itemNum++

        // Skip items before our start
        if (itemNum <= START_ITEM) continue

        // Stop after our batch
        if (itemNum > END_ITEM) break

        try {
          const batchPos = itemNum - START_ITEM
          console.log(`[${batchPos}/${BATCH_SIZE}] ${qt.question} | ${subject} | ${ageGroup}`)

          const prompt = `A student says: "${qt.question}" while learning ${subject}.
Age: ${ageGroup}
Style: ${ageStyles[ageGroup]}

Generate helpful response (under 50 words, warm, encouraging, hints not answers).

Return JSON:
{"question_type":"${qt.type}","subject":"${subject}","age_group":"${ageGroup}","response":"your response","response_tone":"encouraging"}`

          const content = await callGrok(prompt)
          const data = parseJSON(content)

          allResponses.push(data)

          console.log(`  ✅ "${data.response.substring(0, 40)}..."`)
          totalSuccess++

          await new Promise(resolve => setTimeout(resolve, DELAY_MS))

        } catch (error) {
          console.error(`  ❌ ${error.message}`)
          totalErrors++
        }
      }
      if (itemNum >= END_ITEM) break
    }
    if (itemNum >= END_ITEM) break
  }
  if (itemNum >= END_ITEM) break
}

// Save to JSON file
await writeFile(
  `./seeding-output/kid-stuck-responses-batch${BATCH_NUM}.json`,
  JSON.stringify(allResponses, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log(`📊 BATCH ${BATCH_NUM} COMPLETE!`)
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(3)}`)
console.log(`\n📁 Saved to: ./seeding-output/kid-stuck-responses-batch${BATCH_NUM}.json`)
