#!/usr/bin/env node

/**
 * PARENT STRUGGLE GUIDES GENERATOR
 * NOT themed - for parents, not kids
 * Total: 28 items
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

console.log('👨‍👩‍👧‍👦 PARENT STRUGGLE GUIDES GENERATOR')
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

const STRUGGLES = [
  // Subject-specific
  { type: 'subject', subject: 'Math', gradeRange: 'K-2', struggle: 'struggles with basic math concepts' },
  { type: 'subject', subject: 'Math', gradeRange: '3-5', struggle: 'struggles with multiplication/division' },
  { type: 'subject', subject: 'Math', gradeRange: '6-8', struggle: 'struggles with algebra' },
  { type: 'subject', subject: 'Math', gradeRange: '9-12', struggle: 'struggles with advanced math' },

  { type: 'subject', subject: 'Reading', gradeRange: 'K-2', struggle: 'struggles with phonics/decoding' },
  { type: 'subject', subject: 'Reading', gradeRange: '3-5', struggle: 'struggles with comprehension' },
  { type: 'subject', subject: 'Reading', gradeRange: '6-8', struggle: 'struggles with analysis' },
  { type: 'subject', subject: 'Reading', gradeRange: '9-12', struggle: 'struggles with complex texts' },

  // Behavioral
  { type: 'behavioral', subject: null, gradeRange: 'K-2', struggle: 'won\'t sit still for lessons' },
  { type: 'behavioral', subject: null, gradeRange: '3-5', struggle: 'rushes through work' },
  { type: 'behavioral', subject: null, gradeRange: '6-8', struggle: 'refuses to try hard subjects' },
  { type: 'behavioral', subject: null, gradeRange: '9-12', struggle: 'lacks motivation to study' },

  // Specific issues
  { type: 'specific', subject: null, gradeRange: 'All Ages', struggle: 'has test anxiety' },
  { type: 'specific', subject: null, gradeRange: 'All Ages', struggle: 'gives up easily' },
  { type: 'specific', subject: null, gradeRange: 'All Ages', struggle: 'perfectionist/fear of mistakes' }
]

const allGuides = []
let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

console.log(`\nGenerating ${STRUGGLES.length} parent guides...\n`)

let itemNum = 0

for (const struggle of STRUGGLES) {
  itemNum++

  try {
    console.log(`[${itemNum}] ${struggle.type} | ${struggle.subject || 'General'} | ${struggle.gradeRange}`)

    const prompt = `You are creating a guide for parents whose child ${struggle.struggle}.

STRUGGLE TYPE: ${struggle.type}
${struggle.subject ? `SUBJECT: ${struggle.subject}` : ''}
GRADE RANGE: ${struggle.gradeRange}

Create a comprehensive parent guide with:

1. UNDERSTANDING (100-150 words): Why this happens, developmental context
2. SPECIFIC TIPS (5 actionable tips, each 20-30 words)
3. WHAT'S NORMAL (50-75 words): What to expect at this age
4. WHEN TO SEEK HELP (50-75 words): Red flags to watch for
5. TIMELINE (30-50 words): How long improvement typically takes

Be:
- Empathetic and supportive
- Evidence-based
- Practical and actionable
- Honest about challenges and timelines

Return JSON:
{"struggle_type":"${struggle.type}","subject":${struggle.subject ? `"${struggle.subject}"` : 'null'},"grade_range":"${struggle.gradeRange}","understanding":"your 100-150 word explanation","specific_tips":["tip1","tip2","tip3","tip4","tip5"],"whats_normal":"your 50-75 words","when_seek_help":"your 50-75 words","timeline":"your 30-50 words"}`

    const content = await callGrok(prompt)
    const data = parseJSON(content)

    allGuides.push(data)

    console.log(`  ✅ "${data.understanding.substring(0, 60)}..."`)
    totalSuccess++

    await new Promise(resolve => setTimeout(resolve, DELAY_MS))

  } catch (error) {
    console.error(`  ❌ ${error.message}`)
    totalErrors++
  }
}

await writeFile(
  './themed-output/parent-struggle-guides.json',
  JSON.stringify(allGuides, null, 2)
)

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 PARENT STRUGGLE GUIDES COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Success: ${totalSuccess}`)
console.log(`❌ Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📁 Saved to: ./themed-output/parent-struggle-guides.json`)
