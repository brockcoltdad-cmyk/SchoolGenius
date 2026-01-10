import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GROK_API_KEY = process.env.GROK_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'

interface SkillDefinition {
  id: string
  subject_code: string
  skill_code: string
  skill_name: string
  skill_description: string
  min_grade: number
  max_grade: number
}

async function generateContentForSkill(skill: SkillDefinition) {
  const prompt = `You are an expert K-12 curriculum designer. Generate lesson content for:

SKILL: ${skill.skill_name}
SUBJECT: ${skill.subject_code}
DESCRIPTION: ${skill.skill_description || skill.skill_name}

Generate JSON with this structure:
{
  "rules_text": "2-3 clear paragraphs explaining the concept",
  "rules_audio_script": "A conversational script for audio narration (150-200 words)",
  "demo_problems": [{"problem": "...", "steps": ["..."], "answer": "...", "explanation": "..."}],
  "guided_practice": [{"problem": "...", "hints": ["..."], "answer": "...", "explanation": "..."}],
  "independent_practice": [{"problem": "...", "answer": "...", "difficulty": "easy|medium|hard", "wrong_answers": ["...", "...", "..."]}],
  "challenge_problems": [{"problem": "...", "answer": "...", "explanation": "..."}],
  "quiz_questions": [{"question": "...", "answer": "...", "wrong_answers": ["...", "...", "..."], "points": 10}],
  "review_questions": [{"question": "...", "answer": "...", "explanation": "..."}]
}

Return ONLY valid JSON.`

  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return { content: JSON.parse(cleaned), tokens: data.usage }
}

async function main() {
  const command = process.argv[2]

  if (command === 'list') {
    const { data: skills } = await supabase
      .from('curriculum_skills')
      .select('id, subject_code, skill_code, skill_name')
      .order('subject_code')

    console.log('\nAvailable Skills:\n')
    skills?.forEach(s => console.log(`  ${s.subject_code}/${s.skill_code} - ${s.skill_name}`))

  } else if (command === 'single') {
    const skillCode = process.argv[3]
    const subjectCode = process.argv[4]

    if (!skillCode || !subjectCode) {
      console.log('Usage: npx tsx scripts/generate-skill-content.ts single <skill_code> <subject_code>')
      return
    }

    const { data: skill } = await supabase
      .from('curriculum_skills')
      .select('*')
      .eq('skill_code', skillCode)
      .eq('subject_code', subjectCode)
      .single()

    if (!skill) {
      console.error('Skill not found:', skillCode)
      return
    }

    console.log(`Generating: ${skill.skill_name}`)
    const result = await generateContentForSkill(skill)

    await supabase.from('lesson_content').upsert({
      skill_id: skill.id,
      subject_code: skill.subject_code,
      skill_name: skill.skill_name,
      rules_text: result.content.rules_text || '',
      rules_audio_script: result.content.rules_audio_script || '',
      demo_problems: result.content.demo_problems || [],
      guided_practice: result.content.guided_practice || [],
      independent_practice: result.content.independent_practice || [],
      challenge_problems: result.content.challenge_problems || [],
      quiz_questions: result.content.quiz_questions || [],
      review_questions: result.content.review_questions || []
    }, { onConflict: 'skill_id' })

    console.log('Done!')

  } else {
    console.log(`
Usage:
  npx tsx scripts/generate-skill-content.ts list
  npx tsx scripts/generate-skill-content.ts single <skill_code> <subject_code>

Examples:
  npx tsx scripts/generate-skill-content.ts list
  npx tsx scripts/generate-skill-content.ts single phonics-short-vowels ELA
    `)
  }
}

main().catch(console.error)
