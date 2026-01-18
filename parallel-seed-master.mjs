#!/usr/bin/env node
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ============================================================================
// PARALLEL SEEDING MASTER CONTROLLER
// ============================================================================
// Launches 2 Grok workers simultaneously to generate all 2,280 items
// ============================================================================

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 PARALLEL GROK SEEDING SYSTEM')
console.log('='.repeat(80))
console.log('Launching 2 Grok workers simultaneously...')
console.log('Worker A: 1,432 items (~2 hours)')
console.log('Worker B: 2,328 items (~3.2 hours)')
console.log('Both using same API key with 5-second delays')
console.log('Est. completion: ~3.2 hours (wall clock time)')
console.log('='.repeat(80))
console.log('')

const startTime = Date.now()

// Track progress from both workers
const progress = {
  workerA: { completed: 0, total: 1432, status: 'Starting...', errors: 0 },
  workerB: { completed: 0, total: 2328, status: 'Starting...', errors: 0 }
}

// Launch Worker A (Grok Key 1)
console.log('🔵 Launching Worker A (Grok Key 1)...')
const workerA = new Worker(join(__dirname, 'workers', 'grok-worker-a.mjs'), {
  workerData: {
    workerId: 'A',
    apiKeyEnv: 'XAI_API_KEY'
  }
})

// Launch Worker B (Using same Grok Key 1 - Key 2 was invalid)
console.log('🟢 Launching Worker B (Grok Key 1)...')
const workerB = new Worker(join(__dirname, 'workers', 'grok-worker-b.mjs'), {
  workerData: {
    workerId: 'B',
    apiKeyEnv: 'XAI_API_KEY'
  }
})

// Handle Worker A messages
workerA.on('message', (msg) => {
  if (msg.type === 'progress') {
    progress.workerA.completed = msg.completed
    progress.workerA.status = msg.status
    updateDisplay()
  } else if (msg.type === 'error') {
    progress.workerA.errors++
    console.error(`❌ [Worker A] Error: ${msg.error}`)
  } else if (msg.type === 'log') {
    console.log(`🔵 [Worker A] ${msg.message}`)
  }
})

// Handle Worker B messages
workerB.on('message', (msg) => {
  if (msg.type === 'progress') {
    progress.workerB.completed = msg.completed
    progress.workerB.status = msg.status
    updateDisplay()
  } else if (msg.type === 'error') {
    progress.workerB.errors++
    console.error(`❌ [Worker B] Error: ${msg.error}`)
  } else if (msg.type === 'log') {
    console.log(`🟢 [Worker B] ${msg.message}`)
  }
})

// Handle Worker A completion
workerA.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✅ Worker A COMPLETE!')
    console.log(`   Generated: ${progress.workerA.completed}/${progress.workerA.total} items`)
    console.log(`   Errors: ${progress.workerA.errors}`)
  } else {
    console.error(`\n❌ Worker A exited with code ${code}`)
  }
  checkCompletion()
})

// Handle Worker B completion
workerB.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✅ Worker B COMPLETE!')
    console.log(`   Generated: ${progress.workerB.completed}/${progress.workerB.total} items`)
    console.log(`   Errors: ${progress.workerB.errors}`)
  } else {
    console.error(`\n❌ Worker B exited with code ${code}`)
  }
  checkCompletion()
})

// Handle Worker errors
workerA.on('error', (err) => {
  console.error('❌ Worker A fatal error:', err)
  process.exit(1)
})

workerB.on('error', (err) => {
  console.error('❌ Worker B fatal error:', err)
  process.exit(1)
})

// Update progress display
let lastUpdate = 0
function updateDisplay() {
  const now = Date.now()
  if (now - lastUpdate < 5000) return // Update every 5 seconds
  lastUpdate = now

  const totalCompleted = progress.workerA.completed + progress.workerB.completed
  const totalItems = progress.workerA.total + progress.workerB.total
  const percentComplete = ((totalCompleted / totalItems) * 100).toFixed(1)
  const elapsed = Math.floor((now - startTime) / 1000 / 60)

  console.log('')
  console.log('='.repeat(80))
  console.log(`📊 PROGRESS UPDATE (${elapsed} minutes elapsed)`)
  console.log('='.repeat(80))
  console.log(`🔵 Worker A: ${progress.workerA.completed}/${progress.workerA.total} (${((progress.workerA.completed/progress.workerA.total)*100).toFixed(1)}%)`)
  console.log(`   Status: ${progress.workerA.status}`)
  console.log(`   Errors: ${progress.workerA.errors}`)
  console.log('')
  console.log(`🟢 Worker B: ${progress.workerB.completed}/${progress.workerB.total} (${((progress.workerB.completed/progress.workerB.total)*100).toFixed(1)}%)`)
  console.log(`   Status: ${progress.workerB.status}`)
  console.log(`   Errors: ${progress.workerB.errors}`)
  console.log('')
  console.log(`📈 TOTAL: ${totalCompleted}/${totalItems} (${percentComplete}%)`)
  console.log('='.repeat(80))
  console.log('')
}

// Check if both workers are complete
let workersCompleted = 0
function checkCompletion() {
  workersCompleted++
  if (workersCompleted === 2) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60)
    const totalCompleted = progress.workerA.completed + progress.workerB.completed
    const totalErrors = progress.workerA.errors + progress.workerB.errors

    console.log('\n')
    console.log('🎉'.repeat(40))
    console.log('🎉 PARALLEL SEEDING COMPLETE! 🎉')
    console.log('🎉'.repeat(40))
    console.log('')
    console.log(`✅ Total Items Generated: ${totalCompleted}/3,760`)
    console.log(`⏱️  Total Time: ${elapsed} minutes (${(elapsed/60).toFixed(1)} hours)`)
    console.log(`❌ Total Errors: ${totalErrors}`)
    console.log('')
    console.log('Both Groks worked non-stop to completion!')
    console.log('')
    console.log('Next: Run Grok Deep Dive Missions')
    console.log('Command: node grok-missions-parallel.mjs')
    console.log('')

    process.exit(0)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Shutting down workers...')
  workerA.terminate()
  workerB.terminate()
  process.exit(0)
})

// Periodic progress updates every 5 minutes
setInterval(() => {
  updateDisplay()
}, 5 * 60 * 1000)

console.log('✅ Both workers launched successfully!')
console.log('Progress updates every 5 seconds...')
console.log('')
