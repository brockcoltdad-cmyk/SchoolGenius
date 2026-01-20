const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function fullAnalysis() {
  console.log('=== STANDARDS ANALYSIS BY SUBJECT ===\n');

  const subjects = ['math', 'reading', 'writing', 'spelling', 'typing', 'coding'];

  for (const subject of subjects) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('standard, grade, skill')
      .eq('subject', subject)
      .limit(5000);

    if (error) {
      console.log(subject.toUpperCase() + ': Error -', error.message);
      continue;
    }

    // Group by standard
    const standardCounts = {};
    data.forEach(p => {
      const std = p.standard || 'NULL';
      if (standardCounts[std] === undefined) {
        standardCounts[std] = { count: 0, grades: new Set(), skills: new Set() };
      }
      standardCounts[std].count++;
      standardCounts[std].grades.add(p.grade);
      standardCounts[std].skills.add(p.skill);
    });

    console.log('\n' + subject.toUpperCase() + ' (' + data.length + ' problems sampled):');

    // Separate placeholders from real
    const entries = Object.entries(standardCounts);
    const placeholders = entries.filter(([std]) =>
      std === 'NULL' || std.match(/^(MATH|READING|WRITING|SPELLING|TYPING|CODING)\.G[0-9]+$/)
    );
    const real = entries.filter(([std]) =>
      std !== 'NULL' && !std.match(/^(MATH|READING|WRITING|SPELLING|TYPING|CODING)\.G[0-9]+$/)
    );

    if (placeholders.length > 0) {
      console.log('  NEEDS ALIGNMENT:');
      placeholders.sort((a,b) => b[1].count - a[1].count).forEach(([std, info]) => {
        console.log('    ' + std + ': ' + info.count + ' (grades: ' + [...info.grades].sort((a,b)=>a-b).join(',') + ')');
        console.log('      Skills: ' + [...info.skills].slice(0, 3).join(', '));
      });
    }

    console.log('  Real standards: ' + real.length + ' unique codes');
    real.sort((a,b) => b[1].count - a[1].count).slice(0, 5).forEach(([std, info]) => {
      console.log('    ' + std + ': ' + info.count);
    });
  }

  // Grand totals
  console.log('\n\n=== GRAND SUMMARY ===');

  const { count: totalCount } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true });

  // Count placeholders across all
  let totalPlaceholders = 0;
  for (const placeholder of ['MATH.G0', 'MATH.G1', 'MATH.G2', 'READING.G0', 'READING.G1', 'WRITING.G0', 'SPELLING.G0']) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('standard', placeholder);
    if (count > 0) {
      console.log(placeholder + ': ' + count + ' problems');
      totalPlaceholders += count;
    }
  }

  // Count NULLs
  const { count: nullCount } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('standard', null);

  console.log('NULL: ' + (nullCount || 0) + ' problems');
  totalPlaceholders += (nullCount || 0);

  console.log('\nTotal problems:', totalCount);
  console.log('Problems needing alignment:', totalPlaceholders);
  console.log('Already aligned:', totalCount - totalPlaceholders);
}

fullAnalysis();
