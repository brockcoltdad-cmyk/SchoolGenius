/**
 * Seed Coding Practice Problems - GRADE 3 ONLY
 * Target: ~2,000 problems for Grade 3
 * Skills: conditionals if/then, conditionals if/else, variables, user input, broadcast messages
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 3 Skills - Total 2,000 problems
const GRADE_3_SKILLS = [
  { skill: 'conditionals if/then', code: 'COND', count: 400 },
  { skill: 'conditionals if/else', code: 'CELS', count: 400 },
  { skill: 'variables introduction', code: 'VAR', count: 400 },
  { skill: 'user input', code: 'INPT', count: 400 },
  { skill: 'broadcast messages', code: 'BCST', count: 400 },
];

// If/then conditionals (no else)
const ifThenTemplates = [
  { condition: 'score > 10', action: 'say "You win!"', scenario: 'score is 15', result: 'true', output: 'Says "You win!"' },
  { condition: 'score > 10', action: 'say "You win!"', scenario: 'score is 5', result: 'false', output: 'Nothing happens' },
  { condition: 'lives = 0', action: 'say "Game Over"', scenario: 'lives is 0', result: 'true', output: 'Says "Game Over"' },
  { condition: 'lives = 0', action: 'say "Game Over"', scenario: 'lives is 3', result: 'false', output: 'Nothing happens' },
  { condition: 'touching enemy', action: 'change lives by -1', scenario: 'sprite touches enemy', result: 'true', output: 'Loses 1 life' },
  { condition: 'touching coin', action: 'change score by 10', scenario: 'sprite touches coin', result: 'true', output: 'Gets 10 points' },
  { condition: 'timer > 60', action: 'stop all', scenario: 'timer is 65', result: 'true', output: 'Game stops' },
  { condition: 'timer > 60', action: 'stop all', scenario: 'timer is 30', result: 'false', output: 'Game continues' },
  { condition: 'key space pressed', action: 'change y by 50', scenario: 'space is pressed', result: 'true', output: 'Sprite jumps up' },
  { condition: 'x position > 240', action: 'set x to -240', scenario: 'x is 250', result: 'true', output: 'Sprite wraps to left side' },
];

// If/else conditionals
const ifElseTemplates = [
  { condition: 'score > 50', ifTrue: 'say "You win!"', ifFalse: 'say "Keep trying!"', testValue: 30, result: 'Keep trying!' },
  { condition: 'score > 50', ifTrue: 'say "You win!"', ifFalse: 'say "Keep trying!"', testValue: 75, result: 'You win!' },
  { condition: 'score >= 100', ifTrue: 'say "Perfect!"', ifFalse: 'say "Good job!"', testValue: 100, result: 'Perfect!' },
  { condition: 'score >= 100', ifTrue: 'say "Perfect!"', ifFalse: 'say "Good job!"', testValue: 85, result: 'Good job!' },
  { condition: 'answer = "yes"', ifTrue: 'say "Great!"', ifFalse: 'say "Maybe later"', testValue: 'no', result: 'Maybe later' },
  { condition: 'answer = "yes"', ifTrue: 'say "Great!"', ifFalse: 'say "Maybe later"', testValue: 'yes', result: 'Great!' },
  { condition: 'coins >= 50', ifTrue: 'say "You can buy it!"', ifFalse: 'say "Need more coins"', testValue: 25, result: 'Need more coins' },
  { condition: 'coins >= 50', ifTrue: 'say "You can buy it!"', ifFalse: 'say "Need more coins"', testValue: 50, result: 'You can buy it!' },
  { condition: 'health > 0', ifTrue: 'say "Still alive!"', ifFalse: 'say "Game over"', testValue: 0, result: 'Game over' },
  { condition: 'health > 0', ifTrue: 'say "Still alive!"', ifFalse: 'say "Game over"', testValue: 5, result: 'Still alive!' },
  { condition: 'level = 5', ifTrue: 'say "Final boss!"', ifFalse: 'say "Keep going!"', testValue: 3, result: 'Keep going!' },
  { condition: 'age >= 13', ifTrue: 'say "Teen mode"', ifFalse: 'say "Kid mode"', testValue: 10, result: 'Kid mode' },
];

// Variables templates
const variableTemplates = [
  { name: 'score', initial: 0, operation: 'change score by 10', final: 10, explanation: '0 + 10 = 10' },
  { name: 'score', initial: 50, operation: 'change score by 25', final: 75, explanation: '50 + 25 = 75' },
  { name: 'score', initial: 100, operation: 'change score by -20', final: 80, explanation: '100 - 20 = 80' },
  { name: 'lives', initial: 3, operation: 'change lives by -1', final: 2, explanation: '3 - 1 = 2' },
  { name: 'lives', initial: 5, operation: 'set lives to 3', final: 3, explanation: 'Set replaces the value' },
  { name: 'coins', initial: 20, operation: 'change coins by 5', final: 25, explanation: '20 + 5 = 25' },
  { name: 'coins', initial: 100, operation: 'set coins to 0', final: 0, explanation: 'Set replaces with 0' },
  { name: 'health', initial: 100, operation: 'change health by -25', final: 75, explanation: '100 - 25 = 75' },
  { name: 'speed', initial: 5, operation: 'change speed by 2', final: 7, explanation: '5 + 2 = 7' },
  { name: 'level', initial: 1, operation: 'change level by 1', final: 2, explanation: '1 + 1 = 2' },
  { name: 'timer', initial: 60, operation: 'change timer by -1', final: 59, explanation: '60 - 1 = 59' },
  { name: 'highScore', initial: 500, operation: 'set highScore to 750', final: 750, explanation: 'New high score!' },
];

// User input templates
const inputTemplates = [
  { ask: "What's your name?", use: 'say (join "Hello " (answer))', result: 'Says "Hello [name]"' },
  { ask: 'How old are you?', use: 'set age to (answer)', result: 'Stores their age in variable' },
  { ask: 'Pick a number 1-10', use: 'set secret to (answer)', result: 'Stores their number' },
  { ask: 'What is your favorite color?', use: 'set pen color to (answer)', result: 'Changes pen to their color' },
  { ask: 'What should I say?', use: 'say (answer) for 2 seconds', result: 'Sprite says what they typed' },
  { ask: 'How many times should I spin?', use: 'repeat (answer) times: turn 360', result: 'Spins that many times' },
  { ask: "What's the password?", use: 'if answer = "secret" then say "Welcome!"', result: 'Checks if password is correct' },
  { ask: 'Do you want to play? (yes/no)', use: 'if answer = "yes" then broadcast "start game"', result: 'Starts game if they say yes' },
  { ask: 'What is 5 + 3?', use: 'if answer = "8" then say "Correct!"', result: 'Checks if math answer is right' },
  { ask: 'Choose a character: cat, dog, or bird', use: 'switch costume to (answer)', result: 'Changes to chosen character' },
];

// Broadcast messages templates
const broadcastTemplates = [
  { sender: 'Button sprite', message: 'start game', receiver: 'Player sprite', action: 'show and go to start position', purpose: 'Coordinate game start' },
  { sender: 'Player sprite', message: 'level complete', receiver: 'Background', action: 'switch to next backdrop', purpose: 'Change scenes' },
  { sender: 'Enemy sprite', message: 'player hit', receiver: 'Player sprite', action: 'change lives by -1', purpose: 'Handle collisions' },
  { sender: 'Coin sprite', message: 'coin collected', receiver: 'Score display', action: 'change score by 10', purpose: 'Update score' },
  { sender: 'Timer sprite', message: 'time up', receiver: 'All sprites', action: 'stop other scripts', purpose: 'End the game' },
  { sender: 'Cat sprite', message: 'cat done talking', receiver: 'Dog sprite', action: 'say "My turn!"', purpose: 'Take turns in dialogue' },
  { sender: 'Door sprite', message: 'door opened', receiver: 'Player sprite', action: 'glide to next room', purpose: 'Level transitions' },
  { sender: 'Power-up sprite', message: 'power activated', receiver: 'Player sprite', action: 'set speed to 10', purpose: 'Give player abilities' },
  { sender: 'Boss sprite', message: 'boss defeated', receiver: 'Win screen', action: 'show', purpose: 'Victory condition' },
  { sender: 'Intro sprite', message: 'intro done', receiver: 'Game sprites', action: 'show and start moving', purpose: 'Story to gameplay transition' },
];

// Generate problems
function generateGrade3Problems() {
  const problems = [];
  let idCounter = { COND: 1, CELS: 1, VAR: 1, INPT: 1, BCST: 1 };

  // If/then conditionals - 400 problems
  for (let i = 0; i < 400; i++) {
    const template = ifThenTemplates[i % ifThenTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G3-COND-${String(idCounter.COND++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `if <${template.condition}> then\n    ${template.action}\nend\n\nIf ${template.scenario}, what happens?`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `if <${template.condition}> then\n    ${template.action}\nend\n\n${template.scenario}. Is the condition TRUE or FALSE?`;
      answer = template.result.toUpperCase();
    } else if (questionType === 2) {
      question = `I want to ${template.action} when ${template.condition}.\n\nif <___> then\n    ${template.action}\n\nWhat condition goes in the blank?`;
      answer = template.condition;
    } else {
      question = `if <${template.condition}> then\n    ???\nend\n\nWhen the condition is true, I want to ${template.action}. What goes in ???`;
      answer = template.action;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 3,
      skill: 'conditionals if/then',
      question,
      answer,
      visual_type: 'conditional',
      visual_data: { condition: template.condition, if_true: template.action, scenario: template.scenario },
      tier1: { teach: 'IF checks a condition. If TRUE, run the code inside. If FALSE, skip it entirely!' },
      tier2: { teach: 'Is the condition true or false? Only run the code if TRUE!' },
      explanation: `When ${template.scenario}: condition is ${template.result}, so ${template.output}.`,
      standard: '1B-AP-10',
      source_file: 'coding-templates-G3.json',
    });
  }

  // If/else conditionals - 400 problems
  for (let i = 0; i < 400; i++) {
    const template = ifElseTemplates[i % ifElseTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G3-CELS-${String(idCounter.CELS++).padStart(4, '0')}`;

    let question, answer;
    // Determine if condition is true based on test value
    const conditionResult = template.result === template.ifTrue;

    if (questionType === 0) {
      question = `if <${template.condition}> then\n    say "${template.ifTrue}"\nelse\n    say "${template.ifFalse}"\nend\n\nValue is ${template.testValue}. What does the sprite say?`;
      answer = template.result;
    } else if (questionType === 1) {
      question = `if <${template.condition}> then\n    say "${template.ifTrue}"\nelse\n    say "${template.ifFalse}"\nend\n\nWhen does the sprite say "${template.ifFalse}"?`;
      answer = `When the condition ${template.condition} is FALSE`;
    } else if (questionType === 2) {
      question = `Value is ${template.testValue}.\n\nif <${template.condition}> then\n    say "A"\nelse\n    say "B"\nend\n\nDoes it say A or B?`;
      answer = conditionResult ? 'A' : 'B';
    } else {
      question = `I want:\n- Say "${template.ifTrue}" if ${template.condition}\n- Say "${template.ifFalse}" otherwise\n\nWhat goes in the ELSE part?`;
      answer = `say "${template.ifFalse}"`;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 3,
      skill: 'conditionals if/else',
      question,
      answer,
      visual_type: 'conditional',
      visual_data: { condition: template.condition, if_true: template.ifTrue, if_false: template.ifFalse, test_value: template.testValue },
      tier1: { teach: 'IF-ELSE: If TRUE, do the first thing. If FALSE, do the ELSE thing. One or the other!' },
      tier2: { teach: 'Check the condition. TRUE = first action. FALSE = else action.' },
      explanation: `${template.testValue} makes condition ${conditionResult ? 'TRUE' : 'FALSE'}, so result is "${template.result}"`,
      standard: '1B-AP-10',
      source_file: 'coding-templates-G3.json',
    });
  }

  // Variables - 400 problems
  for (let i = 0; i < 400; i++) {
    const template = variableTemplates[i % variableTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G3-VAR-${String(idCounter.VAR++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `set ${template.name} to ${template.initial}\n${template.operation}\n\nWhat is ${template.name} now?`;
      answer = String(template.final);
    } else if (questionType === 1) {
      question = `${template.name} starts at ${template.initial}.\nAfter "${template.operation}", ${template.name} = ???`;
      answer = String(template.final);
    } else if (questionType === 2) {
      question = `${template.name} is ${template.initial}.\nI want ${template.name} to be ${template.final}.\n\nWhat operation should I use?`;
      answer = template.operation;
    } else {
      question = `set ${template.name} to ${template.initial}\n${template.operation}\n\nExplain why ${template.name} is now ${template.final}.`;
      answer = template.explanation;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 3,
      skill: 'variables introduction',
      question,
      answer,
      visual_type: 'variable_box',
      visual_data: { name: template.name, initial: template.initial, final: template.final, operation: template.operation },
      tier1: { teach: 'Variables store values! "Set" replaces the value. "Change by" adds or subtracts.' },
      tier2: { teach: `${template.explanation}` },
      explanation: `${template.name}: ${template.initial} → ${template.operation} → ${template.final}. ${template.explanation}`,
      standard: '1B-AP-10',
      source_file: 'coding-templates-G3.json',
    });
  }

  // User input - 400 problems
  for (let i = 0; i < 400; i++) {
    const template = inputTemplates[i % inputTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G3-INPT-${String(idCounter.INPT++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `ask "${template.ask}"\n${template.use}\n\nWhat happens after the user answers?`;
      answer = template.result;
    } else if (questionType === 1) {
      question = `I want to ${template.result}.\n\nask "${template.ask}"\n???\n\nWhat code goes after the ask block?`;
      answer = template.use;
    } else {
      question = `ask "___"\n${template.use}\n\nWhat question should I ask to make this work?`;
      answer = template.ask;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 3,
      skill: 'user input',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { ask: template.ask, use: template.use },
      tier1: { teach: 'ASK waits for user to type. ANSWER stores what they typed. Use answer in your code!' },
      tier2: { teach: '(answer) contains whatever the user typed.' },
      explanation: `Ask "${template.ask}" → user types → (answer) holds their response → ${template.result}`,
      standard: '1B-AP-10',
      source_file: 'coding-templates-G3.json',
    });
  }

  // Broadcast messages - 400 problems
  for (let i = 0; i < 400; i++) {
    const template = broadcastTemplates[i % broadcastTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G3-BCST-${String(idCounter.BCST++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `${template.sender}: broadcast "${template.message}"\n\n${template.receiver}: when I receive "${template.message}"\n    ${template.action}\n\nWhat is the purpose of this broadcast?`;
      answer = template.purpose;
    } else if (questionType === 1) {
      question = `${template.sender} broadcasts "${template.message}".\n${template.receiver} receives it.\n\nWhat does ${template.receiver} do?`;
      answer = template.action;
    } else if (questionType === 2) {
      question = `I want ${template.receiver} to ${template.action} when ${template.sender} signals.\n\nWhat message should be broadcast?`;
      answer = template.message;
    } else {
      question = `broadcast "${template.message}"\n\nWhich sprite needs "when I receive" to respond?`;
      answer = template.receiver;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 3,
      skill: 'broadcast messages',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { sender: template.sender, message: template.message, receiver: template.receiver, action: template.action },
      tier1: { teach: 'BROADCAST sends a message to all sprites. "When I receive" catches it. Great for coordination!' },
      tier2: { teach: 'Think of it like shouting a message that specific sprites listen for.' },
      explanation: `${template.sender} broadcasts "${template.message}" → ${template.receiver} receives → ${template.action}. Purpose: ${template.purpose}`,
      standard: '1B-AP-10',
      source_file: 'coding-templates-G3.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade3() {
  console.log('===========================================');
  console.log('SEEDING GRADE 3 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade3Problems();
  console.log(`Generated ${problems.length} problems for Grade 3\n`);

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
  console.log(`COMPLETE: Inserted ${inserted} Grade 3 problems`);
  console.log('===========================================');
}

seedGrade3().catch(console.error);
