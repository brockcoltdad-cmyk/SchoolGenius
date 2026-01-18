const data = require('./backups/gradual-release-format-items.json');

console.log('=== CHECKING TEACHING PROTOCOL COMPLIANCE ===\n');

// Get a few diverse samples
const samples = [
  data.find(d => d.subject === 'math' && d.grade === 3),
  data.find(d => d.subject === 'reading' && d.grade === 0),
  data.find(d => d.subject === 'writing' && d.grade === 2)
];

samples.forEach((item, idx) => {
  if (!item) return;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SAMPLE ${idx + 1}: ${item.subject.toUpperCase()} Grade ${item.grade}`);
  console.log(`Rule: ${item.rule_id}`);
  console.log(`${'='.repeat(60)}`);

  // Phase 1-2: I DO (Rule Teaching + Demo)
  console.log('\n--- PHASE 1-2: I DO (Rule Teaching + Demo) ---');
  if (item.i_do) {
    console.log('Explanation:', item.i_do.explanation ? item.i_do.explanation.substring(0, 100) + '...' : 'MISSING');
    if (item.i_do.example) {
      console.log('Example Problem:', item.i_do.example.problem || 'MISSING');
      console.log('Example Answer:', item.i_do.example.answer || 'MISSING');
      console.log('Example Solution:', item.i_do.example.solution ? 'YES (has steps)' : 'MISSING');
    }
  } else {
    console.log('i_do: MISSING');
  }

  // Phase 3: WE DO (Guided Practice)
  console.log('\n--- PHASE 3: WE DO (Guided Practice) ---');
  if (item.we_do) {
    console.log('Problem:', item.we_do.problem || 'MISSING');
    console.log('Answer:', item.we_do.answer || 'MISSING');
    console.log('Hints:', item.we_do.hints ? item.we_do.hints.length + ' hints' : 'MISSING');
    console.log('Solution template:', item.we_do.solution ? 'YES' : 'MISSING');
  } else {
    console.log('we_do: MISSING');
  }

  // Phase 4: YOU DO (Independent Practice)
  console.log('\n--- PHASE 4: YOU DO (Independent Practice) ---');
  if (item.you_do && item.you_do.length > 0) {
    console.log('Problems count:', item.you_do.length);
    item.you_do.forEach((p, i) => {
      console.log(`  Problem ${i+1}: ${p.problem ? p.problem.substring(0, 50) + '...' : 'MISSING'}`);
      console.log(`    Answer: ${p.answer || 'MISSING'}`);
      console.log(`    Explanation: ${p.explanation ? 'YES' : 'MISSING'}`);
    });
  } else {
    console.log('you_do: MISSING');
  }

  // Phase 5: CHECK (Quiz)
  console.log('\n--- PHASE 5: CHECK (Quiz Question) ---');
  if (item.check_question) {
    console.log('Question:', item.check_question.question || 'MISSING');
    console.log('Options:', item.check_question.options ? item.check_question.options.length + ' options' : 'MISSING');
    console.log('Correct:', item.check_question.correct || 'MISSING');
    console.log('Explanation:', item.check_question.explanation ? 'YES' : 'MISSING');
  } else {
    console.log('check_question: MISSING');
  }

  // Check for tier1/tier2 (needed for wrong answers)
  console.log('\n--- TIER 1/2 (Wrong Answer Support) ---');
  console.log('tier1:', item.tier1 ? 'YES' : 'NULL - needs generation');
  console.log('tier2:', item.tier2 ? 'YES' : 'NULL - needs generation');
});

// Summary stats
console.log('\n\n' + '='.repeat(60));
console.log('PROTOCOL COMPLIANCE SUMMARY');
console.log('='.repeat(60));

let compliant = { i_do: 0, we_do: 0, you_do: 0, check: 0, tier1: 0, tier2: 0 };
data.forEach(item => {
  if (item.i_do && item.i_do.explanation && item.i_do.example) compliant.i_do++;
  if (item.we_do && item.we_do.problem && item.we_do.hints) compliant.we_do++;
  if (item.you_do && item.you_do.length >= 3) compliant.you_do++;
  if (item.check_question && item.check_question.options) compliant.check++;
  if (item.tier1) compliant.tier1++;
  if (item.tier2) compliant.tier2++;
});

console.log(`\nPhase 1-2 (I DO):     ${compliant.i_do}/${data.length} (${(compliant.i_do/data.length*100).toFixed(1)}%)`);
console.log(`Phase 3 (WE DO):      ${compliant.we_do}/${data.length} (${(compliant.we_do/data.length*100).toFixed(1)}%)`);
console.log(`Phase 4 (YOU DO):     ${compliant.you_do}/${data.length} (${(compliant.you_do/data.length*100).toFixed(1)}%)`);
console.log(`Phase 5 (CHECK):      ${compliant.check}/${data.length} (${(compliant.check/data.length*100).toFixed(1)}%)`);
console.log(`\nTier1 (wrong answer): ${compliant.tier1}/${data.length} - NEEDS GENERATION`);
console.log(`Tier2 (wrong answer): ${compliant.tier2}/${data.length} - NEEDS GENERATION`);
