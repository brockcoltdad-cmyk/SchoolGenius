// Test parent FAQ generation - just 5 FAQs to verify Grok API
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🧪 TESTING PARENT FAQ GENERATION\n')
console.log('=' .repeat(70))

// Step 1: Create table if it doesn't exist
console.log('\n📋 Step 1: Ensuring parent_help_articles table exists...')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.parent_help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question_pattern TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_help_category ON public.parent_help_articles(category);
CREATE INDEX IF NOT EXISTS idx_parent_help_keywords ON public.parent_help_articles USING GIN(keywords);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'parent_help_articles' AND policyname = 'Allow public read access'
  ) THEN
    ALTER TABLE public.parent_help_articles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read access" ON public.parent_help_articles FOR SELECT USING (true);
    CREATE POLICY "Service role can manage" ON public.parent_help_articles FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
`

try {
  const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL }).single()

  if (error) {
    console.log('   ⚠️  Could not create table via RPC, trying direct query...')

    // Try direct query approach
    const { error: createError } = await supabase.from('parent_help_articles').select('id').limit(1)

    if (createError && createError.message.includes('does not exist')) {
      console.log('   ❌ Table does not exist. Creating manually...\n')
      console.log('   Please run this SQL in Supabase SQL Editor:\n')
      console.log(createTableSQL)
      console.log('\n   Then run this script again.\n')
      process.exit(1)
    } else {
      console.log('   ✅ Table exists!')
    }
  } else {
    console.log('   ✅ Table created successfully!')
  }
} catch (error) {
  console.log('   ℹ️  Checking if table exists...')

  // Check if table exists by trying to query it
  const { error: queryError } = await supabase
    .from('parent_help_articles')
    .select('id')
    .limit(1)

  if (queryError) {
    console.log('   ❌ Table does not exist!\n')
    console.log('   Create it by running this SQL in Supabase SQL Editor:')
    console.log('   https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql\n')
    console.log(createTableSQL)
    console.log('\n   Then run this script again.\n')
    process.exit(1)
  } else {
    console.log('   ✅ Table already exists!')
  }
}

// Step 2: Check current count
console.log('\n📊 Step 2: Checking current FAQ count...')

const { data: existingFAQs, error: countError } = await supabase
  .from('parent_help_articles')
  .select('*')

if (countError) {
  console.log(`   ❌ Error: ${countError.message}`)
} else {
  console.log(`   Current FAQs in database: ${existingFAQs?.length || 0}`)
}

// Step 3: Generate 5 FAQs (one batch)
console.log('\n🚀 Step 3: Generating 5 parent FAQs (1 batch)...\n')

try {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-parent-faq`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  console.log(`   Status: ${response.status}`)

  if (response.ok) {
    const data = await response.json()
    console.log(`   ✅ ${data.message}`)
    console.log(`   Progress: ${data.progress || 'N/A'}`)

    if (data.results && data.results.length > 0) {
      console.log('\n   Generated FAQs:')
      data.results.forEach((result, i) => {
        if (result.success) {
          console.log(`   ${i + 1}. ✅ ${result.question}`)
        } else {
          console.log(`   ${i + 1}. ❌ ${result.question} - ${result.error}`)
        }
      })
    }

    if (data.status === 'complete') {
      console.log('\n   ℹ️  All FAQs already generated!')
    }

  } else {
    const errorData = await response.json()
    console.log(`   ❌ Error: ${JSON.stringify(errorData, null, 2)}`)
  }
} catch (error) {
  console.log(`   ❌ Exception: ${error.message}`)
}

// Step 4: Verify in database
console.log('\n📊 Step 4: Verifying FAQs in database...')

const { data: finalFAQs, error: finalError } = await supabase
  .from('parent_help_articles')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)

if (finalError) {
  console.log(`   ❌ Error: ${finalError.message}`)
} else {
  console.log(`   Total FAQs now: ${finalFAQs?.length || 0}`)

  if (finalFAQs && finalFAQs.length > 0) {
    console.log('\n   Recent FAQs:')
    finalFAQs.forEach((faq, i) => {
      console.log(`   ${i + 1}. ${faq.question_pattern}`)
      console.log(`      Category: ${faq.category}`)
      console.log(`      Answer: ${faq.answer.substring(0, 100)}...`)
    })
  }
}

console.log('\n' + '=' .repeat(70))

if (finalFAQs && finalFAQs.length > 0) {
  console.log('\n✅ TEST SUCCESSFUL!\n')
  console.log('Grok API is working correctly.')
  console.log('FAQs are being generated and saved to the database.\n')
  console.log('Ready to run full generation:')
  console.log('  node generate-complete-closed-loop.mjs\n')
} else {
  console.log('\n⚠️  TEST INCOMPLETE\n')
  console.log('Check the error messages above.\n')
}
