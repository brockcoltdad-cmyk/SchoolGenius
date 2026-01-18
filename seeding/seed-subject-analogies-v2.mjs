#!/usr/bin/env node
/**
 * SUBJECT ANALOGIES SEEDER - V2
 * Generates analogies for all subjects, age groups, and themes
 * WITHOUT relying on skills table (hardcoded concepts)
 */

import { createClient } from '@supabase/supabase-js';
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

const GROK_API_KEY = process.env.GROK_API_KEY;
const DELAY_MS = 5000;

// Hardcoded skill/concept lists by subject
const CONCEPTS_BY_SUBJECT = {
  Math: [
    { name: 'addition', difficulty: 'basic' },
    { name: 'subtraction', difficulty: 'basic' },
    { name: 'multiplication', difficulty: 'intermediate' },
    { name: 'division', difficulty: 'intermediate' },
    { name: 'fractions', difficulty: 'intermediate' },
    { name: 'decimals', difficulty: 'intermediate' },
    { name: 'percentages', difficulty: 'advanced' },
    { name: 'algebra', difficulty: 'advanced' },
    { name: 'geometry', difficulty: 'intermediate' },
    { name: 'measurement', difficulty: 'basic' }
  ],
  Reading: [
    { name: 'main idea', difficulty: 'basic' },
    { name: 'inference', difficulty: 'intermediate' },
    { name: 'context clues', difficulty: 'intermediate' },
    { name: 'summarizing', difficulty: 'intermediate' },
    { name: 'compare and contrast', difficulty: 'intermediate' },
    { name: 'cause and effect', difficulty: 'intermediate' },
    { name: 'character analysis', difficulty: 'advanced' },
    { name: 'theme', difficulty: 'advanced' }
  ],
  Spelling: [
    { name: 'phonics', difficulty: 'basic' },
    { name: 'vowel patterns', difficulty: 'intermediate' },
    { name: 'consonant blends', difficulty: 'basic' },
    { name: 'syllables', difficulty: 'intermediate' },
    { name: 'prefixes', difficulty: 'intermediate' },
    { name: 'suffixes', difficulty: 'intermediate' },
    { name: 'homophones', difficulty: 'advanced' }
  ],
  Coding: [
    { name: 'loops', difficulty: 'basic' },
    { name: 'variables', difficulty: 'basic' },
    { name: 'conditionals', difficulty: 'intermediate' },
    { name: 'functions', difficulty: 'intermediate' },
    { name: 'debugging', difficulty: 'intermediate' },
    { name: 'algorithms', difficulty: 'advanced' }
  ],
  Typing: [
    { name: 'home row', difficulty: 'basic' },
    { name: 'touch typing', difficulty: 'intermediate' },
    { name: 'speed and accuracy', difficulty: 'advanced' }
  ]
};

const AGE_GROUPS = ['k2', 'grades35', 'grades68', 'grades912'];
const THEMES = ['neutral']; // Generic theme (can expand to WWE, Fortnite, etc. later)

async function callGrok(prompt) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a content generator for SchoolGenius educational platform. Return only valid JSON without markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'grok-3',
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Extract JSON from markdown if needed
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/);
  const jsonString = jsonMatch ? jsonMatch[1] : content;

  return JSON.parse(jsonString);
}

function getAgeGroupGuidelines(ageGroup) {
  const guidelines = {
    k2: {
      description: 'K-2 (Ages 5-8)',
      style: 'Super simple, visual, one sentence',
      examples: 'toys, snacks, games (blocks, cookies, puppies)',
      format: 'ONE simple sentence with emoji'
    },
    grades35: {
      description: '3-5 (Ages 8-11)',
      style: 'Clear, relatable, 2-3 sentences',
      examples: 'everyday things (sports, food, school)',
      format: '2-3 sentences explaining connection'
    },
    grades68: {
      description: '6-8 (Ages 11-14)',
      style: 'Real-world applications',
      examples: 'money, cooking, sports stats, technology',
      format: 'Multi-step explanation showing why it matters'
    },
    grades912: {
      description: '9-12 (Ages 14-18)',
      style: 'Technical but relatable',
      examples: 'academic/professional contexts (finance, science)',
      format: 'Technical explanation with real applications'
    }
  };
  return guidelines[ageGroup];
}

async function seedAnalogies() {
  console.log('🚀 SUBJECT ANALOGIES SEEDER V2');
  console.log('='.repeat(80));
  console.log('Generating analogies for all subjects\n');

  // Calculate total items
  let totalItems = 0;
  for (const subject of Object.keys(CONCEPTS_BY_SUBJECT)) {
    const concepts = CONCEPTS_BY_SUBJECT[subject];
    totalItems += concepts.length * AGE_GROUPS.length * THEMES.length;
  }

  console.log(`📊 Total to generate: ${totalItems} analogies\n`);

  let success = 0;
  let errors = 0;
  let skipped = 0;
  const startTime = Date.now();
  let itemIndex = 0;

  for (const subject of Object.keys(CONCEPTS_BY_SUBJECT)) {
    const concepts = CONCEPTS_BY_SUBJECT[subject];

    for (const concept of concepts) {
      for (const ageGroup of AGE_GROUPS) {
        for (const theme of THEMES) {
          itemIndex++;

          try {
            // Check if already exists
            const { data: existing } = await supabase
              .from('subject_analogies')
              .select('id')
              .eq('skill_name', concept.name)
              .eq('subject', subject)
              .eq('age_group', ageGroup)
              .eq('theme', theme)
              .limit(1);

            if (existing && existing.length > 0) {
              console.log(`[${itemIndex}/${totalItems}] ${concept.name} | ${subject} | ${ageGroup} | ${theme} - ⏭️  SKIP (exists)`);
              skipped++;
              continue;
            }

            console.log(`\n[${itemIndex}/${totalItems}] ${concept.name} | ${subject} | ${ageGroup} | ${theme}`);

            const guidelines = getAgeGroupGuidelines(ageGroup);

            const prompt = `Create an educational analogy for teaching "${concept.name}" in ${subject}:

**Target Audience:** ${guidelines.description}
**Style:** ${guidelines.style}
**Format:** ${guidelines.format}
**Use examples like:** ${guidelines.examples}

Make it:
1. Age-appropriate for ${ageGroup}
2. Clear and memorable
3. Relatable to kids' real experiences
4. Helpful for understanding the concept

Return ONLY valid JSON (no markdown):
{
  "analogy": "Your age-appropriate analogy here",
  "explanation": "Why this analogy works (1 sentence)",
  "when_to_use": "when to use this analogy (e.g., 'when introducing ${concept.name}')"
}`;

            const generated = await callGrok(prompt);

            const { error } = await supabase
              .from('subject_analogies')
              .insert({
                skill_name: concept.name,
                subject: subject,
                age_group: ageGroup,
                analogy: generated.analogy,
                explanation: generated.explanation,
                when_to_use: generated.when_to_use,
                theme: theme,
                concept: concept.name,
                difficulty: concept.difficulty
              });

            if (error) throw error;

            console.log(`  ✅ "${generated.analogy.substring(0, 80)}..."`);
            success++;

            await new Promise(resolve => setTimeout(resolve, DELAY_MS));

          } catch (error) {
            console.error(`  ❌ Error: ${error.message}`);
            errors++;
          }
        }
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log('\n' + '='.repeat(80));
  console.log('📊 SUBJECT ANALOGIES SEEDING COMPLETE!');
  console.log('='.repeat(80));
  console.log(`✅ Success: ${success}/${totalItems}`);
  console.log(`⏭️  Skipped (already exist): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`⏱️  Duration: ${duration} minutes`);
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`);
  console.log(`\n✨ ${success} age-appropriate analogies seeded!\n`);
}

seedAnalogies().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
