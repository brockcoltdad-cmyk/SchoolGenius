import { config } from 'dotenv';
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `
-- 1. Rule Teaching Scripts (Phase 1)
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

-- 2. Demo Problems (Phase 2)
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

-- 3. Guided Practice (Phase 3)
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

-- 4. Weekly Quizzes (Phase 5)
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

-- 5. Monthly Reviews (Phase 7)
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
`;

async function createTables() {
  console.log('Attempting to create tables via Supabase SQL endpoint...\n');

  // Try the /sql endpoint
  const endpoints = [
    '/rest/v1/',  // Check if endpoint exists
    '/pg/'        // Alternative postgres endpoint
  ];

  // First, let's try the Management API approach
  // Extract project ref from URL
  const projectRef = url.replace('https://', '').split('.')[0];
  console.log('Project ref:', projectRef);

  // Try using supabase CLI approach - execute via curl
  console.log('\n--- MANUAL STEPS REQUIRED ---\n');
  console.log('The tables cannot be created via REST API.');
  console.log('Please run the following SQL in Supabase Dashboard:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('2. Copy and paste the SQL from: create-lesson-tables.sql');
  console.log('3. Click "Run"\n');

  // Output the SQL for easy copy
  console.log('--- SQL TO RUN ---\n');
  console.log(sql);
}

createTables();
