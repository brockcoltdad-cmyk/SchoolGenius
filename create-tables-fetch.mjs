import { config } from 'dotenv';
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const createTableSQL = (tableName, columns) => `
CREATE TABLE IF NOT EXISTS ${tableName} (${columns});
`;

const tables = [
  {
    name: 'rule_teaching_scripts',
    columns: `
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
    `
  },
  {
    name: 'demo_problems',
    columns: `
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
    `
  },
  {
    name: 'guided_practice',
    columns: `
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
    `
  },
  {
    name: 'weekly_quizzes',
    columns: `
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
    `
  },
  {
    name: 'monthly_reviews',
    columns: `
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
    `
  }
];

async function tryCreateTable(tableName, sql) {
  // Try various Supabase endpoints
  const endpoints = [
    { path: '/rest/v1/rpc/exec', body: { sql } },
    { path: '/rest/v1/rpc/execute_sql', body: { query: sql } },
    { path: '/rest/v1/rpc/raw_sql', body: { sql } },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(url + endpoint.path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(endpoint.body)
      });

      if (response.ok) {
        return { success: true, method: endpoint.path };
      }
    } catch (e) {
      // Continue to next endpoint
    }
  }

  return { success: false };
}

async function main() {
  console.log('Attempting to create tables...\n');

  // Try Supabase query endpoint (if available)
  const projectRef = url.replace('https://', '').split('.')[0];

  // First try: Supabase SQL query endpoint
  const allSQL = tables.map(t => createTableSQL(t.name, t.columns)).join('\n');

  try {
    // Try the pg endpoint
    const pgResponse = await fetch(`${url}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ query: allSQL })
    });

    if (pgResponse.ok) {
      console.log('Tables created via /pg/query endpoint!');
    } else {
      console.log('/pg/query response:', pgResponse.status, await pgResponse.text());
    }
  } catch (e) {
    console.log('Error:', e.message);
  }

  console.log('\n========================================');
  console.log('MANUAL ACTION REQUIRED');
  console.log('========================================\n');
  console.log('Run this SQL in Supabase Dashboard:');
  console.log(`https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
  console.log('SQL file: create-lesson-tables.sql');
  console.log('\nOr copy from below:');
  console.log('----------------------------------------');
  console.log(allSQL);
}

main();
