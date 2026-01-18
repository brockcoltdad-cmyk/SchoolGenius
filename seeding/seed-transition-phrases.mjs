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

  const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)\n?```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content

  return JSON.parse(jsonString)
}

function getAgeGroupStyle(ageGroup) {
  const styles = {
    k2: { tone: 'Super excited, simple words', emojis: 'emojis 🎉⭐', example: '"Great job! Now let\'s see it in action! Ready? 🎉"' },
    grades35: { tone: 'Friendly, encouraging', emojis: 'regular emojis 🎯💡', example: '"Awesome! Now let me show you how this works with a real problem! 💡"' },
    grades68: { tone: 'Mature, motivating', emojis: 'selective emojis 💪✓', example: '"Solid! Let\'s see this concept in action with some practice. 💪"' },
    grades912: { tone: 'Professional, focused', emojis: 'minimal emojis ✓📊', example: '"Well done. Let\'s apply this concept to real problems. ✓"' }
  }
  return styles[ageGroup]
}

async function seedTransitionPhrases() {
  console.log('🚀 TRANSITION PHRASES SEEDER')
  console.log('='.repeat(80))
  console.log('Generating 300 age-appropriate transition phrases\n')

  const transitions = [
    { from: 'rules', to: 'demo', variations: 5 },
    { from: 'demo', to: 'practice', variations: 5 },
    { from: 'practice', to: 'quiz', variations: 5 }
  ]

  const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let totalItems = transitions.length * 5 * subjects.length * ageGroups.length

  console.log(`Total to generate: ${totalItems} transitions\n`)

  let itemIndex = 0

  for (const transition of transitions) {
    for (let v = 1; v <= transition.variations; v++) {
      for (const subject of subjects) {
        for (const ageGroup of ageGroups) {
          itemIndex++

          try {
            const style = getAgeGroupStyle(ageGroup)

            console.log(`\n[${itemIndex}/${totalItems}] ${transition.from} → ${transition.to} | ${subject} | ${ageGroup} | #${v}`)

            const prompt = `Generate a smooth transition phrase:
From: ${transition.from}
To: ${transition.to}
Subject: ${subject}
Age Group: ${ageGroup}

Make it:
1. Enthusiastic but natural (not over-the-top)
2. Creates anticipation for next phase
3. Acknowledges progress so far
4. 10-15 words max
5. AGE-APPROPRIATE for ${ageGroup}:
   - Tone: ${style.tone}
   - Use: ${style.emojis}
   - Example style: ${style.example}

Make this DIFFERENT from other variations (this is variation #${v}).

Return ONLY valid JSON (no markdown):
{
  "from_phase": "${transition.from}",
  "to_phase": "${transition.to}",
  "subject": "${subject}",
  "age_group": "${ageGroup}",
  "phrase": "Your transition phrase here",
  "enthusiasm_level": "medium"
}`

            const generated = await callGrok(prompt)

            const { error } = await supabase
              .from('transition_phrases')
              .insert({
                from_phase: generated.from_phase,
                to_phase: generated.to_phase,
                subject: generated.subject,
                age_group: generated.age_group,
                phrase: generated.phrase,
                enthusiasm_level: generated.enthusiasm_level || 'medium'
              })

            if (error) throw error

            console.log(`  ✅ "${generated.phrase}"`)
            success++

            if (itemIndex % 30 === 0) {
              const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
              console.log(`\n📊 Progress: ${itemIndex}/${totalItems} | ${success} success, ${errors} errors | ${elapsed} min`)
            }

            await new Promise(resolve => setTimeout(resolve, DELAY_MS))

          } catch (error) {
            console.error(`  ❌ Error: ${error.message}`)
            errors++
          }
        }
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 TRANSITION PHRASES SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate transitions seeded!\n`)
}

seedTransitionPhrases().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
