// Transform 45,291 backup items to 5 lesson flow tables
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'fs'

config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Load backup data
console.log('Loading backup data...')
const backupData = JSON.parse(readFileSync('./backups/gradual-release-format-items.json', 'utf8'))
console.log(`Loaded ${backupData.length} items`)

// Group by rule_id to extract unique rules
const ruleMap = new Map()
backupData.forEach(item => {
  if (!ruleMap.has(item.rule_id)) {
    ruleMap.set(item.rule_id, item)
  }
})
console.log(`Found ${ruleMap.size} unique rules`)

// Generate tier1/tier2 algorithmically based on content
function generateTiers(item) {
  const explanation = item.i_do?.explanation || item.explanation || ''
  const example = item.i_do?.example || {}

  // tier1: Standard explanation (25 words max)
  const tier1Words = explanation.split(' ').slice(0, 25).join(' ')
  const tier1 = {
    teach: tier1Words + (explanation.split(' ').length > 25 ? '...' : ''),
    steps: [
      {
        step: 1,
        visual: { type: 'text', data: { content: example.problem || item.question } },
        voice_text: tier1Words.split(' ').slice(0, 20).join(' '),
        duration: 4000
      }
    ]
  }

  // tier2: Simpler explanation (20 words max, more concrete)
  const tier2Words = explanation.split(' ').slice(0, 15).join(' ')
  const tier2 = {
    teach: tier2Words + '. Look at the example.',
    steps: [
      {
        step: 1,
        visual: { type: 'text', data: { content: example.answer || item.answer, simplified: true } },
        voice_text: 'The answer is ' + (example.answer || item.answer) + '.',
        duration: 3000
      }
    ]
  }

  return { tier1, tier2 }
}

// Transform to rule_teaching_scripts
function transformToRuleTeaching(rules) {
  const items = []
  let idx = 1

  for (const [ruleId, item] of rules) {
    const teaching = {
      rule_id: ruleId,
      rule_name: ruleId.replace(/-/g, ' ').replace(/^(MATH|READ|WRITE) R /, ''),
      subject: item.subject,
      grade: item.grade,
      standard: item.standard || `${item.subject.toUpperCase()}.G${item.grade}`,
      teaching_script: {
        intro: item.i_do?.explanation?.split('.')[0] + '.' || 'Let me teach you this rule.',
        steps: [
          {
            step: 1,
            text: item.i_do?.explanation || 'Watch carefully.',
            visual: { type: 'text', data: {} },
            voice_text: item.i_do?.explanation?.split('.').slice(0, 2).join('.') || 'Here is the rule.',
            duration: 5000
          }
        ]
      },
      rule_card: {
        title: ruleId.replace(/-/g, ' ').replace(/^(MATH|READ|WRITE) R /, ''),
        rule_text: item.i_do?.explanation?.split('.').slice(0, 2).join('.') || '',
        examples: item.i_do?.example ? [item.i_do.example.problem + ' = ' + item.i_do.example.answer] : [],
        memory_tip: 'Practice makes perfect!'
      }
    }
    items.push(teaching)
    idx++
  }

  return items
}

// Transform to demo_problems
function transformToDemoProblems(rules) {
  const items = []

  for (const [ruleId, item] of rules) {
    if (!item.i_do?.example) continue

    const demo = {
      demo_id: `DEMO-${ruleId}-001`,
      rule_id: ruleId,
      subject: item.subject,
      grade: item.grade,
      standard: item.standard || `${item.subject.toUpperCase()}.G${item.grade}`,
      problem: item.i_do.example.problem,
      answer: item.i_do.example.answer,
      walkthrough: {
        steps: item.i_do.example.solution ?
          item.i_do.example.solution.split('\n').map((s, i) => ({
            step: i + 1,
            action: s.replace(/^Step \d+:?\s*/i, ''),
            voice_text: s.replace(/^Step \d+:?\s*/i, '')
          })) :
          [{ step: 1, action: 'Solve the problem', voice_text: 'Let me show you.' }]
      }
    }
    items.push(demo)
  }

  return items
}

// Transform to guided_practice
function transformToGuidedPractice(data) {
  const items = []

  data.forEach((item, idx) => {
    if (!item.we_do) return

    const guided = {
      guided_id: `GUIDED-${item.rule_id}-${String(idx + 1).padStart(4, '0')}`,
      rule_id: item.rule_id,
      subject: item.subject,
      grade: item.grade,
      standard: item.standard || `${item.subject.toUpperCase()}.G${item.grade}`,
      problem: item.we_do.problem,
      answer: item.we_do.answer,
      hints: item.we_do.hints || ['Think about the rule.', 'Look at the example.'],
      solution: {
        steps: item.we_do.solution ?
          item.we_do.solution.split('\n').filter(s => s.trim()) :
          ['Apply the rule', 'Check your answer']
      },
      encouragement: "Great job! You're getting it!"
    }
    items.push(guided)
  })

  return items
}

// Transform to practice_problems with tier1/tier2
function transformToPracticeProblems(data) {
  const items = []

  data.forEach((item, idx) => {
    // Main check_question as practice problem
    if (item.check_question) {
      const { tier1, tier2 } = generateTiers(item)

      const practice = {
        id: `${item.subject.toUpperCase()}-G${item.grade}-${item.rule_id}-P${String(idx + 1).padStart(4, '0')}`,
        subject: item.subject,
        grade: item.grade,
        skill: item.skill || item.rule_id?.replace(/-/g, ' ').replace(/^(MATH|READ|WRITE) R /, ''),
        rule_id: item.rule_id,
        standard: item.standard || `${item.subject.toUpperCase()}.G${item.grade}`,
        question: item.check_question.question,
        answer: item.check_question.correct,
        options: item.check_question.options,
        tier1,
        tier2,
        visual_type: item.visual_type || 'text',
        visual_data: item.visual_data || {}
      }
      items.push(practice)
    }

    // Add you_do problems
    if (item.you_do && item.you_do.length > 0) {
      item.you_do.forEach((yd, ydIdx) => {
        const { tier1, tier2 } = generateTiers({ ...item, question: yd.problem, answer: yd.answer })

        const practice = {
          id: `${item.subject.toUpperCase()}-G${item.grade}-${item.rule_id}-YD${String(idx + 1).padStart(3, '0')}-${ydIdx + 1}`,
          subject: item.subject,
          grade: item.grade,
          skill: item.skill || item.rule_id?.replace(/-/g, ' ').replace(/^(MATH|READ|WRITE) R /, ''),
          rule_id: item.rule_id,
          standard: item.standard || `${item.subject.toUpperCase()}.G${item.grade}`,
          question: yd.problem,
          answer: yd.answer,
          options: null, // Open response
          tier1: {
            teach: yd.explanation || tier1.teach,
            steps: tier1.steps
          },
          tier2,
          visual_type: 'text',
          visual_data: {}
        }
        items.push(practice)
      })
    }
  })

  return items
}

// Transform to weekly_quizzes
function transformToWeeklyQuizzes(rules, data) {
  const items = []

  // Group rules by subject and grade
  const gradeRules = {}
  for (const [ruleId, item] of rules) {
    const key = `${item.subject}-${item.grade}`
    if (!gradeRules[key]) gradeRules[key] = []
    gradeRules[key].push({ ruleId, item })
  }

  // Create quizzes per grade (1 quiz per 2-3 rules)
  let quizNum = 1
  for (const [key, ruleList] of Object.entries(gradeRules)) {
    const [subject, grade] = key.split('-')

    for (let i = 0; i < ruleList.length; i += 2) {
      const rulesInQuiz = ruleList.slice(i, i + 2)
      const questions = []

      rulesInQuiz.forEach((r, idx) => {
        // Find items with this rule for quiz questions
        const ruleItems = data.filter(d => d.rule_id === r.ruleId).slice(0, 5)
        ruleItems.forEach((item, qIdx) => {
          if (item.check_question) {
            questions.push({
              q_num: questions.length + 1,
              rule_id: r.ruleId,
              question: item.check_question.question,
              answer: item.check_question.correct,
              options: item.check_question.options,
              explanation: item.check_question.explanation || 'Review the rule and try again.'
            })
          }
        })
      })

      if (questions.length > 0) {
        const quiz = {
          quiz_id: `QUIZ-${subject.toUpperCase()}-G${grade}-W${String(quizNum).padStart(2, '0')}`,
          subject,
          grade: parseInt(grade),
          week: quizNum,
          rules_covered: rulesInQuiz.map(r => r.ruleId),
          questions: questions.slice(0, 10), // Max 10 per quiz
          pass_threshold: 80,
          reward_coins: 25
        }
        items.push(quiz)
        quizNum++
      }
    }
  }

  return items
}

// Upload in batches
async function uploadBatch(table, items, batchSize = 500) {
  console.log(`\nUploading ${items.length} items to ${table}...`)
  let uploaded = 0
  let errors = 0

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    const { error } = await supabase
      .from(table)
      .upsert(batch, { onConflict: table === 'practice_problems' ? 'id' : table === 'rule_teaching_scripts' ? 'rule_id' : table === 'demo_problems' ? 'demo_id' : table === 'guided_practice' ? 'guided_id' : 'quiz_id' })

    if (error) {
      console.error(`  Batch error:`, error.message)
      errors++
    } else {
      uploaded += batch.length
      process.stdout.write(`  Progress: ${uploaded}/${items.length}\r`)
    }
  }

  console.log(`  Completed: ${uploaded} uploaded, ${errors} errors`)
  return uploaded
}

// Main execution
async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('TRANSFORMING BACKUP TO 5 LESSON FLOW TABLES')
  console.log('='.repeat(60))

  // Transform data
  console.log('\n--- Transforming data ---')

  console.log('Creating rule_teaching_scripts...')
  const ruleTeaching = transformToRuleTeaching(ruleMap)
  console.log(`  Created: ${ruleTeaching.length} rules`)

  console.log('Creating demo_problems...')
  const demoProblems = transformToDemoProblems(ruleMap)
  console.log(`  Created: ${demoProblems.length} demos`)

  console.log('Creating guided_practice...')
  const guidedPractice = transformToGuidedPractice(backupData)
  console.log(`  Created: ${guidedPractice.length} guided items`)

  console.log('Creating practice_problems with tier1/tier2...')
  const practiceProblems = transformToPracticeProblems(backupData)
  console.log(`  Created: ${practiceProblems.length} practice items`)

  console.log('Creating weekly_quizzes...')
  const weeklyQuizzes = transformToWeeklyQuizzes(ruleMap, backupData)
  console.log(`  Created: ${weeklyQuizzes.length} quizzes`)

  // Upload to database
  console.log('\n--- Uploading to Supabase ---')

  await uploadBatch('rule_teaching_scripts', ruleTeaching)
  await uploadBatch('demo_problems', demoProblems)
  await uploadBatch('guided_practice', guidedPractice)
  await uploadBatch('practice_problems', practiceProblems)
  await uploadBatch('weekly_quizzes', weeklyQuizzes)

  // Verify counts
  console.log('\n--- Verifying database counts ---')

  const tables = ['rule_teaching_scripts', 'demo_problems', 'guided_practice', 'practice_problems', 'weekly_quizzes']

  for (const table of tables) {
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    console.log(`  ${table}: ${count}`)
  }

  // Per-grade breakdown for practice_problems
  console.log('\n--- Practice Problems by Subject & Grade ---')
  for (const subject of ['math', 'reading', 'writing']) {
    const { data: grades } = await supabase
      .from('practice_problems')
      .select('grade')
      .eq('subject', subject)

    if (grades) {
      const gradeCounts = {}
      grades.forEach(g => {
        gradeCounts[g.grade] = (gradeCounts[g.grade] || 0) + 1
      })
      console.log(`  ${subject}:`, gradeCounts)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('TRANSFORMATION COMPLETE')
  console.log('='.repeat(60))
}

main().catch(console.error)
