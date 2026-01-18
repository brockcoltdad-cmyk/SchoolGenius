// Fix Writing Gaps for Grade 2
// Adds 100 items to bring Grade 2 to 1500

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const grade2Items = [];

// Additional sentence type exercises
const sentenceExercises = [
  { sentence: "My dog runs fast", type: "statement" },
  { sentence: "Can you help me", type: "question" },
  { sentence: "That is so cool", type: "exclamation" },
  { sentence: "Pick up your toys", type: "command" },
  { sentence: "Birds fly in the sky", type: "statement" },
  { sentence: "What time is it", type: "question" },
  { sentence: "I love this game", type: "exclamation" },
  { sentence: "Finish your homework", type: "command" },
  { sentence: "The sun is shining", type: "statement" },
  { sentence: "Do you want to play", type: "question" },
  { sentence: "This is the best day", type: "exclamation" },
  { sentence: "Wash your hands", type: "command" },
  { sentence: "My cat is fluffy", type: "statement" },
  { sentence: "Where did you go", type: "question" },
  { sentence: "What a great idea", type: "exclamation" },
  { sentence: "Clean your room", type: "command" },
  { sentence: "We went to the park", type: "statement" },
  { sentence: "How old are you", type: "question" },
  { sentence: "I won the game", type: "exclamation" },
  { sentence: "Turn off the lights", type: "command" }
];

// Additional contractions
const contractions = [
  { full: "she is", contraction: "she's" },
  { full: "he is", contraction: "he's" },
  { full: "have not", contraction: "haven't" },
  { full: "did not", contraction: "didn't" },
  { full: "would not", contraction: "wouldn't" },
  { full: "could not", contraction: "couldn't" },
  { full: "should not", contraction: "shouldn't" },
  { full: "does not", contraction: "doesn't" },
  { full: "was not", contraction: "wasn't" },
  { full: "were not", contraction: "weren't" }
];

// Additional irregular plurals
const irregulars = [
  { singular: "sheep", plural: "sheep" },
  { singular: "deer", plural: "deer" },
  { singular: "fish", plural: "fish" },
  { singular: "ox", plural: "oxen" },
  { singular: "cactus", plural: "cacti" },
  { singular: "fungus", plural: "fungi" },
  { singular: "octopus", plural: "octopi" },
  { singular: "wolf", plural: "wolves" },
  { singular: "life", plural: "lives" },
  { singular: "wife", plural: "wives" }
];

// Additional past tense verbs
const pastTense = [
  { present: "make", past: "made" },
  { present: "take", past: "took" },
  { present: "give", past: "gave" },
  { present: "find", past: "found" },
  { present: "tell", past: "told" },
  { present: "bring", past: "brought" },
  { present: "think", past: "thought" },
  { present: "buy", past: "bought" },
  { present: "catch", past: "caught" },
  { present: "teach", past: "taught" }
];

// Additional compound sentences
const compounds = [
  { s1: "I like apples", s2: "I like bananas", conjunction: "and", combined: "I like apples and bananas." },
  { s1: "She ran fast", s2: "she won the race", conjunction: "and", combined: "She ran fast and won the race." },
  { s1: "I wanted to play", s2: "it was raining", conjunction: "but", combined: "I wanted to play, but it was raining." },
  { s1: "We can go swimming", s2: "we can go hiking", conjunction: "or", combined: "We can go swimming or go hiking." },
  { s1: "He ate dinner", s2: "he went to bed", conjunction: "and", combined: "He ate dinner and went to bed." }
];

let idx = 90000; // Start high to avoid conflicts

function createItem(skill, code, standard, question, answer, visualType, visualData) {
  idx++;
  return {
    id: `WRITE-G2-${code}-${String(idx).padStart(5, '0')}`,
    subject: 'writing',
    grade: 2,
    skill,
    standard,
    question,
    answer,
    tier1: {
      teach: `${skill}: Focus on the key concept.`.substring(0, 80),
      steps: [
        { step: 1, visual: { type: visualType, data: visualData }, voice_text: "Let me show you.", duration: 4000 },
        { step: 2, visual: { type: visualType, data: { ...visualData, highlighted: true } }, voice_text: `The answer is: ${String(answer).substring(0, 30)}.`, duration: 4000 }
      ]
    },
    tier2: {
      teach: `${skill} - simplified.`.substring(0, 60),
      steps: [
        { step: 1, visual: { type: visualType, data: { ...visualData, simplified: true } }, voice_text: `The answer is ${String(answer).substring(0, 20)}.`, duration: 4000 }
      ]
    }
  };
}

// Add 20 sentence type items
for (const ex of sentenceExercises) {
  grade2Items.push(createItem(
    'sentence types', 'SENT', 'L.2.1',
    `What type of sentence is this? "${ex.sentence}"`,
    ex.type,
    'grammar_highlight',
    { sentence: ex.sentence, type: ex.type }
  ));
}

// Add 20 contraction items
for (const c of contractions) {
  grade2Items.push(createItem(
    'apostrophes - contractions', 'APOS', 'L.2.2',
    `Write the contraction for "${c.full}"`,
    c.contraction,
    'grammar_highlight',
    { full: c.full, contraction: c.contraction }
  ));
  grade2Items.push(createItem(
    'apostrophes - contractions', 'APOS', 'L.2.2',
    `What two words make up "${c.contraction}"?`,
    c.full,
    'grammar_highlight',
    { full: c.full, contraction: c.contraction }
  ));
}

// Add 10 irregular plural items
for (const ir of irregulars) {
  grade2Items.push(createItem(
    'irregular plural nouns', 'NOUN', 'L.2.1',
    `What is the plural of "${ir.singular}"?`,
    ir.plural,
    'grammar_highlight',
    { singular: ir.singular, plural: ir.plural }
  ));
}

// Add 20 past tense items
for (const v of pastTense) {
  grade2Items.push(createItem(
    'past tense verbs', 'VERB', 'L.2.1',
    `What is the past tense of "${v.present}"?`,
    v.past,
    'grammar_highlight',
    { present: v.present, past: v.past }
  ));
  grade2Items.push(createItem(
    'past tense verbs', 'VERB', 'L.2.1',
    `Yesterday, I ___ (${v.present})`,
    v.past,
    'grammar_highlight',
    { present: v.present, past: v.past }
  ));
}

// Add 10 compound sentence items
for (const c of compounds) {
  grade2Items.push(createItem(
    'compound sentences', 'COMP', 'L.2.1.F',
    `Combine using "${c.conjunction}": "${c.s1}" + "${c.s2}"`,
    c.combined,
    'sentence_builder',
    { s1: c.s1, s2: c.s2, conjunction: c.conjunction, combined: c.combined }
  ));
  grade2Items.push(createItem(
    'compound sentences', 'COMP', 'L.2.1.F',
    `What conjunction joins: "${c.combined}"`,
    c.conjunction,
    'grammar_highlight',
    { conjunction: c.conjunction }
  ));
}

async function main() {
  console.log('FIXING WRITING GAPS FOR GRADE 2');
  console.log(`Items to add: ${grade2Items.length}`);

  // Get current count
  const { count: before } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'writing')
    .eq('grade', 2);

  console.log(`Current Grade 2 count: ${before}`);

  // Upload in batch
  const { error } = await supabase.from('practice_problems').upsert(grade2Items, { onConflict: 'id' });

  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log(`Uploaded ${grade2Items.length} items`);
  }

  // Verify
  const { count: after } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'writing')
    .eq('grade', 2);

  console.log(`Grade 2 count after fix: ${after}`);
  console.log(`Status: ${after >= 1500 ? 'DONE' : 'SHORT ' + (1500 - after)}`);
}

main().catch(console.error);
