const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Comprehensive standards mapping
const STANDARDS = {
  // WRITING GRADE 1
  'writing|1|CAPITAL': 'L.1.2.a',      // Capitalize dates and names of people
  'writing|1|PERIOD': 'L.1.2.b',       // Use end punctuation
  'writing|1|QUESTION': 'L.1.2.b',     // Use end punctuation (question marks)
  'writing|1|COMMA': 'L.1.2.c',        // Use commas in dates and series
  'writing|1|SENTENCE': 'L.1.1.j',     // Produce simple and compound sentences

  // MATH GRADE 3
  'math|3|MULT8': '3.OA.C.7',          // Fluently multiply within 100
  'math|3|MULT7': '3.OA.C.7',          // Fluently multiply within 100
  'math|3|DIV': '3.OA.C.7',            // Fluently divide within 100
  'math|3|MULT': '3.OA.C.7',           // Fluently multiply within 100
  'math|3|FRACTIONS': '3.NF.A.1',      // Understand fractions

  // MATH GRADE 4
  'math|4|MIXEDNUMBERS': '4.NF.B.3',   // Add/subtract mixed numbers
  'math|4|MULTDIGIT': '4.NBT.B.5',     // Multiply multi-digit numbers
  'math|4|FRACTIONS': '4.NF.A.1',      // Equivalent fractions

  // MATH GRADE 5
  'math|5|DECIMALS': '5.NBT.A.3',      // Read, write, compare decimals
  'math|5|FRACTIONS': '5.NF.A.1',      // Add/subtract fractions

  // MATH GRADE 6
  'math|6|PERCENT': '6.RP.A.3',        // Ratio and rate reasoning
  'math|6|ABSVALUE': '6.NS.C.7',       // Absolute value
  'math|6|RATIOS': '6.RP.A.1',         // Ratio concepts
  'math|6|EXPRESSIONS': '6.EE.A.2',    // Expressions

  // MATH GRADE 7
  'math|7|INEQUALITIES': '7.EE.B.4',   // Solve inequalities
  'math|7|AREACIRC': '7.G.B.4',        // Area of circles
  'math|7|PROPORTIONS': '7.RP.A.2',    // Proportional relationships
  'math|7|EQUATIONS': '7.EE.B.4',      // Solve equations
  'math|7|INTEGERS': '7.NS.A.1',       // Rational numbers

  // MATH GRADE 8
  'math|8|LINEAR': '8.EE.B.5',         // Linear equations
  'math|8|FUNCTIONS': '8.F.A.1',       // Functions
  'math|8|PYTHAGOREAN': '8.G.B.7',     // Pythagorean theorem
};

async function updateBatch(oldStandard, skill, newStandard) {
  let total = 0;
  while (true) {
    const { data } = await supabase
      .from('practice_problems')
      .select('id')
      .eq('standard', oldStandard)
      .eq('skill', skill)
      .limit(500);

    if (!data || data.length === 0) break;

    const ids = data.map(r => r.id);
    await supabase.from('practice_problems').update({ standard: newStandard }).in('id', ids);
    total += ids.length;
    process.stdout.write('.');

    if (data.length < 500) break;
  }
  return total;
}

async function fixAll() {
  console.log('=== FIXING ALL REMAINING PLACEHOLDERS ===\n');

  const placeholders = [
    'WRITING.G1', 'MATH.G3', 'MATH.G4', 'MATH.G5', 'MATH.G6', 'MATH.G7', 'MATH.G8'
  ];

  for (const placeholder of placeholders) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('standard', placeholder);

    if (!count || count === 0) continue;

    console.log('\n' + placeholder + ' (' + count + ' problems):');

    // Get unique skills
    const { data: skillData } = await supabase
      .from('practice_problems')
      .select('skill')
      .eq('standard', placeholder)
      .limit(5000);

    const uniqueSkills = [...new Set(skillData.map(d => d.skill))];

    // Parse subject and grade from placeholder
    const match = placeholder.match(/^(\w+)\.G(\d+)$/);
    const subject = match[1].toLowerCase();
    const grade = parseInt(match[2]);

    for (const skill of uniqueSkills) {
      const key = `${subject}|${grade}|${skill}`;
      let newStandard = STANDARDS[key];

      // If no exact match, try to find a similar standard for this grade/subject
      if (!newStandard) {
        // Use a default standard for the subject/grade
        if (subject === 'math') {
          if (grade === 3) newStandard = '3.OA.A.1';
          else if (grade === 4) newStandard = '4.NBT.A.1';
          else if (grade === 5) newStandard = '5.NBT.A.1';
          else if (grade === 6) newStandard = '6.NS.A.1';
          else if (grade === 7) newStandard = '7.NS.A.1';
          else if (grade === 8) newStandard = '8.NS.A.1';
        } else if (subject === 'writing') {
          newStandard = `L.${grade}.1`;
        } else if (subject === 'reading') {
          newStandard = `RF.${grade}.3`;
        }
      }

      if (newStandard) {
        process.stdout.write('  ' + skill + ' → ' + newStandard + ' ');
        const updated = await updateBatch(placeholder, skill, newStandard);
        console.log('(' + updated + ')');
      } else {
        console.log('  ' + skill + ': SKIPPED (no mapping)');
      }
    }
  }

  // Final verification
  console.log('\n\n=== FINAL VERIFICATION ===');
  let totalRemaining = 0;
  for (const placeholder of placeholders) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('standard', placeholder);

    if (count > 0) {
      console.log(placeholder + ': ' + count + ' remaining');
      totalRemaining += count;
    }
  }
  if (totalRemaining === 0) {
    console.log('✓ All placeholders resolved!');
  } else {
    console.log('\nTotal remaining: ' + totalRemaining);
  }
}

fixAll();
