/**
 * Seed Coding Practice Problems - GRADE 2 ONLY
 * Target: ~1,500 problems for Grade 2
 * Skills: loops with numbers, multiple events, simple conditionals, animation, creating stories
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 2 Skills - Total 1,500 problems
const GRADE_2_SKILLS = [
  { skill: 'loops with numbers', code: 'LOOP', count: 300 },
  { skill: 'multiple events', code: 'EVNT', count: 300 },
  { skill: 'simple conditionals', code: 'COND', count: 300 },
  { skill: 'animation', code: 'ANIM', count: 300 },
  { skill: 'creating stories', code: 'STOR', count: 300 },
];

// Loops with numbers - more math-focused
const loopTemplates = [
  { action: 'move 10 steps', unit: 'steps', perLoop: 10 },
  { action: 'change y by 5', unit: 'total y change', perLoop: 5 },
  { action: 'change x by -10', unit: 'total x change', perLoop: -10 },
  { action: 'turn right 15 degrees', unit: 'degrees', perLoop: 15 },
  { action: 'turn left 30 degrees', unit: 'degrees turned left', perLoop: 30 },
  { action: 'change size by 10', unit: 'size increase', perLoop: 10 },
  { action: 'change volume by 5', unit: 'volume increase', perLoop: 5 },
  { action: 'wait 0.5 seconds', unit: 'seconds total', perLoop: 0.5 },
  { action: 'add 1 to score', unit: 'points added', perLoop: 1 },
  { action: 'take away 2 coins', unit: 'coins taken', perLoop: 2 },
];

// Multiple events templates
const multiEventTemplates = [
  {
    events: [
      { trigger: 'when green flag clicked', action: 'go to center' },
      { trigger: 'when space pressed', action: 'jump' },
      { trigger: 'when up arrow pressed', action: 'move up' },
    ],
    description: 'A character that starts at center and can jump or move up'
  },
  {
    events: [
      { trigger: 'when green flag clicked', action: 'say "Click me!"' },
      { trigger: 'when this sprite clicked', action: 'change costume' },
      { trigger: 'when A key pressed', action: 'play sound' },
    ],
    description: 'A sprite that talks, changes looks when clicked, and makes sound'
  },
  {
    events: [
      { trigger: 'when green flag clicked', action: 'show' },
      { trigger: 'when space pressed', action: 'hide' },
      { trigger: 'when space pressed', action: 'wait 1 second, then show' },
    ],
    description: 'A sprite that appears and disappears'
  },
  {
    events: [
      { trigger: 'when left arrow pressed', action: 'point left, move 10' },
      { trigger: 'when right arrow pressed', action: 'point right, move 10' },
      { trigger: 'when up arrow pressed', action: 'point up, move 10' },
      { trigger: 'when down arrow pressed', action: 'point down, move 10' },
    ],
    description: 'Arrow keys control movement in all 4 directions'
  },
  {
    events: [
      { trigger: 'when green flag clicked', action: 'set score to 0' },
      { trigger: 'when this sprite clicked', action: 'add 1 to score' },
      { trigger: 'when score = 10', action: 'say "You win!"' },
    ],
    description: 'A clicking game with score tracking'
  },
];

// Simple conditionals templates
const conditionalTemplates = [
  { condition: 'touching edge', action: 'turn around', result: 'bounce off walls' },
  { condition: 'touching color red', action: 'say "Hot!"', result: 'warns about lava/fire' },
  { condition: 'touching color blue', action: 'say "Water!"', result: 'finds water' },
  { condition: 'touching mouse pointer', action: 'follow mouse', result: 'chases the mouse' },
  { condition: 'key space pressed', action: 'jump', result: 'spacebar makes jump' },
  { condition: 'mouse down', action: 'glide to mouse', result: 'drag with mouse' },
  { condition: 'touching Sprite2', action: 'say "Got you!"', result: 'catches other sprite' },
  { condition: 'x position > 200', action: 'set x to -200', result: 'wraps around screen' },
  { condition: 'y position < -150', action: 'set y to 150', result: 'teleports to top' },
  { condition: 'timer > 10', action: 'stop all', result: 'game ends after 10 seconds' },
];

// Animation templates
const animationTemplates = [
  { technique: 'costume switching', code: 'forever:\n  next costume\n  wait 0.2 seconds', effect: 'sprite appears to walk or move' },
  { technique: 'gliding', code: 'glide 2 seconds to x: 100 y: 50', effect: 'sprite moves smoothly to a spot' },
  { technique: 'spinning', code: 'forever:\n  turn right 10 degrees', effect: 'sprite spins continuously' },
  { technique: 'growing', code: 'repeat 10:\n  change size by 5\n  wait 0.1 seconds', effect: 'sprite gradually gets bigger' },
  { technique: 'shrinking', code: 'repeat 10:\n  change size by -5\n  wait 0.1 seconds', effect: 'sprite gradually gets smaller' },
  { technique: 'fading', code: 'repeat 10:\n  change ghost effect by 10', effect: 'sprite slowly becomes transparent' },
  { technique: 'bouncing', code: 'forever:\n  change y by 5\n  wait 0.1\n  change y by -5\n  wait 0.1', effect: 'sprite bounces up and down' },
  { technique: 'color changing', code: 'forever:\n  change color effect by 10\n  wait 0.1', effect: 'sprite cycles through colors' },
  { technique: 'wiggling', code: 'forever:\n  turn right 10\n  wait 0.1\n  turn left 10\n  wait 0.1', effect: 'sprite wiggles back and forth' },
  { technique: 'pulsing', code: 'forever:\n  set size to 110%\n  wait 0.2\n  set size to 100%\n  wait 0.2', effect: 'sprite pulses bigger and smaller' },
];

// Story creation templates
const storyTemplates = [
  { element: 'dialogue', code: 'say "Hello!" for 2 seconds\nwait 1 second\nsay "How are you?" for 2 seconds', purpose: 'Characters having a conversation' },
  { element: 'scene change', code: 'switch backdrop to "forest"\nwait 3 seconds\nswitch backdrop to "castle"', purpose: 'Moving to a new location in the story' },
  { element: 'character entrance', code: 'hide\nwait 2 seconds\nglide 1 second to x: 0 y: 0\nshow', purpose: 'Character dramatically enters the scene' },
  { element: 'character exit', code: 'glide 1 second to x: 250 y: 0\nhide', purpose: 'Character leaves the scene' },
  { element: 'thinking', code: 'think "Hmm..." for 2 seconds\nthink "I have an idea!" for 2 seconds', purpose: 'Showing what a character is thinking' },
  { element: 'narrator', code: 'say "Once upon a time..." for 3 seconds\nwait 1 second\nswitch backdrop to "village"', purpose: 'Setting up the story beginning' },
  { element: 'sound effect', code: 'play sound "pop" until done\nsay "Wow!" for 1 second', purpose: 'Adding sound to make story exciting' },
  { element: 'multiple characters', code: 'broadcast "cat speaks"\nwhen I receive "cat speaks"\nsay "Meow!"', purpose: 'Making characters take turns talking' },
  { element: 'ending', code: 'say "The End!" for 3 seconds\nstop all', purpose: 'Finishing the story' },
  { element: 'suspense', code: 'play sound "drum roll"\nwait 2 seconds\nsay "And the winner is..."', purpose: 'Building excitement in the story' },
];

// Generate problems
function generateGrade2Problems() {
  const problems = [];
  let idCounter = { LOOP: 1, EVNT: 1, COND: 1, ANIM: 1, STOR: 1 };

  // Loops with numbers - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = loopTemplates[i % loopTemplates.length];
    const times = [2, 3, 4, 5, 6, 8, 10][i % 7];
    const total = times * template.perLoop;
    const questionType = i % 4;
    const id = `CODE-G2-LOOP-${String(idCounter.LOOP++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `repeat ${times} times:\n    ${template.action}\n\nWhat is the ${template.unit}?`;
      answer = `${Math.abs(total)} ${template.unit}`;
    } else if (questionType === 1) {
      question = `If "${template.action}" happens inside a loop, and the loop runs ${times} times, what's the total ${template.unit}?`;
      answer = `${Math.abs(total)}`;
    } else if (questionType === 2) {
      question = `I want a total ${template.unit} of ${Math.abs(total)}.\n\nrepeat ___ times:\n    ${template.action}\n\nHow many times should the loop repeat?`;
      answer = String(times);
    } else {
      question = `repeat ${times} times:\n    ${template.action}\n\nThe sprite does "${template.action}" how many times?`;
      answer = String(times);
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 2,
      skill: 'loops with numbers',
      question,
      answer,
      visual_type: 'loop_animation',
      visual_data: { iterations: times, action: template.action, total },
      tier1: { teach: `Loops repeat! ${times} times × ${Math.abs(template.perLoop)} = ${Math.abs(total)}. Multiply to find the total!` },
      tier2: { teach: 'Count how many times, then multiply by the amount each time.' },
      explanation: `${times} times × ${Math.abs(template.perLoop)} per loop = ${Math.abs(total)} total`,
      standard: '1A-AP-11',
      source_file: 'coding-templates-G2.json',
    });
  }

  // Multiple events - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = multiEventTemplates[i % multiEventTemplates.length];
    const questionType = i % 4;
    const id = `CODE-G2-EVNT-${String(idCounter.EVNT++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `This sprite has ${template.events.length} events:\n\n${template.events.map(e => `${e.trigger} → ${e.action}`).join('\n')}\n\nHow many different things can trigger this sprite?`;
      answer = String(template.events.length);
    } else if (questionType === 1) {
      const eventIndex = i % template.events.length;
      question = `${template.events[eventIndex].trigger}\n    ${template.events[eventIndex].action}\n\nWhat happens ${template.events[eventIndex].trigger.replace('when ', 'when you ')}?`;
      answer = template.events[eventIndex].action;
    } else if (questionType === 2) {
      question = `A sprite needs to:\n${template.events.map(e => `- ${e.action}`).join('\n')}\n\nWhat describes this sprite?`;
      answer = template.description;
    } else {
      const eventIndex = i % template.events.length;
      question = `I want the sprite to "${template.events[eventIndex].action}".\n\nWhat event block should I use?`;
      answer = template.events[eventIndex].trigger;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 2,
      skill: 'multiple events',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { events: template.events },
      tier1: { teach: 'Sprites can have MANY events! Each "when" block waits for something different to happen.' },
      tier2: { teach: 'Look at each "when" block. Each one is a different trigger!' },
      explanation: template.description,
      standard: '1A-AP-11',
      source_file: 'coding-templates-G2.json',
    });
  }

  // Simple conditionals - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = conditionalTemplates[i % conditionalTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G2-COND-${String(idCounter.COND++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `if <${template.condition}> then\n    ${template.action}\nend\n\nWhat happens when the sprite is ${template.condition}?`;
      answer = `The sprite will ${template.action}`;
    } else if (questionType === 1) {
      question = `I want my sprite to ${template.result}.\n\nif <___> then\n    ${template.action}\n\nWhat condition goes in the blank?`;
      answer = template.condition;
    } else {
      question = `if <${template.condition}> then\n    ???\nend\n\nThis code makes the sprite ${template.result}. What action goes in the ???`;
      answer = template.action;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 2,
      skill: 'simple conditionals',
      question,
      answer,
      visual_type: 'conditional',
      visual_data: { condition: template.condition, if_true: template.action },
      tier1: { teach: 'IF blocks check something! If it\'s TRUE, the code inside runs. If FALSE, it skips.' },
      tier2: { teach: 'The condition in <> is the question. If YES, do the action!' },
      explanation: `When ${template.condition}, the sprite will ${template.action}. This makes it ${template.result}.`,
      standard: '1A-AP-11',
      source_file: 'coding-templates-G2.json',
    });
  }

  // Animation - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = animationTemplates[i % animationTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G2-ANIM-${String(idCounter.ANIM++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What animation effect does this create?\n\n${template.code}`;
      answer = template.effect;
    } else if (questionType === 1) {
      question = `I want to make my sprite ${template.effect.toLowerCase()}.\n\nWhat technique should I use?`;
      answer = template.technique;
    } else {
      question = `The "${template.technique}" technique makes the sprite:\n\nA) Stand still\nB) ${template.effect}\nC) Disappear forever\n\nWhich is correct?`;
      answer = `B) ${template.effect}`;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 2,
      skill: 'animation',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { technique: template.technique, code: template.code },
      tier1: { teach: 'Animation is movement over time! Use loops, waits, and costume changes to make things move.' },
      tier2: { teach: `${template.technique}: ${template.effect}` },
      explanation: `${template.technique} - ${template.effect}`,
      standard: '1A-AP-11',
      source_file: 'coding-templates-G2.json',
    });
  }

  // Creating stories - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = storyTemplates[i % storyTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G2-STOR-${String(idCounter.STOR++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What story element does this code create?\n\n${template.code}`;
      answer = template.purpose;
    } else if (questionType === 1) {
      question = `In my story, I want: ${template.purpose}\n\nWhat's this story element called?`;
      answer = template.element;
    } else {
      question = `For "${template.element}" in a story, the code should:\n\n${template.code}\n\nWhy is this useful?`;
      answer = template.purpose;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 2,
      skill: 'creating stories',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { element: template.element, code: template.code },
      tier1: { teach: 'Stories in Scratch use dialogue (say), scene changes (backdrop), and timing (wait) to tell a tale!' },
      tier2: { teach: `${template.element} helps with: ${template.purpose}` },
      explanation: `${template.element}: ${template.purpose}`,
      standard: '1A-AP-11',
      source_file: 'coding-templates-G2.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade2() {
  console.log('===========================================');
  console.log('SEEDING GRADE 2 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade2Problems();
  console.log(`Generated ${problems.length} problems for Grade 2\n`);

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
  console.log(`COMPLETE: Inserted ${inserted} Grade 2 problems`);
  console.log('===========================================');
}

seedGrade2().catch(console.error);
