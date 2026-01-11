// Audit all pre-generated Q&A content for closed loop system
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

console.log('🔍 CLOSED LOOP CONTENT AUDIT\n')
console.log('=' .repeat(70))
console.log('\nAnalyzing pre-generated content to minimize Claude API costs...\n')

// 1. QA Library (kid questions about the website/learning)
console.log('━'.repeat(70))
console.log('📚 1. QA LIBRARY (Kid Questions & Answers)\n')

const { data: qaLibrary, error: qaError } = await supabase
  .from('qa_library')
  .select('*')
  .order('times_served', { ascending: false })

if (qaError) {
  console.log('❌ Error querying qa_library:', qaError.message)
} else {
  console.log(`Total Q&A pairs: ${qaLibrary?.length || 0}\n`)

  if (qaLibrary && qaLibrary.length > 0) {
    // Group by category
    const byCategory = {}
    const byGrade = {}
    const byCreator = {}

    qaLibrary.forEach(qa => {
      const cat = qa.category || 'uncategorized'
      const grade = qa.grade_level || 'all'
      const creator = qa.created_by || 'unknown'

      byCategory[cat] = (byCategory[cat] || 0) + 1
      byGrade[grade] = (byGrade[grade] || 0) + 1
      byCreator[creator] = (byCreator[creator] || 0) + 1
    })

    console.log('Breakdown by Category:')
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  • ${cat}: ${count} Q&A pairs`)
    })

    console.log('\nBreakdown by Grade Level:')
    Object.entries(byGrade).forEach(([grade, count]) => {
      console.log(`  • Grade ${grade}: ${count} Q&A pairs`)
    })

    console.log('\nBreakdown by Creator:')
    Object.entries(byCreator).forEach(([creator, count]) => {
      console.log(`  • ${creator}: ${count} Q&A pairs`)
    })

    console.log('\nMost Used Q&A (Top 10):')
    qaLibrary.slice(0, 10).forEach((qa, i) => {
      console.log(`  ${i + 1}. "${qa.question_text?.substring(0, 60)}..."`)
      console.log(`     Served: ${qa.times_served} times | Category: ${qa.category}`)
    })

    // Sample questions
    console.log('\nSample Questions:')
    qaLibrary.slice(0, 5).forEach(qa => {
      console.log(`\n  Q: ${qa.question_text}`)
      console.log(`  A: ${qa.answer_text?.substring(0, 100)}...`)
    })
  } else {
    console.log('⚠️  NO CONTENT FOUND - qa_library is empty!')
    console.log('   Every kid question will call Claude API ($$$)')
  }
}

// 2. Explanation Library (help for lesson problems - 6 levels)
console.log('\n\n━'.repeat(70))
console.log('🆘 2. EXPLANATION LIBRARY (Multi-Level Help for Problems)\n')

const { data: explanations, error: explError } = await supabase
  .from('explanation_library')
  .select('*')
  .order('times_used', { ascending: false })

if (explError) {
  console.log('❌ Error querying explanation_library:', explError.message)
} else {
  console.log(`Total explanation sets: ${explanations?.length || 0}\n`)

  if (explanations && explanations.length > 0) {
    const bySubject = {}
    const bySkill = {}

    explanations.forEach(exp => {
      const subj = exp.subject_code || 'unknown'
      const skill = exp.skill_name || 'unknown'

      bySubject[subj] = (bySubject[subj] || 0) + 1
      bySkill[skill] = (bySkill[skill] || 0) + 1
    })

    console.log('Breakdown by Subject:')
    Object.entries(bySubject).forEach(([subj, count]) => {
      console.log(`  • ${subj}: ${count} explanation sets`)
    })

    console.log('\nMost Used Explanations (Top 10):')
    explanations.slice(0, 10).forEach((exp, i) => {
      console.log(`  ${i + 1}. ${exp.subject_code} - ${exp.skill_name}`)
      console.log(`     Problem: "${exp.problem_text?.substring(0, 50)}..."`)
      console.log(`     Used: ${exp.times_used} times`)

      // Check which levels exist
      const levels = []
      if (exp.level_1) levels.push('L1')
      if (exp.level_2) levels.push('L2')
      if (exp.level_3) levels.push('L3')
      if (exp.visual_explanation) levels.push('Visual')
      if (exp.story_explanation) levels.push('Story')
      if (exp.step_by_step) levels.push('Steps')
      console.log(`     Levels: ${levels.join(', ')}`)
    })

    // Check completeness
    console.log('\nCompleteness Check:')
    const incomplete = explanations.filter(exp =>
      !exp.level_1 || !exp.level_2 || !exp.level_3 ||
      !exp.visual_explanation || !exp.story_explanation || !exp.step_by_step
    )
    console.log(`  Complete (all 6 levels): ${explanations.length - incomplete.length}`)
    console.log(`  Incomplete: ${incomplete.length}`)

  } else {
    console.log('⚠️  NO CONTENT FOUND - explanation_library is empty!')
    console.log('   Every help request will call Claude API ($$$)')
  }
}

// 3. Mistake Patterns (targeted feedback for wrong answers)
console.log('\n\n━'.repeat(70))
console.log('❌ 3. MISTAKE PATTERNS (Targeted Feedback for Wrong Answers)\n')

const { data: mistakes, error: mistakeError } = await supabase
  .from('mistake_patterns')
  .select('*')
  .order('times_helped', { ascending: false })

if (mistakeError) {
  console.log('❌ Error querying mistake_patterns:', mistakeError.message)
} else {
  console.log(`Total mistake patterns: ${mistakes?.length || 0}\n`)

  if (mistakes && mistakes.length > 0) {
    const bySubject = {}

    mistakes.forEach(m => {
      const subj = m.subject_code || 'unknown'
      bySubject[subj] = (bySubject[subj] || 0) + 1
    })

    console.log('Breakdown by Subject:')
    Object.entries(bySubject).forEach(([subj, count]) => {
      console.log(`  • ${subj}: ${count} mistake patterns`)
    })

    console.log('\nMost Helpful Patterns (Top 10):')
    mistakes.slice(0, 10).forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.subject_code} - ${m.skill_id || 'General'}`)
      console.log(`     Problem: "${m.problem_text?.substring(0, 50)}..."`)
      console.log(`     Wrong answer: ${m.wrong_answer}`)
      console.log(`     Helped: ${m.times_helped} times`)
    })

    console.log('\nSample Mistake Feedback:')
    mistakes.slice(0, 3).forEach(m => {
      console.log(`\n  Problem: ${m.problem_text}`)
      console.log(`  Kid answered: "${m.wrong_answer}" (correct: "${m.correct_answer}")`)
      console.log(`  Why they chose it: ${m.why_kid_chose}`)
      console.log(`  Feedback: ${m.feedback?.substring(0, 100)}...`)
    })

  } else {
    console.log('⚠️  NO CONTENT FOUND - mistake_patterns is empty!')
    console.log('   Generic feedback will be used (less helpful)')
  }
}

// 4. Lesson Content (pre-generated lessons with all phases)
console.log('\n\n━'.repeat(70))
console.log('📖 4. LESSON CONTENT (Full Lesson Plans)\n')

const { data: lessons, error: lessonError } = await supabase
  .from('lesson_content')
  .select('skill_id, skill_name, subject_code')

if (lessonError) {
  console.log('❌ Error querying lesson_content:', lessonError.message)
} else {
  console.log(`Total lessons with content: ${lessons?.length || 0}\n`)

  if (lessons && lessons.length > 0) {
    const bySubject = {}

    lessons.forEach(l => {
      const subj = l.subject_code || 'unknown'
      bySubject[subj] = (bySubject[subj] || 0) + 1
    })

    console.log('Breakdown by Subject:')
    Object.entries(bySubject).forEach(([subj, count]) => {
      console.log(`  • ${subj}: ${count} lessons`)
    })

    console.log('\nSample Lessons:')
    lessons.slice(0, 5).forEach((l, i) => {
      console.log(`  ${i + 1}. ${l.subject_code} - ${l.skill_name}`)
    })

  } else {
    console.log('⚠️  NO CONTENT FOUND - lesson_content is empty!')
    console.log('   Lessons generated on-demand (slower, costs more)')
  }
}

// 5. Check for curriculum skills that need content
console.log('\n\n━'.repeat(70))
console.log('📊 5. COVERAGE ANALYSIS\n')

const { data: allSkills } = await supabase
  .from('curriculum_skills')
  .select('id, skill_name, subject_code, grade_level')

if (allSkills) {
  console.log(`Total curriculum skills: ${allSkills.length}`)

  const skillsWithContent = new Set(lessons?.map(l => l.skill_id) || [])
  const skillsWithExplanations = new Set(explanations?.map(e => e.skill_id)?.filter(Boolean) || [])

  console.log(`Skills with lesson content: ${skillsWithContent.size} (${Math.round(skillsWithContent.size / allSkills.length * 100)}%)`)
  console.log(`Skills with explanation sets: ${skillsWithExplanations.size} (${Math.round(skillsWithExplanations.size / allSkills.length * 100)}%)`)

  const skillsNeedingContent = allSkills.filter(s => !skillsWithContent.has(s.id))
  const skillsNeedingExplanations = allSkills.filter(s => !skillsWithExplanations.has(s.id))

  if (skillsNeedingContent.length > 0) {
    console.log(`\n⚠️  ${skillsNeedingContent.length} skills need lesson content`)
    console.log('\nSample skills needing content:')
    skillsNeedingContent.slice(0, 10).forEach((s, i) => {
      console.log(`  ${i + 1}. Grade ${s.grade_level} ${s.subject_code}: ${s.skill_name}`)
    })
  }

  if (skillsNeedingExplanations.length > 0) {
    console.log(`\n⚠️  ${skillsNeedingExplanations.length} skills need explanation sets`)
  }
}

// 6. Parent FAQ - check if we have pre-generated parent questions
console.log('\n\n━'.repeat(70))
console.log('👨‍👩‍👧 6. PARENT FAQ CONTENT\n')

const { data: parentQA } = await supabase
  .from('qa_library')
  .select('*')
  .eq('user_type', 'parent')

console.log(`Parent Q&A pairs: ${parentQA?.length || 0}`)

if (parentQA && parentQA.length > 0) {
  console.log('\nParent Questions:')
  parentQA.forEach((qa, i) => {
    console.log(`  ${i + 1}. ${qa.question_text}`)
  })
} else {
  console.log('⚠️  NO PARENT FAQ CONTENT - Every parent question calls Claude API')
}

// SUMMARY
console.log('\n\n' + '='.repeat(70))
console.log('📈 CLOSED LOOP COVERAGE SUMMARY\n')

const qaCount = qaLibrary?.length || 0
const explCount = explanations?.length || 0
const mistakeCount = mistakes?.length || 0
const lessonCount = lessons?.length || 0
const parentCount = parentQA?.length || 0
const totalSkills = allSkills?.length || 0

console.log('Current Content:')
console.log(`  ✓ Kid Q&A: ${qaCount} pre-answered questions`)
console.log(`  ✓ Help Explanations: ${explCount} multi-level sets`)
console.log(`  ✓ Mistake Patterns: ${mistakeCount} wrong answer feedbacks`)
console.log(`  ✓ Lesson Content: ${lessonCount} full lessons`)
console.log(`  ✓ Parent FAQ: ${parentCount} parent questions`)

console.log('\nGaps (needs generation):')

const gaps = []
if (qaCount === 0) gaps.push('🔴 Kid Q&A library is EMPTY')
if (explCount === 0) gaps.push('🔴 Explanation library is EMPTY')
if (mistakeCount === 0) gaps.push('🔴 Mistake patterns are EMPTY')
if (lessonCount < totalSkills * 0.5) gaps.push(`🟡 Only ${Math.round(lessonCount/totalSkills*100)}% of skills have lesson content`)
if (parentCount === 0) gaps.push('🔴 Parent FAQ is EMPTY')

if (gaps.length === 0) {
  console.log('  🎉 No gaps! Closed loop is complete!')
} else {
  gaps.forEach(gap => console.log(`  ${gap}`))
}

console.log('\n💰 Cost Savings Estimate:')
const totalContent = qaCount + (explCount * 6) + mistakeCount + parentCount
const estimatedUses = totalContent * 10 // Conservative: each used 10x
const savingsPerUse = 0.02
const totalSavings = estimatedUses * savingsPerUse

console.log(`  Pre-generated content pieces: ${totalContent}`)
console.log(`  Estimated uses (10x each): ${estimatedUses}`)
console.log(`  Savings per use: $${savingsPerUse}`)
console.log(`  Total estimated savings: $${totalSavings.toFixed(2)}`)

console.log('\n' + '='.repeat(70))
console.log('\n✅ Audit complete!\n')
