const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function finalReport() {
  console.log('=== ARIZONA STANDARDS ALIGNMENT - FINAL REPORT ===\n');

  const subjects = ['math', 'reading', 'writing', 'spelling', 'typing', 'coding'];

  for (const subject of subjects) {
    const { data } = await supabase
      .from('practice_problems')
      .select('standard, grade')
      .eq('subject', subject)
      .limit(50000);

    if (!data || data.length === 0) continue;

    // Group by standard
    const standardCounts = {};
    data.forEach(p => {
      const std = p.standard || 'NULL';
      standardCounts[std] = (standardCounts[std] || 0) + 1;
    });

    // Check for placeholders
    const placeholders = Object.keys(standardCounts).filter(s =>
      s === 'NULL' || s.match(/^(MATH|READING|WRITING|SPELLING|TYPING|CODING)\.G[0-9]+$/)
    );

    const realStandards = Object.keys(standardCounts).filter(s =>
      s !== 'NULL' && !s.match(/^(MATH|READING|WRITING|SPELLING|TYPING|CODING)\.G[0-9]+$/)
    );

    console.log('\n' + subject.toUpperCase());
    console.log('─'.repeat(40));

    if (placeholders.length > 0) {
      console.log('⚠️  NEEDS ATTENTION:');
      placeholders.forEach(p => {
        console.log('   ' + p + ': ' + standardCounts[p]);
      });
    } else {
      console.log('✓ All problems aligned');
    }

    console.log('\nStandards in use (' + realStandards.length + ' unique):');
    Object.entries(standardCounts)
      .filter(([std]) => !placeholders.includes(std))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .forEach(([std, count]) => {
        console.log('   ' + std + ': ' + count);
      });
  }

  // Summary counts
  console.log('\n\n=== SUMMARY ===');
  console.log('─'.repeat(40));

  const { count: totalProblems } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true });

  let placeholderCount = 0;
  const placeholderTypes = ['MATH.G0', 'MATH.G1', 'MATH.G2', 'READING.G0', 'READING.G1', 'WRITING.G0', 'WRITING.G2'];

  for (const p of placeholderTypes) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('standard', p);
    if (count > 0) {
      placeholderCount += count;
    }
  }

  const { count: nullCount } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('standard', null);

  placeholderCount += (nullCount || 0);

  console.log('Total problems: ' + totalProblems);
  console.log('Aligned to AZCCRS: ' + (totalProblems - placeholderCount));
  console.log('Still need alignment: ' + placeholderCount);
  console.log('Alignment percentage: ' + Math.round((totalProblems - placeholderCount) / totalProblems * 100) + '%');
}

finalReport();
