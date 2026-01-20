/**
 * Seed Coding Practice Problems
 * Generates 12,000 coding problems for grades K-7
 * Based on templates in library/templates/coding/
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase connection
const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ISTE Standards by grade
const STANDARDS = {
  0: '1A-AP-08', // K - Sequences, patterns
  1: '1A-AP-10', // G1 - Algorithms, simple loops
  2: '1A-AP-11', // G2 - Loops, events
  3: '1B-AP-10', // G3 - Conditionals, variables
  4: '1B-AP-11', // G4 - Nested loops, functions
  5: '1B-AP-12', // G5 - Functions, lists
  6: '1B-AP-13', // G6 - Python fundamentals
  7: '1B-AP-15', // G7 - Debugging, projects
};

// Skills by grade with problem counts
const SKILLS_BY_GRADE = {
  0: [
    { skill: 'sequences', code: 'SEQ', count: 200 },
    { skill: 'patterns', code: 'PATT', count: 200 },
    { skill: 'giving instructions', code: 'INST', count: 200 },
    { skill: 'following instructions', code: 'FOLL', count: 200 },
    { skill: 'basic debugging', code: 'DBUG', count: 200 },
  ],
  1: [
    { skill: 'algorithms', code: 'ALGO', count: 300 },
    { skill: 'simple loops', code: 'LOOP', count: 300 },
    { skill: 'events', code: 'EVNT', count: 300 },
    { skill: 'sprites and backgrounds', code: 'SPRT', count: 300 },
    { skill: 'debugging', code: 'DBUG', count: 300 },
  ],
  2: [
    { skill: 'loops with numbers', code: 'LOOP', count: 300 },
    { skill: 'multiple events', code: 'EVNT', count: 300 },
    { skill: 'simple conditionals', code: 'COND', count: 300 },
    { skill: 'animation', code: 'ANIM', count: 300 },
    { skill: 'creating stories', code: 'STOR', count: 300 },
  ],
  3: [
    { skill: 'conditionals if/then', code: 'COND', count: 400 },
    { skill: 'conditionals if/else', code: 'COND', count: 400 },
    { skill: 'variables introduction', code: 'VAR', count: 400 },
    { skill: 'user input', code: 'INPT', count: 400 },
    { skill: 'broadcast messages', code: 'BCST', count: 400 },
  ],
  4: [
    { skill: 'nested loops', code: 'LOOP', count: 300 },
    { skill: 'complex conditionals', code: 'COND', count: 300 },
    { skill: 'operators', code: 'OPER', count: 300 },
    { skill: 'random numbers', code: 'RAND', count: 300 },
    { skill: 'custom blocks', code: 'FUNC', count: 300 },
  ],
  5: [
    { skill: 'functions with inputs', code: 'FUNC', count: 300 },
    { skill: 'lists arrays', code: 'LIST', count: 300 },
    { skill: 'string operations', code: 'STRN', count: 300 },
    { skill: 'coordinate system', code: 'CORD', count: 300 },
    { skill: 'python basics', code: 'PYTH', count: 300 },
  ],
  6: [
    { skill: 'python variables', code: 'PYTH', count: 300 },
    { skill: 'python conditionals', code: 'PYTH', count: 300 },
    { skill: 'python loops', code: 'PYTH', count: 300 },
    { skill: 'python functions', code: 'PYTH', count: 300 },
    { skill: 'python lists', code: 'PYTH', count: 300 },
  ],
  7: [
    { skill: 'python dictionaries', code: 'PYTH', count: 200 },
    { skill: 'file handling', code: 'FILE', count: 200 },
    { skill: 'error handling', code: 'ERRR', count: 200 },
    { skill: 'modular code', code: 'MODL', count: 200 },
    { skill: 'project planning', code: 'PROJ', count: 200 },
  ],
};

// Problem generators for each grade level
const problemGenerators = {
  // Kindergarten - Sequences and Patterns
  0: {
    sequences: (num) => {
      const sequences = [
        { items: ['🐱 jumps', '🐶 spins', '🐰 hops'], q: 'What comes first?', a: '🐱 jumps' },
        { items: ['Wake up', 'Brush teeth', 'Eat breakfast'], q: 'What comes after "Wake up"?', a: 'Brush teeth' },
        { items: ['🔴', '🔵', '🟢'], q: 'What is the second color?', a: '🔵' },
        { items: ['Mix', 'Bake', 'Eat'], q: 'What is the last step?', a: 'Eat' },
        { items: ['Plant seed', 'Water it', 'Watch it grow'], q: 'What comes before "Watch it grow"?', a: 'Water it' },
      ];
      const seq = sequences[num % sequences.length];
      const variation = Math.floor(num / sequences.length) % 10;
      return {
        question: `Look at this sequence:\n${seq.items.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n${seq.q}`,
        answer: seq.a,
        visual_type: 'loop_animation',
        visual_data: { frames: seq.items.map(item => ({ label: item })) },
      };
    },
    patterns: (num) => {
      const patterns = [
        { pattern: ['🔴', '🔵', '🔴', '🔵', '?'], answer: '🔴', name: 'AB pattern' },
        { pattern: ['🟢', '🟡', '🟢', '🟡', '?'], answer: '🟢', name: 'AB pattern' },
        { pattern: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'], answer: '🌙', name: 'AAB pattern' },
        { pattern: ['🍎', '🍊', '🍋', '🍎', '🍊', '?'], answer: '🍋', name: 'ABC pattern' },
        { pattern: ['🐱', '🐱', '🐶', '🐱', '🐱', '?'], answer: '🐶', name: 'AAB pattern' },
      ];
      const p = patterns[num % patterns.length];
      return {
        question: `What comes next in this pattern?\n\n${p.pattern.join(' ')}`,
        answer: p.answer,
        visual_type: 'loop_animation',
        visual_data: { pattern: p.pattern, answer: p.answer },
        explanation: `This is an ${p.name}. The pattern repeats: ${p.pattern.slice(0, -1).join(' ')}`,
      };
    },
    'giving instructions': (num) => {
      const scenarios = [
        { task: 'get the cookie', grid: '🤖 ⬜ ⬜ 🍪', steps: ['Move forward', 'Move forward', 'Move forward', 'Pick up'] },
        { task: 'reach the star', grid: '🤖 ⬜ ⭐', steps: ['Move forward', 'Move forward', 'Collect'] },
        { task: 'get to the door', grid: '🤖 ⬜ ⬜ ⬜ 🚪', steps: ['Move forward 4 times', 'Open door'] },
      ];
      const s = scenarios[num % scenarios.length];
      const stepNum = (num % 4) + 1;
      return {
        question: `The robot wants to ${s.task}.\n\n${s.grid}\n\nWhat is step ${stepNum}?`,
        answer: s.steps[Math.min(stepNum - 1, s.steps.length - 1)],
        visual_type: 'code_block',
        visual_data: { grid: s.grid, steps: s.steps },
      };
    },
    'following instructions': (num) => {
      const instructions = [
        { steps: ['Go right 2', 'Go up 1'], end: 'at the treasure' },
        { steps: ['Jump 2 times', 'Spin around'], end: 'dizzy but happy' },
        { steps: ['Move 3 steps', 'Turn left', 'Move 1 step'], end: 'at the cookie' },
      ];
      const inst = instructions[num % instructions.length];
      return {
        question: `Follow these instructions:\n${inst.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhere do you end up?`,
        answer: inst.end,
        visual_type: 'loop_animation',
        visual_data: { instructions: inst.steps },
      };
    },
    'basic debugging': (num) => {
      const bugs = [
        { buggy: ['Eat breakfast', 'Wake up', 'Go to school'], fixed: ['Wake up', 'Eat breakfast', 'Go to school'], bug: 'Wrong order - wake up first!' },
        { buggy: ['Put on shoes', 'Put on socks'], fixed: ['Put on socks', 'Put on shoes'], bug: 'Socks go before shoes!' },
        { buggy: ['Eat cookie', 'Bake cookie', 'Mix ingredients'], fixed: ['Mix ingredients', 'Bake cookie', 'Eat cookie'], bug: 'Make it before eating!' },
      ];
      const b = bugs[num % bugs.length];
      return {
        question: `What's wrong with this sequence?\n\n${b.buggy.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
        answer: b.bug,
        visual_type: 'code_block',
        visual_data: { buggy: b.buggy, fixed: b.fixed },
      };
    },
  },

  // Grade 1 - Algorithms and Simple Loops
  1: {
    algorithms: (num) => {
      const algorithms = [
        { task: 'make a sandwich', steps: ['Get bread', 'Add peanut butter', 'Add jelly', 'Close sandwich'] },
        { task: 'brush your teeth', steps: ['Get toothbrush', 'Add toothpaste', 'Brush teeth', 'Rinse mouth'] },
        { task: 'draw a square', steps: ['Draw line', 'Turn right', 'Draw line', 'Turn right', 'Draw line', 'Turn right', 'Draw line'] },
      ];
      const algo = algorithms[num % algorithms.length];
      const missingStep = num % algo.steps.length;
      const stepsWithBlank = [...algo.steps];
      const answer = stepsWithBlank[missingStep];
      stepsWithBlank[missingStep] = '___';
      return {
        question: `Algorithm to ${algo.task}:\n\n${stepsWithBlank.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhat goes in the blank?`,
        answer: answer,
        visual_type: 'code_block',
        visual_data: { steps: algo.steps, task: algo.task },
      };
    },
    'simple loops': (num) => {
      const loops = [
        { action: 'say "Hello"', times: 3, output: 'Hello\\nHello\\nHello' },
        { action: 'jump', times: 5, output: '🦘🦘🦘🦘🦘' },
        { action: 'draw a star', times: 4, output: '⭐⭐⭐⭐' },
        { action: 'clap', times: 2, output: '👏👏' },
      ];
      const loop = loops[num % loops.length];
      return {
        question: `What happens when you run this?\n\nrepeat ${loop.times} times:\n    ${loop.action}`,
        answer: `${loop.action} happens ${loop.times} times`,
        visual_type: 'loop_animation',
        visual_data: { iterations: loop.times, action: loop.action },
      };
    },
    events: (num) => {
      const events = [
        { trigger: 'when green flag clicked', action: 'say "Hello!"', result: 'Cat says Hello when you click the green flag' },
        { trigger: 'when space key pressed', action: 'jump', result: 'Sprite jumps when you press space' },
        { trigger: 'when this sprite clicked', action: 'change color', result: 'Sprite changes color when clicked' },
      ];
      const evt = events[num % events.length];
      return {
        question: `What does this code do?\n\n${evt.trigger}\n    ${evt.action}`,
        answer: evt.result,
        visual_type: 'code_block',
        visual_data: { trigger: evt.trigger, action: evt.action },
      };
    },
    'sprites and backgrounds': (num) => {
      const sprites = [
        { q: 'What is a sprite?', a: 'A character or object that can move and do things' },
        { q: 'How do you add a new sprite?', a: 'Click the cat icon with a + sign' },
        { q: 'What is a backdrop?', a: 'The background image behind the sprites' },
        { q: 'How do you make a sprite bigger?', a: 'Use the set size block or grow tool' },
      ];
      const s = sprites[num % sprites.length];
      return {
        question: s.q,
        answer: s.a,
        visual_type: 'output',
        visual_data: { concept: 'sprites' },
      };
    },
    debugging: (num) => {
      const bugs = [
        { code: 'when green flag clicked\\nsay Hello (no quotes)', fix: 'Add quotes: say "Hello"', hint: 'Text needs quotes!' },
        { code: 'repeat 5 times\\n(no end block)', fix: 'Add the end block to close the loop', hint: 'Every repeat needs an end!' },
        { code: 'move 10 steps\\nturn 90 (but sprite goes wrong way)', fix: 'Change turn direction or angle', hint: 'Check the turn direction!' },
      ];
      const b = bugs[num % bugs.length];
      return {
        question: `This code has a bug:\n\n${b.code}\n\nHow do you fix it?`,
        answer: b.fix,
        hints: [b.hint],
        visual_type: 'code_block',
        visual_data: { buggy: b.code, fix: b.fix },
      };
    },
  },

  // Grade 2 - Loops with numbers, events, conditionals
  2: {
    'loops with numbers': (num) => {
      const loops = [
        { times: 4, action: 'move 10 steps', result: 'Sprite moves 40 steps total (10 × 4)' },
        { times: 6, action: 'say "Beep"', result: 'Sprite says Beep 6 times' },
        { times: 3, action: 'change y by 20', result: 'Sprite moves up 60 total (20 × 3)' },
      ];
      const loop = loops[num % loops.length];
      return {
        question: `What happens?\n\nrepeat ${loop.times}:\n    ${loop.action}`,
        answer: loop.result,
        visual_type: 'loop_animation',
        visual_data: { iterations: loop.times, action: loop.action },
      };
    },
    'multiple events': (num) => {
      const scenarios = [
        { events: ['when green flag clicked → move right', 'when space pressed → jump'], q: 'How many events are there?', a: '2 events' },
        { events: ['when clicked → say Hi', 'when A pressed → turn left', 'when B pressed → turn right'], q: 'What happens when you press A?', a: 'The sprite turns left' },
      ];
      const s = scenarios[num % scenarios.length];
      return {
        question: `Look at this code:\n\n${s.events.join('\n')}\n\n${s.q}`,
        answer: s.a,
        visual_type: 'code_block',
        visual_data: { events: s.events },
      };
    },
    'simple conditionals': (num) => {
      const conditionals = [
        { condition: 'touching edge', action: 'turn around', scenario: 'sprite hits the edge' },
        { condition: 'touching color red', action: 'say Lava!', scenario: 'sprite touches red' },
        { condition: 'mouse down', action: 'follow mouse', scenario: 'you hold the mouse button' },
      ];
      const c = conditionals[num % conditionals.length];
      return {
        question: `if <${c.condition}> then\n    ${c.action}\nend\n\nWhat happens when ${c.scenario}?`,
        answer: `The sprite will ${c.action}`,
        visual_type: 'conditional',
        visual_data: { condition: c.condition, if_true: c.action },
      };
    },
    animation: (num) => {
      const animations = [
        { technique: 'switch costumes', code: 'forever:\n    next costume\n    wait 0.2 seconds', result: 'Sprite looks like it\'s animated' },
        { technique: 'glide', code: 'glide 2 secs to x: 100 y: 0', result: 'Sprite moves smoothly to position' },
        { technique: 'size change', code: 'repeat 10:\n    change size by 5', result: 'Sprite grows bigger' },
      ];
      const a = animations[num % animations.length];
      return {
        question: `This code creates animation:\n\n${a.code}\n\nWhat does it do?`,
        answer: a.result,
        visual_type: 'code_block',
        visual_data: { technique: a.technique, code: a.code },
      };
    },
    'creating stories': (num) => {
      const stories = [
        { element: 'dialogue', code: 'say "Hello!" for 2 seconds\nwait 1 second\nsay "How are you?" for 2 seconds', purpose: 'Characters talking to each other' },
        { element: 'scene change', code: 'switch backdrop to "forest"\nwait 3 seconds\nswitch backdrop to "castle"', purpose: 'Moving to a new location' },
      ];
      const s = stories[num % stories.length];
      return {
        question: `What story element does this create?\n\n${s.code}`,
        answer: s.purpose,
        visual_type: 'code_block',
        visual_data: { element: s.element },
      };
    },
  },

  // Grade 3 - Conditionals and Variables
  3: {
    'conditionals if/then': (num) => {
      const conditions = [
        { condition: 'score > 10', if_true: 'say "You win!"', value: 15, result: 'true - says You win!' },
        { condition: 'lives = 0', if_true: 'say "Game Over"', value: 0, result: 'true - says Game Over' },
        { condition: 'touching enemy', if_true: 'lose a life', value: 'yes', result: 'true - loses a life' },
        { condition: 'key space pressed', if_true: 'jump', value: 'pressed', result: 'true - sprite jumps' },
      ];
      const c = conditions[num % conditions.length];
      return {
        question: `if <${c.condition}> then\n    ${c.if_true}\nend\n\nIf the condition is ${c.value}, what happens?`,
        answer: c.result,
        visual_type: 'conditional',
        visual_data: { condition: c.condition, if_true: c.if_true, current_value: c.value },
      };
    },
    'conditionals if/else': (num) => {
      const conditions = [
        { condition: 'score > 50', if_true: 'You win!', if_false: 'Keep trying!', value: 30, result: 'Keep trying! (30 is not > 50)' },
        { condition: 'answer = "yes"', if_true: 'Great!', if_false: 'Okay, maybe later', value: 'no', result: 'Okay, maybe later' },
        { condition: 'coins >= 100', if_true: 'Buy power-up', if_false: 'Need more coins', value: 100, result: 'Buy power-up (100 >= 100)' },
      ];
      const c = conditions[num % conditions.length];
      return {
        question: `if <${c.condition}> then\n    say "${c.if_true}"\nelse\n    say "${c.if_false}"\nend\n\nValue is ${c.value}. What does it say?`,
        answer: c.result,
        visual_type: 'conditional',
        visual_data: { condition: c.condition, if_true: c.if_true, if_false: c.if_false, current_value: c.value },
      };
    },
    'variables introduction': (num) => {
      const variables = [
        { name: 'score', initial: 0, change: 'change score by 10', final: 10 },
        { name: 'lives', initial: 3, change: 'change lives by -1', final: 2 },
        { name: 'coins', initial: 50, change: 'set coins to 100', final: 100 },
      ];
      const v = variables[num % variables.length];
      return {
        question: `set ${v.name} to ${v.initial}\n${v.change}\n\nWhat is ${v.name} now?`,
        answer: String(v.final),
        visual_type: 'variable_box',
        visual_data: { name: v.name, value: v.initial, new_value: v.final },
      };
    },
    'user input': (num) => {
      const inputs = [
        { ask: "What's your name?", use: 'say (join "Hello " (answer))', result: 'Says "Hello [their name]"' },
        { ask: 'Pick a number 1-10', use: 'set secret to (answer)', result: 'Stores their number in secret variable' },
        { ask: 'What is your favorite color?', use: 'set pen color to (answer)', result: 'Changes pen to their color' },
      ];
      const i = inputs[num % inputs.length];
      return {
        question: `ask "${i.ask}"\n${i.use}\n\nWhat happens after the user answers?`,
        answer: i.result,
        visual_type: 'code_block',
        visual_data: { ask: i.ask, use: i.use },
      };
    },
    'broadcast messages': (num) => {
      const broadcasts = [
        { broadcast: 'game start', receiver: 'when I receive "game start"', action: 'show and move to center', purpose: 'Coordinate multiple sprites' },
        { broadcast: 'level complete', receiver: 'when I receive "level complete"', action: 'switch backdrop to "level 2"', purpose: 'Change scenes' },
      ];
      const b = broadcasts[num % broadcasts.length];
      return {
        question: `Sprite 1: broadcast "${b.broadcast}"\n\nSprite 2: ${b.receiver}\n    ${b.action}\n\nWhat is broadcast used for?`,
        answer: b.purpose,
        visual_type: 'code_block',
        visual_data: { broadcast: b.broadcast, action: b.action },
      };
    },
  },

  // Grade 4 - Nested loops, operators, functions
  4: {
    'nested loops': (num) => {
      const nested = [
        { outer: 3, inner: 4, action: 'stamp', result: '12 stamps (3 × 4)' },
        { outer: 5, inner: 5, action: 'draw line', result: '25 lines total (5 × 5)' },
        { outer: 2, inner: 6, action: 'say "Hi"', result: '12 times (2 × 6)' },
      ];
      const n = nested[num % nested.length];
      return {
        question: `repeat ${n.outer}:\n    repeat ${n.inner}:\n        ${n.action}\n\nHow many times does "${n.action}" happen?`,
        answer: n.result,
        visual_type: 'loop_animation',
        visual_data: { outer: n.outer, inner: n.inner, total: n.outer * n.inner },
      };
    },
    'complex conditionals': (num) => {
      const conditions = [
        { cond: 'score > 10 AND lives > 0', values: { score: 15, lives: 3 }, result: 'TRUE (both are true)' },
        { cond: 'score > 10 OR lives > 0', values: { score: 5, lives: 3 }, result: 'TRUE (lives > 0 is true)' },
        { cond: 'NOT touching wall', values: { touching: false }, result: 'TRUE (not touching means true)' },
      ];
      const c = conditions[num % conditions.length];
      return {
        question: `if <${c.cond}> then\n    do something\n\nValues: ${JSON.stringify(c.values)}\n\nIs the condition TRUE or FALSE?`,
        answer: c.result,
        visual_type: 'conditional',
        visual_data: { condition: c.cond, values: c.values },
      };
    },
    operators: (num) => {
      const ops = [
        { expression: '5 + 3 * 2', answer: '11', explanation: 'Multiply first: 3*2=6, then add: 5+6=11' },
        { expression: '(5 + 3) * 2', answer: '16', explanation: 'Parentheses first: 5+3=8, then multiply: 8*2=16' },
        { expression: '10 mod 3', answer: '1', explanation: 'Remainder: 10 ÷ 3 = 3 R1, so mod is 1' },
        { expression: 'round(4.7)', answer: '5', explanation: 'Round to nearest: 4.7 → 5' },
      ];
      const o = ops[num % ops.length];
      return {
        question: `What is the result?\n\n${o.expression}`,
        answer: o.answer,
        explanation: o.explanation,
        visual_type: 'output',
        visual_data: { expression: o.expression, result: o.answer },
      };
    },
    'random numbers': (num) => {
      const randoms = [
        { code: 'pick random 1 to 6', purpose: 'Dice roll', range: '1, 2, 3, 4, 5, or 6' },
        { code: 'pick random 1 to 100', purpose: 'Random score', range: 'Any number 1-100' },
        { code: 'pick random -10 to 10', purpose: 'Random direction', range: 'Any number from -10 to 10' },
      ];
      const r = randoms[num % randoms.length];
      return {
        question: `set x to (${r.code})\n\nWhat values could x be?`,
        answer: r.range,
        visual_type: 'code_block',
        visual_data: { code: r.code, purpose: r.purpose },
      };
    },
    'custom blocks': (num) => {
      const blocks = [
        { name: 'jump', code: 'define jump\n    change y by 50\n    wait 0.2\n    change y by -50', use: 'Makes sprite jump up and down' },
        { name: 'spin', code: 'define spin\n    repeat 36\n        turn 10 degrees', use: 'Makes sprite do a full spin' },
      ];
      const b = blocks[num % blocks.length];
      return {
        question: `${b.code}\n\nWhat does the "${b.name}" block do when called?`,
        answer: b.use,
        visual_type: 'code_block',
        visual_data: { definition: b.code, name: b.name },
      };
    },
  },

  // Grade 5 - Functions with inputs, lists, Python intro
  5: {
    'functions with inputs': (num) => {
      const functions = [
        { def: 'define jump (height)', body: 'change y by (height)\nwait 0.2\nchange y by (height * -1)', call: 'jump (100)', result: 'Jumps 100 pixels high' },
        { def: 'define drawSquare (size)', body: 'repeat 4:\n    move (size) steps\n    turn 90', call: 'drawSquare (50)', result: 'Draws a 50-pixel square' },
      ];
      const f = functions[num % functions.length];
      return {
        question: `${f.def}\n    ${f.body}\n\nCalling: ${f.call}\n\nWhat happens?`,
        answer: f.result,
        visual_type: 'code_block',
        visual_data: { definition: f.def, body: f.body, call: f.call },
      };
    },
    'lists arrays': (num) => {
      const lists = [
        { code: 'add "apple" to fruits\nadd "banana" to fruits\nitem 1 of fruits', answer: 'apple' },
        { code: 'set scores to [100, 85, 90]\nlength of scores', answer: '3' },
        { code: 'set items to ["hat", "sword", "shield"]\nitem 2 of items', answer: 'sword' },
      ];
      const l = lists[num % lists.length];
      return {
        question: `What is the result?\n\n${l.code}`,
        answer: l.answer,
        visual_type: 'variable_box',
        visual_data: { list_operation: l.code },
      };
    },
    'string operations': (num) => {
      const strings = [
        { op: 'join "Hello " "World"', result: 'Hello World' },
        { op: 'length of "Python"', result: '6' },
        { op: 'letter 1 of "Code"', result: 'C' },
        { op: 'join "Hi " (answer)', input: 'Emma', result: 'Hi Emma' },
      ];
      const s = strings[num % strings.length];
      return {
        question: `What is the result of: ${s.op}${s.input ? `\n(answer = "${s.input}")` : ''}`,
        answer: s.result,
        visual_type: 'output',
        visual_data: { operation: s.op, result: s.result },
      };
    },
    'coordinate system': (num) => {
      const coords = [
        { start: { x: 0, y: 0 }, code: 'change x by 50', end: { x: 50, y: 0 } },
        { start: { x: 100, y: 50 }, code: 'go to x: 0 y: 0', end: { x: 0, y: 0 } },
        { start: { x: -50, y: -50 }, code: 'change y by 100', end: { x: -50, y: 50 } },
      ];
      const c = coords[num % coords.length];
      return {
        question: `Sprite starts at x: ${c.start.x}, y: ${c.start.y}\n\n${c.code}\n\nWhere is the sprite now?`,
        answer: `x: ${c.end.x}, y: ${c.end.y}`,
        visual_type: 'output',
        visual_data: { start: c.start, end: c.end },
      };
    },
    'python basics': (num) => {
      const python = [
        { code: 'print("Hello World!")', output: 'Hello World!' },
        { code: 'name = "Emma"\nprint("Hi " + name)', output: 'Hi Emma' },
        { code: 'x = 5\ny = 3\nprint(x + y)', output: '8' },
        { code: 'age = input("Age? ")\n# user types 10', output: 'age is now "10"' },
      ];
      const p = python[num % python.length];
      return {
        question: `What does this Python code output?\n\n${p.code}`,
        answer: p.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: p.code, output: p.output },
      };
    },
  },

  // Grade 6 - Python fundamentals
  6: {
    'python variables': (num) => {
      const vars = [
        { code: 'x = 10\ny = 5\nz = x + y\nprint(z)', output: '15' },
        { code: 'name = "Python"\nlength = len(name)\nprint(length)', output: '6' },
        { code: 'price = 9.99\ntax = 0.10\ntotal = price * (1 + tax)\nprint(total)', output: '10.989' },
        { code: 'a = "Hello"\nb = "World"\nc = a + " " + b\nprint(c)', output: 'Hello World' },
      ];
      const v = vars[num % vars.length];
      return {
        question: `What is the output?\n\n${v.code}`,
        answer: v.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: v.code, output: v.output },
      };
    },
    'python conditionals': (num) => {
      const conds = [
        { code: 'score = 85\nif score >= 70:\n    print("Pass")\nelse:\n    print("Fail")', output: 'Pass' },
        { code: 'age = 15\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teen")\nelse:\n    print("Child")', output: 'Teen' },
        { code: 'x = 10\nif x > 5 and x < 15:\n    print("In range")', output: 'In range' },
      ];
      const c = conds[num % conds.length];
      return {
        question: `What is the output?\n\n${c.code}`,
        answer: c.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: c.code, output: c.output },
      };
    },
    'python loops': (num) => {
      const loops = [
        { code: 'for i in range(3):\n    print(i)', output: '0\n1\n2' },
        { code: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1', output: '0\n1\n2' },
        { code: 'for letter in "ABC":\n    print(letter)', output: 'A\nB\nC' },
        { code: 'sum = 0\nfor i in range(1, 5):\n    sum += i\nprint(sum)', output: '10' },
      ];
      const l = loops[num % loops.length];
      return {
        question: `What is the output?\n\n${l.code}`,
        answer: l.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: l.code, output: l.output },
      };
    },
    'python functions': (num) => {
      const funcs = [
        { code: 'def greet(name):\n    return "Hello " + name\n\nprint(greet("Emma"))', output: 'Hello Emma' },
        { code: 'def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)', output: '8' },
        { code: 'def double(x):\n    return x * 2\n\nprint(double(7))', output: '14' },
      ];
      const f = funcs[num % funcs.length];
      return {
        question: `What is the output?\n\n${f.code}`,
        answer: f.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: f.code, output: f.output },
      };
    },
    'python lists': (num) => {
      const lists = [
        { code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])', output: 'apple' },
        { code: 'nums = [1, 2, 3]\nnums.append(4)\nprint(nums)', output: '[1, 2, 3, 4]' },
        { code: 'items = ["a", "b", "c"]\nprint(len(items))', output: '3' },
        { code: 'scores = [100, 85, 90]\nprint(sum(scores) / len(scores))', output: '91.666...' },
      ];
      const l = lists[num % lists.length];
      return {
        question: `What is the output?\n\n${l.code}`,
        answer: l.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: l.code, output: l.output },
      };
    },
  },

  // Grade 7 - Python intermediate
  7: {
    'python dictionaries': (num) => {
      const dicts = [
        { code: 'person = {"name": "Emma", "age": 13}\nprint(person["name"])', output: 'Emma' },
        { code: 'scores = {"math": 95, "english": 88}\nscores["science"] = 92\nprint(scores)', output: '{"math": 95, "english": 88, "science": 92}' },
        { code: 'data = {"x": 10, "y": 20}\nprint(data.keys())', output: 'dict_keys([\'x\', \'y\'])' },
      ];
      const d = dicts[num % dicts.length];
      return {
        question: `What is the output?\n\n${d.code}`,
        answer: d.output,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: d.code, output: d.output },
      };
    },
    'file handling': (num) => {
      const files = [
        { code: 'with open("data.txt", "w") as f:\n    f.write("Hello")', purpose: 'Writes "Hello" to data.txt' },
        { code: 'with open("data.txt", "r") as f:\n    content = f.read()', purpose: 'Reads entire file into content' },
        { code: 'with open("data.txt", "a") as f:\n    f.write("More")', purpose: 'Appends "More" to end of file' },
      ];
      const f = files[num % files.length];
      return {
        question: `What does this code do?\n\n${f.code}`,
        answer: f.purpose,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: f.code },
      };
    },
    'error handling': (num) => {
      const errors = [
        { code: 'try:\n    x = int("abc")\nexcept ValueError:\n    print("Not a number!")', output: 'Not a number!', why: '"abc" cannot be converted to int' },
        { code: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")', output: 'Cannot divide by zero!', why: 'Division by zero is not allowed' },
      ];
      const e = errors[num % errors.length];
      return {
        question: `What is the output?\n\n${e.code}\n\nWhy?`,
        answer: `${e.output} - ${e.why}`,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: e.code, output: e.output },
      };
    },
    'modular code': (num) => {
      const modules = [
        { code: 'import random\nnum = random.randint(1, 10)', purpose: 'Import random module to generate random numbers' },
        { code: 'from math import sqrt\nresult = sqrt(16)', purpose: 'Import just sqrt function from math module' },
        { code: 'import datetime\ntoday = datetime.date.today()', purpose: 'Import datetime module to work with dates' },
      ];
      const m = modules[num % modules.length];
      return {
        question: `What does this import do?\n\n${m.code}`,
        answer: m.purpose,
        visual_type: 'code_block',
        visual_data: { language: 'python', code: m.code },
      };
    },
    'project planning': (num) => {
      const planning = [
        { q: 'What should you do FIRST when starting a coding project?', a: 'Plan what you want to build and break it into smaller steps' },
        { q: 'What is pseudocode?', a: 'Writing out your logic in plain English before coding' },
        { q: 'Why write comments in your code?', a: 'To explain what your code does so others (and future you) can understand it' },
        { q: 'What is debugging?', a: 'Finding and fixing errors (bugs) in your code' },
      ];
      const p = planning[num % planning.length];
      return {
        question: p.q,
        answer: p.a,
        visual_type: 'output',
        visual_data: { concept: 'planning' },
      };
    },
  },
};

// Generate problems for a grade
function generateProblemsForGrade(grade) {
  const problems = [];
  const skills = SKILLS_BY_GRADE[grade];
  const generators = problemGenerators[grade];

  for (const { skill, code, count } of skills) {
    const generator = generators[skill];
    if (!generator) {
      console.warn(`No generator for ${skill} in grade ${grade}`);
      continue;
    }

    for (let i = 0; i < count; i++) {
      const problemNum = i + 1;
      const id = `CODE-G${grade}-${code}-${String(problemNum).padStart(4, '0')}`;

      try {
        const generated = generator(i);
        const problem = {
          id,
          subject: 'coding',
          grade,
          skill,
          question: generated.question,
          answer: generated.answer,
          options: generated.options || null,
          visual_type: generated.visual_type || null,
          visual_data: generated.visual_data || null,
          tier1: {
            teach: generated.explanation || `Practice ${skill}`,
            visual: generated.visual_data || null,
          },
          tier2: {
            teach: `Let's practice ${skill} step by step.`,
          },
          explanation: generated.explanation || null,
          common_mistake: generated.common_mistake || null,
          hints: generated.hints || null,
          standard: STANDARDS[grade],
          difficulty: i < count * 0.3 ? 'easy' : i < count * 0.7 ? 'medium' : 'hard',
          source_file: `coding-templates-G${grade}.json`,
        };
        problems.push(problem);
      } catch (err) {
        console.error(`Error generating ${id}:`, err.message);
      }
    }
  }

  return problems;
}

// Main seeding function
async function seedCodingProblems() {
  console.log('Starting coding problems seeding...\n');

  let totalInserted = 0;
  const batchSize = 500;

  for (let grade = 0; grade <= 7; grade++) {
    console.log(`\nGenerating Grade ${grade} problems...`);
    const problems = generateProblemsForGrade(grade);
    console.log(`Generated ${problems.length} problems for Grade ${grade}`);

    // Insert in batches
    for (let i = 0; i < problems.length; i += batchSize) {
      const batch = problems.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('practice_problems')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1} for Grade ${grade}:`, error.message);
      } else {
        totalInserted += batch.length;
        console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(problems.length / batchSize)} (${batch.length} problems)`);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`COMPLETE: Inserted ${totalInserted} coding problems`);
  console.log(`========================================\n`);
}

// Run
seedCodingProblems().catch(console.error);
