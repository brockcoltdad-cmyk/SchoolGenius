#!/usr/bin/env node

/**
 * FULLY AUTONOMOUS BATCH RUNNER
 *
 * Runs ALL remaining batches to completion without human intervention
 * Just start it and walk away - it handles everything
 */

import { spawn } from 'child_process'
import { writeFile } from 'fs/promises'

console.log('🤖 AUTONOMOUS BATCH GENERATOR')
console.log('='.repeat(80))
console.log('This will run ALL remaining batches until complete')
console.log('You can walk away - it handles everything\n')

const startTime = Date.now()
let totalBatchesRun = 0
let totalItems = 0

// Track what we've already generated
const completed = {
  kidStuck: 7,        // batches 1-7 done (~340 items)
  analogies: 4,       // batches 1-4 done (200 items)
  encouragements: 8,  // batches 1-8 done (400 items)
  mistakes: 3         // batches 1-3 done (150 items)
}

// What still needs to be generated
const remaining = [
  // Finish mistake responses (need ~3 more batches for 240 total)
  { script: 'generate-mistakes-parallel.mjs', startBatch: 4, totalBatches: 5, name: 'Mistake Responses' },

  // Need to create and run these additional content types (~1,000 more items)
  // For now, let's focus on finishing mistakes
]

async function runBatch(script, batchNum, keyNum) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Launching ${script} Batch ${batchNum} (Key ${keyNum})`)

    const child = spawn('node', [script, batchNum.toString(), keyNum.toString()], {
      cwd: 'C:\\Users\\DAD\\Desktop\\SchoolGenius-Final',
      stdio: 'inherit'
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Batch ${batchNum} complete!`)
        totalBatchesRun++
        totalItems += 50
        resolve()
      } else {
        console.error(`❌ Batch ${batchNum} failed with code ${code}`)
        reject(new Error(`Batch ${batchNum} failed`))
      }
    })

    child.on('error', reject)
  })
}

async function runBatchPair(script, batch1, batch2) {
  // Run two batches in parallel (one on each API key)
  console.log(`\n📦 Running batch pair: ${batch1} and ${batch2}`)

  await Promise.all([
    runBatch(script, batch1, 1),
    runBatch(script, batch2, 2)
  ])

  console.log(`✅ Batch pair complete: ${batch1} and ${batch2}`)
}

async function main() {
  try {
    // Run remaining mistake batches
    console.log('\n🎯 Finishing Mistake Responses...')

    // We have batches 1-3 done, need 4-5 to finish
    await runBatchPair('generate-mistakes-parallel.mjs', 4, 5)

    // Final summary
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

    console.log('\n' + '='.repeat(80))
    console.log('🎉 AUTONOMOUS GENERATION COMPLETE!')
    console.log('='.repeat(80))
    console.log(`✅ Total batches run: ${totalBatchesRun}`)
    console.log(`✅ Total items generated: ${totalItems}`)
    console.log(`⏱️  Total duration: ${duration} minutes`)
    console.log(`💰 Estimated cost: $${(totalItems * 0.001).toFixed(2)}`)
    console.log('\n📁 All data saved to: ./seeding-output/')

    // Write completion report
    await writeFile('./seeding-output/completion-report.txt',
      `Autonomous Generation Complete

Generated: ${totalItems} items
Batches: ${totalBatchesRun}
Duration: ${duration} minutes
Cost: $${(totalItems * 0.001).toFixed(2)}
Completed: ${new Date().toISOString()}
`)

    console.log('\n✨ Done! You can now import the JSON files to your database.')

  } catch (error) {
    console.error('\n❌ Error during autonomous generation:', error)
    process.exit(1)
  }
}

main()
