const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllData() {
  // Check all syllabi
  const { data: syllabi } = await supabase.from('scanned_homework')
    .select('id, category, scanned_at, notes')
    .eq('category', 'syllabus')
    .order('scanned_at', { ascending: false });

  console.log('📚 Total syllabi found:', syllabi?.length || 0);
  syllabi?.forEach((s, i) => {
    console.log(`\n${i+1}. ID: ${s.id.substring(0, 8)}...`);
    console.log('   Scanned:', s.scanned_at);
    console.log('   Text preview:', s.notes?.substring(0, 80));
  });

  // Check ALL lessons
  const { data: allLessons } = await supabase.from('daily_schedule')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15);

  console.log('\n\n📅 Total lessons in daily_schedule:', allLessons?.length || 0);
  allLessons?.forEach((l, i) => {
    console.log(`\n${i+1}. ${l.title}`);
    console.log('   Date:', l.date);
    console.log('   Child ID:', l.child_id?.substring(0, 8));
    console.log('   Subject:', l.subject_code);
    console.log('   From syllabus:', l.from_syllabus);
    console.log('   Description:', l.description?.substring(0, 60));
  });

  // Check for Colt's lessons specifically
  const { data: coltLessons } = await supabase.from('daily_schedule')
    .select('*')
    .eq('child_id', '8152f135-184f-423e-9bc4-17bb1abc22c4')
    .order('date', { ascending: true });

  console.log(`\n\n🎯 Lessons for Colt Hayward: ${coltLessons?.length || 0}`);
  coltLessons?.forEach((l, i) => {
    console.log(`${i+1}. [${l.date}] ${l.title}`);
  });
}

checkAllData();
