import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

// SQL statements for each table
const tables = [
  {
    name: 'rule_teaching_scripts',
    sql: `
      CREATE TABLE IF NOT EXISTS rule_teaching_scripts (
        id SERIAL PRIMARY KEY,
        rule_id TEXT UNIQUE NOT NULL,
        rule_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        standard TEXT,
        teaching_script JSONB NOT NULL,
        rule_card JSONB NOT NULL,
        total_duration INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    name: 'demo_problems',
    sql: `
      CREATE TABLE IF NOT EXISTS demo_problems (
        id SERIAL PRIMARY KEY,
        demo_id TEXT UNIQUE NOT NULL,
        rule_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        standard TEXT,
        problem TEXT NOT NULL,
        answer TEXT NOT NULL,
        walkthrough JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    name: 'guided_practice',
    sql: `
      CREATE TABLE IF NOT EXISTS guided_practice (
        id SERIAL PRIMARY KEY,
        guided_id TEXT UNIQUE NOT NULL,
        rule_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        standard TEXT,
        problem TEXT NOT NULL,
        answer TEXT NOT NULL,
        hints JSONB NOT NULL,
        solution JSONB,
        encouragement TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    name: 'weekly_quizzes',
    sql: `
      CREATE TABLE IF NOT EXISTS weekly_quizzes (
        id SERIAL PRIMARY KEY,
        quiz_id TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        week INTEGER NOT NULL,
        rules_covered JSONB NOT NULL,
        questions JSONB NOT NULL,
        pass_threshold INTEGER DEFAULT 80,
        reward_coins INTEGER DEFAULT 25,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    name: 'monthly_reviews',
    sql: `
      CREATE TABLE IF NOT EXISTS monthly_reviews (
        id SERIAL PRIMARY KEY,
        review_id TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        month INTEGER NOT NULL,
        rules_covered JSONB NOT NULL,
        questions JSONB NOT NULL,
        pass_threshold INTEGER DEFAULT 80,
        time_limit INTEGER DEFAULT 1800,
        reward_coins INTEGER DEFAULT 100,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  }
];

async function createTables() {
  console.log('Creating 5 lesson flow tables...\n');

  // Try using Supabase's SQL endpoint via fetch
  for (const table of tables) {
    try {
      const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({ sql_query: table.sql })
      });

      if (response.ok) {
        console.log(`✓ ${table.name}: Created via RPC`);
      } else {
        // RPC doesn't exist, will need to use dashboard
        const text = await response.text();
        if (text.includes('not find')) {
          console.log(`✗ ${table.name}: RPC method not available`);
        } else {
          console.log(`✗ ${table.name}: ${text.substring(0, 100)}`);
        }
      }
    } catch (e) {
      console.log(`✗ ${table.name}: ${e.message}`);
    }
  }

  console.log('\n--- VERIFICATION ---\n');

  // Verify each table exists by trying to select from it
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`${table.name}: NOT FOUND (${error.message})`);
    } else {
      console.log(`${table.name}: EXISTS (${count} rows)`);
    }
  }
}

createTables();
