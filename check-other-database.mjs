import { createClient } from '@supabase/supabase-js'

// Check the OTHER Supabase database (igalezzaolbrlsgilfap)
// Set OTHER_SUPABASE_URL and OTHER_SUPABASE_KEY env vars to use this script
const supabase = createClient(
  process.env.OTHER_SUPABASE_URL,
  process.env.OTHER_SUPABASE_KEY
)

console.log('='.repeat(60))
console.log('CHECKING SECOND DATABASE: igalezzaolbrlsgilfap.supabase.co')
console.log('='.repeat(60))

const tables = [
  'lessons', 'skills', 'questions', 'problems', 'content',
  'kid_stuck_responses', 'subject_analogies', 'gigi_personality',
  'spelling_words', 'math_facts', 'practice_problems', 'explanations',
  'seeding_progress', 'generation_queue', 'curriculum', 'standards'
]

let total = 0
for (const t of tables) {
  try {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    if (error === null && count !== null && count > 0) {
      console.log(t.padEnd(25) + ': ' + count.toLocaleString())
      total += count
    }
  } catch (e) {}
}

if (total === 0) {
  console.log('No accessible tables with data found in this database.')
  console.log('(May need service role key to access)')
} else {
  console.log('='.repeat(60))
  console.log('TOTAL: ' + total.toLocaleString())
}
