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
// GROK MISSION 5: AGE GROUP DIFFERENTIATION
// ============================================================================
// Extract all details about age-appropriate content across 4 age groups
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

console.log('🎯 MISSION 5: AGE GROUP DIFFERENTIATION')
console.log('='.repeat(80))
console.log('Extracting implementation details...\n')

// Key files for age group differentiation
const keyFiles = [
  '../../AGE-GROUP-MASTER-STRATEGY.md',
  '../../CLAUDE-LEARNING-PATTERNS.md',
  '../../CLEVER-IDEAS-MASTER-LIST.md',
  '../../GROK-SMART-SEEDING-REQUEST.md',
  '../../THEMED-GENERATION-PLAN.md'
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

const prompt = `You are analyzing SchoolGenius educational platform documentation to extract EVERY implementation detail about AGE GROUP DIFFERENTIATION.

Here are the research files:

${allContent.slice(0, 50000)}

EXTRACT AND DOCUMENT:

## 1. The 4 Age Groups
For each age group (K-2, 3-5, 6-8, 9-12), extract:
- Age range
- Grade levels
- Core characteristics
- Communication tone
- Language complexity
- Emoji usage rules
- Example phrases

## 2. Tone Definitions
EXACT tone requirements for each age group:
- How formal/casual?
- Energy level?
- Vocabulary expectations?
- Sentence structure?
- Specific words to use/avoid?

## 3. Content Adaptation by Age
- HOW does content change across age groups?
- WHAT elements adapt? (tone, complexity, length, visuals?)
- WHAT stays the same across ages?
- WHAT specific guidelines exist?

## 4. Age-Gated Features
- WHAT features are restricted by age?
- WHEN should Gigi character show/hide?
- WHAT UI differences per age group?
- HOW does "streamlined view" for high school work?

## 5. Visual Design Differences
- Colors per age group
- Animation intensity
- Whitespace usage
- Font choices
- Icon styles
- Particle effects

## 6. Currency & Gamification Naming
- What is currency called for each age?
- How do stat labels change?
- How does celebration energy differ?

## 7. Gigi Presence by Age
- How prominent is Gigi for each age?
- When does Gigi speak?
- How does Gigi's tone change?
- Can students hide Gigi?

## 8. Content Generation Rules
The "Pre-Implementation Checklist":
- WHAT must be checked before ANY content creation?
- HOW to ensure age-appropriateness?
- WHAT are common mistakes to avoid?

## 9. Seeding Implications
- WHAT is the multiplier effect? (591 items × 4 = ?)
- WHICH content needs 4 age versions?
- WHICH content is age-neutral?
- WHAT is the total item count?

## 10. Implementation Details
- getAgeGroup() function code
- How age is determined from grade level
- Where age group is stored
- How age-appropriate content is selected
- Code examples for age detection

## 11. Specific Examples
For the SAME scenario across all 4 ages:
- "I don't get it" response
- Correct answer celebration
- Wrong answer encouragement
- Subject analogy (e.g., fractions)

## 12. Common Mistakes to Avoid
EXACTLY what NOT to do:
- Talking to kids like adults
- Using same message for all ages
- Wrong emoji usage
- Tone mismatches

Please extract EVERYTHING with specific examples, code, and implementation rules.
Format as a comprehensive implementation report.`

console.log('🤖 Calling Grok to analyze age group differentiation...\n')

const report = await callGrok(prompt)

// Save report to file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const filename = `mission-5-report-${timestamp}.md`
await writeFile(filename, report)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log('✅ MISSION 5 COMPLETE!')
console.log(`📄 Report saved to: ${filename}`)
console.log('\n🎉 ALL 5 MISSIONS COMPLETE! Ready for next phase.')
