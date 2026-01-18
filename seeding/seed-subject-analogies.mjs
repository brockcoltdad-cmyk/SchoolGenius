import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_API_KEY = process.env.GROK_API_KEY
const DELAY_MS = 5000

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
  })

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  // Extract JSON from markdown if needed
  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content

  return JSON.parse(jsonString)
}

function getAgeGroupAnalogyGuidelines(ageGroup) {
  const guidelines = {
    k2: {
      description: 'K-2 (Ages 5-8)',
      examples: 'toys, snacks, games kids LOVE (blocks, cookies, puppies, Pokemon)',
      format: 'ONE simple sentence',
      words: 'Super simple words',
      visual: 'Very visual - they can picture it',
      example: '"Fractions are like pizza slices you share with friends! 🍕"'
    },
    grades35: {
      description: '3-5 (Ages 8-11)',
      examples: 'relatable everyday things (sports, food, games, school)',
      format: '2-3 sentences',
      words: 'Clear explanation of connection',
      visual: 'Build on basics they know',
      example: '"Think of fractions like cutting things into equal parts. If you have a chocolate bar with 8 squares and eat 3, you ate 3/8!"'
    },
    grades68: {
      description: '6-8 (Ages 11-14)',
      examples: 'real-world applications (money, cooking, sports stats)',
      format: 'Multi-step explanation',
      words: 'Show why it matters',
      visual: 'Connect to their interests',
      example: '"Fractions represent parts of a whole, like dividing your phone storage. If photos take up 3/4 of 64GB, they\'re using 48GB."'
    },
    grades912: {
      description: '9-12 (Ages 14-18)',
      examples: 'academic/professional contexts (finance, science, engineering)',
      format: 'Technical but relatable',
      words: 'Show real applications',
      visual: 'Prepare for advanced math',
      example: '"Fractions are rational numbers expressing proportional relationships, like calculating chemical solution concentrations or financial ratios."'
    }
  }
  return guidelines[ageGroup]
}

function getAnalogiesPerSkill(subject) {
  const counts = {
    'MATH': 3,
    'READING': 2,
    'SPELLING': 2,
    'CODING': 3,
    'TYPING': 1
  }
  return counts[subject] || 2
}

async function seedSubjectAnalogies() {
  console.log('🚀 SUBJECT ANALOGIES SEEDER')
  console.log('='.repeat(80))
  console.log('Generating age-appropriate analogies for all skills\n')

  // Fetch all skills from database
  console.log('📚 Fetching skills from database...')
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('id, name, subject')
    .order('subject', { ascending: true })
    .order('name', { ascending: true })

  if (skillsError) {
    console.error('❌ Error fetching skills:', skillsError.message)
    process.exit(1)
  }

  console.log(`✅ Found ${skills.length} skills\n`)

  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let itemIndex = 0
  let totalItems = 0

  // Calculate total analogies to generate
  for (const skill of skills) {
    const analogiesPerSkill = getAnalogiesPerSkill(skill.subject)
    totalItems += analogiesPerSkill * ageGroups.length
  }

  console.log(`Total to generate: ${totalItems} analogies\n`)

  for (const skill of skills) {
    const analogiesPerSkill = getAnalogiesPerSkill(skill.subject)

    for (let analogyNum = 1; analogyNum <= analogiesPerSkill; analogyNum++) {
      for (const ageGroup of ageGroups) {
        itemIndex++

        try {
          const guidelines = getAgeGroupAnalogyGuidelines(ageGroup)

          console.log(`\n[${itemIndex}/${totalItems}] ${skill.name} | ${skill.subject} | ${ageGroup} | Analogy #${analogyNum}`)

          const prompt = `Create a relatable real-world analogy for:
Skill: ${skill.name}
Subject: ${skill.subject}
Age Group: ${ageGroup} (${guidelines.description})

Generate an analogy that:
1. Uses something kids experience daily
2. Is easy to visualize
3. Makes the concept memorable
4. Is AGE-APPROPRIATE for ${ageGroup}:
   - Examples to use: ${guidelines.examples}
   - Format: ${guidelines.format}
   - Style: ${guidelines.words}
   - Visual: ${guidelines.visual}
   - Example style: ${guidelines.example}

Make this analogy DIFFERENT from any others for this skill (this is analogy #${analogyNum}).

Return ONLY valid JSON (no markdown):
{
  "skill_name": "${skill.name}",
  "subject": "${skill.subject}",
  "age_group": "${ageGroup}",
  "analogy": "Your one-line analogy here",
  "explanation": "How this analogy connects to the concept (2-4 sentences)",
  "when_to_use": "When to use this analogy"
}`

          const generated = await callGrok(prompt)

          // Validate required fields
          if (!generated.skill_name || !generated.analogy || !generated.explanation) {
            throw new Error('Missing required fields in generated analogy')
          }

          // Save to database
          const { error } = await supabase
            .from('subject_analogies')
            .insert({
              skill_id: skill.id,
              skill_name: generated.skill_name,
              subject: generated.subject || skill.subject,
              age_group: generated.age_group || ageGroup,
              analogy: generated.analogy,
              explanation: generated.explanation,
              when_to_use: generated.when_to_use || 'When introducing this concept'
            })

          if (error) throw error

          console.log(`  ✅ Saved: "${generated.analogy.substring(0, 60)}..."`)
          success++

          // Checkpoint every 50 items
          if (itemIndex % 50 === 0) {
            const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
            const itemsRemaining = totalItems - itemIndex
            const avgTimePerItem = (Date.now() - startTime) / itemIndex
            const remaining = ((itemsRemaining * avgTimePerItem) / 1000 / 60).toFixed(1)

            console.log(`\n📊 Checkpoint: ${success} success, ${errors} errors`)
            console.log(`   Progress: ${itemIndex}/${totalItems} (${((itemIndex/totalItems)*100).toFixed(1)}%)`)
            console.log(`   Elapsed: ${elapsed} min | Remaining: ~${remaining} min`)
            console.log(`   Cost so far: $${(success * 0.001).toFixed(3)}`)
          }

          // Delay between requests
          await new Promise(resolve => setTimeout(resolve, DELAY_MS))

        } catch (error) {
          console.error(`  ❌ Error: ${error.message}`)
          errors++
          console.error(`     Failed item: ${skill.name} | ${skill.subject} | ${ageGroup}`)
        }
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 SUBJECT ANALOGIES SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate analogies seeded!\n`)
}

// Run the seeder
seedSubjectAnalogies().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
