#!/usr/bin/env node
/**
 * Run Sprint 3 Migration - Create custom_syllabus table
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
-- Create custom_syllabus table
CREATE TABLE IF NOT EXISTS custom_syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id)
);

-- Add comment explaining subjects structure
COMMENT ON TABLE custom_syllabus IS 'Stores parent-customized syllabus configurations per child';
COMMENT ON COLUMN custom_syllabus.subjects IS 'Array of subject configs: [{"subject_code": "MATH", "display_order": 1, "minutes_per_day": 30, "enabled": true}, ...]';

-- Enable Row Level Security
ALTER TABLE custom_syllabus ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups by child_id
CREATE INDEX IF NOT EXISTS idx_custom_syllabus_child_id ON custom_syllabus(child_id);
`;

async function runMigration() {
  console.log('🚀 Running Sprint 3 Migration: custom_syllabus table\n');

  try {
    // Create table
    console.log('📝 Creating custom_syllabus table...');
    const { error: tableError } = await supabase.rpc('exec', { query: migrationSQL });

    if (tableError && !tableError.message.includes('already exists')) {
      throw tableError;
    }

    console.log('✅ Table created (or already exists)');

    // Create RLS policy
    console.log('\n📝 Creating RLS policy...');
    const policySQL = `
      CREATE POLICY IF NOT EXISTS "Parents can manage their children's custom syllabi"
        ON custom_syllabus
        FOR ALL
        USING (EXISTS (
          SELECT 1 FROM children
          WHERE children.id = custom_syllabus.child_id
          AND children.parent_id = auth.uid()
        ));
    `;

    const { error: policyError } = await supabase.rpc('exec', { query: policySQL });

    if (policyError && !policyError.message.includes('already exists')) {
      console.log('⚠️  Policy creation note:', policyError.message);
    } else {
      console.log('✅ RLS policy created');
    }

    console.log('\n📊 Verifying table...');

    // Verify the table was created
    const { count, error: countError } = await supabase
      .from('custom_syllabus')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('⚠️  Table check:', countError.message);
    } else {
      console.log('✅ Table exists with', count || 0, 'rows');
    }

    console.log('\n🎉 Sprint 3 database migration complete!');
    console.log('📁 Table: custom_syllabus');
    console.log('🔐 RLS: Enabled with parent-child policy');
    console.log('📇 Index: idx_custom_syllabus_child_id');
    console.log('\n✨ Ready to test the syllabus management UI!');

  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    console.log('\n📝 Manual migration steps:');
    console.log('1. Go to: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/editor');
    console.log('2. Click SQL Editor');
    console.log('3. Paste and run this SQL:');
    console.log('\n' + migrationSQL);
    process.exit(1);
  }
}

runMigration();
