import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('Creating tables for seeding...\n')

// Kid stuck responses table
const createTable = `
CREATE TABLE IF NOT EXISTS kid_stuck_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL,
  response TEXT NOT NULL,
  response_tone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stuck_responses_lookup
  ON kid_stuck_responses(question_type, subject, age_group);
`

try {
  const { error } = await supabase.from('_sql').select('1').limit(1)

  console.log('⚠️  Note: Creating tables via Supabase dashboard SQL editor')
  console.log('Copy and paste this SQL into Supabase dashboard:\n')
  console.log(createTable)
  console.log('\nOr create table manually in Supabase dashboard.')
  console.log('Table name: kid_stuck_responses')
  console.log('Columns: id (uuid), question_type (text), subject (text), age_group (text), response (text), response_tone (text), created_at (timestamp)')

} catch (err) {
  console.error('Error:', err)
}
