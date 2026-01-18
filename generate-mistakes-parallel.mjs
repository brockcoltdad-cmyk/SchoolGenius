#!/usr/bin/env node

/**
 * MISTAKE RESPONSE MESSAGES GENERATOR
 *
 * Generates age-appropriate responses when students make mistakes
 * Usage: node generate-mistakes-parallel.mjs <batch_num> <api_key_num>
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

console.log(`💡 MISTAKE RESPONSES BATCH ${BATCH_NUM} (Key ${KEY_NUM})`)
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

// Mistake types
const mistakeTypes = [
  { type: 'wrong_answer', description: 'Student got the answer wrong' },
  { type: 'calculation_error', description: 'Student made a math error' },
  { type: 'spelling_error', description: 'Student spelled word incorrectly' },
  { type: 'syntax_error', description: 'Student made coding syntax error' },
  { type: 'logic_error', description: 'Student used incorrect logic' },
  { type: 'typo', description: 'Student made a typing mistake' }
]

const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

const ageStyles = {
  k2: 'K-2 (ages 5-8): Gentle, encouraging, makes mistakes seem normal',
  grades35: '3-5 (ages 8-11): Supportive, helps them learn from mistakes',
  grades68: '6-8 (ages 11-14): Constructive, focuses on growth mindset',
  grades912: '9-12 (ages 14-18): Professional, emphasizes learning process'
}

const allMistakes = []
let itemNum = 0
const START_ITEM = (BATCH_NUM - 1) * BATCH_SIZE
const END_ITEM = START_ITEM + BATCH_SIZE

console.log(`Items ${START_ITEM + 1} to ${END_ITEM}\n`)

// Generate mistake responses
for (const mistake of mistakeTypes) {
  for (const subject of subjects) {
    for (const ageGroup of ageGroups) {
      // 2 variants per combination
      for (let variant = 1; variant <= 2; variant++) {
        itemNum++

        if (itemNum <= START_ITEM) continue
        if (itemNum > END_ITEM) break

        try {
          const batchPos = itemNum - START_ITEM
          console.log(`[${batchPos}/${BATCH_SIZE}] ${mistake.type} | ${subject} | ${ageGroup} | v${variant}`)

          const prompt = `Student made a mistake: ${mistake.description}
Subject: ${subject}
Age group: ${ageGroup}
Style: ${ageStyles[ageGroup]}

Create a response that:
- Normalizes mistakes as part of learning
- Gently points toward the right approach
- Keeps student motivated
- Under 40 words

Return JSON:
{"mistake_type":"${mistake.type}","subject":"${subject}","age_group":"${ageGroup}","response":"your response"}`

          const content = await callGrok(prompt)
          const data = parseJSON(content)

          allMistakes.push(data)

          console.log(`  ✅ "${data.response.substring(0, 50)}..."`)
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
  `./seeding-output/mistake-responses-batch${BATCH_NUM}.json`,
  JSON.stringify(allMistakes, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log(`📊 MISTAKE RESPONSES BATCH ${BATCH_NUM} COMPLETE!`)
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(3)}`)
console.log(`\n📁 Saved to: ./seeding-output/mistake-responses-batch${BATCH_NUM}.json`)
