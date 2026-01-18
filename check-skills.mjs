import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error, count } = await supabase
  .from('curriculum_skills')
  .select('*', { count: 'exact', head: true })

console.log('Curriculum Skills Count:', count)
console.log('Error:', error?.message || 'None')
