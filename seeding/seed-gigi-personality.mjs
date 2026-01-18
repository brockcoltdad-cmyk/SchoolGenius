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

async function seedGigiPersonality() {
  console.log('🚀 GIGI PERSONALITY SEEDER')
  console.log('='.repeat(80))
  console.log('Generating 200 age-appropriate Gigi catchphrases\n')

  const categories = [
    { category: 'encouragement', description: 'General encouragement phrases', count: 10 },
    { category: 'mistake_reframe', description: 'Positive reframes of mistakes', count: 10 },
    { category: 'excitement', description: 'Excitement and celebration', count: 10 },
    { category: 'motivation', description: 'Motivational phrases', count: 10 },
    { category: 'growth_mindset', description: 'Growth mindset reinforcement', count: 10 }
  ]

  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

  let totalItems = 0
  for (const cat of categories) {
    totalItems += cat.count * ageGroups.length
  }

  console.log(`Total to generate: ${totalItems} catchphrases\n`)

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let itemIndex = 0

  for (const category of categories) {
    for (let i = 1; i <= category.count; i++) {
      for (const ageGroup of ageGroups) {
        itemIndex++

        try {
          console.log(`\n[${itemIndex}/${totalItems}] ${category.category} | ${ageGroup} | #${i}`)

          const whenToUseMap = {
            encouragement: 'When student needs a confidence boost or general support',
            mistake_reframe: 'When student makes a mistake - reframe it positively as learning',
            excitement: 'When celebrating progress or success',
            motivation: 'When student needs push to keep going or try harder',
            growth_mindset: 'To reinforce that learning takes practice and mistakes are valuable'
          }

          const prompt = `Create a Gigi (AI tutor) catchphrase:
Category: ${category.category}
Description: ${category.description}
Age Group: ${ageGroup}

Create a phrase that Gigi would say that:
1. Fits the category (${category.description})
2. Is memorable and reusable
3. Sounds natural (not robotic)
4. Is SHORT (5-12 words max)
5. Is age-appropriate for ${ageGroup}

Age-appropriate style:
- k2: Super simple, very excited, warm 🎉⭐
- grades35: Friendly, building confidence 🎯💡
- grades68: Mature, respectful peer 💪✓
- grades912: Professional, focused ✓📊

Examples by category:
- encouragement: "You've got this!" / "I believe in you!" / "Your effort shows!"
- mistake_reframe: "Mistakes help us learn!" / "That's how we grow!" / "Try again - you're getting closer!"
- excitement: "Amazing!" / "You did it!" / "Fantastic work!"
- motivation: "Keep going!" / "Don't give up!" / "You're almost there!"
- growth_mindset: "Practice makes progress!" / "Every try makes you stronger!" / "Learning takes time!"

Return ONLY valid JSON (no markdown):
{
  "category": "${category.category}",
  "age_group": "${ageGroup}",
  "phrase": "Your catchphrase here",
  "when_to_use": "${whenToUseMap[category.category]}",
  "tone": "supportive"
}`

          const generated = await callGrok(prompt)

          const { error } = await supabase
            .from('gigi_personality')
            .insert({
              category: generated.category,
              age_group: generated.age_group,
              phrase: generated.phrase,
              when_to_use: generated.when_to_use,
              tone: generated.tone || 'supportive'
            })

          if (error) throw error

          console.log(`  ✅ "${generated.phrase}"`)
          success++

          if (itemIndex % 25 === 0) {
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

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 GIGI PERSONALITY SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate Gigi catchphrases seeded!\n`)
}

seedGigiPersonality().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
