const data = require('./backups/gradual-release-format-items.json');
const subjects = {};
const grades = {};

data.forEach(item => {
  subjects[item.subject] = (subjects[item.subject] || 0) + 1;
  const key = item.subject + '-G' + item.grade;
  grades[key] = (grades[key] || 0) + 1;
});

console.log('=== BACKUP ANALYSIS ===');
console.log('\nTotal items:', data.length);
console.log('\nBy Subject:');
Object.entries(subjects).sort().forEach(([s,c]) => console.log('  ' + s + ': ' + c));
console.log('\nBy Grade:');
Object.entries(grades).sort().forEach(([g,c]) => console.log('  ' + g + ': ' + c));

// Check data structure
const sample = data[0];
console.log('\n=== DATA STRUCTURE ===');
console.log('Has i_do:', sample.i_do ? 'YES' : 'NO');
console.log('Has we_do:', sample.we_do ? 'YES' : 'NO');
console.log('Has you_do:', sample.you_do ? 'YES' : 'NO');
console.log('Has check_question:', sample.check_question ? 'YES' : 'NO');
console.log('Has rule_id:', sample.rule_id ? 'YES' : 'NO');

// Count items with each phase
let withIDo = 0, withWeDo = 0, withYouDo = 0, withCheck = 0;
data.forEach(item => {
  if (item.i_do) withIDo++;
  if (item.we_do) withWeDo++;
  if (item.you_do && item.you_do.length > 0) withYouDo++;
  if (item.check_question) withCheck++;
});

console.log('\n=== PHASE COVERAGE ===');
console.log('Items with i_do (Phase 1-2):', withIDo);
console.log('Items with we_do (Phase 3):', withWeDo);
console.log('Items with you_do (Phase 4):', withYouDo);
console.log('Items with check_question (Phase 5):', withCheck);

// Get unique rules
const rules = new Set();
data.forEach(item => {
  if (item.rule_id) rules.add(item.rule_id);
});
console.log('\n=== UNIQUE RULES ===');
console.log('Total unique rules:', rules.size);
console.log('\nSample rules:');
Array.from(rules).slice(0, 10).forEach(r => console.log('  ' + r));
