const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function analyzeSkills() {
  const placeholders = [
    { standard: 'MATH.G0', subject: 'math' },
    { standard: 'MATH.G2', subject: 'math' },
    { standard: 'READING.G0', subject: 'reading' },
    { standard: 'READING.G1', subject: 'reading' },
    { standard: 'WRITING.G0', subject: 'writing' },
    { standard: 'WRITING.G2', subject: 'writing' }
  ];

  for (const p of placeholders) {
    console.log('\n=== ' + p.standard + ' ===');

    const { data, error } = await supabase
      .from('practice_problems')
      .select('skill, grade')
      .eq('standard', p.standard)
      .limit(10000);

    if (error) {
      console.log('Error:', error.message);
      continue;
    }

    // Group by skill
    const skillCounts = {};
    data.forEach(row => {
      const key = 'Grade ' + row.grade + ' | ' + row.skill;
      skillCounts[key] = (skillCounts[key] || 0) + 1;
    });

    console.log('Total problems:', data.length);
    console.log('\nSkills breakdown:');
    Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([skill, count]) => {
        console.log('  ' + skill + ': ' + count);
      });
  }
}

analyzeSkills();
