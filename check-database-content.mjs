// Check what content actually exists in the database
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

console.log('\n🔍 CHECKING DATABASE CONTENT\n')
console.log('=' .repeat(70))

// Check parent_help_articles
console.log('\n📋 Parent Help Articles:')
const { data: parentArticles, error: parentError } = await supabase
  .from('parent_help_articles')
  .select('*')

if (parentError) {
  console.log(`   ❌ Error: ${parentError.message}`)
} else {
  console.log(`   Total: ${parentArticles?.length || 0}`)
  if (parentArticles && parentArticles.length > 0) {
    console.log('\n   Sample articles:')
    parentArticles.slice(0, 5).forEach((a, i) => {
      console.log(`   ${i + 1}. ${a.question_pattern}`)
    })

    // Check for duplicates
    const questions = parentArticles.map(a => a.question_pattern)
    const uniqueQuestions = new Set(questions)
    if (questions.length !== uniqueQuestions.size) {
      console.log(`\n   ⚠️  Duplicates found: ${questions.length - uniqueQuestions.size}`)
    }
  }
}

// Check qa_library
console.log('\n👦 Kid Q&A Library:')
const { data: kidQa, error: kidError } = await supabase
  .from('qa_library')
  .select('*')

if (kidError) {
  console.log(`   ❌ Error: ${kidError.message}`)
} else {
  console.log(`   Total: ${kidQa?.length || 0}`)
  if (kidQa && kidQa.length > 0) {
    console.log('\n   Sample Q&As:')
    kidQa.slice(0, 5).forEach((qa, i) => {
      console.log(`   ${i + 1}. ${qa.question_text}`)
    })
  }
}

// Check explanation_library
console.log('\n🆘 Explanation Library:')
const { data: explanations, error: explError } = await supabase
  .from('explanation_library')
  .select('skill_id, skill_name, subject_code')

if (explError) {
  console.log(`   ❌ Error: ${explError.message}`)
} else {
  console.log(`   Total explanation sets: ${explanations?.length || 0}`)

  if (explanations && explanations.length > 0) {
    const bySubject = {}
    explanations.forEach(e => {
      bySubject[e.subject_code] = (bySubject[e.subject_code] || 0) + 1
    })

    console.log('\n   By subject:')
    Object.entries(bySubject).forEach(([subj, count]) => {
      console.log(`     ${subj}: ${count}`)
    })
  }
}

// Check mistake_patterns
console.log('\n❌ Mistake Patterns:')
const { data: mistakes, error: mistakeError } = await supabase
  .from('mistake_patterns')
  .select('*')

if (mistakeError) {
  console.log(`   ❌ Error: ${mistakeError.message}`)
} else {
  console.log(`   Total: ${mistakes?.length || 0}`)
}

console.log('\n' + '=' .repeat(70) + '\n')
