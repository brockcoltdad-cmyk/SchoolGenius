const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Arizona College and Career Ready Standards (AZCCRS) - aligned with Common Core
const STANDARDS_MAP = {
  // MATH KINDERGARTEN
  'math|0|COUNT': 'K.CC.A.1',
  'math|0|COMPARE': 'K.CC.C.6',
  'math|0|ONETOTEN': 'K.CC.B.4',
  'math|0|SUBCONCEPT': 'K.OA.A.2',
  'math|0|ADDCONCEPT': 'K.OA.A.1',
  'math|0|ZERO': 'K.CC.A.3',

  // MATH GRADE 2
  'math|2|SUB20': '2.OA.B.2',
  'math|2|ADD20': '2.OA.B.2',
  'math|2|SKIP2': '2.NBT.A.2',
  'math|2|SKIP5': '2.NBT.A.2',
  'math|2|SKIP10': '2.NBT.A.2',
  'math|2|ARRAYS': '2.OA.C.4',
  'math|2|REGROUP': '2.NBT.B.7',
  'math|2|EVENODD': '2.OA.C.3',  // Determine odd/even numbers

  // READING KINDERGARTEN
  'reading|0|BLENDS': 'RF.K.3',
  'reading|0|CONSONANTS': 'RF.K.3',
  'reading|0|SILENTE': 'RF.K.3',
  'reading|0|DIGRAPHS': 'RF.K.3',
  'reading|0|CVC': 'RF.K.2',
  'reading|0|SHORTVOWELS': 'RF.K.3',

  // READING GRADE 1
  'reading|1|BLENDS': 'RF.1.3',
  'reading|1|CONSONANTS': 'RF.1.3',
  'reading|1|SILENTE': 'RF.1.3',
  'reading|1|DIGRAPHS': 'RF.1.3',
  'reading|1|CVC': 'RF.1.2',
  'reading|1|SHORTVOWELS': 'RF.1.3',

  // WRITING KINDERGARTEN
  'writing|0|CAPITAL': 'L.K.2.a',
  'writing|0|PERIOD': 'L.K.2.b',
  'writing|0|SENTENCE': 'L.K.1.f',

  // WRITING GRADE 2
  'writing|2|SUBJECTAGREE': 'L.2.1.f',
  'writing|2|QUOTES': 'L.2.2.c',
  'writing|2|PARAGRAPH': 'W.2.3',
  'writing|2|APOSTROPHE': 'L.2.2.c',
};

async function updateInBatches(oldStandard, skill, newStandard) {
  const BATCH_SIZE = 500;
  let totalUpdated = 0;

  while (true) {
    // Get IDs to update
    const { data: toUpdate, error: selectError } = await supabase
      .from('practice_problems')
      .select('id')
      .eq('standard', oldStandard)
      .eq('skill', skill)
      .limit(BATCH_SIZE);

    if (selectError) {
      console.log('    Select error:', selectError.message);
      break;
    }

    if (!toUpdate || toUpdate.length === 0) {
      break;
    }

    const ids = toUpdate.map(r => r.id);

    // Update by IDs
    const { error: updateError } = await supabase
      .from('practice_problems')
      .update({ standard: newStandard })
      .in('id', ids);

    if (updateError) {
      console.log('    Update error:', updateError.message);
      break;
    }

    totalUpdated += ids.length;
    process.stdout.write('.');

    if (toUpdate.length < BATCH_SIZE) {
      break;
    }
  }

  return totalUpdated;
}

async function updateAllStandards() {
  console.log('=== ARIZONA STANDARDS ALIGNMENT (Batched) ===\n');

  const placeholders = [
    { oldStd: 'MATH.G0', subject: 'math', grade: 0 },
    { oldStd: 'MATH.G2', subject: 'math', grade: 2 },
    { oldStd: 'READING.G0', subject: 'reading', grade: 0 },
    { oldStd: 'READING.G1', subject: 'reading', grade: 1 },
    { oldStd: 'WRITING.G0', subject: 'writing', grade: 0 },
    { oldStd: 'WRITING.G2', subject: 'writing', grade: 2 },
  ];

  let grandTotal = 0;

  for (const p of placeholders) {
    console.log('\n--- ' + p.oldStd + ' ---');

    // Get all unique skills
    const { data: skillData } = await supabase
      .from('practice_problems')
      .select('skill')
      .eq('standard', p.oldStd)
      .limit(10000);

    if (!skillData || skillData.length === 0) {
      console.log('No problems remaining');
      continue;
    }

    const uniqueSkills = [...new Set(skillData.map(d => d.skill))];

    for (const skill of uniqueSkills) {
      const key = p.subject + '|' + p.grade + '|' + skill;
      const newStandard = STANDARDS_MAP[key];

      if (!newStandard) {
        console.log('  ' + skill + ': No mapping found');
        continue;
      }

      process.stdout.write('  ' + skill + ' → ' + newStandard + ' ');
      const count = await updateInBatches(p.oldStd, skill, newStandard);
      console.log(' (' + count + ')');
      grandTotal += count;
    }
  }

  console.log('\n=== COMPLETE ===');
  console.log('Total updated:', grandTotal);

  // Final verification
  console.log('\n=== FINAL VERIFICATION ===');
  for (const p of placeholders) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('standard', p.oldStd);
    console.log(p.oldStd + ':', count || 0, 'remaining');
  }
}

updateAllStandards();
