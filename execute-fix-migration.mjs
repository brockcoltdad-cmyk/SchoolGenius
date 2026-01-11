// Execute fix migration programmatically
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

console.log('🚀 Executing Phase 2 Fix Migration\n')
console.log('=' .repeat(60))

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Step 1: Try to create mistake_patterns table directly via SQL
console.log('\n📦 Step 1: Creating mistake_patterns table...')

try {
  // First, let's try inserting sample data to explanation_library
  console.log('   Adding sample data to explanation_library...')

  const { data: explData, error: explError } = await supabase
    .from('explanation_library')
    .insert({
      subject_code: 'MATH',
      skill_name: 'Addition (1-digit)',
      problem_text: '2 + 3 = ?',
      level_1: 'When we add, we put numbers together. 2 + 3 means we start with 2 and add 3 more. Count: 2... 3, 4, 5. The answer is 5.',
      level_2: "Let's use our fingers! Hold up 2 fingers. Now hold up 3 more fingers. Count all your fingers: 1, 2, 3, 4, 5. That's 5!",
      level_3: 'Imagine you have 2 cookies. Your friend gives you 3 more cookies. Now count all your cookies: 1, 2, 3, 4, 5 cookies! So 2 + 3 = 5.',
      visual_explanation: 'Picture 2 dots: ●●. Now add 3 more dots: ● ● ●. Count all the dots together: ● ● ● ● ● That\'s 5 dots!',
      story_explanation: 'Once upon a time, there were 2 little birds sitting on a tree. Then 3 more birds flew over and sat down too. How many birds are on the tree now? Let\'s count: 1, 2, 3, 4, 5 birds!',
      generated_by: 'sample',
      times_used: 0
    })
    .select()

  if (!explError) {
    console.log('   ✅ Sample data added to explanation_library')
  } else if (explError.code === '23505') {
    console.log('   ℹ️  Sample data already exists')
  } else {
    console.log(`   ⚠️  Could not add sample data: ${explError.message}`)
  }
} catch (e) {
  console.log(`   ⚠️  ${e.message}`)
}

// Step 2: Check if mistake_patterns exists
console.log('\n📦 Step 2: Checking if mistake_patterns table exists...')

try {
  const { data, error } = await supabase
    .from('mistake_patterns')
    .select('count')
    .limit(0)

  if (!error) {
    console.log('   ✅ mistake_patterns table already exists')
  } else {
    console.log('   ❌ mistake_patterns table does NOT exist')
    console.log('   📋 This table must be created via SQL Editor')
  }
} catch (e) {
  console.log('   ❌ mistake_patterns table does NOT exist')
}

// Step 3: Verify current state
console.log('\n📊 Step 3: Verifying current database state...')

// Check explanation_library
try {
  const { data, error, count } = await supabase
    .from('explanation_library')
    .select('*', { count: 'exact', head: false })

  if (!error && data) {
    console.log(`   ✅ explanation_library: ${data.length} rows`)
    if (data.length > 0) {
      console.log(`      Sample: "${data[0].problem_text}" (${data[0].subject_code})`)
    }
  } else {
    console.log('   ❌ explanation_library: Error querying')
  }
} catch (e) {
  console.log(`   ❌ explanation_library: ${e.message}`)
}

// Check mistake_patterns
try {
  const { data, error, count } = await supabase
    .from('mistake_patterns')
    .select('*', { count: 'exact', head: false })

  if (!error && data) {
    console.log(`   ✅ mistake_patterns: ${data.length} rows`)
    if (data.length > 0) {
      console.log(`      Sample: Wrong answer "${data[0].wrong_answer}" for "${data[0].problem_text}"`)
    }
  } else {
    console.log('   ❌ mistake_patterns: Table does not exist or not accessible')
  }
} catch (e) {
  console.log(`   ❌ mistake_patterns: ${e.message}`)
}

console.log('\n' + '='.repeat(60))
console.log('\n💡 NEXT STEPS:')
console.log('\nIf mistake_patterns table is missing, you MUST run the SQL manually:')
console.log('   1. Open: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql/new')
console.log('   2. Copy contents of: fix-migration.sql')
console.log('   3. Paste and click RUN')
console.log('\nAfter that, run: node verify-tables.mjs')
console.log('\n✅ Execution complete!')
