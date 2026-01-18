#!/usr/bin/env node
/**
 * GENERATE SPELLING WORD LISTS
 *
 * Following MASTER-RULES-CHECKLIST:
 * - Arizona phonics standards
 * - Words organized by phonics rule
 * - Pronunciation breakdown (d-o-g... DOG!)
 * - Grade-appropriate difficulty
 * - Type word 3 times to master (handled by player)
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Claude API - safer for children's content
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Phonics progression by grade (Arizona-aligned)
const PHONICS_RULES = {
  0: [ // Kindergarten
    { rule: 'Short A (CVC)', pattern: 'cat, bat, sat', example: 'c-a-t... CAT!' },
    { rule: 'Short E (CVC)', pattern: 'bed, red, pet', example: 'b-e-d... BED!' },
    { rule: 'Short I (CVC)', pattern: 'sit, hit, pig', example: 's-i-t... SIT!' },
    { rule: 'Short O (CVC)', pattern: 'hot, pot, dog', example: 'd-o-g... DOG!' },
    { rule: 'Short U (CVC)', pattern: 'cup, sun, bug', example: 'c-u-p... CUP!' },
  ],
  1: [ // Grade 1
    { rule: 'SH Digraph', pattern: 'ship, shop, fish', example: 'sh-i-p... SHIP!' },
    { rule: 'CH Digraph', pattern: 'chip, chat, much', example: 'ch-i-p... CHIP!' },
    { rule: 'TH Digraph', pattern: 'this, that, with', example: 'th-i-s... THIS!' },
    { rule: 'BL Blend', pattern: 'black, blue, blend', example: 'bl-a-ck... BLACK!' },
    { rule: 'ST Blend', pattern: 'stop, star, still', example: 'st-o-p... STOP!' },
    { rule: 'CR Blend', pattern: 'crab, cry, cross', example: 'cr-a-b... CRAB!' },
  ],
  2: [ // Grade 2
    { rule: 'Magic E (Long A)', pattern: 'make, take, cake', example: 'm-a-ke... MAKE! The E is silent but makes A say its name!' },
    { rule: 'Magic E (Long I)', pattern: 'time, mine, bike', example: 't-i-me... TIME!' },
    { rule: 'Magic E (Long O)', pattern: 'home, bone, rope', example: 'h-o-me... HOME!' },
    { rule: 'AI Vowel Team', pattern: 'rain, mail, tail', example: 'r-ai-n... RAIN! AI says AY!' },
    { rule: 'OA Vowel Team', pattern: 'boat, coat, road', example: 'b-oa-t... BOAT! OA says OH!' },
    { rule: 'EE Vowel Team', pattern: 'feet, tree, see', example: 'f-ee-t... FEET! EE says EE!' },
  ],
  3: [ // Grade 3
    { rule: 'AR (Bossy R)', pattern: 'car, star, farm', example: 'c-ar... CAR! R changes the A sound!' },
    { rule: 'OR (Bossy R)', pattern: 'for, corn, storm', example: 'c-or-n... CORN!' },
    { rule: 'ER/IR/UR', pattern: 'her, bird, turn', example: 'b-ir-d... BIRD! All make the same sound!' },
    { rule: 'OW/OU Diphthong', pattern: 'cow, house, out', example: 'c-ow... COW!' },
    { rule: 'OI/OY Diphthong', pattern: 'oil, boy, join', example: 'b-oy... BOY!' },
    { rule: 'Silent Letters', pattern: 'know, write, lamb', example: 'kn-ow... KNOW! The K is silent!' },
  ],
  4: [ // Grade 4
    { rule: 'Prefixes (un-, re-)', pattern: 'unhappy, redo, untie', example: 'un-happy... UNHAPPY! Un means NOT!' },
    { rule: 'Prefixes (pre-, mis-)', pattern: 'preview, mistake', example: 'pre-view... PREVIEW! Pre means BEFORE!' },
    { rule: 'Suffixes (-ful, -less)', pattern: 'helpful, careless', example: 'help-ful... HELPFUL! Ful means FULL OF!' },
    { rule: 'Suffixes (-tion, -sion)', pattern: 'action, mission', example: 'ac-tion... ACTION! TION says SHUN!' },
    { rule: 'Doubling Rule', pattern: 'running, hopped', example: 'run-ning... RUNNING! Double the consonant!' },
  ],
  5: [ // Grade 5
    { rule: 'Greek Roots (graph, phone)', pattern: 'photograph, telephone', example: 'photo-graph... PHOTOGRAPH! Graph means WRITE!' },
    { rule: 'Latin Roots (rupt, dict)', pattern: 'interrupt, predict', example: 'inter-rupt... INTERRUPT! Rupt means BREAK!' },
    { rule: 'Compound Words', pattern: 'basketball, sunshine', example: 'basket-ball... BASKETBALL! Two words combined!' },
    { rule: 'Homophones', pattern: 'their/there, your/you\'re', example: 'THERE means a place, THEIR means belonging to them!' },
  ],
  6: [ // Grade 6-8
    { rule: 'Advanced Prefixes', pattern: 'anti-, inter-, trans-', example: 'anti-septic, inter-national, trans-port' },
    { rule: 'Advanced Suffixes', pattern: '-ology, -ment, -ness', example: 'bi-ology, govern-ment, kind-ness' },
    { rule: 'Greek/Latin Combinations', pattern: 'biography, geography', example: 'bio-graphy... BIO means LIFE, GRAPH means WRITE!' },
  ],
  9: [ // Grade 9-12
    { rule: 'SAT Vocabulary', pattern: 'ubiquitous, ephemeral', example: 'Advanced vocabulary for college prep' },
    { rule: 'Academic Words', pattern: 'hypothesis, synthesis', example: 'Words used in academic writing' },
  ]
};

async function generateWordsForRule(grade, rule, ruleInfo) {
  const prompt = `You are a spelling curriculum expert creating word lists for Arizona schools.

GRADE LEVEL: ${grade === 0 ? 'Kindergarten' : `Grade ${grade}`}
PHONICS RULE: ${rule}
PATTERN: ${ruleInfo.pattern}

Generate 10 age-appropriate spelling words that follow this phonics rule.

For each word provide:
1. The word
2. Pronunciation guide (spell it out like: "d-o-g... DOG!")
3. A simple definition a ${grade === 0 ? 'kindergartener' : `${grade}th grader`} would understand
4. A sample sentence

OUTPUT JSON FORMAT (return ONLY valid JSON):
{
  "rule": "${rule}",
  "rule_explanation": "explanation for kids",
  "words": [
    {
      "word": "dog",
      "pronunciation": "d-o-g... DOG!",
      "syllables": ["dog"],
      "definition": "a pet animal that barks",
      "sentence": "The dog ran fast."
    }
  ]
}`;

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Error generating words for ${rule}:`, error.message);
    return null;
  }
}

async function saveWords(gradeLevel, ruleData) {
  if (!ruleData) {
    console.log('    ⚠️ No data returned from Claude');
    return 0;
  }
  if (!ruleData.words) {
    console.log('    ⚠️ No words array in response. Keys:', Object.keys(ruleData));
    return 0;
  }
  if (ruleData.words.length === 0) {
    console.log('    ⚠️ Words array is empty');
    return 0;
  }

  let saved = 0;
  for (const word of ruleData.words) {
    const { error } = await supabase
      .from('word_pronunciations')
      .upsert({
        word: word.word.toLowerCase(),
        pronunciation: word.pronunciation,
        syllables: word.syllables || [word.word],
        grade_level: gradeLevel
      }, { onConflict: 'word' });

    if (error) {
      console.log(`    ❌ DB Error for "${word.word}":`, error.message);
    } else {
      saved++;
    }
  }
  return saved;
}

async function main() {
  console.log('📝 GENERATING SPELLING WORD LISTS');
  console.log('='.repeat(60));

  const args = process.argv.slice(2);
  const startGrade = parseInt(args.find(a => a.startsWith('--start='))?.split('=')[1] || '0');
  const endGrade = parseInt(args.find(a => a.startsWith('--end='))?.split('=')[1] || '5');

  let totalWords = 0;

  for (let grade = startGrade; grade <= endGrade; grade++) {
    const rules = PHONICS_RULES[grade] || PHONICS_RULES[6];

    console.log(`\n[Grade ${grade === 0 ? 'K' : grade}]`);

    for (const ruleInfo of rules) {
      console.log(`  Generating: ${ruleInfo.rule}...`);

      const wordData = await generateWordsForRule(grade, ruleInfo.rule, ruleInfo);

      if (wordData) {
        const saved = await saveWords(grade, wordData);
        totalWords += saved;
        console.log(`    ✅ Saved ${saved} words`);
      } else {
        console.log(`    ❌ Failed`);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 COMPLETE: ${totalWords} words saved`);
}

main().catch(console.error);
