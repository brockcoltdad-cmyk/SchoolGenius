#!/usr/bin/env node

/**
 * TEST: Small batch to verify the explanation generator works
 * Processes just 3 skills to test the system
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_API_KEY = process.env.XAI_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

console.log('🧪 TEST: Explanation Generator (3 skills)\n')

// Get 3 skills that need explanations
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
  .limit(15)

const skillsToTest = allSkills?.filter(s => !skillsWithExplanations.has(s.id)).slice(0, 3) || []

if (skillsToTest.length === 0) {
  console.log('❌ No skills available for testing (first 10 all have explanations)')
  process.exit(1)
}

console.log(`Testing with ${skillsToTest.length} skills:\n`)
skillsToTest.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.subject_code} - ${s.skill_name} (Grade ${s.grade_level})`)
})
console.log()

// Test first skill
const skill = skillsToTest[0]
console.log(`📞 Calling Grok API for: ${skill.skill_name}...`)

const prompt = `Generate JSON for a K-12 lesson:

SKILL: ${skill.skill_name}
SUBJECT: ${skill.subject_code}
GRADE: ${skill.grade_level}

{
  "guided_practice": [
    {
      "problem": "Practice problem",
      "answer": "Answer",
      "multi_level_explanations": {
        "level_1": "Standard explanation",
        "level_2": "Simpler explanation",
        "level_3": "Most basic explanation",
        "visual": "Visual explanation",
        "story": "Story explanation",
        "step_by_step": "Step by step"
      }
    }
  ],
  "independent_practice": {
    "easy": [
      {
        "problem": "Easy problem",
        "answer": "A",
        "mistake_patterns": {
          "B": "Feedback for B",
          "C": "Feedback for C",
          "D": "Feedback for D"
        }
      }
    ],
    "medium": [same structure],
    "hard": [same structure]
  }
}

Generate 3 guided_practice, 3 easy, 3 medium, 3 hard. Return ONLY JSON.`

try {
  const startTime = Date.now()

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
      max_tokens: 10000
    })
  })

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  if (!response.ok) {
    console.log(`❌ API Error: ${response.status}`)
    const text = await response.text()
    console.log(text.substring(0, 500))
    process.exit(1)
  }

  console.log(`✅ API Response received (${duration}s)`)

  const data = await response.json()
  const contentStr = data.choices?.[0]?.message?.content

  if (!contentStr) {
    console.log('❌ No content in response')
    process.exit(1)
  }

  console.log(`\n📄 Response length: ${contentStr.length} characters`)

  // Parse JSON
  let cleanJson = contentStr.trim()
  if (cleanJson.startsWith('```json')) cleanJson = cleanJson.slice(7)
  if (cleanJson.startsWith('```')) cleanJson = cleanJson.slice(3)
  if (cleanJson.endsWith('```')) cleanJson = cleanJson.slice(0, -3)

  const content = JSON.parse(cleanJson.trim())

  console.log(`✅ JSON parsed successfully`)
  console.log(`   Guided practice: ${content.guided_practice?.length || 0}`)
  console.log(`   Independent easy: ${content.independent_practice?.easy?.length || 0}`)
  console.log(`   Independent medium: ${content.independent_practice?.medium?.length || 0}`)
  console.log(`   Independent hard: ${content.independent_practice?.hard?.length || 0}`)

  // Count what we'll save
  let explanationCount = 0
  let mistakeCount = 0

  if (content.guided_practice) {
    for (const practice of content.guided_practice) {
      if (practice.multi_level_explanations) {
        explanationCount++
      }
    }
  }

  if (content.independent_practice) {
    for (const difficulty of ['easy', 'medium', 'hard']) {
      const problems = content.independent_practice[difficulty] || []
      for (const problem of problems) {
        if (problem.mistake_patterns) {
          mistakeCount += Object.keys(problem.mistake_patterns).length
        }
      }
    }
  }

  console.log(`\n💾 Will save:`)
  console.log(`   ${explanationCount} explanation sets`)
  console.log(`   ${mistakeCount} mistake patterns`)

  console.log(`\n✅ TEST PASSED!`)
  console.log(`\nReady to run full generation:`)
  console.log(`   node generate-explanations-direct.mjs`)

} catch (error) {
  console.log(`\n❌ TEST FAILED: ${error.message}`)
  console.log(error.stack)
  process.exit(1)
}
