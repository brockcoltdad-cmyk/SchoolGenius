import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Extended list of possible table names
const tableNames = [
  // Core content
  'lessons', 'skills', 'skill_explanations', 'skill_content',
  'practice_problems', 'problems', 'questions', 'exercises',
  'qa_library', 'content', 'curriculum', 'standards',

  // Seeding tables
  'kid_stuck_responses', 'subject_analogies', 'gigi_personality',
  'transition_phrases', 'achievement_celebrations', 'greeting_messages',
  'return_messages', 'parent_struggle_guides', 'common_mistakes',

  // Rule/teaching content
  'rule_teaching_scripts', 'demo_problems', 'guided_practice',
  'rule_quizzes', 'weekly_tests', 'monthly_reviews',
  'teaching_scripts', 'walkthroughs', 'explanations',

  // User data
  'families', 'children', 'learning_profiles', 'progress',
  'achievements', 'coins', 'streaks', 'sessions',

  // Shop/rewards
  'themes', 'prizes', 'rewards', 'purchases', 'shop_items',

  // Seeding management
  'seeding_progress', 'seeding_log', 'generation_queue', 'batch_progress',
  'worker_status', 'generation_status',

  // Math specific
  'math_facts', 'multiplication_facts', 'addition_facts',
  'math_problems', 'math_lessons', 'math_skills',

  // Reading specific
  'reading_passages', 'comprehension_questions', 'vocabulary',
  'sight_words', 'reading_lessons', 'reading_skills',

  // Spelling
  'spelling_words', 'spelling_lists', 'spelling_rules',

  // Other
  'audit_log', 'error_log', 'analytics', 'usage'
]

console.log('CHECKING ALL POSSIBLE TABLES:')
console.log('='.repeat(60))

let total = 0
const found = []

for (const t of tableNames) {
  try {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error === null && count !== null) {
      found.push({ table: t, count })
      total += count
    }
  } catch (e) {}
}

// Sort by count descending
found.sort((a, b) => b.count - a.count)

for (const f of found) {
  console.log(f.table.padEnd(35) + ': ' + f.count.toLocaleString())
}

console.log('='.repeat(60))
console.log('TABLES FOUND:'.padEnd(35) + ': ' + found.length)
console.log('TOTAL ITEMS:'.padEnd(35) + ': ' + total.toLocaleString())
