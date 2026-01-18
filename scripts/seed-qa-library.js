/**
 * QA Library Seeder - Using Claude Sonnet 3.5
 *
 * Seeds the qa_library table with age-appropriate Q&A using the 3-track system.
 * Works with existing schema columns:
 *   - question_text, question_hash, answer_text
 *   - category, subcategory, page_context
 *   - grade_level (integer), user_type
 *
 * The 3-track system is implemented using:
 *   - grade_level: 0-2 (K-2), 3-5, 6-8, 9-12
 *   - subcategory: stores skill_level (below, on, above)
 *   - page_context: lesson, chat, shop, etc.
 *
 * Usage: node scripts/seed-qa-library.js [--phase=1] [--dry-run]
 */

require('dotenv').config();
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Configuration
const CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 2048,
  batchSize: 5,   // Questions per API call (reduced for reliability)
  delayMs: 1000,  // Delay between API calls
};

// Grade bands mapped to grade_level integers
const GRADE_BANDS = {
  'K-2': {
    gradeLevel: 2,  // Use max of band for database
    vocabulary: 'Simple words only, short 5-8 word sentences, concrete examples like toys/food/animals',
    readingLevel: 'Kindergarten to 2nd grade',
  },
  '3-5': {
    gradeLevel: 5,
    vocabulary: 'Grade-level words, medium sentences, examples from sports/games/school',
    readingLevel: '3rd to 5th grade',
  },
  '6-8': {
    gradeLevel: 8,
    vocabulary: 'Some technical terms OK, complex sentences, real-world/technology examples',
    readingLevel: 'Middle school',
  },
  '9-12': {
    gradeLevel: 12,
    vocabulary: 'Academic language, full complexity, abstract/professional examples',
    readingLevel: 'High school',
  },
};

// Generate question hash
function hashQuestion(question, gradeBand, skillLevel, pageContext) {
  const key = `${question.toLowerCase().trim()}|${gradeBand}|${skillLevel}|${pageContext}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

// Questions to seed by phase
const SEED_DATA = {
  phase1: {
    kid_dashboard: [
      'How do I start a lesson?',
      'Where is the shop?',
      'How do I see my coins?',
      'Where are my achievements?',
      'How do I chat with Gigi?',
      'What are coins for?',
      'What is a streak?',
      'What is XP?',
      "I'm stuck",
      'This is too hard',
      "I don't understand",
    ],
    lesson: [
      'Why do I have to learn the rule first?',
      'Can I skip to practice?',
      'What if I already know this?',
      'I got it wrong',
      'Why was that wrong?',
      "I don't get it",
      'Can you explain that again?',
    ],
    chat: [
      'Who are you?',
      'Are you real?',
      'Can you do my homework?',
      'What can you help with?',
    ],
  },
  phase2: {
    math: [
      'What is addition?',
      'What is subtraction?',
      'What is multiplication?',
      'What is division?',
      'What are fractions?',
    ],
    reading: [
      'What is the main idea?',
      'What is a character?',
      'What is the setting?',
    ],
    spelling: [
      'How do I spell this word?',
      'Why is English spelling so weird?',
    ],
  },
  phase3: {
    parent_dashboard: [
      'How do I add a child?',
      "How do I see my child's progress?",
      'Is this safe for my child?',
      "Is my child's data safe?",
      'What is COPPA?',
    ],
  },
  phase4: {
    shop: [
      'How do I buy things?',
      'How do I get more coins?',
    ],
    leaderboard: [
      'How do I get on the leaderboard?',
    ],
  },
};

/**
 * Generate answers using Sonnet
 */
async function generateAnswers(questions, gradeBand, skillLevel, pageContext, subject = null) {
  const gradeInfo = GRADE_BANDS[gradeBand] || GRADE_BANDS['3-5'];

  const skillGuidance = {
    below: 'Student is STRUGGLING. Use SIMPLEST explanation, extra encouragement.',
    on: 'Student is at grade level. Standard explanations.',
    above: 'Student is ADVANCED. Deeper concepts, same vocabulary.',
  };

  const prompt = `You are Gigi, a friendly AI tutor. Generate answers for these questions.

RULES:
- Grade: ${gradeBand} (${gradeInfo.readingLevel})
- Vocabulary: ${gradeInfo.vocabulary}
- Skill Level: ${skillLevel} - ${skillGuidance[skillLevel]}
- Context: ${pageContext}
${subject ? `- Subject: ${subject}` : ''}

SAFETY (MUST FOLLOW):
- NEVER do homework FOR the student
- NEVER ask for personal info
- NEVER mention violence/adult content
- Always warm, encouraging tone

Return JSON array:
[
  {
    "question": "original question",
    "answer": "the answer"
  }
]

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON in response');
      return null;
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('API Error:', error.message);
    return null;
  }
}

/**
 * Insert answers into database
 */
async function insertAnswers(answers, gradeBand, skillLevel, pageContext, subject, category) {
  const gradeInfo = GRADE_BANDS[gradeBand] || { gradeLevel: 5 };

  const records = answers.map(a => ({
    question_text: a.question,
    question_hash: hashQuestion(a.question, gradeBand, skillLevel, pageContext),
    answer_text: a.answer,
    category: category,
    subcategory: skillLevel,  // Store skill level here
    page_context: pageContext,
    grade_level: gradeInfo.gradeLevel,
    user_type: gradeBand === 'parent' ? 'parent' : 'student',
  }));

  let inserted = 0;
  for (const record of records) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('qa_library')
      .select('id')
      .eq('question_hash', record.question_hash)
      .single();

    if (existing) {
      console.log(`    Skip (exists): ${record.question_text.substring(0, 25)}...`);
      continue;
    }

    const { error } = await supabase
      .from('qa_library')
      .insert(record);

    if (error) {
      console.error(`  Insert error: ${error.message}`);
    } else {
      inserted++;
    }
  }

  return inserted;
}

/**
 * Seed a phase
 */
async function seedPhase(phaseNum, dryRun = false) {
  const phase = SEED_DATA[`phase${phaseNum}`];
  if (!phase) {
    console.error(`Phase ${phaseNum} not found`);
    return { inserted: 0, errors: 0 };
  }

  console.log(`\n========== PHASE ${phaseNum} ==========\n`);

  let totalInserted = 0;
  let totalErrors = 0;

  for (const [context, questions] of Object.entries(phase)) {
    console.log(`\n--- ${context} (${questions.length} questions) ---`);

    // Determine category
    let category = 'general';
    let subject = null;
    if (['math', 'reading', 'spelling'].includes(context)) {
      category = 'subject';
      subject = context;
    } else if (context.includes('parent')) {
      category = 'parent_help';
    }

    // Grade bands for this context
    const gradeBands = context.includes('parent')
      ? ['9-12']  // Parents get adult-level answers
      : ['K-2', '3-5', '6-8', '9-12'];

    // Skill levels
    const skillLevels = context.includes('parent') ? ['on'] : ['below', 'on', 'above'];

    for (const gradeBand of gradeBands) {
      for (const skillLevel of skillLevels) {
        console.log(`  ${gradeBand} / ${skillLevel}...`);

        if (dryRun) {
          console.log(`    [DRY RUN] Would generate ${questions.length} answers`);
          continue;
        }

        // Generate answers
        const answers = await generateAnswers(
          questions,
          gradeBand,
          skillLevel,
          context,
          subject
        );

        if (answers) {
          const inserted = await insertAnswers(
            answers,
            gradeBand,
            skillLevel,
            context,
            subject,
            category
          );
          totalInserted += inserted;
          console.log(`    Inserted ${inserted}/${answers.length}`);
        } else {
          totalErrors += questions.length;
          console.log(`    FAILED to generate`);
        }

        // Rate limit
        await new Promise(r => setTimeout(r, CONFIG.delayMs));
      }
    }
  }

  console.log(`\n========== PHASE ${phaseNum} DONE ==========`);
  console.log(`  Inserted: ${totalInserted}`);
  console.log(`  Errors: ${totalErrors}`);

  return { inserted: totalInserted, errors: totalErrors };
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const phaseArg = args.find(a => a.startsWith('--phase='));
  const phase = phaseArg ? parseInt(phaseArg.split('=')[1]) : null;

  console.log('====================================');
  console.log('QA LIBRARY SEEDER');
  console.log('====================================');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Phase: ${phase || 'ALL'}`);

  // Count existing
  const { count: existingCount } = await supabase
    .from('qa_library')
    .select('*', { count: 'exact', head: true });
  console.log(`Existing records: ${existingCount || 0}`);

  // Seed
  let totalInserted = 0;
  let totalErrors = 0;

  if (phase) {
    const result = await seedPhase(phase, dryRun);
    totalInserted += result.inserted;
    totalErrors += result.errors;
  } else {
    for (let p = 1; p <= 4; p++) {
      const result = await seedPhase(p, dryRun);
      totalInserted += result.inserted;
      totalErrors += result.errors;
    }
  }

  // Final count
  const { count: finalCount } = await supabase
    .from('qa_library')
    .select('*', { count: 'exact', head: true });

  console.log('\n====================================');
  console.log('SEEDING COMPLETE');
  console.log('====================================');
  console.log(`Total inserted: ${totalInserted}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Final count: ${finalCount || 0}`);
}

main().catch(console.error);
