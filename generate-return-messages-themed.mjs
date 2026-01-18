#!/usr/bin/env node

/**
 * THEMED RETURN MESSAGES GENERATOR
 * Generates theme-specific "welcome back" messages
 * Total: 80 items (20 per age group × 4)
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const API_KEYS = {
  1: 'process.env.XAI_API_KEY',
  2: 'process.env.XAI_API_KEY'
}

const GROK_API_KEY = API_KEYS[2]
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DELAY_MS = 5000

console.log('👋 THEMED RETURN MESSAGES GENERATOR')
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
  { id: 'battle', name: 'Battle Royale', examples: 'Welcome back soldier!, Squad missed you!, Ready to drop in?' },
  { id: 'princess', name: 'Princess', examples: 'Welcome back your majesty!, The kingdom missed you!' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Welcome back dino friend!, Roar! You\'re back!' },
  { id: 'space', name: 'Space', examples: 'Welcome back astronaut!, Mission control missed you!' },
  { id: 'ninja', name: 'Ninja', examples: 'Welcome back ninja!, The dojo missed you!' }
]

const AGE_GROUPS = [
  { id: 'k2', name: 'K-2', tone: 'Excited to see them! 🎉' },
  { id: 'grades35', name: '3-5', tone: 'Warm welcome! 😊' },
  { id: 'grades68', name: '6-8', tone: 'Cool, glad you\'re back 👍' },
  { id: 'grades912', name: '9-12', tone: 'Professional, welcoming ✓' }
]

const AWAY_TIMES = [
  { min: 1, max: 2, description: '1-2 days away' },
  { min: 3, max: 6, description: '3-6 days away' },
  { min: 7, max: 13, description: 'A week away' },
  { min: 14, max: 29, description: '2-4 weeks away' },
  { min: 30, max: null, description: '30+ days away' }
]

const allMessages = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${THEMES.length * AGE_GROUPS.length * AWAY_TIMES.length} return messages...\n`)

let itemNum = 0

for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const awayTime of AWAY_TIMES) {
      itemNum++

      try {
        console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${awayTime.description}`)

        const prompt = `You are generating "welcome back" messages for SchoolGenius.

THEME: ${theme.name}
THEME LANGUAGE: ${theme.examples}
AGE GROUP: ${ageGroup.name}
TONE: ${ageGroup.tone}
TIME AWAY: ${awayTime.description}

Create a welcome back message that:
1. Uses THEME-SPECIFIC language
2. Is age-appropriate
3. Makes student feel welcome, not guilty
4. Gentle encouragement to continue
5. Under 30 words
6. Optional action suggestion

Return JSON:
{"days_away_min":${awayTime.min},"days_away_max":${awayTime.max === null ? 'null' : awayTime.max},"age_group":"${ageGroup.id}","message":"your message","action_suggestion":"optional suggestion","tone":"welcoming"}`

        const content = await callGrok(prompt)
        const data = parseJSON(content)
        data.theme = theme.id

        allMessages.push(data)

        console.log(`  ✅ "${data.message.substring(0, 50)}..."`)
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
  './themed-output/return-messages-themed.json',
  JSON.stringify(allMessages, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 RETURN MESSAGES COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/return-messages-themed.json`)
