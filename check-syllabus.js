const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSyllabus() {
  // Check scanned_homework for syllabus
  const { data: syllabi, error: syllabusError } = await supabase
    .from('scanned_homework')
    .select('*')
    .eq('category', 'syllabus')
    .order('scanned_at', { ascending: false })
    .limit(1);

  if (syllabusError) {
    console.log('Error checking syllabus:', syllabusError.message);
    return;
  }

  if (!syllabi || syllabi.length === 0) {
    console.log('❌ No syllabus found in database');
    return;
  }

  const syllabus = syllabi[0];
  console.log('\n✅ Latest syllabus found:');
  console.log('ID:', syllabus.id);
  console.log('Subject:', syllabus.subject);
  console.log('Scanned at:', syllabus.scanned_at);
  console.log('\nExtracted text length:', syllabus.notes?.length || 0);
  console.log('First 500 chars of extracted text:');
  console.log(syllabus.notes?.substring(0, 500));
  console.log('\nAI Summary:', syllabus.ai_analysis);

  // Check if any prep lessons were created
  console.log('\n\nChecking for prep lessons in daily_schedule...');
  const { data: lessons, error: lessonError } = await supabase
    .from('daily_schedule')
    .select('*')
    .eq('child_id', '8152f135-184f-423e-9bc4-17bb1abc22c4')
    .eq('from_syllabus', true)
    .order('created_at', { ascending: false });

  if (lessonError) {
    console.log('Error checking lessons:', lessonError.message);
    return;
  }

  if (!lessons || lessons.length === 0) {
    console.log('❌ No prep lessons found in daily_schedule');
  } else {
    console.log(`✅ Found ${lessons.length} prep lessons:`);
    lessons.forEach((lesson, i) => {
      console.log(`\n${i + 1}. ${lesson.title}`);
      console.log('   Date:', lesson.date);
      console.log('   Subject:', lesson.subject_code);
      console.log('   Description:', lesson.description?.substring(0, 100));
    });
  }
}

checkSyllabus();
