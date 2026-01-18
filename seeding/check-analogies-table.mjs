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

console.log('🔍 CHECKING SUBJECT_ANALOGIES TABLE');
console.log('='.repeat(80));

// Fetch sample analogies to see structure
const { data: analogies, error } = await supabase
  .from('subject_analogies')
  .select('*')
  .limit(5);

if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log(`✅ Found ${analogies?.length || 0} analogies (showing first 5):`);
  console.log(JSON.stringify(analogies, null, 2));

  if (analogies && analogies.length > 0) {
    console.log('\n📊 COLUMN STRUCTURE:');
    console.log(Object.keys(analogies[0]).join(', '));
  }
}

// Check what subjects exist
console.log('\n\n🔍 CHECKING SUBJECTS TABLE');
console.log('='.repeat(80));

const { data: subjects, error: subjectsError } = await supabase
  .from('subjects')
  .select('*')
  .limit(10);

if (subjectsError) {
  console.error('❌ Error:', subjectsError.message);
} else {
  console.log(`✅ Found ${subjects?.length || 0} subjects (showing first 10):`);
  console.log(JSON.stringify(subjects, null, 2));
}
