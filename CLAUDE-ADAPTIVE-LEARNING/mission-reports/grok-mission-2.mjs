#!/usr/bin/env node
import { readFile } from 'fs/promises'
import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from SchoolGenius-Final root
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

// ============================================================================
// GROK MISSION 2: SYLLABUS SYSTEM (3 MODES)
// ============================================================================
// Extract implementation details about Default, Custom, and Scanned syllabi
// ============================================================================

const GROK_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

async function callGrok(prompt) {
  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROK_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`\n❌ Grok API Error ${response.status}:`, errorBody)
    throw new Error(`Grok API error: ${response.status} - ${errorBody}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

console.log('🎯 MISSION 2: SYLLABUS SYSTEM (3 MODES)')
console.log('='.repeat(80))
console.log('Extracting implementation details...\n')

// Key files for syllabus system (relative to SchoolGenius root)
const keyFiles = [
  '../../SYLLABUS-DEPLOYMENT-GUIDE.md',
  '../../QUICK-TEST-INSTRUCTIONS.md',
  '../../COMPREHENSIVE-GAP-ANALYSIS.md',
  '../../CLEVER-IDEAS-MASTER-LIST.md',
  '../../PRIORITY-IMPLEMENTATION-ROADMAP.md'
]

// Read files
const fileContents = []
for (const file of keyFiles) {
  try {
    const content = await readFile(file, 'utf-8')
    const filename = file.split('/').pop()
    fileContents.push(`\n\n=== FILE: ${filename} ===\n${content}`)
    console.log(`✅ Read ${filename}`)
  } catch (err) {
    console.log(`⚠️  Skipped ${file.split('/').pop()} (not found)`)
  }
}

if (fileContents.length === 0) {
  console.error('❌ No files found! Cannot proceed.')
  process.exit(1)
}

const allContent = fileContents.join('\n')

const prompt = `You are analyzing SchoolGenius educational platform documentation to extract EVERY implementation detail about the SYLLABUS SYSTEM.

Here are the research files:

${allContent.slice(0, 50000)}

EXTRACT AND DOCUMENT:

## 1. The 3 Syllabus Modes
- **Default Mode**: What is it? How does it work?
- **Custom Mode**: What is it? How does it work?
- **Scanned Mode**: What is it? How does it work?

## 2. Mode Interaction & Priority Logic
- HOW do the 3 modes interact with each other?
- WHAT is the priority order? (Which overrides which?)
- WHEN does one mode take precedence over another?
- HOW does the system handle conflicts between modes?
- ANY specific rules or decision trees?

## 3. Scanned Syllabus Processing
- HOW does a scanned syllabus generate prep lessons?
- WHEN should prep lessons appear? (how many days before school?)
- WHAT is the algorithm for determining prep timing?
- HOW does the system parse scanned syllabi?
- WHAT edge function handles this? (analyze-syllabus mentioned?)

## 4. Custom Mode Details
- HOW does custom mode let parents/kids customize?
- WHAT can be customized? (subjects, schedule, difficulty?)
- WHERE is the UI for customization?
- HOW are custom settings stored?

## 5. UI Elements Needed
- WHAT pages/components are needed?
- WHERE do users switch between modes?
- HOW is the current mode displayed?
- WHAT controls are needed for each mode?

## 6. Database Schema
- WHAT tables store syllabus data?
- WHAT fields are in each table?
- HOW are the 3 modes differentiated in the database?

## 7. Business Rules
- ANY specific rules about mode switching?
- ANY validation requirements?
- ANY parent/kid permission differences?
- ANY grade-level restrictions?

## 8. Implementation Details
- Code references (file paths, function names)
- API endpoints mentioned
- Edge functions mentioned
- Migration files related to syllabus

Please extract EVERYTHING related to the syllabus system with specific implementation details, code references, and business logic.
Format as a comprehensive implementation report.`

console.log('🤖 Calling Grok to analyze syllabus system...\n')

const report = await callGrok(prompt)

// Save report to file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const filename = `mission-2-report-${timestamp}.md`
await writeFile(filename, report)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log('✅ MISSION 2 COMPLETE!')
console.log(`📄 Report saved to: ${filename}`)
