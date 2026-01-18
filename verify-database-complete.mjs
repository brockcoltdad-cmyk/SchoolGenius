import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const subjects = ['Math', 'Reading', 'Writing', 'Typing']
const grades = ['K', '1', '2', '3', '4', '5', '6', '7']
const phases = [
  { name: 'rule_teaching', table: 'lesson_rule_teaching' },
  { name: 'demo', table: 'lesson_demo' },
  { name: 'guided', table: 'lesson_guided_practice' },
  { name: 'practice', table: 'lesson_practice_problems' },
  { name: 'quiz', table: 'lesson_check_questions' },
  { name: 'review', table: 'lesson_monthly_review' }
]

async function verifyDatabase() {
  console.log('=' .repeat(80))
  console.log('DATABASE VERIFICATION - 100% COMPLETION CHECK')
  console.log('=' .repeat(80))
  console.log()

  const results = {}
  const gaps = []
  let totalItems = 0

  // Check each phase table
  for (const phase of phases) {
    console.log(`\n${'─'.repeat(80)}`)
    console.log(`PHASE: ${phase.name.toUpperCase()} (${phase.table})`)
    console.log('─'.repeat(80))

    results[phase.name] = {}

    // Get counts per subject and grade
    const { data, error } = await supabase
      .from(phase.table)
      .select('subject, grade')

    if (error) {
      console.log(`  ERROR: ${error.message}`)
      continue
    }

    // Count by subject and grade
    const counts = {}
    for (const item of data || []) {
      const key = `${item.subject}|${item.grade}`
      counts[key] = (counts[key] || 0) + 1
    }

    // Display per-subject breakdown
    for (const subject of subjects) {
      console.log(`\n  ${subject}:`)
      let subjectTotal = 0
      const gradeRow = []

      for (const grade of grades) {
        const count = counts[`${subject}|${grade}`] || 0
        subjectTotal += count
        gradeRow.push(`G${grade}:${count}`)

        if (count === 0) {
          gaps.push({ phase: phase.name, table: phase.table, subject, grade })
        }
      }

      console.log(`    ${gradeRow.join(' | ')}`)
      console.log(`    TOTAL: ${subjectTotal}`)
      totalItems += subjectTotal

      results[phase.name][subject] = subjectTotal
    }

    console.log(`\n  Phase Total: ${data?.length || 0}`)
  }

  // Summary
  console.log('\n')
  console.log('=' .repeat(80))
  console.log('SUMMARY BY SUBJECT')
  console.log('=' .repeat(80))

  for (const subject of subjects) {
    console.log(`\n${subject}:`)
    let subjectTotal = 0
    for (const phase of phases) {
      const count = results[phase.name]?.[subject] || 0
      subjectTotal += count
      const status = count > 0 ? '✓' : '✗'
      console.log(`  ${status} ${phase.name.padEnd(15)}: ${count}`)
    }
    console.log(`  SUBJECT TOTAL: ${subjectTotal}`)
  }

  // Gaps report
  console.log('\n')
  console.log('=' .repeat(80))
  console.log('GAPS REPORT (Missing Content)')
  console.log('=' .repeat(80))

  if (gaps.length === 0) {
    console.log('\n✓ NO GAPS FOUND - All subjects have content in all phases!')
  } else {
    console.log(`\n✗ Found ${gaps.length} gaps:\n`)

    // Group by phase
    const gapsByPhase = {}
    for (const gap of gaps) {
      if (!gapsByPhase[gap.phase]) gapsByPhase[gap.phase] = []
      gapsByPhase[gap.phase].push(gap)
    }

    for (const [phase, phaseGaps] of Object.entries(gapsByPhase)) {
      console.log(`  ${phase}:`)
      for (const gap of phaseGaps) {
        console.log(`    - ${gap.subject} Grade ${gap.grade}`)
      }
    }
  }

  // Grand total
  console.log('\n')
  console.log('=' .repeat(80))
  console.log(`GRAND TOTAL: ${totalItems.toLocaleString()} items across all tables`)
  console.log('=' .repeat(80))

  // Per-grade matrix
  console.log('\n')
  console.log('=' .repeat(80))
  console.log('PER-GRADE MATRIX (All Phases Combined)')
  console.log('=' .repeat(80))

  // Requery for combined counts
  const gradeMatrix = {}
  for (const phase of phases) {
    const { data } = await supabase.from(phase.table).select('subject, grade')
    for (const item of data || []) {
      const key = `${item.subject}|${item.grade}`
      gradeMatrix[key] = (gradeMatrix[key] || 0) + 1
    }
  }

  // Print matrix header
  console.log('\n' + ''.padEnd(12) + grades.map(g => `G${g}`.padStart(8)).join(''))
  console.log('─'.repeat(12 + grades.length * 8))

  for (const subject of subjects) {
    const row = [subject.padEnd(12)]
    let rowTotal = 0
    for (const grade of grades) {
      const count = gradeMatrix[`${subject}|${grade}`] || 0
      rowTotal += count
      row.push(count.toString().padStart(8))
    }
    row.push(rowTotal.toString().padStart(10))
    console.log(row.join(''))
  }

  // Column totals
  const colTotals = ['TOTAL'.padEnd(12)]
  let grandTotal = 0
  for (const grade of grades) {
    let colSum = 0
    for (const subject of subjects) {
      colSum += gradeMatrix[`${subject}|${grade}`] || 0
    }
    colTotals.push(colSum.toString().padStart(8))
    grandTotal += colSum
  }
  colTotals.push(grandTotal.toString().padStart(10))
  console.log('─'.repeat(12 + grades.length * 8 + 10))
  console.log(colTotals.join(''))
}

verifyDatabase().catch(console.error)
