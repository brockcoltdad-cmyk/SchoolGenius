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
// GROK MISSION 3: CONTENT GENERATION & CACHING
// ============================================================================
// Extract all details about content generation, caching, and closed-loop
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

console.log('🎯 MISSION 3: CONTENT GENERATION & CACHING')
console.log('='.repeat(80))
console.log('Extracting implementation details...\n')

// Key files for content generation
const keyFiles = [
  '../../CLOSED-LOOP-AUDIT-REPORT.md',
  '../../PROMPT-LIBRARY-STRATEGY.md',
  '../../SMART-SEEDING-STRATEGY.md',
  '../../GROK-SMART-SEEDING-REQUEST.md',
  '../../GROK-SEEDING-REQUEST.md',
  '../../CONTENT-GENERATION-INSTRUCTIONS.md',
  '../../CLEVER-IDEAS-MASTER-LIST.md',
  '../../CLAUDE-LEARNING-PATTERNS.md',
  '../../AGE-GROUP-MASTER-STRATEGY.md'
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

const prompt = `You are analyzing SchoolGenius educational platform documentation to extract EVERY implementation detail about CONTENT GENERATION & CACHING SYSTEMS.

Here are the research files:

${allContent.slice(0, 50000)}

EXTRACT AND DOCUMENT:

## 1. Pre-Generated vs On-Demand Content
- WHAT content should be pre-generated (seeded)?
- WHAT content should be generated on-demand?
- WHY the distinction? What criteria determine this?
- HOW MANY pieces of each content type should be seeded?
- WHAT are the exact counts? (Q&A: 140 items, etc.)

## 2. Content Types & Quantities
For each content type, extract:
- Name of the content type
- Number of items to generate
- Why this quantity?
- Database table name
- Pre-generated or on-demand?

## 3. Closed-Loop System
- EXACTLY how does the closed-loop cache work?
- WHAT is the flow? (Request → Check cache → Generate if missing → Save)
- WHERE is content cached? (which tables?)
- HOW does "generate once, use forever" work?
- WHAT are the cost savings? (specific dollar amounts)
- WHAT is the comparison to traditional approach?

## 4. Grok vs Claude Usage
- WHEN to use Grok?
- WHEN to use Claude?
- WHY the distinction?
- WHAT are the pricing differences?
- WHAT use cases for each?

## 5. Prompt Templates
- WHAT prompt templates exist?
- WHERE are they documented?
- HOW are they structured?
- ANY examples of specific prompts?

## 6. Cost Analysis
- WHAT is the cost per item for Grok? ($0.001?)
- WHAT is the cost for Claude?
- WHAT are the total seeding costs?
- WHAT are the savings compared to alternatives?
- ANY cost breakdowns by content type?

## 7. Seeding Workflows
- WHAT is the step-by-step process for seeding?
- HOW are items generated? (sequentially? in parallel?)
- WHAT rate limiting is needed? (delays between calls?)
- HOW long does seeding take?
- WHAT scripts exist for seeding?

## 8. Database Tables for Caching
List every caching/content table:
- Table name
- What it stores
- Key fields
- How it's used in closed-loop

## 9. Generation Algorithms
- ANY pseudocode for content generation?
- ANY specific generation patterns?
- HOW does age-appropriate generation work?
- HOW does theme-based generation work?

## 10. Implementation Details
- Code file paths for generation
- Seeding script names
- API routes for generation
- Database migrations related to content
- Environment variables needed

Please extract EVERYTHING with specific numbers, costs, table names, and implementation details.
Format as a comprehensive implementation report.`

console.log('🤖 Calling Grok to analyze content generation system...\n')

const report = await callGrok(prompt)

// Save report to file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const filename = `mission-3-report-${timestamp}.md`
await writeFile(filename, report)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log('✅ MISSION 3 COMPLETE!')
console.log(`📄 Report saved to: ${filename}`)
