const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function fullAnalysis() {
  console.log('Fetching problems (this may take a moment)...\n');

  // Get all unique standard values with counts - fetch in batches
  let allData = [];
  let offset = 0;
  const batchSize = 10000;

  while (true) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('standard, subject, grade, skill')
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.log('Error at offset', offset, ':', error.message);
      break;
    }

    if (data.length === 0) break;
    allData = allData.concat(data);
    offset += batchSize;

    if (data.length < batchSize) break;
    if (allData.length >= 100000) break; // Cap for analysis
  }

  console.log('Analyzed', allData.length, 'problems\n');

  // Group by standard
  const standardGroups = {};
  allData.forEach(p => {
    const std = p.standard || 'NULL';
    if (standardGroups[std] === undefined) {
      standardGroups[std] = { count: 0, subjects: new Set(), grades: new Set(), skills: new Set() };
    }
    standardGroups[std].count++;
    standardGroups[std].subjects.add(p.subject);
    standardGroups[std].grades.add(p.grade);
    standardGroups[std].skills.add(p.skill);
  });

  // Identify placeholders vs real standards
  const placeholders = [];
  const realStandards = [];

  Object.entries(standardGroups).forEach(([std, info]) => {
    const isPlaceholder = std.match(/^(MATH|READING|WRITING|SPELLING|TYPING|CODING)\.G[0-9]+$/);
    const isNull = std === 'NULL';

    if (isPlaceholder || isNull) {
      placeholders.push({
        standard: std,
        count: info.count,
        subjects: [...info.subjects],
        grades: [...info.grades].sort((a,b) => a - b),
        skills: [...info.skills].slice(0, 5)
      });
    } else {
      realStandards.push({ standard: std, count: info.count });
    }
  });

  console.log('=== PROBLEMS NEEDING STANDARDS ALIGNMENT ===\n');
  console.log('Placeholder/NULL standards:');
  placeholders.sort((a,b) => b.count - a.count).forEach(p => {
    console.log('\n  ' + p.standard + ': ' + p.count + ' problems');
    console.log('    Subjects: ' + p.subjects.join(', '));
    console.log('    Grades: ' + p.grades.join(', '));
    console.log('    Sample skills: ' + p.skills.join(', '));
  });

  console.log('\n\n=== REAL STANDARDS ALREADY IN USE ===\n');
  realStandards.sort((a,b) => b.count - a.count).slice(0, 25).forEach(s => {
    console.log('  ' + s.standard + ': ' + s.count + ' problems');
  });

  // Summary
  const placeholderCount = placeholders.reduce((sum, p) => sum + p.count, 0);
  const realCount = realStandards.reduce((sum, s) => sum + s.count, 0);
  console.log('\n=== SUMMARY ===');
  console.log('Problems with placeholders/NULL:', placeholderCount);
  console.log('Problems with real standards:', realCount);
  console.log('Percentage needing alignment:', Math.round(placeholderCount / (placeholderCount + realCount) * 100) + '%');
}

fullAnalysis();
