const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Arizona College and Career Ready Standards (AZCCRS) - aligned with Common Core
const STANDARDS_MAP = {
  // === MATH KINDERGARTEN (Grade 0) ===
  'math|0|COUNT': 'K.CC.A.1',           // Count to 100 by ones and tens
  'math|0|COMPARE': 'K.CC.C.6',         // Compare two numbers between 1 and 10
  'math|0|ONETOTEN': 'K.CC.B.4',        // Understand relationship between numbers and quantities
  'math|0|SUBCONCEPT': 'K.OA.A.2',      // Solve subtraction word problems within 10
  'math|0|ADDCONCEPT': 'K.OA.A.1',      // Represent addition with objects, fingers, drawings
  'math|0|ZERO': 'K.CC.A.3',            // Write numbers 0-20

  // === MATH GRADE 2 ===
  'math|2|SUB20': '2.OA.B.2',           // Fluently add and subtract within 20
  'math|2|ADD20': '2.OA.B.2',           // Fluently add and subtract within 20
  'math|2|SKIP2': '2.NBT.A.2',          // Count within 1000; skip-count by 5s, 10s, 100s
  'math|2|SKIP5': '2.NBT.A.2',          // Count within 1000; skip-count by 5s, 10s, 100s
  'math|2|SKIP10': '2.NBT.A.2',         // Count within 1000; skip-count by 5s, 10s, 100s
  'math|2|ARRAYS': '2.OA.C.4',          // Use addition to find total in rectangular array
  'math|2|REGROUP': '2.NBT.B.7',        // Add and subtract within 1000 with regrouping

  // === READING KINDERGARTEN (Grade 0) - Foundational Skills ===
  'reading|0|BLENDS': 'RF.K.3',         // Know and apply phonics and word analysis skills
  'reading|0|CONSONANTS': 'RF.K.3',     // Know and apply phonics and word analysis skills
  'reading|0|SILENTE': 'RF.K.3',        // Know and apply phonics and word analysis skills
  'reading|0|DIGRAPHS': 'RF.K.3',       // Know and apply phonics and word analysis skills
  'reading|0|CVC': 'RF.K.2',            // Demonstrate understanding of spoken words, syllables
  'reading|0|SHORTVOWELS': 'RF.K.3',    // Know and apply phonics and word analysis skills

  // === READING GRADE 1 - Foundational Skills ===
  'reading|1|BLENDS': 'RF.1.3',         // Know and apply phonics and word analysis skills
  'reading|1|CONSONANTS': 'RF.1.3',     // Know and apply phonics and word analysis skills
  'reading|1|SILENTE': 'RF.1.3',        // Know and apply phonics and word analysis skills
  'reading|1|DIGRAPHS': 'RF.1.3',       // Know and apply phonics and word analysis skills
  'reading|1|CVC': 'RF.1.2',            // Demonstrate understanding of spoken words, syllables
  'reading|1|SHORTVOWELS': 'RF.1.3',    // Know and apply phonics and word analysis skills

  // === WRITING KINDERGARTEN (Grade 0) - Language Standards ===
  'writing|0|CAPITAL': 'L.K.2.a',       // Capitalize first word in sentence and pronoun I
  'writing|0|PERIOD': 'L.K.2.b',        // Recognize and name end punctuation
  'writing|0|SENTENCE': 'L.K.1.f',      // Produce and expand complete sentences

  // === WRITING GRADE 2 - Language Standards ===
  'writing|2|SUBJECTAGREE': 'L.2.1.f',  // Produce, expand, and rearrange complete sentences
  'writing|2|QUOTES': 'L.2.2.c',        // Use an apostrophe to form contractions and possessives
  'writing|2|PARAGRAPH': 'W.2.3',       // Write narratives with details and sequence
};

async function updateStandards() {
  console.log('=== ARIZONA STANDARDS ALIGNMENT ===\n');

  // Process each placeholder
  const placeholders = [
    { oldStd: 'MATH.G0', subject: 'math', grade: 0 },
    { oldStd: 'MATH.G2', subject: 'math', grade: 2 },
    { oldStd: 'READING.G0', subject: 'reading', grade: 0 },
    { oldStd: 'READING.G1', subject: 'reading', grade: 1 },
    { oldStd: 'WRITING.G0', subject: 'writing', grade: 0 },
    { oldStd: 'WRITING.G2', subject: 'writing', grade: 2 },
  ];

  let totalUpdated = 0;

  for (const p of placeholders) {
    console.log('\n--- Processing ' + p.oldStd + ' ---');

    // Get all unique skills for this placeholder
    const { data: skillData } = await supabase
      .from('practice_problems')
      .select('skill')
      .eq('standard', p.oldStd);

    if (!skillData || skillData.length === 0) {
      console.log('No problems found with this placeholder');
      continue;
    }

    const uniqueSkills = [...new Set(skillData.map(d => d.skill))];
    console.log('Found skills:', uniqueSkills.join(', '));

    // Update each skill to its proper standard
    for (const skill of uniqueSkills) {
      const key = p.subject + '|' + p.grade + '|' + skill;
      const newStandard = STANDARDS_MAP[key];

      if (!newStandard) {
        console.log('  WARNING: No mapping for ' + key);
        continue;
      }

      // Count how many will be updated
      const { count } = await supabase
        .from('practice_problems')
        .select('*', { count: 'exact', head: true })
        .eq('standard', p.oldStd)
        .eq('skill', skill);

      console.log('  ' + skill + ' → ' + newStandard + ' (' + count + ' problems)');

      // Perform the update
      const { error } = await supabase
        .from('practice_problems')
        .update({ standard: newStandard })
        .eq('standard', p.oldStd)
        .eq('skill', skill);

      if (error) {
        console.log('    ERROR:', error.message);
      } else {
        totalUpdated += count;
        console.log('    ✓ Updated');
      }
    }
  }

  console.log('\n=== COMPLETE ===');
  console.log('Total problems updated:', totalUpdated);

  // Verify remaining placeholders
  console.log('\n=== VERIFICATION ===');
  for (const p of placeholders) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('standard', p.oldStd);
    console.log(p.oldStd + ' remaining:', count);
  }
}

updateStandards();
