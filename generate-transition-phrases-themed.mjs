#!/usr/bin/env node

/**
 * THEMED TRANSITION PHRASES GENERATOR
 * Generates theme-specific transitions between lesson phases
 * Total: 300 items (75 per age group × 4)
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

console.log('🔄 THEMED TRANSITION PHRASES GENERATOR')
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
  { id: 'battle', name: 'Battle Royale', examples: 'Time to drop in!, Rotate!, Storm\'s coming!, Let\'s push!' },
  { id: 'princess', name: 'Princess', examples: 'Royal decree!, Castle time!, Magic moment!' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Time to stomp!, Roar into action!, Dino march!' },
  { id: 'space', name: 'Space', examples: 'Launch sequence!, Mission time!, Engage thrusters!' }
]

const AGE_GROUPS = [
  { id: 'k2', name: 'K-2', tone: 'Excited! 🎉' },
  { id: 'grades35', name: '3-5', tone: 'Upbeat! 🎯' },
  { id: 'grades68', name: '6-8', tone: 'Cool 💪' },
  { id: 'grades912', name: '9-12', tone: 'Direct ✓' }
]

const TRANSITIONS = [
  { from: 'rules', to: 'demo', description: 'From learning rules to seeing demonstration' },
  { from: 'demo', to: 'practice', description: 'From demonstration to hands-on practice' },
  { from: 'practice', to: 'quiz', description: 'From practice to quiz/assessment' }
]

const SUBJECTS = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']

const allPhrases = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${THEMES.length * AGE_GROUPS.length * TRANSITIONS.length * SUBJECTS.length} transitions...\n`)

let itemNum = 0

for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const transition of TRANSITIONS) {
      for (const subject of SUBJECTS) {
        itemNum++

        try {
          console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${transition.from}→${transition.to} | ${subject}`)

          const prompt = `You are generating transition phrases for SchoolGenius.

THEME: ${theme.name}
THEME LANGUAGE: ${theme.examples}
AGE GROUP: ${ageGroup.name}
TONE: ${ageGroup.tone}
TRANSITION: ${transition.description}
SUBJECT: ${subject}

Create a transition phrase that:
1. Uses THEME-SPECIFIC language
2. Is age-appropriate
3. Builds excitement for next phase
4. Smooth and natural
5. Under 20 words

Return JSON:
{"from_phase":"${transition.from}","to_phase":"${transition.to}","subject":"${subject}","age_group":"${ageGroup.id}","phrase":"your phrase","enthusiasm_level":"medium"}`

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
  './themed-output/transition-phrases-themed.json',
  JSON.stringify(allPhrases, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 TRANSITION PHRASES COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/transition-phrases-themed.json`)
