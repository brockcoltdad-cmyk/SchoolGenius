#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') })

// ============================================================================
// AUTOMATIC TABLE CREATOR
// ============================================================================
// Creates all 9 seeding tables automatically
// Just run: node create-tables-auto.mjs
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eczpdbkslqbduiesbqcm.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('🔨 Creating Seeding Tables...')
console.log('='.repeat(60))

const tables = [
  {
    name: 'qa_library',
    sql: `
      CREATE TABLE IF NOT EXISTS qa_library (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        category TEXT NOT NULL,
        answer_k2 TEXT NOT NULL,
        answer_35 TEXT NOT NULL,
        answer_68 TEXT NOT NULL,
        answer_912 TEXT NOT NULL,
        times_served INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_library_category ON qa_library(category);
      CREATE INDEX IF NOT EXISTS idx_qa_library_question ON qa_library(question);
      ALTER TABLE qa_library ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access qa_library" ON qa_library;
      CREATE POLICY "Service role full access qa_library" ON qa_library FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read qa_library" ON qa_library;
      CREATE POLICY "Anyone can read qa_library" ON qa_library FOR SELECT USING (true);
    `
  },
  {
    name: 'subject_analogies',
    sql: `
      CREATE TABLE IF NOT EXISTS subject_analogies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        skill_id UUID,
        subject_code TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        age_group TEXT NOT NULL,
        analogy TEXT NOT NULL,
        explanation TEXT NOT NULL,
        times_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_subject_analogies_skill ON subject_analogies(skill_id);
      CREATE INDEX IF NOT EXISTS idx_subject_analogies_age ON subject_analogies(age_group);
      ALTER TABLE subject_analogies ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access subject_analogies" ON subject_analogies;
      CREATE POLICY "Service role full access subject_analogies" ON subject_analogies FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read analogies" ON subject_analogies;
      CREATE POLICY "Anyone can read analogies" ON subject_analogies FOR SELECT USING (true);
    `
  },
  {
    name: 'return_messages',
    sql: `
      CREATE TABLE IF NOT EXISTS return_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        absence_period TEXT NOT NULL,
        age_group TEXT NOT NULL,
        message TEXT NOT NULL,
        tone TEXT NOT NULL,
        times_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_return_messages_age ON return_messages(age_group);
      CREATE INDEX IF NOT EXISTS idx_return_messages_period ON return_messages(absence_period);
      ALTER TABLE return_messages ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access return_messages" ON return_messages;
      CREATE POLICY "Service role full access return_messages" ON return_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read return messages" ON return_messages;
      CREATE POLICY "Anyone can read return messages" ON return_messages FOR SELECT USING (true);
    `
  },
  {
    name: 'gigi_personality',
    sql: `
      CREATE TABLE IF NOT EXISTS gigi_personality (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category TEXT NOT NULL,
        age_group TEXT NOT NULL,
        trait TEXT NOT NULL,
        example_phrase TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_gigi_personality_age ON gigi_personality(age_group);
      CREATE INDEX IF NOT EXISTS idx_gigi_personality_category ON gigi_personality(category);
      ALTER TABLE gigi_personality ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access gigi_personality" ON gigi_personality;
      CREATE POLICY "Service role full access gigi_personality" ON gigi_personality FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read gigi personality" ON gigi_personality;
      CREATE POLICY "Anyone can read gigi personality" ON gigi_personality FOR SELECT USING (true);
    `
  },
  {
    name: 'kid_stuck_responses',
    sql: `
      CREATE TABLE IF NOT EXISTS kid_stuck_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_type TEXT NOT NULL,
        subject TEXT NOT NULL,
        age_group TEXT NOT NULL,
        response TEXT NOT NULL,
        response_tone TEXT NOT NULL,
        times_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_kid_stuck_type ON kid_stuck_responses(question_type);
      CREATE INDEX IF NOT EXISTS idx_kid_stuck_age ON kid_stuck_responses(age_group);
      ALTER TABLE kid_stuck_responses ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access kid_stuck" ON kid_stuck_responses;
      CREATE POLICY "Service role full access kid_stuck" ON kid_stuck_responses FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read kid stuck" ON kid_stuck_responses;
      CREATE POLICY "Anyone can read kid stuck" ON kid_stuck_responses FOR SELECT USING (true);
    `
  },
  {
    name: 'transition_phrases',
    sql: `
      CREATE TABLE IF NOT EXISTS transition_phrases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        from_subject TEXT NOT NULL,
        to_subject TEXT NOT NULL,
        age_group TEXT NOT NULL,
        phrase TEXT NOT NULL,
        tone TEXT NOT NULL,
        times_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_transition_age ON transition_phrases(age_group);
      ALTER TABLE transition_phrases ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access transitions" ON transition_phrases;
      CREATE POLICY "Service role full access transitions" ON transition_phrases FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read transitions" ON transition_phrases;
      CREATE POLICY "Anyone can read transitions" ON transition_phrases FOR SELECT USING (true);
    `
  },
  {
    name: 'celebration_messages',
    sql: `
      CREATE TABLE IF NOT EXISTS celebration_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        milestone_type TEXT NOT NULL,
        age_group TEXT NOT NULL,
        message TEXT NOT NULL,
        tone TEXT NOT NULL,
        times_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_celebration_milestone ON celebration_messages(milestone_type);
      CREATE INDEX IF NOT EXISTS idx_celebration_age ON celebration_messages(age_group);
      ALTER TABLE celebration_messages ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access celebrations" ON celebration_messages;
      CREATE POLICY "Service role full access celebrations" ON celebration_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read celebrations" ON celebration_messages;
      CREATE POLICY "Anyone can read celebrations" ON celebration_messages FOR SELECT USING (true);
    `
  },
  {
    name: 'greeting_messages',
    sql: `
      CREATE TABLE IF NOT EXISTS greeting_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        time_of_day TEXT NOT NULL,
        age_group TEXT NOT NULL,
        greeting TEXT NOT NULL,
        tone TEXT NOT NULL,
        times_used INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_greeting_time ON greeting_messages(time_of_day);
      CREATE INDEX IF NOT EXISTS idx_greeting_age ON greeting_messages(age_group);
      ALTER TABLE greeting_messages ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Service role full access greetings" ON greeting_messages;
      CREATE POLICY "Service role full access greetings" ON greeting_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Anyone can read greetings" ON greeting_messages;
      CREATE POLICY "Anyone can read greetings" ON greeting_messages FOR SELECT USING (true);
    `
  }
]

async function createTables() {
  for (const table of tables) {
    try {
      console.log(`Creating ${table.name}...`)

      const { error } = await supabase.rpc('exec_sql', {
        sql_query: table.sql
      })

      if (error) {
        // Try direct approach if rpc doesn't work
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({ sql_query: table.sql })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
      }

      console.log(`✅ ${table.name} created`)
    } catch (error) {
      console.error(`❌ Error creating ${table.name}: ${error.message}`)
      console.log('⚠️  You may need to run this SQL manually in Supabase Dashboard')
    }
  }

  console.log('')
  console.log('='.repeat(60))
  console.log('✅ All tables created!')
  console.log('')
  console.log('Next step: Add second Grok API key to .env file')
  console.log('Then run: node parallel-seed-master.mjs')
}

createTables()
