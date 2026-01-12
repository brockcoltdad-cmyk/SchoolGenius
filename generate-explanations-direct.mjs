#!/usr/bin/env node

/**
 * DIRECT GROK EXPLANATION GENERATOR
 *
 * Generates multi-level explanations + mistake patterns for all skills
 * Calls Grok API directly (no Edge Function timeout limits)
 *
 * Design:
 * - Processes 50 skills per run (finishes 119 skills in 3 runs)
 * - 5-second delay between calls (safe rate limiting)
 * - Each skill: ~45 seconds (API call + save)
 * - Total per run: ~40 minutes
 * - Run 2-3x over 3-5 days = DONE
 *
 * Cost: ~$100-150 total (one-time)
 * Savings: $23,000-$49,000/year
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Grok API setup
const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

// Configuration
const BATCH_SIZE = 50  // Process 50 skills per run
const DELAY_MS = 5000  // 5 seconds between calls
const MAX_TOKENS = 10000  // Reduced from 12000 for faster response

console.log('🚀 DIRECT GROK EXPLANATION GENERATOR')
console.log('====================================\n')
console.log(`Batch size: ${BATCH_SIZE} skills per run`)
console.log(`Delay: ${DELAY_MS / 1000} seconds between calls`)
console.log(`Estimated time: ~${Math.round(BATCH_SIZE * 45 / 60)} minutes\n`)

const VISUAL_TYPE_MAP = {
  MATH: { "counting": "counting_objects", "addition": "counting_objects", "subtraction": "counting_objects", "number_sense": "number_line", "number_line": "number_line", "place_value": "place_value", "multiplication": "array", "division": "array", "arrays": "array", "fractions": "fraction", "decimals": "fraction", "percents": "fraction", "word_problems": "bar_model", "equations": "balance_scale", "pre_algebra": "balance_scale", "algebra": "equation_steps", "linear": "equation_steps", "graphing": "graph", "coordinate": "graph", "functions": "graph", "default": "counting_objects" },
  READ: { "letters": "letter", "alphabet": "letter", "phonics": "phonics", "sounds": "phonics", "blending": "word_building", "cvc": "word_building", "sight_words": "sight_word", "high_frequency": "sight_word", "syllables": "syllable", "default": "letter" },
  LANG: { "parts_of_speech": "sentence_builder", "nouns": "sentence_builder", "verbs": "sentence_builder", "grammar": "sentence_builder", "sentences": "sentence_builder", "default": "sentence_builder" },
  SPELL: { "spelling": "spelling_rule", "suffixes": "spelling_rule", "prefixes": "spelling_rule", "roots": "spelling_rule", "default": "spelling_rule" },
  TYPE: { "typing": "keyboard", "keyboard": "keyboard", "default": "keyboard" },
  CODE: { "variables": "variable_box", "loops": "loop_animation", "output": "output", "print": "output", "blocks": "code_block", "scratch": "code_block", "conditionals": "conditional", "if_else": "conditional", "default": "code_block" }
}

const GRADE_DESCRIPTIONS = {
  0: "Kindergarten (ages 5-6): Very simple words, lots of emojis, single-digit numbers, 1-2 sentence explanations",
  1: "1st Grade (ages 6-7): Simple sentences, numbers 0-20, basic sight words",
  2: "2nd Grade (ages 7-8): Short paragraphs, numbers 0-100, two-step problems",
  3: "3rd Grade (ages 8-9): Multi-step problems, multiplication/division, intro fractions",
  4: "4th Grade (ages 9-10): Multi-digit operations, fractions, decimals",
  5: "5th Grade (ages 10-11): Complex fractions, decimals, percents, pre-algebra",
  6: "6th Grade (ages 11-12): Ratios, proportions, negative numbers, basic algebra",
  7: "7th Grade (ages 12-13): Algebraic expressions, equations, geometry",
  8: "8th Grade (ages 13-14): Linear equations, functions, Pythagorean theorem",
  9: "9th Grade (ages 14-15): Algebra I, quadratics, systems of equations",
  10: "10th Grade (ages 15-16): Geometry proofs, Algebra II",
  11: "11th Grade (ages 16-17): Advanced Algebra, trigonometry, SAT prep",
  12: "12th Grade (ages 17-18): Pre-calculus, college prep"
}

function getVisualType(subjectCode, skillName) {
  const subjectMap = VISUAL_TYPE_MAP[subjectCode] || {}
  const skillLower = skillName.toLowerCase()
  for (const [keyword, visualType] of Object.entries(subjectMap)) {
    if (keyword !== "default" && skillLower.includes(keyword)) return visualType
  }
  return subjectMap["default"] || "counting_objects"
}

// Call Grok API
async function callGrok(skill) {
  const visualType = getVisualType(skill.subject_code, skill.skill_name)
  const gradeDescription = GRADE_DESCRIPTIONS[skill.grade_level] || GRADE_DESCRIPTIONS[5]

  const prompt = `You are an expert K-12 curriculum designer creating a comprehensive lesson for SchoolGenius.

SKILL: ${skill.skill_name}
SUBJECT: ${skill.subject_code}
GRADE LEVEL: ${skill.grade_level}
GRADE CONTEXT: ${gradeDescription}

Generate JSON with this EXACT structure:

{
  "guided_practice": [
    {
      "problem": "Practice problem",
      "answer": "Correct answer",
      "multi_level_explanations": {
        "level_1": "Standard explanation if they don't understand",
        "level_2": "Simpler breakdown with more steps if still confused",
        "level_3": "Most basic explanation with real-world analogy for struggling students",
        "visual": "Picture this in your mind...",
        "story": "Imagine a story where...",
        "step_by_step": "Let's do this one tiny step at a time..."
      }
    }
  ],

  "independent_practice": {
    "easy": [
      {
        "problem": "Easy problem",
        "answer": "A",
        "wrong_answers": ["B", "C", "D"],
        "mistake_patterns": {
          "B": "I see you chose B. That's what you'd get if... Let me show you why A is correct.",
          "C": "C is close, but remember...",
          "D": "That would work if..., but in this case..."
        }
      }
    ],
    "medium": [...],
    "hard": [...]
  }
}

REQUIREMENTS:
- 3 guided_practice problems (each with ALL 6 explanation types)
- independent_practice: 3 easy, 3 medium, 3 hard (each with mistake_patterns for B, C, D)

CRITICAL: For guided_practice, provide ALL 6 explanation types.
CRITICAL: For independent_practice, provide specific feedback for EACH wrong answer (B, C, D).

Return ONLY valid JSON. No markdown, no explanation, just the JSON object.`

  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: MAX_TOKENS
      })
    })

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`)
    }

    const data = await response.json()
    const contentStr = data.choices?.[0]?.message?.content

    if (!contentStr) {
      throw new Error('No content from Grok API')
    }

    // Parse JSON (handle code blocks)
    let cleanJson = contentStr.trim()
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7)
    if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3)
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3)

    return JSON.parse(cleanJson.trim())

  } catch (error) {
    console.error(`  ❌ API Error: ${error.message}`)
    return null
  }
}

// Save explanations to database
async function saveExplanations(skill, content) {
  const explanations = []

  if (content.guided_practice) {
    for (const practice of content.guided_practice) {
      if (practice.multi_level_explanations) {
        explanations.push({
          subject_code: skill.subject_code,
          skill_id: skill.id,
          skill_name: skill.skill_name,
          problem_text: practice.problem,
          level_1: practice.multi_level_explanations.level_1,
          level_2: practice.multi_level_explanations.level_2,
          level_3: practice.multi_level_explanations.level_3,
          visual_explanation: practice.multi_level_explanations.visual,
          story_explanation: practice.multi_level_explanations.story,
          step_by_step: practice.multi_level_explanations.step_by_step,
          generated_by: 'grok',
          times_used: 0
        })
      }
    }
  }

  if (explanations.length > 0) {
    const { error } = await supabase
      .from('explanation_library')
      .insert(explanations)

    if (error) {
      console.error(`  ❌ DB Error (explanations): ${error.message}`)
      return { explanations: 0, mistakes: 0 }
    }
  }

  return { explanations: explanations.length }
}

// Save mistake patterns to database
async function saveMistakes(skill, content) {
  const mistakes = []

  if (content.independent_practice) {
    for (const difficulty of ['easy', 'medium', 'hard']) {
      const problems = content.independent_practice[difficulty] || []
      for (const problem of problems) {
        if (problem.mistake_patterns) {
          for (const [wrongAns, feedback] of Object.entries(problem.mistake_patterns)) {
            mistakes.push({
              subject_code: skill.subject_code,
              skill_id: skill.id,
              problem_text: problem.problem,
              correct_answer: problem.answer,
              wrong_answer: wrongAns,
              why_kid_chose: `Chose ${wrongAns} instead of ${problem.answer}`,
              feedback: feedback,
              times_seen: 0,
              times_helped: 0
            })
          }
        }
      }
    }
  }

  if (mistakes.length > 0) {
    const { error } = await supabase
      .from('mistake_patterns')
      .insert(mistakes)

    if (error) {
      console.error(`  ❌ DB Error (mistakes): ${error.message}`)
      return 0
    }
  }

  return mistakes.length
}

// Main execution
async function main() {
  const startTime = Date.now()

  // Get skills that need explanations
  console.log('📊 Finding skills that need explanations...\n')

  const { data: existingExplanations } = await supabase
    .from('explanation_library')
    .select('skill_id')

  const skillsWithExplanations = new Set(
    existingExplanations?.map(e => e.skill_id).filter(Boolean) || []
  )

  const { data: allSkills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_name, subject_code, grade_level')
    .order('grade_level', { ascending: true })
    .order('subject_code', { ascending: true })

  const skillsToGenerate = allSkills?.filter(s => !skillsWithExplanations.has(s.id)) || []

  console.log(`Total skills: ${allSkills?.length || 0}`)
  console.log(`Already have explanations: ${skillsWithExplanations.size}`)
  console.log(`Need to generate: ${skillsToGenerate.length}\n`)

  if (skillsToGenerate.length === 0) {
    console.log('✅ All skills already have explanations!')
    return
  }

  // Process batch
  const batchToProcess = skillsToGenerate.slice(0, BATCH_SIZE)
  console.log(`Processing ${batchToProcess.length} skills this run...\n`)
  console.log('━'.repeat(70) + '\n')

  let successCount = 0
  let errorCount = 0
  let totalExplanations = 0
  let totalMistakes = 0

  for (let i = 0; i < batchToProcess.length; i++) {
    const skill = batchToProcess[i]
    console.log(`[${i + 1}/${batchToProcess.length}] ${skill.subject_code} - ${skill.skill_name} (Grade ${skill.grade_level})`)

    // Call Grok API
    const content = await callGrok(skill)

    if (!content) {
      errorCount++
      console.log(`  ❌ Failed\n`)
      continue
    }

    // Save to database
    const { explanations } = await saveExplanations(skill, content)
    const mistakes = await saveMistakes(skill, content)

    if (explanations > 0 || mistakes > 0) {
      console.log(`  ✅ Saved ${explanations} explanations + ${mistakes} mistake patterns`)
      successCount++
      totalExplanations += explanations
      totalMistakes += mistakes
    } else {
      console.log(`  ⚠️  No content saved`)
      errorCount++
    }

    console.log()

    // Progress checkpoint every 10 skills
    if ((i + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
      const remaining = batchToProcess.length - i - 1
      const estimatedRemaining = Math.round(remaining * 45 / 60)
      console.log(`📊 Checkpoint: ${successCount} success, ${errorCount} errors`)
      console.log(`   Elapsed: ${elapsed} min | Remaining: ~${estimatedRemaining} min\n`)
    }

    // Delay between calls
    if (i < batchToProcess.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('━'.repeat(70))
  console.log('\n📊 BATCH COMPLETE!\n')
  console.log(`✅ Success: ${successCount}/${batchToProcess.length}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📚 Explanations added: ${totalExplanations}`)
  console.log(`❌ Mistake patterns added: ${totalMistakes}`)
  console.log(`⏱️  Duration: ${duration} minutes\n`)

  // Calculate remaining work
  const remaining = skillsToGenerate.length - batchToProcess.length
  if (remaining > 0) {
    const runsNeeded = Math.ceil(remaining / BATCH_SIZE)
    console.log(`📋 NEXT STEPS:`)
    console.log(`   ${remaining} skills remaining`)
    console.log(`   Run this script ${runsNeeded} more time(s) to complete`)
    console.log(`   Estimated: ${Math.round(runsNeeded * BATCH_SIZE * 45 / 60)} more minutes total\n`)
  } else {
    console.log(`🎉 ALL SKILLS COMPLETE!\n`)
  }

  // Show final library status
  const { data: finalExplanations } = await supabase
    .from('explanation_library')
    .select('id', { count: 'exact', head: true })

  const { data: finalMistakes } = await supabase
    .from('mistake_patterns')
    .select('id', { count: 'exact', head: true })

  console.log(`💾 Library Status:`)
  console.log(`   Explanations: ${finalExplanations?.length || 0}`)
  console.log(`   Mistake Patterns: ${finalMistakes?.length || 0}`)
  console.log(`   Total Content: ${(finalExplanations?.length || 0) + (finalMistakes?.length || 0)}\n`)

  console.log(`💰 Cost Savings:`)
  const totalContent = (finalExplanations?.length || 0) + (finalMistakes?.length || 0)
  const annualSavings = totalContent * 10 * 0.02
  console.log(`   Estimated annual savings: $${annualSavings.toFixed(2)}\n`)
}

main().catch(console.error)
