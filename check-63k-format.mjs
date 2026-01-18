#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('='.repeat(70))
console.log('ANALYZING 63K ITEMS - FORMAT CHECK')
console.log('='.repeat(70))

async function run() {
  // 1. Get distinct source files
  console.log('\n1. SOURCE FILES IN DATABASE:\n')
  const { data: allItems } = await supabase
    .from('practice_problems')
    .select('source_file')

  const sourceCounts = {}
  allItems.forEach(item => {
    const src = item.source_file || 'NO_SOURCE'
    sourceCounts[src] = (sourceCounts[src] || 0) + 1
  })

  Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([src, count]) => {
      console.log(`  ${src}: ${count} items`)
    })

  // 2. Get sample items to check structure
  console.log('\n2. SAMPLE ITEM (checking what fields have data):\n')
  const { data: samples } = await supabase
    .from('practice_problems')
    .select('*')
    .limit(3)

  if (samples && samples[0]) {
    const item = samples[0]
    console.log('  ID: ' + item.id)
    console.log('  subject: ' + (item.subject || 'NULL'))
    console.log('  grade: ' + (item.grade || 'NULL'))
    console.log('  skill: ' + (item.skill || 'NULL'))
    console.log('  question: ' + (item.question ? item.question.slice(0, 50) + '...' : 'NULL'))
    console.log('  answer: ' + (item.answer ? item.answer.slice(0, 50) : 'NULL'))
    console.log('  explanation: ' + (item.explanation ? 'HAS DATA (' + item.explanation.length + ' chars)' : 'NULL'))
    console.log('  tier1: ' + (item.tier1 ? 'HAS DATA' : 'NULL'))
    console.log('  tier2: ' + (item.tier2 ? 'HAS DATA' : 'NULL'))
    console.log('  visual_type: ' + (item.visual_type || 'NULL'))
    console.log('  visual_data: ' + (item.visual_data ? 'HAS DATA' : 'NULL'))
    console.log('  standard: ' + (item.standard || 'NULL'))
    console.log('  hints: ' + (item.hints ? 'HAS DATA' : 'NULL'))
    console.log('  common_mistake: ' + (item.common_mistake || 'NULL'))
  }

  // 3. Count items with/without tier1/tier2
  console.log('\n3. TIER1/TIER2 STATUS:\n')

  const { count: total } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  const { count: withTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier1', 'is', null)

  const { count: withTier2 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier2', 'is', null)

  const { count: withStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('standard', 'is', null)

  const { count: withVisual } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('visual_type', 'is', null)

  console.log('  Total items: ' + total)
  console.log('  Items WITH tier1: ' + (withTier1 || 0))
  console.log('  Items WITH tier2: ' + (withTier2 || 0))
  console.log('  Items WITH standard: ' + (withStandard || 0))
  console.log('  Items WITH visual_type: ' + (withVisual || 0))
  console.log('  Items MISSING tier1: ' + (total - (withTier1 || 0)))

  // 4. Check grades distribution (under 13 vs 14+)
  console.log('\n4. GRADE DISTRIBUTION:\n')

  const gradeCounts = {}
  allItems.forEach(async (item) => {
    // We need to query again for grades
  })

  const { data: gradeData } = await supabase
    .from('practice_problems')
    .select('grade')

  const grades = {}
  gradeData.forEach(item => {
    const g = item.grade || 'NULL'
    grades[g] = (grades[g] || 0) + 1
  })

  let under13 = 0
  let over13 = 0

  Object.entries(grades)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([grade, count]) => {
      const g = Number(grade)
      const ageGroup = g <= 7 ? 'UNDER 13' : '14+'
      if (g <= 7) under13 += count
      else over13 += count
      console.log(`  Grade ${grade}: ${count} items (${ageGroup})`)
    })

  console.log('\n5. SUMMARY:\n')
  console.log('  UNDER 13 (K-7): ' + under13 + ' items')
  console.log('  14+ (8-12): ' + over13 + ' items')

  console.log('\n' + '='.repeat(70))
  console.log('DIAGNOSIS')
  console.log('='.repeat(70))

  if ((withTier1 || 0) === 0) {
    console.log('\n  PROBLEM: ALL items are missing tier1/tier2!')
    console.log('  This means the seeding did NOT use the proper format.')
    console.log('  The master seeding prompt requires tier1/tier2 but items only have:')
    console.log('    - question, answer, explanation (simple format)')
  }

  if (under13 > 0 && (withTier1 || 0) === 0) {
    console.log('\n  CRITICAL: ' + under13 + ' items for UNDER 13 are in wrong format!')
    console.log('  Per COPPA: Under 13 cannot use live AI, so these MUST have tier1/tier2.')
  }
}

run()
