const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Additional standards mapping for grades 3-8
const ADDITIONAL_STANDARDS = {
  // MATH GRADE 3
  'math|3|MULTCONCEPT': '3.OA.A.1',   // Interpret products of whole numbers
  'math|3|DIVCONCEPT': '3.OA.A.2',    // Interpret quotients of whole numbers
  'math|3|FRACTIONS': '3.NF.A.1',     // Understand fractions as parts of a whole

  // MATH GRADE 4
  'math|4|MULTDIGIT': '4.NBT.B.5',    // Multiply multi-digit numbers
  'math|4|DIVLONG': '4.NBT.B.6',      // Divide multi-digit numbers
  'math|4|EQUIVFRAC': '4.NF.A.1',     // Equivalent fractions

  // MATH GRADE 5
  'math|5|DECIMALS': '5.NBT.A.3',     // Read, write, compare decimals
  'math|5|FRACOPS': '5.NF.A.1',       // Add/subtract fractions
  'math|5|VOLUME': '5.MD.C.3',        // Understand volume concepts

  // MATH GRADE 6
  'math|6|PERCENT': '6.RP.A.3',       // Understand ratio and rate reasoning
  'math|6|ABSVALUE': '6.NS.C.7',      // Understand absolute value
  'math|6|RATIOS': '6.RP.A.1',        // Understand ratio concepts
  'math|6|EXPRESSIONS': '6.EE.A.2',   // Write, read, evaluate expressions

  // MATH GRADE 7
  'math|7|AREACIRC': '7.G.B.4',       // Area and circumference of circles
  'math|7|PROPORTIONS': '7.RP.A.2',   // Recognize proportional relationships
  'math|7|EQUATIONS': '7.EE.B.4',     // Solve equations
  'math|7|INTEGERS': '7.NS.A.1',      // Add/subtract rational numbers

  // MATH GRADE 8
  'math|8|LINEAR': '8.EE.B.5',        // Graph linear equations
  'math|8|PYTHAGOREAN': '8.G.B.7',    // Apply Pythagorean theorem
  'math|8|FUNCTIONS': '8.F.A.1',      // Understand functions

  // READING GRADES 3-8
  'reading|3|FLUENCY': 'RF.3.4',
  'reading|4|FLUENCY': 'RF.4.4',
  'reading|5|COMPREHENSION': 'RL.5.1',
  'reading|6|COMPREHENSION': 'RL.6.1',

  // WRITING GRADES 3-8
  'writing|3|PARAGRAPH': 'W.3.3',
  'writing|4|ESSAY': 'W.4.1',
  'writing|5|NARRATIVE': 'W.5.3',
  'writing|6|ARGUMENT': 'W.6.1',
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
  console.log('=== FIXING REMAINING PLACEHOLDERS ===\n');

  // First, find all remaining placeholders
  const placeholderPrefixes = ['MATH', 'READING', 'WRITING', 'SPELLING'];

  for (let grade = 0; grade <= 8; grade++) {
    for (const prefix of placeholderPrefixes) {
      const placeholder = `${prefix}.G${grade}`;

      const { data: skillData } = await supabase
        .from('practice_problems')
        .select('skill')
        .eq('standard', placeholder)
        .limit(1000);

      if (!skillData || skillData.length === 0) continue;

      const uniqueSkills = [...new Set(skillData.map(d => d.skill))];
      console.log('\n' + placeholder + ': ' + uniqueSkills.join(', '));

      for (const skill of uniqueSkills) {
        const key = `${prefix.toLowerCase()}|${grade}|${skill}`;
        const newStandard = ADDITIONAL_STANDARDS[key];

        if (newStandard) {
          process.stdout.write('  ' + skill + ' → ' + newStandard + ' ');
          const count = await updateBatch(placeholder, skill, newStandard);
          console.log('(' + count + ')');
        } else {
          // Try a generic standard for the grade/subject
          const genericKey = `${prefix.toLowerCase()}|${grade}|GENERAL`;
          const genericStd = ADDITIONAL_STANDARDS[genericKey];

          if (genericStd) {
            process.stdout.write('  ' + skill + ' → ' + genericStd + ' (generic) ');
            const count = await updateBatch(placeholder, skill, genericStd);
            console.log('(' + count + ')');
          } else {
            console.log('  ' + skill + ': NO MAPPING - needs manual review');
          }
        }
      }
    }
  }

  // Final verification
  console.log('\n\n=== VERIFICATION ===');
  for (let grade = 0; grade <= 8; grade++) {
    for (const prefix of placeholderPrefixes) {
      const placeholder = `${prefix}.G${grade}`;
      const { count } = await supabase
        .from('practice_problems')
        .select('*', { count: 'exact', head: true })
        .eq('standard', placeholder);

      if (count > 0) {
        console.log(placeholder + ': ' + count + ' remaining');
      }
    }
  }
  console.log('Done!');
}

fixAll();
