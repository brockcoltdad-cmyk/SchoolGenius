import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Comprehensive list of EVERY possible table name
const allPossibleTables = [
  // Content generation
  'lesson_content', 'lessons', 'skills', 'skill_content', 'skill_explanations',
  'practice_problems', 'math_problems', 'problems', 'questions', 'exercises',
  'qa_library', 'content', 'curriculum', 'standards', 'generated_content',
  'content_library', 'content_cache', 'ai_content', 'grok_content',

  // Seeding tables
  'kid_stuck_responses', 'subject_analogies', 'gigi_personality',
  'transition_phrases', 'achievement_celebrations', 'greeting_messages',
  'return_messages', 'parent_struggle_guides', 'common_mistakes',

  // Spelling/Reading
  'spelling_words', 'spelling_lists', 'sight_words', 'vocabulary',
  'reading_passages', 'comprehension_questions', 'reading_content',

  // Math
  'math_facts', 'multiplication_facts', 'addition_facts', 'math_content',

  // Coding/Typing
  'coding_challenges', 'coding_lessons', 'typing_lessons', 'typing_content',

  // Rules/Teaching
  'rule_teaching_scripts', 'demo_problems', 'guided_practice',
  'rule_quizzes', 'weekly_tests', 'monthly_reviews', 'teaching_scripts',
  'walkthroughs', 'explanations',

  // User data
  'families', 'children', 'learning_profiles', 'progress', 'user_progress',
  'achievements', 'coins', 'streaks', 'sessions', 'users',

  // Shop/rewards
  'themes', 'prizes', 'rewards', 'purchases', 'shop_items',

  // Seeding management
  'seeding_progress', 'seeding_log', 'generation_queue', 'batch_progress',
  'worker_status', 'generation_status', 'seeding_results', 'batch_results',
  'grok_results', 'api_logs',

  // Other
  'audit_log', 'error_log', 'analytics', 'usage', 'feedback', 'reports',

  // Age-grouped content
  'k2_content', 'grades35_content', 'grades68_content', 'grades912_content',

  // Intervention content
  'intervention_content', 'tier1_content', 'tier2_content', 'tier3_content',

  // Generic names
  'items', 'records', 'data', 'entries', 'cache', 'results', 'output'
]

console.log('='.repeat(70))
console.log('COMPREHENSIVE DATABASE SCAN - FINDING ALL CONTENT')
console.log('='.repeat(70))
console.log('')

let grandTotal = 0
const found = []

for (const t of allPossibleTables) {
  try {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error === null && count !== null && count > 0) {
      found.push({ table: t, count })
      grandTotal += count
    }
  } catch (e) {}
}

// Sort by count descending
found.sort((a, b) => b.count - a.count)

console.log('ALL TABLES WITH DATA:')
console.log('-'.repeat(70))
for (const f of found) {
  console.log(f.table.padEnd(35) + ': ' + f.count.toLocaleString().padStart(10))
}
console.log('-'.repeat(70))
console.log('TOTAL TABLES FOUND:'.padEnd(35) + ': ' + found.length.toString().padStart(10))
console.log('GRAND TOTAL ITEMS:'.padEnd(35) + ': ' + grandTotal.toLocaleString().padStart(10))
console.log('')
console.log('='.repeat(70))
