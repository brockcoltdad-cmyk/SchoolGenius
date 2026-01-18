#!/usr/bin/env node
import { parentPort, workerData } from 'worker_threads'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') })

// ============================================================================
// WORKER B - Grok Key 2
// ============================================================================
// Generates 2,328 items:
// - Explanation Library Batch 2 (420 items - skills 61-120)
// - Mistake Patterns (500 items)
// - Subject Analogies (1,100 items)
// - Parent Guides (28 items)
// - Return Messages (80 items)
// - Gigi Personality (200 items)
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eczpdbkslqbduiesbqcm.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GROK_KEY = process.env[workerData.apiKeyEnv]

if (!GROK_KEY) {
  throw new Error(`Missing API key: ${workerData.apiKeyEnv}`)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

let totalCompleted = 0

function sendProgress(status) {
  parentPort.postMessage({
    type: 'progress',
    completed: totalCompleted,
    status
  })
}

function log(message) {
  parentPort.postMessage({ type: 'log', message })
}

function reportError(error) {
  parentPort.postMessage({ type: 'error', error: error.message })
}

async function callGrok(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
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
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        const errorBody = await response.text()
        if (response.status === 429 && attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000
          log(`Rate limited, waiting ${waitTime}ms...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
        log(`Full Grok API error: ${response.status} - ${errorBody}`)
        throw new Error(`Grok API error: ${response.status} - ${errorBody}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      // Extract JSON from markdown if needed
      const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
      const jsonString = jsonMatch ? jsonMatch[1] : content

      return JSON.parse(jsonString)
    } catch (error) {
      if (attempt === retries) throw error
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

// ============================================================================
// SECTION 1: Explanation Library Batch 2 (420 items - skills 61-120)
// ============================================================================
async function generateExplanationsBatch2() {
  log('Starting Explanation Library Batch 2 (420 items)...')
  sendProgress('Explanations Batch 2: 0/420')

  // Get skills 61-120 from curriculum
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_name, subject_code')
    .eq('is_active', true)
    .order('subject_code, skill_order')
    .range(60, 119)

  if (!skills) {
    log('No skills found in database')
    return
  }

  for (let i = 0; i < skills.length; i++) {
    try {
      const skill = skills[i]

      const prompt = `Generate multi-level explanations for: ${skill.skill_name}

Create 7 explanation levels:
1. level_1: Standard explanation (50-75 words)
2. level_2: Simplified breakdown (40-60 words)
3. level_3: Most basic with analogies (30-50 words)
4. visual_explanation: Picture-based (40-60 words)
5. story_explanation: Story/analogy (50-75 words)
6. hands_on_explanation: Activity-based (40-60 words)
7. step_by_step: Detailed steps (60-80 words)

Return JSON:
{
  "skill_id": "${skill.id}",
  "subject_code": "${skill.subject_code}",
  "skill_name": "${skill.skill_name}",
  "level_1": "...",
  "level_2": "...",
  "level_3": "...",
  "visual_explanation": "...",
  "story_explanation": "...",
  "hands_on_explanation": "...",
  "step_by_step": "..."
}`

      const result = await callGrok(prompt)

      await supabase.from('explanation_library').insert(result)

      totalCompleted++
      sendProgress(`Explanations Batch 2: ${i + 1}/60 skills (${(i+1)*7} items)`)

      await new Promise(resolve => setTimeout(resolve, 5000))
    } catch (error) {
      reportError(error)
    }
  }

  log('✅ Explanation Library Batch 2 complete!')
}

// ============================================================================
// SECTION 2: Mistake Patterns (500 items)
// ============================================================================
async function generateMistakePatterns() {
  log('Starting Mistake Patterns (500 items)...')
  sendProgress('Mistake Patterns: 0/500')

  // Get top 100 skills (5 mistakes each = 500 patterns)
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_name, subject_code')
    .eq('is_active', true)
    .order('subject_code, skill_order')
    .limit(100)

  if (!skills) {
    log('No skills found')
    return
  }

  for (let i = 0; i < skills.length; i++) {
    try {
      const skill = skills[i]

      const prompt = `Generate 5 common mistake patterns for: ${skill.skill_name}

For each mistake:
- wrong_answer: What kid might answer incorrectly
- why_kid_chose: Why they might pick this
- feedback: Helpful correction (30-50 words)

Return JSON array of 5 mistakes:
[
  {
    "skill_id": "${skill.id}",
    "subject_code": "${skill.subject_code}",
    "problem_text": "Example problem",
    "correct_answer": "Correct answer",
    "wrong_answer": "Wrong answer",
    "why_kid_chose": "Common misconception",
    "feedback": "Helpful correction"
  },
  ...
]`

      const results = await callGrok(prompt)

      for (const mistake of results) {
        await supabase.from('mistake_patterns').insert(mistake)
        totalCompleted++
      }

      sendProgress(`Mistake Patterns: ${(i + 1) * 5}/500`)

      await new Promise(resolve => setTimeout(resolve, 5000))
    } catch (error) {
      reportError(error)
    }
  }

  log('✅ Mistake Patterns complete!')
}

// ============================================================================
// SECTION 3: Subject Analogies (1,100 items)
// ============================================================================
async function generateAnalogies() {
  log('Starting Subject Analogies (1,100 items)...')
  sendProgress('Analogies: 0/1100')

  // Get all skills
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_name, subject_code')
    .eq('is_active', true)
    .order('subject_code, skill_order')
    .limit(120)

  if (!skills) {
    log('No skills found')
    return
  }

  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  for (let i = 0; i < skills.length; i++) {
    try {
      const skill = skills[i]

      for (const ageGroup of ageGroups) {
        const prompt = `Create 2-3 relatable analogies for ${ageGroup} students learning: ${skill.skill_name}

For ${skill.subject_code} subject.

Age guidelines:
- k2: Simple objects kids touch (toys, food, animals)
- grades35: School/play scenarios (sports, games, movies)
- grades68: Logic/technology (recipes, games, code)
- grades912: Abstract concepts (physics, economics)

Return JSON array:
[
  {
    "skill_id": "${skill.id}",
    "subject_code": "${skill.subject_code}",
    "skill_name": "${skill.skill_name}",
    "age_group": "${ageGroup}",
    "analogy": "Think of it like...",
    "explanation": "Brief explanation (30-50 words)"
  },
  ...
]`

        const analogies = await callGrok(prompt)

        for (const analogy of analogies) {
          await supabase.from('subject_analogies').insert(analogy)
          totalCompleted++
        }

        sendProgress(`Analogies: ${totalCompleted}/1100`)

        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    } catch (error) {
      reportError(error)
    }
  }

  log('✅ Subject Analogies complete!')
}

// ============================================================================
// SECTION 4: Parent Guides (28 items)
// ============================================================================
async function generateParentGuides() {
  log('Starting Parent Guides (28 items)...')
  sendProgress('Parent Guides: 0/28')

  const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing', 'Language Arts', 'Science']
  const categories = [
    'My kid struggles with [subject]',
    'How do I help with [subject] at home?',
    'My kid hates [subject]',
    'My kid gets frustrated with [subject]'
  ]

  let count = 0

  for (const subject of subjects) {
    for (const catTemplate of categories) {
      try {
        const category = catTemplate.replace('[subject]', subject)

        const prompt = `A parent asks: "${category}"

Write a helpful response with:
1. Empathy (acknowledge the challenge)
2. 5 specific home strategies
3. Encouragement

Keep it practical and actionable (150-200 words).

Return JSON:
{
  "subject": "${subject}",
  "question_category": "${category}",
  "answer": "Your helpful response",
  "quick_tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}`

        const result = await callGrok(prompt)

        await supabase.from('parent_help_articles').insert(result)

        count++
        totalCompleted++
        sendProgress(`Parent Guides: ${count}/28`)

        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        reportError(error)
      }
    }
  }

  log('✅ Parent Guides complete!')
}

// ============================================================================
// SECTION 5: Return Messages (80 items)
// ============================================================================
async function generateReturnMessages() {
  log('Starting Return Messages (80 items)...')
  sendProgress('Return Messages: 0/80')

  const absencePeriods = ['1 day', '2-3 days', '4-7 days', '1-2 weeks', '2+ weeks']
  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let count = 0

  for (const period of absencePeriods) {
    for (const ageGroup of ageGroups) {
      try {
        const prompt = `Generate 4 welcoming return messages for a ${ageGroup} student who's been gone ${period}.

Tone for ${ageGroup}:
- k2: Excited, simple 🎉
- grades35: Friendly, welcoming 🎯
- grades68: Motivating, respectful 💪
- grades912: Professional, encouraging ✓

Return JSON array of 4 messages:
[
  {
    "absence_period": "${period}",
    "age_group": "${ageGroup}",
    "message": "Welcome back message (40-60 words)",
    "tone": "excited/friendly/motivating/professional"
  },
  ...
]`

        const messages = await callGrok(prompt)

        for (const msg of messages) {
          await supabase.from('return_messages').insert(msg)
          count++
          totalCompleted++
        }

        sendProgress(`Return Messages: ${count}/80`)

        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        reportError(error)
      }
    }
  }

  log('✅ Return Messages complete!')
}

// ============================================================================
// SECTION 6: Gigi Personality (200 items)
// ============================================================================
async function generateGigiPersonality() {
  log('Starting Gigi Personality (200 items)...')
  sendProgress('Gigi Personality: 0/200')

  const categories = [
    'encouragement_style',
    'explanation_approach',
    'celebration_energy',
    'comfort_technique',
    'challenge_style'
  ]
  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let count = 0

  for (const category of categories) {
    for (const ageGroup of ageGroups) {
      try {
        const prompt = `Define Gigi's ${category} for ${ageGroup} students.

Create 10 specific personality traits/phrases Gigi uses.

Age tone:
- k2: Bubbly friend, lots of emojis
- grades35: Helpful teacher
- grades68: Cool mentor
- grades912: Professional tutor

Return JSON array of 10 items:
[
  {
    "category": "${category}",
    "age_group": "${ageGroup}",
    "trait": "Specific personality trait",
    "example_phrase": "Example of what Gigi would say"
  },
  ...
]`

        const traits = await callGrok(prompt)

        for (const trait of traits) {
          await supabase.from('gigi_personality').insert(trait)
          count++
          totalCompleted++
        }

        sendProgress(`Gigi Personality: ${count}/200`)

        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        reportError(error)
      }
    }
  }

  log('✅ Gigi Personality complete!')
}

// ============================================================================
// Run all tasks
// ============================================================================
async function runWorker() {
  try {
    log('Worker B starting...')

    await generateExplanationsBatch2()
    await generateMistakePatterns()
    await generateAnalogies()
    await generateParentGuides()
    await generateReturnMessages()
    await generateGigiPersonality()

    log('Worker B complete! All tasks finished.')
    process.exit(0)
  } catch (error) {
    log(`Fatal error: ${error.message}`)
    reportError(error)
    process.exit(1)
  }
}

runWorker()
