// Generate Typing Content for ALL 6 Phases
// Phase 1: Rule Teaching Scripts
// Phase 2: Demo Problems
// Phase 3: Guided Practice
// Phase 4: Practice Problems (additional to fill gaps)
// Phase 5: Weekly Quizzes
// Phase 7: Monthly Reviews

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Finger assignments
const fingerMap = {
  'a': 'left pinky', 'q': 'left pinky', 'z': 'left pinky', '1': 'left pinky',
  's': 'left ring', 'w': 'left ring', 'x': 'left ring', '2': 'left ring',
  'd': 'left middle', 'e': 'left middle', 'c': 'left middle', '3': 'left middle',
  'f': 'left index', 'r': 'left index', 'v': 'left index', '4': 'left index',
  'g': 'left index', 't': 'left index', 'b': 'left index', '5': 'left index',
  'h': 'right index', 'y': 'right index', 'n': 'right index', '6': 'right index',
  'j': 'right index', 'u': 'right index', 'm': 'right index', '7': 'right index',
  'k': 'right middle', 'i': 'right middle', ',': 'right middle', '8': 'right middle',
  'l': 'right ring', 'o': 'right ring', '.': 'right ring', '9': 'right ring',
  ';': 'right pinky', 'p': 'right pinky', '/': 'right pinky', '0': 'right pinky',
  ' ': 'thumb'
}

const homeRow = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']
const topRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const bottomRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

// Typing rules by grade
const typingRules = [
  // Grade K
  { rule_id: 'TYPE-R-FINDLETTERS', grade: 0, name: 'Finding Letters', desc: 'Find and press individual letters on the keyboard.' },
  { rule_id: 'TYPE-R-SPACEBAR', grade: 0, name: 'Spacebar', desc: 'Use your thumb to press the spacebar between words.' },
  { rule_id: 'TYPE-R-ENTER', grade: 0, name: 'Enter Key', desc: 'Press Enter with your right pinky to start a new line.' },

  // Grade 1
  { rule_id: 'TYPE-R-HOMEROW', grade: 1, name: 'Home Row Position', desc: 'Keep your fingers on A-S-D-F and J-K-L-; at rest.' },
  { rule_id: 'TYPE-R-LEFTHAND', grade: 1, name: 'Left Hand Keys', desc: 'Your left hand covers A, S, D, F and nearby keys.' },
  { rule_id: 'TYPE-R-RIGHTHAND', grade: 1, name: 'Right Hand Keys', desc: 'Your right hand covers J, K, L, ; and nearby keys.' },

  // Grade 2
  { rule_id: 'TYPE-R-TOPROW', grade: 2, name: 'Top Row Reach', desc: 'Reach up from home row to type Q-W-E-R-T-Y-U-I-O-P.' },
  { rule_id: 'TYPE-R-BOTTOMROW', grade: 2, name: 'Bottom Row Reach', desc: 'Reach down from home row to type Z-X-C-V-B-N-M.' },
  { rule_id: 'TYPE-R-SHIFT', grade: 2, name: 'Shift for Capitals', desc: 'Hold Shift with opposite hand pinky to make capital letters.' },

  // Grade 3
  { rule_id: 'TYPE-R-NUMBERS', grade: 3, name: 'Number Row', desc: 'Reach up to type numbers 1-2-3-4-5-6-7-8-9-0.' },
  { rule_id: 'TYPE-R-PUNCTUATION', grade: 3, name: 'Basic Punctuation', desc: 'Use period, comma, and question mark at sentence ends.' },

  // Grade 4
  { rule_id: 'TYPE-R-SPEED', grade: 4, name: 'Speed Building', desc: 'Practice typing faster while maintaining accuracy.' },
  { rule_id: 'TYPE-R-RHYTHM', grade: 4, name: 'Typing Rhythm', desc: 'Develop a steady typing rhythm without pausing.' },

  // Grade 5
  { rule_id: 'TYPE-R-ACCURACY', grade: 5, name: 'Accuracy Focus', desc: 'Prioritize correct keystrokes over speed.' },
  { rule_id: 'TYPE-R-FLUENCY', grade: 5, name: 'Typing Fluency', desc: 'Type smoothly without looking at the keyboard.' },

  // Grade 6
  { rule_id: 'TYPE-R-PROFESSIONAL', grade: 6, name: 'Professional Typing', desc: 'Type documents with proper formatting and speed.' },
  { rule_id: 'TYPE-R-SYMBOLS', grade: 6, name: 'Special Symbols', desc: 'Type symbols like @, #, $, %, and &.' },

  // Grade 7
  { rule_id: 'TYPE-R-ADVANCED', grade: 7, name: 'Advanced Typing', desc: 'Master all keys with 60+ WPM goal.' },
  { rule_id: 'TYPE-R-SHORTCUTS', grade: 7, name: 'Keyboard Shortcuts', desc: 'Use Ctrl+C, Ctrl+V, and other shortcuts.' }
]

// Sample sentences by grade
const gradeSentences = {
  0: ['a a a', 's s s', 'd d d', 'f f f', 'j j j', 'k k k', 'cat', 'dog', 'mom', 'dad'],
  1: ['asdf jkl;', 'fall all hall', 'dad sad add', 'ask flask', 'salad glass'],
  2: ['The cat sat.', 'I can run fast.', 'My dog is big.', 'We like to play.', 'She has a hat.'],
  3: ['The quick brown fox jumps.', 'Type 123 numbers today.', 'Practice makes perfect!', 'Can you type fast?'],
  4: ['Speed and accuracy matter most.', 'Keep your fingers on home row.', 'Practice typing every day.'],
  5: ['Professional typists maintain steady rhythm.', 'Fluent typing requires daily practice.', 'Accuracy improves with concentration.'],
  6: ['Email: user@example.com costs $50.', 'The meeting is at 3:30 PM today.', 'Document formatting requires attention.'],
  7: ['Advanced typists exceed 60 words per minute consistently.', 'Keyboard shortcuts: Ctrl+C (copy), Ctrl+V (paste).']
}

// Generate keyboard visual data
function keyboardVisual(keys, target, finger) {
  return {
    type: 'keyboard',
    data: {
      highlight_keys: keys,
      target_key: target,
      finger_to_use: finger,
      home_row: true,
      finger_labels: true
    }
  }
}

// PHASE 1: Rule Teaching Scripts
function generateRuleTeachingScripts() {
  return typingRules.map(rule => ({
    rule_id: rule.rule_id,
    rule_name: rule.name,
    subject: 'typing',
    grade: rule.grade,
    standard: `ISTE.TYPE.G${rule.grade}`,
    teaching_script: {
      intro: `Today we learn: ${rule.name}!`,
      steps: [
        {
          step: 1,
          text: rule.desc,
          visual: keyboardVisual(homeRow, homeRow[0], 'left pinky'),
          voice_text: rule.desc,
          duration: 5000
        },
        {
          step: 2,
          text: 'Watch me demonstrate.',
          visual: keyboardVisual(homeRow, homeRow[0], 'all fingers'),
          voice_text: 'Now watch how I do it.',
          duration: 4000
        }
      ]
    },
    rule_card: {
      title: rule.name,
      rule_text: rule.desc,
      examples: gradeSentences[rule.grade]?.slice(0, 2) || [],
      memory_tip: 'Practice every day!'
    }
  }))
}

// PHASE 2: Demo Problems
function generateDemoProblems() {
  const demos = []
  let demoNum = 1

  typingRules.forEach(rule => {
    const sentences = gradeSentences[rule.grade] || ['asdf jkl;']

    sentences.slice(0, 3).forEach((sentence, idx) => {
      demos.push({
        demo_id: `DEMO-${rule.rule_id}-${String(demoNum++).padStart(3, '0')}`,
        rule_id: rule.rule_id,
        subject: 'typing',
        grade: rule.grade,
        standard: `ISTE.TYPE.G${rule.grade}`,
        problem: `Type: ${sentence}`,
        answer: sentence,
        walkthrough: {
          steps: sentence.split('').slice(0, 5).map((char, i) => ({
            step: i + 1,
            action: char === ' ' ? 'Press spacebar' : `Press ${char.toUpperCase()}`,
            visual: keyboardVisual([char.toLowerCase()], char.toLowerCase(), fingerMap[char.toLowerCase()] || 'finger'),
            voice_text: char === ' ' ? 'Space' : `Type ${char.toUpperCase()}`
          }))
        }
      })
    })
  })

  return demos
}

// PHASE 3: Guided Practice
function generateGuidedPractice() {
  const guided = []
  let guidedNum = 1

  typingRules.forEach(rule => {
    const sentences = gradeSentences[rule.grade] || ['asdf jkl;']

    sentences.forEach(sentence => {
      for (let i = 0; i < 3; i++) {
        guided.push({
          guided_id: `GUIDED-${rule.rule_id}-${String(guidedNum++).padStart(4, '0')}`,
          rule_id: rule.rule_id,
          subject: 'typing',
          grade: rule.grade,
          standard: `ISTE.TYPE.G${rule.grade}`,
          problem: `Type: ${sentence}`,
          answer: sentence,
          hints: [
            'Keep your fingers on the home row.',
            `Use your ${fingerMap[sentence[0]?.toLowerCase()] || 'finger'} for the first letter.`,
            'Type slowly and accurately.'
          ],
          solution: {
            steps: ['Position fingers on home row', 'Type each letter carefully', 'Check your work']
          },
          encouragement: 'Great typing! Keep practicing!'
        })
      }
    })
  })

  return guided
}

// PHASE 4: Additional Practice Problems
function generateAdditionalPractice() {
  const items = []
  let itemNum = 1

  // Generate more practice per grade to fill gaps
  const targets = { 0: 500, 1: 500, 2: 500, 3: 500, 4: 500, 5: 300, 6: 300, 7: 200 }

  for (let grade = 0; grade <= 7; grade++) {
    const target = targets[grade]
    const sentences = gradeSentences[grade] || ['asdf jkl;']
    const rules = typingRules.filter(r => r.grade === grade)

    for (let i = 0; i < target; i++) {
      const sentence = sentences[i % sentences.length]
      const rule = rules[i % rules.length] || rules[0]
      const firstChar = sentence[0]?.toLowerCase() || 'a'

      items.push({
        id: `TYPE-G${grade}-PRAC-${String(itemNum++).padStart(5, '0')}`,
        subject: 'typing',
        grade,
        skill: rule?.name || 'Typing Practice',
        rule_id: rule?.rule_id || `TYPE-R-G${grade}`,
        standard: `ISTE.TYPE.G${grade}`,
        question: `Type: ${sentence}`,
        answer: sentence,
        options: null,
        tier1: {
          teach: `Type each character one at a time. Start with ${firstChar.toUpperCase()}.`,
          steps: [{
            step: 1,
            visual: keyboardVisual([firstChar], firstChar, fingerMap[firstChar] || 'finger'),
            voice_text: `Start with ${firstChar.toUpperCase()}.`,
            duration: 3000
          }]
        },
        tier2: {
          teach: `Just type: ${sentence}`,
          steps: [{
            step: 1,
            visual: keyboardVisual([firstChar], firstChar, fingerMap[firstChar] || 'finger'),
            voice_text: sentence,
            duration: 3000
          }]
        },
        visual_type: 'keyboard',
        visual_data: keyboardVisual([firstChar], firstChar, fingerMap[firstChar] || 'finger').data
      })
    }
  }

  return items
}

// PHASE 5: Weekly Quizzes
function generateWeeklyQuizzes() {
  const quizzes = []
  let quizNum = 1

  // Create 2-3 quizzes per grade
  for (let grade = 0; grade <= 7; grade++) {
    const gradeRules = typingRules.filter(r => r.grade === grade)
    const sentences = gradeSentences[grade] || ['asdf jkl;']

    for (let w = 0; w < 3; w++) {
      const questions = sentences.slice(0, 5).map((sentence, idx) => ({
        q_num: idx + 1,
        rule_id: gradeRules[idx % gradeRules.length]?.rule_id || `TYPE-R-G${grade}`,
        question: `Type: ${sentence}`,
        answer: sentence,
        options: null, // Typing is open response
        explanation: 'Check each character matches exactly.'
      }))

      quizzes.push({
        quiz_id: `QUIZ-TYPE-G${grade}-W${String(quizNum++).padStart(2, '0')}`,
        subject: 'typing',
        grade,
        week: w + 1,
        rules_covered: gradeRules.map(r => r.rule_id),
        questions,
        pass_threshold: 80,
        reward_coins: 25
      })
    }
  }

  return quizzes
}

// PHASE 7: Monthly Reviews
function generateMonthlyReviews() {
  const reviews = []

  for (let grade = 0; grade <= 7; grade++) {
    const gradeRules = typingRules.filter(r => r.grade === grade)
    const sentences = gradeSentences[grade] || ['asdf jkl;']

    // 2 monthly reviews per grade
    for (let m = 0; m < 2; m++) {
      const questions = []

      // 10 questions per review
      for (let q = 0; q < 10; q++) {
        const sentence = sentences[q % sentences.length]
        questions.push({
          q_num: q + 1,
          rule_id: gradeRules[q % gradeRules.length]?.rule_id || `TYPE-R-G${grade}`,
          question: `Type: ${sentence}`,
          answer: sentence,
          explanation: 'Practice makes perfect!'
        })
      }

      reviews.push({
        review_id: `REVIEW-TYPE-G${grade}-M${String(m + 1).padStart(2, '0')}`,
        subject: 'typing',
        grade,
        month: m + 1,
        rules_covered: gradeRules.map(r => r.rule_id),
        questions,
        time_limit: 30,
        pass_threshold: 80,
        reward_coins: 50
      })
    }
  }

  return reviews
}

// Upload helper
async function uploadBatch(table, items, conflictCol, batchSize = 500) {
  console.log(`\nUploading ${items.length} items to ${table}...`)
  let uploaded = 0

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const { error } = await supabase.from(table).upsert(batch, { onConflict: conflictCol })

    if (error) {
      console.error(`  Error:`, error.message)
    } else {
      uploaded += batch.length
      process.stdout.write(`  Progress: ${uploaded}/${items.length}\r`)
    }
  }

  console.log(`  Done: ${uploaded} uploaded`)
  return uploaded
}

// Main
async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('GENERATING TYPING 6-PHASE CONTENT')
  console.log('='.repeat(60))

  // Generate all phases
  console.log('\n--- Generating content ---')

  const ruleTeaching = generateRuleTeachingScripts()
  console.log(`Phase 1 (Rule Teaching): ${ruleTeaching.length} rules`)

  const demoProblems = generateDemoProblems()
  console.log(`Phase 2 (Demo Problems): ${demoProblems.length} demos`)

  const guidedPractice = generateGuidedPractice()
  console.log(`Phase 3 (Guided Practice): ${guidedPractice.length} items`)

  const practiceProblems = generateAdditionalPractice()
  console.log(`Phase 4 (Practice Problems): ${practiceProblems.length} items`)

  const weeklyQuizzes = generateWeeklyQuizzes()
  console.log(`Phase 5 (Weekly Quizzes): ${weeklyQuizzes.length} quizzes`)

  const monthlyReviews = generateMonthlyReviews()
  console.log(`Phase 7 (Monthly Reviews): ${monthlyReviews.length} reviews`)

  // Upload all
  console.log('\n--- Uploading to Supabase ---')

  await uploadBatch('rule_teaching_scripts', ruleTeaching, 'rule_id')
  await uploadBatch('demo_problems', demoProblems, 'demo_id')
  await uploadBatch('guided_practice', guidedPractice, 'guided_id')
  await uploadBatch('practice_problems', practiceProblems, 'id')
  await uploadBatch('weekly_quizzes', weeklyQuizzes, 'quiz_id')
  await uploadBatch('monthly_reviews', monthlyReviews, 'review_id')

  // Verify
  console.log('\n--- Verifying Typing counts ---')
  const tables = ['rule_teaching_scripts', 'demo_problems', 'guided_practice', 'practice_problems', 'weekly_quizzes', 'monthly_reviews']

  for (const table of tables) {
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'typing')
    console.log(`  ${table} (typing): ${count}`)
  }

  console.log('\n' + '='.repeat(60))
  console.log('TYPING GENERATION COMPLETE')
  console.log('='.repeat(60))
}

main().catch(console.error)
