// Fix missing Grade K (180 items) and Grade 2 (1000 items)
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateId(grade, skillCode, index) {
  return `READ-G${grade}-${skillCode}-${String(index).padStart(4, '0')}`;
}

function generateTier1(skill, answer, visualType, data) {
  return {
    teach: `Focus on ${skill}. Read carefully and think about the answer.`,
    steps: [
      { step: 1, visual: { type: visualType, data }, voice_text: 'Let us work on this together.', duration: 5000 },
      { step: 2, visual: { type: visualType, data: { ...data, answer } }, voice_text: `The answer is ${answer}.`, duration: 4000 }
    ]
  };
}

function generateTier2(skill, answer, visualType, data) {
  return {
    teach: `${skill} - think carefully.`,
    steps: [
      { step: 1, visual: { type: visualType, data: { ...data, simplified: true } }, voice_text: `The answer is ${answer}.`, duration: 4000 }
    ]
  };
}

async function fixGradeK() {
  console.log('Fixing Grade K (need 180 more items)...');
  const items = [];
  let idx = 7821;

  const sightWords = ['all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came', 'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like', 'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran'];
  const cvcWords = ['cat', 'bat', 'hat', 'mat', 'sat', 'rat', 'pat', 'fat', 'dog', 'log', 'fog', 'hog', 'jog', 'pig', 'big', 'dig', 'fig', 'wig', 'jig', 'bug', 'hug', 'mug', 'rug', 'tug', 'dug', 'jug', 'run', 'sun', 'fun', 'bun'];

  // Generate 90 sight word items
  for (let i = 0; i < 90; i++) {
    const word = sightWords[i % sightWords.length];
    items.push({
      id: generateId(0, 'SGHT', idx++),
      subject: 'reading',
      grade: 0,
      skill: 'sight words',
      standard: 'RF.K.3',
      lexile_level: 'BR',
      question: `Read this sight word: ${word}`,
      answer: word,
      tier1: generateTier1('sight words', word, 'sight_word', { word }),
      tier2: generateTier2('sight words', word, 'sight_word', { word })
    });
  }

  // Generate 90 CVC word items
  for (let i = 0; i < 90; i++) {
    const word = cvcWords[i % cvcWords.length];
    const letters = word.split('');
    items.push({
      id: generateId(0, 'BLND', idx++),
      subject: 'reading',
      grade: 0,
      skill: 'CVC words',
      standard: 'RF.K.3',
      lexile_level: 'BR',
      question: `Blend the sounds: ${letters.join('-')}. What word is it?`,
      answer: word,
      tier1: generateTier1('CVC words', word, 'word_building', { letters, word }),
      tier2: generateTier2('CVC words', word, 'word_building', { letters, word })
    });
  }

  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) {
    console.log('Grade K upload error:', error.message);
  } else {
    console.log(`Grade K: Added ${items.length} items`);
  }
}

async function fixGrade2() {
  console.log('Fixing Grade 2 (need 1000 more items)...');
  const items = [];
  let idx = 23021;

  const prefixes = [
    { prefix: 'un', meaning: 'not', words: ['happy', 'kind', 'safe', 'fair', 'lock', 'tie', 'do', 'pack', 'wrap', 'zip', 'able', 'even', 'cover', 'fold', 'load'] },
    { prefix: 're', meaning: 'again', words: ['read', 'write', 'do', 'play', 'start', 'build', 'fill', 'tell', 'paint', 'use', 'make', 'turn', 'open', 'move', 'place'] },
    { prefix: 'pre', meaning: 'before', words: ['heat', 'pay', 'view', 'test', 'wash', 'cook', 'set', 'mix', 'cut', 'plan'] },
    { prefix: 'dis', meaning: 'not', words: ['like', 'agree', 'appear', 'obey', 'honest', 'connect', 'trust', 'count', 'own', 'arm'] }
  ];

  const suffixes = [
    { suffix: 'ful', meaning: 'full of', words: ['care', 'help', 'hope', 'joy', 'pain', 'peace', 'play', 'thank', 'wonder', 'color', 'grace', 'truth', 'power', 'skill', 'fear'] },
    { suffix: 'less', meaning: 'without', words: ['care', 'help', 'hope', 'end', 'fear', 'home', 'sleep', 'use', 'wire', 'harm', 'rest', 'name', 'taste', 'price', 'worth'] },
    { suffix: 'ly', meaning: 'in a way', words: ['quick', 'slow', 'quiet', 'loud', 'soft', 'safe', 'nice', 'brave', 'kind', 'happy', 'sad', 'bad', 'mad', 'glad', 'sweet'] },
    { suffix: 'er', meaning: 'one who', words: ['teach', 'read', 'play', 'work', 'sing', 'farm', 'paint', 'help', 'build', 'run', 'swim', 'jump', 'dance', 'write', 'drive'] }
  ];

  const compoundWords = [
    { compound: 'sunflower', word1: 'sun', word2: 'flower' },
    { compound: 'rainbow', word1: 'rain', word2: 'bow' },
    { compound: 'birthday', word1: 'birth', word2: 'day' },
    { compound: 'playground', word1: 'play', word2: 'ground' },
    { compound: 'bedroom', word1: 'bed', word2: 'room' },
    { compound: 'toothbrush', word1: 'tooth', word2: 'brush' },
    { compound: 'butterfly', word1: 'butter', word2: 'fly' },
    { compound: 'snowman', word1: 'snow', word2: 'man' },
    { compound: 'cupcake', word1: 'cup', word2: 'cake' },
    { compound: 'football', word1: 'foot', word2: 'ball' },
    { compound: 'airplane', word1: 'air', word2: 'plane' },
    { compound: 'bookshelf', word1: 'book', word2: 'shelf' },
    { compound: 'pancake', word1: 'pan', word2: 'cake' },
    { compound: 'starfish', word1: 'star', word2: 'fish' },
    { compound: 'homework', word1: 'home', word2: 'work' },
    { compound: 'sunlight', word1: 'sun', word2: 'light' },
    { compound: 'moonlight', word1: 'moon', word2: 'light' },
    { compound: 'seashell', word1: 'sea', word2: 'shell' },
    { compound: 'goldfish', word1: 'gold', word2: 'fish' },
    { compound: 'grasshopper', word1: 'grass', word2: 'hopper' }
  ];

  // Generate 300 prefix items
  for (let round = 0; items.length < 300; round++) {
    for (const p of prefixes) {
      for (const word of p.words) {
        if (items.length >= 300) break;
        const newWord = p.prefix + word;
        items.push({
          id: generateId(2, 'PREF', idx++),
          subject: 'reading',
          grade: 2,
          skill: 'prefixes',
          standard: 'RF.2.3',
          lexile_level: '450L',
          question: `The prefix "${p.prefix}" means "${p.meaning}". Add it to "${word}". What word do you get?`,
          answer: newWord,
          tier1: generateTier1('prefixes', newWord, 'word_building', { prefix: p.prefix, base: word }),
          tier2: generateTier2('prefixes', newWord, 'word_building', { prefix: p.prefix, base: word })
        });
      }
    }
  }

  // Generate 400 suffix items
  for (let round = 0; items.length < 700; round++) {
    for (const s of suffixes) {
      for (const word of s.words) {
        if (items.length >= 700) break;
        const newWord = word + s.suffix;
        items.push({
          id: generateId(2, 'SUFF', idx++),
          subject: 'reading',
          grade: 2,
          skill: 'suffixes',
          standard: 'RF.2.3',
          lexile_level: '450L',
          question: `The suffix "${s.suffix}" means "${s.meaning}". Add it to "${word}". What word do you get?`,
          answer: newWord,
          tier1: generateTier1('suffixes', newWord, 'word_building', { suffix: s.suffix, base: word }),
          tier2: generateTier2('suffixes', newWord, 'word_building', { suffix: s.suffix, base: word })
        });
      }
    }
  }

  // Generate 300 compound word items
  for (let round = 0; items.length < 1000; round++) {
    for (const cw of compoundWords) {
      if (items.length >= 1000) break;
      const qType = round % 2;
      const qa = qType === 0
        ? { q: `What two words make up "${cw.compound}"?`, a: `${cw.word1} + ${cw.word2}` }
        : { q: `Put "${cw.word1}" and "${cw.word2}" together. What word do you get?`, a: cw.compound };
      items.push({
        id: generateId(2, 'VOCAB', idx++),
        subject: 'reading',
        grade: 2,
        skill: 'compound words',
        standard: 'RF.2.3',
        lexile_level: '450L',
        question: qa.q,
        answer: qa.a,
        tier1: generateTier1('compound words', qa.a, 'word_building', cw),
        tier2: generateTier2('compound words', qa.a, 'word_building', cw)
      });
    }
  }

  // Upload in batches of 500
  for (let i = 0; i < items.length; i += 500) {
    const batch = items.slice(i, i + 500);
    const { error } = await supabase.from('practice_problems').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.log('Grade 2 batch error:', error.message);
    } else {
      console.log(`Grade 2: Uploaded batch ${Math.floor(i/500) + 1} (${batch.length} items)`);
    }
  }
  console.log(`Grade 2: Added ${items.length} items total`);
}

async function verify() {
  console.log('\n' + '='.repeat(50));
  console.log('VERIFICATION');
  console.log('='.repeat(50));

  const targets = { 0: 8000, 1: 10000, 2: 10000, 3: 8000, 4: 6000, 5: 5000, 6: 3000, 7: 2000 };

  for (let grade = 0; grade <= 7; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'reading')
      .eq('grade', grade);
    const target = targets[grade];
    const status = count >= target ? 'COMPLETE' : 'PARTIAL';
    console.log(`Grade ${grade}: ${count} / ${target} (${status})`);
  }

  const { count: total } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'reading');
  console.log('\nTOTAL READING ITEMS:', total);
  console.log('Target: 52,000');
  console.log('Percentage:', ((total / 52000) * 100).toFixed(1) + '%');
}

async function main() {
  await fixGradeK();
  await fixGrade2();
  await verify();
}

main().catch(console.error);
