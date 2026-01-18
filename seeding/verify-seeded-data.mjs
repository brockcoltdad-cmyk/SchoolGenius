#!/usr/bin/env node
/**
 * VERIFY SEEDED DATA - Check what was actually inserted
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyData() {
  console.log('🔍 VERIFYING SEEDED DATA');
  console.log('='.repeat(80));
  console.log('');

  const tables = [
    { name: 'kid_stuck_responses', expected: 340 },
    { name: 'subject_analogies', expected: 1100 },
    { name: 'parent_struggle_guides', expected: 28 },
    { name: 'transition_phrases', expected: 300 },
    { name: 'achievement_celebrations', expected: 168 },
    { name: 'greeting_messages', expected: 64 },
    { name: 'return_messages', expected: 80 },
    { name: 'gigi_personality', expected: 200 }
  ];

  let totalExpected = 0;
  let totalActual = 0;

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table.name}: Error - ${error.message}`);
      continue;
    }

    const percentage = (count / table.expected * 100).toFixed(1);
    const status = count === table.expected ? '✅' : count > 0 ? '🟡' : '❌';

    console.log(`${status} ${table.name}: ${count}/${table.expected} (${percentage}%)`);

    totalExpected += table.expected;
    totalActual += count;
  }

  console.log('');
  console.log('='.repeat(80));
  console.log(`📊 TOTAL: ${totalActual}/${totalExpected} (${(totalActual/totalExpected*100).toFixed(1)}%)`);
  console.log('');

  if (totalActual === totalExpected) {
    console.log('🎉 ALL DATA SEEDED SUCCESSFULLY!');
  } else if (totalActual > 0) {
    console.log(`🟡 PARTIAL SUCCESS: ${totalExpected - totalActual} items remaining`);
  } else {
    console.log('❌ NO DATA FOUND - Seeding needs to run');
  }
}

verifyData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
