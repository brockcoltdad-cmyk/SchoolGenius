#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from SchoolGenius-Final root
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

// ============================================================================
// GROK MISSION 4: MULTI-LEVEL EXPLANATION SYSTEM
// ============================================================================
// Extract all details about the 6 levels of progressive help
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

console.log('🎯 MISSION 4: MULTI-LEVEL EXPLANATION SYSTEM')
console.log('='.repeat(80))
console.log('Extracting implementation details...\n')

// Key files for explanation system
const keyFiles = [
  '../../CLAUDE-LEARNING-PATTERNS.md',
  '../../CLEVER-IDEAS-MASTER-LIST.md',
  '../../AGE-GROUP-MASTER-STRATEGY.md',
  '../../CLOSED-LOOP-AUDIT-REPORT.md',
  '../../COMPREHENSIVE-GAP-ANALYSIS.md',
  '../../GROK-SMART-SEEDING-REQUEST.md',
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

const prompt = `You are analyzing SchoolGenius educational platform documentation to extract EVERY implementation detail about the MULTI-LEVEL EXPLANATION SYSTEM.

Here are the research files:

${allContent.slice(0, 50000)}

EXTRACT AND DOCUMENT:

## 1. The 6 Explanation Levels
EXACTLY what are the 6 levels? For each level:
- Level name
- Purpose
- When to use it
- How it differs from other levels
- Word count or length guidelines
- Tone differences
- Example for a specific skill

## 2. Escalation Logic
- WHEN does the system escalate from level to level?
- WHAT triggers escalation? (wrong answers? time spent? explicit request?)
- HOW MANY attempts before escalating?
- WHAT is the specific algorithm or decision tree?
- CAN a student skip levels?
- CAN a student go backwards to simpler levels?

## 3. Mistake Pattern Detection
- HOW are mistake patterns detected?
- WHAT data points are used?
- HOW does the system know WHY a student got it wrong?
- WHAT triggers targeted feedback vs generic help?
- WHERE are mistake patterns stored?
- HOW are they matched to student errors?

## 4. Triggers for Each Explanation Type
- WHAT specific triggers cause each level to be shown?
- WHEN does visual explanation get prioritized?
- WHEN does story explanation get prioritized?
- HOW does learning style affect which level is shown?

## 5. Caching for Explanations
- HOW are explanations cached?
- WHAT table stores them?
- HOW is caching keyed? (by skill? by level? by age group?)
- WHAT is the cache-first lookup process?
- HOW does on-demand generation work if cache misses?

## 6. Specific Examples
- ANY concrete examples of each level for the SAME skill?
- HOW does a math explanation differ from a reading explanation?
- HOW do age groups affect explanation complexity within levels?

## 7. Adaptive Learning Integration
- HOW does this feed into the overall adaptive learning system?
- WHAT data is collected from explanation usage?
- HOW does the system learn which explanations work best?
- HOW does it personalize explanation delivery over time?

## 8. Database Schema
- WHAT table(s) store explanations?
- WHAT fields are in the table?
- HOW are the 6 levels differentiated?
- ANY indexes for fast lookup?

## 9. Implementation Details
- Code files that implement explanation system
- API routes for fetching explanations
- Functions that handle escalation logic
- Migration files for explanation tables

## 10. Generation Workflow
- HOW are explanation libraries generated?
- WHAT prompts are used for each level?
- HOW many explanations per skill?
- WHAT is the seeding process?

Please extract EVERYTHING with specific logic, examples, and implementation details.
Format as a comprehensive implementation report.`

console.log('🤖 Calling Grok to analyze multi-level explanation system...\n')

const report = await callGrok(prompt)

// Save report to file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const filename = `mission-4-report-${timestamp}.md`
await writeFile(filename, report)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log('✅ MISSION 4 COMPLETE!')
console.log(`📄 Report saved to: ${filename}`)
