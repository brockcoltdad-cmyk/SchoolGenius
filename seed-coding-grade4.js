/**
 * Seed Coding Practice Problems - GRADE 4 ONLY
 * Target: ~1,500 problems for Grade 4
 * Skills: nested loops, complex conditionals, operators, random numbers, custom blocks
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 4 Skills - Total 1,500 problems
const GRADE_4_SKILLS = [
  { skill: 'nested loops', code: 'NEST', count: 300 },
  { skill: 'complex conditionals', code: 'COMP', count: 300 },
  { skill: 'operators', code: 'OPER', count: 300 },
  { skill: 'random numbers', code: 'RAND', count: 300 },
  { skill: 'custom blocks', code: 'FUNC', count: 300 },
];

// Nested loops templates
const nestedLoopTemplates = [
  { outer: 3, inner: 4, action: 'stamp', total: 12, description: 'Creates a 3x4 grid of stamps' },
  { outer: 5, inner: 5, action: 'draw line', total: 25, description: 'Draws 25 lines total' },
  { outer: 2, inner: 6, action: 'play note', total: 12, description: 'Plays 12 notes' },
  { outer: 4, inner: 3, action: 'say "Hi"', total: 12, description: 'Says Hi 12 times' },
  { outer: 3, inner: 3, action: 'move and turn', total: 9, description: 'Makes a pattern with 9 moves' },
  { outer: 2, inner: 5, action: 'change color', total: 10, description: 'Changes color 10 times' },
  { outer: 6, inner: 2, action: 'jump', total: 12, description: 'Jumps 12 times total' },
  { outer: 4, inner: 4, action: 'place block', total: 16, description: 'Places 16 blocks (4x4 grid)' },
  { outer: 3, inner: 5, action: 'add coin', total: 15, description: 'Adds 15 coins' },
  { outer: 2, inner: 8, action: 'spin', total: 16, description: 'Spins 16 times' },
];

// Complex conditionals (AND, OR, NOT)
const complexCondTemplates = [
  { cond: 'score > 10 AND lives > 0', values: { score: 15, lives: 3 }, result: true, explanation: 'Both true: 15>10 ✓ AND 3>0 ✓' },
  { cond: 'score > 10 AND lives > 0', values: { score: 15, lives: 0 }, result: false, explanation: '15>10 ✓ BUT 0>0 ✗ - AND needs BOTH true' },
  { cond: 'score > 10 AND lives > 0', values: { score: 5, lives: 3 }, result: false, explanation: '5>10 ✗ - AND needs BOTH true' },
  { cond: 'score > 50 OR coins > 100', values: { score: 30, coins: 150 }, result: true, explanation: '30>50 ✗ BUT 150>100 ✓ - OR needs ONE true' },
  { cond: 'score > 50 OR coins > 100', values: { score: 75, coins: 50 }, result: true, explanation: '75>50 ✓ - OR needs just ONE true' },
  { cond: 'score > 50 OR coins > 100', values: { score: 30, coins: 50 }, result: false, explanation: '30>50 ✗ AND 50>100 ✗ - OR needs at least one' },
  { cond: 'NOT touching wall', values: { touching: false }, result: true, explanation: 'NOT flips false to true' },
  { cond: 'NOT touching wall', values: { touching: true }, result: false, explanation: 'NOT flips true to false' },
  { cond: 'key pressed AND NOT paused', values: { keyPressed: true, paused: false }, result: true, explanation: 'Key ✓ AND NOT paused (false→true) ✓' },
  { cond: 'health > 0 AND NOT game over', values: { health: 50, gameOver: false }, result: true, explanation: '50>0 ✓ AND NOT false = true ✓' },
];

// Operators templates
const operatorTemplates = [
  { expression: '5 + 3', answer: 8, type: 'addition' },
  { expression: '10 - 4', answer: 6, type: 'subtraction' },
  { expression: '6 * 7', answer: 42, type: 'multiplication' },
  { expression: '20 / 4', answer: 5, type: 'division' },
  { expression: '17 mod 5', answer: 2, type: 'modulo (remainder)' },
  { expression: '3 + 4 * 2', answer: 11, type: 'order of operations (multiply first)' },
  { expression: '(3 + 4) * 2', answer: 14, type: 'parentheses first' },
  { expression: '10 - 2 - 3', answer: 5, type: 'left to right' },
  { expression: '2 * 3 + 4 * 2', answer: 14, type: 'multiply both, then add' },
  { expression: 'round(4.7)', answer: 5, type: 'rounding' },
  { expression: 'round(4.2)', answer: 4, type: 'rounding down' },
  { expression: 'abs(-5)', answer: 5, type: 'absolute value' },
  { expression: '15 mod 4', answer: 3, type: 'modulo' },
  { expression: '100 / 10 / 2', answer: 5, type: 'left to right division' },
  { expression: '2 + 2 * 2 + 2', answer: 8, type: 'PEMDAS' },
];

// Comparison operators
const comparisonTemplates = [
  { left: 10, op: '>', right: 5, result: true },
  { left: 3, op: '>', right: 8, result: false },
  { left: 7, op: '<', right: 12, result: true },
  { left: 15, op: '<', right: 10, result: false },
  { left: 5, op: '=', right: 5, result: true },
  { left: 5, op: '=', right: 6, result: false },
  { left: 10, op: '>=', right: 10, result: true },
  { left: 10, op: '>=', right: 11, result: false },
  { left: 8, op: '<=', right: 8, result: true },
  { left: 9, op: '<=', right: 7, result: false },
];

// Random numbers templates
const randomTemplates = [
  { min: 1, max: 6, purpose: 'dice roll', possibleValues: '1, 2, 3, 4, 5, or 6' },
  { min: 1, max: 10, purpose: 'random number game', possibleValues: '1 through 10' },
  { min: 1, max: 100, purpose: 'random score', possibleValues: '1 through 100' },
  { min: 0, max: 360, purpose: 'random direction', possibleValues: '0 to 360 degrees' },
  { min: -240, max: 240, purpose: 'random x position', possibleValues: 'anywhere on stage horizontally' },
  { min: -180, max: 180, purpose: 'random y position', possibleValues: 'anywhere on stage vertically' },
  { min: 50, max: 200, purpose: 'random size', possibleValues: '50% to 200% size' },
  { min: 1, max: 4, purpose: 'random costume', possibleValues: '1, 2, 3, or 4' },
  { min: 0, max: 1, purpose: 'coin flip (0=heads, 1=tails)', possibleValues: '0 or 1' },
  { min: 1, max: 52, purpose: 'random card from deck', possibleValues: '1 through 52' },
];

// Custom blocks (functions) templates
const customBlockTemplates = [
  { name: 'jump', params: [], body: 'change y by 50\nwait 0.2\nchange y by -50', use: 'Makes sprite jump up and back down' },
  { name: 'spin', params: [], body: 'repeat 36:\n  turn 10 degrees', use: 'Makes sprite do a full 360° spin' },
  { name: 'jump', params: ['height'], body: 'change y by (height)\nwait 0.2\nchange y by (height * -1)', use: 'Jump any height you specify' },
  { name: 'moveSquare', params: ['size'], body: 'repeat 4:\n  move (size) steps\n  turn 90 degrees', use: 'Walk in a square of any size' },
  { name: 'sayHello', params: ['name'], body: 'say (join "Hello " (name)) for 2 secs', use: 'Greet someone by name' },
  { name: 'drawStar', params: ['size'], body: 'repeat 5:\n  move (size)\n  turn 144 degrees', use: 'Draw a star of any size' },
  { name: 'bounce', params: [], body: 'if touching edge then\n  turn 180 degrees', use: 'Bounces off walls' },
  { name: 'flash', params: ['times'], body: 'repeat (times):\n  hide\n  wait 0.1\n  show\n  wait 0.1', use: 'Makes sprite flash visible/invisible' },
  { name: 'grow', params: ['amount'], body: 'repeat (amount):\n  change size by 1\n  wait 0.05', use: 'Gradually grow bigger' },
  { name: 'teleport', params: [], body: 'set x to (random -200 to 200)\nset y to (random -150 to 150)', use: 'Move to random position' },
];

// Generate problems
function generateGrade4Problems() {
  const problems = [];
  let idCounter = { NEST: 1, COMP: 1, OPER: 1, RAND: 1, FUNC: 1 };

  // Nested loops - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = nestedLoopTemplates[i % nestedLoopTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G4-NEST-${String(idCounter.NEST++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `repeat ${template.outer} times:\n    repeat ${template.inner} times:\n        ${template.action}\n\nHow many times does "${template.action}" happen?`;
      answer = String(template.total);
    } else if (questionType === 1) {
      question = `repeat ${template.outer} times:\n    repeat ${template.inner} times:\n        ${template.action}\n\nWhat is ${template.outer} × ${template.inner}?`;
      answer = String(template.total);
    } else if (questionType === 2) {
      question = `I want "${template.action}" to happen ${template.total} times using nested loops.\n\nrepeat ___ times:\n    repeat ${template.inner} times:\n        ${template.action}\n\nWhat number goes in the blank?`;
      answer = String(template.outer);
    } else {
      question = `repeat ${template.outer} times:\n    repeat ${template.inner} times:\n        ${template.action}\n\nWhat does this create?`;
      answer = template.description;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 4,
      skill: 'nested loops',
      question,
      answer,
      visual_type: 'loop_animation',
      visual_data: { outer: template.outer, inner: template.inner, total: template.total },
      tier1: { teach: `Nested loops multiply! Outer (${template.outer}) × Inner (${template.inner}) = ${template.total} total times.` },
      tier2: { teach: 'Multiply the two loop numbers to find how many times the action happens.' },
      explanation: `${template.outer} × ${template.inner} = ${template.total}. ${template.description}`,
      standard: '1B-AP-11',
      source_file: 'coding-templates-G4.json',
    });
  }

  // Complex conditionals - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = complexCondTemplates[i % complexCondTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G4-COMP-${String(idCounter.COMP++).padStart(4, '0')}`;

    let question, answer;
    const valuesStr = Object.entries(template.values).map(([k, v]) => `${k} = ${v}`).join(', ');

    if (questionType === 0) {
      question = `if <${template.cond}> then\n    do something\nend\n\nValues: ${valuesStr}\n\nIs the condition TRUE or FALSE?`;
      answer = template.result ? 'TRUE' : 'FALSE';
    } else if (questionType === 1) {
      question = `<${template.cond}>\n\nValues: ${valuesStr}\n\nExplain why this is ${template.result ? 'TRUE' : 'FALSE'}.`;
      answer = template.explanation;
    } else {
      const keyword = template.cond.includes('AND') ? 'AND' : template.cond.includes('OR') ? 'OR' : 'NOT';
      question = `The ${keyword} operator:\n\nif <${template.cond}> then...\n\nHow does ${keyword} work?`;
      if (keyword === 'AND') answer = 'AND needs BOTH conditions to be true';
      else if (keyword === 'OR') answer = 'OR needs at least ONE condition to be true';
      else answer = 'NOT flips true to false, and false to true';
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 4,
      skill: 'complex conditionals',
      question,
      answer,
      visual_type: 'conditional',
      visual_data: { condition: template.cond, values: template.values, result: template.result },
      tier1: { teach: 'AND = both must be true. OR = at least one true. NOT = flip the value.' },
      tier2: { teach: template.explanation },
      explanation: template.explanation,
      standard: '1B-AP-11',
      source_file: 'coding-templates-G4.json',
    });
  }

  // Operators - 300 problems (mix of math and comparison)
  for (let i = 0; i < 300; i++) {
    const id = `CODE-G4-OPER-${String(idCounter.OPER++).padStart(4, '0')}`;
    let question, answer, explanation;

    if (i < 200) {
      // Math operators
      const template = operatorTemplates[i % operatorTemplates.length];
      const questionType = i % 2;

      if (questionType === 0) {
        question = `What is the result?\n\n${template.expression}`;
        answer = String(template.answer);
        explanation = `${template.expression} = ${template.answer} (${template.type})`;
      } else {
        question = `${template.expression} = ${template.answer}\n\nWhat type of operation is this?`;
        answer = template.type;
        explanation = `This is ${template.type}`;
      }
    } else {
      // Comparison operators
      const template = comparisonTemplates[i % comparisonTemplates.length];
      question = `Is this TRUE or FALSE?\n\n${template.left} ${template.op} ${template.right}`;
      answer = template.result ? 'TRUE' : 'FALSE';
      explanation = `${template.left} ${template.op} ${template.right} is ${template.result ? 'TRUE' : 'FALSE'}`;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 4,
      skill: 'operators',
      question,
      answer,
      visual_type: 'output',
      visual_data: { expression: question },
      tier1: { teach: 'Remember PEMDAS: Parentheses, Exponents, Multiply/Divide, Add/Subtract!' },
      tier2: { teach: 'Do multiplication and division before addition and subtraction.' },
      explanation,
      standard: '1B-AP-11',
      source_file: 'coding-templates-G4.json',
    });
  }

  // Random numbers - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = randomTemplates[i % randomTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G4-RAND-${String(idCounter.RAND++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `pick random ${template.min} to ${template.max}\n\nWhat values could this give you?`;
      answer = template.possibleValues;
    } else if (questionType === 1) {
      question = `I want a ${template.purpose}.\n\nWhat random block should I use?`;
      answer = `pick random ${template.min} to ${template.max}`;
    } else if (questionType === 2) {
      question = `set x to (pick random ${template.min} to ${template.max})\n\nCould x be ${template.min}?`;
      answer = 'Yes, the minimum value is included';
    } else {
      question = `set x to (pick random ${template.min} to ${template.max})\n\nCould x be ${template.max + 1}?`;
      answer = `No, the maximum is ${template.max}`;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 4,
      skill: 'random numbers',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { min: template.min, max: template.max, purpose: template.purpose },
      tier1: { teach: `Random picks any number from ${template.min} to ${template.max}, including both ends!` },
      tier2: { teach: 'Every number in the range has an equal chance of being picked.' },
      explanation: `pick random ${template.min} to ${template.max} is used for: ${template.purpose}`,
      standard: '1B-AP-11',
      source_file: 'coding-templates-G4.json',
    });
  }

  // Custom blocks - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = customBlockTemplates[i % customBlockTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G4-FUNC-${String(idCounter.FUNC++).padStart(4, '0')}`;

    let question, answer;
    const paramsStr = template.params.length > 0 ? `(${template.params.join(', ')})` : '';

    if (questionType === 0) {
      question = `define ${template.name}${paramsStr}\n    ${template.body.split('\n').join('\n    ')}\n\nWhat does the "${template.name}" block do when called?`;
      answer = template.use;
    } else if (questionType === 1) {
      question = `I want to ${template.use}.\n\nWhat should I name my custom block?`;
      answer = template.name;
    } else if (questionType === 2) {
      question = `define ${template.name}${paramsStr}\n    ${template.body.split('\n').join('\n    ')}\n\nDoes this block have inputs (parameters)?`;
      answer = template.params.length > 0 ? `Yes: ${template.params.join(', ')}` : 'No, it has no inputs';
    } else {
      question = `Why is it useful to make a "${template.name}" custom block instead of copying the code each time?`;
      answer = 'Custom blocks make code reusable - write once, use many times!';
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 4,
      skill: 'custom blocks',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { name: template.name, params: template.params, body: template.body },
      tier1: { teach: 'Custom blocks are YOUR OWN blocks! Define once, use anywhere. They make code cleaner!' },
      tier2: { teach: 'Think of custom blocks like teaching Scratch a new trick.' },
      explanation: `${template.name}${paramsStr}: ${template.use}`,
      standard: '1B-AP-11',
      source_file: 'coding-templates-G4.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade4() {
  console.log('===========================================');
  console.log('SEEDING GRADE 4 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade4Problems();
  console.log(`Generated ${problems.length} problems for Grade 4\n`);

  const skillCounts = {};
  problems.forEach(p => {
    skillCounts[p.skill] = (skillCounts[p.skill] || 0) + 1;
  });
  console.log('Breakdown by skill:');
  Object.entries(skillCounts).forEach(([skill, count]) => {
    console.log(`  ${skill}: ${count}`);
  });
  console.log('');

  const batchSize = 200;
  let inserted = 0;

  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);

    const { error } = await supabase
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
  console.log(`COMPLETE: Inserted ${inserted} Grade 4 problems`);
  console.log('===========================================');
}

seedGrade4().catch(console.error);
