// Check the format of lesson items in the database
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

console.log('\n🔍 CHECKING LESSON ITEM FORMAT IN DATABASE\n')
console.log('='.repeat(70))

// Get total count
const { count } = await supabase
  .from('practice_problems')
  .select('*', { count: 'exact', head: true })

console.log(`\n📊 Total items in database: ${count}`)

// Get a sample of items to check format
const { data: samples, error } = await supabase
  .from('practice_problems')
  .select('*')
  .limit(5)

if (error) {
  console.log(`\n❌ Error: ${error.message}`)
  process.exit(1)
}

console.log(`\n📋 SAMPLE ITEM STRUCTURE:\n`)

if (samples && samples.length > 0) {
  const sample = samples[0]

  console.log('FIELDS PRESENT:')
  console.log('-'.repeat(50))

  // Check each required field
  const checks = {
    'id': sample.id,
    'subject': sample.subject,
    'grade': sample.grade,
    'skill': sample.skill,
    'standard': sample.standard,
    'question': sample.question,
    'answer': sample.answer,
    'tier1': sample.tier1,
    'tier2': sample.tier2,
    'visual_type': sample.visual_type,
    'visual_data': sample.visual_data,
  }

  for (const [field, value] of Object.entries(checks)) {
    const status = value !== null && value !== undefined ? '✓' : '✗'
    const type = typeof value
    const preview = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : String(value).substring(0, 50)
    console.log(`  ${status} ${field}: (${type}) ${preview}`)
  }

  // Deep check tier1 structure
  console.log('\n\nTIER1 STRUCTURE CHECK:')
  console.log('-'.repeat(50))

  if (sample.tier1) {
    const tier1 = typeof sample.tier1 === 'string' ? JSON.parse(sample.tier1) : sample.tier1
    console.log(`  ✓ tier1 exists`)
    console.log(`  ${tier1.teach ? '✓' : '✗'} tier1.teach: ${tier1.teach ? tier1.teach.substring(0, 60) + '...' : 'MISSING'}`)
    console.log(`  ${tier1.steps ? '✓' : '✗'} tier1.steps: ${tier1.steps ? `Array with ${tier1.steps.length} steps` : 'MISSING'}`)

    if (tier1.steps && tier1.steps[0]) {
      const step = tier1.steps[0]
      console.log(`\n  Step 1 details:`)
      console.log(`    ${step.step !== undefined ? '✓' : '✗'} step number: ${step.step}`)
      console.log(`    ${step.visual ? '✓' : '✗'} visual: ${step.visual ? JSON.stringify(step.visual).substring(0, 60) + '...' : 'MISSING'}`)
      console.log(`    ${step.voice_text ? '✓' : '✗'} voice_text: ${step.voice_text ? step.voice_text.substring(0, 60) : 'MISSING'}`)
      console.log(`    ${step.duration ? '✓' : '✗'} duration: ${step.duration || 'MISSING'}`)
    }
  } else {
    console.log(`  ✗ tier1 is NULL or missing`)
  }

  // Deep check tier2 structure
  console.log('\n\nTIER2 STRUCTURE CHECK:')
  console.log('-'.repeat(50))

  if (sample.tier2) {
    const tier2 = typeof sample.tier2 === 'string' ? JSON.parse(sample.tier2) : sample.tier2
    console.log(`  ✓ tier2 exists`)
    console.log(`  ${tier2.teach ? '✓' : '✗'} tier2.teach: ${tier2.teach ? tier2.teach.substring(0, 60) + '...' : 'MISSING'}`)
    console.log(`  ${tier2.steps ? '✓' : '✗'} tier2.steps: ${tier2.steps ? `Array with ${tier2.steps.length} steps` : 'MISSING'}`)

    if (tier2.steps && tier2.steps[0]) {
      const step = tier2.steps[0]
      console.log(`\n  Step 1 details:`)
      console.log(`    ${step.step !== undefined ? '✓' : '✗'} step number: ${step.step}`)
      console.log(`    ${step.visual ? '✓' : '✗'} visual: ${step.visual ? JSON.stringify(step.visual).substring(0, 60) + '...' : 'MISSING'}`)
      console.log(`    ${step.voice_text ? '✓' : '✗'} voice_text: ${step.voice_text ? step.voice_text.substring(0, 60) : 'MISSING'}`)
      console.log(`    ${step.duration ? '✓' : '✗'} duration: ${step.duration || 'MISSING'}`)
    }
  } else {
    console.log(`  ✗ tier2 is NULL or missing`)
  }

  // Print full sample for inspection
  console.log('\n\nFULL SAMPLE ITEM:')
  console.log('-'.repeat(50))
  console.log(JSON.stringify(sample, null, 2))

  // Check statistics across all items
  console.log('\n\n📊 STATISTICS ACROSS ALL ITEMS:')
  console.log('-'.repeat(50))

  // Get counts of items with/without tier1, tier2
  const { count: withTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier1', 'is', null)

  const { count: withTier2 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier2', 'is', null)

  const { count: withVisualType } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('visual_type', 'is', null)

  const { count: withStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('standard', 'is', null)

  console.log(`  Items with tier1: ${withTier1} / ${count} (${((withTier1/count)*100).toFixed(1)}%)`)
  console.log(`  Items with tier2: ${withTier2} / ${count} (${((withTier2/count)*100).toFixed(1)}%)`)
  console.log(`  Items with visual_type: ${withVisualType} / ${count} (${((withVisualType/count)*100).toFixed(1)}%)`)
  console.log(`  Items with standard: ${withStandard} / ${count} (${((withStandard/count)*100).toFixed(1)}%)`)

  // Get breakdown by subject
  console.log('\n\n📊 BREAKDOWN BY SUBJECT:')
  console.log('-'.repeat(50))

  const { data: subjects } = await supabase
    .from('practice_problems')
    .select('subject')

  const subjectCounts = {}
  subjects.forEach(item => {
    subjectCounts[item.subject] = (subjectCounts[item.subject] || 0) + 1
  })

  for (const [subject, cnt] of Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${subject}: ${cnt}`)
  }

  // Get breakdown by grade
  console.log('\n\n📊 BREAKDOWN BY GRADE:')
  console.log('-'.repeat(50))

  const { data: grades } = await supabase
    .from('practice_problems')
    .select('grade')

  const gradeCounts = {}
  grades.forEach(item => {
    gradeCounts[item.grade] = (gradeCounts[item.grade] || 0) + 1
  })

  for (const [grade, cnt] of Object.entries(gradeCounts).sort((a, b) => a[0] - b[0])) {
    console.log(`  Grade ${grade}: ${cnt}`)
  }
}

console.log('\n' + '='.repeat(70) + '\n')
