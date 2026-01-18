#!/usr/bin/env node

/**
 * THEMED GREETING MESSAGES GENERATOR
 * Generates theme-specific greetings based on time of day
 * Total: 64 items (16 per age group × 4)
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const API_KEYS = {
  1: 'process.env.XAI_API_KEY',
  2: 'process.env.XAI_API_KEY'
}

const GROK_API_KEY = API_KEYS[2]  // Use second key
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DELAY_MS = 5000

console.log('🌅 THEMED GREETING MESSAGES GENERATOR')
console.log('='.repeat(80))

if (!existsSync('./themed-output')) {
  await mkdir('./themed-output', { recursive: true })
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
      temperature: 0.8
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

const THEMES = [
  { id: 'battle', name: 'Battle Royale', examples: 'Drop in!, Squad up!, Ready for the dub!' },
  { id: 'princess', name: 'Princess', examples: 'Good morning your majesty!, Royal greetings!' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Roar good morning!, Dino greetings!' },
  { id: 'space', name: 'Space', examples: 'Mission start!, Astronaut ready!' }
]

const AGE_GROUPS = [
  { id: 'k2', name: 'K-2', tone: 'Super excited! 🎉⭐' },
  { id: 'grades35', name: '3-5', tone: 'Friendly! 🎯' },
  { id: 'grades68', name: '6-8', tone: 'Cool, upbeat 💪' },
  { id: 'grades912', name: '9-12', tone: 'Chill, professional ✓' }
]

const TIMES = [
  { id: 'morning', description: 'Morning (6am-12pm)', energy: 'upbeat' },
  { id: 'afternoon', description: 'Afternoon (12pm-6pm)', energy: 'upbeat' },
  { id: 'evening', description: 'Evening (6pm-10pm)', energy: 'calm' },
  { id: 'weekend', description: 'Weekend morning', energy: 'chill' }
]

const allGreetings = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${THEMES.length * AGE_GROUPS.length * TIMES.length} greetings...\n`)

let itemNum = 0

for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const time of TIMES) {
      itemNum++

      try {
        console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${time.id}`)

        const prompt = `You are generating greeting messages for SchoolGenius.

THEME: ${theme.name}
THEME LANGUAGE: ${theme.examples}
AGE GROUP: ${ageGroup.name}
TONE: ${ageGroup.tone}
TIME: ${time.description}
ENERGY: ${time.energy}

Create a greeting that:
1. Uses THEME-SPECIFIC language
2. Is age-appropriate
3. Matches time of day energy
4. Welcoming and positive
5. Under 25 words

Return JSON:
{"time_of_day":"${time.id}","age_group":"${ageGroup.id}","greeting":"your greeting","energy_level":"${time.energy}"}`

        const content = await callGrok(prompt)
        const data = parseJSON(content)
        data.theme = theme.id

        allGreetings.push(data)

        console.log(`  ✅ "${data.greeting.substring(0, 50)}..."`)
        totalSuccess++

        await new Promise(resolve => setTimeout(resolve, DELAY_MS))

      } catch (error) {
        console.error(`  ❌ ${error.message}`)
        totalErrors++
      }
    }
  }
}

await writeFile(
  './themed-output/greeting-messages-themed.json',
  JSON.stringify(allGreetings, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 GREETING MESSAGES COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/greeting-messages-themed.json`)
