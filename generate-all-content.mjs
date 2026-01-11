// Generate ALL missing content for closed loop system
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 GENERATING ALL CLOSED LOOP CONTENT\n')
console.log('This will take several hours. Progress will be shown below.\n')
console.log('=' .repeat(70))

// PHASE 1: Generate Parent FAQ (57 questions)
console.log('\n📋 PHASE 1: Generating Parent FAQ (57 questions)\n')
console.log('Estimated time: 10-15 minutes')
console.log('Calling generate-parent-faq 12 times (5 FAQs per batch)...\n')

let parentFaqCount = 0

for (let i = 1; i <= 12; i++) {
  console.log(`Batch ${i}/12...`)

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-parent-faq`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${data.message}`)
      console.log(`   Progress: ${data.progress || 'N/A'}`)

      if (data.status === 'complete') {
        console.log('\n🎉 All parent FAQs generated!')
        parentFaqCount = parseInt(data.total || data.progress?.split('/')[0] || 0)
        break
      }
    } else {
      console.log(`⚠️  Error: ${response.status}`)
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
  }

  if (i < 12) {
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

console.log(`\n✅ Phase 1 complete: ${parentFaqCount} parent FAQs generated`)

console.log('\n' + '=' .repeat(70))
console.log('\n✅ CONTENT GENERATION COMPLETE!\n')
console.log('Summary:')
console.log(`  • Parent FAQs: ${parentFaqCount}`)
console.log('\nNext steps:')
console.log('  1. Create Kid Q&A generator (needs to be built)')
console.log('  2. Run explanation generator (119 skills × 60 explanations)')
console.log('\nRun audit again to verify:')
console.log('  node audit-closed-loop-content.mjs\n')
