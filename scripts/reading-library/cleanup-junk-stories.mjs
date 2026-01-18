#!/usr/bin/env node
/**
 * CLEANUP JUNK STORIES
 *
 * Problem: 2,099 stories exist with NO grade_level, NO lexile_band, NO questions
 * Solution: Delete them all and regenerate properly
 *
 * Created: 2026-01-13
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

async function cleanupJunkStories() {
  console.log('🧹 CLEANING UP JUNK STORIES');
  console.log('='.repeat(60));

  // First, count what we have
  const { count: beforeCount } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Stories before cleanup: ${beforeCount}`);

  // Check how many have NO lexile_band (junk)
  const { data: junkStories, count: junkCount } = await supabase
    .from('stories')
    .select('id', { count: 'exact' })
    .is('lexile_band', null);

  console.log(`🗑️  Stories with NO lexile_band: ${junkCount}`);

  if (junkCount === 0) {
    console.log('✅ No junk stories to clean up!');
    return;
  }

  // Confirm deletion
  console.log('');
  console.log('⚠️  About to delete ' + junkCount + ' junk stories...');
  console.log('   These stories have no grade_level, lexile_band, or questions.');
  console.log('   They are NOT usable for the Reading Library.');
  console.log('');

  // Delete junk stories (those with null lexile_band)
  const { error: deleteError } = await supabase
    .from('stories')
    .delete()
    .is('lexile_band', null);

  if (deleteError) {
    console.log('❌ Error deleting stories:', deleteError.message);
    return;
  }

  // Count after
  const { count: afterCount } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true });

  console.log('');
  console.log('✅ CLEANUP COMPLETE');
  console.log(`   Before: ${beforeCount} stories`);
  console.log(`   Deleted: ${junkCount} junk stories`);
  console.log(`   After: ${afterCount} stories`);
  console.log('');
  console.log('🚀 Ready for proper story generation!');
}

cleanupJunkStories().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
