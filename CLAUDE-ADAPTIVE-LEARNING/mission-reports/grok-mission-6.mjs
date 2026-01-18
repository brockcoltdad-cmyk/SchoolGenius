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
    console.error(`\n❌ Grok API Error ${response.status}:`, errorBody)
    throw new Error(`Grok API error: ${response.status}`)
  }
  return (await response.json()).choices[0].message.content
}

console.log('🎯 MISSION 6: GAMIFICATION SYSTEMS')
console.log('='.repeat(80))

const keyFiles = ['../../CLEVER-IDEAS-MASTER-LIST.md', '../../CLAUDE-LEARNING-PATTERNS.md', '../../COMPREHENSIVE-GAP-ANALYSIS.md']
const fileContents = []
for (const file of keyFiles) {
  try {
    const content = await readFile(file, 'utf-8')
    fileContents.push(`\n=== FILE: ${file.split('/').pop()} ===\n${content}`)
    console.log(`✅ ${file.split('/').pop()}`)
  } catch { console.log(`⚠️  Skipped ${file.split('/').pop()}`) }
}

const prompt = `Analyze SchoolGenius gamification system. Extract:

${fileContents.join('\n').slice(0, 50000)}

EXTRACT:
1. Coins/XP Earning - HOW earned? Specific amounts per action?
2. Streak System - WHAT triggers? HOW calculated? Break conditions?
3. Leveling - HOW does it work? XP thresholds per level? Formulas?
4. Achievements - WHAT achievements exist? Unlock conditions?
5. Leaderboards - HOW rankings calculated? What metrics?
6. Rewards - WHEN given? Prize redemption process?
7. Currency Formulas - ANY specific calculations?
8. Implementation - Tables, functions, code references?

Format as comprehensive implementation report with specific values, formulas, and code.`

console.log('🤖 Calling Grok...\n')
const report = await callGrok(prompt)
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const filename = `mission-6-report-${timestamp}.md`
await writeFile(filename, report)

console.log(report)
console.log('\n' + '='.repeat(80))
console.log(`✅ MISSION 6 COMPLETE! Saved: ${filename}`)
