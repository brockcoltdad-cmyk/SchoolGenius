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

console.log('🔍 CHECKING SKILLS TABLE');
console.log('='.repeat(80));

// Try to fetch skills
const { data: skills, error } = await supabase
  .from('skills')
  .select('*')
  .limit(10);

if (error) {
  console.error('❌ Error:', error);
  console.error('Message:', error.message);
  console.error('Details:', error.details);
  console.error('Hint:', error.hint);
} else {
  console.log(`✅ Found ${skills?.length || 0} skills (showing first 10):`);
  console.log(JSON.stringify(skills, null, 2));
}
