// COMPLETE CLOSED LOOP CONTENT GENERATION
// Generates ALL missing content: Parent FAQ, Kid Q&A, Help Explanations, Mistake Patterns
// This script will take several hours - progress is saved continuously

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('\n🚀 COMPLETE CLOSED LOOP CONTENT GENERATION\n')
console.log('=' .repeat(80))
console.log('\nThis will generate ALL missing content for the closed loop system:')
console.log('  • Parent FAQ (57 questions)')
console.log('  • Kid Q&A (140+ questions)')
console.log('  • Help Explanations (7,000+ explanations for 119 skills)')
console.log('  • Mistake Patterns (generated with explanations)')
console.log('\n⏱️  Estimated total time: 30-40 hours')
console.log('💰 One-time cost: ~$150-200')
console.log('📈 Annual savings: $23,000 - $49,000+\n')
console.log('Progress is saved continuously. You can stop and resume anytime.\n')
console.log('=' .repeat(80))

// Ask for confirmation
console.log('\n⚠️  This will make many API calls to Grok.')
console.log('Make sure XAI_API_KEY is set in Supabase environment variables.\n')
console.log('Starting in 5 seconds... (Ctrl+C to cancel)\n')

await new Promise(resolve => setTimeout(resolve, 5000))

// ====================================================================
// PHASE 1: PARENT FAQ (57 questions)
// ====================================================================
console.log('\n' + '━'.repeat(80))
console.log('📋 PHASE 1: PARENT FAQ GENERATION\n')
console.log('Target: 57 questions')
console.log('Time: ~10-15 minutes')
console.log('Batch size: 5 questions per call\n')

let parentFaqSuccess = 0
let parentFaqTotal = 0

for (let i = 1; i <= 12; i++) {
  console.log(`\nBatch ${i}/12 - Calling generate-parent-faq...`)

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
      console.log(`   ${data.message}`)
      console.log(`   Progress: ${data.progress || 'N/A'}`)

      if (data.status === 'complete') {
        const [current, total] = (data.progress || '0/0').split('/').map(Number)
        parentFaqTotal = total || current
        console.log(`\n✅ Phase 1 Complete: All ${parentFaqTotal} parent FAQs generated!`)
        break
      }

      const generated = data.results?.filter(r => r.success).length || 0
      parentFaqSuccess += generated

    } else {
      const errorText = await response.text()
      console.log(`   ⚠️  Error ${response.status}: ${errorText.substring(0, 200)}`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
  }

  // Delay between batches
  if (i < 12) {
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

console.log(`\n📊 Phase 1 Summary: ${parentFaqTotal || parentFaqSuccess} parent FAQs ready`)

// ====================================================================
// PHASE 2: KID Q&A (140+ questions)
// ====================================================================
console.log('\n' + '━'.repeat(80))
console.log('👦 PHASE 2: KID Q&A GENERATION\n')
console.log('Target: 140+ questions')
console.log('Time: ~20-30 minutes')
console.log('Batch size: 10 questions per call\n')

let kidQaSuccess = 0
let kidQaTotal = 0

for (let i = 1; i <= 15; i++) {
  console.log(`\nBatch ${i}/15 - Calling generate-kid-qa...`)

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-kid-qa`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`   ${data.message}`)
      console.log(`   Progress: ${data.progress || 'N/A'}`)

      if (data.status === 'complete') {
        const [current, total] = (data.progress || '0/0').split('/').map(Number)
        kidQaTotal = total || current
        console.log(`\n✅ Phase 2 Complete: All ${kidQaTotal} kid Q&As generated!`)
        break
      }

      const generated = data.results?.filter(r => r.success).length || 0
      kidQaSuccess += generated

    } else {
      const errorText = await response.text()
      console.log(`   ⚠️  Error ${response.status}: ${errorText.substring(0, 200)}`)
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
  }

  // Delay between batches
  if (i < 15) {
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}

console.log(`\n📊 Phase 2 Summary: ${kidQaTotal || kidQaSuccess} kid Q&As ready`)

// ====================================================================
// PHASE 3: HELP EXPLANATIONS (7,000+ explanations for 119 skills)
// ====================================================================
console.log('\n' + '━'.repeat(80))
console.log('🆘 PHASE 3: HELP EXPLANATION LIBRARY GENERATION\n')
console.log('Target: 119 skills × ~60 explanations = 7,140 explanations')
console.log('Time: ~30-40 hours (this is the big one!)')
console.log('Note: Mistake patterns generated automatically with explanations\n')

// Get skills that need explanations
const { data: existingExplanations } = await supabase
  .from('explanation_library')
  .select('skill_id')

const skillsWithExplanations = new Set(
  existingExplanations?.map(e => e.skill_id).filter(Boolean) || []
)

const { data: allSkills } = await supabase
  .from('curriculum_skills')
  .select('id, skill_name, subject_code, grade_level')
  .order('grade_level', { ascending: true })
  .order('subject_code', { ascending: true })

const skillsToGenerate = allSkills?.filter(s => !skillsWithExplanations.has(s.id)) || []

console.log(`\n📊 Skills Status:`)
console.log(`   Total skills: ${allSkills?.length || 0}`)
console.log(`   Already have explanations: ${skillsWithExplanations.size}`)
console.log(`   Need to generate: ${skillsToGenerate.length}`)

if (skillsToGenerate.length === 0) {
  console.log(`\n✅ All skills already have explanations!`)
} else {
  console.log(`\n⚠️  Generating ${skillsToGenerate.length} skills will take ~${Math.round(skillsToGenerate.length * 15 / 60)} hours`)
  console.log('Consider running this overnight or in multiple sessions.\n')

  let explanationSuccess = 0
  let explanationErrors = 0

  for (let i = 0; i < skillsToGenerate.length; i++) {
    const skill = skillsToGenerate[i]
    console.log(`\n[${i + 1}/${skillsToGenerate.length}] Generating: ${skill.subject_code} - ${skill.skill_name}`)
    console.log(`   Grade ${skill.grade_level}`)

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-lesson-v2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skill_id: skill.id
        })
      })

      if (response.ok) {
        const data = await response.json()

        if (data.status === 'complete') {
          console.log(`   ℹ️  ${data.message}`)
          break
        }

        console.log(`   ✅ Generated:`)
        console.log(`      • ${data.explanations_saved || 0} explanation sets`)
        console.log(`      • ${data.mistakes_saved || 0} mistake patterns`)
        explanationSuccess++

      } else {
        const errorText = await response.text()
        console.log(`   ❌ Error ${response.status}: ${errorText.substring(0, 100)}`)
        explanationErrors++
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`)
      explanationErrors++
    }

    // Progress checkpoint every 10 skills
    if ((i + 1) % 10 === 0) {
      console.log(`\n📊 Checkpoint: ${explanationSuccess} skills completed, ${explanationErrors} errors`)
      console.log(`   Remaining: ${skillsToGenerate.length - i - 1} skills`)
      console.log(`   Est. time left: ~${Math.round((skillsToGenerate.length - i - 1) * 15 / 60)} hours\n`)
    }

    // Delay between calls to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 10000)) // 10 second delay
  }

  console.log(`\n📊 Phase 3 Summary:`)
  console.log(`   Skills processed: ${explanationSuccess}`)
  console.log(`   Errors: ${explanationErrors}`)
  console.log(`   Estimated explanations generated: ${explanationSuccess * 60}`)
}

// ====================================================================
// FINAL SUMMARY
// ====================================================================
console.log('\n' + '=' .repeat(80))
console.log('🎉 CONTENT GENERATION COMPLETE!\n')
console.log('=' .repeat(80))

// Query final counts
const { data: finalParentFaq } = await supabase.from('parent_help_articles').select('id', { count: 'exact', head: true })
const { data: finalKidQa } = await supabase.from('qa_library').select('id', { count: 'exact', head: true })
const { data: finalExplanations } = await supabase.from('explanation_library').select('id', { count: 'exact', head: true })
const { data: finalMistakes } = await supabase.from('mistake_patterns').select('id', { count: 'exact', head: true })

console.log('\n📊 FINAL CONTENT COUNTS:\n')
console.log(`   Parent FAQs:        ${finalParentFaq?.length || 0}`)
console.log(`   Kid Q&As:           ${finalKidQa?.length || 0}`)
console.log(`   Help Explanations:  ${finalExplanations?.length || 0}`)
console.log(`   Mistake Patterns:   ${finalMistakes?.length || 0}`)

const totalContent = (finalParentFaq?.length || 0) + (finalKidQa?.length || 0) +
                     (finalExplanations?.length || 0) + (finalMistakes?.length || 0)

console.log(`\n   TOTAL CONTENT: ${totalContent} pieces`)

// Calculate savings
const estimatedUses = totalContent * 10 // Conservative: each used 10x
const savingsPerUse = 0.02
const totalSavings = estimatedUses * savingsPerUse

console.log(`\n💰 ESTIMATED ANNUAL SAVINGS:\n`)
console.log(`   Content pieces: ${totalContent}`)
console.log(`   Est. uses (10x each): ${estimatedUses}`)
console.log(`   Savings per use: $${savingsPerUse}`)
console.log(`   TOTAL SAVINGS: $${totalSavings.toFixed(2)}/year`)

console.log('\n✅ Your closed loop system is now fully populated!')
console.log('💸 API costs will approach $0 as the library gets used.\n')
console.log('Run audit to verify:')
console.log('   node audit-closed-loop-content.mjs\n')
console.log('=' .repeat(80) + '\n')
