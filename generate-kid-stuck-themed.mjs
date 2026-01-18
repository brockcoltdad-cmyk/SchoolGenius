#!/usr/bin/env node

/**
 * THEMED KID STUCK RESPONSES GENERATOR
 *
 * Generates theme-specific responses for when students are stuck
 * Matches SchoolGenius's 80+ theme system
 *
 * Usage: node generate-kid-stuck-themed.mjs
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const API_KEYS = {
  1: 'process.env.XAI_API_KEY',
  2: 'process.env.XAI_API_KEY'
}

const GROK_API_KEY = API_KEYS[1]  // Use first key
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DELAY_MS = 5000

console.log('🎨 THEMED KID STUCK RESPONSES GENERATOR')
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
      temperature: 0.8  // Higher for more creativity
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

// POPULAR THEMES (Start with top 10 most used)
const THEMES = [
  // K-2 favorites
  { id: 'battle', name: 'Battle Royale', examples: 'Victory Royale!, GG!, Rotate!, Storm coming!, Legendary!, That\'s a dub!' },
  { id: 'dinosaur', name: 'Dinosaur', examples: 'Roar!, T-Rex power!, Stomp!, Dino strength!, Prehistoric!' },
  { id: 'unicorn', name: 'Unicorn', examples: 'Magical!, Sparkles!, Rainbow power!, Enchanted!, Starlight!' },
  { id: 'princess', name: 'Princess', examples: 'Your majesty!, Royal!, Crown worthy!, Castle magic!, Enchanted!' },
  { id: 'space', name: 'Space', examples: 'Blast off!, Mission control!, Astronaut!, Houston!, Stellar!' },

  // 3-5 favorites
  { id: 'ninja', name: 'Ninja', examples: 'Stealth mode!, Shadow strike!, Ninja skills!, Silent but deadly!, Epic move!' },
  { id: 'builder', name: 'Minecraft', examples: 'Achievement unlocked!, Diamond level!, Crafted!, Legendary loot!, Nether portal!' },

  // 6-8 favorites
  { id: 'anime', name: 'Anime', examples: 'Plus Ultra!, Believe it!, Over 9000!, Epic!, Legendary!' },
  { id: 'esports', name: 'Esports', examples: 'Pro gamer!, GG!, Clutch!, MVP!, Tournament ready!' },

  // 9-12 favorites
  { id: 'lofi', name: 'Lofi', examples: 'Chill vibes, Stay focused, Flow state, Study mode, Zen' }
]

// Age groups with their tone
const AGE_GROUPS = [
  { id: 'k2', name: 'K-2 (ages 5-8)', tone: 'Super simple, very excited! Use emojis! 🎉⭐✨' },
  { id: 'grades35', name: '3-5 (ages 8-11)', tone: 'Friendly teacher, encouraging! 🎯💡' },
  { id: 'grades68', name: '6-8 (ages 11-14)', tone: 'Mature peer, respectful 💪✓' },
  { id: 'grades912', name: '9-12 (ages 14-18)', tone: 'Professional, academic ✓📊' }
]

// What students say when stuck
const QUESTION_TYPES = [
  { id: 'dont_get_it', phrase: "I don't get it" },
  { id: 'this_is_hard', phrase: 'This is hard' },
  { id: 'help', phrase: 'Help!' },
  { id: 'confused', phrase: "I'm confused" },
  { id: 'explain_again', phrase: 'Can you explain again?' }
]

const SUBJECTS = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']

const allResponses = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log('\n📊 Generation Plan:')
console.log(`Themes: ${THEMES.length}`)
console.log(`Age Groups: ${AGE_GROUPS.length}`)
console.log(`Question Types: ${QUESTION_TYPES.length}`)
console.log(`Subjects: ${SUBJECTS.length}`)
console.log(`Total combinations: ${THEMES.length * AGE_GROUPS.length * QUESTION_TYPES.length * SUBJECTS.length}`)
console.log(`Target: ~340 items for database\n`)

let itemNum = 0

// Generate for each combination
for (const theme of THEMES) {
  console.log(`\n🎨 Theme: ${theme.name}`)

  for (const ageGroup of AGE_GROUPS) {
    for (const questionType of QUESTION_TYPES) {
      for (const subject of SUBJECTS) {
        itemNum++

        try {
          console.log(`[${itemNum}] ${theme.name} | ${ageGroup.id} | ${questionType.id} | ${subject}`)

          const prompt = `You are generating age-appropriate responses for SchoolGenius educational app.

THEME: ${theme.name} (ID: ${theme.id})
THEME LANGUAGE EXAMPLES: ${theme.examples}
AGE GROUP: ${ageGroup.name}
AGE TONE: ${ageGroup.tone}
SITUATION: Student says "${questionType.phrase}" while learning ${subject}
SUBJECT: ${subject}

CRITICAL REQUIREMENTS:
1. Use THEME-SPECIFIC language! (Kids LOVE hearing Fortnite terms in battle theme!)
2. Match age group tone EXACTLY
3. Be encouraging, warm, make mistakes feel normal
4. Give hints, NOT answers
5. Under 40 words
6. Use theme-appropriate emojis

EXAMPLES:
- Battle theme (K-2): "No sweat, soldier! Even pros practice! Let's drop into this problem with a new strategy! 💪🎯"
- Princess theme (K-2): "Every princess learns at her own pace, your majesty! Let's try a royal new approach! 👑✨"
- Dinosaur theme (K-2): "Even T-Rex took time to learn! Let's stomp through this together, dino friend! 🦖💪"

Return ONLY this JSON (no markdown):
{"question_type":"${questionType.id}","subject":"${subject}","age_group":"${ageGroup.id}","response":"your themed response","response_tone":"encouraging"}`

          const content = await callGrok(prompt)
          const data = parseJSON(content)

          // Add theme to the data
          data.theme = theme.id

          allResponses.push(data)

          console.log(`  ✅ "${data.response.substring(0, 60)}..."`)
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

// Save results
await writeFile(
  './themed-output/kid-stuck-responses-themed.json',
  JSON.stringify(allResponses, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 THEMED GENERATION COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/kid-stuck-responses-themed.json`)

console.log('\n📊 Sample Results by Theme:')
const byTheme = {}
allResponses.forEach(item => {
  if (!byTheme[item.theme]) byTheme[item.theme] = 0
  byTheme[item.theme]++
})
Object.entries(byTheme).forEach(([theme, count]) => {
  console.log(`  ${theme}: ${count} items`)
})

console.log('\n✨ Next Steps:')
console.log('1. Review the generated responses')
console.log('2. If good, build remaining 7 generators')
console.log('3. Import to Supabase kid_stuck_responses table')
console.log('4. Test on SchoolGenius website')
