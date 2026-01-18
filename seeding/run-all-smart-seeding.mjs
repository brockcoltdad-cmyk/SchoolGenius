import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const scripts = [
  { name: 'seed-kid-stuck-responses.mjs', items: 340, description: 'Kid "stuck" responses (85 × 4 ages)' },
  { name: 'seed-subject-analogies.mjs', items: 1100, description: 'Subject analogies (275 × 4 ages)' },
  { name: 'seed-parent-struggle-guides.mjs', items: 28, description: 'Parent struggle guides (NO age variations)' },
  { name: 'seed-transition-phrases.mjs', items: 300, description: 'Transition phrases (75 × 4 ages)' },
  { name: 'seed-achievement-celebrations.mjs', items: 168, description: 'Achievement celebrations (42 × 4 ages)' },
  { name: 'seed-time-greetings.mjs', items: 64, description: 'Time greetings (16 × 4 ages)' },
  { name: 'seed-return-messages.mjs', items: 80, description: 'Return messages (20 × 4 ages)' },
  { name: 'seed-gigi-personality.mjs', items: 200, description: 'Gigi personality (50 × 4 ages)' }
]

const totalItems = scripts.reduce((sum, script) => sum + script.items, 0)
const estimatedCost = (totalItems * 0.001).toFixed(2)
const estimatedTimeMinutes = (totalItems * 5000 / 1000 / 60).toFixed(0) // 5 seconds per item

console.log('🌱 AGE-APPROPRIATE SMART SEEDING')
console.log('='.repeat(80))
console.log('\n📊 SEEDING PLAN:\n')

for (let i = 0; i < scripts.length; i++) {
  console.log(`  ${i + 1}. ${scripts[i].description}`)
  console.log(`     Items: ${scripts[i].items}`)
}

console.log('\n' + '='.repeat(80))
console.log(`📈 TOTALS:`)
console.log(`   Total Items: ${totalItems}`)
console.log(`   Estimated Cost: $${estimatedCost}`)
console.log(`   Estimated Time: ~${estimatedTimeMinutes} minutes (~${(estimatedTimeMinutes / 60).toFixed(1)} hours)`)
console.log(`   Age Groups: K-2, 3-5, 6-8, 9-12\n`)
console.log('='.repeat(80))

// Ask for confirmation
console.log('\n⚠️  IMPORTANT:')
console.log('   - Ensure NEXT_PUBLIC_SUPABASE_URL is set')
console.log('   - Ensure SUPABASE_SERVICE_ROLE_KEY is set')
console.log('   - Ensure GROK_API_KEY is set')
console.log('   - Ensure database tables are created (run create-seeding-tables.sql)')
console.log('   - This will take several hours to complete')
console.log('   - Scripts will run sequentially')
console.log('   - Progress will be saved to database as it runs')
console.log('   - You can stop and resume anytime\n')

// Check environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GROK_API_KEY']
const missingVars = requiredEnvVars.filter(v => !process.env[v])

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`)
  console.error('\nPlease set them before running this script.\n')
  process.exit(1)
}

console.log('✅ All environment variables are set')
console.log('\n🚀 Starting in 5 seconds... (Press Ctrl+C to cancel)\n')

// Give user time to cancel
await new Promise(resolve => setTimeout(resolve, 5000))

const globalStartTime = Date.now()
let totalSuccess = 0
let totalErrors = 0
const scriptResults = []

for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i]

  console.log('\n' + '='.repeat(80))
  console.log(`🚀 SCRIPT ${i + 1}/${scripts.length}: ${script.name}`)
  console.log(`   ${script.description}`)
  console.log('='.repeat(80) + '\n')

  const scriptStartTime = Date.now()

  try {
    // Run the script
    execSync(`node "${join(__dirname, script.name)}"`, {
      stdio: 'inherit',
      env: process.env
    })

    const scriptDuration = ((Date.now() - scriptStartTime) / 1000 / 60).toFixed(1)

    scriptResults.push({
      name: script.name,
      status: 'completed',
      duration: scriptDuration,
      items: script.items
    })

    totalSuccess += script.items // Assuming all succeeded (actual counts would be in script output)

    console.log(`\n✅ ${script.name} completed in ${scriptDuration} minutes`)

  } catch (error) {
    const scriptDuration = ((Date.now() - scriptStartTime) / 1000 / 60).toFixed(1)

    scriptResults.push({
      name: script.name,
      status: 'failed',
      duration: scriptDuration,
      error: error.message
    })

    totalErrors++

    console.error(`\n❌ ${script.name} failed after ${scriptDuration} minutes`)
    console.error(`   Error: ${error.message}`)
    console.error('\n   Continuing with next script...')
  }

  // Show progress
  const globalElapsed = ((Date.now() - globalStartTime) / 1000 / 60).toFixed(1)
  const scriptsRemaining = scripts.length - (i + 1)
  const avgTimePerScript = (Date.now() - globalStartTime) / (i + 1)
  const estimatedRemaining = ((scriptsRemaining * avgTimePerScript) / 1000 / 60).toFixed(1)

  console.log('\n📊 OVERALL PROGRESS:')
  console.log(`   Scripts: ${i + 1}/${scripts.length} completed`)
  console.log(`   Time elapsed: ${globalElapsed} minutes`)
  console.log(`   Estimated remaining: ~${estimatedRemaining} minutes\n`)
}

const totalDuration = ((Date.now() - globalStartTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 AGE-APPROPRIATE SMART SEEDING COMPLETE!')
console.log('='.repeat(80))

console.log('\n📊 FINAL RESULTS:\n')

for (const result of scriptResults) {
  const status = result.status === 'completed' ? '✅' : '❌'
  console.log(`  ${status} ${result.name}`)
  console.log(`     Duration: ${result.duration} minutes`)
  if (result.status === 'failed') {
    console.log(`     Error: ${result.error}`)
  }
}

console.log('\n' + '='.repeat(80))
console.log(`⏱️  Total Duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(2)} hours)`)
console.log(`📈 Expected Items: ${totalItems}`)
console.log(`💰 Estimated Cost: $${estimatedCost}`)
console.log(`✅ Completed Scripts: ${scriptResults.filter(r => r.status === 'completed').length}/${scripts.length}`)
console.log(`❌ Failed Scripts: ${scriptResults.filter(r => r.status === 'failed').length}`)
console.log('\n✨ SchoolGenius is now seeded with age-appropriate content!')
console.log('   - K-2 (Ages 5-8): Super simple, excited 🎉⭐')
console.log('   - 3-5 (Ages 8-11): Friendly, encouraging 🎯💡')
console.log('   - 6-8 (Ages 11-14): Mature, respectful 💪✓')
console.log('   - 9-12 (Ages 14-18): Professional, academic ✓📊')
console.log('\n🎓 Every piece of content is now tailored to the right age group!\n')
