#!/usr/bin/env node
/**
 * GENERATE CHALLENGING MATH PROBLEMS
 *
 * Following MASTER-RULES-CHECKLIST:
 * - Arizona math standards
 * - CHALLENGING questions (kids know the rule, test APPLICATION)
 * - Visual data for K-5 (counting objects, number lines, etc.)
 * - Multi-step problems for grades 3+
 * - Word problems at every level
 * - NOT easy recall - requires THINKING
 *
 * DIFFICULTY PHILOSOPHY:
 * - Easy questions = waste of time
 * - Kids ALREADY LEARNED the rule
 * - Questions should TEST if they can APPLY it
 * - Include "tricky" variations that catch common mistakes
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

const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Arizona Math Standards by Grade
const MATH_TOPICS = {
  0: [ // Kindergarten
    { topic: 'Counting to 20', standard: 'K.CC.A.1', visual: 'counting_objects' },
    { topic: 'Comparing Numbers', standard: 'K.CC.C.6', visual: 'counting_objects' },
    { topic: 'Addition within 10', standard: 'K.OA.A.1', visual: 'counting_objects' },
    { topic: 'Subtraction within 10', standard: 'K.OA.A.1', visual: 'counting_objects' },
    { topic: 'Shapes', standard: 'K.G.A.2', visual: 'shapes' },
  ],
  1: [ // Grade 1
    { topic: 'Addition within 20', standard: '1.OA.A.1', visual: 'number_line' },
    { topic: 'Subtraction within 20', standard: '1.OA.A.1', visual: 'number_line' },
    { topic: 'Word Problems (Add/Sub)', standard: '1.OA.A.1', visual: 'bar_model' },
    { topic: 'Place Value (Tens/Ones)', standard: '1.NBT.B.2', visual: 'place_value' },
    { topic: 'Comparing Two-Digit Numbers', standard: '1.NBT.B.3', visual: 'place_value' },
  ],
  2: [ // Grade 2
    { topic: 'Addition within 100', standard: '2.OA.B.2', visual: 'number_line' },
    { topic: 'Subtraction within 100', standard: '2.OA.B.2', visual: 'number_line' },
    { topic: 'Word Problems (Two-Step)', standard: '2.OA.A.1', visual: 'bar_model' },
    { topic: 'Skip Counting (2s, 5s, 10s)', standard: '2.NBT.A.2', visual: 'number_line' },
    { topic: 'Measuring Length', standard: '2.MD.A.1', visual: 'measurement' },
  ],
  3: [ // Grade 3
    { topic: 'Multiplication Facts', standard: '3.OA.A.1', visual: 'array' },
    { topic: 'Division Facts', standard: '3.OA.A.2', visual: 'array' },
    { topic: 'Word Problems (Mult/Div)', standard: '3.OA.A.3', visual: 'bar_model' },
    { topic: 'Fractions on Number Line', standard: '3.NF.A.2', visual: 'fraction' },
    { topic: 'Area of Rectangles', standard: '3.MD.C.7', visual: 'array' },
  ],
  4: [ // Grade 4
    { topic: 'Multi-Digit Multiplication', standard: '4.NBT.B.5', visual: 'array' },
    { topic: 'Multi-Digit Division', standard: '4.NBT.B.6', visual: 'bar_model' },
    { topic: 'Equivalent Fractions', standard: '4.NF.A.1', visual: 'fraction' },
    { topic: 'Adding/Subtracting Fractions', standard: '4.NF.B.3', visual: 'fraction' },
    { topic: 'Decimals', standard: '4.NF.C.6', visual: 'place_value' },
  ],
  5: [ // Grade 5
    { topic: 'Multiplying Fractions', standard: '5.NF.B.4', visual: 'fraction' },
    { topic: 'Dividing Fractions', standard: '5.NF.B.7', visual: 'fraction' },
    { topic: 'Decimal Operations', standard: '5.NBT.B.7', visual: 'place_value' },
    { topic: 'Order of Operations', standard: '5.OA.A.1', visual: 'equation' },
    { topic: 'Coordinate Plane', standard: '5.G.A.1', visual: 'graph' },
  ],
  6: [ // Grade 6
    { topic: 'Ratios and Rates', standard: '6.RP.A.1', visual: 'bar_model' },
    { topic: 'Dividing Fractions', standard: '6.NS.A.1', visual: 'fraction' },
    { topic: 'Negative Numbers', standard: '6.NS.C.5', visual: 'number_line' },
    { topic: 'Algebraic Expressions', standard: '6.EE.A.2', visual: 'balance' },
    { topic: 'One-Step Equations', standard: '6.EE.B.7', visual: 'balance' },
  ],
  7: [ // Grade 7
    { topic: 'Proportional Relationships', standard: '7.RP.A.2', visual: 'graph' },
    { topic: 'Operations with Rationals', standard: '7.NS.A.1', visual: 'number_line' },
    { topic: 'Two-Step Equations', standard: '7.EE.B.4', visual: 'balance' },
    { topic: 'Percent Problems', standard: '7.RP.A.3', visual: 'bar_model' },
    { topic: 'Probability', standard: '7.SP.C.5', visual: 'none' },
  ],
  8: [ // Grade 8 (Pre-Algebra)
    { topic: 'Linear Equations', standard: '8.EE.C.7', visual: 'graph' },
    { topic: 'Systems of Equations', standard: '8.EE.C.8', visual: 'graph' },
    { topic: 'Functions', standard: '8.F.A.1', visual: 'graph' },
    { topic: 'Pythagorean Theorem', standard: '8.G.B.7', visual: 'geometry' },
    { topic: 'Exponents', standard: '8.EE.A.1', visual: 'none' },
  ],
};

// Copy for high school (simplified - would need full algebra/geometry/calc)
MATH_TOPICS[9] = MATH_TOPICS[8];
MATH_TOPICS[10] = MATH_TOPICS[8];
MATH_TOPICS[11] = MATH_TOPICS[8];
MATH_TOPICS[12] = MATH_TOPICS[8];

async function generateProblems(grade, topicInfo) {
  const gradeLabel = grade === 0 ? 'Kindergarten' : `Grade ${grade}`;

  const prompt = `You are an Arizona curriculum expert creating CHALLENGING math problems.

GRADE: ${gradeLabel}
TOPIC: ${topicInfo.topic}
ARIZONA STANDARD: ${topicInfo.standard}
VISUAL TYPE: ${topicInfo.visual}

CRITICAL: These problems must be CHALLENGING, not easy recall!
- Students ALREADY LEARNED the rule in class
- These questions TEST if they can APPLY the rule
- Include word problems that require THINKING
- Include "tricky" variations that catch common mistakes
- NO simple drill problems like "2+2=?"

DIFFICULTY LEVELS (generate 5 of each):
1. MEDIUM: Straightforward application of the rule
2. HARD: Multi-step or requires careful thinking
3. CHALLENGE: Tricky variation, word problem, or catches common errors

FOR VISUAL DATA (if applicable):
- counting_objects: Include emoji and count for visual
- number_line: Include min, max, start position, hops
- fraction: Include numerator, denominator, visual type
- array: Include rows, columns for multiplication
- bar_model: Include parts and whole for word problems
- balance: Include left side, right side for equations

OUTPUT JSON FORMAT:
{
  "topic": "${topicInfo.topic}",
  "standard": "${topicInfo.standard}",
  "rule_explanation": "Clear explanation of the math rule",
  "problems": [
    {
      "difficulty": "medium",
      "question": "The question text",
      "answer": 5,
      "options": [3, 4, 5, 6],
      "visual_type": "${topicInfo.visual}",
      "visual_data": { ... },
      "explanation": "Step-by-step solution",
      "common_mistake": "What students often get wrong and why",
      "hints": [
        "Level 1: Gentle nudge",
        "Level 2: More specific hint",
        "Level 3: Almost gives it away",
        "Level 4: Visual description",
        "Level 5: Story-based hint",
        "Level 6: Step-by-step walkthrough"
      ]
    }
  ]
}

Generate EXACTLY 15 problems (5 medium, 5 hard, 5 challenge).
Return ONLY valid JSON.`;

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Error generating problems for ${topicInfo.topic}:`, error.message);
    return null;
  }
}

async function saveProblems(grade, problemData) {
  if (!problemData || !problemData.problems) return 0;

  let saved = 0;
  for (const problem of problemData.problems) {
    const { error } = await supabase
      .from('math_problems')
      .upsert({
        grade_level: grade,
        topic: problemData.topic,
        standard: problemData.standard,
        difficulty: problem.difficulty,
        question: problem.question,
        answer: problem.answer,
        options: problem.options,
        visual_type: problem.visual_type,
        visual_data: problem.visual_data,
        explanation: problem.explanation,
        common_mistake: problem.common_mistake,
        hints: problem.hints
      }, { onConflict: 'grade_level,topic,question' });

    if (!error) {
      saved++;
    } else {
      console.error('    Error saving:', error.message);
    }
  }
  return saved;
}

async function main() {
  console.log('🧮 GENERATING CHALLENGING MATH PROBLEMS');
  console.log('='.repeat(60));
  console.log('Using Claude Haiku - safer for children\'s content');
  console.log('');

  const args = process.argv.slice(2);
  const startGrade = parseInt(args.find(a => a.startsWith('--start='))?.split('=')[1] || '0');
  const endGrade = parseInt(args.find(a => a.startsWith('--end='))?.split('=')[1] || '5');
  const dryRun = args.includes('--dry');

  console.log(`Grades: ${startGrade === 0 ? 'K' : startGrade} to ${endGrade}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  let totalProblems = 0;

  for (let grade = startGrade; grade <= endGrade; grade++) {
    const topics = MATH_TOPICS[grade] || MATH_TOPICS[5];
    const gradeLabel = grade === 0 ? 'K' : grade;

    console.log(`\n[Grade ${gradeLabel}]`);

    for (const topicInfo of topics) {
      console.log(`  Generating: ${topicInfo.topic}...`);

      const problemData = await generateProblems(grade, topicInfo);

      if (problemData && !dryRun) {
        const saved = await saveProblems(grade, problemData);
        totalProblems += saved;
        console.log(`    ✅ Saved ${saved} problems`);
      } else if (problemData) {
        console.log(`    📝 Would save ${problemData.problems?.length || 0} problems (dry run)`);
        totalProblems += problemData.problems?.length || 0;
      } else {
        console.log(`    ❌ Failed to generate`);
      }

      // Rate limit - be nice to Claude
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 COMPLETE: ${totalProblems} problems ${dryRun ? 'would be' : ''} saved`);
}

main().catch(console.error);
