// Get ALL unique skills from the database
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('\n=== GETTING ALL UNIQUE SKILLS ===\n')

  // Get all items with pagination
  let allItems = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('skill, grade')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('Error:', error.message)
      break
    }

    if (!data || data.length === 0) break

    allItems = [...allItems, ...data]
    page++
    console.log(`  Retrieved page ${page}, total so far: ${allItems.length}`)

    if (data.length < pageSize) break
  }

  console.log(`\nTotal items: ${allItems.length}`)

  // Group by grade and skill
  const byGradeAndSkill = {}

  for (const item of allItems) {
    const key = `G${item.grade}|${item.skill}`
    if (!byGradeAndSkill[key]) {
      byGradeAndSkill[key] = {
        grade: item.grade,
        skill: item.skill,
        count: 0
      }
    }
    byGradeAndSkill[key].count++
  }

  // Sort by grade then skill
  const sorted = Object.values(byGradeAndSkill).sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade
    return a.skill.localeCompare(b.skill)
  })

  // Print by grade
  console.log('\n=== KINDERGARTEN (Grade 0) ===')
  const g0 = sorted.filter(s => s.grade === 0)
  for (const s of g0) {
    console.log(`  "${s.skill}" => ${s.count} items`)
  }
  console.log(`  TOTAL K: ${g0.reduce((sum, s) => sum + s.count, 0)} items, ${g0.length} unique skills`)

  console.log('\n=== GRADE 1 ===')
  const g1 = sorted.filter(s => s.grade === 1)
  for (const s of g1) {
    console.log(`  "${s.skill}" => ${s.count} items`)
  }
  console.log(`  TOTAL G1: ${g1.reduce((sum, s) => sum + s.count, 0)} items, ${g1.length} unique skills`)

  // Check for other grades
  const otherGrades = sorted.filter(s => s.grade !== 0 && s.grade !== 1)
  if (otherGrades.length > 0) {
    console.log('\n=== OTHER GRADES ===')
    for (const s of otherGrades) {
      console.log(`  G${s.grade}: "${s.skill}" => ${s.count} items`)
    }
  }

  // Output mapping template
  console.log('\n\n=== SKILL TO ARIZONA STANDARD MAPPING ===')
  console.log('// Copy this to create the update script\n')
  console.log('const skillToStandard = {')
  console.log('  // Kindergarten')
  for (const s of g0) {
    console.log(`  '${s.skill}': 'K.XX.X.X', // ${s.count} items - NEEDS CODE`)
  }
  console.log('')
  console.log('  // Grade 1')
  for (const s of g1) {
    console.log(`  '${s.skill}': '1.XX.X.X', // ${s.count} items - NEEDS CODE`)
  }
  console.log('}')
}

main().catch(console.error)
