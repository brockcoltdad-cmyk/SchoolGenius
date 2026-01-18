// Check if practice_problems table exists and has correct columns
// Per CCOS Rule 13: DATABASE CHECK before any content generation

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
  console.log('='.repeat(60));
  console.log('PRACTICE_PROBLEMS TABLE CHECK');
  console.log('Per CCOS Rule 13: Database Check Before Seeding');
  console.log('='.repeat(60));

  // Step 1: Check if table exists by querying it
  console.log('\n1. Checking if practice_problems table exists...');
  const { data, error } = await supabase
    .from('practice_problems')
    .select('*')
    .limit(1);

  if (error) {
    console.log('   ERROR: Table may not exist or access denied');
    console.log('   Message:', error.message);
    return false;
  }

  console.log('   SUCCESS: Table exists and is accessible');

  // Step 2: Get current count by subject
  console.log('\n2. Current record counts by subject:');
  const { data: allRecords } = await supabase
    .from('practice_problems')
    .select('subject, grade');

  const counts = {};
  allRecords?.forEach(r => {
    const key = `${r.subject} (Grade ${r.grade})`;
    counts[key] = (counts[key] || 0) + 1;
  });

  if (Object.keys(counts).length === 0) {
    console.log('   (No records in table yet)');
  } else {
    Object.entries(counts).sort().forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });
    console.log(`   TOTAL: ${allRecords?.length || 0}`);
  }

  // Step 3: Check coding specifically
  console.log('\n3. Coding records specifically:');
  const { data: codingRecords, count: codingCount } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact' })
    .eq('subject', 'coding');

  console.log(`   Coding items in DB: ${codingCount || 0}`);
  console.log(`   Target: 12,000`);
  console.log(`   Remaining: ${12000 - (codingCount || 0)}`);

  // Step 4: Test insert (then delete)
  console.log('\n4. Testing insert capability...');
  const testId = 'TEST-DELETE-ME-' + Date.now();
  const { error: insertError } = await supabase
    .from('practice_problems')
    .insert({
      id: testId,
      subject: 'coding',
      grade: 0,
      skill: 'test',
      standard: 'TEST',
      question: 'Test question',
      answer: 'Test answer',
      tier1: { teach: 'test', steps: [] },
      tier2: { teach: 'test', steps: [] }
    });

  if (insertError) {
    console.log('   ERROR: Cannot insert records');
    console.log('   Message:', insertError.message);
    return false;
  }

  console.log('   SUCCESS: Insert works');

  // Clean up test record
  await supabase.from('practice_problems').delete().eq('id', testId);
  console.log('   Test record cleaned up');

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RESULT: TABLE READY FOR CODING CONTENT GENERATION');
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('- Use templates in library/templates/ to generate content');
  console.log('- Each grade needs ~1,500 items (12,000 total)');
  console.log('- Follow CCOS protocol for content generation');

  return true;
}

checkTable().catch(console.error);
