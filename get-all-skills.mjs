// Get all unique skills in the database
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('\n📊 ALL UNIQUE SKILLS IN DATABASE\n')
console.log('='.repeat(70))

// Get all unique skill + grade combinations
const { data, error } = await supabase
  .from('practice_problems')
  .select('skill, grade, subject')

if (error) {
  console.log('Error:', error.message)
  process.exit(1)
}

// Count by skill and grade
const skillCounts = {}
data.forEach(item => {
  const key = `Grade ${item.grade} | ${item.skill}`
  skillCounts[key] = (skillCounts[key] || 0) + 1
})

// Sort by grade then skill
const sorted = Object.entries(skillCounts).sort((a, b) => {
  const [keyA] = a
  const [keyB] = b
  return keyA.localeCompare(keyB)
})

console.log('\nSKILL | COUNT')
console.log('-'.repeat(70))

let currentGrade = null
for (const [key, count] of sorted) {
  const grade = key.split(' | ')[0]
  if (grade !== currentGrade) {
    console.log(`\n${grade}:`)
    currentGrade = grade
  }
  const skill = key.split(' | ')[1]
  console.log(`  "${skill}": ${count} items`)
}

console.log('\n' + '='.repeat(70))
console.log(`Total unique skills: ${sorted.length}`)
console.log(`Total items: ${data.length}`)
