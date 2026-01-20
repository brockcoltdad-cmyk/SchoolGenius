const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function findPlaceholders() {
  console.log('Scanning for remaining placeholders...\n');

  // Check for any placeholder patterns across all data
  let offset = 0;
  const batchSize = 10000;
  const placeholders = {};

  while (true) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('standard, subject, grade, skill')
      .range(offset, offset + batchSize - 1);

    if (error || !data || data.length === 0) break;

    data.forEach(p => {
      if (p.standard && p.standard.match(/^(MATH|READING|WRITING|SPELLING|TYPING|CODING)\.G[0-9]+$/)) {
        const key = p.standard;
        if (placeholders[key] === undefined) {
          placeholders[key] = { count: 0, grades: new Set(), skills: new Set() };
        }
        placeholders[key].count++;
        placeholders[key].grades.add(p.grade);
        placeholders[key].skills.add(p.skill);
      }
    });

    offset += batchSize;
    process.stdout.write('.');

    if (data.length < batchSize) break;
    if (offset >= 350000) break; // Safety limit
  }

  console.log('\n\n=== REMAINING PLACEHOLDERS ===\n');

  const entries = Object.entries(placeholders);
  if (entries.length === 0) {
    console.log('✓ No placeholders found! All problems have real standards.');
  } else {
    let totalRemaining = 0;
    entries.sort((a, b) => b[1].count - a[1].count).forEach(([std, info]) => {
      console.log(std + ': ' + info.count + ' problems');
      console.log('  Grades: ' + [...info.grades].sort((a, b) => a - b).join(', '));
      console.log('  Skills: ' + [...info.skills].slice(0, 8).join(', '));
      console.log('');
      totalRemaining += info.count;
    });
    console.log('TOTAL REMAINING: ' + totalRemaining + ' problems need alignment');
  }
}

findPlaceholders();
