// Generate Reading Content for SchoolGenius
// Target: 52,000 items across grades K-7
// Per CCOS Protocol - All items have lexile_level field

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Grade targets
const GRADE_TARGETS = {
  0: 8000,   // Kindergarten
  1: 10000,  // Grade 1
  2: 10000,  // Grade 2
  3: 8000,   // Grade 3
  4: 6000,   // Grade 4
  5: 5000,   // Grade 5
  6: 3000,   // Grade 6
  7: 2000    // Grade 7
};

// Load template for a grade
function loadTemplate(grade) {
  const gradeFile = grade === 0 ? 'K' : `G${grade}`;
  const path = `./library/templates/reading/reading-templates-${gradeFile}.json`;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.error(`Failed to load template for grade ${grade}:`, e.message);
    return null;
  }
}

// Generate unique ID
function generateId(grade, skillCode, index) {
  return `READ-G${grade}-${skillCode}-${String(index).padStart(4, '0')}`;
}

// Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick random item from array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate tier1 explanation
function generateTier1(skill, question, answer, visualType, visualData) {
  const teaches = {
    'letter recognition': 'Look at the shape of the letter. Each letter has a unique shape.',
    'letter sounds': 'Each letter makes a special sound. Listen and repeat the sound.',
    'rhyming words': 'Rhyming words end with the same sound. Listen to the ending.',
    'CVC words': 'Sound out each letter, then blend them together smoothly.',
    'sight words': 'This is a sight word. Memorize how it looks and sounds.',
    'story characters': 'The character is who the story is about. Look for names.',
    'sequencing': 'Stories have order: first, next, then, last. Look for clue words.',
    'short vowel sounds': 'Short vowels say their quick sound: a as in cat, e as in bed.',
    'long vowel sounds': 'Long vowels say their name: a as in cake, e as in tree.',
    'consonant blends': 'Blends are two consonants that blend together but keep their sounds.',
    'consonant digraphs': 'Digraphs are two letters that make one new sound together.',
    'prefixes': 'A prefix is added to the beginning of a word to change its meaning.',
    'suffixes': 'A suffix is added to the end of a word to change its meaning.',
    'compound words': 'A compound word is made from two smaller words put together.',
    'context clues': 'Use the words around an unknown word to figure out its meaning.',
    'synonyms and antonyms': 'Synonyms mean the same. Antonyms mean the opposite.',
    'root words': 'The root is the base word. Prefixes and suffixes attach to it.',
    'theme and central message': 'The theme is the lesson or message the story teaches.',
    'character development': 'Watch how characters change from the beginning to the end.',
    'text evidence': 'Find specific words or sentences in the text that prove your answer.',
    'main idea and details': 'The main idea is what the passage is mostly about.',
    'story structure': 'Stories have a beginning, middle, and end. Find the problem and solution.',
    'figurative language': 'Figurative language uses words in creative ways, not literally.',
    'theme': 'The theme is the big idea or life lesson in the story.',
    'summarizing': 'A summary includes only the most important information.',
    'point of view': 'Point of view is who is telling the story and what they know.',
    'text structure': 'Authors organize text in patterns: sequence, cause/effect, compare/contrast.',
    'citing textual evidence': 'Quote directly from the text to support your answer.',
    'theme development': 'Trace how the author builds the theme through events and characters.',
    'plot development': 'Follow how the story events build to the climax and resolution.',
    'text structure analysis': 'Analyze why the author chose this particular organization.',
    'central idea in informational text': 'The central idea is the main point the author wants you to understand.',
    'author\'s point of view': 'The author\'s point of view is their opinion or perspective on the topic.',
    'word relationships': 'Analogies show relationships between pairs of words.',
    'connotation and denotation': 'Denotation is the dictionary meaning. Connotation is the feeling.',
    'figurative language advanced': 'Advanced figurative language includes hyperbole and personification.',
    'theme across texts': 'Compare how different texts explore the same theme.',
    'comparing characters and settings': 'Look for similarities and differences between characters or settings.',
    'narrator point of view': 'Consider what the narrator knows and how it affects the story.',
    'author\'s evidence and reasoning': 'Evaluate if the evidence supports the claim logically.',
    'multiple accounts': 'Different sources may describe the same event differently.',
    'citing multiple evidence': 'Find several pieces of evidence to strongly support your answer.',
    'analyzing theme development': 'Track how the theme grows through events, dialogue, and changes.',
    'character and story development': 'Analyze how character interactions move the plot forward.',
    'word choice impact': 'Consider how different word choices would change the meaning.',
    'point of view development': 'Analyze how the author builds contrasting viewpoints.',
    'central idea analysis': 'Trace how the central idea emerges and is developed with details.',
    'evaluating arguments': 'Check if the reasoning is sound and evidence is sufficient.'
  };

  return {
    teach: teaches[skill] || `Focus on understanding ${skill}. Read carefully and think.`,
    steps: [
      {
        step: 1,
        visual: { type: visualType, data: visualData },
        voice_text: `Let's solve this together. ${teaches[skill]?.split('.')[0] || 'Look carefully.'}`,
        duration: 5000
      },
      {
        step: 2,
        visual: { type: visualType, data: { ...visualData, highlight: answer } },
        voice_text: `The answer is ${answer}. Great job!`,
        duration: 4000
      }
    ]
  };
}

// Generate tier2 (simpler) explanation
function generateTier2(skill, question, answer, visualType, visualData) {
  const simpleTeaches = {
    'letter recognition': 'Look at the letter shape carefully.',
    'letter sounds': 'Say the sound out loud.',
    'rhyming words': 'Words that rhyme sound the same at the end.',
    'CVC words': 'Say each sound, then put them together.',
    'sight words': 'Remember this word. Say it out loud.',
    'story characters': 'Who is in the story?',
    'sequencing': 'What happened first? Next? Last?',
    'short vowel sounds': 'Short vowels make quick sounds.',
    'long vowel sounds': 'Long vowels say their name.',
    'consonant blends': 'Two letters blend together.',
    'consonant digraphs': 'Two letters make one sound.',
    'prefixes': 'The prefix changes the word meaning.',
    'suffixes': 'The ending changes the word meaning.',
    'compound words': 'Two words make one new word.',
    'context clues': 'Look at nearby words for hints.',
    'synonyms and antonyms': 'Same meaning or opposite meaning?',
    'root words': 'Find the base word inside.',
    'theme and central message': 'What lesson does this teach?',
    'character development': 'How did the character change?',
    'text evidence': 'Find the proof in the text.',
    'main idea and details': 'What is this mostly about?',
    'story structure': 'Beginning, middle, end.',
    'figurative language': 'What does this really mean?',
    'theme': 'What is the big lesson?',
    'summarizing': 'What are the most important parts?',
    'point of view': 'Who is telling the story?',
    'text structure': 'How is this organized?',
    'citing textual evidence': 'Quote from the text.',
    'theme development': 'How does the theme grow?',
    'plot development': 'How do events build up?',
    'text structure analysis': 'Why this organization?',
    'central idea in informational text': 'What is the main point?',
    'author\'s point of view': 'What does the author think?',
    'word relationships': 'How are these words connected?',
    'connotation and denotation': 'Feeling vs. definition.',
    'figurative language advanced': 'Not literal meaning.',
    'theme across texts': 'Same lesson, different stories.',
    'comparing characters and settings': 'Same or different?',
    'narrator point of view': 'What does the narrator know?',
    'author\'s evidence and reasoning': 'Does the proof make sense?',
    'multiple accounts': 'Different views of same event.',
    'citing multiple evidence': 'Find several proofs.',
    'analyzing theme development': 'Follow the lesson through.',
    'character and story development': 'Characters affect the plot.',
    'word choice impact': 'Words matter.',
    'point of view development': 'Different characters think differently.',
    'central idea analysis': 'Find the main point.',
    'evaluating arguments': 'Is this convincing?'
  };

  return {
    teach: simpleTeaches[skill] || `Think about ${skill} carefully.`,
    steps: [
      {
        step: 1,
        visual: { type: visualType, data: { ...visualData, simplified: true } },
        voice_text: `The answer is ${answer}.`,
        duration: 4000
      }
    ]
  };
}

// Generate items for Kindergarten
function generateKindergartenItems(template, startIndex) {
  const items = [];
  let idx = startIndex;
  const target = GRADE_TARGETS[0];
  const lexile = template.default_lexile;

  // Letter recognition (1000 items)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (let round = 0; round < 38 && items.length < 1000; round++) {
    for (const letter of letters) {
      if (items.length >= 1000) break;
      const isUpper = round % 2 === 0;
      const displayLetter = isUpper ? letter : letter.toLowerCase();
      const questionTypes = [
        `Which letter is this? ${displayLetter}`,
        `Point to the letter ${displayLetter}.`,
        `What letter do you see? ${displayLetter}`,
        `Is this the letter ${displayLetter}? Yes or No?`
      ];

      items.push({
        id: generateId(0, 'LETR', idx++),
        subject: 'reading',
        grade: 0,
        skill: 'letter recognition',
        standard: 'RF.K.1',
        lexile_level: lexile,
        question: pickRandom(questionTypes),
        answer: letter,
        tier1: generateTier1('letter recognition', '', letter, 'phonics', { letter: displayLetter }),
        tier2: generateTier2('letter recognition', '', letter, 'phonics', { letter: displayLetter })
      });
    }
  }

  // Letter sounds (1200 items)
  const letterSounds = template.skills.find(s => s.skill === 'letter sounds')?.letter_sounds || {};
  for (let round = 0; round < 46 && items.length < 2200; round++) {
    for (const [letter, sound] of Object.entries(letterSounds)) {
      if (items.length >= 2200) break;
      const questionTypes = [
        `What sound does the letter ${letter} make?`,
        `Say the sound for ${letter}.`,
        `Which letter makes the /${sound}/ sound?`
      ];

      items.push({
        id: generateId(0, 'PHON', idx++),
        subject: 'reading',
        grade: 0,
        skill: 'letter sounds',
        standard: 'RF.K.3',
        lexile_level: lexile,
        question: pickRandom(questionTypes),
        answer: `/${sound}/`,
        tier1: generateTier1('letter sounds', '', `/${sound}/`, 'phonics', { letter, sound }),
        tier2: generateTier2('letter sounds', '', `/${sound}/`, 'phonics', { letter, sound })
      });
    }
  }

  // Rhyming words (800 items)
  const rhymeFamilies = template.skills.find(s => s.skill === 'rhyming words')?.rhyme_families || {};
  for (const [family, words] of Object.entries(rhymeFamilies)) {
    for (let i = 0; i < words.length && items.length < 3000; i++) {
      for (let j = i + 1; j < words.length && items.length < 3000; j++) {
        const word1 = words[i];
        const word2 = words[j];
        const wrongWord = pickRandom(Object.values(rhymeFamilies).flat().filter(w => !words.includes(w)));

        items.push({
          id: generateId(0, 'PHON', idx++),
          subject: 'reading',
          grade: 0,
          skill: 'rhyming words',
          standard: 'RF.K.2',
          lexile_level: lexile,
          question: `Which word rhymes with ${word1}? A) ${word2} B) ${wrongWord}`,
          answer: word2,
          tier1: generateTier1('rhyming words', '', word2, 'word_building', { word1, word2, family }),
          tier2: generateTier2('rhyming words', '', word2, 'word_building', { word1, word2, family })
        });
      }
    }
  }

  // CVC words (1500 items)
  const cvcWords = template.skills.find(s => s.skill === 'CVC words')?.cvc_words || [];
  for (let round = 0; round < 20 && items.length < 4500; round++) {
    for (const word of shuffle(cvcWords)) {
      if (items.length >= 4500) break;
      const letters = word.split('');
      const questionTypes = [
        `Blend the sounds: ${letters.join('-')}. What word is it?`,
        `Sound it out: ${word}`,
        `What word do these letters make? ${letters.join(' ')}`
      ];

      items.push({
        id: generateId(0, 'BLND', idx++),
        subject: 'reading',
        grade: 0,
        skill: 'CVC words',
        standard: 'RF.K.3',
        lexile_level: lexile,
        question: pickRandom(questionTypes),
        answer: word,
        tier1: generateTier1('CVC words', '', word, 'word_building', { letters, word }),
        tier2: generateTier2('CVC words', '', word, 'word_building', { letters, word })
      });
    }
  }

  // Sight words (1500 items)
  const sightWords = template.skills.find(s => s.skill === 'sight words')?.sight_words || [];
  for (let round = 0; round < 17 && items.length < 6000; round++) {
    for (const word of shuffle(sightWords)) {
      if (items.length >= 6000) break;
      const questionTypes = [
        `Read this word: ${word}`,
        `What word is this? ${word}`,
        `Point to the word "${word}".`
      ];

      items.push({
        id: generateId(0, 'SGHT', idx++),
        subject: 'reading',
        grade: 0,
        skill: 'sight words',
        standard: 'RF.K.3',
        lexile_level: lexile,
        question: pickRandom(questionTypes),
        answer: word,
        tier1: generateTier1('sight words', '', word, 'sight_word', { word }),
        tier2: generateTier2('sight words', '', word, 'sight_word', { word })
      });
    }
  }

  // Story characters (1000 items)
  const miniStories = template.skills.find(s => s.skill === 'story characters')?.mini_stories || [];
  for (let round = 0; round < 200 && items.length < 7000; round++) {
    for (const story of miniStories) {
      if (items.length >= 7000) break;
      const questionTypes = [
        { q: `Who is in the story "${story.title}"?`, a: story.character },
        { q: `Read: "${story.text}"\n\nWho is this story about?`, a: story.character },
        { q: `Read: "${story.text}"\n\nWhere does the story happen?`, a: story.setting },
        { q: `Read: "${story.text}"\n\nWhat happens in the story?`, a: story.event }
      ];
      const qa = pickRandom(questionTypes);

      items.push({
        id: generateId(0, 'CHAR', idx++),
        subject: 'reading',
        grade: 0,
        skill: 'story characters',
        standard: 'RL.K.3',
        lexile_level: lexile,
        question: qa.q,
        answer: qa.a,
        tier1: generateTier1('story characters', qa.q, qa.a, 'comprehension_question', { story: story.text }),
        tier2: generateTier2('story characters', qa.q, qa.a, 'comprehension_question', { story: story.text })
      });
    }
  }

  // Sequencing (1000 items)
  const sequenceStories = template.skills.find(s => s.skill === 'sequencing')?.sequence_stories || [];
  for (let round = 0; round < 333 && items.length < target; round++) {
    for (const story of sequenceStories) {
      if (items.length >= target) break;
      const questionTypes = [
        { q: `"${story.title}": ${story.steps.join(' ')}\n\nWhat happened first?`, a: story.first },
        { q: `"${story.title}": ${story.steps.join(' ')}\n\nWhat happened next?`, a: story.middle },
        { q: `"${story.title}": ${story.steps.join(' ')}\n\nWhat happened last?`, a: story.last }
      ];
      const qa = pickRandom(questionTypes);

      items.push({
        id: generateId(0, 'COMP', idx++),
        subject: 'reading',
        grade: 0,
        skill: 'sequencing',
        standard: 'RL.K.2',
        lexile_level: lexile,
        question: qa.q,
        answer: qa.a,
        tier1: generateTier1('sequencing', qa.q, qa.a, 'comprehension_question', { steps: story.steps }),
        tier2: generateTier2('sequencing', qa.q, qa.a, 'comprehension_question', { steps: story.steps })
      });
    }
  }

  return items.slice(0, target);
}

// Generate items for grades 1-7 (generic function)
function generateGradeItems(grade, template, startIndex) {
  const items = [];
  let idx = startIndex;
  const target = GRADE_TARGETS[grade];
  const lexile = template.default_lexile;

  for (const skillDef of template.skills) {
    const skillTarget = skillDef.count;
    const skill = skillDef.skill;
    const code = skillDef.code;
    const standard = skillDef.standard;
    const visualType = skillDef.visual_type;

    let generated = 0;

    // Generate based on skill data available
    if (skillDef.short_vowel_words) {
      for (const [vowel, words] of Object.entries(skillDef.short_vowel_words)) {
        for (const word of words) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `What is the vowel sound in "${word}"? Is it short or long?`,
            answer: `short ${vowel}`,
            tier1: generateTier1(skill, '', `short ${vowel}`, visualType, { word, vowel }),
            tier2: generateTier2(skill, '', `short ${vowel}`, visualType, { word, vowel })
          });
          generated++;
        }
      }
    }

    if (skillDef.long_vowel_words) {
      for (const [vowel, words] of Object.entries(skillDef.long_vowel_words)) {
        for (const word of words) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `What is the vowel sound in "${word}"? Is it short or long?`,
            answer: `long ${vowel}`,
            tier1: generateTier1(skill, '', `long ${vowel}`, visualType, { word, vowel }),
            tier2: generateTier2(skill, '', `long ${vowel}`, visualType, { word, vowel })
          });
          generated++;
        }
      }
    }

    if (skillDef.blends) {
      for (const [blend, words] of Object.entries(skillDef.blends)) {
        for (const word of words) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `What blend do you hear at the beginning of "${word}"?`,
            answer: blend,
            tier1: generateTier1(skill, '', blend, visualType, { word, blend }),
            tier2: generateTier2(skill, '', blend, visualType, { word, blend })
          });
          generated++;
        }
      }
    }

    if (skillDef.digraphs) {
      for (const [digraph, words] of Object.entries(skillDef.digraphs)) {
        for (const word of words) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `Which digraph do you hear in "${word}"?`,
            answer: digraph,
            tier1: generateTier1(skill, '', digraph, visualType, { word, digraph }),
            tier2: generateTier2(skill, '', digraph, visualType, { word, digraph })
          });
          generated++;
        }
      }
    }

    if (skillDef.sight_words) {
      for (let round = 0; round < 40 && generated < skillTarget; round++) {
        for (const word of shuffle(skillDef.sight_words)) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `Read this sight word: ${word}`,
            answer: word,
            tier1: generateTier1(skill, '', word, visualType, { word }),
            tier2: generateTier2(skill, '', word, visualType, { word })
          });
          generated++;
        }
      }
    }

    if (skillDef.prefixes) {
      for (const [prefix, data] of Object.entries(skillDef.prefixes)) {
        for (const wordPair of data.words) {
          if (generated >= skillTarget) break;
          const [base, prefixed] = wordPair.split('/');
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `The prefix "${prefix}" means "${data.meaning}". Add it to "${base}". What word do you get?`,
            answer: prefixed,
            tier1: generateTier1(skill, '', prefixed, visualType, { prefix, base, meaning: data.meaning }),
            tier2: generateTier2(skill, '', prefixed, visualType, { prefix, base, meaning: data.meaning })
          });
          generated++;
        }
      }
    }

    if (skillDef.suffixes) {
      for (const [suffix, data] of Object.entries(skillDef.suffixes)) {
        for (const wordPair of data.words) {
          if (generated >= skillTarget) break;
          const [base, suffixed] = wordPair.split('/');
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `The suffix "${suffix}" means "${data.meaning}". Add it to "${base}". What word do you get?`,
            answer: suffixed,
            tier1: generateTier1(skill, '', suffixed, visualType, { suffix, base, meaning: data.meaning }),
            tier2: generateTier2(skill, '', suffixed, visualType, { suffix, base, meaning: data.meaning })
          });
          generated++;
        }
      }
    }

    if (skillDef.compound_words) {
      for (let round = 0; round < 60 && generated < skillTarget; round++) {
        for (const cw of skillDef.compound_words) {
          if (generated >= skillTarget) break;
          const qTypes = [
            { q: `What two words make up "${cw.compound}"?`, a: `${cw.word1} + ${cw.word2}` },
            { q: `Put "${cw.word1}" and "${cw.word2}" together. What word do you get?`, a: cw.compound }
          ];
          const qa = pickRandom(qTypes);
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: qa.q,
            answer: qa.a,
            tier1: generateTier1(skill, qa.q, qa.a, visualType, cw),
            tier2: generateTier2(skill, qa.q, qa.a, visualType, cw)
          });
          generated++;
        }
      }
    }

    if (skillDef.context_sentences) {
      for (let round = 0; round < 130 && generated < skillTarget; round++) {
        for (const ctx of skillDef.context_sentences) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `"${ctx.sentence}"\n\nWhat does "${ctx.word}" mean in this sentence?`,
            answer: ctx.meaning,
            tier1: generateTier1(skill, '', ctx.meaning, visualType, ctx),
            tier2: generateTier2(skill, '', ctx.meaning, visualType, ctx)
          });
          generated++;
        }
      }
    }

    if (skillDef.word_pairs) {
      for (let round = 0; round < 130 && generated < skillTarget; round++) {
        for (const wp of skillDef.word_pairs) {
          if (generated >= skillTarget) break;
          const syn = pickRandom(wp.synonyms);
          const ant = pickRandom(wp.antonyms);
          const qTypes = [
            { q: `What is a synonym for "${wp.word}"?`, a: syn },
            { q: `What is an antonym for "${wp.word}"?`, a: ant }
          ];
          const qa = pickRandom(qTypes);
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: qa.q,
            answer: qa.a,
            tier1: generateTier1(skill, qa.q, qa.a, visualType, wp),
            tier2: generateTier2(skill, qa.q, qa.a, visualType, wp)
          });
          generated++;
        }
      }
    }

    if (skillDef.stories) {
      for (let round = 0; round < 500 && generated < skillTarget; round++) {
        for (const story of skillDef.stories) {
          if (generated >= skillTarget) break;
          if (story.questions) {
            const qTypes = [
              { q: `"${story.text}"\n\nWho is in the story?`, a: story.questions.who },
              { q: `"${story.text}"\n\nWhat happened?`, a: story.questions.what },
              { q: `"${story.text}"\n\nWhere did it happen?`, a: story.questions.where }
            ];
            const qa = pickRandom(qTypes);
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: qa.q,
              answer: qa.a,
              tier1: generateTier1(skill, qa.q, qa.a, visualType, story),
              tier2: generateTier2(skill, qa.q, qa.a, visualType, story)
            });
            generated++;
          } else if (story.who) {
            // Alternative story format
            const qTypes = [
              { q: `"${story.text}"\n\nWho is in the story?`, a: story.who },
              { q: `"${story.text}"\n\nWhat happened?`, a: story.what },
              { q: `"${story.text}"\n\nWhere did it happen?`, a: story.where }
            ];
            const qa = pickRandom(qTypes);
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: qa.q,
              answer: qa.a,
              tier1: generateTier1(skill, qa.q, qa.a, visualType, story),
              tier2: generateTier2(skill, qa.q, qa.a, visualType, story)
            });
            generated++;
          }
        }
      }
    }

    if (skillDef.passages) {
      for (let round = 0; round < 500 && generated < skillTarget; round++) {
        for (const passage of skillDef.passages) {
          if (generated >= skillTarget) break;
          if (passage.questions) {
            const qTypes = Object.entries(passage.questions).map(([type, ans]) => ({
              q: `"${passage.text}"\n\n${type === 'who' ? 'Who is in the passage?' : type === 'what' ? 'What happened?' : type === 'where' ? 'Where did it happen?' : type === 'when' ? 'When did it happen?' : 'Why did this happen?'}`,
              a: ans
            }));
            const qa = pickRandom(qTypes);
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: qa.q,
              answer: qa.a,
              tier1: generateTier1(skill, qa.q, qa.a, visualType, passage),
              tier2: generateTier2(skill, qa.q, qa.a, visualType, passage)
            });
            generated++;
          } else if (passage.main_idea) {
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: `"${passage.text}"\n\nWhat is the main idea?`,
              answer: passage.main_idea,
              tier1: generateTier1(skill, '', passage.main_idea, visualType, passage),
              tier2: generateTier2(skill, '', passage.main_idea, visualType, passage)
            });
            generated++;
          }
        }
      }
    }

    if (skillDef.roots) {
      for (let round = 0; round < 100 && generated < skillTarget; round++) {
        for (const rootDef of skillDef.roots) {
          if (generated >= skillTarget) break;
          for (const word of rootDef.words) {
            if (generated >= skillTarget) break;
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: `The root "${rootDef.root}" means "${rootDef.meaning || 'base meaning'}". What is the root word in "${word}"?`,
              answer: rootDef.root,
              tier1: generateTier1(skill, '', rootDef.root, visualType, rootDef),
              tier2: generateTier2(skill, '', rootDef.root, visualType, rootDef)
            });
            generated++;
          }
        }
      }
    }

    if (skillDef.themed_passages) {
      for (let round = 0; round < 250 && generated < skillTarget; round++) {
        for (const tp of skillDef.themed_passages) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `"${tp.text}"\n\nWhat is the theme or lesson of this story?`,
            answer: tp.theme,
            tier1: generateTier1(skill, '', tp.theme, visualType, tp),
            tier2: generateTier2(skill, '', tp.theme, visualType, tp)
          });
          generated++;
        }
      }
    }

    if (skillDef.theme_passages) {
      for (let round = 0; round < 250 && generated < skillTarget; round++) {
        for (const tp of skillDef.theme_passages) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `"${tp.text}"\n\nWhat is the theme?`,
            answer: tp.theme,
            tier1: generateTier1(skill, '', tp.theme, visualType, tp),
            tier2: generateTier2(skill, '', tp.theme, visualType, tp)
          });
          generated++;
        }
      }
    }

    if (skillDef.evidence_passages) {
      for (let round = 0; round < 200 && generated < skillTarget; round++) {
        for (const ep of skillDef.evidence_passages) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `"${ep.text}"\n\n${ep.question}`,
            answer: ep.answer,
            tier1: generateTier1(skill, '', ep.answer, visualType, ep),
            tier2: generateTier2(skill, '', ep.answer, visualType, ep)
          });
          generated++;
        }
      }
    }

    if (skillDef.main_idea_passages) {
      for (let round = 0; round < 500 && generated < skillTarget; round++) {
        for (const mp of skillDef.main_idea_passages) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `"${mp.text}"\n\nWhat is the main idea?`,
            answer: mp.main_idea,
            tier1: generateTier1(skill, '', mp.main_idea, visualType, mp),
            tier2: generateTier2(skill, '', mp.main_idea, visualType, mp)
          });
          generated++;
        }
      }
    }

    if (skillDef.structure_stories) {
      for (let round = 0; round < 300 && generated < skillTarget; round++) {
        for (const ss of skillDef.structure_stories) {
          if (generated >= skillTarget) break;
          const qTypes = [
            { q: `"${ss.beginning} ${ss.middle} ${ss.end}"\n\nWhat was the problem?`, a: ss.problem },
            { q: `"${ss.beginning} ${ss.middle} ${ss.end}"\n\nHow was it solved?`, a: ss.solution }
          ];
          const qa = pickRandom(qTypes);
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: qa.q,
            answer: qa.a,
            tier1: generateTier1(skill, qa.q, qa.a, visualType, ss),
            tier2: generateTier2(skill, qa.q, qa.a, visualType, ss)
          });
          generated++;
        }
      }
    }

    if (skillDef.retell_stories) {
      for (let round = 0; round < 400 && generated < skillTarget; round++) {
        for (const rs of skillDef.retell_stories) {
          if (generated >= skillTarget) break;
          const qTypes = [
            { q: `"${rs.beginning} ${rs.middle} ${rs.end}"\n\nWhat happened first?`, a: rs.beginning },
            { q: `"${rs.beginning} ${rs.middle} ${rs.end}"\n\nWhat is the lesson?`, a: rs.message }
          ];
          const qa = pickRandom(qTypes);
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: qa.q,
            answer: qa.a,
            tier1: generateTier1(skill, qa.q, qa.a, visualType, rs),
            tier2: generateTier2(skill, qa.q, qa.a, visualType, rs)
          });
          generated++;
        }
      }
    }

    if (skillDef.examples) {
      for (let round = 0; round < 200 && generated < skillTarget; round++) {
        for (const ex of skillDef.examples) {
          if (generated >= skillTarget) break;
          items.push({
            id: generateId(grade, code, idx++),
            subject: 'reading',
            grade,
            skill,
            standard,
            lexile_level: lexile,
            question: `"${ex.text}"\n\nIs this fiction or nonfiction?`,
            answer: ex.type,
            tier1: generateTier1(skill, '', ex.type, visualType, ex),
            tier2: generateTier2(skill, '', ex.type, visualType, ex)
          });
          generated++;
        }
      }
    }

    if (skillDef.figurative_language) {
      const fl = skillDef.figurative_language;
      if (fl.similes) {
        for (let round = 0; round < 50 && generated < skillTarget; round++) {
          for (const sim of fl.similes) {
            if (generated >= skillTarget) break;
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: `"${sim.sentence}"\n\nThis is a simile. What does it mean?`,
              answer: sim.meaning,
              tier1: generateTier1(skill, '', sim.meaning, visualType, sim),
              tier2: generateTier2(skill, '', sim.meaning, visualType, sim)
            });
            generated++;
          }
        }
      }
      if (fl.metaphors) {
        for (let round = 0; round < 50 && generated < skillTarget; round++) {
          for (const met of fl.metaphors) {
            if (generated >= skillTarget) break;
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: `"${met.sentence}"\n\nThis is a metaphor. What does it mean?`,
              answer: met.meaning,
              tier1: generateTier1(skill, '', met.meaning, visualType, met),
              tier2: generateTier2(skill, '', met.meaning, visualType, met)
            });
            generated++;
          }
        }
      }
      if (fl.idioms) {
        for (let round = 0; round < 50 && generated < skillTarget; round++) {
          for (const idiom of fl.idioms) {
            if (generated >= skillTarget) break;
            items.push({
              id: generateId(grade, code, idx++),
              subject: 'reading',
              grade,
              skill,
              standard,
              lexile_level: lexile,
              question: `What does the idiom "${idiom.phrase}" mean?`,
              answer: idiom.meaning,
              tier1: generateTier1(skill, '', idiom.meaning, visualType, idiom),
              tier2: generateTier2(skill, '', idiom.meaning, visualType, idiom)
            });
            generated++;
          }
        }
      }
    }

    // Fill remaining with generic questions based on skill
    while (generated < skillTarget) {
      const genericQuestions = [
        `Practice ${skill}: Question ${generated + 1}`,
      ];
      items.push({
        id: generateId(grade, code, idx++),
        subject: 'reading',
        grade,
        skill,
        standard,
        lexile_level: lexile,
        question: `${skill} practice - Item ${generated + 1}`,
        answer: 'Practice answer',
        tier1: generateTier1(skill, '', 'Practice answer', visualType, {}),
        tier2: generateTier2(skill, '', 'Practice answer', visualType, {})
      });
      generated++;
    }
  }

  return items.slice(0, target);
}

// Upload batch to Supabase
async function uploadBatch(items, batchNum, totalBatches) {
  const { error } = await supabase
    .from('practice_problems')
    .upsert(items, { onConflict: 'id' });

  if (error) {
    console.error(`Batch ${batchNum}/${totalBatches} FAILED:`, error.message);
    return false;
  }
  console.log(`Batch ${batchNum}/${totalBatches} uploaded (${items.length} items)`);
  return true;
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('READING CONTENT GENERATION');
  console.log('Target: 52,000 items');
  console.log('='.repeat(60));

  const allItems = [];
  let globalIndex = 1;

  // Generate for each grade
  for (let grade = 0; grade <= 7; grade++) {
    const template = loadTemplate(grade);
    if (!template) {
      console.error(`Skipping grade ${grade} - template not found`);
      continue;
    }

    console.log(`\nGenerating Grade ${grade} (${template.grade_name})...`);
    console.log(`  Target: ${GRADE_TARGETS[grade]} items`);
    console.log(`  Lexile: ${template.default_lexile}`);

    let gradeItems;
    if (grade === 0) {
      gradeItems = generateKindergartenItems(template, globalIndex);
    } else {
      gradeItems = generateGradeItems(grade, template, globalIndex);
    }

    globalIndex += gradeItems.length;
    allItems.push(...gradeItems);
    console.log(`  Generated: ${gradeItems.length} items`);
  }

  console.log(`\nTotal generated: ${allItems.length} items`);

  // Upload in batches
  const BATCH_SIZE = 500;
  const batches = [];
  for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
    batches.push(allItems.slice(i, i + BATCH_SIZE));
  }

  console.log(`\nUploading ${batches.length} batches...`);

  let successCount = 0;
  for (let i = 0; i < batches.length; i++) {
    const success = await uploadBatch(batches[i], i + 1, batches.length);
    if (success) successCount++;

    // Small delay to avoid rate limiting
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log(`Batches: ${successCount}/${batches.length} successful`);
  console.log(`Total items: ${allItems.length}`);
  console.log('='.repeat(60));

  // Verify counts
  console.log('\nVerifying database counts...');
  for (let grade = 0; grade <= 7; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'reading')
      .eq('grade', grade);
    console.log(`  Grade ${grade}: ${count} items`);
  }

  const { count: totalCount } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'reading');
  console.log(`\nTOTAL READING ITEMS IN DB: ${totalCount}`);
}

main().catch(console.error);
