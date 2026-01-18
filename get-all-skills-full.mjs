// Get ALL unique skills from the database with proper counts
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('\n=== FULL SKILL AUDIT FOR MATH K-1 ===\n')

  // Get all items with pagination
  let allItems = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('skill, grade, standard')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('Error:', error.message)
      break
    }

    if (!data || data.length === 0) break

    allItems = [...allItems, ...data]
    page++

    if (data.length < pageSize) break
  }

  console.log(`Total items retrieved: ${allItems.length}`)

  // Group by grade and skill
  const byGradeAndSkill = {}

  for (const item of allItems) {
    const key = `G${item.grade}|${item.skill}`
    if (!byGradeAndSkill[key]) {
      byGradeAndSkill[key] = {
        grade: item.grade,
        skill: item.skill,
        count: 0,
        hasStandard: item.standard ? true : false
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
  console.log('\n--- KINDERGARTEN (Grade 0) ---')
  const g0 = sorted.filter(s => s.grade === 0)
  for (const s of g0) {
    console.log(`  "${s.skill}" => ${s.count} items, standard: ${s.hasStandard ? 'YES' : 'NO'}`)
  }
  console.log(`  TOTAL K: ${g0.reduce((sum, s) => sum + s.count, 0)} items`)

  console.log('\n--- GRADE 1 ---')
  const g1 = sorted.filter(s => s.grade === 1)
  for (const s of g1) {
    console.log(`  "${s.skill}" => ${s.count} items, standard: ${s.hasStandard ? 'YES' : 'NO'}`)
  }
  console.log(`  TOTAL G1: ${g1.reduce((sum, s) => sum + s.count, 0)} items`)

  // Check for standard field
  const withStandard = allItems.filter(i => i.standard).length
  const withoutStandard = allItems.filter(i => !i.standard).length

  console.log('\n--- STANDARD FIELD STATUS ---')
  console.log(`  With standard: ${withStandard}`)
  console.log(`  Without standard: ${withoutStandard}`)

  // Output for mapping file
  console.log('\n--- SKILLS FOR MAPPING (copy this) ---')
  console.log('const skillToStandard = {')
  console.log('  // Kindergarten')
  for (const s of g0) {
    console.log(`  '${s.skill}': 'K.XX.X.X', // ${s.count} items`)
  }
  console.log('  // Grade 1')
  for (const s of g1) {
    console.log(`  '${s.skill}': '1.XX.X.X', // ${s.count} items`)
  }
  console.log('}')
}

main().catch(console.error)
