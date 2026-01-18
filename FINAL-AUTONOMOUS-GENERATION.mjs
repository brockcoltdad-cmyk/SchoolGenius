#!/usr/bin/env node

/**
 * FINAL AUTONOMOUS GENERATION
 *
 * Generates remaining content intelligently:
 * - Counts what we have
 * - Generates more until we hit 2,280 or run out of combinations
 * - Handles errors gracefully
 * - Runs completely autonomously
 */

import { spawn } from 'child_process'
import { writeFile, readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'

console.log('🎯 FINAL AUTONOMOUS GENERATION')
console.log('='.repeat(80))

const startTime = Date.now()
let totalBatchesRun = 0
let totalItemsGenerated = 0
let failedBatches = []

// Count existing items
async function countExistingItems() {
  if (!existsSync('./seeding-output')) {
    return { total: 0, breakdown: {} }
  }

  const files = await readdir('./seeding-output')
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('conversation-patterns'))

  let kidStuck = 0, analogies = 0, encouragements = 0, mistakes = 0

  for (const file of jsonFiles) {
    try {
      const content = await readFile(`./seeding-output/${file}`, 'utf-8')
      const data = JSON.parse(content)
      const count = Array.isArray(data) ? data.length : 0

      if (file.includes('kid-stuck')) kidStuck += count
      else if (file.includes('subject-analogies')) analogies += count
      else if (file.includes('encouragements')) encouragements += count
      else if (file.includes('mistake')) mistakes += count
    } catch (e) {
      // Skip empty/invalid files
    }
  }

  return {
    total: kidStuck + analogies + encouragements + mistakes,
    breakdown: { kidStuck, analogies, encouragements, mistakes }
  }
}

async function runBatch(script, batchNum, keyNum, contentType) {
  return new Promise((resolve) => {
    const child = spawn('node', [script, batchNum.toString(), keyNum.toString()], {
      cwd: process.cwd(),
      stdio: 'pipe'
    })

    let output = ''
    let hadError = false

    child.stdout.on('data', (data) => { output += data.toString() })
    child.stderr.on('data', (data) => {
      output += data.toString()
      hadError = true
    })

    child.on('close', (code) => {
      if (code === 0 && !hadError) {
        const successMatch = output.match(/Success: (\d+)/)
        const itemCount = successMatch ? parseInt(successMatch[1]) : 0

        if (itemCount > 0) {
          totalItemsGenerated += itemCount
          totalBatchesRun++
          console.log(`   ✅ Batch ${batchNum} complete (${itemCount} items)`)
          resolve({ success: true, items: itemCount })
        } else {
          console.log(`   ⚠️  Batch ${batchNum} generated 0 items (may be out of combinations)`)
          failedBatches.push({ contentType, batch: batchNum })
          resolve({ success: false, items: 0 })
        }
      } else {
        console.log(`   ⚠️  Batch ${batchNum} failed (may be out of combinations)`)
        failedBatches.push({ contentType, batch: batchNum })
        resolve({ success: false, items: 0 })
      }
    })
  })
}

async function runBatchPair(script, batch1, batch2, name) {
  console.log(`\n📦 ${name}: Batches ${batch1} & ${batch2}`)
  const results = await Promise.all([
    runBatch(script, batch1, 1, name),
    runBatch(script, batch2, 2, name)
  ])

  // Return true if at least one batch succeeded
  return results.some(r => r.success)
}

async function main() {
  try {
    console.log('\n📊 Counting existing items...')
    const existing = await countExistingItems()

    console.log(`\nCurrent status:`)
    console.log(`  Total: ${existing.total} / 2,280`)
    console.log(`  Kid stuck: ${existing.breakdown.kidStuck}`)
    console.log(`  Analogies: ${existing.breakdown.analogies}`)
    console.log(`  Encouragements: ${existing.breakdown.encouragements}`)
    console.log(`  Mistakes: ${existing.breakdown.mistakes}`)

    const remaining = 2280 - existing.total
    console.log(`\nNeed: ${remaining} more items`)

    if (remaining <= 0) {
      console.log('✅ All 2,280 items already generated!')
      return
    }

    console.log('\n🚀 Starting generation...')
    console.log('Strategy: Generate from all types until we hit 2,280 or run out')
    console.log('='.repeat(80))

    let currentTotal = existing.total
    let keepGoing = true

    // Keep generating until we hit target or all types are exhausted
    while (keepGoing && currentTotal < 2280) {
      let hadSuccess = false

      // Try kid stuck (we have batches 1, 3-7, try 8+)
      if (currentTotal < 2280) {
        const nextBatch = Math.floor(existing.breakdown.kidStuck / 50) + 1
        console.log(`\n🎯 Kid Stuck Responses (Batch ${nextBatch})`)
        const success = await runBatchPair('generate-batch-parallel.mjs', nextBatch, nextBatch + 1, 'Kid Stuck')
        if (success) {
          hadSuccess = true
          currentTotal = (await countExistingItems()).total
          console.log(`   Progress: ${currentTotal} / 2,280`)
        }
      }

      // Try analogies (we have batches 1-4, try 5+)
      if (currentTotal < 2280) {
        const nextBatch = Math.floor(existing.breakdown.analogies / 50) + 1
        console.log(`\n🎯 Subject Analogies (Batch ${nextBatch})`)
        const success = await runBatchPair('generate-analogies-parallel.mjs', nextBatch, nextBatch + 1, 'Analogies')
        if (success) {
          hadSuccess = true
          currentTotal = (await countExistingItems()).total
          console.log(`   Progress: ${currentTotal} / 2,280`)
        }
      }

      // Try encouragements (we have batches 1-8, try 9+)
      if (currentTotal < 2280) {
        const nextBatch = Math.floor(existing.breakdown.encouragements / 50) + 1
        console.log(`\n🎯 Encouragement Messages (Batch ${nextBatch})`)
        const success = await runBatchPair('generate-encouragements-parallel.mjs', nextBatch, nextBatch + 1, 'Encouragements')
        if (success) {
          hadSuccess = true
          currentTotal = (await countExistingItems()).total
          console.log(`   Progress: ${currentTotal} / 2,280`)
        }
      }

      // Try mistakes (we have batches 1-5, try 6+)
      if (currentTotal < 2280) {
        const nextBatch = Math.floor(existing.breakdown.mistakes / 50) + 1
        console.log(`\n🎯 Mistake Responses (Batch ${nextBatch})`)
        const success = await runBatchPair('generate-mistakes-parallel.mjs', nextBatch, nextBatch + 1, 'Mistakes')
        if (success) {
          hadSuccess = true
          currentTotal = (await countExistingItems()).total
          console.log(`   Progress: ${currentTotal} / 2,280`)
        }
      }

      // If nothing succeeded this round, we're out of content
      if (!hadSuccess) {
        console.log('\n⚠️  All content types exhausted')
        keepGoing = false
      }

      // Update counts for next iteration
      existing.breakdown = (await countExistingItems()).breakdown
    }

    // Final summary
    const final = await countExistingItems()
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

    console.log('\n' + '='.repeat(80))
    console.log('🎉 GENERATION COMPLETE!')
    console.log('='.repeat(80))
    console.log(`✅ Started with: ${existing.total} items`)
    console.log(`✅ Generated: ${totalItemsGenerated} new items`)
    console.log(`✅ Total now: ${final.total} items`)
    console.log(`✅ Target: 2,280 items`)
    console.log(`✅ Progress: ${((final.total / 2280) * 100).toFixed(1)}%`)
    console.log(`✅ Batches run: ${totalBatchesRun}`)
    console.log(`⏱️  Duration: ${duration} minutes`)
    console.log(`💰 Cost: $${(totalItemsGenerated * 0.001).toFixed(2)}`)

    if (final.total < 2280) {
      console.log(`\n⚠️  Stopped at ${final.total} items - content types exhausted`)
      console.log('📝 To reach 2,280, you need to:')
      console.log('   1. Add more variations to existing generators')
      console.log('   2. OR create new content type generators')
    }

    console.log('\n📁 All data saved to: ./seeding-output/')

    await writeFile('./seeding-output/GENERATION-FINAL-REPORT.txt',
      `Final Generation Complete

Started: ${existing.total} items
Generated: ${totalItemsGenerated} new items
Final: ${final.total} items
Target: 2,280 items
Progress: ${((final.total / 2280) * 100).toFixed(1)}%

Breakdown:
  Kid stuck: ${final.breakdown.kidStuck}
  Analogies: ${final.breakdown.analogies}
  Encouragements: ${final.breakdown.encouragements}
  Mistakes: ${final.breakdown.mistakes}

Batches run: ${totalBatchesRun}
Duration: ${duration} minutes
Cost: $${(totalItemsGenerated * 0.001).toFixed(2)}
Completed: ${new Date().toISOString()}
`)

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
