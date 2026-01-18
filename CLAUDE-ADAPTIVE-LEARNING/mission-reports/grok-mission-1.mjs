#!/usr/bin/env node
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

// ============================================================================
// GROK MISSION 1: AI ADAPTIVE LEARNING SYSTEMS
// ============================================================================
// Extract EVERY implementation detail about adaptive learning
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
      temperature: 0.3, // Lower temp for factual extraction
      max_tokens: 4000
    })
  })

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

console.log('🎯 MISSION 1: AI ADAPTIVE LEARNING SYSTEMS')
console.log('='.repeat(80))
console.log('Searching through research files...\n')

// Key files to analyze for adaptive learning
const keyFiles = [
  'AGE-GROUP-MASTER-STRATEGY.md',
  'CLEVER-IDEAS-MASTER-LIST.md',
  'CLAUDE-LEARNING-PATTERNS.md',
  'COMPREHENSIVE-GAP-ANALYSIS.md',
  'CLOSED-LOOP-AUDIT-REPORT.md',
  'PRIORITY-IMPLEMENTATION-ROADMAP.md',
  'MASTER-IMPLEMENTATION-BATTLE-PLAN.md',
  'PHASE-1-IMPLEMENTATION-COMPLETE.md',
  'PHASE-2-DEPLOYED-SUCCESS.md',
  'PHASE-3-STATUS.md'
]

// Read key files
const fileContents = []
for (const file of keyFiles) {
  try {
    const content = await readFile(file, 'utf-8')
    fileContents.push(`\n\n=== FILE: ${file} ===\n${content}`)
    console.log(`✅ Read ${file}`)
  } catch (err) {
    console.log(`⚠️  Skipped ${file} (not found)`)
  }
}

const allContent = fileContents.join('\n')

// Extract adaptive learning details
const prompt = `You are analyzing SchoolGenius educational platform documentation to extract EVERY implementation detail about AI ADAPTIVE LEARNING SYSTEMS.

Here are all the research files:

${allContent.slice(0, 50000)} // First 50K chars

EXTRACT AND DOCUMENT:

## 1. Learning Style Detection
- HOW does the system detect if a student is visual, auditory, or kinesthetic?
- WHAT specific indicators trigger each learning style classification?
- ANY algorithms, thresholds, or decision trees

## 2. Difficulty Adjustment
- WHEN does the system increase or decrease difficulty?
- WHAT metrics trigger adjustments? (accuracy rate? time? attempts?)
- WHAT are the specific threshold values?
- HOW MUCH does it adjust? (skip 1 level? 2 levels?)

## 3. Frustration Detection
- WHAT specific behaviors indicate frustration?
- HOW is frustration measured?
- WHAT triggers the system to intervene?
- WHAT actions does it take when frustration is detected?

## 4. Personalization Engine
- HOW does AI personalize content for each kid?
- WHAT data points are collected?
- HOW is the profile built over time?
- WHAT changes based on personalization?

## 5. Data Tracking
- WHAT specific metrics are tracked per student?
- HOW often are they recorded?
- WHERE are they stored?
- HOW are they used for adaptation?

## 6. Cross-Subject Continuity
- HOW does learning in Math affect Reading recommendations?
- WHAT patterns transfer across subjects?
- HOW is the student's overall profile maintained?

## 7. Specific Algorithms
- ANY pseudocode mentioned?
- ANY specific formulas or calculations?
- ANY decision trees or flowcharts described?
- ANY threshold values or constants?

## 8. Implementation Details
- TABLE names mentioned?
- FUNCTION names mentioned?
- API endpoints mentioned?
- CODE snippets found?

Please extract EVERYTHING related to adaptive learning, even small details.
Format as a comprehensive implementation report with specific values, thresholds, and code references.`

console.log('🤖 Calling Grok to analyze content...\n')

const report = await callGrok(prompt)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log('✅ MISSION 1 COMPLETE!')
console.log('📄 Report generated')
