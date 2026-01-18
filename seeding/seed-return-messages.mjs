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

async function seedReturnMessages() {
  console.log('🚀 RETURN MESSAGES SEEDER')
  console.log('='.repeat(80))
  console.log('Generating 80 age-appropriate welcome back messages\n')

  const returnScenarios = [
    { scenario: '1 day away', daysMin: 1, daysMax: 1, tone: 'welcoming', variations: 4 },
    { scenario: '3 days away', daysMin: 2, daysMax: 3, tone: 'encouraging', variations: 4 },
    { scenario: '1 week away', daysMin: 4, daysMax: 7, tone: 'warm', variations: 4 },
    { scenario: '1 month+ away', daysMin: 8, daysMax: null, tone: 'gentle', variations: 4 },
    { scenario: 'first time', daysMin: 0, daysMax: 0, tone: 'excited', variations: 4 }
  ]

  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let totalItems = 0
  for (const scenario of returnScenarios) {
    totalItems += scenario.variations * ageGroups.length
  }

  console.log(`Total to generate: ${totalItems} return messages\n`)

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let itemIndex = 0

  for (const scenario of returnScenarios) {
    for (let v = 1; v <= scenario.variations; v++) {
      for (const ageGroup of ageGroups) {
        itemIndex++

        try {
          console.log(`\n[${itemIndex}/${totalItems}] ${scenario.scenario} | ${ageGroup} | #${v}`)

          const prompt = `Create a "welcome back" message for a student:
Scenario: ${scenario.scenario}
Time Away: ${scenario.daysMin}${scenario.daysMax ? `-${scenario.daysMax}` : '+'} days
Tone: ${scenario.tone}
Age Group: ${ageGroup}

Make it:
1. Warm and welcoming (not guilt-tripping!)
2. Acknowledges their return positively
3. Gentle encouragement to continue
4. 12-20 words max
5. Age-appropriate for ${ageGroup}

Age-appropriate style:
- k2: Super friendly, excited to see them 🌟
- grades35: Warm, glad they're back 💡
- grades68: Cool, no pressure 💪
- grades912: Professional, supportive ✓

Include a suggestion like "Ready to continue?" or "Pick up where you left off?"

Make this DIFFERENT from other variations (${v} of ${scenario.variations}).

Return ONLY valid JSON (no markdown):
{
  "days_away_min": ${scenario.daysMin},
  "days_away_max": ${scenario.daysMax || 'null'},
  "age_group": "${ageGroup}",
  "message": "Your welcome back message here",
  "action_suggestion": "Your action suggestion here",
  "tone": "${scenario.tone}"
}`

          const generated = await callGrok(prompt)

          const { error } = await supabase
            .from('return_messages')
            .insert({
              days_away_min: generated.days_away_min,
              days_away_max: generated.days_away_max,
              age_group: generated.age_group,
              message: generated.message,
              action_suggestion: generated.action_suggestion,
              tone: generated.tone
            })

          if (error) throw error

          console.log(`  ✅ "${generated.message}"`)
          success++

          await new Promise(resolve => setTimeout(resolve, DELAY_MS))

        } catch (error) {
          console.error(`  ❌ Error: ${error.message}`)
          errors++
        }
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 RETURN MESSAGES SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate return messages seeded!\n`)
}

seedReturnMessages().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
