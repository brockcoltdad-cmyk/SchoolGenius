// Fix spelling shortfalls
// Grade 2: needs 500 more
// Grade 3: needs 400 more
// Grade 4: needs 400 more
// Grade 6: needs 50 more

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateId(grade, skillCode, index) {
  return `SPELL-G${grade}-${skillCode}-${String(index).padStart(4, '0')}`;
}

function generateTier1(word, rule) {
  return {
    teach: rule ? `Rule: ${rule.substring(0, 50)}` : `Spell: ${word}`,
    steps: [
      { step: 1, visual: { type: 'word_building', data: { word, letters: word.split('') } }, voice_text: `The word is ${word}.`, duration: 4000 },
      { step: 2, visual: { type: 'word_building', data: { word, letters: word.split(''), highlighted: true } }, voice_text: `Spelled: ${word.split('').join('-')}.`, duration: 4000 }
    ]
  };
}

function generateTier2(word) {
  return {
    teach: `${word} - sound it out.`,
    steps: [
      { step: 1, visual: { type: 'word_building', data: { word, letters: word.split(''), simplified: true } }, voice_text: `${word}. ${word.split('').join('-')}.`, duration: 4000 }
    ]
  };
}

async function fixGrade2() {
  console.log('Fixing Grade 2 (need 500 more)...');
  const items = [];
  let idx = 10001;

  // Additional vowel team words
  const vowelTeams = {
    'oi oy': ['oil', 'boil', 'coil', 'foil', 'soil', 'toil', 'coin', 'join', 'point', 'moist', 'voice', 'choice', 'boy', 'toy', 'joy', 'enjoy', 'royal', 'loyal', 'annoy', 'destroy'],
    'ou ow': ['out', 'loud', 'cloud', 'proud', 'count', 'found', 'ground', 'round', 'sound', 'pound', 'house', 'mouse', 'south', 'mouth', 'couch', 'ouch', 'how', 'now', 'cow', 'wow', 'bow', 'town', 'down', 'brown', 'crown', 'frown', 'drown', 'clown', 'growl', 'owl'],
    'oo': ['book', 'cook', 'hook', 'look', 'took', 'shook', 'brook', 'good', 'wood', 'stood', 'foot', 'wool', 'boot', 'food', 'moon', 'noon', 'soon', 'spoon', 'room', 'broom', 'bloom', 'zoom', 'cool', 'fool', 'pool', 'tool', 'school', 'tooth', 'proof', 'roof']
  };

  for (const [team, words] of Object.entries(vowelTeams)) {
    for (const word of words) {
      if (items.length >= 300) break;
      items.push({
        id: generateId(2, 'VT2', idx++),
        subject: 'spelling',
        grade: 2,
        skill: `vowel teams ${team}`,
        standard: 'RF.2.3',
        question: `Spell the word you hear: ${word}`,
        answer: word,
        audio_word: word,
        tier1: generateTier1(word, `${team} make special sounds.`),
        tier2: generateTier2(word)
      });
    }
  }

  // Additional soft c and g words
  const softCG = ['cell', 'cent', 'center', 'certain', 'circle', 'city', 'ice', 'nice', 'rice', 'price', 'slice', 'twice', 'space', 'place', 'face', 'race', 'trace', 'grace', 'gem', 'gel', 'gentle', 'germ', 'giant', 'giraffe', 'gym', 'age', 'cage', 'page', 'rage', 'sage', 'stage', 'wage', 'edge', 'badge', 'bridge', 'fridge', 'ridge', 'judge', 'huge', 'change'];

  for (const word of softCG) {
    if (items.length >= 500) break;
    items.push({
      id: generateId(2, 'SOFT', idx++),
      subject: 'spelling',
      grade: 2,
      skill: 'soft c and g',
      standard: 'RF.2.3',
      question: `Spell the word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'C and G are soft before e, i, or y.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 2 error:', error.message);
  else console.log(`Grade 2: Added ${items.length} items`);
}

async function fixGrade3() {
  console.log('Fixing Grade 3 (need 400 more)...');
  const items = [];
  let idx = 10001;

  // Additional suffix words
  const suffixes = {
    '-ness': ['kind', 'dark', 'weak', 'neat', 'sick', 'quick', 'thick', 'fresh', 'soft', 'harsh', 'rough', 'tough', 'bold', 'cold', 'wild', 'mild', 'bright', 'tight', 'light'],
    '-ment': ['move', 'place', 'state', 'treat', 'judge', 'manage', 'amaze', 'amuse', 'engage', 'arrange', 'announce', 'achieve', 'agree', 'argue', 'assign', 'attach', 'develop', 'employ', 'enjoy', 'improve']
  };

  for (const [suffix, bases] of Object.entries(suffixes)) {
    for (const base of bases) {
      if (items.length >= 200) break;
      const word = base + suffix.replace('-', '');
      items.push({
        id: generateId(3, 'SFX2', idx++),
        subject: 'spelling',
        grade: 3,
        skill: `suffix ${suffix}`,
        standard: 'RF.3.3',
        question: `Add "${suffix}" to "${base}". Spell the new word.`,
        answer: word,
        audio_word: word,
        tier1: generateTier1(word, `The suffix ${suffix} changes the word.`),
        tier2: generateTier2(word)
      });
    }
  }

  // Additional compound words
  const compounds = [
    'backpack', 'backyard', 'bathtub', 'bedtime', 'birdhouse', 'blackbird', 'blueberry', 'bookmark',
    'campfire', 'cardboard', 'carpool', 'classmate', 'clipboard', 'cornfield', 'countdown',
    'cowboy', 'crosswalk', 'daydream', 'dishwasher', 'doorbell', 'doorway', 'downhill',
    'dragonfly', 'driveway', 'drumstick', 'earring', 'earthquake', 'eggshell', 'everybody',
    'everyone', 'eyeball', 'eyelid', 'farmhouse', 'fingernail', 'fingerprint', 'firefly',
    'fireman', 'fireplace', 'firework', 'flashlight', 'flowerpot', 'footprint', 'football',
    'forever', 'friendship', 'goldfish', 'grandchild', 'grandfather', 'grandmother', 'grassland'
  ];

  for (const word of compounds) {
    if (items.length >= 400) break;
    items.push({
      id: generateId(3, 'COMP2', idx++),
      subject: 'spelling',
      grade: 3,
      skill: 'compound words',
      standard: 'L.3.2',
      question: `Spell the compound word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'Compound words combine two smaller words.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 3 error:', error.message);
  else console.log(`Grade 3: Added ${items.length} items`);
}

async function fixGrade4() {
  console.log('Fixing Grade 4 (need 400 more)...');
  const items = [];
  let idx = 10001;

  // More Greek/Latin roots
  const roots = {
    'tract': { meaning: 'pull or drag', words: ['attract', 'contract', 'distract', 'extract', 'subtract', 'tractor', 'traction', 'retract', 'protract', 'abstract'] },
    'form': { meaning: 'shape', words: ['form', 'format', 'reform', 'inform', 'conform', 'perform', 'transform', 'uniform', 'formula', 'formation', 'platform', 'deform'] },
    'miss mit': { meaning: 'send', words: ['mission', 'admit', 'commit', 'emit', 'omit', 'permit', 'submit', 'transmit', 'dismiss', 'missile', 'commission', 'permission'] },
    'rupt': { meaning: 'break', words: ['erupt', 'corrupt', 'disrupt', 'rupt', 'interrupt', 'bankrupt', 'abrupt', 'eruption', 'rupture', 'disruption'] }
  };

  for (const [root, data] of Object.entries(roots)) {
    for (const word of data.words) {
      if (items.length >= 400) break;
      items.push({
        id: generateId(4, 'ROOT2', idx++),
        subject: 'spelling',
        grade: 4,
        skill: `root ${root}`,
        standard: 'L.4.4',
        question: `Spell the word you hear: ${word}`,
        answer: word,
        audio_word: word,
        tier1: generateTier1(word, `The root "${root}" means "${data.meaning}".`),
        tier2: generateTier2(word)
      });
    }
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 4 error:', error.message);
  else console.log(`Grade 4: Added ${items.length} items`);
}

async function fixGrade6() {
  console.log('Fixing Grade 6 (need 50 more)...');
  const items = [];
  let idx = 3001;

  // Additional science/social studies words
  const words = [
    'accumulate', 'adjacent', 'apparatus', 'approximate', 'circumstance',
    'coefficient', 'comprehensive', 'configuration', 'consequence', 'constituent',
    'contaminate', 'coordinate', 'corresponding', 'demonstrate', 'deteriorate',
    'differentiate', 'displacement', 'equilibrium', 'equivalent', 'excavation',
    'fluctuation', 'fundamental', 'horizontal', 'hypothesis', 'implementation',
    'incorporate', 'infrastructure', 'innovation', 'interpretation', 'investigation',
    'justification', 'longitudinal', 'manipulation', 'modification', 'observation',
    'orientation', 'participation', 'perpendicular', 'phenomenon', 'precipitation',
    'predominant', 'preliminary', 'preservation', 'proclamation', 'proportion',
    'recommendation', 'representation', 'specification', 'transformation', 'verification'
  ];

  for (const word of words) {
    items.push({
      id: generateId(6, 'ADV', idx++),
      subject: 'spelling',
      grade: 6,
      skill: 'advanced vocabulary',
      standard: 'L.6.2',
      question: `Spell the word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'Break long words into syllables.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 6 error:', error.message);
  else console.log(`Grade 6: Added ${items.length} items`);
}

async function verify() {
  console.log('\n' + '='.repeat(50));
  console.log('VERIFICATION');
  console.log('='.repeat(50));

  const targets = { 0: 2000, 1: 4000, 2: 5000, 3: 5000, 4: 4000, 5: 3000, 6: 2000, 7: 1000 };
  let grandTotal = 0;

  for (let grade = 0; grade <= 7; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'spelling')
      .eq('grade', grade);

    const target = targets[grade];
    const pct = ((count / target) * 100).toFixed(1);
    const status = count >= target ? 'DONE' : 'PARTIAL';
    console.log(`Grade ${grade === 0 ? 'K' : grade}: ${count} / ${target} (${pct}%) - ${status}`);
    grandTotal += count;
  }

  console.log('\n' + '-'.repeat(50));
  console.log(`TOTAL: ${grandTotal} / 26,000 (${((grandTotal / 26000) * 100).toFixed(1)}%)`);
}

async function main() {
  await fixGrade2();
  await fixGrade3();
  await fixGrade4();
  await fixGrade6();
  await verify();
}

main().catch(console.error);
