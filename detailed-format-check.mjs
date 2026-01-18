#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('='.repeat(70))
console.log('DETAILED FORMAT ANALYSIS')
console.log('='.repeat(70))

async function run() {
  // Get all unique source files with counts
  console.log('\n1. ALL SOURCE FILES:\n')

  for (let grade = 0; grade <= 12; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('grade', grade)

    if (count > 0) {
      // Check how many of this grade have tier1
      const { count: withTier1 } = await supabase
        .from('practice_problems')
        .select('*', { count: 'exact', head: true })
        .eq('grade', grade)
        .not('tier1', 'is', null)

      const pct = Math.round((withTier1 / count) * 100)
      const status = withTier1 === count ? 'ALL CORRECT' :
                     withTier1 === 0 ? 'ALL WRONG' :
                     `${withTier1}/${count} (${pct}%)`

      const ageGroup = grade <= 7 ? 'UNDER 13' : '14+'
      console.log(`  Grade ${grade}: ${count} items, tier1: ${status} [${ageGroup}]`)
    }
  }

  // Also check NULL grades
  const { count: nullGrades } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('grade', null)

  if (nullGrades > 0) {
    const { count: nullWithTier1 } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .is('grade', null)
      .not('tier1', 'is', null)

    console.log(`  Grade NULL: ${nullGrades} items, tier1: ${nullWithTier1}/${nullGrades}`)
  }

  // Sample items WITH tier1 to see what format they have
  console.log('\n2. SAMPLE ITEM WITH TIER1:\n')

  const { data: goodSample } = await supabase
    .from('practice_problems')
    .select('*')
    .not('tier1', 'is', null)
    .limit(1)

  if (goodSample && goodSample[0]) {
    const item = goodSample[0]
    console.log('  ID: ' + item.id)
    console.log('  Grade: ' + item.grade)
    console.log('  Skill: ' + item.skill)
    console.log('  Source: ' + item.source_file)
    console.log('  tier1 type: ' + typeof item.tier1)
    if (item.tier1) {
      console.log('  tier1 keys: ' + Object.keys(item.tier1).join(', '))
      if (item.tier1.steps) {
        console.log('  tier1.steps count: ' + item.tier1.steps.length)
        if (item.tier1.steps[0]) {
          console.log('  tier1.steps[0] keys: ' + Object.keys(item.tier1.steps[0]).join(', '))
        }
      }
    }
  }

  // Sample items WITHOUT tier1 to see what they look like
  console.log('\n3. SAMPLE ITEM WITHOUT TIER1:\n')

  const { data: badSample } = await supabase
    .from('practice_problems')
    .select('*')
    .is('tier1', null)
    .limit(1)

  if (badSample && badSample[0]) {
    const item = badSample[0]
    console.log('  ID: ' + item.id)
    console.log('  Grade: ' + item.grade)
    console.log('  Skill: ' + item.skill)
    console.log('  Source: ' + item.source_file)
    console.log('  Has explanation: ' + (item.explanation ? 'YES' : 'NO'))
  }

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('SUMMARY FOR UNDER-13 COMPLIANCE')
  console.log('='.repeat(70))

  let under13Total = 0
  let under13WithTier = 0
  let under13Missing = 0

  for (let grade = 0; grade <= 7; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('grade', grade)

    const { count: withTier } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('grade', grade)
      .not('tier1', 'is', null)

    under13Total += count || 0
    under13WithTier += withTier || 0
    under13Missing += (count || 0) - (withTier || 0)
  }

  console.log('\n  UNDER 13 (Grades K-7):')
  console.log('    Total items: ' + under13Total)
  console.log('    WITH proper tier1/tier2: ' + under13WithTier)
  console.log('    MISSING tier1/tier2: ' + under13Missing)

  if (under13Missing > 0) {
    console.log('\n  ⚠️  ' + under13Missing + ' items need to be fixed or deleted!')
  } else if (under13Total === 0) {
    console.log('\n  ℹ️  No under-13 content exists yet. Need to seed with proper format.')
  } else {
    console.log('\n  ✓ All under-13 content is properly formatted!')
  }
}

run()
