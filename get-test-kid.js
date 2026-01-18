const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getKid() {
  const { data: kids, error } = await supabase
    .from('children')
    .select('id, name, grade_level')
    .limit(5);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (!kids || kids.length === 0) {
    console.log('\n❌ No kids found in database.');
    console.log('\nCreate a kid first:');
    console.log('1. Go to: http://localhost:3000/family');
    console.log('2. Click "Add Child"');
    console.log('3. Fill in name and grade');
    return;
  }

  console.log('\n📋 Available Kids for Testing:\n');
  kids.forEach((kid, idx) => {
    console.log(`${idx + 1}. ${kid.name} (Grade ${kid.grade_level || '?'})`);
    console.log(`   ID: ${kid.id}`);
    console.log(`   Scan URL: http://localhost:3000/kid/${kid.id}/scan`);
    console.log(`   Syllabus URL: http://localhost:3000/kid/${kid.id}/syllabus\n`);
  });

  console.log('✅ Use any of the above IDs to test scanning!\n');
}

getKid();
