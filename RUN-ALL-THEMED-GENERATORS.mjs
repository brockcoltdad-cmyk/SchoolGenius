#!/usr/bin/env node

/**
 * MASTER THEMED GENERATOR ORCHESTRATOR
 *
 * Runs all 8 themed generators sequentially
 * Generates complete 2,280+ item dataset for SchoolGenius
 *
 * Usage: node RUN-ALL-THEMED-GENERATORS.mjs
 */

import { spawn } from 'child_process'
import { writeFile } from 'fs/promises'

console.log('🎯 MASTER THEMED GENERATOR')
console.log('='.repeat(80))
console.log('This will generate ALL themed content for SchoolGenius')
console.log('You can walk away - runs completely autonomously\n')

const startTime = Date.now()
let totalItemsGenerated = 0
let totalCost = 0

const GENERATORS = [
  { script: 'generate-kid-stuck-themed.mjs', name: 'Kid Stuck Responses', estimate: '1000 items, ~83 min' },
  { script: 'generate-achievement-celebrations-themed.mjs', name: 'Achievement Celebrations', estimate: '144 items, ~12 min' },
  { script: 'generate-greeting-messages-themed.mjs', name: 'Greeting Messages', estimate: '64 items, ~5 min' },
  { script: 'generate-return-messages-themed.mjs', name: 'Return Messages', estimate: '100 items, ~8 min' },
  { script: 'generate-transition-phrases-themed.mjs', name: 'Transition Phrases', estimate: '240 items, ~20 min' },
  { script: 'generate-gigi-personality-themed.mjs', name: 'Gigi Personality', estimate: '200 items, ~17 min' },
  { script: 'generate-subject-analogies-themed.mjs', name: 'Subject Analogies', estimate: '160 items, ~13 min' },
  { script: 'generate-parent-struggle-guides.mjs', name: 'Parent Struggle Guides', estimate: '15 items, ~1 min' }
]

console.log('📋 Generation Plan:')
GENERATORS.forEach((gen, i) => {
  console.log(`${i + 1}. ${gen.name} - ${gen.estimate}`)
})
console.log(`\nTotal estimated time: ~160 minutes (~2.7 hours)`)
console.log(`Total estimated cost: ~$1.90`)
console.log('='.repeat(80))

async function runGenerator(script, name) {
  return new Promise((resolve, reject) => {
    console.log(`\n\n${'='.repeat(80)}`)
    console.log(`🚀 STARTING: ${name}`)
    console.log('='.repeat(80))

    const child = spawn('node', [script], {
      cwd: process.cwd(),
      stdio: 'inherit'
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${name} COMPLETE!`)
        resolve()
      } else {
        console.error(`\n❌ ${name} FAILED`)
        reject(new Error(`${name} failed`))
      }
    })

    child.on('error', reject)
  })
}

async function main() {
  try {
    for (let i = 0; i < GENERATORS.length; i++) {
      const gen = GENERATORS[i]
      console.log(`\n\n📊 PROGRESS: ${i + 1}/${GENERATORS.length}`)
      await runGenerator(gen.script, gen.name)
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

    console.log('\n\n' + '='.repeat(80))
    console.log('🎉 ALL THEMED GENERATION COMPLETE!')
    console.log('='.repeat(80))
    console.log(`✅ All 8 generators completed successfully`)
    console.log(`⏱️  Total duration: ${duration} minutes`)
    console.log(`📁 All data saved to: ./themed-output/`)
    console.log('\n✨ Next Steps:')
    console.log('1. Review generated content in ./themed-output/')
    console.log('2. Run database import script')
    console.log('3. Test on SchoolGenius website')

    await writeFile('./themed-output/GENERATION-COMPLETE.txt',
      `Themed Generation Complete

Total Generators Run: ${GENERATORS.length}
Duration: ${duration} minutes
Completed: ${new Date().toISOString()}

Files Generated:
- kid-stuck-responses-themed.json
- achievement-celebrations-themed.json
- greeting-messages-themed.json
- return-messages-themed.json
- transition-phrases-themed.json
- gigi-personality-themed.json
- subject-analogies-themed.json
- parent-struggle-guides.json

Ready to import to Supabase!
`)

  } catch (error) {
    console.error('\n❌ ERROR:', error)
    process.exit(1)
  }
}

main()
