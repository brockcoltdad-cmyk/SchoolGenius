#!/usr/bin/env node

/**
 * GROK DAILY CONTENT GENERATOR
 *
 * Runs automatically each day to slowly populate closed loop libraries.
 * Uses Grok (cheap) to pre-generate content so Claude calls become FREE.
 *
 * Design: Generate small batches (20-50 items/day) to avoid crashes
 * Cost: ~$0.50-$1.00 per day instead of $150 all at once
 * Time: 30 days to complete vs crashing in 1 day
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

// Batch sizes (small to avoid crashes)
const BATCH_SIZE = {
  explanations: 20,    // 20 help explanations per day
  mistakes: 10,        // 10 mistake patterns per day
  parentFAQ: 5         // 5 parent FAQs per day
}

console.log('🤖 GROK DAILY CONTENT GENERATOR')
console.log('================================\n')
console.log('Running automated content generation...\n')

// Track progress in database
async function getProgress() {
  const { data, error } = await supabase
    .from('generation_progress')
    .select('*')
    .single()

  if (error && error.code === 'PGRST116') {
    // Table doesn't exist or no row, create it
    return {
      explanations_completed: 0,
      mistakes_completed: 0,
      parent_faq_completed: 0,
      last_run: null
    }
  }

  return data
}

async function updateProgress(updates) {
  const { error } = await supabase
    .from('generation_progress')
    .upsert({
      id: 1,
      ...updates,
      last_run: new Date().toISOString()
    })

  if (error) console.error('Failed to update progress:', error.message)
}

// Call Grok API
async function callGrok(prompt) {
  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator for K-12 homeschool curriculum.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Grok API call failed:', error.message)
    return null
  }
}

// Generate help explanations
async function generateExplanations(startId, count) {
  console.log(`📚 Generating ${count} help explanations...`)

  // Get next batch of skills that need explanations
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_code, skill_name, subject_code, grade_level')
    .not('id', 'in', `(SELECT skill_id FROM explanation_library WHERE skill_id IS NOT NULL)`)
    .range(0, count - 1)

  if (!skills || skills.length === 0) {
    console.log('✅ All explanations already generated!')
    return 0
  }

  let generated = 0

  for (const skill of skills) {
    const prompt = `Create 3 levels of explanation for this skill:

Subject: ${skill.subject_code}
Grade: ${skill.grade_level}
Skill: ${skill.skill_name}

Generate JSON with:
{
  "level_1": "Standard explanation (2-3 sentences)",
  "level_2": "Simplified explanation (easier words, shorter)",
  "level_3": "Most basic with real-world example or analogy",
  "visual_explanation": "Description of how to visualize this",
  "story_explanation": "Short story that teaches this concept"
}

Keep all explanations kid-friendly for grade ${skill.grade_level}.`

    const response = await callGrok(prompt)

    if (response) {
      try {
        const explanations = JSON.parse(response)

        // Save to database
        const { error } = await supabase
          .from('explanation_library')
          .insert({
            skill_id: skill.id,
            subject_code: skill.subject_code,
            level_1: explanations.level_1,
            level_2: explanations.level_2,
            level_3: explanations.level_3,
            visual_explanation: explanations.visual_explanation,
            story_explanation: explanations.story_explanation,
            times_used: 0
          })

        if (error) {
          console.log(`  ❌ ${skill.skill_name}: ${error.message}`)
        } else {
          console.log(`  ✅ ${skill.skill_name}`)
          generated++
        }
      } catch (e) {
        console.log(`  ❌ ${skill.skill_name}: Failed to parse response`)
      }
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return generated
}

// Generate mistake patterns
async function generateMistakes(startId, count) {
  console.log(`\n🎯 Generating ${count} mistake patterns...`)

  // Get skills that need mistake patterns
  const { data: skills } = await supabase
    .from('curriculum_skills')
    .select('id, skill_code, skill_name, subject_code')
    .eq('subject_code', 'MATH') // Start with math (most common mistakes)
    .not('id', 'in', `(SELECT skill_id FROM mistake_patterns WHERE skill_id IS NOT NULL)`)
    .range(0, count - 1)

  if (!skills || skills.length === 0) {
    console.log('✅ All mistake patterns already generated!')
    return 0
  }

  let generated = 0

  for (const skill of skills) {
    const prompt = `For this math skill, identify common wrong answers:

Skill: ${skill.skill_name}

Generate JSON array of 3-5 common mistakes:
[
  {
    "wrong_answer": "23",
    "why_kid_chose": "Added instead of multiplied",
    "feedback": "I see you got 23! That's what you'd get if you ADDED. But × means multiply..."
  }
]

Focus on actual mistakes kids make, not random wrong answers.`

    const response = await callGrok(prompt)

    if (response) {
      try {
        const mistakes = JSON.parse(response)

        for (const mistake of mistakes) {
          const { error } = await supabase
            .from('mistake_patterns')
            .insert({
              skill_id: skill.id,
              wrong_answer: mistake.wrong_answer,
              why_kid_chose: mistake.why_kid_chose,
              feedback: mistake.feedback,
              times_seen: 0
            })

          if (error) {
            console.log(`  ❌ ${skill.skill_name}: ${error.message}`)
          } else {
            generated++
          }
        }
        console.log(`  ✅ ${skill.skill_name} (${mistakes.length} patterns)`)
      } catch (e) {
        console.log(`  ❌ ${skill.skill_name}: Failed to parse response`)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return generated
}

// Generate parent FAQ
async function generateParentFAQ(startId, count) {
  console.log(`\n👨‍👩‍👧 Generating ${count} parent FAQ articles...`)

  const categories = [
    'Account Management',
    'Child Management',
    'Coins & Rewards',
    'Lessons & Learning',
    'Progress & Reports',
    'Themes & Personalization',
    'Technical Issues'
  ]

  // Get how many we've done
  const { count: existing } = await supabase
    .from('parent_help_articles')
    .select('*', { count: 'exact', head: true })

  if (existing >= 57) {
    console.log('✅ All parent FAQs already generated!')
    return 0
  }

  const startCategory = Math.floor(existing / 8)
  const category = categories[startCategory] || categories[0]

  const prompt = `Generate ${count} common parent questions and answers for category: ${category}

For a K-12 homeschool platform called SchoolGenius with:
- AI tutors (Gigi the voice)
- Lessons with coins and rewards
- 340 themes kids can customize
- Progress tracking

Generate JSON array:
[
  {
    "category": "${category}",
    "question_pattern": "How do I...",
    "keywords": ["account", "setup"],
    "answer": "Detailed helpful answer (3-4 paragraphs)"
  }
]

Make answers friendly, clear, and helpful for parents.`

  const response = await callGrok(prompt)

  if (response) {
    try {
      const faqs = JSON.parse(response)
      let generated = 0

      for (const faq of faqs.slice(0, count)) {
        const { error } = await supabase
          .from('parent_help_articles')
          .insert({
            category: faq.category,
            question_pattern: faq.question_pattern,
            keywords: faq.keywords,
            answer: faq.answer
          })

        if (error) {
          console.log(`  ❌ ${faq.question_pattern}: ${error.message}`)
        } else {
          console.log(`  ✅ ${faq.question_pattern}`)
          generated++
        }
      }

      return generated
    } catch (e) {
      console.log(`  ❌ Failed to parse response: ${e.message}`)
      return 0
    }
  }

  return 0
}

// Main execution
async function main() {
  const startTime = Date.now()

  // Get current progress
  const progress = await getProgress()

  console.log('📊 Current Progress:')
  console.log(`   Explanations: ${progress.explanations_completed}`)
  console.log(`   Mistake Patterns: ${progress.mistakes_completed}`)
  console.log(`   Parent FAQs: ${progress.parent_faq_completed}`)
  console.log(`   Last Run: ${progress.last_run || 'Never'}\n`)

  // Generate today's batch
  const results = {
    explanations: 0,
    mistakes: 0,
    parentFAQ: 0
  }

  // Generate explanations (highest priority)
  if (progress.explanations_completed < 120) {
    results.explanations = await generateExplanations(
      progress.explanations_completed,
      BATCH_SIZE.explanations
    )
  }

  // Generate mistake patterns
  if (progress.mistakes_completed < 100) {
    results.mistakes = await generateMistakes(
      progress.mistakes_completed,
      BATCH_SIZE.mistakes
    )
  }

  // Generate parent FAQ
  if (progress.parent_faq_completed < 57) {
    results.parentFAQ = await generateParentFAQ(
      progress.parent_faq_completed,
      BATCH_SIZE.parentFAQ
    )
  }

  // Update progress
  await updateProgress({
    explanations_completed: progress.explanations_completed + results.explanations,
    mistakes_completed: progress.mistakes_completed + results.mistakes,
    parent_faq_completed: progress.parent_faq_completed + results.parentFAQ
  })

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n================================')
  console.log('📊 TODAY\'S RESULTS:')
  console.log(`   ✅ Explanations: ${results.explanations}`)
  console.log(`   ✅ Mistake Patterns: ${results.mistakes}`)
  console.log(`   ✅ Parent FAQs: ${results.parentFAQ}`)
  console.log(`   ⏱️  Duration: ${duration}s`)
  console.log('\n💰 Estimated cost today: $0.50-$1.00')
  console.log('💰 Estimated savings when complete: $23,000-$49,000/year\n')
  console.log('✅ Daily generation complete! Will run again tomorrow.')
}

main().catch(console.error)
