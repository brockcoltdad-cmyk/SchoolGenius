import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Checking actual table schemas...\n')

// Get one skill to see what columns exist
const { data: oneSkill, error: skillError } = await supabase
  .from('curriculum_skills')
  .select('*')
  .limit(1)

console.log('curriculum_skills columns:')
if (skillError) {
  console.log('Error:', skillError)
} else if (oneSkill && oneSkill[0]) {
  console.log(Object.keys(oneSkill[0]))
  console.log('\nSample skill:', oneSkill[0])
}

// Get one explanation to see what columns exist
const { data: oneExpl, error: explError } = await supabase
  .from('explanation_library')
  .select('*')
  .limit(1)

console.log('\n\nexplanation_library columns:')
if (explError) {
  console.log('Error:', explError)
} else if (oneExpl && oneExpl[0]) {
  console.log(Object.keys(oneExpl[0]))
}
