import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const tableNames = [
  'lessons', 'skills', 'qa_library', 'practice_problems', 'questions',
  'kid_stuck_responses', 'subject_analogies', 'gigi_personality',
  'transition_phrases', 'achievement_celebrations', 'greeting_messages',
  'return_messages', 'parent_struggle_guides', 'rule_teaching_scripts',
  'demo_problems', 'guided_practice', 'rule_quizzes', 'weekly_tests',
  'monthly_reviews', 'content', 'curriculum', 'standards', 'skill_explanations',
  'learning_profiles', 'families', 'children', 'prizes', 'themes',
  'seeding_progress', 'seeding_log', 'generation_queue', 'batch_progress'
]

console.log('DATABASE TABLE COUNTS:')
console.log('='.repeat(50))

let total = 0
for (const t of tableNames) {
  try {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error === null && count !== null) {
      console.log(t.padEnd(30) + ': ' + count.toLocaleString())
      total += count
    }
  } catch (e) {}
}

console.log('='.repeat(50))
console.log('TOTAL ITEMS:'.padEnd(30) + ': ' + total.toLocaleString())
