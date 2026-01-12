// Check if parent_help_articles table exists in Supabase
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('\n🔍 CHECKING TABLE EXISTENCE\n')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Try to list all tables using information_schema
console.log('Querying information_schema for tables...\n')

const { data, error } = await supabase
  .rpc('exec_sql', {
    sql: `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `
  })

if (error) {
  console.log('RPC not available, trying direct approach...\n')

  // List some known tables to verify connection
  const tables = ['qa_library', 'explanation_library', 'mistake_patterns', 'parent_help_articles']

  for (const table of tables) {
    const { data: testData, error: testError } = await supabase
      .from(table)
      .select('*')
      .limit(0)

    if (testError) {
      console.log(`❌ ${table}: ${testError.message}`)
    } else {
      console.log(`✅ ${table}: Accessible`)
    }
  }
} else {
  console.log('Tables in public schema:')
  console.log(data)
}

// Try inserting a test record directly
console.log('\n\n🧪 Testing direct insert to parent_help_articles...\n')

const testArticle = {
  category: 'test',
  question_pattern: 'Test question?',
  keywords: ['test'],
  answer: 'Test answer'
}

const { data: insertData, error: insertError } = await supabase
  .from('parent_help_articles')
  .insert(testArticle)
  .select()

if (insertError) {
  console.log(`❌ Insert failed: ${insertError.message}`)
  console.log(`Details: ${JSON.stringify(insertError, null, 2)}`)
} else {
  console.log('✅ Insert successful!')
  console.log(`Inserted record: ${JSON.stringify(insertData, null, 2)}`)

  // Clean up test record
  if (insertData && insertData.length > 0) {
    await supabase
      .from('parent_help_articles')
      .delete()
      .eq('id', insertData[0].id)
    console.log('✅ Test record cleaned up')
  }
}

console.log('\n')
