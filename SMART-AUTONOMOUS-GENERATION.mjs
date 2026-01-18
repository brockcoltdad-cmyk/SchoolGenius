#!/usr/bin/env node

/**
 * SMART AUTONOMOUS GENERATION
 *
 * Generates remaining content by expanding ALL content types proportionally
 * Runs completely autonomously - just start and walk away
 */

import { spawn } from 'child_process'
import { writeFile, readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'

console.log('🧠 SMART AUTONOMOUS GENERATION SYSTEM')
console.log('='.repeat(80))

const startTime = Date.now()
let totalBatchesRun = 0
let totalItemsGenerated = 0

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
      else if (file.includes('analogies')) analogies += count
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

async function runBatch(script, batchNum, keyNum) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [script, batchNum.toString(), keyNum.toString()], {
      cwd: process.cwd(),
      stdio: 'pipe'
    })

    let output = ''
    child.stdout.on('data', (data) => {
      output += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        // Count items in this batch
        const successMatch = output.match(/Success: (\d+)/)
        const itemCount = successMatch ? parseInt(successMatch[1]) : 0
        totalItemsGenerated += itemCount
        totalBatchesRun++
        console.log(`   ✅ Batch ${batchNum} complete (${itemCount} items)`)
        resolve()
      } else {
        console.error(`   ❌ Batch ${batchNum} failed`)
        reject(new Error(`Batch ${batchNum} failed`))
      }
    })

    child.on('error', reject)
  })
}

async function runBatchPair(script, batch1, batch2, name) {
  console.log(`\n📦 ${name}: Batches ${batch1} & ${batch2}`)
  await Promise.all([
    runBatch(script, batch1, 1),
    runBatch(script, batch2, 2)
  ])
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
    console.log(`Strategy: Expand all content types proportionally\n`)

    if (remaining <= 0) {
      console.log('✅ All 2,280 items already generated!')
      return
    }

    // Generate more of each type proportionally
    // Kid stuck: Generate 6 more batches (300 items)
    // Analogies: Generate 4 more batches (200 items)
    // Encouragements: Generate 6 more batches (300 items)
    // Mistakes: Generate 7 more batches (350 items)
    // Total: 23 batches = 1,150 items

    console.log('🚀 Starting generation...')
    console.log('='.repeat(80))

    // Kid stuck responses (batches 8-13)
    console.log('\n🎯 Phase 1: Kid Stuck Responses')
    await runBatchPair('generate-kid-stuck-parallel.mjs', 8, 9, 'Kid Stuck')
    await runBatchPair('generate-kid-stuck-parallel.mjs', 10, 11, 'Kid Stuck')
    await runBatchPair('generate-kid-stuck-parallel.mjs', 12, 13, 'Kid Stuck')

    // Analogies (batches 5-8)
    console.log('\n🎯 Phase 2: Subject Analogies')
    await runBatchPair('generate-analogies-parallel.mjs', 5, 6, 'Analogies')
    await runBatchPair('generate-analogies-parallel.mjs', 7, 8, 'Analogies')

    // Encouragements (batches 9-14)
    console.log('\n🎯 Phase 3: Encouragement Messages')
    await runBatchPair('generate-encouragements-parallel.mjs', 9, 10, 'Encouragements')
    await runBatchPair('generate-encouragements-parallel.mjs', 11, 12, 'Encouragements')
    await runBatchPair('generate-encouragements-parallel.mjs', 13, 14, 'Encouragements')

    // Mistakes (batches 4-10) - fill remaining
    console.log('\n🎯 Phase 4: Mistake Responses')
    await runBatchPair('generate-mistakes-parallel.mjs', 4, 5, 'Mistakes')
    await runBatchPair('generate-mistakes-parallel.mjs', 6, 7, 'Mistakes')
    await runBatchPair('generate-mistakes-parallel.mjs', 8, 9, 'Mistakes')
    await runBatchPair('generate-mistakes-parallel.mjs', 10, 11, 'Mistakes')

    // Final summary
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    const finalCount = existing.total + totalItemsGenerated

    console.log('\n' + '='.repeat(80))
    console.log('🎉 SMART GENERATION COMPLETE!')
    console.log('='.repeat(80))
    console.log(`✅ Started with: ${existing.total} items`)
    console.log(`✅ Generated: ${totalItemsGenerated} new items`)
    console.log(`✅ Total now: ${finalCount} / 2,280 items`)
    console.log(`✅ Batches run: ${totalBatchesRun}`)
    console.log(`⏱️  Duration: ${duration} minutes`)
    console.log(`💰 Cost: $${(totalItemsGenerated * 0.001).toFixed(2)}`)
    console.log('\n📁 All data saved to: ./seeding-output/')

    await writeFile('./seeding-output/GENERATION-REPORT.txt',
      `Smart Generation Complete

Started with: ${existing.total} items
Generated: ${totalItemsGenerated} new items
Final total: ${finalCount} items
Target: 2,280 items
Progress: ${((finalCount / 2280) * 100).toFixed(1)}%
Batches: ${totalBatchesRun}
Duration: ${duration} minutes
Cost: $${(totalItemsGenerated * 0.001).toFixed(2)}
Completed: ${new Date().toISOString()}
`)

    console.log('\n✨ Done! All content generated and ready to import.')

  } catch (error) {
    console.error('\n❌ Error during generation:', error)
    process.exit(1)
  }
}

main()
