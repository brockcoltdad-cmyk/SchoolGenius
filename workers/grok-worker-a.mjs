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
// WORKER A - Grok Key 1
// ============================================================================
// Generates 1,432 items:
// - Q&A Library (140 items)
// - Explanation Library Batch 1 (420 items)
// - Kid Stuck Responses (340 items)
// - Transition Phrases (300 items)
// - Celebration Messages (168 items)
// - Greeting Messages (64 items)
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
// SECTION 1: Q&A Library (140 items)
// ============================================================================
async function generateQALibrary() {
  log('Starting Q&A Library generation (140 items)...')
  sendProgress('Q&A Library: 0/140')

  const questions = [
    // Website Navigation (30 questions)
    { q: "How do I change my theme?", cat: "navigation" },
    { q: "Where do I see my coins?", cat: "navigation" },
    { q: "How do I find my achievements?", cat: "navigation" },
    { q: "Where is my profile?", cat: "navigation" },
    { q: "How do I go back to the main menu?", cat: "navigation" },
    { q: "Where can I see my progress?", cat: "navigation" },
    { q: "How do I start a lesson?", cat: "navigation" },
    { q: "Where is the shop?", cat: "navigation" },
    { q: "How do I chat with Gigi?", cat: "navigation" },
    { q: "Where can I see my streak?", cat: "navigation" },
    { q: "How do I check my level?", cat: "navigation" },
    { q: "Where are the games?", cat: "navigation" },
    { q: "How do I see my badges?", cat: "navigation" },
    { q: "Where is the leaderboard?", cat: "navigation" },
    { q: "How do I change subjects?", cat: "navigation" },
    { q: "Where can I read stories?", cat: "navigation" },
    { q: "How do I practice typing?", cat: "navigation" },
    { q: "Where is my syllabus?", cat: "navigation" },
    { q: "How do I scan homework?", cat: "navigation" },
    { q: "Where can I see my reports?", cat: "navigation" },
    { q: "How do I log out?", cat: "navigation" },
    { q: "Where are the settings?", cat: "navigation" },
    { q: "How do I switch kids?", cat: "navigation" },
    { q: "Where can I find help?", cat: "navigation" },
    { q: "How do I go to my dashboard?", cat: "navigation" },
    { q: "Where is the back button?", cat: "navigation" },
    { q: "How do I see today's lessons?", cat: "navigation" },
    { q: "Where can I see my schedule?", cat: "navigation" },
    { q: "How do I access my documents?", cat: "navigation" },
    { q: "Where is the prize shop?", cat: "navigation" },

    // Learning Mechanics (30 questions)
    { q: "What's a demo problem?", cat: "learning" },
    { q: "How do practice problems work?", cat: "learning" },
    { q: "What happens if I fail the quiz?", cat: "learning" },
    { q: "Can I skip the rules?", cat: "learning" },
    { q: "How many problems are in a lesson?", cat: "learning" },
    { q: "What are the stars for?", cat: "learning" },
    { q: "How do I get hints?", cat: "learning" },
    { q: "Can I retry a problem?", cat: "learning" },
    { q: "What happens if I get it wrong?", cat: "learning" },
    { q: "How does the quiz work?", cat: "learning" },
    { q: "Can I skip ahead?", cat: "learning" },
    { q: "What are guided practice problems?", cat: "learning" },
    { q: "How do I know if I'm right?", cat: "learning" },
    { q: "Can I go back to previous lessons?", cat: "learning" },
    { q: "What's independent practice?", cat: "learning" },
    { q: "How many tries do I get?", cat: "learning" },
    { q: "What happens when I finish a lesson?", cat: "learning" },
    { q: "Can I pause a lesson?", cat: "learning" },
    { q: "How do I ask for help?", cat: "learning" },
    { q: "What are challenge problems?", cat: "learning" },
    { q: "Can I redo a lesson?", cat: "learning" },
    { q: "How does difficulty work?", cat: "learning" },
    { q: "What's a mastery score?", cat: "learning" },
    { q: "Can I see my mistakes?", cat: "learning" },
    { q: "How do reviews work?", cat: "learning" },
    { q: "What's spaced repetition?", cat: "learning" },
    { q: "Can I choose easy mode?", cat: "learning" },
    { q: "How do I unlock new skills?", cat: "learning" },
    { q: "What's the foundation test?", cat: "learning" },
    { q: "Can Gigi help me with problems?", cat: "learning" },

    // Coins & Rewards (20 questions)
    { q: "How do I earn coins?", cat: "rewards" },
    { q: "What can I buy with coins?", cat: "rewards" },
    { q: "How much do themes cost?", cat: "rewards" },
    { q: "Can I get coins back?", cat: "rewards" },
    { q: "How many coins do I get per lesson?", cat: "rewards" },
    { q: "What gives bonus coins?", cat: "rewards" },
    { q: "Can I earn coins from games?", cat: "rewards" },
    { q: "How do I redeem a prize?", cat: "rewards" },
    { q: "Where can I see my coin total?", cat: "rewards" },
    { q: "Can I lose coins?", cat: "rewards" },
    { q: "What's the most expensive theme?", cat: "rewards" },
    { q: "How do I get more coins fast?", cat: "rewards" },
    { q: "Can parents give me coins?", cat: "rewards" },
    { q: "What are coin transactions?", cat: "rewards" },
    { q: "Can I save up for big prizes?", cat: "rewards" },
    { q: "How do daily bonuses work?", cat: "rewards" },
    { q: "What happens if I spend all my coins?", cat: "rewards" },
    { q: "Can I earn coins from streaks?", cat: "rewards" },
    { q: "How many coins for perfect scores?", cat: "rewards" },
    { q: "What's the coin refund policy?", cat: "rewards" },

    // Themes (15 questions)
    { q: "How do I unlock Minecraft theme?", cat: "themes" },
    { q: "What themes are there?", cat: "themes" },
    { q: "Can I change back to my old theme?", cat: "themes" },
    { q: "Do themes change how lessons work?", cat: "themes" },
    { q: "How many themes can I own?", cat: "themes" },
    { q: "What's the coolest theme?", cat: "themes" },
    { q: "Can I preview a theme before buying?", cat: "themes" },
    { q: "Are there free themes?", cat: "themes" },
    { q: "How do I switch themes?", cat: "themes" },
    { q: "What's different about each theme?", cat: "themes" },
    { q: "Can I customize my theme?", cat: "themes" },
    { q: "Do themes affect Gigi?", cat: "themes" },
    { q: "What are theme skins?", cat: "themes" },
    { q: "Can I create my own theme?", cat: "themes" },
    { q: "What themes are for my age?", cat: "themes" },

    // Progress & Achievements (15 questions)
    { q: "How do I get badges?", cat: "progress" },
    { q: "What's my streak?", cat: "progress" },
    { q: "How do I level up?", cat: "progress" },
    { q: "What's XP?", cat: "progress" },
    { q: "How do achievements work?", cat: "progress" },
    { q: "Can I see my grade?", cat: "progress" },
    { q: "What's skill mastery?", cat: "progress" },
    { q: "How do I track my progress?", cat: "progress" },
    { q: "What are milestones?", cat: "progress" },
    { q: "Can parents see my progress?", cat: "progress" },
    { q: "How do I improve my accuracy?", cat: "progress" },
    { q: "What's my best subject?", cat: "progress" },
    { q: "Can I see my learning history?", cat: "progress" },
    { q: "What breaks my streak?", cat: "progress" },
    { q: "How do I compare with others?", cat: "progress" },

    // General Help (10 questions)
    { q: "I'm stuck, what do I do?", cat: "help" },
    { q: "Can I ask Gigi questions?", cat: "help" },
    { q: "How do I get help on a problem?", cat: "help" },
    { q: "What if I don't understand?", cat: "help" },
    { q: "Can Gigi explain differently?", cat: "help" },
    { q: "How do I report a bug?", cat: "help" },
    { q: "What if the app freezes?", cat: "help" },
    { q: "Can I contact support?", cat: "help" },
    { q: "How do I give feedback?", cat: "help" },
    { q: "What if I need more time?", cat: "help" }
  ]

  for (let i = 0; i < questions.length; i++) {
    try {
      const { q, cat } = questions[i]

      const prompt = `Generate age-appropriate answers to this kid question: "${q}"

Create 4 versions for different age groups:

Return JSON:
{
  "question": "${q}",
  "category": "${cat}",
  "answer_k2": "Simple, excited answer for K-2 (ages 5-8) with emojis 🎉",
  "answer_35": "Friendly answer for grades 3-5 (ages 8-11) 🎯",
  "answer_68": "Mature answer for grades 6-8 (ages 11-14) 💪",
  "answer_912": "Professional answer for grades 9-12 (ages 14-18) ✓"
}`

      const result = await callGrok(prompt)

      await supabase.from('qa_library').insert(result)

      totalCompleted++
      sendProgress(`Q&A Library: ${i + 1}/140`)

      // Rate limiting (5 seconds to match proven approach)
      await new Promise(resolve => setTimeout(resolve, 5000))
    } catch (error) {
      reportError(error)
    }
  }

  log('✅ Q&A Library complete!')
}

// ============================================================================
// SECTION 2: Explanation Library Batch 1 (420 items - first 60 skills)
// ============================================================================
async function generateExplanations() {
  log('Starting Explanation Library Batch 1 (420 items)...')
  sendProgress('Explanations Batch 1: 0/420')

  // Get first 60 skills from curriculum
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_name, subject_code')
    .eq('is_active', true)
    .order('subject_code, skill_order')
    .limit(60)

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
      sendProgress(`Explanations Batch 1: ${i + 1}/60 skills (${(i+1)*7} items)`)

      await new Promise(resolve => setTimeout(resolve, 5000))
    } catch (error) {
      reportError(error)
    }
  }

  log('✅ Explanation Library Batch 1 complete!')
}

// ============================================================================
// Run all tasks
// ============================================================================
async function runWorker() {
  try {
    log('Worker A starting...')

    await generateQALibrary()
    await generateExplanations()
    // Will add more sections later

    log('Worker A complete! All tasks finished.')
    process.exit(0)
  } catch (error) {
    log(`Fatal error: ${error.message}`)
    reportError(error)
    process.exit(1)
  }
}

runWorker()
