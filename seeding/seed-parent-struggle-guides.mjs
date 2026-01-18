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

async function seedParentStruggleGuides() {
  console.log('🚀 PARENT STRUGGLE GUIDES SEEDER')
  console.log('='.repeat(80))
  console.log('Generating 28 comprehensive parent guides\n')

  // Define struggle scenarios
  const struggles = []

  // Subject struggles: 5 subjects × 4 grade ranges = 20
  const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
  const gradeRanges = [
    { range: 'K-2', ages: '5-8' },
    { range: '3-5', ages: '8-11' },
    { range: '6-8', ages: '11-14' },
    { range: '9-12', ages: '14-18' }
  ]

  for (const subject of subjects) {
    for (const grade of gradeRanges) {
      struggles.push({
        type: 'subject',
        struggle: `My child struggles with ${subject}`,
        subject: subject,
        gradeRange: grade.range,
        ages: grade.ages
      })
    }
  }

  // Behavioral struggles: 5 types (all ages) = 5
  const behavioral = [
    { struggle: 'My child gets frustrated easily', type: 'frustrated' },
    { struggle: 'My child rushes through problems', type: 'rushes' },
    { struggle: 'My child gives up too quickly', type: 'gives_up' },
    { struggle: 'My child is unmotivated to learn', type: 'unmotivated' },
    { struggle: 'My child can\'t focus', type: 'distracted' }
  ]

  for (const b of behavioral) {
    struggles.push({
      type: 'behavioral',
      struggle: b.struggle,
      behaviorType: b.type,
      gradeRange: 'All Ages',
      ages: '5-18'
    })
  }

  // Specific issues: 3 types (all ages) = 3
  const specific = [
    { struggle: 'My child has test anxiety', type: 'test_anxiety' },
    { struggle: 'My child has focus problems', type: 'focus' },
    { struggle: 'My child lacks confidence', type: 'confidence' }
  ]

  for (const s of specific) {
    struggles.push({
      type: 'specific',
      struggle: s.struggle,
      issueType: s.type,
      gradeRange: 'All Ages',
      ages: '5-18'
    })
  }

  console.log(`Total to generate: ${struggles.length} guides\n`)

  let success = 0
  let errors = 0
  const startTime = Date.now()

  for (let i = 0; i < struggles.length; i++) {
    const struggle = struggles[i]

    try {
      console.log(`\n[${i+1}/${struggles.length}] "${struggle.struggle}" | ${struggle.gradeRange}`)

      const prompt = `A parent says: "${struggle.struggle}"
Grade Range: ${struggle.gradeRange} (Ages ${struggle.ages})
${struggle.subject ? `Subject: ${struggle.subject}` : ''}

Create a comprehensive, supportive guide with:

1. Understanding (100-150 words):
   - Why this happens at this age
   - What research/experts say
   - Normalize the struggle - make parent feel okay

2. Specific Tips (5 actionable items):
   - Concrete, practical advice
   - Things they can do TODAY
   - Both at-home and in-school strategies
   - Numbered list format

3. What's Normal (50-75 words):
   - Typical timeline for this skill/behavior
   - Developmentally appropriate expectations
   - When progress usually happens

4. When to Seek Help (50-75 words):
   - Red flags to watch for
   - When to talk to teacher
   - When to consider tutoring/professional help

5. Timeline (30-50 words):
   - How long to see improvement
   - Realistic expectations
   - Patience and persistence message

Tone: Warm, empowering, research-backed, no judgment, supportive

Return ONLY valid JSON (no markdown):
{
  "struggle_type": "${struggle.type}",
  "struggle_text": "${struggle.struggle}",
  "subject": "${struggle.subject || null}",
  "grade_range": "${struggle.gradeRange}",
  "understanding": "Your 100-150 word understanding section",
  "specific_tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "whats_normal": "Your 50-75 word whats normal section",
  "when_seek_help": "Your 50-75 word when to seek help section",
  "timeline": "Your 30-50 word timeline section"
}`

      const generated = await callGrok(prompt)

      // Validate required fields
      if (!generated.understanding || !generated.specific_tips || generated.specific_tips.length !== 5) {
        throw new Error('Missing or invalid required fields in generated guide')
      }

      // Save to database
      const { error } = await supabase
        .from('parent_struggle_guides')
        .insert({
          struggle_type: generated.struggle_type || struggle.type,
          subject: generated.subject,
          grade_range: generated.grade_range || struggle.gradeRange,
          understanding: generated.understanding,
          specific_tips: generated.specific_tips,
          whats_normal: generated.whats_normal,
          when_seek_help: generated.when_seek_help,
          timeline: generated.timeline
        })

      if (error) throw error

      console.log(`  ✅ Saved guide (${generated.understanding.split(' ').length} words)`)
      success++

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`)
      errors++
      console.error(`     Failed guide: "${struggle.struggle}"`)
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 PARENT STRUGGLE GUIDES SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${struggles.length}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} comprehensive parent guides seeded!\n`)
}

// Run the seeder
seedParentStruggleGuides().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
