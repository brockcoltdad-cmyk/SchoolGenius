#!/usr/bin/env node

/**
 * THEMED ACHIEVEMENT CELEBRATIONS GENERATOR
 * Generates theme-specific celebration messages for achievements
 * Total: 168 items (42 per age group × 4)
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const API_KEYS = {
  1: 'process.env.XAI_API_KEY',
  2: 'process.env.XAI_API_KEY'
}

const GROK_API_KEY = API_KEYS[1]
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DELAY_MS = 5000

console.log('🏆 THEMED ACHIEVEMENT CELEBRATIONS GENERATOR')
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
      temperature: 0.9
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
  { id: 'battle', name: 'Battle Royale', examples: 'Victory Royale!, GG!, Legendary!, Epic win!, Champion!' },
  { id: 'princess', name: 'Princess', examples: 'Crown earned!, Royal success!, Castle magic!, Your majesty!' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Roar!, T-Rex power!, Prehistoric win!, Dino champion!' },
  { id: 'space', name: 'Space', examples: 'Mission accomplished!, Stellar!, Astronaut level!, Blast off!' }
]

const AGE_GROUPS = [
  { id: 'k2', name: 'K-2', tone: 'Super excited! Lots of emojis! 🎉⭐✨' },
  { id: 'grades35', name: '3-5', tone: 'Encouraging, friendly! 🎯💡' },
  { id: 'grades68', name: '6-8', tone: 'Mature, cool 💪✓' },
  { id: 'grades912', name: '9-12', tone: 'Professional, motivating ✓📊' }
]

const ACHIEVEMENTS = [
  { type: 'first_lesson', value: null, description: 'Completed first lesson ever' },
  { type: 'streak', value: 3, description: '3-day streak' },
  { type: 'streak', value: 7, description: '7-day streak' },
  { type: 'streak', value: 14, description: '14-day streak' },
  { type: 'streak', value: 30, description: '30-day streak' },
  { type: 'coins', value: 50, description: 'Earned 50 coins' },
  { type: 'coins', value: 100, description: 'Earned 100 coins' },
  { type: 'coins', value: 500, description: 'Earned 500 coins' },
  { type: 'mastery', value: null, description: 'Mastered a skill' }
]

const allCelebrations = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${THEMES.length * AGE_GROUPS.length * ACHIEVEMENTS.length} celebrations...\n`)

let itemNum = 0

for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const achievement of ACHIEVEMENTS) {
      itemNum++

      try {
        console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${achievement.type} | ${achievement.value || 'N/A'}`)

        const prompt = `You are generating celebration messages for SchoolGenius.

THEME: ${theme.name}
THEME LANGUAGE: ${theme.examples}
AGE GROUP: ${ageGroup.name}
TONE: ${ageGroup.tone}
ACHIEVEMENT: ${achievement.description}

Create a celebration message that:
1. Uses THEME-SPECIFIC language
2. Is age-appropriate
3. Is EXCITING and CELEBRATORY
4. Main message under 30 words
5. Secondary message under 20 words (optional)
6. Excitement level: ${achievement.type === 'first_lesson' ? 'high' : achievement.value >= 14 ? 'epic' : 'medium'}

Return JSON:
{"achievement_type":"${achievement.type}","milestone_value":${achievement.value || 'null'},"age_group":"${ageGroup.id}","main_message":"your message","secondary_message":"optional secondary","excitement_level":"medium/high/epic"}`

        const content = await callGrok(prompt)
        const data = parseJSON(content)
        data.theme = theme.id

        allCelebrations.push(data)

        console.log(`  ✅ "${data.main_message.substring(0, 50)}..."`)
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
  './themed-output/achievement-celebrations-themed.json',
  JSON.stringify(allCelebrations, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 ACHIEVEMENT CELEBRATIONS COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/achievement-celebrations-themed.json`)
