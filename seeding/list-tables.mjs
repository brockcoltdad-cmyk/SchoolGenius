#!/usr/bin/env node
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

// Try to list all tables by checking the existing seeded tables
const tables = [
  'kid_stuck_responses',
  'subject_analogies',
  'parent_struggle_guides',
  'transition_phrases',
  'achievement_celebrations',
  'greeting_messages',
  'return_messages',
  'gigi_personality',
  'skills', // Check if exists
  'lessons', // Check if exists
  'subjects' // Check if exists
];

console.log('🔍 CHECKING TABLES IN DATABASE');
console.log('='.repeat(80));

for (const table of tables) {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: ${count} rows`);
    }
  } catch (e) {
    console.log(`❌ ${table}: ${e.message}`);
  }
}
