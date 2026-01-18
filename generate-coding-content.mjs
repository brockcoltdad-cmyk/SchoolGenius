// Generate Coding Content for SchoolGenius K-7
// Uses templates from library/templates/
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Targets per grade (total 12,000)
const targets = {
  0: 1000,  // K
  1: 1500,  // G1
  2: 1500,  // G2
  3: 2000,  // G3
  4: 1500,  // G4
  5: 1500,  // G5
  6: 1500,  // G6
  7: 1000   // G7
}

// Load template for a grade
function loadTemplate(grade) {
  const filename = grade === 0 ? 'coding-templates-K.json' : `coding-templates-G${grade}.json`
  const path = `./library/templates/coding/${filename}`
  try {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content)
  } catch (e) {
    console.log(`Warning: Could not load ${path}`)
    return null
  }
}

// Generate visual based on type
function generateVisual(type, data) {
  return { type, data }
}

// Generate a coding item
function generateItem(grade, skill, skillCode, itemNum, data) {
  const id = `CODE-G${grade}-${skillCode}-${String(itemNum).padStart(4, '0')}`

  return {
    id,
    subject: 'coding',
    grade,
    skill,
    standard: data.standard,
    question: data.question,
    answer: data.answer,
    tier1: {
      teach: data.tier1Teach,
      steps: data.tier1Steps || [{
        step: 1,
        visual: data.visual,
        voice_text: data.tier1Voice || data.tier1Teach,
        duration: 5000
      }]
    },
    tier2: {
      teach: data.tier2Teach,
      steps: data.tier2Steps || [{
        step: 1,
        visual: data.visual,
        voice_text: data.tier2Voice || data.tier2Teach,
        duration: 5000
      }]
    },
    visual_type: data.visual?.type || 'code_block',
    visual_data: data.visual?.data || {}
  }
}

// ===== KINDERGARTEN GENERATORS =====
function generateKindergarten(template) {
  const items = []
  let itemNum = 1
  const standard = '1A-AP-08'

  // Sequence activities - putting steps in order
  const sequenceActivities = [
    { task: 'brush teeth', steps: ['get toothbrush', 'add toothpaste', 'brush teeth', 'rinse mouth'] },
    { task: 'make a sandwich', steps: ['get bread', 'add peanut butter', 'add jelly', 'put bread on top'] },
    { task: 'plant a seed', steps: ['dig a hole', 'put seed in', 'cover with dirt', 'water it'] },
    { task: 'get ready for school', steps: ['wake up', 'eat breakfast', 'brush teeth', 'get dressed'] },
    { task: 'wash hands', steps: ['turn on water', 'add soap', 'scrub hands', 'rinse and dry'] },
    { task: 'feed a pet', steps: ['get the food', 'put food in bowl', 'give water', 'pet says thank you'] },
    { task: 'build a tower', steps: ['get blocks', 'stack first block', 'add more blocks', 'tower is tall'] },
    { task: 'draw a picture', steps: ['get paper', 'pick colors', 'draw shapes', 'show your art'] },
    { task: 'play a game', steps: ['choose a game', 'set it up', 'take turns', 'have fun'] },
    { task: 'clean your room', steps: ['pick up toys', 'make the bed', 'put things away', 'all done'] }
  ]

  // Generate sequence items
  for (const activity of sequenceActivities) {
    // What comes first?
    items.push(generateItem(0, 'sequences', 'SEQ', itemNum++, {
      standard,
      question: `To ${activity.task}, what do you do FIRST?`,
      answer: activity.steps[0],
      tier1Teach: `Think about the very first thing you need to do to ${activity.task}.`,
      tier2Teach: `The first step is: ${activity.steps[0]}`,
      visual: generateVisual('code_block', { steps: activity.steps, highlight: 0 })
    }))

    // What comes next?
    for (let i = 0; i < activity.steps.length - 1; i++) {
      items.push(generateItem(0, 'sequences', 'SEQ', itemNum++, {
        standard,
        question: `After "${activity.steps[i]}", what comes next?`,
        answer: activity.steps[i + 1],
        tier1Teach: `You just did "${activity.steps[i]}". What is the next step?`,
        tier2Teach: `Next is: ${activity.steps[i + 1]}`,
        visual: generateVisual('code_block', { steps: activity.steps, highlight: i + 1 })
      }))
    }

    // Put in order
    items.push(generateItem(0, 'sequences', 'SEQ', itemNum++, {
      standard,
      question: `Put the steps to ${activity.task} in the right order.`,
      answer: activity.steps.join(', '),
      tier1Teach: `Think about what you do first, then second, then third, then last.`,
      tier2Teach: `First ${activity.steps[0]}, then ${activity.steps[1]}...`,
      visual: generateVisual('code_block', { steps: activity.steps, shuffled: true })
    }))
  }

  // Pattern activities
  const patterns = [
    { pattern: ['red', 'blue', 'red', 'blue'], next: 'red', type: 'AB' },
    { pattern: ['cat', 'dog', 'cat', 'dog'], next: 'cat', type: 'AB' },
    { pattern: ['clap', 'clap', 'stomp', 'clap', 'clap', 'stomp'], next: 'clap', type: 'AAB' },
    { pattern: ['star', 'star', 'moon', 'star', 'star', 'moon'], next: 'star', type: 'AAB' },
    { pattern: ['big', 'small', 'big', 'small'], next: 'big', type: 'AB' },
    { pattern: ['happy', 'sad', 'happy', 'sad'], next: 'happy', type: 'AB' },
    { pattern: ['circle', 'square', 'circle', 'square'], next: 'circle', type: 'AB' },
    { pattern: ['jump', 'jump', 'sit', 'jump', 'jump', 'sit'], next: 'jump', type: 'AAB' },
    { pattern: ['apple', 'banana', 'cherry', 'apple', 'banana', 'cherry'], next: 'apple', type: 'ABC' },
    { pattern: ['1', '2', '1', '2'], next: '1', type: 'AB' }
  ]

  for (const p of patterns) {
    // What comes next?
    items.push(generateItem(0, 'patterns', 'PATT', itemNum++, {
      standard,
      question: `What comes next? ${p.pattern.join(', ')}, ?`,
      answer: p.next,
      tier1Teach: `Look at the pattern. It goes ${p.pattern.slice(0, 2).join(', ')} and repeats.`,
      tier2Teach: `The pattern is ${p.type}. Next is ${p.next}.`,
      visual: generateVisual('loop_animation', { pattern: p.pattern, type: p.type })
    }))

    // What type of pattern?
    items.push(generateItem(0, 'patterns', 'PATT', itemNum++, {
      standard,
      question: `What type of pattern is this? ${p.pattern.slice(0, 4).join(', ')}`,
      answer: p.type,
      tier1Teach: `Count how many different things repeat.`,
      tier2Teach: `This is an ${p.type} pattern.`,
      visual: generateVisual('loop_animation', { pattern: p.pattern, type: p.type })
    }))

    // Continue the pattern
    items.push(generateItem(0, 'patterns', 'PATT', itemNum++, {
      standard,
      question: `Continue: ${p.pattern.slice(0, 2).join(', ')}, ?, ?`,
      answer: p.pattern.slice(2, 4).join(', '),
      tier1Teach: `The pattern repeats. What comes after ${p.pattern[1]}?`,
      tier2Teach: `It goes ${p.pattern.slice(0, 4).join(', ')}.`,
      visual: generateVisual('loop_animation', { pattern: p.pattern.slice(0, 2), continue: true })
    }))
  }

  // Following instructions
  const instructions = [
    { task: 'Draw a circle', steps: ['start at a point', 'curve around', 'connect back'] },
    { task: 'Stand up', steps: ['put hands on desk', 'push up', 'stand straight'] },
    { task: 'Open a book', steps: ['pick up book', 'find the cover', 'open to first page'] },
    { task: 'Wave hello', steps: ['raise your hand', 'move hand side to side', 'smile'] },
    { task: 'Clap your hands', steps: ['hold hands apart', 'bring them together', 'make a sound'] }
  ]

  for (const inst of instructions) {
    items.push(generateItem(0, 'following instructions', 'INST', itemNum++, {
      standard,
      question: `How do you ${inst.task.toLowerCase()}?`,
      answer: inst.steps.join(', then '),
      tier1Teach: `Think about each small step to ${inst.task.toLowerCase()}.`,
      tier2Teach: `First ${inst.steps[0]}, then ${inst.steps[1]}.`,
      visual: generateVisual('code_block', { steps: inst.steps })
    }))

    // How many steps?
    items.push(generateItem(0, 'following instructions', 'INST', itemNum++, {
      standard,
      question: `To ${inst.task.toLowerCase()}: ${inst.steps.join(', ')}. How many steps?`,
      answer: String(inst.steps.length),
      tier1Teach: `Count each step. How many are there?`,
      tier2Teach: `There are ${inst.steps.length} steps.`,
      visual: generateVisual('code_block', { steps: inst.steps, count: true })
    }))
  }

  // Debugging - find the mistake
  const buggySequences = [
    { task: 'brush teeth', wrong: ['add toothpaste', 'get toothbrush', 'brush', 'rinse'], fix: 'get toothbrush first' },
    { task: 'make cereal', wrong: ['pour milk', 'get bowl', 'add cereal', 'eat'], fix: 'get bowl first' },
    { task: 'go outside', wrong: ['open door', 'put on shoes', 'walk out'], fix: 'put on shoes first' },
    { task: 'read a book', wrong: ['read words', 'open book', 'turn pages'], fix: 'open book first' },
    { task: 'drink water', wrong: ['drink', 'get cup', 'fill with water'], fix: 'get cup first' }
  ]

  for (const bug of buggySequences) {
    items.push(generateItem(0, 'debugging', 'DBUG', itemNum++, {
      standard,
      question: `Something is wrong! To ${bug.task}: ${bug.wrong.join(', ')}. What should be FIRST?`,
      answer: bug.fix,
      tier1Teach: `Look at the first step. Does it make sense?`,
      tier2Teach: `You need to ${bug.fix}.`,
      visual: generateVisual('code_block', { steps: bug.wrong, error: 0 })
    }))
  }

  // Fill remaining with variations
  const animals = ['cat', 'dog', 'bird', 'fish', 'rabbit', 'turtle', 'frog', 'bear']
  const actions = ['jumps', 'runs', 'sleeps', 'eats', 'plays', 'swims', 'hops', 'walks']
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown']

  while (items.length < targets[0]) {
    const animal = animals[Math.floor(Math.random() * animals.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]

    // Sequence with animals
    items.push(generateItem(0, 'sequences', 'SEQ', itemNum++, {
      standard,
      question: `The ${color} ${animal} wants to ${action}. First it wakes up, then it stretches. What comes first?`,
      answer: 'wakes up',
      tier1Teach: `Read the steps. Which one happens before the other?`,
      tier2Teach: `First it wakes up.`,
      visual: generateVisual('code_block', { character: animal, steps: ['wakes up', 'stretches', action] })
    }))

    // Pattern with colors
    items.push(generateItem(0, 'patterns', 'PATT', itemNum++, {
      standard,
      question: `Pattern: ${color}, ${colors[(colors.indexOf(color) + 1) % colors.length]}, ${color}, ${colors[(colors.indexOf(color) + 1) % colors.length]}, ?`,
      answer: color,
      tier1Teach: `This is an AB pattern. What comes after B?`,
      tier2Teach: `The pattern repeats. Next is ${color}.`,
      visual: generateVisual('loop_animation', { pattern: [color, colors[(colors.indexOf(color) + 1) % colors.length]], type: 'AB' })
    }))
  }

  return items.slice(0, targets[0])
}

// ===== GRADE 1 GENERATORS =====
function generateGrade1(template) {
  const items = []
  let itemNum = 1
  const standard = '1A-AP-10'

  // Loop concepts
  const loopActivities = [
    { action: 'jump', times: 3, character: 'bunny' },
    { action: 'clap', times: 4, character: 'bear' },
    { action: 'spin', times: 2, character: 'dancer' },
    { action: 'hop', times: 5, character: 'frog' },
    { action: 'wave', times: 3, character: 'robot' },
    { action: 'stomp', times: 4, character: 'dinosaur' },
    { action: 'wiggle', times: 2, character: 'worm' },
    { action: 'flap', times: 6, character: 'bird' }
  ]

  for (const loop of loopActivities) {
    // How many times?
    items.push(generateItem(1, 'loops', 'LOOP', itemNum++, {
      standard,
      question: `repeat ${loop.times}: ${loop.character} ${loop.action}. How many times does ${loop.character} ${loop.action}?`,
      answer: String(loop.times),
      tier1Teach: `The number after "repeat" tells how many times.`,
      tier2Teach: `Repeat ${loop.times} means do it ${loop.times} times.`,
      visual: generateVisual('loop_animation', { action: loop.action, iterations: loop.times, character: loop.character })
    }))

    // What happens?
    items.push(generateItem(1, 'loops', 'LOOP', itemNum++, {
      standard,
      question: `repeat 3: ${loop.character} ${loop.action}. What does ${loop.character} do?`,
      answer: `${loop.action} 3 times`,
      tier1Teach: `Look inside the repeat block. That action happens 3 times.`,
      tier2Teach: `${loop.character} will ${loop.action} 3 times.`,
      visual: generateVisual('loop_animation', { action: loop.action, iterations: 3, character: loop.character })
    }))

    // Write the loop
    items.push(generateItem(1, 'loops', 'LOOP', itemNum++, {
      standard,
      question: `Make ${loop.character} ${loop.action} ${loop.times} times. What block do you use?`,
      answer: `repeat ${loop.times}`,
      tier1Teach: `To do something many times, use a repeat block.`,
      tier2Teach: `Use: repeat ${loop.times}`,
      visual: generateVisual('loop_animation', { action: loop.action, iterations: loop.times, character: loop.character })
    }))
  }

  // Event blocks
  const events = [
    { trigger: 'green flag clicked', action: 'start the program' },
    { trigger: 'space key pressed', action: 'make sprite jump' },
    { trigger: 'sprite clicked', action: 'say hello' },
    { trigger: 'arrow key pressed', action: 'move sprite' },
    { trigger: 'backdrop changes', action: 'play sound' }
  ]

  for (const event of events) {
    items.push(generateItem(1, 'events', 'EVNT', itemNum++, {
      standard,
      question: `When ${event.trigger}, what happens?`,
      answer: event.action,
      tier1Teach: `Events make things happen when something is clicked or pressed.`,
      tier2Teach: `When ${event.trigger}, we ${event.action}.`,
      visual: generateVisual('code_block', { event: event.trigger, action: event.action })
    }))

    // What triggers it?
    items.push(generateItem(1, 'events', 'EVNT', itemNum++, {
      standard,
      question: `You want to ${event.action}. What event block do you use?`,
      answer: `when ${event.trigger}`,
      tier1Teach: `Think about what the user does to make this happen.`,
      tier2Teach: `Use: when ${event.trigger}`,
      visual: generateVisual('code_block', { event: event.trigger, action: event.action })
    }))
  }

  // Sprites and costumes
  const sprites = [
    { name: 'Cat', costumes: ['walking', 'sitting', 'jumping'] },
    { name: 'Dog', costumes: ['happy', 'sleeping', 'running'] },
    { name: 'Robot', costumes: ['standing', 'waving', 'dancing'] },
    { name: 'Butterfly', costumes: ['flying', 'resting', 'flapping'] }
  ]

  for (const sprite of sprites) {
    for (const costume of sprite.costumes) {
      items.push(generateItem(1, 'sprites', 'SPRT', itemNum++, {
        standard,
        question: `To make ${sprite.name} look ${costume}, what do you change?`,
        answer: 'costume',
        tier1Teach: `Costumes change how a sprite looks.`,
        tier2Teach: `Change the costume to "${costume}".`,
        visual: generateVisual('variable_box', { sprite: sprite.name, costume })
      }))
    }
  }

  // Simple algorithms
  const mazes = [
    { start: 'A', end: 'B', steps: ['move right', 'move right', 'move down'] },
    { start: 'A', end: 'B', steps: ['move down', 'move down', 'move right'] },
    { start: 'A', end: 'B', steps: ['move right', 'move down', 'move right', 'move down'] }
  ]

  for (const maze of mazes) {
    items.push(generateItem(1, 'algorithms', 'ALGO', itemNum++, {
      standard,
      question: `To get from ${maze.start} to ${maze.end}, what steps do you need?`,
      answer: maze.steps.join(', '),
      tier1Teach: `Think step by step. Which direction first?`,
      tier2Teach: `Go: ${maze.steps.join(', then ')}.`,
      visual: generateVisual('code_block', { maze: true, steps: maze.steps })
    }))

    // How many steps?
    items.push(generateItem(1, 'algorithms', 'ALGO', itemNum++, {
      standard,
      question: `Path: ${maze.steps.join(', ')}. How many moves total?`,
      answer: String(maze.steps.length),
      tier1Teach: `Count each move in the path.`,
      tier2Teach: `There are ${maze.steps.length} moves.`,
      visual: generateVisual('code_block', { maze: true, steps: maze.steps })
    }))
  }

  // Debugging
  const bugs = [
    { goal: 'move right 3 times', code: 'repeat 2: move right', fix: 'change 2 to 3' },
    { goal: 'jump when clicked', code: 'when green flag: jump', fix: 'change to when sprite clicked' },
    { goal: 'cat says meow', code: 'dog says meow', fix: 'change dog to cat' }
  ]

  for (const bug of bugs) {
    items.push(generateItem(1, 'debugging', 'DBUG', itemNum++, {
      standard,
      question: `Goal: ${bug.goal}. Code: ${bug.code}. What is wrong?`,
      answer: bug.fix,
      tier1Teach: `Compare what you want to what the code does.`,
      tier2Teach: `You need to ${bug.fix}.`,
      visual: generateVisual('code_block', { code: bug.code, error: true })
    }))
  }

  // Fill remaining
  while (items.length < targets[1]) {
    const loop = loopActivities[Math.floor(Math.random() * loopActivities.length)]
    const times = Math.floor(Math.random() * 5) + 2

    items.push(generateItem(1, 'loops', 'LOOP', itemNum++, {
      standard,
      question: `repeat ${times}: ${loop.character} ${loop.action}. How many ${loop.action}s?`,
      answer: String(times),
      tier1Teach: `The number tells how many times.`,
      tier2Teach: `${times} times.`,
      visual: generateVisual('loop_animation', { action: loop.action, iterations: times, character: loop.character })
    }))
  }

  return items.slice(0, targets[1])
}

// ===== GRADE 2-7 GENERATORS (Similar pattern) =====
function generateGrade2(template) {
  const items = []
  let itemNum = 1
  const standard = '1A-AP-11'

  // Loops with numbers
  for (let times = 2; times <= 10; times++) {
    const actions = ['move 10 steps', 'turn 90 degrees', 'say hello', 'play sound', 'change color']
    for (const action of actions) {
      items.push(generateItem(2, 'loops with numbers', 'LOOP', itemNum++, {
        standard,
        question: `repeat ${times}: ${action}. How many times does "${action}" happen?`,
        answer: String(times),
        tier1Teach: `The repeat block runs the code inside it ${times} times.`,
        tier2Teach: `It happens ${times} times.`,
        visual: generateVisual('loop_animation', { action, iterations: times })
      }))
    }
  }

  // Events with multiple triggers
  const multiEvents = [
    { triggers: ['green flag', 'space pressed'], action: 'jump' },
    { triggers: ['clicked', 'key pressed'], action: 'change costume' },
    { triggers: ['backdrop changed', 'message received'], action: 'start animation' }
  ]

  for (const me of multiEvents) {
    items.push(generateItem(2, 'events', 'EVNT', itemNum++, {
      standard,
      question: `You want to ${me.action} when ${me.triggers[0]} OR when ${me.triggers[1]}. How many event blocks do you need?`,
      answer: '2',
      tier1Teach: `Each trigger needs its own event block.`,
      tier2Teach: `You need 2 event blocks - one for each trigger.`,
      visual: generateVisual('code_block', { events: me.triggers, action: me.action })
    }))
  }

  // Simple conditionals
  const conditions = [
    { if: 'touching edge', then: 'turn around', sprite: 'ball' },
    { if: 'touching color red', then: 'say ouch', sprite: 'cat' },
    { if: 'key pressed', then: 'move', sprite: 'character' },
    { if: 'touching sprite', then: 'hide', sprite: 'enemy' }
  ]

  for (const cond of conditions) {
    items.push(generateItem(2, 'conditionals', 'COND', itemNum++, {
      standard,
      question: `if ${cond.if} then ${cond.then}. When does ${cond.sprite} ${cond.then}?`,
      answer: `when ${cond.if}`,
      tier1Teach: `The "if" checks a condition. If true, the action happens.`,
      tier2Teach: `It happens when ${cond.if}.`,
      visual: generateVisual('conditional', { condition: cond.if, action: cond.then })
    }))

    items.push(generateItem(2, 'conditionals', 'COND', itemNum++, {
      standard,
      question: `You want ${cond.sprite} to ${cond.then} when ${cond.if}. What block do you use?`,
      answer: 'if-then',
      tier1Teach: `To check something and do an action, use if-then.`,
      tier2Teach: `Use an if-then block.`,
      visual: generateVisual('conditional', { condition: cond.if, action: cond.then })
    }))
  }

  // Animation basics
  const animations = [
    { frames: ['costume1', 'costume2'], delay: 0.2, name: 'walking' },
    { frames: ['open', 'closed'], delay: 0.5, name: 'blinking' },
    { frames: ['frame1', 'frame2', 'frame3'], delay: 0.1, name: 'running' }
  ]

  for (const anim of animations) {
    items.push(generateItem(2, 'animation', 'ANIM', itemNum++, {
      standard,
      question: `To make a ${anim.name} animation, you switch between ${anim.frames.length} costumes. What do you put between costume changes?`,
      answer: 'wait block',
      tier1Teach: `Animations need pauses between frames so you can see each one.`,
      tier2Teach: `Add a wait block between costume changes.`,
      visual: generateVisual('code_block', { animation: anim.frames, wait: anim.delay })
    }))
  }

  // Fill remaining
  while (items.length < targets[2]) {
    const times = Math.floor(Math.random() * 8) + 3
    items.push(generateItem(2, 'loops', 'LOOP', itemNum++, {
      standard,
      question: `repeat ${times}: move 10 steps. How far does the sprite move in total?`,
      answer: String(times * 10) + ' steps',
      tier1Teach: `Multiply: ${times} repeats × 10 steps each.`,
      tier2Teach: `${times} × 10 = ${times * 10} steps.`,
      visual: generateVisual('loop_animation', { action: 'move 10 steps', iterations: times })
    }))
  }

  return items.slice(0, targets[2])
}

function generateGrade3(template) {
  const items = []
  let itemNum = 1
  const standard = '1B-AP-10'

  // If/else conditionals
  const ifElse = [
    { condition: 'score > 10', ifTrue: 'You win!', ifFalse: 'Keep trying!', testValue: 15, result: 'You win!' },
    { condition: 'score > 10', ifTrue: 'You win!', ifFalse: 'Keep trying!', testValue: 5, result: 'Keep trying!' },
    { condition: 'lives = 0', ifTrue: 'Game over', ifFalse: 'Keep playing', testValue: 0, result: 'Game over' },
    { condition: 'touching enemy', ifTrue: 'lose life', ifFalse: 'safe', testValue: true, result: 'lose life' },
    { condition: 'key pressed', ifTrue: 'jump', ifFalse: 'stand', testValue: true, result: 'jump' }
  ]

  for (const ie of ifElse) {
    items.push(generateItem(3, 'conditionals if/else', 'COND', itemNum++, {
      standard,
      question: `if ${ie.condition} then ${ie.ifTrue} else ${ie.ifFalse}. Value is ${ie.testValue}. What happens?`,
      answer: ie.result,
      tier1Teach: `Check if ${ie.condition} is true or false. Then pick the right action.`,
      tier2Teach: `${ie.condition} is ${ie.testValue === ie.result.includes('win') || ie.testValue === true ? 'true' : 'false'}, so: ${ie.result}`,
      visual: generateVisual('conditional', { condition: ie.condition, ifTrue: ie.ifTrue, ifFalse: ie.ifFalse, value: ie.testValue })
    }))
  }

  // Variables
  const variables = [
    { name: 'score', start: 0, change: '+10', result: 10 },
    { name: 'lives', start: 3, change: '-1', result: 2 },
    { name: 'coins', start: 5, change: '+5', result: 10 },
    { name: 'health', start: 100, change: '-20', result: 80 }
  ]

  for (const v of variables) {
    items.push(generateItem(3, 'variables', 'VAR', itemNum++, {
      standard,
      question: `${v.name} starts at ${v.start}. Change ${v.name} by ${v.change}. What is ${v.name} now?`,
      answer: String(v.result),
      tier1Teach: `${v.start} ${v.change} = ?`,
      tier2Teach: `${v.start} ${v.change} = ${v.result}`,
      visual: generateVisual('variable_box', { name: v.name, value: v.start, change: v.change, result: v.result })
    }))

    // Set vs change
    items.push(generateItem(3, 'variables', 'VAR', itemNum++, {
      standard,
      question: `${v.name} is ${v.start}. You use "set ${v.name} to ${v.result}". What is ${v.name}?`,
      answer: String(v.result),
      tier1Teach: `"Set" replaces the old value with the new value.`,
      tier2Teach: `Set means ${v.name} becomes ${v.result}.`,
      visual: generateVisual('variable_box', { name: v.name, value: v.result })
    }))
  }

  // User input
  const inputs = [
    { ask: 'What is your name?', varName: 'name', use: 'say Hello, (name)!' },
    { ask: 'Pick a number', varName: 'number', use: 'repeat (number) times' },
    { ask: 'How old are you?', varName: 'age', use: 'if age > 10 then say "You are big!"' }
  ]

  for (const inp of inputs) {
    items.push(generateItem(3, 'user input', 'INPT', itemNum++, {
      standard,
      question: `ask "${inp.ask}" and wait. Where is the answer stored?`,
      answer: 'answer',
      tier1Teach: `The ask block stores what the user types in a special variable called "answer".`,
      tier2Teach: `The answer goes into the "answer" variable.`,
      visual: generateVisual('code_block', { ask: inp.ask, answer: 'answer' })
    }))
  }

  // Clones
  const cloneExamples = [
    { sprite: 'rain', creates: 'raindrops', action: 'fall down' },
    { sprite: 'spaceship', creates: 'lasers', action: 'shoot up' },
    { sprite: 'flower', creates: 'seeds', action: 'spread out' }
  ]

  for (const clone of cloneExamples) {
    items.push(generateItem(3, 'clones', 'CLNE', itemNum++, {
      standard,
      question: `To make many ${clone.creates} from one ${clone.sprite}, what do you use?`,
      answer: 'create clone',
      tier1Teach: `Clones are copies of a sprite. One sprite can make many clones.`,
      tier2Teach: `Use "create clone of myself" to make copies.`,
      visual: generateVisual('code_block', { sprite: clone.sprite, clones: clone.creates })
    }))
  }

  // Fill remaining
  while (items.length < targets[3]) {
    const score = Math.floor(Math.random() * 20)
    const threshold = 10
    items.push(generateItem(3, 'conditionals', 'COND', itemNum++, {
      standard,
      question: `if score > ${threshold} then "win" else "try again". Score is ${score}. Result?`,
      answer: score > threshold ? 'win' : 'try again',
      tier1Teach: `Is ${score} greater than ${threshold}?`,
      tier2Teach: `${score} ${score > threshold ? '>' : '<='} ${threshold}, so: ${score > threshold ? 'win' : 'try again'}`,
      visual: generateVisual('conditional', { condition: `score > ${threshold}`, value: score })
    }))
  }

  return items.slice(0, targets[3])
}

function generateGrade4(template) {
  const items = []
  let itemNum = 1
  const standard = '1B-AP-11'

  // Nested loops
  for (let outer = 2; outer <= 5; outer++) {
    for (let inner = 2; inner <= 5; inner++) {
      items.push(generateItem(4, 'nested loops', 'NEST', itemNum++, {
        standard,
        question: `repeat ${outer}: repeat ${inner}: stamp. How many stamps total?`,
        answer: String(outer * inner),
        tier1Teach: `Outer loop runs ${outer} times. Each time, inner loop stamps ${inner} times.`,
        tier2Teach: `${outer} × ${inner} = ${outer * inner} stamps.`,
        visual: generateVisual('loop_animation', { outer, inner, action: 'stamp' })
      }))
    }
  }

  // AND/OR conditionals
  const andOr = [
    { cond1: 'hasKey', cond2: 'atDoor', type: 'AND', result: 'both needed to open' },
    { cond1: 'hasKey', cond2: 'knowsPassword', type: 'OR', result: 'either works' },
    { cond1: 'hasSword', cond2: 'hasShield', type: 'AND', result: 'both needed to fight' }
  ]

  for (const ao of andOr) {
    items.push(generateItem(4, 'complex conditionals', 'COND', itemNum++, {
      standard,
      question: `if ${ao.cond1} ${ao.type} ${ao.cond2}: What does ${ao.type} mean?`,
      answer: ao.type === 'AND' ? 'both must be true' : 'at least one must be true',
      tier1Teach: `${ao.type} combines two conditions.`,
      tier2Teach: `${ao.type} means ${ao.result}.`,
      visual: generateVisual('conditional', { cond1: ao.cond1, cond2: ao.cond2, type: ao.type })
    }))
  }

  // Operators
  const operators = [
    { op: '+', a: 5, b: 3, result: 8 },
    { op: '-', a: 10, b: 4, result: 6 },
    { op: '*', a: 6, b: 7, result: 42 },
    { op: '/', a: 20, b: 4, result: 5 },
    { op: '>', a: 5, b: 3, result: 'true' },
    { op: '<', a: 2, b: 8, result: 'true' },
    { op: '=', a: 5, b: 5, result: 'true' }
  ]

  for (const op of operators) {
    items.push(generateItem(4, 'operators', 'OPER', itemNum++, {
      standard,
      question: `(${op.a}) ${op.op} (${op.b}) = ?`,
      answer: String(op.result),
      tier1Teach: `Use the ${op.op} operator to calculate.`,
      tier2Teach: `${op.a} ${op.op} ${op.b} = ${op.result}`,
      visual: generateVisual('code_block', { expression: `${op.a} ${op.op} ${op.b}`, result: op.result })
    }))
  }

  // Random numbers
  for (let i = 0; i < 30; i++) {
    const min = Math.floor(Math.random() * 10) + 1
    const max = min + Math.floor(Math.random() * 20) + 5
    items.push(generateItem(4, 'random numbers', 'RAND', itemNum++, {
      standard,
      question: `pick random ${min} to ${max}. What numbers could you get?`,
      answer: `any number from ${min} to ${max}`,
      tier1Teach: `Random picks any whole number in the range.`,
      tier2Teach: `You could get ${min}, ${min+1}, ... up to ${max}.`,
      visual: generateVisual('variable_box', { random: true, min, max })
    }))
  }

  // Custom blocks (functions)
  const functions = [
    { name: 'jump', steps: ['change y by 50', 'wait 0.2', 'change y by -50'] },
    { name: 'spin', steps: ['repeat 36: turn 10 degrees'] },
    { name: 'grow', steps: ['repeat 10: change size by 10'] }
  ]

  for (const func of functions) {
    items.push(generateItem(4, 'custom blocks', 'FUNC', itemNum++, {
      standard,
      question: `You make a custom block called "${func.name}" with: ${func.steps.join(', ')}. To use it, you just type?`,
      answer: func.name,
      tier1Teach: `Custom blocks let you reuse code by giving it a name.`,
      tier2Teach: `Just use "${func.name}" to run all those steps.`,
      visual: generateVisual('code_block', { define: func.name, steps: func.steps })
    }))
  }

  // Fill remaining
  while (items.length < targets[4]) {
    const outer = Math.floor(Math.random() * 4) + 2
    const inner = Math.floor(Math.random() * 4) + 2
    items.push(generateItem(4, 'nested loops', 'NEST', itemNum++, {
      standard,
      question: `repeat ${outer}: repeat ${inner}: draw star. Total stars?`,
      answer: String(outer * inner),
      tier1Teach: `Multiply outer by inner.`,
      tier2Teach: `${outer} × ${inner} = ${outer * inner}`,
      visual: generateVisual('loop_animation', { outer, inner, action: 'star' })
    }))
  }

  return items.slice(0, targets[4])
}

function generateGrade5(template) {
  const items = []
  let itemNum = 1
  const standard = '1B-AP-12'

  // Functions with parameters
  const paramFunctions = [
    { name: 'jump', param: 'height', example: 'jump(50)', result: 'jumps 50 units' },
    { name: 'move', param: 'steps', example: 'move(100)', result: 'moves 100 steps' },
    { name: 'say', param: 'message', example: 'say("Hello")', result: 'says Hello' },
    { name: 'wait', param: 'seconds', example: 'wait(2)', result: 'waits 2 seconds' }
  ]

  for (const pf of paramFunctions) {
    items.push(generateItem(5, 'functions with inputs', 'FUNC', itemNum++, {
      standard,
      question: `define ${pf.name}(${pf.param}). Call: ${pf.example}. What happens?`,
      answer: pf.result,
      tier1Teach: `The parameter ${pf.param} gets the value you pass in.`,
      tier2Teach: `${pf.example} makes it ${pf.result}.`,
      visual: generateVisual('code_block', { function: pf.name, param: pf.param, call: pf.example })
    }))

    // Different values
    items.push(generateItem(5, 'functions with inputs', 'FUNC', itemNum++, {
      standard,
      question: `${pf.name}(10) vs ${pf.name}(50). What is different?`,
      answer: `the ${pf.param} value`,
      tier1Teach: `Same function, different input values give different results.`,
      tier2Teach: `The ${pf.param} changes from 10 to 50.`,
      visual: generateVisual('code_block', { function: pf.name, calls: [`${pf.name}(10)`, `${pf.name}(50)`] })
    }))
  }

  // Lists
  const listExamples = [
    { name: 'scores', items: [100, 85, 92, 78], operation: 'add 95' },
    { name: 'names', items: ['Alice', 'Bob', 'Charlie'], operation: 'add Diana' },
    { name: 'colors', items: ['red', 'blue', 'green'], operation: 'delete blue' }
  ]

  for (const list of listExamples) {
    items.push(generateItem(5, 'lists', 'LIST', itemNum++, {
      standard,
      question: `List ${list.name}: ${list.items.join(', ')}. Item 1 is?`,
      answer: String(list.items[0]),
      tier1Teach: `Lists are numbered starting from 1.`,
      tier2Teach: `Item 1 is ${list.items[0]}.`,
      visual: generateVisual('variable_box', { list: list.name, items: list.items, highlight: 0 })
    }))

    items.push(generateItem(5, 'lists', 'LIST', itemNum++, {
      standard,
      question: `List ${list.name} has ${list.items.length} items. After "${list.operation}", how many?`,
      answer: String(list.operation.includes('add') ? list.items.length + 1 : list.items.length - 1),
      tier1Teach: `"Add" increases length by 1. "Delete" decreases by 1.`,
      tier2Teach: `${list.operation.includes('add') ? 'Add makes it ' + (list.items.length + 1) : 'Delete makes it ' + (list.items.length - 1)}.`,
      visual: generateVisual('variable_box', { list: list.name, operation: list.operation })
    }))
  }

  // String operations
  const strings = [
    { str: 'Hello', op: 'length', result: '5' },
    { str: 'World', op: 'letter 1', result: 'W' },
    { str: 'Hello', join: 'World', result: 'HelloWorld' }
  ]

  for (const s of strings) {
    if (s.op) {
      items.push(generateItem(5, 'string operations', 'STR', itemNum++, {
        standard,
        question: `${s.op} of "${s.str}" = ?`,
        answer: s.result,
        tier1Teach: `${s.op} ${s.op === 'length' ? 'counts characters' : 'gets a character'}.`,
        tier2Teach: `${s.op} of "${s.str}" is ${s.result}.`,
        visual: generateVisual('code_block', { string: s.str, operation: s.op })
      }))
    }
    if (s.join) {
      items.push(generateItem(5, 'string operations', 'STR', itemNum++, {
        standard,
        question: `join "${s.str}" "${s.join}" = ?`,
        answer: s.result,
        tier1Teach: `Join sticks two strings together.`,
        tier2Teach: `"${s.str}" + "${s.join}" = "${s.result}"`,
        visual: generateVisual('code_block', { join: [s.str, s.join], result: s.result })
      }))
    }
  }

  // Python intro
  const pythonBasics = [
    { code: 'print("Hello")', output: 'Hello', concept: 'print' },
    { code: 'name = input("Name?")', output: 'asks for input', concept: 'input' },
    { code: 'x = 5', output: 'stores 5 in x', concept: 'variable' },
    { code: 'print("Hi " + name)', output: 'Hi [name]', concept: 'concatenation' }
  ]

  for (const py of pythonBasics) {
    items.push(generateItem(5, 'Python basics', 'PYTH', itemNum++, {
      standard,
      question: `Python: ${py.code}. What does this do?`,
      answer: py.output,
      tier1Teach: `${py.concept} in Python ${py.concept === 'print' ? 'shows text' : py.concept === 'input' ? 'gets user input' : 'stores a value'}.`,
      tier2Teach: `This ${py.output}.`,
      visual: generateVisual('code_block', { language: 'python', code: py.code, output: py.output })
    }))
  }

  // Fill remaining
  while (items.length < targets[5]) {
    const listSize = Math.floor(Math.random() * 5) + 3
    const items_arr = Array.from({length: listSize}, (_, i) => i * 10)
    const index = Math.floor(Math.random() * listSize) + 1
    items.push(generateItem(5, 'lists', 'LIST', itemNum++, {
      standard,
      question: `List: ${items_arr.join(', ')}. Item ${index} = ?`,
      answer: String(items_arr[index - 1]),
      tier1Teach: `Count to position ${index}.`,
      tier2Teach: `Item ${index} is ${items_arr[index - 1]}.`,
      visual: generateVisual('variable_box', { list: 'numbers', items: items_arr, highlight: index - 1 })
    }))
  }

  return items.slice(0, targets[5])
}

function generateGrade6(template) {
  const items = []
  let itemNum = 1
  const standard = '1B-AP-13'

  // Python variables and types
  const variables = [
    { code: 'x = 10', type: 'integer', value: 10 },
    { code: 'name = "Alice"', type: 'string', value: 'Alice' },
    { code: 'price = 9.99', type: 'float', value: 9.99 },
    { code: 'done = True', type: 'boolean', value: true }
  ]

  for (const v of variables) {
    items.push(generateItem(6, 'Python variables', 'VAR', itemNum++, {
      standard,
      question: `Python: ${v.code}. What type of data is stored?`,
      answer: v.type,
      tier1Teach: `${v.type}s are ${v.type === 'string' ? 'text in quotes' : v.type === 'integer' ? 'whole numbers' : v.type === 'float' ? 'decimal numbers' : 'True/False values'}.`,
      tier2Teach: `${v.value} is a ${v.type}.`,
      visual: generateVisual('code_block', { language: 'python', code: v.code, type: v.type })
    }))
  }

  // Python conditionals
  const pyConditions = [
    { condition: 'x > 10', xVal: 15, result: 'True' },
    { condition: 'x > 10', xVal: 5, result: 'False' },
    { condition: 'x == 10', xVal: 10, result: 'True' },
    { condition: 'x != 5', xVal: 5, result: 'False' }
  ]

  for (const pc of pyConditions) {
    items.push(generateItem(6, 'Python conditionals', 'COND', itemNum++, {
      standard,
      question: `x = ${pc.xVal}. Is ${pc.condition}?`,
      answer: pc.result,
      tier1Teach: `Substitute x with ${pc.xVal} and evaluate.`,
      tier2Teach: `${pc.xVal} ${pc.condition.replace('x', '')} is ${pc.result}.`,
      visual: generateVisual('conditional', { condition: pc.condition, value: pc.xVal, result: pc.result })
    }))
  }

  // Python loops
  const pyLoops = [
    { code: 'for i in range(5):', iterations: 5, iValues: [0,1,2,3,4] },
    { code: 'for i in range(3, 8):', iterations: 5, iValues: [3,4,5,6,7] },
    { code: 'for i in range(0, 10, 2):', iterations: 5, iValues: [0,2,4,6,8] }
  ]

  for (const pl of pyLoops) {
    items.push(generateItem(6, 'Python loops', 'LOOP', itemNum++, {
      standard,
      question: `${pl.code} print(i). How many times does it print?`,
      answer: String(pl.iterations),
      tier1Teach: `range() creates a sequence of numbers.`,
      tier2Teach: `It prints ${pl.iterations} times: ${pl.iValues.join(', ')}.`,
      visual: generateVisual('loop_animation', { code: pl.code, values: pl.iValues })
    }))

    items.push(generateItem(6, 'Python loops', 'LOOP', itemNum++, {
      standard,
      question: `${pl.code} print(i). What values of i are printed?`,
      answer: pl.iValues.join(', '),
      tier1Teach: `range starts at first number, goes up to (not including) second number.`,
      tier2Teach: `i becomes: ${pl.iValues.join(', ')}`,
      visual: generateVisual('loop_animation', { code: pl.code, values: pl.iValues })
    }))
  }

  // Python functions
  const pyFunctions = [
    { name: 'greet', params: 'name', body: 'print("Hello " + name)', call: 'greet("Alice")', output: 'Hello Alice' },
    { name: 'add', params: 'a, b', body: 'return a + b', call: 'add(5, 3)', output: '8' },
    { name: 'square', params: 'x', body: 'return x * x', call: 'square(4)', output: '16' }
  ]

  for (const pf of pyFunctions) {
    items.push(generateItem(6, 'Python functions', 'FUNC', itemNum++, {
      standard,
      question: `def ${pf.name}(${pf.params}): ${pf.body}. Call: ${pf.call}. Output?`,
      answer: pf.output,
      tier1Teach: `The function receives ${pf.params} and ${pf.body.includes('return') ? 'returns' : 'prints'} a result.`,
      tier2Teach: `${pf.call} outputs: ${pf.output}`,
      visual: generateVisual('code_block', { language: 'python', function: pf.name, call: pf.call, output: pf.output })
    }))
  }

  // Python lists
  const pyLists = [
    { name: 'nums', items: [10, 20, 30, 40], index: 0, result: 10 },
    { name: 'nums', items: [10, 20, 30, 40], index: 2, result: 30 },
    { name: 'nums', items: [10, 20, 30, 40], index: -1, result: 40 }
  ]

  for (const pl of pyLists) {
    items.push(generateItem(6, 'Python lists', 'LIST', itemNum++, {
      standard,
      question: `${pl.name} = ${JSON.stringify(pl.items)}. ${pl.name}[${pl.index}] = ?`,
      answer: String(pl.result),
      tier1Teach: `Python lists start at index 0. Negative indexes count from end.`,
      tier2Teach: `Index ${pl.index} gives ${pl.result}.`,
      visual: generateVisual('variable_box', { list: pl.name, items: pl.items, index: pl.index, result: pl.result })
    }))
  }

  // Fill remaining
  while (items.length < targets[6]) {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const ops = ['+', '-', '*']
    const op = ops[Math.floor(Math.random() * ops.length)]
    const result = op === '+' ? a + b : op === '-' ? a - b : a * b

    items.push(generateItem(6, 'Python operators', 'OPER', itemNum++, {
      standard,
      question: `Python: ${a} ${op} ${b} = ?`,
      answer: String(result),
      tier1Teach: `Calculate ${a} ${op} ${b}.`,
      tier2Teach: `${a} ${op} ${b} = ${result}`,
      visual: generateVisual('code_block', { language: 'python', expression: `${a} ${op} ${b}`, result })
    }))
  }

  return items.slice(0, targets[6])
}

function generateGrade7(template) {
  const items = []
  let itemNum = 1
  const standard = '1B-AP-15'

  // Dictionaries
  const dicts = [
    { name: 'person', data: { name: 'Alice', age: 12 }, key: 'name', value: 'Alice' },
    { name: 'person', data: { name: 'Alice', age: 12 }, key: 'age', value: 12 },
    { name: 'scores', data: { math: 95, science: 88 }, key: 'math', value: 95 }
  ]

  for (const d of dicts) {
    items.push(generateItem(7, 'dictionaries', 'DICT', itemNum++, {
      standard,
      question: `${d.name} = ${JSON.stringify(d.data)}. ${d.name}["${d.key}"] = ?`,
      answer: String(d.value),
      tier1Teach: `Dictionaries store key-value pairs. Access with dict["key"].`,
      tier2Teach: `The key "${d.key}" gives value ${d.value}.`,
      visual: generateVisual('variable_box', { dict: d.name, data: d.data, key: d.key })
    }))

    items.push(generateItem(7, 'dictionaries', 'DICT', itemNum++, {
      standard,
      question: `${d.name} = ${JSON.stringify(d.data)}. Add "grade": "7th". How?`,
      answer: `${d.name}["grade"] = "7th"`,
      tier1Teach: `Add to a dictionary: dict["newkey"] = value`,
      tier2Teach: `Use: ${d.name}["grade"] = "7th"`,
      visual: generateVisual('code_block', { language: 'python', dict: d.name, add: 'grade' })
    }))
  }

  // File handling
  const fileOps = [
    { op: 'read', code: 'open("file.txt", "r")', mode: 'r', purpose: 'read from file' },
    { op: 'write', code: 'open("file.txt", "w")', mode: 'w', purpose: 'write to file' },
    { op: 'append', code: 'open("file.txt", "a")', mode: 'a', purpose: 'add to end of file' }
  ]

  for (const fo of fileOps) {
    items.push(generateItem(7, 'file handling', 'FILE', itemNum++, {
      standard,
      question: `${fo.code}. What does mode "${fo.mode}" mean?`,
      answer: fo.purpose,
      tier1Teach: `File modes: r=read, w=write(overwrite), a=append(add to end).`,
      tier2Teach: `"${fo.mode}" means ${fo.purpose}.`,
      visual: generateVisual('code_block', { language: 'python', code: fo.code, mode: fo.mode })
    }))
  }

  // Error handling
  const errors = [
    { code: 'int("abc")', error: 'ValueError', reason: 'cannot convert "abc" to int' },
    { code: '10 / 0', error: 'ZeroDivisionError', reason: 'cannot divide by zero' },
    { code: 'mylist[100]', error: 'IndexError', reason: 'index out of range' }
  ]

  for (const e of errors) {
    items.push(generateItem(7, 'error handling', 'ERR', itemNum++, {
      standard,
      question: `${e.code} causes what type of error?`,
      answer: e.error,
      tier1Teach: `${e.error} occurs when ${e.reason}.`,
      tier2Teach: `This causes a ${e.error}.`,
      visual: generateVisual('code_block', { language: 'python', code: e.code, error: e.error })
    }))

    items.push(generateItem(7, 'error handling', 'ERR', itemNum++, {
      standard,
      question: `To catch a ${e.error}, use: try: ... except ${e.error}: ...`,
      answer: 'except ' + e.error,
      tier1Teach: `try/except catches errors so your program doesn't crash.`,
      tier2Teach: `Use "except ${e.error}:" to catch this error.`,
      visual: generateVisual('code_block', { language: 'python', tryExcept: e.error })
    }))
  }

  // Modules
  const modules = [
    { module: 'random', func: 'randint(1, 10)', purpose: 'get random integer 1-10' },
    { module: 'math', func: 'sqrt(16)', purpose: 'square root (4)' },
    { module: 'time', func: 'sleep(2)', purpose: 'pause for 2 seconds' }
  ]

  for (const m of modules) {
    items.push(generateItem(7, 'modules', 'MOD', itemNum++, {
      standard,
      question: `import ${m.module}. ${m.module}.${m.func} does what?`,
      answer: m.purpose,
      tier1Teach: `Modules are libraries of pre-built functions you can import.`,
      tier2Teach: `${m.func} will ${m.purpose}.`,
      visual: generateVisual('code_block', { language: 'python', import: m.module, func: m.func })
    }))
  }

  // Project planning
  const planning = [
    { step: 1, name: 'Define the problem', question: 'What is the FIRST step in project planning?' },
    { step: 2, name: 'Break into smaller tasks', question: 'After defining the problem, what next?' },
    { step: 3, name: 'Write pseudocode', question: 'Before coding, you should write?' },
    { step: 4, name: 'Code and test', question: 'After pseudocode, you?' },
    { step: 5, name: 'Debug and improve', question: 'After initial coding, you?' }
  ]

  for (const p of planning) {
    items.push(generateItem(7, 'project planning', 'PLAN', itemNum++, {
      standard,
      question: p.question,
      answer: p.name,
      tier1Teach: `Project planning follows steps: define, break down, pseudocode, code, debug.`,
      tier2Teach: `Step ${p.step}: ${p.name}`,
      visual: generateVisual('code_block', { planning: true, step: p.step })
    }))
  }

  // Fill remaining
  while (items.length < targets[7]) {
    const dictName = 'data'
    const key = ['name', 'age', 'score', 'grade'][Math.floor(Math.random() * 4)]
    const value = key === 'name' ? 'Test' : key === 'age' ? 13 : key === 'score' ? 95 : '7th'

    items.push(generateItem(7, 'dictionaries', 'DICT', itemNum++, {
      standard,
      question: `${dictName} = {"${key}": ${typeof value === 'string' ? `"${value}"` : value}}. ${dictName}["${key}"] = ?`,
      answer: String(value),
      tier1Teach: `Access dictionary values with dict["key"].`,
      tier2Teach: `${dictName}["${key}"] is ${value}.`,
      visual: generateVisual('variable_box', { dict: dictName, key, value })
    }))
  }

  return items.slice(0, targets[7])
}

// Main execution
async function main() {
  console.log('\n=== GENERATING CODING CONTENT ===\n')

  const allItems = []

  // Generate for each grade
  console.log('Generating Kindergarten (1,000 items)...')
  const kTemplate = loadTemplate(0)
  const kItems = generateKindergarten(kTemplate)
  allItems.push(...kItems)
  console.log(`  Generated: ${kItems.length} items`)

  console.log('Generating Grade 1 (1,500 items)...')
  const g1Template = loadTemplate(1)
  const g1Items = generateGrade1(g1Template)
  allItems.push(...g1Items)
  console.log(`  Generated: ${g1Items.length} items`)

  console.log('Generating Grade 2 (1,500 items)...')
  const g2Template = loadTemplate(2)
  const g2Items = generateGrade2(g2Template)
  allItems.push(...g2Items)
  console.log(`  Generated: ${g2Items.length} items`)

  console.log('Generating Grade 3 (2,000 items)...')
  const g3Template = loadTemplate(3)
  const g3Items = generateGrade3(g3Template)
  allItems.push(...g3Items)
  console.log(`  Generated: ${g3Items.length} items`)

  console.log('Generating Grade 4 (1,500 items)...')
  const g4Template = loadTemplate(4)
  const g4Items = generateGrade4(g4Template)
  allItems.push(...g4Items)
  console.log(`  Generated: ${g4Items.length} items`)

  console.log('Generating Grade 5 (1,500 items)...')
  const g5Template = loadTemplate(5)
  const g5Items = generateGrade5(g5Template)
  allItems.push(...g5Items)
  console.log(`  Generated: ${g5Items.length} items`)

  console.log('Generating Grade 6 (1,500 items)...')
  const g6Template = loadTemplate(6)
  const g6Items = generateGrade6(g6Template)
  allItems.push(...g6Items)
  console.log(`  Generated: ${g6Items.length} items`)

  console.log('Generating Grade 7 (1,000 items)...')
  const g7Template = loadTemplate(7)
  const g7Items = generateGrade7(g7Template)
  allItems.push(...g7Items)
  console.log(`  Generated: ${g7Items.length} items`)

  console.log(`\nTotal generated: ${allItems.length} items`)

  // Upload to database in batches
  console.log('\nUploading to database...')
  const batchSize = 500
  let uploaded = 0
  let errors = 0

  for (let i = 0; i < allItems.length; i += batchSize) {
    const batch = allItems.slice(i, i + batchSize)

    const { error } = await supabase
      .from('practice_problems')
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      console.error(`  Batch ${Math.floor(i/batchSize) + 1} error:`, error.message)
      errors++
    } else {
      uploaded += batch.length
      console.log(`  Uploaded: ${uploaded}/${allItems.length}`)
    }
  }

  // Verify
  console.log('\nVerifying upload...')
  const { count } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'coding')

  console.log(`\n=== COMPLETE ===`)
  console.log(`  Generated: ${allItems.length}`)
  console.log(`  Uploaded: ${uploaded}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  In database: ${count}`)
}

main().catch(console.error)
