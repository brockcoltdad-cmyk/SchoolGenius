/**
 * Seed Coding Practice Problems - GRADE K ONLY
 * Target: ~1,000 problems for Kindergarten
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase connection
const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade K Skills - Total 1,000 problems
const GRADE_K_SKILLS = [
  { skill: 'sequences', code: 'SEQ', count: 200 },
  { skill: 'patterns', code: 'PATT', count: 200 },
  { skill: 'giving instructions', code: 'INST', count: 200 },
  { skill: 'following instructions', code: 'FOLL', count: 200 },
  { skill: 'basic debugging', code: 'DBUG', count: 200 },
];

// Sequence problems
const sequenceTemplates = [
  { items: ['🐱 jumps', '🐶 spins', '🐰 hops', '🎉 Party!'], questions: [
    { q: 'What comes first?', a: '🐱 jumps' },
    { q: 'What comes after "🐱 jumps"?', a: '🐶 spins' },
    { q: 'What comes last?', a: '🎉 Party!' },
    { q: 'What comes before "🐰 hops"?', a: '🐶 spins' },
  ]},
  { items: ['Wake up ☀️', 'Brush teeth 🪥', 'Eat breakfast 🥣', 'Go to school 🏫'], questions: [
    { q: 'What do you do first in the morning?', a: 'Wake up ☀️' },
    { q: 'What comes after brushing teeth?', a: 'Eat breakfast 🥣' },
    { q: 'What is the last step?', a: 'Go to school 🏫' },
    { q: 'What comes before eating breakfast?', a: 'Brush teeth 🪥' },
  ]},
  { items: ['Plant seed 🌱', 'Water it 💧', 'Sun shines ☀️', 'Flower grows 🌸'], questions: [
    { q: 'What do you do first to grow a flower?', a: 'Plant seed 🌱' },
    { q: 'What comes after planting the seed?', a: 'Water it 💧' },
    { q: 'What happens at the end?', a: 'Flower grows 🌸' },
  ]},
  { items: ['Get bread 🍞', 'Add peanut butter 🥜', 'Add jelly 🍇', 'Eat sandwich 🥪'], questions: [
    { q: 'What is step 1 of making a sandwich?', a: 'Get bread 🍞' },
    { q: 'What goes on after peanut butter?', a: 'Add jelly 🍇' },
    { q: 'What is the last step?', a: 'Eat sandwich 🥪' },
  ]},
  { items: ['Find book 📚', 'Sit down 🪑', 'Open book 📖', 'Read story 📕'], questions: [
    { q: 'What do you do first to read?', a: 'Find book 📚' },
    { q: 'What comes after sitting down?', a: 'Open book 📖' },
    { q: 'What is the last step?', a: 'Read story 📕' },
  ]},
  { items: ['Get crayons 🖍️', 'Get paper 📄', 'Draw picture 🎨', 'Show mom 👩'], questions: [
    { q: 'What do you need first to draw?', a: 'Get crayons 🖍️' },
    { q: 'What comes after getting paper?', a: 'Draw picture 🎨' },
  ]},
  { items: ['Put on socks 🧦', 'Put on shoes 👟', 'Tie laces 🎀', 'Walk outside 🚶'], questions: [
    { q: 'What goes on first - socks or shoes?', a: 'Put on socks 🧦' },
    { q: 'What do you do after putting on shoes?', a: 'Tie laces 🎀' },
  ]},
  { items: ['Get in car 🚗', 'Put on seatbelt 🔒', 'Drive to store 🛒', 'Get out 🚶'], questions: [
    { q: 'What do you do first when getting in a car?', a: 'Get in car 🚗' },
    { q: 'What comes right after getting in?', a: 'Put on seatbelt 🔒' },
  ]},
];

// Pattern problems
const patternTemplates = [
  { pattern: ['🔴', '🔵', '🔴', '🔵', '🔴'], next: '🔵', type: 'AB', q: 'What comes next?' },
  { pattern: ['🟢', '🟡', '🟢', '🟡', '🟢'], next: '🟡', type: 'AB', q: 'What comes next?' },
  { pattern: ['⭐', '🌙', '⭐', '🌙', '⭐'], next: '🌙', type: 'AB', q: 'What comes next?' },
  { pattern: ['🍎', '🍎', '🍊', '🍎', '🍎'], next: '🍊', type: 'AAB', q: 'What comes next?' },
  { pattern: ['🐱', '🐶', '🐰', '🐱', '🐶'], next: '🐰', type: 'ABC', q: 'What comes next?' },
  { pattern: ['❤️', '💙', '💚', '❤️', '💙'], next: '💚', type: 'ABC', q: 'What comes next?' },
  { pattern: ['1', '2', '1', '2', '1'], next: '2', type: 'AB', q: 'What number comes next?' },
  { pattern: ['🔺', '🔺', '⬜', '🔺', '🔺'], next: '⬜', type: 'AAB', q: 'What shape comes next?' },
  { pattern: ['👏', '👏', '🦶', '👏', '👏'], next: '🦶', type: 'AAB', q: 'What comes next?' },
  { pattern: ['🐸', '🐸', '🐸', '🦋', '🐸', '🐸', '🐸'], next: '🦋', type: 'AAAB', q: 'What comes next?' },
];

// Instruction problems
const instructionTemplates = [
  { grid: '🤖 ⬜ ⬜ 🍪', task: 'get the cookie', steps: ['Move forward', 'Move forward', 'Move forward', 'Pick up cookie'] },
  { grid: '🤖 ⬜ ⭐', task: 'reach the star', steps: ['Move forward', 'Move forward', 'Collect star'] },
  { grid: '🤖 ⬜ ⬜ ⬜ 🚪', task: 'reach the door', steps: ['Move forward', 'Move forward', 'Move forward', 'Move forward', 'Open door'] },
  { grid: '🤖\n⬜\n🎁', task: 'get the gift (going down)', steps: ['Move down', 'Move down', 'Pick up gift'] },
  { grid: '🤖 ⬛ ⬜\n⬜ ⬜ 🍕', task: 'get the pizza (around wall)', steps: ['Move down', 'Move right', 'Move right', 'Pick up pizza'] },
  { grid: '🐢 ⬜ ⬜ 🥬', task: 'help turtle get lettuce', steps: ['Move forward', 'Move forward', 'Move forward', 'Eat lettuce'] },
  { grid: '🚀 ⬜ ⬜ ⬜ 🌙', task: 'fly to the moon', steps: ['Fly forward', 'Fly forward', 'Fly forward', 'Fly forward', 'Land on moon'] },
  { grid: '🐟 ⬜ ⬜ 🪸', task: 'swim to the coral', steps: ['Swim forward', 'Swim forward', 'Swim forward', 'Touch coral'] },
];

// Following instruction problems
const followTemplates = [
  { steps: ['Go right 2 steps', 'Go up 1 step'], end: 'at the treasure chest 🎁' },
  { steps: ['Jump 3 times', 'Spin around once'], end: 'dizzy but happy! 😵' },
  { steps: ['Clap 2 times', 'Say "Hello!"'], end: 'ready to greet friends 👋' },
  { steps: ['Walk forward 4 steps', 'Turn left'], end: 'facing the window 🪟' },
  { steps: ['Pick up the red ball', 'Put it in the box'], end: 'ball is in the box 📦' },
  { steps: ['Draw a circle', 'Color it yellow'], end: 'you made a sun! ☀️' },
  { steps: ['Count to 5', 'Raise your hand'], end: 'teacher sees you! ✋' },
  { steps: ['Touch your nose', 'Touch your toes'], end: 'great stretching! 🤸' },
];

// Debugging problems
const debugTemplates = [
  { buggy: ['Eat breakfast', 'Wake up', 'Go to school'], bug: 'Wrong order!', fix: 'Wake up should come FIRST, before eating', fixed: ['Wake up', 'Eat breakfast', 'Go to school'] },
  { buggy: ['Put on shoes', 'Put on socks', 'Walk outside'], bug: 'Wrong order!', fix: 'Socks go BEFORE shoes', fixed: ['Put on socks', 'Put on shoes', 'Walk outside'] },
  { buggy: ['Eat cookie', 'Bake cookie', 'Mix ingredients'], bug: 'Wrong order!', fix: 'Must make cookie BEFORE eating it', fixed: ['Mix ingredients', 'Bake cookie', 'Eat cookie'] },
  { buggy: ['Drive car', 'Get in car', 'Start engine'], bug: 'Wrong order!', fix: 'Get in and start engine BEFORE driving', fixed: ['Get in car', 'Start engine', 'Drive car'] },
  { buggy: ['Read book', 'Open book', 'Find book'], bug: 'Wrong order!', fix: 'Find and open book BEFORE reading', fixed: ['Find book', 'Open book', 'Read book'] },
  { buggy: ['Dry hands', 'Wash hands', 'Get soap'], bug: 'Wrong order!', fix: 'Wash BEFORE drying', fixed: ['Get soap', 'Wash hands', 'Dry hands'] },
  { buggy: ['Mail letter', 'Write letter', 'Put in envelope'], bug: 'Wrong order!', fix: 'Write and seal BEFORE mailing', fixed: ['Write letter', 'Put in envelope', 'Mail letter'] },
  { buggy: ['Water is boiling', 'Turn on stove', 'Put pot on stove'], bug: 'Wrong order!', fix: 'Put pot and turn on BEFORE water boils', fixed: ['Put pot on stove', 'Turn on stove', 'Water is boiling'] },
];

// Generate problems
function generateGradeKProblems() {
  const problems = [];
  let idCounter = { SEQ: 1, PATT: 1, INST: 1, FOLL: 1, DBUG: 1 };

  // Sequences - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = sequenceTemplates[i % sequenceTemplates.length];
    const questionSet = template.questions[i % template.questions.length];
    const id = `CODE-G0-SEQ-${String(idCounter.SEQ++).padStart(4, '0')}`;

    problems.push({
      id,
      subject: 'coding',
      grade: 0,
      skill: 'sequences',
      question: `Look at this sequence:\n\n${template.items.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n\n${questionSet.q}`,
      answer: questionSet.a,
      visual_type: 'loop_animation',
      visual_data: { frames: template.items.map(item => ({ label: item })), highlight: questionSet.a },
      tier1: { teach: 'A sequence is steps in order. Look at the numbers 1, 2, 3, 4 to find the order!', visual: { type: 'loop_animation', data: { frames: template.items } } },
      tier2: { teach: 'First, then, next, last! Count the steps.' },
      explanation: 'Sequences go in order like counting: first, second, third, fourth.',
      standard: '1A-AP-08',
      source_file: 'coding-templates-K.json',
    });
  }

  // Patterns - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = patternTemplates[i % patternTemplates.length];
    const id = `CODE-G0-PATT-${String(idCounter.PATT++).padStart(4, '0')}`;

    // Create variations
    const showCount = 3 + (i % 3); // Show 3, 4, or 5 items
    const displayPattern = template.pattern.slice(0, showCount);

    problems.push({
      id,
      subject: 'coding',
      grade: 0,
      skill: 'patterns',
      question: `${template.q}\n\n${displayPattern.join(' ')} ❓`,
      answer: template.next,
      visual_type: 'loop_animation',
      visual_data: { pattern: displayPattern, answer: template.next, type: template.type },
      tier1: { teach: `This is an ${template.type} pattern. The same items repeat over and over!`, visual: { type: 'loop_animation', data: { pattern: template.pattern } } },
      tier2: { teach: 'Look for what repeats. What comes after the last one?' },
      explanation: `This is an ${template.type} pattern where ${template.pattern.slice(0, template.type.length).join(', ')} repeats.`,
      standard: '1A-AP-08',
      source_file: 'coding-templates-K.json',
    });
  }

  // Giving Instructions - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = instructionTemplates[i % instructionTemplates.length];
    const stepNum = (i % template.steps.length);
    const id = `CODE-G0-INST-${String(idCounter.INST++).padStart(4, '0')}`;

    problems.push({
      id,
      subject: 'coding',
      grade: 0,
      skill: 'giving instructions',
      question: `The robot wants to ${template.task}.\n\n${template.grid}\n\nWhat is step ${stepNum + 1}?`,
      answer: template.steps[stepNum],
      options: [template.steps[stepNum], 'Turn around', 'Jump', 'Stop'],
      visual_type: 'code_block',
      visual_data: { grid: template.grid, steps: template.steps, current_step: stepNum + 1 },
      tier1: { teach: 'Robots need clear instructions! Tell them exactly what to do, one step at a time.', visual: { type: 'code_block', data: { steps: template.steps } } },
      tier2: { teach: 'Count the squares. How many steps to the goal?' },
      explanation: `Step ${stepNum + 1} is "${template.steps[stepNum]}" because we need to move toward the goal.`,
      standard: '1A-AP-08',
      source_file: 'coding-templates-K.json',
    });
  }

  // Following Instructions - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = followTemplates[i % followTemplates.length];
    const id = `CODE-G0-FOLL-${String(idCounter.FOLL++).padStart(4, '0')}`;

    problems.push({
      id,
      subject: 'coding',
      grade: 0,
      skill: 'following instructions',
      question: `Follow these instructions:\n\n${template.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\nWhere do you end up?`,
      answer: template.end,
      visual_type: 'loop_animation',
      visual_data: { instructions: template.steps, result: template.end },
      tier1: { teach: 'Do each step in order. First step 1, then step 2, and so on!', visual: { type: 'loop_animation', data: { instructions: template.steps } } },
      tier2: { teach: 'Follow each step carefully. What happens at the end?' },
      explanation: `Following ${template.steps.join(' then ')} leads to ${template.end}.`,
      standard: '1A-AP-08',
      source_file: 'coding-templates-K.json',
    });
  }

  // Debugging - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = debugTemplates[i % debugTemplates.length];
    const id = `CODE-G0-DBUG-${String(idCounter.DBUG++).padStart(4, '0')}`;

    problems.push({
      id,
      subject: 'coding',
      grade: 0,
      skill: 'basic debugging',
      question: `Something is wrong with this sequence! What's the bug?\n\n${template.buggy.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}`,
      answer: template.fix,
      visual_type: 'code_block',
      visual_data: { buggy: template.buggy, fixed: template.fixed, bug: template.bug },
      tier1: { teach: 'A bug is when something is in the wrong place. Think about what should happen FIRST!', visual: { type: 'code_block', data: { buggy: template.buggy, fixed: template.fixed } } },
      tier2: { teach: 'Does this order make sense? What should come first?' },
      explanation: template.fix,
      standard: '1A-AP-08',
      source_file: 'coding-templates-K.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGradeK() {
  console.log('===========================================');
  console.log('SEEDING GRADE K CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGradeKProblems();
  console.log(`Generated ${problems.length} problems for Grade K\n`);

  // Count by skill
  const skillCounts = {};
  problems.forEach(p => {
    skillCounts[p.skill] = (skillCounts[p.skill] || 0) + 1;
  });
  console.log('Breakdown by skill:');
  Object.entries(skillCounts).forEach(([skill, count]) => {
    console.log(`  ${skill}: ${count}`);
  });
  console.log('');

  // Insert in batches of 200
  const batchSize = 200;
  let inserted = 0;

  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('practice_problems')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(problems.length / batchSize)} (${batch.length} problems)`);
    }
  }

  console.log('\n===========================================');
  console.log(`COMPLETE: Inserted ${inserted} Grade K problems`);
  console.log('===========================================');
  console.log('\nTo verify in database:');
  console.log("SELECT COUNT(*) FROM practice_problems WHERE subject = 'coding' AND grade = 0;");
}

seedGradeK().catch(console.error);
