const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use the ANON key like the browser does
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQuery() {
  const kidId = 'b975e8f3-b26c-4c64-9a40-b6b64809bbed';

  console.log('Testing queries that the syllabus page makes...\n');

  // Test syllabus doc query
  const { data: syllabusDoc, error: syllabusError } = await supabase
    .from('scanned_homework')
    .select('id')
    .eq('child_id', kidId)
    .eq('category', 'syllabus')
    .order('scanned_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log('1. Syllabus Document Query:');
  if (syllabusError) {
    console.log('   ❌ Error:', syllabusError.message);
  } else {
    console.log('   ✅ Syllabus found:', !!syllabusDoc);
    if (syllabusDoc) console.log('   ID:', syllabusDoc.id);
  }

  // Test lessons query
  const { data: lessons, error: lessonError } = await supabase
    .from('daily_schedule')
    .select('*')
    .eq('child_id', kidId)
    .eq('from_syllabus', true)
    .order('date', { ascending: true });

  console.log('\n2. Daily Schedule Lessons Query:');
  if (lessonError) {
    console.log('   ❌ Error:', lessonError.message);
  } else {
    console.log('   ✅ Lessons found:', lessons?.length || 0);
    if (lessons && lessons.length > 0) {
      console.log('\n   First 3 lessons:');
      lessons.slice(0, 3).forEach((l, i) => {
        console.log(`   ${i+1}. [${l.date}] ${l.title}`);
      });
    }
  }
}

testQuery();
