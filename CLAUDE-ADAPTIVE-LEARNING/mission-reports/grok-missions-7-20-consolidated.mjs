#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

const GROK_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

async function callGrok(prompt) {
  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROK_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'grok-3', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 4000 })
  })
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Grok API error: ${response.status} - ${errorBody}`)
  }
  return (await response.json()).choices[0].message.content
}

console.log('🎯 MISSIONS 7-20 CONSOLIDATED EXTRACTION')
console.log('='.repeat(80))

// Read all key documentation files
const allFiles = [
  '../../CLEVER-IDEAS-MASTER-LIST.md',
  '../../COMPREHENSIVE-GAP-ANALYSIS.md',
  '../../CLOSED-LOOP-AUDIT-REPORT.md',
  '../../SMART-SEEDING-STRATEGY.md',
  '../../THEMED-GENERATION-PLAN.md',
  '../../SYLLABUS-DEPLOYMENT-GUIDE.md',
  '../../QUICK-TEST-INSTRUCTIONS.md'
]

const fileContents = []
for (const file of allFiles) {
  try {
    const content = await readFile(file, 'utf-8')
    fileContents.push(`\n=== ${file.split('/').pop()} ===\n${content}`)
    console.log(`✅ ${file.split('/').pop()}`)
  } catch { console.log(`⚠️  Skipped ${file.split('/').pop()}`) }
}

const combinedContent = fileContents.join('\n').slice(0, 50000)

const prompt = `Analyze SchoolGenius documentation for MISSIONS 7-20. Extract ALL implementation details:

${combinedContent}

MISSION 7 - PROGRESS TRACKING:
- Metrics tracked per subject/skill
- Mastery determination (thresholds, criteria)
- Spaced repetition algorithm
- Review triggers & scheduling
- Prerequisite tracking

MISSION 8 - THEME SYSTEM:
- Total themes (by age group)
- What makes each unique?
- Gigi changes per theme
- Theme pricing & unlocking
- Theme shop mechanics

MISSION 9 - PARENT DASHBOARD:
- What can parents see/control?
- Parent Helper AI workflow
- Notification types available
- Prize system mechanics
- Custom task creation

MISSION 10 - CONTENT SEEDING:
- EXACTLY what are the 2,280 items?
- Breakdown by category
- Generation format for each
- Prompts used
- Batch generation process

MISSION 11 - LESSON STRUCTURE:
- Exact lesson sequence (Rules→Demo→Practice→Quiz)
- Problems per section
- Advance criteria
- Passing thresholds
- Adaptive difficulty within lessons

MISSION 12 - DOCUMENT SCANNING:
- Scanning workflow (camera→upload→process)
- AI models used (Gemini, Grok)
- Text extraction process
- Document categorization
- Post-scan processing

MISSION 13 - CHAT & GIGI:
- Chat mechanics
- Personality per theme
- Question types answered
- Context carryover
- Conversation flows

MISSION 14 - SUBJECT SYSTEMS:
- Math unique features
- Reading Lexile levels
- Typing WPM tracking
- Phonics progressions
- Coding projects

MISSION 15 - CLOSED-LOOP ECONOMICS:
- $23K-$49K savings calculation
- What's cached vs generated?
- Cost approaching $0 mechanics
- Usage projections
- Economic models

MISSION 16 - FUTURE FEATURES:
- Documented but not built features
- On-demand story library concept
- Streaming generation
- Postponement reasons
- Implementation approaches

MISSION 17 - DATABASE ARCHITECTURE:
- Complete table list
- Table relationships
- RLS policies
- Indexes
- Constraints/triggers

MISSION 18 - API ROUTES:
- All endpoints
- What each does
- Database interactions
- Authentication requirements
- Rate limiting/caching

MISSION 19 - ANIMATIONS:
- Animation types (confetti, particles, etc.)
- Trigger conditions
- Customization options
- Physics/timing
- Performance considerations

MISSION 20 - MASTER TEMPLATE:
- How it works
- 94% code reduction explained
- Adding new themes easily
- Configurable elements
- Best practices

Format as ONE comprehensive report covering ALL missions with specific values, code references, and implementation details.`

console.log('🤖 Calling Grok for comprehensive extraction...\n')

const report = await callGrok(prompt)

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const filename = `missions-7-20-consolidated-${timestamp}.md`
await writeFile(filename, report)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log(`✅ MISSIONS 7-20 COMPLETE! Saved: ${filename}`)
