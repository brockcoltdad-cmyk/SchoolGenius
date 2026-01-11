// Test script for Phase 2 deployment verification
import { config } from 'dotenv'

config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🧪 PHASE 2 DEPLOYMENT VERIFICATION\n')
console.log('=' .repeat(60))

// Test 1: Check if explanation_library table exists
console.log('\n✅ Test 1: Verify explanation_library table')
try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/explanation_library?select=count&limit=0`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Range': '0-0'
    }
  })

  if (response.ok) {
    const contentRange = response.headers.get('content-range')
    const count = contentRange ? contentRange.split('/')[1] : '0'
    console.log(`   ✅ Table exists with ${count} entries`)
  } else {
    console.log(`   ❌ Table not accessible: ${response.status}`)
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`)
}

// Test 2: Check if mistake_patterns table exists
console.log('\n✅ Test 2: Verify mistake_patterns table')
try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/mistake_patterns?select=count&limit=0`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Range': '0-0'
    }
  })

  if (response.ok) {
    const contentRange = response.headers.get('content-range')
    const count = contentRange ? contentRange.split('/')[1] : '0'
    console.log(`   ✅ Table exists with ${count} entries`)
  } else {
    console.log(`   ❌ Table not accessible: ${response.status}`)
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`)
}

// Test 3: Check if generate-lesson-v2 Edge Function is deployed
console.log('\n✅ Test 3: Verify generate-lesson-v2 Edge Function')
try {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-lesson-v2`, {
    method: 'OPTIONS',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  })

  if (response.ok || response.status === 200 || response.status === 204) {
    console.log('   ✅ Edge Function is deployed and responding')
  } else {
    console.log(`   ⚠️  Edge Function status: ${response.status}`)
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`)
}

// Test 4: Check if /api/explanations route exists (requires deployed frontend)
console.log('\n✅ Test 4: Verify /api/explanations API route')
console.log('   ⏭️  Requires frontend deployment - test manually')

// Test 5: Sample explanation lookup
console.log('\n✅ Test 5: Sample explanation lookup')
try {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/explanation_library?problem_text=eq.2 + 3 = ?&select=*`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  })

  if (response.ok) {
    const data = await response.json()
    if (data && data.length > 0) {
      console.log('   ✅ Sample explanation found:')
      console.log(`      Problem: ${data[0].problem_text}`)
      console.log(`      Skill: ${data[0].skill_name}`)
      console.log(`      Has Level 1: ${!!data[0].level_1}`)
      console.log(`      Has Level 2: ${!!data[0].level_2}`)
      console.log(`      Has Level 3: ${!!data[0].level_3}`)
      console.log(`      Times used: ${data[0].times_used}`)
    } else {
      console.log('   ⚠️  No sample data found (expected from migration)')
    }
  } else {
    console.log(`   ❌ Query failed: ${response.status}`)
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`)
}

console.log('\n' + '='.repeat(60))
console.log('\n📋 MANUAL VERIFICATION STEPS:')
console.log('   1. Open Supabase Dashboard SQL Editor')
console.log('   2. Run: SELECT * FROM explanation_library LIMIT 5;')
console.log('   3. Run: SELECT * FROM mistake_patterns LIMIT 5;')
console.log('   4. Verify Vercel deployment at: https://vercel.com')
console.log('   5. Test /api/explanations on production site')
console.log('   6. Test LessonViewer help flow on production site')
console.log('\n💾 DATABASE MIGRATION:')
console.log('   If tables don\'t exist, apply migration manually:')
console.log('   1. Go to: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql/new')
console.log('   2. Copy contents of: supabase/migrations/20260111_phase2_multilevel_explanations.sql')
console.log('   3. Paste and click "Run"')
console.log('\n✅ Phase 2 deployment verification complete!')
