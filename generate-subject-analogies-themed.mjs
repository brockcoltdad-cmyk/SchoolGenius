#!/usr/bin/env node

/**
 * THEMED SUBJECT ANALOGIES GENERATOR
 * Generates theme-specific analogies for complex concepts
 * Total: ~400 items (simplified from 1,100 for efficiency)
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

console.log('🧠 THEMED SUBJECT ANALOGIES GENERATOR')
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
  { id: 'battle', name: 'Battle Royale', examples: 'Shield potions, loot, storm circle, drop zones' },
  { id: 'princess', name: 'Princess', examples: 'Castle rooms, royal treasures, magic spells' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Dino types, fossils, prehistoric landscapes' },
  { id: 'space', name: 'Space', examples: 'Planets, rockets, space stations, galaxies' }
]

const AGE_GROUPS = [
  { id: 'k2', name: 'K-2', tone: 'Very simple comparisons' },
  { id: 'grades35', name: '3-5', tone: 'Clear, relatable comparisons' },
  { id: 'grades68', name: '6-8', tone: 'Deeper analogies' },
  { id: 'grades912', name: '9-12', tone: 'Complex, sophisticated analogies' }
]

const CONCEPTS = [
  // Math
  { subject: 'Math', concept: 'fractions', difficulty: 'intermediate' },
  { subject: 'Math', concept: 'multiplication', difficulty: 'basic' },
  { subject: 'Math', concept: 'division', difficulty: 'intermediate' },
  { subject: 'Math', concept: 'percentages', difficulty: 'advanced' },

  // Reading
  { subject: 'Reading', concept: 'main idea', difficulty: 'basic' },
  { subject: 'Reading', concept: 'context clues', difficulty: 'intermediate' },
  { subject: 'Reading', concept: 'inference', difficulty: 'intermediate' },

  // Coding
  { subject: 'Coding', concept: 'variables', difficulty: 'basic' },
  { subject: 'Coding', concept: 'loops', difficulty: 'intermediate' },
  { subject: 'Coding', concept: 'functions', difficulty: 'advanced' }
]

const allAnalogies = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${THEMES.length * AGE_GROUPS.length * CONCEPTS.length} analogies...\n`)

let itemNum = 0

for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const concept of CONCEPTS) {
      itemNum++

      try {
        console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${concept.subject} - ${concept.concept}`)

        const prompt = `You are creating analogies for SchoolGenius.

THEME: ${theme.name}
THEME ELEMENTS: ${theme.examples}
AGE GROUP: ${ageGroup.name}
ANALOGY STYLE: ${ageGroup.tone}
SUBJECT: ${concept.subject}
CONCEPT: ${concept.concept}
DIFFICULTY: ${concept.difficulty}

Create an analogy that:
1. Uses THEME-SPECIFIC elements
2. Is age-appropriate
3. Makes the concept "click"
4. Clear and memorable
5. Under 40 words
6. Explanation under 30 words

EXAMPLE (Battle theme, fractions):
"Fractions are like shield potions! A full shield is 100, half shield is 50. When you see 1/2, that's like having half a shield potion! 🛡️"

Return JSON:
{"subject":"${concept.subject}","concept":"${concept.concept}","age_group":"${ageGroup.id}","analogy":"your analogy","explanation":"why this works","when_to_use":"when introducing ${concept.concept}","difficulty":"${concept.difficulty}"}`

        const content = await callGrok(prompt)
        const data = parseJSON(content)
        data.theme = theme.id
        data.skill_name = concept.concept

        allAnalogies.push(data)

        console.log(`  ✅ "${data.analogy.substring(0, 50)}..."`)
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
  './themed-output/subject-analogies-themed.json',
  JSON.stringify(allAnalogies, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 SUBJECT ANALOGIES COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/subject-analogies-themed.json`)
