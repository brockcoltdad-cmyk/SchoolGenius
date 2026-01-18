// Comprehensive database count verification
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('COMPLETE DATABASE VERIFICATION')
  console.log('='.repeat(70))

  const tables = [
    'rule_teaching_scripts',
    'demo_problems',
    'guided_practice',
    'practice_problems',
    'weekly_quizzes',
    'monthly_reviews'
  ]

  const subjects = ['math', 'reading', 'writing', 'typing', 'spelling', 'coding']

  // Total counts per table
  console.log('\n=== TOTAL COUNTS PER TABLE ===')
  const totals = {}
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`  ${table}: ERROR - ${error.message}`)
    } else {
      totals[table] = count
      console.log(`  ${table}: ${count?.toLocaleString()}`)
    }
  }

  // Counts by subject
  console.log('\n=== COUNTS BY SUBJECT ===')
  for (const table of tables) {
    console.log(`\n${table}:`)
    for (const subject of subjects) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('subject', subject)

      if (count > 0) {
        console.log(`  ${subject}: ${count?.toLocaleString()}`)
      }
    }
  }

  // Practice problems by subject and grade
  console.log('\n=== PRACTICE PROBLEMS BY SUBJECT & GRADE ===')
  for (const subject of subjects) {
    const { data } = await supabase
      .from('practice_problems')
      .select('grade')
      .eq('subject', subject)

    if (data && data.length > 0) {
      const grades = {}
      data.forEach(d => {
        grades[d.grade] = (grades[d.grade] || 0) + 1
      })
      console.log(`\n${subject}:`)
      Object.entries(grades).sort((a,b) => a[0] - b[0]).forEach(([g, c]) => {
        console.log(`  Grade ${g}: ${c.toLocaleString()}`)
      })
      console.log(`  TOTAL: ${data.length.toLocaleString()}`)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('SUMMARY')
  console.log('='.repeat(70))

  let grandTotal = 0
  console.log('\n| Table | Count |')
  console.log('|-------|-------|')
  for (const [table, count] of Object.entries(totals)) {
    console.log(`| ${table} | ${count?.toLocaleString()} |`)
    grandTotal += count || 0
  }
  console.log(`| **GRAND TOTAL** | **${grandTotal.toLocaleString()}** |`)

  // Check for items with tier1/tier2
  console.log('\n=== TIER1/TIER2 COVERAGE ===')
  const { count: withTier1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier1', 'is', null)

  const { count: withTier2 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('tier2', 'is', null)

  console.log(`  Items with tier1: ${withTier1?.toLocaleString()}`)
  console.log(`  Items with tier2: ${withTier2?.toLocaleString()}`)
  console.log(`  Total practice_problems: ${totals['practice_problems']?.toLocaleString()}`)
}

main().catch(console.error)
