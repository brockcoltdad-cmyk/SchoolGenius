/**
 * Seed Coding Practice Problems - GRADE 1 ONLY
 * Target: ~1,500 problems for Grade 1
 * Skills: algorithms, simple loops, events, sprites/backgrounds, debugging
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 1 Skills - Total 1,500 problems
const GRADE_1_SKILLS = [
  { skill: 'algorithms', code: 'ALGO', count: 300 },
  { skill: 'simple loops', code: 'LOOP', count: 300 },
  { skill: 'events', code: 'EVNT', count: 300 },
  { skill: 'sprites and backgrounds', code: 'SPRT', count: 300 },
  { skill: 'debugging', code: 'DBUG', count: 300 },
];

// Algorithm templates - step by step plans
const algorithmTemplates = [
  { task: 'make a peanut butter sandwich', steps: ['Get two slices of bread', 'Open the peanut butter jar', 'Spread peanut butter on bread', 'Put slices together', 'Eat your sandwich!'] },
  { task: 'brush your teeth', steps: ['Get your toothbrush', 'Put toothpaste on it', 'Brush your teeth', 'Spit and rinse', 'Put toothbrush away'] },
  { task: 'draw a square', steps: ['Put pen down', 'Move forward', 'Turn right 90°', 'Move forward', 'Turn right 90°', 'Move forward', 'Turn right 90°', 'Move forward'] },
  { task: 'get dressed for school', steps: ['Put on underwear', 'Put on shirt', 'Put on pants', 'Put on socks', 'Put on shoes'] },
  { task: 'plant a seed', steps: ['Dig a small hole', 'Put seed in hole', 'Cover with dirt', 'Water the seed', 'Wait for it to grow'] },
  { task: 'make orange juice', steps: ['Get an orange', 'Cut it in half', 'Squeeze the juice out', 'Pour into glass', 'Drink it!'] },
  { task: 'feed your pet', steps: ['Get the pet food', 'Open the container', 'Pour food in bowl', 'Give fresh water', 'Let pet eat'] },
  { task: 'wash your hands', steps: ['Turn on water', 'Get hands wet', 'Add soap', 'Scrub for 20 seconds', 'Rinse off soap', 'Dry hands'] },
  { task: 'make your bed', steps: ['Pull up the sheet', 'Pull up the blanket', 'Fluff the pillow', 'Put pillow at top', 'Smooth out wrinkles'] },
  { task: 'build a tower', steps: ['Get building blocks', 'Put first block down', 'Stack second block', 'Stack third block', 'Keep stacking until tall!'] },
];

// Loop templates
const loopTemplates = [
  { action: 'say "Hello!"', times: 3, output: 'Hello! Hello! Hello!' },
  { action: 'move 10 steps', times: 5, output: 'Sprite moves 50 steps total' },
  { action: 'turn right 90°', times: 4, output: 'Sprite does a full spin (360°)' },
  { action: 'stamp', times: 6, output: '6 stamps appear on screen' },
  { action: 'play drum sound', times: 4, output: 'Drum plays 4 times: 🥁🥁🥁🥁' },
  { action: 'jump up and down', times: 3, output: 'Sprite jumps 3 times' },
  { action: 'change color', times: 5, output: 'Sprite changes color 5 times' },
  { action: 'grow bigger by 10', times: 4, output: 'Sprite grows by 40 total' },
  { action: 'say a number', times: 5, output: 'Says: 1, 2, 3, 4, 5' },
  { action: 'draw a side', times: 4, output: 'Draws a square (4 sides)' },
];

// Event templates
const eventTemplates = [
  { trigger: 'when green flag clicked', action: 'say "Welcome to my game!"', explanation: 'This runs when you click the green flag to start' },
  { trigger: 'when space key pressed', action: 'jump up', explanation: 'Pressing spacebar makes the sprite jump' },
  { trigger: 'when this sprite clicked', action: 'change costume', explanation: 'Clicking the sprite changes how it looks' },
  { trigger: 'when up arrow key pressed', action: 'move up 10 steps', explanation: 'Pressing up arrow moves sprite up' },
  { trigger: 'when down arrow key pressed', action: 'move down 10 steps', explanation: 'Pressing down arrow moves sprite down' },
  { trigger: 'when left arrow key pressed', action: 'turn left 15°', explanation: 'Pressing left arrow turns sprite left' },
  { trigger: 'when right arrow key pressed', action: 'turn right 15°', explanation: 'Pressing right arrow turns sprite right' },
  { trigger: 'when A key pressed', action: 'play meow sound', explanation: 'Pressing A makes the cat meow' },
  { trigger: 'when backdrop switches to forest', action: 'hide', explanation: 'When scene changes to forest, sprite hides' },
  { trigger: 'when I receive "start game"', action: 'go to x:0 y:0', explanation: 'When it gets the message, sprite goes to center' },
];

// Sprite and background templates
const spriteTemplates = [
  { q: 'What is a sprite in Scratch?', a: 'A character or object that can move and do things on the stage' },
  { q: 'How do you add a new sprite?', a: 'Click the cat icon with a plus sign (+) at the bottom right' },
  { q: 'What is the stage in Scratch?', a: 'The white area where sprites move and perform actions' },
  { q: 'What is a backdrop?', a: 'The background picture behind all the sprites' },
  { q: 'How do you make a sprite bigger?', a: 'Use the "set size to" block or drag the size slider' },
  { q: 'How do you make a sprite smaller?', a: 'Use "set size to" with a smaller number (like 50)' },
  { q: 'What is a costume?', a: 'Different looks that a sprite can have' },
  { q: 'How do you change a sprite\'s costume?', a: 'Use the "switch costume to" or "next costume" block' },
  { q: 'How do you hide a sprite?', a: 'Use the "hide" block - the sprite becomes invisible' },
  { q: 'How do you show a hidden sprite?', a: 'Use the "show" block - the sprite becomes visible again' },
  { q: 'What does "go to x: 0 y: 0" do?', a: 'Moves the sprite to the center of the stage' },
  { q: 'What is the green flag for?', a: 'It starts your program when you click it' },
  { q: 'What does the red stop sign do?', a: 'It stops all the code from running' },
  { q: 'How do you delete a sprite?', a: 'Right-click on it and choose "delete"' },
  { q: 'Can you have more than one sprite?', a: 'Yes! You can have many sprites in your project' },
];

// Debugging templates
const debugTemplates = [
  { buggy: 'when green flag clicked\nsay Hello', bug: 'Missing quotes around Hello', fix: 'say "Hello" - text needs quotes!', hint: 'Text messages need quotation marks' },
  { buggy: 'repeat 5\nmove 10 steps', bug: 'Missing "times" after repeat 5', fix: 'repeat 5 times - need the word "times"', hint: 'Repeat blocks need "times"' },
  { buggy: 'when space pressed\njump', bug: '"space pressed" should be "space key pressed"', fix: 'when space key pressed', hint: 'Event blocks need "key" in the name' },
  { buggy: 'move 10\nturn 90', bug: 'Missing "steps" and "degrees"', fix: 'move 10 steps, turn 90 degrees', hint: 'Motion blocks need units (steps, degrees)' },
  { buggy: 'forever\nmove 10 steps\n(no end)', bug: 'Forever loop has no end', fix: 'Add "end" after the last block inside forever', hint: 'Loops need to be closed with "end"' },
  { buggy: 'when clicked\nsay Hi', bug: '"when clicked" should be more specific', fix: 'when this sprite clicked OR when green flag clicked', hint: 'What should be clicked? Be specific!' },
  { buggy: 'repeat 3 times\nstamp\nstamp', bug: 'Both stamps inside loop = 6 stamps, not 3', fix: 'Put only ONE stamp inside the loop for 3 stamps', hint: 'Everything inside the loop repeats!' },
  { buggy: 'set size to 200\nset size to 50', bug: 'Second line overwrites the first - sprite is size 50', fix: 'Remove one of the set size blocks or use "change size"', hint: 'Set size replaces, change size adds' },
];

// Generate problems
function generateGrade1Problems() {
  const problems = [];
  let idCounter = { ALGO: 1, LOOP: 1, EVNT: 1, SPRT: 1, DBUG: 1 };

  // Algorithms - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = algorithmTemplates[i % algorithmTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G1-ALGO-${String(idCounter.ALGO++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      // What's step N?
      const stepNum = (i % template.steps.length);
      question = `Algorithm to ${template.task}:\n\n${template.steps.map((s, idx) => `${idx + 1}. ${idx === stepNum ? '???' : s}`).join('\n')}\n\nWhat is step ${stepNum + 1}?`;
      answer = template.steps[stepNum];
    } else if (questionType === 1) {
      // What comes after step X?
      const stepNum = i % (template.steps.length - 1);
      question = `Algorithm to ${template.task}:\n\nAfter "${template.steps[stepNum]}", what comes next?`;
      answer = template.steps[stepNum + 1];
    } else if (questionType === 2) {
      // How many steps?
      question = `Algorithm to ${template.task}:\n\n${template.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\nHow many steps are in this algorithm?`;
      answer = String(template.steps.length);
    } else {
      // What's the first/last step?
      const isFirst = i % 2 === 0;
      question = `Algorithm to ${template.task}:\n\nWhat is the ${isFirst ? 'FIRST' : 'LAST'} step?`;
      answer = isFirst ? template.steps[0] : template.steps[template.steps.length - 1];
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 1,
      skill: 'algorithms',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { task: template.task, steps: template.steps },
      tier1: { teach: 'An algorithm is a step-by-step plan. Think about what needs to happen FIRST, NEXT, and LAST!', visual: { type: 'code_block', data: { steps: template.steps } } },
      tier2: { teach: 'Read each step carefully. What makes sense to do in that order?' },
      explanation: `To ${template.task}, you follow these steps in order: ${template.steps.join(' → ')}`,
      standard: '1A-AP-10',
      source_file: 'coding-templates-G1.json',
    });
  }

  // Simple Loops - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = loopTemplates[i % loopTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G1-LOOP-${String(idCounter.LOOP++).padStart(4, '0')}`;

    let question, answer;
    const times = [2, 3, 4, 5, 6][i % 5]; // Vary the repeat count

    if (questionType === 0) {
      // What happens?
      question = `What happens when you run this code?\n\nrepeat ${times} times:\n    ${template.action}`;
      answer = `${template.action} happens ${times} times`;
    } else if (questionType === 1) {
      // How many times?
      question = `repeat ${times} times:\n    ${template.action}\n\nHow many times does "${template.action}" happen?`;
      answer = String(times);
    } else {
      // Fill in the blank
      question = `I want to ${template.action} exactly ${times} times.\n\nrepeat ___ times:\n    ${template.action}\n\nWhat number goes in the blank?`;
      answer = String(times);
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 1,
      skill: 'simple loops',
      question,
      answer,
      visual_type: 'loop_animation',
      visual_data: { iterations: times, action: template.action },
      tier1: { teach: 'A loop repeats code! "Repeat 3 times" means do it 3 times. Count on your fingers!', visual: { type: 'loop_animation', data: { iterations: times, action: template.action } } },
      tier2: { teach: 'The number tells you how many times. Count: 1, 2, 3...' },
      explanation: `Repeat ${times} times means the action happens ${times} times.`,
      standard: '1A-AP-10',
      source_file: 'coding-templates-G1.json',
    });
  }

  // Events - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = eventTemplates[i % eventTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G1-EVNT-${String(idCounter.EVNT++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      // What does this do?
      question = `What does this code do?\n\n${template.trigger}\n    ${template.action}`;
      answer = template.explanation;
    } else if (questionType === 1) {
      // When does it happen?
      question = `${template.trigger}\n    ${template.action}\n\nWhen does "${template.action}" happen?`;
      answer = template.trigger.replace('when ', 'When ');
    } else {
      // What action happens?
      question = `${template.trigger}\n    ???\n\nIf we want to "${template.action}", what goes in the ???`;
      answer = template.action;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 1,
      skill: 'events',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { trigger: template.trigger, action: template.action },
      tier1: { teach: 'Events are "when" blocks! They wait for something to happen, THEN run the code inside.', visual: { type: 'code_block', data: { trigger: template.trigger, action: template.action } } },
      tier2: { teach: 'Look at the "when" part. That tells you what starts the code!' },
      explanation: template.explanation,
      standard: '1A-AP-10',
      source_file: 'coding-templates-G1.json',
    });
  }

  // Sprites and Backgrounds - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = spriteTemplates[i % spriteTemplates.length];
    const id = `CODE-G1-SPRT-${String(idCounter.SPRT++).padStart(4, '0')}`;

    problems.push({
      id,
      subject: 'coding',
      grade: 1,
      skill: 'sprites and backgrounds',
      question: template.q,
      answer: template.a,
      visual_type: 'output',
      visual_data: { concept: 'sprites', question: template.q },
      tier1: { teach: 'Sprites are the characters! The stage is where they perform. Costumes are how they look!', visual: { type: 'output', data: { concept: 'sprites' } } },
      tier2: { teach: 'Think of sprites like actors on a stage in a play!' },
      explanation: template.a,
      standard: '1A-AP-10',
      source_file: 'coding-templates-G1.json',
    });
  }

  // Debugging - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = debugTemplates[i % debugTemplates.length];
    const questionType = i % 2;
    const id = `CODE-G1-DBUG-${String(idCounter.DBUG++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      // What's the bug?
      question = `This code has a bug! What's wrong?\n\n${template.buggy}`;
      answer = template.bug;
    } else {
      // How do you fix it?
      question = `This code has a bug:\n\n${template.buggy}\n\nHow do you fix it?`;
      answer = template.fix;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 1,
      skill: 'debugging',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { buggy: template.buggy, fix: template.fix, hint: template.hint },
      tier1: { teach: 'A bug is a mistake in code. Read carefully! Check spelling, missing words, and order.', visual: { type: 'code_block', data: { buggy: template.buggy, fix: template.fix } } },
      tier2: { teach: `Hint: ${template.hint}` },
      explanation: template.fix,
      standard: '1A-AP-10',
      source_file: 'coding-templates-G1.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade1() {
  console.log('===========================================');
  console.log('SEEDING GRADE 1 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade1Problems();
  console.log(`Generated ${problems.length} problems for Grade 1\n`);

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
  console.log(`COMPLETE: Inserted ${inserted} Grade 1 problems`);
  console.log('===========================================');
}

seedGrade1().catch(console.error);
