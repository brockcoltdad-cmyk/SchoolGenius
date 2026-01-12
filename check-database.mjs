import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Checking database connection...\n')

// Check skills without is_active filter
const { data: allSkills, error: skillError } = await supabase
  .from('curriculum_skills')
  .select('id, skill_name, subject_code, grade_level, is_active')
  .order('grade_level', { ascending: true })
  .limit(10)

console.log(`Skills query error:`, skillError)
console.log(`Skills found: ${allSkills?.length || 0}`)

if (allSkills && allSkills.length > 0) {
  console.log(`\nFirst 5 skills:`)
  allSkills.slice(0, 5).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.subject_code} - ${s.skill_name}`)
    console.log(`     Grade: ${s.grade_level}, Active: ${s.is_active}`)
  })
}

// Check explanations
const { data: explanations, error: explError } = await supabase
  .from('explanation_library')
  .select('id, skill_id, skill_name')
  .limit(10)

console.log(`\nExplanations query error:`, explError)
console.log(`Explanations found: ${explanations?.length || 0}`)

if (explanations && explanations.length > 0) {
  console.log(`\nFirst 5 explanations:`)
  explanations.slice(0, 5).forEach((e, i) => {
    console.log(`  ${i + 1}. Skill ID: ${e.skill_id} - ${e.skill_name}`)
  })
}
