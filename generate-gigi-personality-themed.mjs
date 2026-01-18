#!/usr/bin/env node

/**
 * THEMED GIGI PERSONALITY GENERATOR
 * Generates theme-specific AI tutor personality phrases
 * Total: 200 items (50 per age group × 4)
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

console.log('🤖 THEMED GIGI PERSONALITY GENERATOR')
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
  { id: 'battle', name: 'Battle Royale', examples: 'You\'re leveling up!, Keep grinding!, Pro moves!' },
  { id: 'princess', name: 'Princess', examples: 'You\'re royalty!, Crown worthy!, Castle strong!' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Dino power!, Prehistoric strength!, Roar!' },
  { id: 'space', name: 'Space', examples: 'Stellar work!, Cosmic talent!, Star power!' },
  { id: 'ninja', name: 'Ninja', examples: 'Ninja skills!, Stealth learning!, Shadow master!' }
]

const AGE_GROUPS = [
  { id: 'k2', name: 'K-2', tone: 'Fun, supportive friend 🎉' },
  { id: 'grades35', name: '3-5', tone: 'Encouraging coach 🎯' },
  { id: 'grades68', name: '6-8', tone: 'Cool mentor 💪' },
  { id: 'grades912', name: '9-12', tone: 'Wise guide ✓' }
]

const CATEGORIES = [
  { id: 'encouragement', description: 'General encouragement during learning' },
  { id: 'mistake_reframe', description: 'Reframing mistakes as learning opportunities' },
  { id: 'excitement', description: 'Excited about student progress' },
  { id: 'motivation', description: 'Motivational pep talk' },
  { id: 'growth_mindset', description: 'Teaching growth mindset principles' }
]

const allPhrases = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${THEMES.length * AGE_GROUPS.length * CATEGORIES.length * 2} personality phrases...\n`)

let itemNum = 0

for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const category of CATEGORIES) {
      // Generate 2 variants per combination
      for (let variant = 1; variant <= 2; variant++) {
        itemNum++

        try {
          console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${category.id} | v${variant}`)

          const prompt = `You are Gigi, the AI tutor for SchoolGenius.

THEME: ${theme.name}
THEME LANGUAGE: ${theme.examples}
AGE GROUP: ${ageGroup.name}
YOUR ROLE: ${ageGroup.tone}
CATEGORY: ${category.description}

Create a Gigi catchphrase that:
1. Uses THEME-SPECIFIC language
2. Is age-appropriate
3. Embodies Gigi's warm, supportive personality
4. Fits the category purpose
5. Under 25 words
6. When to use: Be specific

Return JSON:
{"category":"${category.id}","age_group":"${ageGroup.id}","phrase":"your phrase","when_to_use":"when to use this","tone":"supportive"}`

          const content = await callGrok(prompt)
          const data = parseJSON(content)
          data.theme = theme.id

          allPhrases.push(data)

          console.log(`  ✅ "${data.phrase.substring(0, 50)}..."`)
          totalSuccess++

          await new Promise(resolve => setTimeout(resolve, DELAY_MS))

        } catch (error) {
          console.error(`  ❌ ${error.message}`)
          totalErrors++
        }
      }
    }
  }
}

await writeFile(
  './themed-output/gigi-personality-themed.json',
  JSON.stringify(allPhrases, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 GIGI PERSONALITY COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/gigi-personality-themed.json`)
