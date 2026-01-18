// Fix Arizona Standards for Math K-1 items (17,772 items)
// This script maps all 378 skill variations to their correct Arizona codes
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Arizona Math Standards Reference:
// K.CC = Counting and Cardinality
// K.OA = Operations and Algebraic Thinking
// K.NBT = Number and Operations in Base Ten
// K.MD = Measurement and Data
// K.G = Geometry
// 1.OA = Operations and Algebraic Thinking
// 1.NBT = Number and Operations in Base Ten
// 1.MD = Measurement and Data
// 1.G = Geometry

// Map skills to Arizona codes by PATTERN matching (case-insensitive)
const skillPatterns = [
  // ========== KINDERGARTEN ==========

  // K.CC.A.1 - Count to 100 by ones and tens
  { pattern: /counting 1-10|counting to 10|counting to 5|basic counting|counting 20|sequential counting/i, code: 'K.CC.A.1', grade: 0 },
  { pattern: /counting 1-20|counting to 20/i, code: 'K.CC.A.1', grade: 0 },
  { pattern: /^counting$/i, code: 'K.CC.A.1', grade: 0 },

  // K.CC.A.3 - Write/identify numbers 0-20
  { pattern: /number recognition/i, code: 'K.CC.A.3', grade: 0 },
  { pattern: /number representation/i, code: 'K.CC.A.3', grade: 0 },

  // K.CC.B.4 - Count objects, one-to-one correspondence
  { pattern: /counting objects|one-to-one correspondence/i, code: 'K.CC.B.4', grade: 0 },
  { pattern: /counting and shapes/i, code: 'K.CC.B.4', grade: 0 },

  // K.CC.B.5 - Count to answer "how many?"
  { pattern: /grouping|number grouping/i, code: 'K.CC.B.5', grade: 0 },

  // K.CC.C.6 - Compare numbers (greater than, less than, equal)
  { pattern: /comparing numbers|number comparison|comparing quantities|comparing tens|advanced comparing/i, code: 'K.CC.C.6', grade: 0 },
  { pattern: /simple comparison|early comparison/i, code: 'K.CC.C.6', grade: 0 },

  // K.OA.A.1 - Represent addition and subtraction
  { pattern: /addition within 5|addition within 3|addition to 5|basic addition|simple addition|early addition/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /subtraction within 5|simple subtraction/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /addition and subtraction within 5|addition and subtraction/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /^addition$/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /^subtraction$/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /adding concrete objects|addition with objects|adding within 10/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /subtraction preparation|subtraction strategies|subtraction steps/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /addition preparation|addition strategies|addition steps|addition foundations|addition concepts/i, code: 'K.OA.A.1', grade: 0 },
  { pattern: /pre-addition|sequential addition/i, code: 'K.OA.A.1', grade: 0 },

  // K.OA.A.2 - Word problems addition/subtraction within 10
  { pattern: /addition within 10|subtraction within 10/i, code: 'K.OA.A.2', grade: 0 },
  { pattern: /story addition|addition story problems|subtraction story problems/i, code: 'K.OA.A.2', grade: 0 },
  { pattern: /addition game|addition comparison|addition composition|addition sequence/i, code: 'K.OA.A.2', grade: 0 },
  { pattern: /subtraction sequence/i, code: 'K.OA.A.2', grade: 0 },

  // K.OA.A.3 - Decompose numbers into pairs
  { pattern: /number composition|number decomposition/i, code: 'K.OA.A.3', grade: 0 },
  { pattern: /equal amounts|equal value|equal groups|equality/i, code: 'K.OA.A.3', grade: 0 },
  { pattern: /simple equality|basic equality|understanding equality/i, code: 'K.OA.A.3', grade: 0 },
  { pattern: /simple equations|basic equation understanding|equation steps/i, code: 'K.OA.A.3', grade: 0 },
  { pattern: /equal weight/i, code: 'K.OA.A.3', grade: 0 },

  // K.OA.A.5 - Fluently add/subtract within 5 (already covered above)

  // K.NBT.A.1 - Place value 11-19
  { pattern: /place value/i, code: 'K.NBT.A.1', grade: 0 },
  { pattern: /addition within 20/i, code: 'K.NBT.A.1', grade: 0 },

  // K.MD.A.1 - Describe measurable attributes
  { pattern: /measurement basics|understanding units/i, code: 'K.MD.A.1', grade: 0 },

  // K.MD.B.3 - Classify and count objects
  { pattern: /sorting|data representation/i, code: 'K.MD.B.3', grade: 0 },
  { pattern: /simple graphing/i, code: 'K.MD.B.3', grade: 0 },

  // K.G.A.1 - Describe shapes and positions
  { pattern: /shapes|shape identification|2D shapes|basic geometry|simple geometry/i, code: 'K.G.A.1', grade: 0 },
  { pattern: /position|spatial reasoning|spatial relationships|spatial understanding/i, code: 'K.G.A.1', grade: 0 },
  { pattern: /shape understanding|shape relationships|comparing shapes/i, code: 'K.G.A.1', grade: 0 },
  { pattern: /basic coordinates|coordinate plane|coordinate positioning/i, code: 'K.G.A.1', grade: 0 },

  // K.G.B.5 - Compose shapes, visual representation
  { pattern: /visual representation|array introduction/i, code: 'K.G.B.5', grade: 0 },
  { pattern: /shapes and fractions|shapes and patterns/i, code: 'K.G.B.5', grade: 0 },

  // K Patterns and Number Sense
  { pattern: /patterns|pattern recognition|simple patterns/i, code: 'K.CC.A.2', grade: 0 },
  { pattern: /number order|number ordering|ordering numbers|ordinal numbers/i, code: 'K.CC.A.2', grade: 0 },
  { pattern: /number sequence|number sequences|number sequencing/i, code: 'K.CC.A.2', grade: 0 },
  { pattern: /number line|number line concepts/i, code: 'K.CC.A.2', grade: 0 },
  { pattern: /number patterns/i, code: 'K.CC.A.2', grade: 0 },
  { pattern: /early number sense|early algebraic thinking/i, code: 'K.CC.A.2', grade: 0 },

  // K Fractions introduction (not really K standard but in data)
  { pattern: /fraction|fractions/i, code: 'K.G.A.3', grade: 0 }, // Map to shapes/spatial

  // ========== GRADE 1 ==========

  // 1.OA.A.1 - Word problems within 20
  { pattern: /addition word problems|subtraction word problems|word problem addition|word problem subtraction|simple word problems/i, code: '1.OA.A.1', grade: 1 },
  { pattern: /compare problems/i, code: '1.OA.A.1', grade: 1 },

  // 1.OA.B.3 - Properties of operations (commutative, associative)
  { pattern: /addition order|addition comparison|comparing addition|comparing subtraction/i, code: '1.OA.B.3', grade: 1 },
  { pattern: /complementary addition/i, code: '1.OA.B.3', grade: 1 },

  // 1.OA.B.4 - Subtraction as unknown-addend
  { pattern: /addition and subtraction relationship|relationship between addition and subtraction/i, code: '1.OA.B.4', grade: 1 },
  { pattern: /addition and subtraction balance|addition and subtraction equality/i, code: '1.OA.B.4', grade: 1 },
  { pattern: /^addition and subtraction$/i, code: '1.OA.B.4', grade: 1 },

  // 1.OA.C.5 - Relate counting to add/subtract
  { pattern: /adding on number line|addition on number line|addition using number line|number line addition/i, code: '1.OA.C.5', grade: 1 },
  { pattern: /subtraction on number line|subtraction using number line|number line operations/i, code: '1.OA.C.5', grade: 1 },
  { pattern: /number line addition and subtraction/i, code: '1.OA.C.5', grade: 1 },
  { pattern: /counting and recording|advanced counting/i, code: '1.OA.C.5', grade: 1 },

  // 1.OA.C.6 - Add and subtract within 20 (MAIN - lots of items)
  { pattern: /addition within 20|adding within 20|addition strategies within 20|advanced addition within 20/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /subtraction within 20|subtracting within 20|subtraction strategies within 20|advanced subtraction within 20/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /addition within 10|subtraction within 10/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /addition strategies|subtraction strategies/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /addition strategy|subtraction strategy/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /adding doubles|addition doubles|doubles addition|addition with doubles/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /subtraction near doubles/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /making ten strategy/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /adding to 10|subtracting from 10|subtract from ten|adding to 20/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /subtracting from 20|adding near 20|subtracting near 20|addition near 20|subtraction near 20/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /subtraction near ten/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /mental addition|mental subtraction|mental math/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /complex addition/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /mixed addition/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /understanding addition/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /subtraction thinking|subtraction reasoning|subtraction problem solving/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /subtraction from teens|subtraction from tens|subtraction with teens/i, code: '1.OA.C.6', grade: 1 },
  { pattern: /addition equations/i, code: '1.OA.C.6', grade: 1 },

  // 1.OA.D.7 - Meaning of equal sign
  { pattern: /understanding equality|equality understanding|equal values|equal amounts|equal relationships/i, code: '1.OA.D.7', grade: 1 },
  { pattern: /balanced equations|balancing equations|equation balance|balance equations|balance subtraction/i, code: '1.OA.D.7', grade: 1 },
  { pattern: /simple equations/i, code: '1.OA.D.7', grade: 1 },
  { pattern: /equal groups/i, code: '1.OA.D.7', grade: 1 },

  // 1.OA.D.8 - Find unknown number in equation
  { pattern: /missing addend|missing number|finding missing/i, code: '1.OA.D.8', grade: 1 },
  { pattern: /finding total/i, code: '1.OA.D.8', grade: 1 },

  // 1.OA - Fact families
  { pattern: /fact families/i, code: '1.OA.B.4', grade: 1 },

  // 1.NBT.A.1 - Count to 120
  { pattern: /skip counting/i, code: '1.NBT.A.1', grade: 1 },
  { pattern: /number ordering|ordering numbers|number sequencing|number sequences/i, code: '1.NBT.A.1', grade: 1 },
  { pattern: /number patterns|recognizing number patterns|identifying number patterns/i, code: '1.NBT.A.1', grade: 1 },
  { pattern: /number bonds/i, code: '1.NBT.A.1', grade: 1 },

  // 1.NBT.B.2 - Place value (tens and ones)
  { pattern: /place value|tens and ones|understanding tens/i, code: '1.NBT.B.2', grade: 1 },
  { pattern: /grouping by tens|object grouping|grouping numbers/i, code: '1.NBT.B.2', grade: 1 },
  { pattern: /expanded form|expanded notation|expanded place value/i, code: '1.NBT.B.2', grade: 1 },
  { pattern: /reading two-digit numbers|understanding two-digit numbers/i, code: '1.NBT.B.2', grade: 1 },
  { pattern: /composing numbers|decomposing numbers|number composition|number decomposition/i, code: '1.NBT.B.2', grade: 1 },

  // 1.NBT.B.3 - Compare two-digit numbers
  { pattern: /comparing numbers|number comparison|comparing quantities|comparing two-digit numbers/i, code: '1.NBT.B.3', grade: 1 },
  { pattern: /greater than less than/i, code: '1.NBT.B.3', grade: 1 },

  // 1.NBT.C.4 - Add within 100, add two-digit and one-digit
  { pattern: /addition with regrouping|subtraction with regrouping|subtraction with borrowing/i, code: '1.NBT.C.4', grade: 1 },
  { pattern: /addition with tens|subtraction with tens/i, code: '1.NBT.C.4', grade: 1 },
  { pattern: /addition with multiple steps|subtraction with multiple steps/i, code: '1.NBT.C.4', grade: 1 },

  // 1.NBT.C.5 - Find 10 more or 10 less
  { pattern: /adding 10|subtracting 10|adding tens|subtracting tens/i, code: '1.NBT.C.5', grade: 1 },

  // 1.MD.A.1 - Order objects by length
  { pattern: /comparing lengths|comparing object lengths|measuring and comparing|advanced length comparison/i, code: '1.MD.A.1', grade: 1 },
  { pattern: /comparing standard and non-standard lengths/i, code: '1.MD.A.1', grade: 1 },

  // 1.MD.A.2 - Express length
  { pattern: /measuring length/i, code: '1.MD.A.2', grade: 1 },

  // 1.MD.B.3 - Tell time to hour and half-hour
  { pattern: /telling time|reading analog clock|reading clock|understanding clock/i, code: '1.MD.B.3', grade: 1 },
  { pattern: /time intervals|time sequence/i, code: '1.MD.B.3', grade: 1 },
  { pattern: /drawing time on analog clock/i, code: '1.MD.B.3', grade: 1 },
  { pattern: /half-hour time|time to the quarter hour/i, code: '1.MD.B.3', grade: 1 },

  // 1.MD.C.4 - Data
  { pattern: /data interpretation|data representation|basic graphing|reading simple graphs/i, code: '1.MD.C.4', grade: 1 },
  { pattern: /basic probability/i, code: '1.MD.C.4', grade: 1 },

  // 1.G.A.1 - Shapes
  { pattern: /shape recognition|shape counting|basic shapes|2D shape recognition|sorting shapes|geometry basics/i, code: '1.G.A.1', grade: 1 },

  // 1.G.A.3 - Partition into halves, fourths
  { pattern: /fraction|fractions|understanding halves|understanding equal parts/i, code: '1.G.A.3', grade: 1 },
  { pattern: /introduction to multiplication concepts/i, code: '1.G.A.3', grade: 1 }, // Early multiplication = equal groups

  // Grade 1 even/odd
  { pattern: /even and odd|odd and even/i, code: '1.NBT.A.1', grade: 1 },
]

async function main() {
  console.log('\n=== FIXING ARIZONA STANDARDS FOR MATH K-1 ===\n')

  // Step 1: Get all items
  console.log('Step 1: Fetching all 17,772 items...')
  let allItems = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('practice_problems')
      .select('id, skill, grade')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('Error fetching:', error.message)
      break
    }

    if (!data || data.length === 0) break

    allItems = [...allItems, ...data]
    page++

    if (data.length < pageSize) break
  }

  console.log(`  Fetched ${allItems.length} items`)

  // Step 2: Map each item to its Arizona code
  console.log('\nStep 2: Mapping skills to Arizona codes...')

  const updates = []
  const unmapped = new Map() // skill -> count
  let mapped = 0

  for (const item of allItems) {
    let code = null

    // Find matching pattern for this skill at this grade
    for (const p of skillPatterns) {
      if (p.grade === item.grade && p.pattern.test(item.skill)) {
        code = p.code
        break
      }
    }

    // Fallback: try any grade match
    if (!code) {
      for (const p of skillPatterns) {
        if (p.pattern.test(item.skill)) {
          // Adjust code prefix based on actual grade
          if (item.grade === 0) {
            code = p.code.startsWith('1.') ? p.code.replace('1.', 'K.') : p.code
          } else if (item.grade === 1) {
            code = p.code.startsWith('K.') ? p.code.replace('K.', '1.') : p.code
          } else {
            code = p.code
          }
          break
        }
      }
    }

    if (code) {
      updates.push({ id: item.id, standard: code })
      mapped++
    } else {
      // Track unmapped skills
      const key = `G${item.grade}|${item.skill}`
      unmapped.set(key, (unmapped.get(key) || 0) + 1)
    }
  }

  console.log(`  Mapped: ${mapped} items`)
  console.log(`  Unmapped: ${allItems.length - mapped} items`)

  if (unmapped.size > 0) {
    console.log('\n  Unmapped skills (need manual mapping):')
    const sortedUnmapped = Array.from(unmapped.entries()).sort((a, b) => b[1] - a[1])
    for (const [skill, count] of sortedUnmapped.slice(0, 20)) {
      console.log(`    ${skill}: ${count} items`)
    }
    if (sortedUnmapped.length > 20) {
      console.log(`    ... and ${sortedUnmapped.length - 20} more`)
    }
  }

  // Step 3: Update database in batches
  console.log('\nStep 3: Updating database...')

  const batchSize = 100
  let updated = 0
  let errors = 0

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)

    // Update each item individually (Supabase doesn't support batch update by different values)
    for (const item of batch) {
      const { error } = await supabase
        .from('practice_problems')
        .update({ standard: item.standard })
        .eq('id', item.id)

      if (error) {
        errors++
        if (errors <= 5) {
          console.error(`  Error updating ${item.id}: ${error.message}`)
        }
      } else {
        updated++
      }
    }

    if ((i + batchSize) % 1000 === 0 || i + batchSize >= updates.length) {
      console.log(`  Progress: ${Math.min(i + batchSize, updates.length)}/${updates.length}`)
    }
  }

  console.log(`\n=== COMPLETE ===`)
  console.log(`  Successfully updated: ${updated} items`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Items without mapping: ${allItems.length - mapped}`)

  // Verify
  console.log('\nStep 4: Verifying...')
  const { count: withStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .not('standard', 'is', null)

  const { count: withoutStandard } = await supabase
    .from('practice_problems')
    .select('*', { count: 'exact', head: true })
    .is('standard', null)

  console.log(`  Items with standard: ${withStandard}`)
  console.log(`  Items without standard: ${withoutStandard}`)
}

main().catch(console.error)
