// Final fix for spelling shortfalls
// Grade 2: needs ~380 more
// Grade 3: needs ~311 more
// Grade 4: needs ~356 more

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
    teach: rule ? rule.substring(0, 80) : `Spell the word: ${word}`,
    steps: [
      { step: 1, visual: { type: 'word_building', data: { word, letters: word.split('') } }, voice_text: `The word is ${word}.`, duration: 4000 },
      { step: 2, visual: { type: 'word_building', data: { word, letters: word.split(''), highlighted: true } }, voice_text: `Spelled: ${word.split('').join('-')}.`, duration: 4000 }
    ]
  };
}

function generateTier2(word) {
  return {
    teach: `${word} - sound it out.`,
    steps: [{ step: 1, visual: { type: 'word_building', data: { word, letters: word.split('') } }, voice_text: `${word}.`, duration: 4000 }]
  };
}

async function fixGrade2() {
  console.log('Fixing Grade 2...');
  const items = [];
  let idx = 20001;

  // Long word families
  const wordFamilies = {
    '-ack': ['back', 'black', 'crack', 'pack', 'quack', 'rack', 'sack', 'shack', 'slack', 'smack', 'snack', 'stack', 'tack', 'track', 'whack'],
    '-ail': ['fail', 'hail', 'jail', 'mail', 'nail', 'pail', 'rail', 'sail', 'snail', 'tail', 'trail', 'wail', 'quail', 'frail', 'flail'],
    '-ain': ['brain', 'chain', 'drain', 'gain', 'grain', 'main', 'pain', 'plain', 'rain', 'Spain', 'sprain', 'stain', 'strain', 'train', 'vain'],
    '-ake': ['bake', 'brake', 'cake', 'fake', 'flake', 'lake', 'make', 'quake', 'rake', 'sake', 'shake', 'snake', 'stake', 'take', 'wake'],
    '-ale': ['bale', 'dale', 'gale', 'male', 'pale', 'sale', 'scale', 'shale', 'stale', 'tale', 'whale', 'vale', 'inhale', 'exhale', 'female'],
    '-ame': ['blame', 'came', 'fame', 'flame', 'frame', 'game', 'lame', 'name', 'same', 'shame', 'tame', 'became', 'rename', 'inflame', 'proclaim'],
    '-ank': ['bank', 'blank', 'clank', 'crank', 'dank', 'drank', 'frank', 'plank', 'prank', 'rank', 'sank', 'shrank', 'spank', 'tank', 'thank'],
    '-ate': ['ate', 'crate', 'date', 'fate', 'gate', 'grate', 'hate', 'Kate', 'late', 'mate', 'plate', 'rate', 'skate', 'slate', 'state'],
    '-aw': ['caw', 'claw', 'draw', 'flaw', 'gnaw', 'jaw', 'law', 'paw', 'raw', 'saw', 'slaw', 'straw', 'thaw', 'withdraw', 'outlaw'],
    '-ay': ['bay', 'clay', 'day', 'gray', 'hay', 'jay', 'lay', 'may', 'pay', 'play', 'pray', 'ray', 'say', 'spray', 'stay']
  };

  for (const [family, words] of Object.entries(wordFamilies)) {
    for (const word of words) {
      if (items.length >= 380) break;
      items.push({
        id: generateId(2, 'WF', idx++),
        subject: 'spelling',
        grade: 2,
        skill: `word family ${family}`,
        standard: 'RF.2.3',
        question: `Spell the word you hear: ${word}`,
        answer: word,
        audio_word: word,
        tier1: generateTier1(word, `Words in the ${family} family rhyme.`),
        tier2: generateTier2(word)
      });
    }
    if (items.length >= 380) break;
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 2 error:', error.message);
  else console.log(`Grade 2: Added ${items.length} items`);
}

async function fixGrade3() {
  console.log('Fixing Grade 3...');
  const items = [];
  let idx = 20001;

  // More prefixes and suffixes
  const prefixes = {
    'mis-': ['behave', 'count', 'fit', 'fortune', 'guide', 'hear', 'inform', 'judge', 'lead', 'match', 'place', 'print', 'read', 'spell', 'take', 'treat', 'trust', 'understand', 'use'],
    'over-': ['act', 'board', 'book', 'charge', 'coat', 'come', 'cook', 'crowd', 'do', 'dose', 'draw', 'due', 'eat', 'flow', 'grow', 'heat', 'lap', 'load', 'look', 'night'],
    'under-': ['age', 'arm', 'charge', 'class', 'coat', 'cover', 'cut', 'dog', 'dress', 'estimate', 'fed', 'foot', 'go', 'ground', 'line', 'mine', 'pass', 'pay', 'rate', 'sea']
  };

  for (const [prefix, bases] of Object.entries(prefixes)) {
    for (const base of bases) {
      if (items.length >= 200) break;
      const word = prefix.replace('-', '') + base;
      items.push({
        id: generateId(3, 'PFX3', idx++),
        subject: 'spelling',
        grade: 3,
        skill: `prefix ${prefix}`,
        standard: 'RF.3.3',
        question: `Add "${prefix}" to "${base}". Spell the new word.`,
        answer: word,
        audio_word: word,
        tier1: generateTier1(word, `The prefix ${prefix} changes the meaning.`),
        tier2: generateTier2(word)
      });
    }
    if (items.length >= 200) break;
  }

  // More syllable division words
  const vcvWords = ['cabin', 'camel', 'clever', 'clever', 'closet', 'comet', 'cozy', 'crazy', 'decent', 'depend', 'direct', 'driven', 'even', 'favor', 'fever', 'finish', 'flavor', 'focus', 'frozen', 'gravel', 'haven', 'hazard', 'hotel', 'human', 'item', 'labor', 'later', 'lemon', 'level', 'limit', 'linen', 'local', 'major', 'manor', 'melon', 'metal', 'minor', 'model', 'modern', 'moment', 'motor', 'nature', 'never', 'novel', 'ocean', 'olive', 'only', 'open', 'over', 'paper', 'pilot', 'planet', 'polar', 'polish', 'power', 'prefix', 'present', 'pretend', 'prevent', 'prison', 'problem', 'produce', 'program', 'project', 'promise', 'proper', 'protect', 'provide', 'radar', 'rapid', 'raven', 'recent', 'record', 'refuse', 'relax', 'remain', 'remind', 'repeat', 'report', 'result', 'retire', 'return', 'review', 'river', 'robin', 'robot', 'Roman', 'rotate', 'ruler', 'salad', 'season', 'second', 'secret', 'select', 'seven', 'shadow', 'shiver', 'silent', 'simple', 'siren', 'skater', 'slogan', 'soda', 'sofa', 'solar', 'spider', 'spiral', 'spoken', 'station', 'stolen', 'student', 'stupid', 'super', 'table', 'taken', 'talent', 'tiger', 'title', 'token', 'total', 'travel', 'trial', 'tulip', 'unit', 'until', 'vacant', 'value', 'vapor', 'Venus', 'video', 'vinyl', 'violet', 'virus', 'visit', 'vital', 'vocal', 'volume', 'wagon', 'waken', 'water'];

  for (const word of vcvWords) {
    if (items.length >= 311) break;
    items.push({
      id: generateId(3, 'SYLB', idx++),
      subject: 'spelling',
      grade: 3,
      skill: 'syllable division',
      standard: 'RF.3.3',
      question: `Spell the word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'Break words into syllables to spell them.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 3 error:', error.message);
  else console.log(`Grade 3: Added ${items.length} items`);
}

async function fixGrade4() {
  console.log('Fixing Grade 4...');
  const items = [];
  let idx = 20001;

  // More Latin/Greek roots
  const roots = {
    'ped pod': { meaning: 'foot', words: ['pedal', 'pedestrian', 'pedicure', 'pedestal', 'centipede', 'millipede', 'biped', 'tripod', 'podium', 'antipodal'] },
    'man manu': { meaning: 'hand', words: ['manual', 'manage', 'manicure', 'manifest', 'manipulate', 'maneuver', 'manufacture', 'manuscript', 'manner', 'manager'] },
    'mot mov': { meaning: 'move', words: ['motion', 'motor', 'motivate', 'motive', 'promote', 'remote', 'emotion', 'commotion', 'move', 'movement', 'movie', 'remove', 'removal'] },
    'cap capt': { meaning: 'take or seize', words: ['capture', 'captive', 'captain', 'capable', 'capacity', 'capital', 'capitalize', 'recapture', 'escape', 'caption'] },
    'flex flect': { meaning: 'bend', words: ['flex', 'flexible', 'reflex', 'reflect', 'reflection', 'deflect', 'inflect', 'genuflect'] },
    'terr': { meaning: 'earth or land', words: ['terrain', 'territory', 'terrace', 'terrestrial', 'subterranean', 'Mediterranean', 'terrier', 'terra'] }
  };

  for (const [root, data] of Object.entries(roots)) {
    for (const word of data.words) {
      if (items.length >= 150) break;
      items.push({
        id: generateId(4, 'RT4', idx++),
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

  // More suffixes
  const suffixWords = {
    '-ment': ['amazement', 'announcement', 'arrangement', 'assignment', 'attachment', 'basement', 'commitment', 'compartment', 'department', 'development', 'disappointment', 'embarrassment', 'encouragement', 'enjoyment', 'entertainment', 'environment', 'equipment', 'establishment', 'excitement', 'government', 'improvement', 'instrument', 'involvement', 'management', 'measurement', 'movement', 'payment', 'placement', 'punishment', 'replacement', 'requirement', 'retirement', 'settlement', 'shipment', 'statement', 'tournament', 'treatment'],
    '-ness': ['awareness', 'brightness', 'carelessness', 'cleverness', 'closeness', 'completeness', 'consciousness', 'coolness', 'correctness', 'darkness', 'deafness', 'dizziness', 'dryness', 'eagerness', 'emptiness', 'fairness', 'firmness', 'fitness', 'fondness', 'forgiveness', 'freshness', 'friendliness', 'fullness', 'gentleness', 'goodness', 'greatness', 'greenness', 'happiness', 'harshness', 'heaviness', 'helpfulness', 'hollowness', 'illness', 'kindness', 'laziness', 'likeness', 'loneliness', 'loudness', 'madness', 'meanness', 'mildness', 'nervousness', 'newness', 'openness', 'politeness', 'quietness', 'quickness', 'readiness', 'richness', 'rudeness', 'sadness', 'sharpness', 'shyness', 'sickness', 'sleepiness', 'slowness', 'smoothness', 'softness', 'soreness', 'steadiness', 'stiffness', 'stillness', 'sweetness', 'thickness', 'thinness', 'tidiness', 'tiredness', 'ugliness', 'weakness', 'wetness', 'whiteness', 'wilderness', 'willingness', 'witness', 'worthiness']
  };

  for (const [suffix, words] of Object.entries(suffixWords)) {
    for (const word of words) {
      if (items.length >= 356) break;
      items.push({
        id: generateId(4, 'SFX4', idx++),
        subject: 'spelling',
        grade: 4,
        skill: `suffix ${suffix}`,
        standard: 'RF.4.3',
        question: `Spell the word you hear: ${word}`,
        answer: word,
        audio_word: word,
        tier1: generateTier1(word, `The suffix ${suffix} changes the word.`),
        tier2: generateTier2(word)
      });
    }
    if (items.length >= 356) break;
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 4 error:', error.message);
  else console.log(`Grade 4: Added ${items.length} items`);
}

async function verify() {
  console.log('\n' + '='.repeat(50));
  console.log('FINAL VERIFICATION');
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
  await verify();
}

main().catch(console.error);
