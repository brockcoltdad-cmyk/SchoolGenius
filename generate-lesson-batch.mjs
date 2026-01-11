// Generate batch of lessons to populate explanation_library
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('🚀 GENERATING LESSON BATCH FOR LIBRARY\n')
console.log('=' .repeat(60))

// Configuration
const BATCH_SIZE = 5  // Generate 5 lessons
const DELAY_BETWEEN_CALLS = 3000  // 3 seconds delay

// Step 1: Check library status before
console.log('\n📊 Step 1: Checking library status BEFORE generation...\n')

const { data: beforeExplanations, error: beforeExplError } = await supabase
  .from('explanation_library')
  .select('*')

const { data: beforeMistakes, error: beforeMistakeError } = await supabase
  .from('mistake_patterns')
  .select('*')

console.log(`   Explanations in library: ${beforeExplanations?.length || 0}`)
console.log(`   Mistake patterns: ${beforeMistakes?.length || 0}`)

// Step 2: Get skills that need lessons
console.log('\n📚 Step 2: Finding skills that need lessons...\n')

const { data: existingContent } = await supabase
  .from('lesson_content')
  .select('skill_id')

const existingSkillIds = new Set(existingContent?.map(c => c.skill_id) || [])

const { data: skills } = await supabase
  .from('curriculum_skills')
  .select('id, skill_name, subject_code, grade_level')
  .order('grade_level', { ascending: true })
  .limit(20)  // Get first 20 skills

const skillsNeedingLessons = skills?.filter(s => !existingSkillIds.has(s.id)) || []

console.log(`   Total skills found: ${skills?.length || 0}`)
console.log(`   Skills with lessons: ${existingSkillIds.size}`)
console.log(`   Skills needing lessons: ${skillsNeedingLessons.length}`)

if (skillsNeedingLessons.length === 0) {
  console.log('\n✅ All skills already have lessons!')
  console.log('   Running generation anyway to get next skills...')
}

// Step 3: Generate lessons
console.log(`\n🔧 Step 3: Generating ${BATCH_SIZE} lessons...\n`)

const results = []
let successCount = 0
let errorCount = 0

for (let i = 0; i < BATCH_SIZE; i++) {
  console.log(`\n   [${i + 1}/${BATCH_SIZE}] Generating lesson...`)

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-lesson-v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})  // Auto-selects next skill
    })

    if (response.ok) {
      const data = await response.json()

      if (data.status === 'complete') {
        console.log(`   ℹ️  ${data.message}`)
        break  // All lessons generated
      }

      console.log(`   ✅ Success: ${data.skill}`)
      console.log(`      Grade: ${data.grade_level}`)
      console.log(`      Explanations saved: ${data.explanations_saved}`)
      console.log(`      Mistakes saved: ${data.mistakes_saved}`)

      results.push({
        success: true,
        skill: data.skill,
        grade: data.grade_level,
        explanations: data.explanations_saved,
        mistakes: data.mistakes_saved
      })
      successCount++
    } else {
      const errorText = await response.text()
      console.log(`   ❌ Error: ${response.status}`)
      console.log(`      ${errorText.substring(0, 100)}`)
      errorCount++
      results.push({ success: false, error: errorText })
    }
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`)
    errorCount++
    results.push({ success: false, error: error.message })
  }

  // Wait between calls to avoid overwhelming the system
  if (i < BATCH_SIZE - 1) {
    console.log(`   ⏳ Waiting ${DELAY_BETWEEN_CALLS / 1000} seconds...`)
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS))
  }
}

// Step 4: Check library status after
console.log('\n\n📊 Step 4: Checking library status AFTER generation...\n')

const { data: afterExplanations } = await supabase
  .from('explanation_library')
  .select('*')

const { data: afterMistakes } = await supabase
  .from('mistake_patterns')
  .select('*')

const explanationGrowth = (afterExplanations?.length || 0) - (beforeExplanations?.length || 0)
const mistakeGrowth = (afterMistakes?.length || 0) - (beforeMistakes?.length || 0)

console.log(`   Explanations in library: ${afterExplanations?.length || 0} (+${explanationGrowth})`)
console.log(`   Mistake patterns: ${afterMistakes?.length || 0} (+${mistakeGrowth})`)

// Step 5: Show summary
console.log('\n' + '=' .repeat(60))
console.log('\n📈 GENERATION SUMMARY:\n')

console.log(`   Lessons attempted: ${BATCH_SIZE}`)
console.log(`   Successful: ${successCount} ✅`)
console.log(`   Failed: ${errorCount} ❌`)
console.log(`   Library growth: +${explanationGrowth} explanations`)
console.log(`   Mistake growth: +${mistakeGrowth} patterns`)

if (successCount > 0) {
  console.log('\n📚 Generated Lessons:\n')
  results.filter(r => r.success).forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.skill} (Grade ${r.grade})`)
    console.log(`      • ${r.explanations} multi-level explanations`)
    console.log(`      • ${r.mistakes} mistake patterns`)
  })
}

// Step 6: Calculate potential savings
console.log('\n💰 COST SAVINGS CALCULATION:\n')

const totalExplanations = afterExplanations?.length || 0
const avgTimesUsed = 10  // Conservative estimate
const potentialUses = totalExplanations * avgTimesUsed
const savingsPerUse = 0.02

console.log(`   Total explanations: ${totalExplanations}`)
console.log(`   Estimated uses per explanation: ${avgTimesUsed}`)
console.log(`   Potential library serves: ${potentialUses}`)
console.log(`   Savings per serve: $${savingsPerUse}`)
console.log(`   Potential savings: $${(potentialUses * savingsPerUse).toFixed(2)}`)

// Step 7: Show most common topics
console.log('\n📊 LIBRARY CONTENTS:\n')

const { data: libraryContents } = await supabase
  .from('explanation_library')
  .select('subject_code, skill_name, problem_text, times_used')
  .order('created_at', { ascending: false })
  .limit(10)

if (libraryContents && libraryContents.length > 0) {
  console.log('   Recent explanations added:\n')
  libraryContents.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.subject_code}: ${item.skill_name}`)
    console.log(`      Problem: ${item.problem_text?.substring(0, 60)}...`)
    console.log(`      Times used: ${item.times_used}`)
  })
} else {
  console.log('   No explanations found')
}

console.log('\n' + '=' .repeat(60))

if (successCount > 0) {
  console.log('\n✅ BATCH GENERATION COMPLETE!\n')
  console.log('🎉 The library is growing! Cost savings increasing!')
  console.log('\n📋 Next Steps:')
  console.log('   • Run this script again to generate more lessons')
  console.log('   • Monitor library usage in production')
  console.log('   • Watch costs approach $0')
  console.log('\n💡 Tip: Run "node generate-lesson-batch.mjs" regularly to keep building the library!')
} else {
  console.log('\n⚠️  No lessons generated successfully')
  console.log('   Check error messages above for details')
}

console.log('\n')
