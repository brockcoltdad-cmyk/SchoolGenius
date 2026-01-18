import { createClient } from '@supabase/supabase-js'

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

function getAgeGroupPromptGuidelines(ageGroup) {
  const guidelines = {
    k2: {
      description: 'K-2 (Ages 5-8)',
      tone: 'SUPER simple words (big, small, try, help), Very excited, warm tone',
      emojis: 'LOTS of emojis 🎉⭐💪',
      complexity: 'One concept at a time',
      example: '"I hear you! Sometimes this is tricky! 😊 Let\'s try together! Want me to show you? You can do it! 💪"'
    },
    grades35: {
      description: '3-5 (Ages 8-11)',
      tone: 'Friendly teacher, building confidence, Clear, richer vocabulary',
      emojis: 'Regular emojis 🎯💡🚀',
      complexity: 'Multi-step thinking',
      example: '"I understand - this concept can be challenging! 🤔 Let\'s break it down. Can you try the first part? I\'ll help you! 💡"'
    },
    grades68: {
      description: '6-8 (Ages 11-14)',
      tone: 'Mature, respectful (NOT baby talk!), Peer/coach tone',
      emojis: 'Selective emojis 💪✓🔍',
      complexity: 'Multi-layered concepts',
      example: '"Let\'s review this together! 🔍 Sometimes a different angle helps. What part is confusing? I can explain another way! 🔄"'
    },
    grades912: {
      description: '9-12 (Ages 14-18)',
      tone: 'Professional, college prep, Advanced academic language',
      emojis: 'Minimal emojis ✓💪📊',
      complexity: 'Full concepts, critical thinking',
      example: '"Let\'s analyze where the confusion is. 🔬 Would a different explanation help? I can break down the concept in detail! 📚"'
    }
  }
  return guidelines[ageGroup]
}

async function seedKidStuckResponses() {
  console.log('🚀 KID STUCK RESPONSES SEEDER')
  console.log('=' .repeat(80))
  console.log('Generating 340 age-appropriate responses (85 base × 4 age groups)\n')

  const questionTypes = [
    { type: 'dont_get_it', question: 'I don\'t get it', variations: 4 },
    { type: 'this_is_hard', question: 'This is hard', variations: 4 },
    { type: 'help', question: 'Help!', variations: 3 },
    { type: 'confused', question: 'I\'m confused', variations: 3 },
    { type: 'explain_again', question: 'Can you explain again?', variations: 3 }
  ]

  const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']
  const tones = ['encouraging', 'hint', 'reframe']

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let totalItems = 0

  // Calculate total
  for (const qt of questionTypes) {
    totalItems += qt.variations * subjects.length * ageGroups.length
  }

  console.log(`Total to generate: ${totalItems} responses\n`)

  let itemIndex = 0

  for (const questionType of questionTypes) {
    for (let v = 0; v < questionType.variations; v++) {
      for (const subject of subjects) {
        for (const ageGroup of ageGroups) {
          itemIndex++

          try {
            const guidelines = getAgeGroupPromptGuidelines(ageGroup)

            console.log(`\n[${itemIndex}/${totalItems}] Generating: ${questionType.question} | ${subject} | ${ageGroup}`)

            const prompt = `A student studying ${subject} says: "${questionType.question}"
Age Group: ${ageGroup} (${guidelines.description})

Generate a helpful response from Gigi (the AI tutor) that:
1. Acknowledges their feeling ("I hear you...")
2. Offers a quick reframe or hint (NOT the answer!)
3. Encourages them to try again
4. Under 50 words
5. Warm, patient, supportive tone
6. AGE-APPROPRIATE for ${ageGroup}:
   - Tone: ${guidelines.tone}
   - Emojis: ${guidelines.emojis}
   - Complexity: ${guidelines.complexity}
   - Example style: ${guidelines.example}

Return ONLY valid JSON (no markdown):
{
  "question_type": "${questionType.type}",
  "subject": "${subject}",
  "age_group": "${ageGroup}",
  "response": "Your age-appropriate response here",
  "response_tone": "encouraging"
}`

            const generated = await callGrok(prompt)

            // Ensure all required fields are present
            if (!generated.question_type || !generated.subject || !generated.age_group || !generated.response) {
              throw new Error('Missing required fields in generated response')
            }

            // Save to database
            const { error } = await supabase
              .from('kid_stuck_responses')
              .insert({
                question_type: generated.question_type,
                subject: generated.subject,
                age_group: generated.age_group,
                response: generated.response,
                response_tone: generated.response_tone || 'encouraging'
              })

            if (error) throw error

            console.log(`  ✅ Saved: "${generated.response.substring(0, 50)}..."`)
            success++

            // Checkpoint every 20 items
            if (itemIndex % 20 === 0) {
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

            // Log failed item for manual retry
            console.error(`     Failed item: ${questionType.type} | ${subject} | ${ageGroup}`)
          }
        }
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 KID STUCK RESPONSES SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate stuck responses seeded!\n`)
}

// Run the seeder
seedKidStuckResponses().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
