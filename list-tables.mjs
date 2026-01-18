import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function listTables() {
  console.log('Checking tables in database...\n')

  const tables = [
    'lesson_rule_teaching', 'lesson_demo', 'lesson_guided_practice',
    'lesson_practice_problems', 'lesson_check_questions', 'lesson_monthly_review',
    'lessons', 'practice_problems', 'questions', 'content', 'curriculum',
    'knowledge', 'notes', 'conversations', 'messages', 'users', 'profiles',
    'code_library', 'backups', 'lesson_backups', 'gradual_release_items',
    'i_do', 'we_do', 'you_do', 'check_question', 'rule_teaching', 'demo',
    'guided_practice', 'independent_practice', 'quiz', 'monthly_review'
  ]

  console.log('Tables found:\n')
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (!error) console.log(`✓ ${table}: ${count} rows`)
  }
}

listTables().catch(console.error)
