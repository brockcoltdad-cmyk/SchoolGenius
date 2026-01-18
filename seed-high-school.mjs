#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_KEY = process.env.XAI_API_KEY
const DELAY_MS = 2000

console.log('='.repeat(70))
console.log('SEEDING HIGH SCHOOL - Grades 9-12')
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

    let jsonStr = content
    const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
    if (jsonMatch) jsonStr = jsonMatch[1]

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

// High school skills
const tasks = [
  // MATH GRADE 9 - Algebra 1
  { subject: 'math', grade: 9, skill: 'solving linear equations' },
  { subject: 'math', grade: 9, skill: 'graphing linear functions' },
  { subject: 'math', grade: 9, skill: 'systems of equations' },
  { subject: 'math', grade: 9, skill: 'quadratic equations' },
  { subject: 'math', grade: 9, skill: 'factoring polynomials' },

  // MATH GRADE 10 - Geometry
  { subject: 'math', grade: 10, skill: 'triangle congruence' },
  { subject: 'math', grade: 10, skill: 'circle theorems' },
  { subject: 'math', grade: 10, skill: 'trigonometric ratios' },
  { subject: 'math', grade: 10, skill: 'area and volume' },
  { subject: 'math', grade: 10, skill: 'coordinate geometry' },

  // MATH GRADE 11 - Algebra 2
  { subject: 'math', grade: 11, skill: 'exponential functions' },
  { subject: 'math', grade: 11, skill: 'logarithms' },
  { subject: 'math', grade: 11, skill: 'polynomial functions' },
  { subject: 'math', grade: 11, skill: 'rational expressions' },
  { subject: 'math', grade: 11, skill: 'sequences and series' },

  // MATH GRADE 12 - Pre-Calculus
  { subject: 'math', grade: 12, skill: 'limits' },
  { subject: 'math', grade: 12, skill: 'derivatives basics' },
  { subject: 'math', grade: 12, skill: 'trigonometric identities' },
  { subject: 'math', grade: 12, skill: 'vectors' },
  { subject: 'math', grade: 12, skill: 'matrices' },

  // READING GRADE 9
  { subject: 'reading', grade: 9, skill: 'literary analysis' },
  { subject: 'reading', grade: 9, skill: 'theme identification' },
  { subject: 'reading', grade: 9, skill: 'rhetorical devices' },

  // READING GRADE 10
  { subject: 'reading', grade: 10, skill: 'argument analysis' },
  { subject: 'reading', grade: 10, skill: 'author purpose' },
  { subject: 'reading', grade: 10, skill: 'textual evidence' },

  // READING GRADE 11
  { subject: 'reading', grade: 11, skill: 'critical analysis' },
  { subject: 'reading', grade: 11, skill: 'synthesis' },
  { subject: 'reading', grade: 11, skill: 'evaluating arguments' },

  // READING GRADE 12
  { subject: 'reading', grade: 12, skill: 'literary criticism' },
  { subject: 'reading', grade: 12, skill: 'comparative analysis' },
  { subject: 'reading', grade: 12, skill: 'research synthesis' },

  // WRITING GRADE 9
  { subject: 'writing', grade: 9, skill: 'essay structure' },
  { subject: 'writing', grade: 9, skill: 'thesis statements' },
  { subject: 'writing', grade: 9, skill: 'evidence integration' },

  // WRITING GRADE 10
  { subject: 'writing', grade: 10, skill: 'argumentative essays' },
  { subject: 'writing', grade: 10, skill: 'research papers' },
  { subject: 'writing', grade: 10, skill: 'citation formats' },

  // WRITING GRADE 11
  { subject: 'writing', grade: 11, skill: 'analytical writing' },
  { subject: 'writing', grade: 11, skill: 'rhetorical analysis' },
  { subject: 'writing', grade: 11, skill: 'persuasive techniques' },

  // WRITING GRADE 12
  { subject: 'writing', grade: 12, skill: 'college essays' },
  { subject: 'writing', grade: 12, skill: 'professional writing' },
  { subject: 'writing', grade: 12, skill: 'research methodology' },
]

async function run() {
  console.log(`Generating ${tasks.length} skills × 20 items = ${tasks.length * 20} items\n`)

  for (const task of tasks) {
    console.log(`\n${task.subject.toUpperCase()} G${task.grade}: ${task.skill}`)

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
