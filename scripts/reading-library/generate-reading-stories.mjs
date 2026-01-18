#!/usr/bin/env node
/**
 * GENERATE PROPER READING STORIES
 *
 * Follows ALL rules from MASTER-RULES-CHECKLIST.md:
 * - Lexile levels per grade
 * - Reading time by age group (K=15min, 1-2=20min, 3-5=25min, 6-8=30min, 9-12=30min)
 * - 10 comprehension questions per story
 * - Vocabulary words
 * - Gender targeting (boys/girls/neutral)
 * - 25 categories per age group
 *
 * ADAPTIVE LEARNING RULE:
 * - Content organized by LEVEL, not grade
 * - 3rd grader at 6th grade level sees 6th grade content
 * - Stories accessible by Lexile level, not enrollment grade
 *
 * Created: 2026-01-13
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Claude API - SAFER for children's content with built-in Constitutional AI
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// =============================================================================
// CONFIGURATION - Based on user requirements
// =============================================================================

const LEXILE_CONFIG = {
  'K': { lexile: 'BR-200L', time: 15, words: 150, sentences: '5-6 words' },
  '1': { lexile: '200L-300L', time: 20, words: 200, sentences: '6-7 words' },
  '2': { lexile: '300L-500L', time: 20, words: 250, sentences: '7-8 words' },
  '3': { lexile: '400L-600L', time: 25, words: 400, sentences: '8-10 words' },
  '4': { lexile: '500L-700L', time: 25, words: 500, sentences: '10-12 words' },
  '5': { lexile: '600L-800L', time: 25, words: 600, sentences: '10-12 words' },
  '6': { lexile: '700L-900L', time: 30, words: 700, sentences: '12-15 words' },
  '7': { lexile: '800L-1000L', time: 30, words: 800, sentences: '12-15 words' },
  '8': { lexile: '900L-1100L', time: 30, words: 900, sentences: '15-18 words' },
  '9': { lexile: '1000L-1200L', time: 30, words: 1000, sentences: '15-20 words' },
  '10': { lexile: '1100L-1300L', time: 30, words: 1100, sentences: '15-20 words' },
  '11': { lexile: '1200L-1400L', time: 30, words: 1150, sentences: '15-20 words' },
  '12': { lexile: '1300L-1500L', time: 30, words: 1200, sentences: '15-20 words' }
};

// Categories by age group - 25 each
const CATEGORIES = {
  'K-2': {
    boys: ['Dinosaur Adventures', 'Space Explorers', 'Superhero Kids', 'Pirate Treasure', 'Robot Friends', 'Jungle Safari', 'Sports Fun', 'Building Things', 'Racing Cars', 'Ninja Warriors'],
    girls: ['Fairy Tales', 'Princess Stories', 'Animal Friends', 'Magic & Wizards', 'Ocean Mermaids', 'Dance & Music', 'Art & Creativity', 'Garden Fairies', 'Unicorn Dreams', 'Friendship Stories'],
    neutral: ['Silly Stories', 'Family Fun', 'School Adventures', 'Nature & Animals', 'Holiday Magic']
  },
  '3-5': {
    boys: ['Wizard Academy', 'Greek Mythology', 'Video Game Worlds', 'Space Wars', 'Dragon Riders', 'Ninja Warriors', 'Spy Adventures', 'Time Travel', 'Alien Encounters', 'Survival Stories'],
    girls: ['Horse Ranch', 'Mystery Detective', 'Fairy Kingdoms', 'Animal Adventures', 'Friendship Drama', 'Art School', 'Dance Academy', 'Ocean Secrets', 'Nature Explorer', 'Magic School'],
    neutral: ['Funny Stories', 'Sports Champions', 'Inventors', 'History Adventures', 'Treasure Hunters']
  },
  '6-8': {
    boys: ['Fantasy Epic', 'Sci-Fi Adventure', 'Sports Drama', 'Survival', 'Spy/Espionage', 'Hackers & Tech', 'War Stories', 'Alien Worlds', 'Dystopian Future', 'Crime Solving'],
    girls: ['Mystery Thriller', 'Romance (clean)', 'Supernatural', 'Coming of Age', 'Music & Band', 'Social Issues', 'Animal POV', 'Parallel Worlds', 'Historical Fiction', 'Fashion & Design'],
    neutral: ['Horror (mild)', 'Sports Underdog', 'Natural Disasters', 'True Crime (adapted)', 'Wilderness']
  },
  '9-12': {
    boys: ['Epic Fantasy', 'Dystopian', 'Psychological Thriller', 'War & Conflict', 'Tech/AI Themes', 'Political Thriller', 'Crime Fiction', 'Sports Fiction', 'Survival Extreme', 'Sci-Fi Hard'],
    girls: ['Literary Fiction', 'Romance', 'Coming of Age', 'Social Commentary', 'Music & Arts', 'Cultural Stories', 'Supernatural', 'Historical Drama', 'Environmental', 'Philosophy Fiction'],
    neutral: ['Horror', 'Mystery Complex', 'Biographical', 'Real World Issues', 'Classics Retold']
  }
};

// Reading comprehension question types (Arizona standards aligned)
const QUESTION_TYPES = [
  { type: 'main_idea', prompt: 'What is this story mostly about?' },
  { type: 'character', prompt: 'How did [character] feel when...?' },
  { type: 'sequence', prompt: 'What happened FIRST/AFTER...?' },
  { type: 'vocabulary', prompt: 'What does [word] mean in this story?' },
  { type: 'inference', prompt: 'Why do you think [character] did...?' },
  { type: 'detail', prompt: 'According to the story, what...?' },
  { type: 'cause_effect', prompt: 'What caused [event] to happen?' },
  { type: 'compare', prompt: 'How are [X] and [Y] similar/different?' },
  { type: 'author_purpose', prompt: 'Why did the author include...?' },
  { type: 'theme', prompt: 'What lesson does this story teach?' }
];

// =============================================================================
// GENERATION FUNCTIONS
// =============================================================================

async function generateStory(grade, category, genderTarget) {
  const config = LEXILE_CONFIG[grade];

  const prompt = `You are an Arizona curriculum expert creating a Lexile-leveled reading story.

REQUIREMENTS:
- Grade Level: ${grade}
- Lexile Range: ${config.lexile}
- Target Word Count: ${config.words} words
- Average Sentence Length: ${config.sentences}
- Reading Time: ${config.time} minutes
- Category/Genre: ${category}
- Target Audience: ${genderTarget === 'boys' ? 'Boys (action, adventure themes)' : genderTarget === 'girls' ? 'Girls (relationship, emotional themes)' : 'All kids (universal themes)'}

STORY REQUIREMENTS:
1. Age-appropriate content and vocabulary
2. Engaging plot with clear beginning, middle, end
3. Relatable characters
4. Educational value (teaches something)
5. Positive message/theme
6. MUST be suitable for classroom reading

SAFETY REQUIREMENTS - DO NOT INCLUDE:
- Death or dying (characters can "go away" or "move" instead)
- Violence or fighting (conflict through words/competition only)
- Scary monsters or horror elements
- Weapons (swords, guns, etc.)
- Bullying or mean behavior portrayed positively
- Romantic content beyond friendship
- References to drugs, alcohol, or smoking
- Discrimination or prejudice
- Religious content
- Political content
- Bathroom humor or crude jokes
- References to real brands or celebrities
- Anything that could frighten a child

TONE: Encouraging, positive, safe, and fun. All conflicts resolve peacefully.
Characters should model good behavior (kindness, sharing, honesty, trying hard).

OUTPUT JSON FORMAT:
{
  "title": "Story Title",
  "content": "Full story text here...",
  "word_count": 400,
  "vocabulary": [
    {"word": "example", "definition": "a thing to be imitated", "sentence": "The teacher gave an example."}
  ],
  "reading_strategy": "main_idea",
  "strategy_tip": "While reading, ask yourself: What is this story mostly about?",
  "comprehension_questions": [
    {
      "question_number": 1,
      "question_type": "main_idea",
      "question_text": "What is this story mostly about?",
      "choice_a": "...",
      "choice_b": "...",
      "choice_c": "...",
      "choice_d": "...",
      "correct_answer": "B",
      "explanation": "The story is mostly about...",
      "explanations_by_level": {
        "level_1": "Look at the title and first paragraph.",
        "level_2": "The main character's goal tells us the main idea.",
        "level_3": "The story follows [character] as they try to [goal]. This is the main idea.",
        "level_4": "[Visual hint description]",
        "level_5": "Imagine you had to tell a friend what this story is about in one sentence...",
        "level_6": "Step 1: Read the title. Step 2: Who is the main character? Step 3: What do they want? This is your main idea."
      }
    }
  ]
}

Generate a complete story with EXACTLY 10 comprehension questions covering: main_idea, character, sequence, vocabulary, inference, detail, cause_effect, compare, author_purpose, theme.

Return ONLY valid JSON, no other text.`;

  try {
    // Using Claude Sonnet - best quality AND safest for children's content
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Error generating story for Grade ${grade}, ${category}:`, error.message);
    return null;
  }
}

async function saveStory(storyData, grade, category, genderTarget) {
  const config = LEXILE_CONFIG[grade];
  const gradeNum = grade === 'K' ? 0 : parseInt(grade);

  // Insert story with new schema
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert({
      // Required existing columns
      title: storyData.title,
      content: storyData.content,
      genre: category,
      reading_level: config.lexile.split('-')[0], // e.g., "400L" from "400L-600L"
      word_count: storyData.word_count || config.words,
      is_favorite: false,
      comprehension_questions: storyData.comprehension_questions || [],

      // New columns for reading library
      lexile_band: config.lexile,
      grade_level: gradeNum,
      expected_time_minutes: config.time,
      gender_target: genderTarget,
      category: category,
      vocabulary: storyData.vocabulary || [],
      reading_strategy: storyData.reading_strategy || 'main_idea',
      strategy_tip: storyData.strategy_tip || '',
      times_read: 0
    })
    .select()
    .single();

  if (storyError) {
    console.error('Error saving story:', storyError.message);
    return null;
  }

  // Also insert into story_questions table for backwards compatibility
  if (storyData.comprehension_questions && storyData.comprehension_questions.length > 0) {
    const questions = storyData.comprehension_questions.map((q, i) => ({
      story_id: story.id,
      question_number: q.question_number || i + 1,
      question_text: q.question_text,
      choice_a: q.choice_a,
      choice_b: q.choice_b,
      choice_c: q.choice_c,
      choice_d: q.choice_d,
      correct_answer: q.correct_answer
    }));

    const { error: questionsError } = await supabase
      .from('story_questions')
      .insert(questions);

    if (questionsError) {
      console.error('Error saving questions:', questionsError.message);
    }
  }

  return story;
}

// =============================================================================
// MAIN GENERATION LOOP
// =============================================================================

async function generateAllStories(options = {}) {
  const {
    startGrade = 'K',
    endGrade = '12',
    storiesPerCategory = 3,
    dryRun = false
  } = options;

  console.log('📚 GENERATING READING LIBRARY');
  console.log('='.repeat(60));
  console.log(`Grades: ${startGrade} to ${endGrade}`);
  console.log(`Stories per category: ${storiesPerCategory}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  const grades = Object.keys(LEXILE_CONFIG).filter(g => {
    const gNum = g === 'K' ? 0 : parseInt(g);
    const startNum = startGrade === 'K' ? 0 : parseInt(startGrade);
    const endNum = endGrade === 'K' ? 0 : parseInt(endGrade);
    return gNum >= startNum && gNum <= endNum;
  });

  let totalGenerated = 0;
  let totalErrors = 0;

  for (const grade of grades) {
    // Determine age group
    const gradeNum = grade === 'K' ? 0 : parseInt(grade);
    let ageGroup;
    if (gradeNum <= 2) ageGroup = 'K-2';
    else if (gradeNum <= 5) ageGroup = '3-5';
    else if (gradeNum <= 8) ageGroup = '6-8';
    else ageGroup = '9-12';

    const categories = CATEGORIES[ageGroup];

    for (const [genderTarget, categoryList] of Object.entries(categories)) {
      for (const category of categoryList) {
        for (let i = 0; i < storiesPerCategory; i++) {
          console.log(`[Grade ${grade}] ${category} (${genderTarget}) - Story ${i + 1}/${storiesPerCategory}`);

          if (dryRun) {
            console.log('  (dry run - skipping generation)');
            continue;
          }

          const storyData = await generateStory(grade, category, genderTarget);

          if (storyData) {
            const saved = await saveStory(storyData, grade, category, genderTarget);
            if (saved) {
              totalGenerated++;
              console.log(`  ✅ Saved: "${storyData.title}"`);
            } else {
              totalErrors++;
              console.log(`  ❌ Failed to save`);
            }
          } else {
            totalErrors++;
            console.log(`  ❌ Failed to generate`);
          }

          // Rate limiting - Grok allows ~60 requests/minute
          // Using 2 seconds between requests to be safe (30/min)
          // This prevents 429 Too Many Requests errors
          console.log('  ⏳ Waiting 2s (rate limit)...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`📊 GENERATION COMPLETE`);
  console.log(`   Generated: ${totalGenerated} stories`);
  console.log(`   Errors: ${totalErrors}`);
}

// Run if called directly
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const startGrade = args.find(a => a.startsWith('--start='))?.split('=')[1] || 'K';
const endGrade = args.find(a => a.startsWith('--end='))?.split('=')[1] || '12';

generateAllStories({ startGrade, endGrade, dryRun, storiesPerCategory: 3 })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
