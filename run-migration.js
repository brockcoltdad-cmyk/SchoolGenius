const { Client } = require('pg');
const fs = require('fs');
const dns = require('dns');

// Force IPv4 to avoid timeout issues
dns.setDefaultResultOrder('ipv4first');

const client = new Client({
  host: 'aws-0-us-west-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.eczpdbkslqbduiesbqcm',
  password: '$05Hay05ward',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const sqlFile = process.argv[2] || 'migrations/001_create_tracking_tables.sql';

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('Running migration:', sqlFile);

    await client.query(sql);
    console.log('✅ Migration completed successfully!');

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('answer_attempts', 'learning_sessions', 'weekly_progress', 'skill_mastery', 'test_results')
      ORDER BY table_name
    `);

    console.log('\nTables created:');
    result.rows.forEach(row => console.log('  -', row.table_name));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
