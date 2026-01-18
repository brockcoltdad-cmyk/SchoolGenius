#!/usr/bin/env node

/**
 * ENCOURAGEMENT MESSAGES GENERATOR
 *
 * Generates age-appropriate encouragement messages for various situations
 * Usage: node generate-encouragements-parallel.mjs <batch_num> <api_key_num>
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const BATCH_NUM = parseInt(process.argv[2]) || 1
const KEY_NUM = parseInt(process.argv[3]) || 1

const API_KEYS = {
  1: 'process.env.XAI_API_KEY',
  2: 'process.env.XAI_API_KEY'
}

const GROK_API_KEY = API_KEYS[KEY_NUM]
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DELAY_MS = 5000
const BATCH_SIZE = 50

console.log(`🌟 ENCOURAGEMENT BATCH ${BATCH_NUM} (Key ${KEY_NUM})`)
console.log('='.repeat(80))

if (!existsSync('./seeding-output')) {
  await mkdir('./seeding-output', { recursive: true })
}

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

function parseJSON(content) {
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content
  return JSON.parse(jsonString)
}

const startTime = Date.now()
let totalSuccess = 0
let totalErrors = 0

// Encouragement situations
const situations = [
  { trigger: 'correct_answer', context: 'Student got answer right' },
  { trigger: 'good_progress', context: 'Student making steady progress' },
  { trigger: 'trying_hard', context: 'Student putting in effort' },
  { trigger: 'mistake_recovery', context: 'Student fixed their mistake' },
  { trigger: 'keeps_going', context: 'Student persisting through difficulty' },
  { trigger: 'asks_question', context: 'Student asked for help' },
  { trigger: 'completes_task', context: 'Student finished assignment' },
  { trigger: 'shows_improvement', context: 'Student doing better than before' },
  { trigger: 'creative_approach', context: 'Student tried unique solution' },
  { trigger: 'helps_others', context: 'Student helping classmate' }
]

const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

const ageStyles = {
  k2: 'K-2 (ages 5-8): Very excited, simple words, lots of emojis',
  grades35: '3-5 (ages 8-11): Enthusiastic, friendly, encouraging',
  grades68: '6-8 (ages 11-14): Supportive peer, respectful tone',
  grades912: '9-12 (ages 14-18): Professional, mature acknowledgment'
}

const allEncouragements = []
let itemNum = 0
const START_ITEM = (BATCH_NUM - 1) * BATCH_SIZE
const END_ITEM = START_ITEM + BATCH_SIZE

console.log(`Items ${START_ITEM + 1} to ${END_ITEM}\n`)

// Generate encouragements
for (const situation of situations) {
  for (const subject of subjects) {
    for (const ageGroup of ageGroups) {
      // 2 variants per combination
      for (let variant = 1; variant <= 2; variant++) {
        itemNum++

        if (itemNum <= START_ITEM) continue
        if (itemNum > END_ITEM) break

        try {
          const batchPos = itemNum - START_ITEM
          console.log(`[${batchPos}/${BATCH_SIZE}] ${situation.trigger} | ${subject} | ${ageGroup} | v${variant}`)

          const prompt = `Create an encouraging message for: ${situation.context}
Subject: ${subject}
Age group: ${ageGroup}
Style: ${ageStyles[ageGroup]}

Message should:
- Be genuine and specific
- Celebrate the behavior/achievement
- Under 30 words
- Feel natural, not robotic

Return JSON:
{"trigger":"${situation.trigger}","subject":"${subject}","age_group":"${ageGroup}","message":"your encouragement"}`

          const content = await callGrok(prompt)
          const data = parseJSON(content)

          allEncouragements.push(data)

          console.log(`  ✅ "${data.message.substring(0, 50)}..."`)
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

await writeFile(
  `./seeding-output/encouragements-batch${BATCH_NUM}.json`,
  JSON.stringify(allEncouragements, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log(`📊 ENCOURAGEMENT BATCH ${BATCH_NUM} COMPLETE!`)
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(3)}`)
console.log(`\n📁 Saved to: ./seeding-output/encouragements-batch${BATCH_NUM}.json`)
