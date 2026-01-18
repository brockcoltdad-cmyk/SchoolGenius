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

async function seedTimeGreetings() {
  console.log('🚀 TIME GREETINGS SEEDER')
  console.log('='.repeat(80))
  console.log('Generating 64 age-appropriate time-based greetings\n')

  const timeSlots = [
    { time: 'morning', energy: 'upbeat', variations: 5 },
    { time: 'afternoon', energy: 'calm', variations: 5 },
    { time: 'evening', energy: 'chill', variations: 3 },
    { time: 'weekend', energy: 'upbeat', variations: 3 }
  ]

  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let totalItems = 0
  for (const slot of timeSlots) {
    totalItems += slot.variations * ageGroups.length
  }

  console.log(`Total to generate: ${totalItems} greetings\n`)

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let itemIndex = 0

  for (const slot of timeSlots) {
    for (let v = 1; v <= slot.variations; v++) {
      for (const ageGroup of ageGroups) {
        itemIndex++

        try {
          console.log(`\n[${itemIndex}/${totalItems}] ${slot.time} | ${ageGroup} | #${v}`)

          const prompt = `Create a ${slot.time} greeting for a student:
Time of Day: ${slot.time}
Energy Level: ${slot.energy}
Age Group: ${ageGroup}

Make it:
1. Warm and welcoming
2. Appropriate for the time of day
3. Age-appropriate for ${ageGroup}
4. 8-15 words max
5. Natural and friendly (not over-the-top)

Age-appropriate style:
- k2: Super friendly, excited, simple 🌟
- grades35: Warm, encouraging 💡
- grades68: Cool, respectful 💪
- grades912: Professional, focused ✓

Make this DIFFERENT from other ${slot.time} greetings (variation #${v}).

Return ONLY valid JSON (no markdown):
{
  "time_of_day": "${slot.time}",
  "age_group": "${ageGroup}",
  "greeting": "Your greeting here",
  "energy_level": "${slot.energy}"
}`

          const generated = await callGrok(prompt)

          const { error } = await supabase
            .from('greeting_messages')
            .insert({
              time_of_day: generated.time_of_day,
              age_group: generated.age_group,
              greeting: generated.greeting,
              energy_level: generated.energy_level
            })

          if (error) throw error

          console.log(`  ✅ "${generated.greeting}"`)
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
  console.log('📊 TIME GREETINGS SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate greetings seeded!\n`)
}

seedTimeGreetings().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
