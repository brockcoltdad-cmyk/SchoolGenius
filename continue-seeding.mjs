#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

// ============================================================================
// CONTINUE SEEDING - Generate 5 items at a time (smaller batches = better JSON)
// ============================================================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_KEY = process.env.XAI_API_KEY
const DELAY_MS = 2000

if (!GROK_KEY) {
  console.error('Missing XAI_API_KEY')
  process.exit(1)
}

console.log('='.repeat(70))
console.log('SEEDING WORKER - Generating Practice Problems')
console.log('='.repeat(70))

let totalGenerated = 0
let totalErrors = 0
const startTime = Date.now()

async function callGrok(prompt) {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 8000
      })
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.log('  Rate limited, waiting 10s...')
        await new Promise(r => setTimeout(r, 10000))
        return callGrok(prompt)
      }
      throw new Error(`Grok API ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extract JSON - try multiple patterns
    let jsonStr = content
    const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
    if (jsonMatch) jsonStr = jsonMatch[1]

    // Clean up common issues
    jsonStr = jsonStr.trim()
    if (!jsonStr.startsWith('[')) {
      const arrStart = jsonStr.indexOf('[')
      if (arrStart !== -1) jsonStr = jsonStr.slice(arrStart)
    }

    return JSON.parse(jsonStr)
  } catch (err) {
    throw err
  }
}

async function generateBatch(subject, grade, skill, batchNum) {
  const idPrefix = `${subject.toUpperCase()}-G${grade}-${skill.replace(/\s+/g, '').toUpperCase().slice(0,6)}`
  const startNum = batchNum * 5 + 1

  const prompt = `Generate 5 ${subject} practice problems for grade ${grade} about "${skill}".

Return a JSON array. Each item needs:
- id: "${idPrefix}-${String(startNum).padStart(4,'0')}" (increment for each)
- subject: "${subject}"
- grade: ${grade}
- skill: "${skill}"
- question: the problem
- answer: correct answer
- explanation: brief explanation

Example format:
[
  {"id":"${idPrefix}-${String(startNum).padStart(4,'0')}","subject":"${subject}","grade":${grade},"skill":"${skill}","question":"What is...","answer":"42","explanation":"Because..."},
  {"id":"${idPrefix}-${String(startNum+1).padStart(4,'0')}","subject":"${subject}","grade":${grade},"skill":"${skill}","question":"Calculate...","answer":"15","explanation":"The formula is..."}
]

Return ONLY the JSON array, no other text.`

  try {
    const items = await callGrok(prompt)

    if (!Array.isArray(items)) throw new Error('Not an array')

    const withSource = items.map(item => ({
      ...item,
      source_file: `seeding-${subject}-g${grade}.json`
    }))

    const { error } = await supabase
      .from('practice_problems')
      .upsert(withSource, { onConflict: 'id', ignoreDuplicates: true })

    if (error) {
      console.log(` DB: ${error.message.slice(0,50)}`)
      return 0
    }

    return items.length
  } catch (err) {
    console.log(` Err: ${err.message.slice(0,40)}`)
    totalErrors++
    return 0
  }
}

// Skills to generate
const tasks = [
  // Math Grade 5
  { subject: 'math', grade: 5, skill: 'decimals' },
  { subject: 'math', grade: 5, skill: 'fractions' },
  { subject: 'math', grade: 5, skill: 'volume' },
  { subject: 'math', grade: 5, skill: 'order of operations' },
  // Math Grade 8
  { subject: 'math', grade: 8, skill: 'linear equations' },
  { subject: 'math', grade: 8, skill: 'pythagorean theorem' },
  { subject: 'math', grade: 8, skill: 'slope' },
  { subject: 'math', grade: 8, skill: 'scientific notation' },
  // Reading Grade 2
  { subject: 'reading', grade: 2, skill: 'main idea' },
  { subject: 'reading', grade: 2, skill: 'sequence' },
  { subject: 'reading', grade: 2, skill: 'character traits' },
  // Reading Grade 3
  { subject: 'reading', grade: 3, skill: 'compare contrast' },
  { subject: 'reading', grade: 3, skill: 'fact vs opinion' },
  { subject: 'reading', grade: 3, skill: 'summarizing' },
  // Writing Grade 3
  { subject: 'writing', grade: 3, skill: 'paragraphs' },
  { subject: 'writing', grade: 3, skill: 'topic sentences' },
  // Writing Grade 4
  { subject: 'writing', grade: 4, skill: 'narrative' },
  { subject: 'writing', grade: 4, skill: 'descriptive' },
]

async function run() {
  for (const task of tasks) {
    console.log(`\n${task.subject.toUpperCase()} G${task.grade}: ${task.skill}`)

    // Generate 4 batches of 5 = 20 items per skill
    for (let batch = 0; batch < 4; batch++) {
      process.stdout.write(`  Batch ${batch+1}/4...`)
      const count = await generateBatch(task.subject, task.grade, task.skill, batch)
      totalGenerated += count
      console.log(` ${count} items (total: ${totalGenerated})`)
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  const mins = Math.floor((Date.now() - startTime) / 60000)
  console.log('\n' + '='.repeat(70))
  console.log(`DONE: ${totalGenerated} items, ${totalErrors} errors, ${mins} minutes`)
  console.log('='.repeat(70))
}

run()
