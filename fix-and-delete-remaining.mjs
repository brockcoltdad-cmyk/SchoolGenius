// Fix 600 items and delete 62 that don't fit K-1
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Skills to DELETE (not K-1 appropriate)
const toDeleteSkills = [
  'basic multiplication',
  'unit circles',
  'order of simple operations',
  'data visualization',
  'mixed operations'
]

// Everything else gets mapped
const skillMappings = {
  // Patterns - K.OA.A.3 (decomposing/composing)
  'patterns': 'K.OA.A.3',
  'simple patterns': 'K.OA.A.3',
  'basic patterns': 'K.OA.A.3',
  'object patterns': 'K.OA.A.3',
  'pattern recognition': 'K.OA.A.3',

  // Fractions - K.G.A.3 (shapes/spatial)
  'basic fractions': 'K.G.A.3',
  'basic fraction': 'K.G.A.3',
  'simple fractions': 'K.G.A.3',

  // Comparing/measurement
  'comparing weights': 'K.MD.A.2',
  'comparing objects': 'K.MD.A.2',
  'comparing to 5': 'K.CC.C.6',
  'comparing values': '1.NBT.B.3',
  'comparison': 'K.CC.C.6',
  'ordering objects': 'K.MD.A.1',

  // Shapes/geometry
  'symmetry': '1.G.A.1',
  'basic geometric understanding': 'K.G.A.1',

  // Visual/graphing
  'visual math representation': 'K.OA.A.1',
  'simple graphing': 'K.MD.B.3',

  // Everything from the FIXABLE list
  'addition within 5': 'K.OA.A.1',
  'number recognition': 'K.CC.A.3',
  'subtraction within 5': 'K.OA.A.1',
  'comparing numbers': 'K.CC.C.6',
  'shapes identification': 'K.G.A.1',
  'counting 1-10': 'K.CC.A.1',
  'counting 1-20': 'K.CC.A.1',
  'subtraction within 20': '1.OA.C.6',
  'addition within 20': '1.OA.C.6',
  'comparing lengths': '1.MD.A.1',
  'fact families': '1.OA.B.4',
  'telling time hour/half': '1.MD.B.3',
  'place value tens/ones': '1.NBT.B.2',
  'place value tens and ones': '1.NBT.B.2',
  'counting to 20': 'K.CC.A.1',
  'counting': 'K.CC.A.1',
  'telling time hour and half hour': '1.MD.B.3',
  'counting to 10': 'K.CC.A.1',
  'counting 1-5': 'K.CC.A.1',
  'shape identification': 'K.G.A.1',
  'telling time to the hour and half hour': '1.MD.B.3',
  'equal groups': 'K.OA.A.3',
  'advanced time telling': '1.MD.B.3',
  'place value': 'K.NBT.A.1',
  'understanding equals sign': '1.OA.D.7',
  'understanding equals': '1.OA.D.7',
  'number comparison': 'K.CC.C.6',
  'subtraction within 10': '1.OA.C.6',
  'comparing small numbers': 'K.CC.C.6',
  'measurement introduction': '1.MD.A.1',
  'time understanding': '1.MD.B.3',
  'one-to-one counting': 'K.CC.A.1',
  'counting 1 to 10': 'K.CC.A.1',
  'Counting to Add': 'K.OA.A.1',
  'Counting to Subtract': 'K.OA.A.1',
  'number recognition 1-10': 'K.CC.A.3',
  'counting objects': 'K.CC.A.1',
  'less than/more than': 'K.CC.C.6',
  'number line addition': 'K.OA.A.1',
  'simple addition': 'K.OA.A.1',
  'addition sequence': 'K.OA.A.1',
  'subtraction sequence': 'K.OA.A.1',
  'number line': 'K.CC.A.2',
  'advanced number comparison': 'K.CC.C.6',
  'equal quantities': 'K.OA.A.3',
  'shape patterns': 'K.G.A.1',
  'addition and subtraction': 'K.OA.A.1',
  'shapes': 'K.G.A.1',
  'addition': 'K.OA.A.1',
  'subtraction': 'K.OA.A.1',
  'addition within 10': 'K.OA.A.2',
  'ordering numbers': 'K.CC.A.2',
  'number ordering': 'K.CC.A.2',
  'counting sequence': '1.NBT.A.1',
  'subtraction facts': '1.OA.C.6',
  'equal sets': '1.OA.D.7',
  'time to quarter hour': '1.MD.B.3',
  'addition combinations': '1.OA.C.6',
  'subtracting within 10': '1.OA.C.6',
  'mixed subtraction': '1.OA.C.6',
  'addition near 10': '1.OA.C.6',
  'subtraction near 10': '1.OA.C.6',
  'subtraction counting back': '1.OA.C.5',
  'adding two-digit numbers': '1.NBT.C.4',
  'subtracting two-digit numbers': '1.NBT.C.6',
  'addition mixed strategy': '1.OA.C.6',
  'subtraction mixed strategy': '1.OA.C.6',
  'addition using ten frame': '1.OA.C.6',
  'telling half hour': '1.MD.B.3',
  'subtracting teen numbers': '1.OA.C.6',
  'adding by making tens': '1.OA.C.6',
  'adding groups of objects': '1.OA.C.6',
  'Subtracting within 10': '1.OA.C.6',
  'Half Past Time': '1.MD.B.3',
  'number relationships': '1.NBT.B.2',
  'reading half hour times': '1.MD.B.3',
  'two-digit numbers': '1.NBT.B.2',
  'time to the hour': '1.MD.B.3',
  'equals understanding': '1.OA.D.7',
  'advanced time reading': '1.MD.B.3',
  'reading whole hours': '1.MD.B.3',
  'number balance': '1.OA.D.7',
  'addition strategies': '1.OA.C.6',
  'subtraction strategies': '1.OA.C.6',
  'number composition': '1.NBT.B.2',
  'telling time to hour and half hour': '1.MD.B.3',
  'addition with regrouping': '1.NBT.C.4',
  'subtraction with borrowing': '1.NBT.C.6',
  'addition within 10': '1.OA.C.6',
  'place value to 10': '1.NBT.B.2',
  'telling time to hour': '1.MD.B.3',
  'adding with regrouping': '1.NBT.C.4',
  'addition pairs to 10': '1.OA.C.6',
  'grouping and counting': '1.NBT.A.1',
  'equality and addition': '1.OA.D.7',
  'number patterns': '1.NBT.A.1',
  'number understanding': 'K.CC.A.3',
  'visual addition': 'K.OA.A.1',
  'visual counting': 'K.CC.A.1',
  'equal/not equal': 'K.OA.A.3'
}

async function main() {
  console.log('\n=== FIXING AND DELETING REMAINING ITEMS ===\n')

  // Get all unmapped items
  const { data, error } = await supabase
    .from('practice_problems')
    .select('id, skill, grade')
    .is('standard', null)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log(`Total unmapped items: ${data.length}`)

  let fixed = 0
  let deleted = 0
  let unfixable = 0

  for (const item of data) {
    const skill = item.skill

    // Check if should delete
    if (toDeleteSkills.includes(skill)) {
      const { error: delError } = await supabase
        .from('practice_problems')
        .delete()
        .eq('id', item.id)

      if (!delError) {
        deleted++
        console.log(`  DELETED: ${item.id} (${skill})`)
      }
      continue
    }

    // Check if can fix
    const code = skillMappings[skill]
    if (code) {
      const { error: upError } = await supabase
        .from('practice_problems')
        .update({ standard: code })
        .eq('id', item.id)

      if (!upError) {
        fixed++
      }
    } else {
      unfixable++
      console.log(`  UNFIXABLE: "${skill}" - no mapping`)
    }
  }

  console.log(`\n=== COMPLETE ===`)
  console.log(`  Fixed: ${fixed}`)
  console.log(`  Deleted: ${deleted}`)
  console.log(`  Unfixable: ${unfixable}`)

  // Final verification
  const { count: withStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('standard', 'is', null)

  const { count: withoutStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('standard', null)

  const { count: total } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })

  console.log(`\n--- FINAL DATABASE STATUS ---`)
  console.log(`  Total items: ${total}`)
  console.log(`  With Arizona code: ${withStandard}`)
  console.log(`  Without Arizona code: ${withoutStandard}`)
}

main().catch(console.error)
