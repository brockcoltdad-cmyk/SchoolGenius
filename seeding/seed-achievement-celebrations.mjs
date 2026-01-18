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

function getAgeGroupCelebrationStyle(ageGroup) {
  const styles = {
    k2: { tone: 'SUPER excited, simple words', emojis: 'LOTS of emojis 🎉🌟⭐💪', example: '"WOW! You did your first lesson! You\'re SO smart! 🎉⭐ Amazing job, friend! 💪"' },
    grades35: { tone: 'Very excited, encouraging', emojis: 'regular emojis 🎯🚀💡', example: '"ONE WHOLE WEEK! You\'re building an awesome learning habit! 🚀 7 days in a row - great dedication! 💡"' },
    grades68: { tone: 'Excited but mature, motivating', emojis: 'selective emojis 💪✓🔥', example: '"7-day streak! You\'re demonstrating real commitment to your learning! 💪 That\'s solid discipline! ✓"' },
    grades912: { tone: 'Professional enthusiasm, focused', emojis: 'minimal emojis ✓📊💪', example: '"7-day streak achieved. Your consistency demonstrates strong self-discipline. ✓ Well done. 📊"' }
  }
  return styles[ageGroup]
}

async function seedAchievementCelebrations() {
  console.log('🚀 ACHIEVEMENT CELEBRATIONS SEEDER')
  console.log('='.repeat(80))
  console.log('Generating 168 age-appropriate celebration messages\n')

  const achievements = []

  // First lesson: 5 variations × 4 ages = 20
  for (let i = 1; i <= 5; i++) {
    achievements.push({ type: 'first_lesson', milestone: 1, subject: null, variations: i })
  }

  // Streak milestones: 3 variations each × 4 milestones × 4 ages = 48
  const streaks = [3, 7, 14, 30]
  for (const streak of streaks) {
    for (let i = 1; i <= 3; i++) {
      achievements.push({ type: 'streak', milestone: streak, subject: null, variations: i })
    }
  }

  // Coin milestones: 2 variations × 5 milestones × 4 ages = 40
  const coinMilestones = [100, 500, 1000, 5000, 10000]
  for (const coins of coinMilestones) {
    for (let i = 1; i <= 2; i++) {
      achievements.push({ type: 'coins', milestone: coins, subject: null, variations: i })
    }
  }

  // Skill mastery: 3 variations × 5 subjects × 4 ages = 60
  const subjects = ['Math', 'Reading', 'Spelling', 'Coding', 'Typing']
  for (const subject of subjects) {
    for (let i = 1; i <= 3; i++) {
      achievements.push({ type: 'mastery', milestone: null, subject, variations: i })
    }
  }

  const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']
  const totalItems = achievements.length * ageGroups.length

  console.log(`Total to generate: ${totalItems} celebrations\n`)

  let success = 0
  let errors = 0
  const startTime = Date.now()
  let itemIndex = 0

  for (const achievement of achievements) {
    for (const ageGroup of ageGroups) {
      itemIndex++

      try {
        const style = getAgeGroupCelebrationStyle(ageGroup)
        const descriptor = achievement.subject ? achievement.subject : achievement.milestone

        console.log(`\n[${itemIndex}/${totalItems}] ${achievement.type} | ${descriptor} | ${ageGroup}`)

        const prompt = `Create a celebration message for:
Achievement: ${achievement.type}
${achievement.milestone ? `Milestone: ${achievement.milestone}` : ''}
${achievement.subject ? `Subject: ${achievement.subject}` : ''}
Age Group: ${ageGroup}

Make it:
1. EXCITING but genuine (not fake enthusiasm)
2. Recognizes the specific effort
3. Motivates them to keep going
4. 15-25 words for main message
5. 10-15 words for secondary message (optional)
6. AGE-APPROPRIATE for ${ageGroup}:
   - Tone: ${style.tone}
   - Use: ${style.emojis}
   - Example style: ${style.example}

Return ONLY valid JSON (no markdown):
{
  "achievement_type": "${achievement.type}",
  "milestone_value": ${achievement.milestone || 'null'},
  "subject": ${achievement.subject ? `"${achievement.subject}"` : 'null'},
  "age_group": "${ageGroup}",
  "main_message": "Your exciting main message here",
  "secondary_message": "Optional secondary message",
  "excitement_level": "high"
}`

        const generated = await callGrok(prompt)

        const { error } = await supabase
          .from('achievement_celebrations')
          .insert({
            achievement_type: generated.achievement_type,
            milestone_value: generated.milestone_value,
            subject: generated.subject,
            age_group: generated.age_group,
            main_message: generated.main_message,
            secondary_message: generated.secondary_message,
            excitement_level: generated.excitement_level || 'high'
          })

        if (error) throw error

        console.log(`  ✅ "${generated.main_message}"`)
        success++

        if (itemIndex % 20 === 0) {
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

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 ACHIEVEMENT CELEBRATIONS SEEDING COMPLETE!')
  console.log('='.repeat(80))
  console.log(`✅ Success: ${success}/${totalItems}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
  console.log(`\n✨ ${success} age-appropriate celebrations seeded!\n`)
}

seedAchievementCelebrations().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
