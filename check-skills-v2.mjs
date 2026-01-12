import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Checking skills and explanations...\n')

// Get all skills (without is_active filter)
const { data: skills, error: skillError } = await supabase
  .from('curriculum_skills')
  .select('id, skill_name, subject_code, grade_level, skill_code')
  .order('grade_level', { ascending: true })

if (skillError) {
  console.log('Error getting skills:', skillError)
  process.exit(1)
}

// Get all explanations with skill_id
const { data: explanations, error: explError } = await supabase
  .from('explanation_library')
  .select('skill_id')

if (explError) {
  console.log('Error getting explanations:', explError)
  process.exit(1)
}

const skillsWithExpl = new Set(
  explanations?.map(e => e.skill_id).filter(id => id !== null) || []
)

const skillsNeedingExpl = skills?.filter(s => !skillsWithExpl.has(s.id)) || []

console.log(`📊 Status:`)
console.log(`   Total skills: ${skills?.length || 0}`)
console.log(`   Skills with explanations: ${skillsWithExpl.size}`)
console.log(`   Skills needing explanations: ${skillsNeedingExpl.length}`)
console.log()

if (skillsNeedingExpl.length > 0) {
  console.log(`First 10 skills that need explanations:`)
  skillsNeedingExpl.slice(0, 10).forEach((s, i) => {
    console.log(`  ${i + 1}. [${s.skill_code}] ${s.subject_code} - ${s.skill_name} (Grade ${s.grade_level})`)
  })
  console.log()

  const estTime = Math.round(skillsNeedingExpl.length * 45 / 60)
  console.log(`⏱️  Estimated time to complete all: ~${estTime} minutes`)
  console.log(`   With batch size of 50: ~${Math.ceil(skillsNeedingExpl.length / 50)} runs needed`)
  console.log(`   Each run: ~40 minutes`)
}
