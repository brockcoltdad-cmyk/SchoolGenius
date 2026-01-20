const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Map skills to generic rule_ids matching practice_problems
const skillToRuleId = {
  // MATH
  'Addition (1-digit)': 'MATH-R-GENERAL-G0',
  'Addition Facts 0-10': 'MATH-R-GENERAL-G1',
  'Addition Facts 0-20': 'MATH-R-GENERAL-G2',
  'Subtraction Facts 0-10': 'MATH-R-GENERAL-G1',
  'Subtraction Facts 0-20': 'MATH-R-GENERAL-G2',
  'Multiplication Facts 0-10': 'MATH-R-MULT-G3',
  'Multiplication Facts 11-12': 'MATH-R-MULT-G3',
  'Division Facts 0-10': 'MATH-R-GENERAL-G3',
  'Coin Recognition': 'MATH-R-GENERAL-G1',
  'Coin Values': 'MATH-R-GENERAL-G1',
  'Counting Coins': 'MATH-R-GENERAL-G2',
  'Money with Dollars': 'MATH-R-GENERAL-G2',
  'Time to Hour': 'MATH-R-GENERAL-G1',
  'Time to Half Hour': 'MATH-R-GENERAL-G1',
  'Time to 5 Minutes': 'MATH-R-GENERAL-G2',
  'Time to Minute': 'MATH-R-GENERAL-G3',
  'Introduction to Fractions': 'MATH-R-GENERAL-G3',
  'Adding and Subtracting Fractions': 'MATH-R-GENERAL-G4',
  'Multiplying Fractions': 'MATH-R-GENERAL-G5',
  'Long Division': 'MATH-R-GENERAL-G4',
  'Multi-digit Multiplication': 'MATH-R-GENERAL-G4',
  'Decimal Operations': 'MATH-R-DEC-G4',
  'Percents': 'MATH-R-PERCENT-G6',
  'Ratios and Rates': 'MATH-R-RATIO-G6',
  'Proportions': 'MATH-R-PROPORTION-G7',
  'Factors and Multiples': 'MATH-R-GENERAL-G4',
  'Order of Operations': 'MATH-R-GENERAL-G5',
  'Negative Numbers': 'MATH-R-GENERAL-G6',
  'Introduction to Algebra': 'MATH-R-ALGEBRA-G7',
  'One-Step Equations': 'MATH-R-ALGEBRA-G7',
  'Algebraic Expressions': 'MATH-R-ALGEBRA-G7',
  'Linear Equations': 'MATH-R-ALGEBRA-G7',
  'Graphing Linear Equations': 'MATH-R-ALGEBRA-G7',
  'Systems of Equations': 'MATH-R-ALGEBRA-G7',
  'Inequalities': 'MATH-R-ALGEBRA-G7',
  'Quadratic Equations': 'MATH-R-ALGEBRA-G7',
  'Quadratic Formula': 'MATH-R-ALGEBRA-G7',
  'Factoring Polynomials': 'MATH-R-ALGEBRA-G7',
  'Geometry Basics': 'MATH-R-GEOMETRY-G7',
  'Pythagorean Theorem': 'MATH-R-GEOMETRY-G7',
  'Geometry Proofs': 'MATH-R-GEOMETRY-G7',
  'Introduction to Trigonometry': 'MATH-R-GENERAL-G7',
  'Trigonometric Functions': 'MATH-R-GENERAL-G7',
  'Introduction to Functions': 'MATH-R-GENERAL-G7',
  'Rational Expressions': 'MATH-R-GENERAL-G7',
  'Sequences and Series': 'MATH-R-GENERAL-G7',
  'Logarithms': 'MATH-R-GENERAL-G7',
  'Complex Numbers': 'MATH-R-GENERAL-G7',
  'Introduction to Limits': 'MATH-R-GENERAL-G7',
  'Pre-Calculus': 'MATH-R-GENERAL-G7',
  'Advanced Algebra': 'MATH-R-ALGEBRA-G7',
  'SAT/ACT Math Prep': 'MATH-R-GENERAL-G7',
  // READING
  'Letter Recognition': 'READING-R-PHONICS-G0',
  'Letter Sounds': 'READING-R-PHONICS-G0',
  'Beginning Sounds': 'READING-R-PHONICS-G0',
  'Rhyming Words': 'READING-R-GENERAL-G0',
  'CVC Words': 'READING-R-PHONICS-G0',
  'Short Vowels': 'READING-R-GENERAL-G1',
  'Consonant Blends': 'READING-R-GENERAL-G1',
  'Consonant Digraphs': 'READING-R-GENERAL-G1',
  'Long Vowels Silent E': 'READING-R-GENERAL-G1',
  'R-Controlled Vowels': 'READING-R-GENERAL-G2',
  'Vowel Teams Basic': 'READING-R-GENERAL-G2',
  'Vowel Teams Advanced': 'READING-R-GENERAL-G3',
  'Silent Letters': 'READING-R-GENERAL-G2',
  'Soft C and G': 'READING-R-GENERAL-G2',
  'Syllable Types': 'READING-R-GENERAL-G3',
  'Multi-Syllable Words': 'READING-R-FLUENCY-G4',
  // SPELLING
  'Compound Words': 'SPELLING-R-GENERAL-G2',
  'Basic Homophones': 'SPELLING-R-GENERAL-G3',
  'Advanced Homophones': 'SPELLING-R-GENERAL-G5',
  'Common Prefixes': 'SPELLING-R-GENERAL-G3',
  'Suffixes tion sion': 'SPELLING-R-GENERAL-G4',
  'Latin Roots': 'SPELLING-R-GENERAL-G5',
  'Greek Roots': 'SPELLING-R-GENERAL-G6',
  'Advanced Roots and Affixes': 'SPELLING-R-GENERAL-G7',
  'Commonly Confused Words': 'SPELLING-R-GENERAL-G5',
  'Etymology Basics': 'SPELLING-R-GENERAL-G6',
  'Academic Vocabulary': 'SPELLING-R-GENERAL-G7',
  'SAT Vocabulary': 'SPELLING-R-GENERAL-G7',
  // TYPING
  'Number Row Typing': 'TYPING-R-GENERAL-G3',
  'Symbols and Punctuation': 'TYPING-R-GENERAL-G4',
  'Speed Building 30 WPM': 'TYPING-R-GENERAL-G4',
  'Speed Building 40 WPM': 'TYPING-R-GENERAL-G5',
  'Speed Building 50 WPM': 'TYPING-R-GENERAL-G6',
  // CODING
  'Sequences and Algorithms': 'CODING-R-GENERAL-G3',
  'Simple Loops': 'CODING-R-GENERAL-G3',
  'Conditionals If Else': 'CODING-R-GENERAL-G4',
  'Variables and Data Types': 'CODING-R-GENERAL-G4',
  'Nested Loops': 'CODING-R-GENERAL-G5',
  'Functions': 'CODING-R-GENERAL-G5',
  'User Input': 'CODING-R-GENERAL-G4',
  'Basic Debugging': 'CODING-R-GENERAL-G4',
  'Boolean Logic': 'CODING-R-GENERAL-G5',
  'File Handling': 'CODING-R-GENERAL-G6',
  'Error Handling': 'CODING-R-GENERAL-G6',
  'Object-Oriented Basics': 'CODING-R-GENERAL-G6',
  'Inheritance': 'CODING-R-GENERAL-G7',
  'Databases Introduction': 'CODING-R-GENERAL-G7',
  'APIs and Web Basics': 'CODING-R-GENERAL-G7',
  'Project Planning': 'CODING-R-GENERAL-G6',
  'Code Portfolio': 'CODING-R-GENERAL-G7',
  // LANG -> WRITING
  'Capital Letters': 'WRITING-R-GENERAL-G0',
  'Periods and Question Marks': 'WRITING-R-GENERAL-G1',
  'Naming Words': 'WRITING-R-GENERAL-G1'
};

async function updateRuleIds() {
  const { data, error } = await supabase.from('explanation_library').select('id, subject_code, skill_name');
  if (error) { console.log('Error:', error.message); return; }

  let updated = 0;
  let unmapped = [];

  for (const row of data) {
    const ruleId = skillToRuleId[row.skill_name];

    if (ruleId) {
      const { error: updateError } = await supabase
        .from('explanation_library')
        .update({ rule_id: ruleId })
        .eq('id', row.id);

      if (updateError) {
        console.log('Error updating ' + row.id + ':', updateError.message);
      } else {
        updated++;
      }
    } else {
      unmapped.push(row.skill_name);
    }
  }

  console.log('Updated ' + updated + ' rows');
  if (unmapped.length > 0) {
    console.log('Unmapped skills:', [...new Set(unmapped)]);
  }

  // Show matches with practice_problems
  const elRules = await supabase.from('explanation_library').select('rule_id');
  const ppRules = await supabase.from('practice_problems').select('rule_id').limit(50000);

  const elSet = new Set(elRules.data.map(r => r.rule_id));
  const ppSet = new Set(ppRules.data.map(r => r.rule_id));

  const matches = [...elSet].filter(r => ppSet.has(r));
  console.log('\nMatching rule_ids: ' + matches.length);
  matches.forEach(r => console.log('  ✓ ' + r));
}

updateRuleIds();
