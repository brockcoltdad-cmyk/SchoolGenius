// SchoolGenius Phase 0 Audit
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runAudit() {
  console.log('\n========================================')
  console.log('       SCHOOLGENIUS PHASE 0 AUDIT       ')
  console.log('========================================\n')

  const results = {
    working: [],
    broken: [],
    critical: [],
    canWait: []
  }

  // ==========================================
  // 1. DATABASE AUDIT
  // ==========================================
  console.log('--- DATABASE AUDIT ---\n')

  // Check practice_problems table
  try {
    const { count: totalCount, error: countError } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      results.critical.push(`practice_problems table error: ${countError.message}`)
    } else {
      results.working.push(`practice_problems table exists (${totalCount} items)`)
      console.log(`  practice_problems: ${totalCount} total items`)
    }
  } catch (e) {
    results.critical.push(`practice_problems table: ${e.message}`)
  }

  // Check by subject
  console.log('\n  Content by subject:')
  const subjects = ['math', 'typing', 'coding', 'reading', 'spelling', 'writing']

  for (const subject of subjects) {
    const { count, error } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', subject)

    if (error) {
      results.broken.push(`${subject} query failed: ${error.message}`)
    } else {
      console.log(`    ${subject}: ${count || 0} items`)
      if (count > 0) {
        results.working.push(`${subject}: ${count} items in database`)
      }
    }
  }

  // Check columns exist by querying a sample
  console.log('\n  Checking columns...')
  const { data: sample, error: sampleError } = await supabase
    .from('practice_problems')
    .select('id, subject, grade, skill, standard, question, answer, tier1, tier2, visual_type, visual_data')
    .limit(1)

  if (sampleError) {
    results.critical.push(`Column check failed: ${sampleError.message}`)
  } else if (sample && sample.length > 0) {
    const item = sample[0]
    const requiredCols = ['id', 'subject', 'grade', 'skill', 'standard', 'question', 'answer', 'tier1', 'tier2']
    const missing = requiredCols.filter(col => item[col] === undefined)

    if (missing.length > 0) {
      results.critical.push(`Missing columns: ${missing.join(', ')}`)
    } else {
      results.working.push('All required columns exist')
      console.log('    All required columns present')
    }
  }

  // Check for items without standards
  const { count: noStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('standard', null)

  if (noStandard > 0) {
    results.canWait.push(`${noStandard} items missing standard field`)
    console.log(`\n    WARNING: ${noStandard} items have no standard`)
  } else {
    results.working.push('All items have standard codes')
    console.log('    All items have standard codes')
  }

  // ==========================================
  // 2. CONTENT AUDIT
  // ==========================================
  console.log('\n--- CONTENT AUDIT ---\n')

  // Check Math K-1
  const { count: mathK } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'math')
    .eq('grade', 0)

  const { count: math1 } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'math')
    .eq('grade', 1)

  console.log(`  Math K: ${mathK || 0} items`)
  console.log(`  Math 1: ${math1 || 0} items`)

  if ((mathK || 0) + (math1 || 0) >= 17000) {
    results.working.push(`Math K-1: ${(mathK || 0) + (math1 || 0)} items (target ~17,772)`)
  }

  // Check Typing by grade
  console.log('\n  Typing by grade:')
  let typingTotal = 0
  for (let g = 0; g <= 7; g++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'typing')
      .eq('grade', g)

    console.log(`    Grade ${g}: ${count || 0} items`)
    typingTotal += count || 0
  }

  if (typingTotal >= 10000) {
    results.working.push(`Typing K-7: ${typingTotal} items (target 10,500)`)
  } else if (typingTotal === 0) {
    results.broken.push('Typing: 0 items (expected 10,500)')
  }

  // Check tier1/tier2 structure
  console.log('\n  Checking tier1/tier2 structure...')
  const { data: structCheck } = await supabase
    .from('practice_problems')
    .select('id, tier1, tier2')
    .limit(5)

  let structOk = true
  for (const item of structCheck || []) {
    if (!item.tier1 || !item.tier1.teach || !item.tier1.steps) {
      structOk = false
      results.broken.push(`Item ${item.id}: tier1 structure invalid`)
    }
    if (!item.tier2 || !item.tier2.teach || !item.tier2.steps) {
      structOk = false
      results.broken.push(`Item ${item.id}: tier2 structure invalid`)
    }
  }

  if (structOk) {
    results.working.push('tier1/tier2 structure is correct')
    console.log('    tier1/tier2 structure OK')
  }

  // ==========================================
  // 3. DATA INTEGRITY
  // ==========================================
  console.log('\n--- DATA INTEGRITY ---\n')

  // Check for duplicate IDs
  const { data: allIds } = await supabase
    .from('practice_problems')
    .select('id')

  if (allIds) {
    const ids = allIds.map(i => i.id)
    const uniqueIds = new Set(ids)
    if (ids.length !== uniqueIds.size) {
      results.critical.push(`Duplicate IDs found: ${ids.length - uniqueIds.size} duplicates`)
    } else {
      results.working.push('No duplicate IDs')
      console.log('  No duplicate IDs')
    }
  }

  // Check grade values are valid (0-7)
  const { data: invalidGrades } = await supabase
    .from('practice_problems')
    .select('id, grade')
    .or('grade.lt.0,grade.gt.7')

  if (invalidGrades && invalidGrades.length > 0) {
    results.broken.push(`${invalidGrades.length} items have invalid grade (not 0-7)`)
  } else {
    results.working.push('All grades are valid (0-7)')
    console.log('  All grades valid (0-7)')
  }

  // ==========================================
  // REPORT
  // ==========================================
  console.log('\n========================================')
  console.log('           AUDIT RESULTS                ')
  console.log('========================================\n')

  console.log('WORKING:')
  results.working.forEach(item => console.log(`  ✓ ${item}`))

  console.log('\nBROKEN:')
  if (results.broken.length === 0) {
    console.log('  (none)')
  } else {
    results.broken.forEach(item => console.log(`  ✗ ${item}`))
  }

  console.log('\nCRITICAL (must fix before proceeding):')
  if (results.critical.length === 0) {
    console.log('  (none)')
  } else {
    results.critical.forEach(item => console.log(`  ⚠ ${item}`))
  }

  console.log('\nCAN WAIT (fix later):')
  if (results.canWait.length === 0) {
    console.log('  (none)')
  } else {
    results.canWait.forEach(item => console.log(`  → ${item}`))
  }

  console.log('\n========================================')
  if (results.critical.length === 0) {
    console.log('  RECOMMENDATION: ✓ PROCEED')
    console.log('  No critical issues found.')
  } else {
    console.log('  RECOMMENDATION: ✗ FIX FIRST')
    console.log(`  ${results.critical.length} critical issue(s) need fixing.`)
  }
  console.log('========================================\n')

  return results
}

runAudit().catch(console.error)
