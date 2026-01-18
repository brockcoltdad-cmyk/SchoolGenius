// Spelling Content Generator for SchoolGenius
// Generates 26,000 spelling items for grades K-7
// Audio-based: TTS says word, student types it

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEMPLATES_DIR = './library/templates/spelling';

function loadTemplate(grade) {
  const filename = grade === 0 ? 'spelling-templates-K.json' : `spelling-templates-G${grade}.json`;
  const content = readFileSync(`${TEMPLATES_DIR}/${filename}`, 'utf-8');
  return JSON.parse(content);
}

function generateId(grade, skillCode, index) {
  return `SPELL-G${grade}-${skillCode}-${String(index).padStart(4, '0')}`;
}

function generateTier1(word, rule, visualType) {
  const teachText = rule
    ? `Remember the rule: ${rule.substring(0, 50)}...`
    : `Listen carefully and spell the word: ${word}`;

  return {
    teach: teachText.substring(0, 100),
    steps: [
      {
        step: 1,
        visual: {
          type: visualType,
          data: { word, letters: word.split('') }
        },
        voice_text: `The word is ${word}. Listen to each sound.`,
        duration: 4000
      },
      {
        step: 2,
        visual: {
          type: visualType,
          data: { word, letters: word.split(''), highlighted: true }
        },
        voice_text: `${word} is spelled ${word.split('').join('-')}.`,
        duration: 5000
      }
    ]
  };
}

function generateTier2(word, visualType) {
  return {
    teach: `The word is ${word}. Sound it out.`,
    steps: [
      {
        step: 1,
        visual: {
          type: visualType,
          data: { word, letters: word.split(''), simplified: true }
        },
        voice_text: `${word}. ${word.split('').join('-')}. ${word}.`,
        duration: 5000
      }
    ]
  };
}

function getQuestionTemplate(templates) {
  const idx = Math.floor(Math.random() * templates.length);
  return templates[idx];
}

function generateItems(template) {
  const items = [];
  const questionTemplates = template.question_templates;

  for (const skill of template.skills) {
    let count = 0;
    const targetCount = skill.count;
    let idx = 1;

    // Handle different data structures
    if (skill.words && Array.isArray(skill.words)) {
      // Simple word array (most common)
      if (typeof skill.words[0] === 'string') {
        while (count < targetCount) {
          for (const word of skill.words) {
            if (count >= targetCount) break;

            const questionTemplate = getQuestionTemplate(questionTemplates);
            const question = questionTemplate.replace('{word}', word);

            items.push({
              id: generateId(template.grade, skill.code, idx++),
              subject: 'spelling',
              grade: template.grade,
              skill: skill.skill,
              standard: skill.standard,
              question: question,
              answer: word,
              audio_word: word,
              tier1: generateTier1(word, skill.rule, skill.visual_type),
              tier2: generateTier2(word, skill.visual_type)
            });
            count++;
          }
        }
      }
      // Word objects with letter/sound info (Grade K letter sounds)
      else if (skill.words[0].word && skill.words[0].sound) {
        while (count < targetCount) {
          for (const wordObj of skill.words) {
            if (count >= targetCount) break;

            items.push({
              id: generateId(template.grade, skill.code, idx++),
              subject: 'spelling',
              grade: template.grade,
              skill: skill.skill,
              standard: skill.standard,
              question: `What letter makes the ${wordObj.sound} sound?`,
              answer: wordObj.word,
              audio_word: wordObj.word,
              tier1: generateTier1(wordObj.word, `The letter ${wordObj.word} makes the ${wordObj.sound} sound.`, skill.visual_type),
              tier2: generateTier2(wordObj.word, skill.visual_type)
            });
            count++;
          }
        }
      }
      // Doubling rule words (Grade 4)
      else if (skill.words[0].base && skill.words[0].ing) {
        while (count < targetCount) {
          for (const wordObj of skill.words) {
            if (count >= targetCount) break;

            // Generate items for -ing form
            items.push({
              id: generateId(template.grade, skill.code, idx++),
              subject: 'spelling',
              grade: template.grade,
              skill: skill.skill,
              standard: skill.standard,
              question: `Add -ing to "${wordObj.base}". Spell the new word.`,
              answer: wordObj.ing,
              audio_word: wordObj.ing,
              tier1: generateTier1(wordObj.ing, skill.rule, skill.visual_type),
              tier2: generateTier2(wordObj.ing, skill.visual_type)
            });
            count++;

            if (count >= targetCount) break;

            // Generate items for -ed form if exists
            if (wordObj.ed) {
              items.push({
                id: generateId(template.grade, skill.code, idx++),
                subject: 'spelling',
                grade: template.grade,
                skill: skill.skill,
                standard: skill.standard,
                question: `Add -ed to "${wordObj.base}". Spell the new word.`,
                answer: wordObj.ed,
                audio_word: wordObj.ed,
                tier1: generateTier1(wordObj.ed, skill.rule, skill.visual_type),
                tier2: generateTier2(wordObj.ed, skill.visual_type)
              });
              count++;
            }
          }
        }
      }
      // Plural rules (Grade 4)
      else if (skill.words[0].singular && skill.words[0].plural) {
        while (count < targetCount) {
          for (const wordObj of skill.words) {
            if (count >= targetCount) break;

            items.push({
              id: generateId(template.grade, skill.code, idx++),
              subject: 'spelling',
              grade: template.grade,
              skill: skill.skill,
              standard: skill.standard,
              question: `What is the plural of "${wordObj.singular}"?`,
              answer: wordObj.plural,
              audio_word: wordObj.plural,
              tier1: generateTier1(wordObj.plural, skill.rule, skill.visual_type),
              tier2: generateTier2(wordObj.plural, skill.visual_type)
            });
            count++;
          }
        }
      }
    }

    // Handle names (Grade K)
    if (skill.names && Array.isArray(skill.names)) {
      while (count < targetCount) {
        for (const name of skill.names) {
          if (count >= targetCount) break;

          items.push({
            id: generateId(template.grade, skill.code, idx++),
            subject: 'spelling',
            grade: template.grade,
            skill: skill.skill,
            standard: skill.standard,
            question: `Spell the name: ${name}`,
            answer: name,
            audio_word: name,
            tier1: generateTier1(name, 'Names start with a capital letter.', skill.visual_type),
            tier2: generateTier2(name, skill.visual_type)
          });
          count++;
        }
      }
    }

    // Handle contractions (Grade 2)
    if (skill.contractions && Array.isArray(skill.contractions)) {
      while (count < targetCount) {
        for (const c of skill.contractions) {
          if (count >= targetCount) break;

          // Question type 1: Spell the contraction
          items.push({
            id: generateId(template.grade, skill.code, idx++),
            subject: 'spelling',
            grade: template.grade,
            skill: skill.skill,
            standard: skill.standard,
            question: `"${c.words}" becomes what contraction? Spell it.`,
            answer: c.contraction,
            audio_word: c.contraction,
            tier1: generateTier1(c.contraction, skill.rule, skill.visual_type),
            tier2: generateTier2(c.contraction, skill.visual_type)
          });
          count++;

          if (count >= targetCount) break;

          // Question type 2: What two words
          items.push({
            id: generateId(template.grade, skill.code, idx++),
            subject: 'spelling',
            grade: template.grade,
            skill: skill.skill,
            standard: skill.standard,
            question: `Spell the contraction you hear: ${c.contraction}`,
            answer: c.contraction,
            audio_word: c.contraction,
            tier1: generateTier1(c.contraction, `${c.contraction} = ${c.words}`, skill.visual_type),
            tier2: generateTier2(c.contraction, skill.visual_type)
          });
          count++;
        }
      }
    }

    // Handle base words for prefixes/suffixes (Grade 3-5)
    if (skill.base_words && Array.isArray(skill.base_words)) {
      const prefix = skill.skill.includes('prefix') ? skill.skill.split(' ')[1] : null;
      const suffix = skill.skill.includes('suffix') ? skill.skill.split(' ')[1] : null;

      while (count < targetCount) {
        for (const base of skill.base_words) {
          if (count >= targetCount) break;

          let newWord, question;
          if (prefix) {
            newWord = prefix.replace('-', '') + base;
            question = `Add the prefix "${prefix}" to "${base}". Spell the new word.`;
          } else if (suffix) {
            // Handle spelling rules for suffixes
            let modifiedBase = base;
            if (suffix === '-ly' && base.endsWith('y')) {
              modifiedBase = base.slice(0, -1) + 'i';
            } else if (suffix === '-ful' && base.endsWith('y')) {
              modifiedBase = base.slice(0, -1) + 'i';
            }
            newWord = modifiedBase + suffix.replace('-', '');
            question = `Add the suffix "${suffix}" to "${base}". Spell the new word.`;
          } else {
            continue;
          }

          items.push({
            id: generateId(template.grade, skill.code, idx++),
            subject: 'spelling',
            grade: template.grade,
            skill: skill.skill,
            standard: skill.standard,
            question: question,
            answer: newWord,
            audio_word: newWord,
            tier1: generateTier1(newWord, skill.rule, skill.visual_type),
            tier2: generateTier2(newWord, skill.visual_type)
          });
          count++;
        }
      }
    }

    // Handle homophone pairs (Grade 3)
    if (skill.pairs && Array.isArray(skill.pairs)) {
      while (count < targetCount) {
        for (const pair of skill.pairs) {
          if (count >= targetCount) break;

          // Generate questions for each word in the pair
          const words = [pair.word1, pair.word2];
          if (pair.word3) words.push(pair.word3);

          for (const word of words) {
            if (count >= targetCount) break;

            items.push({
              id: generateId(template.grade, skill.code, idx++),
              subject: 'spelling',
              grade: template.grade,
              skill: skill.skill,
              standard: skill.standard,
              question: `Spell the word you hear: ${word}`,
              answer: word,
              audio_word: word,
              tier1: generateTier1(word, `${words.join(', ')} sound the same but are spelled differently.`, skill.visual_type),
              tier2: generateTier2(word, skill.visual_type)
            });
            count++;
          }
        }
      }
    }

    // Handle Greek/Latin roots (Grade 4-7)
    if (skill.root && skill.words && typeof skill.words[0] === 'string') {
      // Already handled in simple word array above
    }
  }

  return items;
}

async function uploadBatch(items, batchNum, total) {
  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) {
    console.log(`Batch ${batchNum} error:`, error.message);
    return false;
  }
  console.log(`Batch ${batchNum}: Uploaded ${items.length} items (${Math.min(batchNum * 500, total)}/${total})`);
  return true;
}

async function generateGrade(grade) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`GENERATING GRADE ${grade === 0 ? 'K' : grade} SPELLING`);
  console.log('='.repeat(50));

  const template = loadTemplate(grade);
  console.log(`Target: ${template.total_target} items`);
  console.log(`Skills: ${template.skills.length}`);

  const items = generateItems(template);
  console.log(`Generated: ${items.length} items`);

  // Upload in batches of 500
  for (let i = 0; i < items.length; i += 500) {
    const batch = items.slice(i, i + 500);
    const batchNum = Math.floor(i / 500) + 1;
    await uploadBatch(batch, batchNum, items.length);
  }

  return items.length;
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
  return grandTotal;
}

async function main() {
  console.log('SPELLING CONTENT GENERATOR');
  console.log('Target: 26,000 items across grades K-7');
  console.log('Started:', new Date().toISOString());

  let totalGenerated = 0;

  for (let grade = 0; grade <= 7; grade++) {
    const count = await generateGrade(grade);
    totalGenerated += count;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`GENERATION COMPLETE: ${totalGenerated} items`);
  console.log('='.repeat(50));

  await verify();

  console.log('\nCompleted:', new Date().toISOString());
}

main().catch(console.error);
