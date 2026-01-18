import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

console.log('='.repeat(70))
console.log('FULL DATABASE AUDIT - EVERYTHING THAT WAS GENERATED')
console.log('='.repeat(70))
console.log('')

async function auditTable(name) {
  const { count, error } = await supabase.from(name).select('*', { count: 'exact', head: true })
  if (error) return null

  // Get sample
  const { data: sample } = await supabase.from(name).select('*').limit(1)

  // Try to get date range
  let dateInfo = ''
  if (sample && sample[0]) {
    const cols = Object.keys(sample[0])
    const dateCol = cols.find(c => c.includes('created') || c.includes('date') || c.includes('_at'))
    if (dateCol) {
      const { data: oldest } = await supabase.from(name).select(dateCol).order(dateCol, { ascending: true }).limit(1)
      const { data: newest } = await supabase.from(name).select(dateCol).order(dateCol, { ascending: false }).limit(1)
      if (oldest && newest && oldest[0] && newest[0]) {
        dateInfo = `(${new Date(oldest[0][dateCol]).toLocaleDateString()} - ${new Date(newest[0][dateCol]).toLocaleDateString()})`
      }
    }
  }

  return { name, count, dateInfo, columns: (sample && sample[0]) ? Object.keys(sample[0]).length : 0 }
}

const allTables = [
  'spelling_words', 'kid_stuck_responses', 'math_problems', 'subject_analogies',
  'transition_phrases', 'gigi_personality', 'achievement_celebrations',
  'return_messages', 'greeting_messages', 'qa_library', 'achievements',
  'parent_struggle_guides', 'shop_items', 'lessons', 'themes', 'children',
  'common_mistakes', 'generation_queue', 'families', 'learning_profiles',
  'skill_explanations', 'demo_problems', 'guided_practice', 'rule_quizzes',
  'weekly_tests', 'monthly_reviews', 'reading_passages', 'vocabulary',
  'sight_words', 'math_facts', 'coding_challenges', 'typing_lessons'
]

let grandTotal = 0
const results = []

for (const t of allTables) {
  const result = await auditTable(t)
  if (result && result.count > 0) {
    results.push(result)
    grandTotal += result.count
  }
}

// Sort by count
results.sort((a, b) => b.count - a.count)

console.log('GENERATED CONTENT:')
console.log('-'.repeat(70))
for (const r of results) {
  const countStr = r.count.toLocaleString().padStart(8)
  console.log(`${r.name.padEnd(35)} ${countStr} items ${r.dateInfo}`)
}

console.log('-'.repeat(70))
console.log(`${'GRAND TOTAL'.padEnd(35)} ${grandTotal.toLocaleString().padStart(8)} items`)
console.log('')

// Estimate cost (rough: $0.001 per item average for Grok)
const estimatedCost = grandTotal * 0.001
console.log(`Estimated API cost: ~$${estimatedCost.toFixed(2)}`)
console.log('')
console.log('='.repeat(70))
