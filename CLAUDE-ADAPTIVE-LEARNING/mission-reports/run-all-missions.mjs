#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '..', '.env') })

const missions = [
  { num: 7, name: 'Progress Tracking', files: ['COMPREHENSIVE-GAP-ANALYSIS.md', 'CLEVER-IDEAS-MASTER-LIST.md'] },
  { num: 8, name: 'Theme System', files: ['CLEVER-IDEAS-MASTER-LIST.md', 'THEMED-GENERATION-PLAN.md', 'AGE-GROUP-MASTER-STRATEGY.md'] },
  { num: 9, name: 'Parent Dashboard', files: ['CLEVER-IDEAS-MASTER-LIST.md', 'COMPREHENSIVE-GAP-ANALYSIS.md'] },
  { num: 10, name: 'Content Seeding', files: ['SMART-SEEDING-STRATEGY.md', 'GROK-SMART-SEEDING-REQUEST.md', 'AGE-GROUP-MASTER-STRATEGY.md'] },
  { num: 11, name: 'Lesson Structure', files: ['CLAUDE-LEARNING-PATTERNS.md', 'COMPREHENSIVE-GAP-ANALYSIS.md'] },
  { num: 12, name: 'Document Scanning', files: ['SYLLABUS-DEPLOYMENT-GUIDE.md', 'QUICK-TEST-INSTRUCTIONS.md'] },
  { num: 13, name: 'Chat & Gigi', files: ['CLEVER-IDEAS-MASTER-LIST.md', 'AGE-GROUP-MASTER-STRATEGY.md'] },
  { num: 14, name: 'Subject Systems', files: ['CLEVER-IDEAS-MASTER-LIST.md', 'COMPREHENSIVE-GAP-ANALYSIS.md'] },
  { num: 15, name: 'Closed-Loop Economics', files: ['CLOSED-LOOP-AUDIT-REPORT.md', 'CLEVER-IDEAS-MASTER-LIST.md'] },
  { num: 16, name: 'Future Features', files: ['CLEVER-IDEAS-MASTER-LIST.md', 'COMPREHENSIVE-GAP-ANALYSIS.md'] },
  { num: 17, name: 'Database Architecture', files: ['COMPREHENSIVE-GAP-ANALYSIS.md'] },
  { num: 18, name: 'API Routes', files: ['COMPREHENSIVE-GAP-ANALYSIS.md', 'CLEVER-IDEAS-MASTER-LIST.md'] },
  { num: 19, name: 'Animations & UX', files: ['CLEVER-IDEAS-MASTER-LIST.md'] },
  { num: 20, name: 'Master Template', files: ['CLEVER-IDEAS-MASTER-LIST.md'] }
]

console.log('🚀 RUNNING MISSIONS 7-20')
console.log('='.repeat(80))

for (const mission of missions) {
  console.log(`\n🎯 MISSION ${mission.num}: ${mission.name}`)
  console.log(`📂 Files: ${mission.files.join(', ')}`)
  
  try {
    execSync(`node grok-mission-${mission.num}.mjs`, { 
      cwd: __dirname,
      stdio: 'inherit'
    })
    console.log(`✅ Mission ${mission.num} complete!`)
  } catch (err) {
    console.error(`❌ Mission ${mission.num} failed:`, err.message)
  }
  
  // 5 second delay between missions to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 5000))
}

console.log('\n🎉 ALL MISSIONS 7-20 COMPLETE!')
