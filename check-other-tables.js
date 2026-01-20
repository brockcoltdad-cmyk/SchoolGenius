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
      console.log('Error fetching', table + ':', error.message);
      break;
    }
    if (data === null || data.length === 0) break;

    data.forEach(r => {
      if (r.rule_id) ruleIds.add(r.rule_id);
    });
    offset += batchSize;
    if (limit && offset >= limit) break;
  }

  return ruleIds;
}

async function check() {
  // Get target rule_ids from practice_problems
  console.log('Fetching practice_problems rule_ids...');
  const ppRuleIds = await getAllRuleIds('practice_problems', 150000);
  console.log('practice_problems unique rule_ids:', ppRuleIds.size);

  // Check rule_teaching_scripts
  console.log('\n--- rule_teaching_scripts ---');
  const rtsRuleIds = await getAllRuleIds('rule_teaching_scripts');
  console.log('Total unique rule_ids:', rtsRuleIds.size);
  const rtsCovered = [...ppRuleIds].filter(r => rtsRuleIds.has(r));
  const rtsMissing = [...ppRuleIds].filter(r => r && !rtsRuleIds.has(r));
  console.log('Coverage:', rtsCovered.length + '/' + ppRuleIds.size, '(' + Math.round(rtsCovered.length/ppRuleIds.size*100) + '%)');
  if (rtsMissing.length > 0) {
    console.log('Missing', rtsMissing.length + ':');
    rtsMissing.forEach(r => console.log('  - ' + r));
  }

  // Check demo_problems
  console.log('\n--- demo_problems ---');
  const dpRuleIds = await getAllRuleIds('demo_problems');
  console.log('Total unique rule_ids:', dpRuleIds.size);
  const dpCovered = [...ppRuleIds].filter(r => dpRuleIds.has(r));
  const dpMissing = [...ppRuleIds].filter(r => r && !dpRuleIds.has(r));
  console.log('Coverage:', dpCovered.length + '/' + ppRuleIds.size, '(' + Math.round(dpCovered.length/ppRuleIds.size*100) + '%)');
  if (dpMissing.length > 0) {
    console.log('Missing', dpMissing.length + ':');
    dpMissing.forEach(r => console.log('  - ' + r));
  }
}

check();
