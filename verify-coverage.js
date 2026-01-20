const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function getAllRuleIds(table, limit = null) {
  const ruleIds = new Set();
  let offset = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('rule_id')
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.log('Error:', error.message);
      break;
    }
    if (data === null || data.length === 0) break;

    data.forEach(r => ruleIds.add(r.rule_id));
    offset += batchSize;

    // Stop early if limit reached
    if (limit && offset >= limit) break;
  }

  return ruleIds;
}

async function check() {
  console.log('Fetching guided_practice rule_ids...');
  const gpRuleIds = await getAllRuleIds('guided_practice');
  console.log('guided_practice unique rule_ids:', gpRuleIds.size);

  console.log('\nFetching practice_problems rule_ids (first 150k rows)...');
  const ppRuleIds = await getAllRuleIds('practice_problems', 150000);
  console.log('practice_problems unique rule_ids found:', ppRuleIds.size);

  // Coverage
  const covered = [...ppRuleIds].filter(r => gpRuleIds.has(r));
  const missing = [...ppRuleIds].filter(r => r && !gpRuleIds.has(r));

  console.log('\nCoverage:', covered.length + '/' + ppRuleIds.size, '(' + Math.round(covered.length/ppRuleIds.size*100) + '%)');

  if (missing.length > 0) {
    console.log('\nStill missing ' + missing.length + ' rule_ids:');
    missing.forEach(r => console.log('  - ' + r));
  } else {
    console.log('\n100% COVERAGE ACHIEVED');
  }

  // Show all guided_practice rule_ids
  console.log('\n--- All guided_practice rule_ids ---');
  [...gpRuleIds].sort().forEach(r => console.log('  ' + r));
}

check();
