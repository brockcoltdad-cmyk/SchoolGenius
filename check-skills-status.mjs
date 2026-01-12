import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data: skills } = await supabase
  .from('curriculum_skills')
  .select('id, skill_name, subject_code, grade_level')
  .eq('is_active', true)
  .order('grade_level', { ascending: true })

const { data: explanations } = await supabase
  .from('explanation_library')
  .select('skill_id')

const hasExpl = new Set(explanations?.map(e => e.skill_id).filter(Boolean))
const needExpl = skills?.filter(s => !hasExpl.has(s.id))

console.log(`Total skills: ${skills?.length || 0}`)
console.log(`Have explanations: ${hasExpl.size}`)
console.log(`Need explanations: ${needExpl?.length || 0}`)

if (needExpl && needExpl.length > 0) {
  console.log(`\nFirst 10 skills needing explanations:`)
  needExpl.slice(0, 10).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.subject_code} - ${s.skill_name} (Grade ${s.grade_level})`)
  })
}
