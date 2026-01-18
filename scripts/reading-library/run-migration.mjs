#!/usr/bin/env node
/**
 * Run migration to add reading library columns
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('Adding columns to stories table...');

  // We'll add columns one at a time using direct insert/update
  // Since we can't run raw SQL, we'll work with what exists

  // Check current schema
  const { data: sample, error } = await supabase
    .from('stories')
    .select('*')
    .limit(1);

  if (error) {
    console.log('Error checking table:', error.message);
    return;
  }

  console.log('Current columns:', sample ? Object.keys(sample[0] || {}) : 'Table empty');

  // The columns we need should already exist from migration
  // Let's verify by trying to insert a test record
  const testData = {
    title: 'TEST - Delete Me',
    content: 'Test content',
    genre: 'test',
    reading_level: 'test',
    word_count: 100,
    lexile_band: '400L-600L',
    grade_level: 3,
    expected_time_minutes: 25,
    gender_target: 'neutral',
    category: 'Test Category',
    vocabulary: [{ word: 'test', definition: 'a test' }],
    reading_strategy: 'main_idea',
    strategy_tip: 'Test tip',
    times_read: 0,
    comprehension_questions: []
  };

  const { error: insertError } = await supabase
    .from('stories')
    .insert(testData);

  if (insertError) {
    if (insertError.message.includes('column')) {
      console.log('');
      console.log('MISSING COLUMNS - Need to run SQL migration in Supabase Dashboard:');
      console.log('');
      console.log('Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
      console.log('Run this SQL:');
      console.log('');
      console.log(`
ALTER TABLE stories
ADD COLUMN IF NOT EXISTS lexile_band TEXT,
ADD COLUMN IF NOT EXISTS grade_level INTEGER,
ADD COLUMN IF NOT EXISTS expected_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS gender_target TEXT DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS vocabulary JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reading_strategy TEXT,
ADD COLUMN IF NOT EXISTS strategy_tip TEXT,
ADD COLUMN IF NOT EXISTS times_read INTEGER DEFAULT 0;
      `);
    } else {
      console.log('Insert error:', insertError.message);
    }
  } else {
    console.log('SUCCESS - New columns exist!');

    // Delete test record
    await supabase.from('stories').delete().eq('title', 'TEST - Delete Me');
    console.log('Test record cleaned up.');
  }
}

runMigration().catch(console.error);
