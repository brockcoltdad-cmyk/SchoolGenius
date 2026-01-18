#!/usr/bin/env node

/**
 * SUBJECT ANALOGIES GENERATOR
 *
 * Generates age-appropriate analogies for complex concepts
 * Usage: node generate-analogies-parallel.mjs <batch_num> <api_key_num>
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

console.log(`🧠 ANALOGIES BATCH ${BATCH_NUM} (Key ${KEY_NUM})`)
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

// Concepts to explain with analogies
const concepts = [
  // Math concepts
  { subject: 'Math', concept: 'addition', difficulty: 'basic' },
  { subject: 'Math', concept: 'subtraction', difficulty: 'basic' },
  { subject: 'Math', concept: 'multiplication', difficulty: 'intermediate' },
  { subject: 'Math', concept: 'division', difficulty: 'intermediate' },
  { subject: 'Math', concept: 'fractions', difficulty: 'intermediate' },
  { subject: 'Math', concept: 'decimals', difficulty: 'intermediate' },
  { subject: 'Math', concept: 'percentages', difficulty: 'advanced' },
  { subject: 'Math', concept: 'algebra', difficulty: 'advanced' },

  // Reading concepts
  { subject: 'Reading', concept: 'main idea', difficulty: 'basic' },
  { subject: 'Reading', concept: 'context clues', difficulty: 'basic' },
  { subject: 'Reading', concept: 'inference', difficulty: 'intermediate' },
  { subject: 'Reading', concept: 'theme', difficulty: 'intermediate' },
  { subject: 'Reading', concept: 'metaphor', difficulty: 'advanced' },
  { subject: 'Reading', concept: 'symbolism', difficulty: 'advanced' },

  // Coding concepts
  { subject: 'Coding', concept: 'variables', difficulty: 'basic' },
  { subject: 'Coding', concept: 'loops', difficulty: 'basic' },
  { subject: 'Coding', concept: 'functions', difficulty: 'intermediate' },
  { subject: 'Coding', concept: 'conditionals', difficulty: 'intermediate' },
  { subject: 'Coding', concept: 'arrays', difficulty: 'intermediate' },
  { subject: 'Coding', concept: 'objects', difficulty: 'advanced' },

  // Spelling concepts
  { subject: 'Spelling', concept: 'phonics', difficulty: 'basic' },
  { subject: 'Spelling', concept: 'silent letters', difficulty: 'intermediate' },
  { subject: 'Spelling', concept: 'homophones', difficulty: 'intermediate' },
  { subject: 'Spelling', concept: 'prefixes', difficulty: 'advanced' },
  { subject: 'Spelling', concept: 'suffixes', difficulty: 'advanced' }
]

const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

const ageStyles = {
  k2: 'K-2 (ages 5-8): Use very simple comparisons to toys, animals, everyday objects',
  grades35: '3-5 (ages 8-11): Use comparisons to sports, games, school activities',
  grades68: '6-8 (ages 11-14): Use comparisons to technology, social situations, hobbies',
  grades912: '9-12 (ages 14-18): Use comparisons to real-world systems, careers, complex ideas'
}

const allAnalogies = []
let itemNum = 0
const START_ITEM = (BATCH_NUM - 1) * BATCH_SIZE
const END_ITEM = START_ITEM + BATCH_SIZE

console.log(`Items ${START_ITEM + 1} to ${END_ITEM}\n`)

// Generate analogies
for (const concept of concepts) {
  for (const ageGroup of ageGroups) {
    // Generate 2 different analogies per concept-age combination
    for (let variant = 1; variant <= 2; variant++) {
      itemNum++

      if (itemNum <= START_ITEM) continue
      if (itemNum > END_ITEM) break

      try {
        const batchPos = itemNum - START_ITEM
        console.log(`[${batchPos}/${BATCH_SIZE}] ${concept.subject} - ${concept.concept} | ${ageGroup} | v${variant}`)

        const prompt = `Create an age-appropriate analogy to explain "${concept.concept}" in ${concept.subject}.
Age group: ${ageGroup}
Style: ${ageStyles[ageGroup]}

The analogy should:
- Be relatable and easy to understand
- Help the concept "click" for students
- Be culturally inclusive
- Be under 40 words

Return JSON:
{"subject":"${concept.subject}","concept":"${concept.concept}","age_group":"${ageGroup}","analogy":"your analogy","difficulty":"${concept.difficulty}"}`

        const content = await callGrok(prompt)
        const data = parseJSON(content)

        allAnalogies.push(data)

        console.log(`  ✅ "${data.analogy.substring(0, 50)}..."`)
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

await writeFile(
  `./seeding-output/subject-analogies-batch${BATCH_NUM}.json`,
  JSON.stringify(allAnalogies, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log(`📊 ANALOGIES BATCH ${BATCH_NUM} COMPLETE!`)
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(3)}`)
console.log(`\n📁 Saved to: ./seeding-output/subject-analogies-batch${BATCH_NUM}.json`)
