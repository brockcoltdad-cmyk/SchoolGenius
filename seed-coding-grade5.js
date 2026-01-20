/**
 * Seed Coding Practice Problems - GRADE 5 ONLY
 * Target: ~1,500 problems for Grade 5
 * Skills: functions with inputs, lists/arrays, string operations, coordinates, python basics
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 5 Skills - Total 1,500 problems
const GRADE_5_SKILLS = [
  { skill: 'functions with inputs', code: 'FUNC', count: 300 },
  { skill: 'lists arrays', code: 'LIST', count: 300 },
  { skill: 'string operations', code: 'STRN', count: 300 },
  { skill: 'coordinate system', code: 'CORD', count: 300 },
  { skill: 'python basics', code: 'PYTH', count: 300 },
];

// Functions with inputs templates
const functionTemplates = [
  { name: 'jump', param: 'height', body: 'change y by (height)\nwait 0.2\nchange y by (height * -1)', call: 'jump (50)', result: 'Jumps 50 pixels high' },
  { name: 'jump', param: 'height', body: 'change y by (height)\nwait 0.2\nchange y by (height * -1)', call: 'jump (100)', result: 'Jumps 100 pixels high' },
  { name: 'drawSquare', param: 'size', body: 'repeat 4:\n  move (size) steps\n  turn 90', call: 'drawSquare (50)', result: 'Draws a 50-pixel square' },
  { name: 'drawSquare', param: 'size', body: 'repeat 4:\n  move (size) steps\n  turn 90', call: 'drawSquare (100)', result: 'Draws a 100-pixel square' },
  { name: 'sayHello', param: 'name', body: 'say (join "Hello " (name))', call: 'sayHello ("Emma")', result: 'Says "Hello Emma"' },
  { name: 'moveSteps', param: 'steps', body: 'repeat (steps):\n  move 10\n  wait 0.1', call: 'moveSteps (5)', result: 'Moves 50 pixels slowly (5 × 10)' },
  { name: 'flash', param: 'times', body: 'repeat (times):\n  hide\n  wait 0.1\n  show\n  wait 0.1', call: 'flash (3)', result: 'Flashes 3 times' },
  { name: 'grow', param: 'amount', body: 'change size by (amount)', call: 'grow (25)', result: 'Grows 25% bigger' },
  { name: 'spin', param: 'degrees', body: 'turn (degrees)', call: 'spin (180)', result: 'Turns 180 degrees (half turn)' },
  { name: 'wait', param: 'seconds', body: 'wait (seconds) seconds', call: 'wait (2)', result: 'Waits 2 seconds' },
];

// Lists/arrays templates
const listTemplates = [
  { code: 'add "apple" to [fruits]\nadd "banana" to [fruits]\nitem 1 of [fruits]', answer: 'apple', explanation: 'Item 1 is the first thing added' },
  { code: 'add "apple" to [fruits]\nadd "banana" to [fruits]\nitem 2 of [fruits]', answer: 'banana', explanation: 'Item 2 is the second thing added' },
  { code: 'add "cat" to [pets]\nadd "dog" to [pets]\nadd "bird" to [pets]\nlength of [pets]', answer: '3', explanation: 'Length counts how many items' },
  { code: 'add 100 to [scores]\nadd 85 to [scores]\nadd 90 to [scores]\nitem 2 of [scores]', answer: '85', explanation: 'Item 2 is the second score' },
  { code: 'set [items] to ["hat", "sword", "shield"]\nlength of [items]', answer: '3', explanation: '3 items in the list' },
  { code: 'set [items] to ["hat", "sword", "shield"]\nitem 3 of [items]', answer: 'shield', explanation: 'Item 3 is shield' },
  { code: 'add "red" to [colors]\ndelete 1 of [colors]\nlength of [colors]', answer: '0', explanation: 'Added 1, deleted 1 = empty list' },
  { code: 'set [nums] to [10, 20, 30, 40]\nitem (length of [nums]) of [nums]', answer: '40', explanation: 'Length is 4, item 4 is 40 (last item)' },
  { code: 'set [letters] to ["a", "b", "c"]\nreplace item 2 of [letters] with "x"\nitem 2 of [letters]', answer: 'x', explanation: 'Replaced b with x' },
  { code: 'set [words] to ["hello", "world"]\n[words] contains "hello"?', answer: 'true', explanation: 'hello is in the list' },
];

// String operations templates
const stringTemplates = [
  { op: 'join "Hello " "World"', result: 'Hello World', explanation: 'Join connects two strings' },
  { op: 'join "Hi " "Emma"', result: 'Hi Emma', explanation: 'Join puts strings together' },
  { op: 'length of "Python"', result: '6', explanation: 'Count the letters: P-y-t-h-o-n = 6' },
  { op: 'length of "Hello"', result: '5', explanation: 'H-e-l-l-o = 5 letters' },
  { op: 'letter 1 of "Code"', result: 'C', explanation: 'Letter 1 is the first letter' },
  { op: 'letter 3 of "Code"', result: 'd', explanation: 'C-o-d = letter 3 is d' },
  { op: 'letter 5 of "Scratch"', result: 't', explanation: 'S-c-r-a-t = letter 5 is t' },
  { op: 'join (join "A" "B") "C"', result: 'ABC', explanation: 'First join AB, then join ABC' },
  { op: 'length of "I love coding!"', result: '14', explanation: 'Count all characters including spaces' },
  { op: 'letter (length of "Hi") of "Hi"', result: 'i', explanation: 'Length is 2, letter 2 is i' },
  { op: 'join "Score: " "100"', result: 'Score: 100', explanation: 'Combine label with value' },
  { op: 'join "" "test"', result: 'test', explanation: 'Empty string + test = test' },
];

// Coordinate system templates
const coordinateTemplates = [
  { start: { x: 0, y: 0 }, code: 'change x by 50', end: { x: 50, y: 0 }, explanation: 'Moves right 50' },
  { start: { x: 0, y: 0 }, code: 'change x by -50', end: { x: -50, y: 0 }, explanation: 'Moves left 50' },
  { start: { x: 0, y: 0 }, code: 'change y by 50', end: { x: 0, y: 50 }, explanation: 'Moves up 50' },
  { start: { x: 0, y: 0 }, code: 'change y by -50', end: { x: 0, y: -50 }, explanation: 'Moves down 50' },
  { start: { x: 100, y: 50 }, code: 'go to x: 0 y: 0', end: { x: 0, y: 0 }, explanation: 'Goes to center' },
  { start: { x: -100, y: -100 }, code: 'set x to 200', end: { x: 200, y: -100 }, explanation: 'Only x changes' },
  { start: { x: 50, y: 50 }, code: 'set y to -50', end: { x: 50, y: -50 }, explanation: 'Only y changes' },
  { start: { x: 0, y: 0 }, code: 'change x by 30\nchange y by 40', end: { x: 30, y: 40 }, explanation: 'Both x and y change' },
  { start: { x: 100, y: 100 }, code: 'change x by -100\nchange y by -100', end: { x: 0, y: 0 }, explanation: 'Goes back to center' },
  { start: { x: -240, y: 0 }, code: 'set x to 240', end: { x: 240, y: 0 }, explanation: 'Teleports from left edge to right edge' },
];

// Python basics templates
const pythonTemplates = [
  { code: 'print("Hello World!")', output: 'Hello World!', concept: 'print displays text' },
  { code: 'print("Python is fun!")', output: 'Python is fun!', concept: 'print outputs to screen' },
  { code: 'name = "Emma"\nprint(name)', output: 'Emma', concept: 'variables store values' },
  { code: 'x = 5\ny = 3\nprint(x + y)', output: '8', concept: 'variables can do math' },
  { code: 'age = 10\nprint("I am " + str(age))', output: 'I am 10', concept: 'str() converts number to text' },
  { code: 'name = input("Name? ")\nprint("Hi " + name)', output: 'Hi [whatever they typed]', concept: 'input() asks user for text' },
  { code: 'x = 10\nx = x + 5\nprint(x)', output: '15', concept: 'variables can be updated' },
  { code: 'print(3 * 4)', output: '12', concept: '* means multiply' },
  { code: 'print(10 / 2)', output: '5.0', concept: '/ means divide (gives decimal)' },
  { code: 'print(10 // 3)', output: '3', concept: '// means integer divide (no decimal)' },
  { code: 'print(10 % 3)', output: '1', concept: '% means remainder (10÷3 = 3 R1)' },
  { code: 'print("a" + "b" + "c")', output: 'abc', concept: '+ joins strings together' },
  { code: 'word = "Python"\nprint(len(word))', output: '6', concept: 'len() counts characters' },
  { code: 'nums = [1, 2, 3]\nprint(nums[0])', output: '1', concept: 'Lists start at index 0' },
  { code: 'nums = [1, 2, 3]\nprint(len(nums))', output: '3', concept: 'len() works on lists too' },
];

// Generate problems
function generateGrade5Problems() {
  const problems = [];
  let idCounter = { FUNC: 1, LIST: 1, STRN: 1, CORD: 1, PYTH: 1 };

  // Functions with inputs - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = functionTemplates[i % functionTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G5-FUNC-${String(idCounter.FUNC++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `define ${template.name} (${template.param})\n    ${template.body.split('\n').join('\n    ')}\n\nCalling: ${template.call}\n\nWhat happens?`;
      answer = template.result;
    } else if (questionType === 1) {
      question = `define ${template.name} (${template.param})\n\nWhat is "(${template.param})" for?`;
      answer = `It's an input - you pass different values when you call ${template.name}`;
    } else if (questionType === 2) {
      const value = template.call.match(/\(([^)]+)\)/)[1];
      question = `${template.call}\n\nWhat value is passed to the ${template.param} input?`;
      answer = value;
    } else {
      question = `I want a function that ${template.result.toLowerCase()}.\n\nWhat should I call it?`;
      answer = template.name;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 5,
      skill: 'functions with inputs',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { name: template.name, param: template.param, call: template.call },
      tier1: { teach: 'Functions with inputs are flexible! The input value gets used inside the function.' },
      tier2: { teach: `(${template.param}) is like a blank that gets filled when you call the function.` },
      explanation: `${template.call} → ${template.result}`,
      standard: '1B-AP-12',
      source_file: 'coding-templates-G5.json',
    });
  }

  // Lists/arrays - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = listTemplates[i % listTemplates.length];
    const questionType = i % 2;
    const id = `CODE-G5-LIST-${String(idCounter.LIST++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the result?\n\n${template.code}`;
      answer = template.answer;
    } else {
      question = `${template.code}\n\nExplain why the answer is ${template.answer}.`;
      answer = template.explanation;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 5,
      skill: 'lists arrays',
      question,
      answer,
      visual_type: 'variable_box',
      visual_data: { code: template.code, result: template.answer },
      tier1: { teach: 'Lists hold multiple items! Item 1 is first, item 2 is second. Length counts them.' },
      tier2: { teach: template.explanation },
      explanation: template.explanation,
      standard: '1B-AP-12',
      source_file: 'coding-templates-G5.json',
    });
  }

  // String operations - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = stringTemplates[i % stringTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G5-STRN-${String(idCounter.STRN++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the result of:\n\n${template.op}`;
      answer = template.result;
    } else if (questionType === 1) {
      question = `${template.op} = ${template.result}\n\nExplain why.`;
      answer = template.explanation;
    } else {
      question = `I want the result to be "${template.result}".\n\nWhat string operation should I use?`;
      answer = template.op;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 5,
      skill: 'string operations',
      question,
      answer,
      visual_type: 'output',
      visual_data: { operation: template.op, result: template.result },
      tier1: { teach: 'JOIN sticks strings together. LENGTH counts characters. LETTER gets one character.' },
      tier2: { teach: template.explanation },
      explanation: `${template.op} = ${template.result}. ${template.explanation}`,
      standard: '1B-AP-12',
      source_file: 'coding-templates-G5.json',
    });
  }

  // Coordinate system - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = coordinateTemplates[i % coordinateTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G5-CORD-${String(idCounter.CORD++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `Sprite starts at x: ${template.start.x}, y: ${template.start.y}\n\n${template.code}\n\nWhere is the sprite now?`;
      answer = `x: ${template.end.x}, y: ${template.end.y}`;
    } else if (questionType === 1) {
      question = `Sprite goes from (${template.start.x}, ${template.start.y}) to (${template.end.x}, ${template.end.y}).\n\nWhat code did this?`;
      answer = template.code;
    } else {
      question = `${template.code}\n\nStarting at (${template.start.x}, ${template.start.y}), explain what happens.`;
      answer = template.explanation;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 5,
      skill: 'coordinate system',
      question,
      answer,
      visual_type: 'output',
      visual_data: { start: template.start, end: template.end, code: template.code },
      tier1: { teach: 'X is left-right (negative=left, positive=right). Y is up-down (negative=down, positive=up).' },
      tier2: { teach: template.explanation },
      explanation: `Start: (${template.start.x}, ${template.start.y}) → ${template.code} → End: (${template.end.x}, ${template.end.y})`,
      standard: '1B-AP-12',
      source_file: 'coding-templates-G5.json',
    });
  }

  // Python basics - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = pythonTemplates[i % pythonTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G5-PYTH-${String(idCounter.PYTH++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What does this Python code output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nOutput: ${template.output}\n\nWhat concept does this show?`;
      answer = template.concept;
    } else {
      question = `In Python:\n\n${template.code}\n\nExplain what each line does.`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 5,
      skill: 'python basics',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'Python is text-based coding! print() shows output, variables store data, input() asks questions.' },
      tier2: { teach: template.concept },
      explanation: `${template.code} → ${template.output}. ${template.concept}`,
      standard: '1B-AP-12',
      source_file: 'coding-templates-G5.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade5() {
  console.log('===========================================');
  console.log('SEEDING GRADE 5 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade5Problems();
  console.log(`Generated ${problems.length} problems for Grade 5\n`);

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
  console.log(`COMPLETE: Inserted ${inserted} Grade 5 problems`);
  console.log('===========================================');
}

seedGrade5().catch(console.error);
