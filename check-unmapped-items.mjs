// Check what the 662 unmapped items are
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('\n=== CHECKING UNMAPPED ITEMS ===\n')

  // Get all items without standard
  const { data, error } = await supabase
    .from('practice_problems')
    .select('id, skill, grade')
    .is('standard', null)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log(`Total unmapped items: ${data.length}`)

  // Group by skill
  const bySkill = {}
  for (const item of data) {
    const key = `G${item.grade}|${item.skill}`
    if (!bySkill[key]) {
      bySkill[key] = { grade: item.grade, skill: item.skill, count: 0, ids: [] }
    }
    bySkill[key].count++
    bySkill[key].ids.push(item.id)
  }

  // Sort by count
  const sorted = Object.values(bySkill).sort((a, b) => b.count - a.count)

  console.log('\n--- UNMAPPED SKILLS ---')
  for (const s of sorted) {
    console.log(`  G${s.grade} | "${s.skill}" => ${s.count} items`)
  }

  // Categorize: fixable vs delete
  console.log('\n\n--- RECOMMENDATION ---')

  const fixable = []
  const toDelete = []

  for (const s of sorted) {
    const skill = s.skill.toLowerCase()

    // K-1 appropriate skills that just need mapping
    if (skill.includes('counting') || skill.includes('count')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.CC.A.1' : '1.NBT.A.1' })
    } else if (skill.includes('addition') || skill.includes('adding') || skill.includes('add')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.OA.A.1' : '1.OA.C.6' })
    } else if (skill.includes('subtraction') || skill.includes('subtracting') || skill.includes('subtract')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.OA.A.1' : '1.OA.C.6' })
    } else if (skill.includes('time') || skill.includes('clock') || skill.includes('hour')) {
      fixable.push({ ...s, code: '1.MD.B.3' })
    } else if (skill.includes('equal') || skill.includes('balance')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.OA.A.3' : '1.OA.D.7' })
    } else if (skill.includes('place value') || skill.includes('tens') || skill.includes('ones')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.NBT.A.1' : '1.NBT.B.2' })
    } else if (skill.includes('shape') || skill.includes('geometry')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.G.A.1' : '1.G.A.1' })
    } else if (skill.includes('number') || skill.includes('digit')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.CC.A.3' : '1.NBT.B.2' })
    } else if (skill.includes('compare') || skill.includes('greater') || skill.includes('less')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.CC.C.6' : '1.NBT.B.3' })
    } else if (skill.includes('group') || skill.includes('sets')) {
      fixable.push({ ...s, code: s.grade === 0 ? 'K.CC.B.5' : '1.OA.D.7' })
    } else if (skill.includes('fact') || skill.includes('families')) {
      fixable.push({ ...s, code: '1.OA.B.4' })
    } else if (skill.includes('length') || skill.includes('measure')) {
      fixable.push({ ...s, code: '1.MD.A.1' })
    } else {
      // Not K-1 appropriate or too obscure
      toDelete.push(s)
    }
  }

  console.log('\nFIXABLE (will add Arizona code):')
  let fixCount = 0
  for (const s of fixable) {
    console.log(`  "${s.skill}" => ${s.code} (${s.count} items)`)
    fixCount += s.count
  }
  console.log(`  TOTAL FIXABLE: ${fixCount} items`)

  console.log('\nTO DELETE (not K-1 appropriate):')
  let deleteCount = 0
  for (const s of toDelete) {
    console.log(`  "${s.skill}" (${s.count} items)`)
    deleteCount += s.count
  }
  console.log(`  TOTAL TO DELETE: ${deleteCount} items`)

  // Save for next script
  const fs = await import('fs')
  fs.writeFileSync('unmapped-analysis.json', JSON.stringify({ fixable, toDelete }, null, 2))
  console.log('\nSaved to unmapped-analysis.json')
}

main().catch(console.error)
