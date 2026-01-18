// Fix spelling gaps - need exactly:
// Grade 2: 230 more
// Grade 3: 112 more
// Grade 4: 185 more

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
    teach: rule ? rule.substring(0, 80) : `Spell: ${word}`,
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
  console.log('Fixing Grade 2 (need 230 more)...');
  const items = [];
  let idx = 30001;

  // More word families and patterns
  const words = [
    // -ight family
    'bright', 'fight', 'flight', 'fright', 'knight', 'light', 'might', 'night', 'right', 'sight', 'slight', 'tight',
    // -ound family
    'bound', 'found', 'ground', 'hound', 'mound', 'pound', 'round', 'sound', 'wound',
    // -ould family
    'could', 'would', 'should',
    // Long vowel patterns
    'paid', 'raid', 'braid', 'afraid', 'laid', 'maid', 'wait', 'bait', 'trait',
    'feed', 'need', 'seed', 'weed', 'deed', 'speed', 'bleed', 'breed', 'greed',
    'boat', 'coat', 'float', 'goat', 'moat', 'throat', 'bloat',
    // Compound words
    'afternoon', 'airplane', 'anywhere', 'baseball', 'bathroom', 'bedroom', 'birthday', 'bluebird',
    'bookcase', 'breakfast', 'butterfly', 'cannot', 'classroom', 'cowboy', 'cupcake', 'daylight',
    'doghouse', 'downtown', 'dragonfly', 'driveway', 'earthquake', 'everybody', 'everyone', 'everything',
    'everywhere', 'eyeball', 'fingernail', 'firefly', 'fireman', 'fireplace', 'fishbowl', 'flashlight',
    'football', 'footprint', 'forever', 'grandfather', 'grandmother', 'grapefruit', 'grasshopper',
    'haircut', 'hallway', 'hamburger', 'handmade', 'handwriting', 'headache', 'herself', 'himself',
    'homemade', 'homework', 'horseshoe', 'hotdog', 'houseboat', 'inside', 'into', 'jellyfish',
    'keyboard', 'ladybug', 'lemonade', 'lighthouse', 'lipstick', 'mailbox', 'meatball', 'moonlight',
    'myself', 'nearby', 'necktie', 'newspaper', 'nighttime', 'nobody', 'notebook', 'nothing',
    'oatmeal', 'outside', 'overcome', 'overlook', 'overnight', 'pancake', 'peanut', 'piggybank',
    'playground', 'popcorn', 'railroad', 'rainbow', 'raincoat', 'raindrop', 'rattlesnake', 'rowboat',
    'sailboat', 'sandbox', 'scarecrow', 'seashell', 'shoelace', 'sidewalk', 'skateboard', 'snowball',
    'snowflake', 'snowman', 'somebody', 'someday', 'somehow', 'someone', 'something', 'sometime',
    'somewhere', 'spaceship', 'starfish', 'strawberry', 'suitcase', 'sunflower', 'sunlight', 'sunrise',
    'sunset', 'sunshine', 'supermarket', 'sweatshirt', 'teacup', 'teaspoon', 'themselves', 'thunderstorm',
    'tiptoe', 'toothbrush', 'toothpaste', 'treehouse', 'tugboat', 'underground', 'understand', 'uphill',
    'upstairs', 'volleyball', 'wallpaper', 'waterfall', 'watermelon', 'weekend', 'wheelchair', 'whenever',
    'wherever', 'windmill', 'without', 'woodpecker', 'yourself'
  ];

  for (let i = 0; i < 230 && i < words.length; i++) {
    const word = words[i];
    items.push({
      id: generateId(2, 'FIX', idx++),
      subject: 'spelling',
      grade: 2,
      skill: 'word patterns',
      standard: 'RF.2.3',
      question: `Spell the word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'Listen carefully and spell each sound.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 2 error:', error.message);
  else console.log(`Grade 2: Added ${items.length} items`);
  return items.length;
}

async function fixGrade3() {
  console.log('Fixing Grade 3 (need 112 more)...');
  const items = [];
  let idx = 30001;

  // More prefix/suffix words
  const words = [
    // more un- words
    'unable', 'unaware', 'uncertain', 'unclear', 'uncomfortable', 'uncommon', 'uncover', 'undo',
    'unequal', 'unfair', 'unfit', 'unfold', 'unfortunate', 'unfriendly', 'unhappy', 'unhealthy',
    'unkind', 'unknown', 'unlike', 'unlikely', 'unlock', 'unlucky', 'unnecessary', 'unpack',
    'unpleasant', 'unprepared', 'unreal', 'unsafe', 'unsure', 'untie', 'until', 'unusual',
    // more re- words
    'react', 'reappear', 'rearrange', 'rebuild', 'recall', 'recapture', 'receive', 'recent',
    'reclaim', 'recognize', 'reconsider', 'record', 'recover', 'recreate', 'recycle', 'redirect',
    'redo', 'reduce', 'reenter', 'refill', 'reflect', 'refresh', 'regain', 'regard',
    'region', 'regular', 'reject', 'relate', 'relax', 'release', 'reliable', 'relief',
    // more -ful words
    'beautiful', 'bountiful', 'cheerful', 'colorful', 'delightful', 'disgraceful', 'disrespectful',
    'dreadful', 'eventful', 'faithful', 'fanciful', 'forgetful', 'frightful', 'fruitful', 'gleeful',
    'graceful', 'grateful', 'handful', 'harmful', 'hateful', 'healthful', 'helpful', 'hopeful',
    // more -less words
    'ageless', 'aimless', 'blameless', 'boneless', 'bottomless', 'brainless', 'breathless', 'careless',
    'ceaseless', 'cheerless', 'childless', 'classless', 'cloudless', 'clueless', 'colorless', 'cordless',
    'costless', 'countless', 'defenseless', 'doubtless', 'effortless', 'emotionless', 'endless', 'faceless'
  ];

  for (let i = 0; i < 112 && i < words.length; i++) {
    const word = words[i];
    items.push({
      id: generateId(3, 'FIX', idx++),
      subject: 'spelling',
      grade: 3,
      skill: 'prefixes and suffixes',
      standard: 'RF.3.3',
      question: `Spell the word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'Break the word into prefix, base, and suffix.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 3 error:', error.message);
  else console.log(`Grade 3: Added ${items.length} items`);
  return items.length;
}

async function fixGrade4() {
  console.log('Fixing Grade 4 (need 185 more)...');
  const items = [];
  let idx = 30001;

  // More Greek/Latin root words and spelling patterns
  const words = [
    // more port words
    'airport', 'carport', 'deport', 'deportation', 'export', 'exporter', 'import', 'importance',
    'important', 'importer', 'passport', 'portable', 'portal', 'porter', 'portfolio', 'portion',
    'rapport', 'report', 'reporter', 'sport', 'sporting', 'support', 'supporter', 'teleport',
    'transport', 'transportation', 'transporter',
    // more struct words
    'construct', 'construction', 'constructive', 'destruct', 'destruction', 'destructive', 'infrastructure',
    'instruct', 'instruction', 'instructor', 'obstruct', 'obstruction', 'reconstruct', 'reconstruction',
    'restructure', 'structural', 'structure',
    // more rupt words
    'abrupt', 'abruptly', 'bankrupt', 'bankruptcy', 'corrupt', 'corruption', 'disrupt', 'disruption',
    'disruptive', 'erupt', 'eruption', 'interrupt', 'interruption', 'rupture',
    // more spect words
    'aspect', 'circumspect', 'disrespect', 'expect', 'expectation', 'inspect', 'inspection', 'inspector',
    'introspect', 'perspective', 'prospect', 'respect', 'respectful', 'retrospect', 'spectacle',
    'spectacular', 'spectator', 'spectrum', 'suspect',
    // more tract words
    'abstract', 'attract', 'attraction', 'attractive', 'contract', 'contractor', 'detract', 'distract',
    'distraction', 'extract', 'extraction', 'protract', 'retract', 'subtract', 'subtraction', 'traction',
    'tractor', 'tract',
    // Spelling rule words - doubling
    'admitted', 'beginning', 'committed', 'controlled', 'equipped', 'excelled', 'expelled', 'occurred',
    'omitted', 'permitted', 'preferred', 'propelled', 'rebelled', 'referred', 'regretted', 'submitted',
    'transferred', 'transmitted',
    // drop e words
    'achieving', 'admiring', 'advancing', 'advising', 'amusing', 'arriving', 'behaving', 'believing',
    'caring', 'causing', 'changing', 'chasing', 'choosing', 'closing', 'coming', 'competing',
    'completing', 'confusing', 'continuing', 'creating', 'dancing', 'deciding', 'declining', 'defining',
    'deleting', 'describing', 'desiring', 'dining', 'disagreeing', 'disappearing', 'discovering', 'disguising',
    'disposing', 'dividing', 'driving', 'encouraging', 'engaging', 'escaping', 'examining', 'excusing',
    'exercising', 'exploring', 'facing', 'fading', 'fascinating', 'filing', 'forcing', 'freezing',
    'gliding', 'governing', 'graduating', 'guiding', 'having', 'hiding', 'hiking', 'hiring',
    'hoping', 'housing', 'ignoring', 'imagining', 'including', 'increasing', 'inviting', 'involving'
  ];

  for (let i = 0; i < 185 && i < words.length; i++) {
    const word = words[i];
    items.push({
      id: generateId(4, 'FIX', idx++),
      subject: 'spelling',
      grade: 4,
      skill: 'roots and spelling rules',
      standard: 'L.4.4',
      question: `Spell the word you hear: ${word}`,
      answer: word,
      audio_word: word,
      tier1: generateTier1(word, 'Look for roots and apply spelling rules.'),
      tier2: generateTier2(word)
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) console.log('Grade 4 error:', error.message);
  else console.log(`Grade 4: Added ${items.length} items`);
  return items.length;
}

async function verify() {
  console.log('\n' + '='.repeat(50));
  console.log('FINAL VERIFICATION');
  console.log('='.repeat(50));

  const targets = { 0: 2000, 1: 4000, 2: 5000, 3: 5000, 4: 4000, 5: 3000, 6: 2000, 7: 1000 };
  let grandTotal = 0;
  let allDone = true;

  for (let grade = 0; grade <= 7; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'spelling')
      .eq('grade', grade);

    const target = targets[grade];
    const pct = ((count / target) * 100).toFixed(1);
    const status = count >= target ? 'DONE' : 'SHORT ' + (target - count);
    if (count < target) allDone = false;
    console.log(`Grade ${grade === 0 ? 'K' : grade}: ${count} / ${target} (${pct}%) - ${status}`);
    grandTotal += count;
  }

  console.log('-'.repeat(50));
  console.log(`TOTAL: ${grandTotal} / 26,000 (${((grandTotal / 26000) * 100).toFixed(1)}%)`);
  console.log(allDone ? '\nALL GRADES AT 100%!' : '\nSome grades still need items.');
}

async function main() {
  await fixGrade2();
  await fixGrade3();
  await fixGrade4();
  await verify();
}

main().catch(console.error);
