const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config(); // Use .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.log('Available vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error('Usage: node run-migration.js <sql-file>');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');
  console.log('Running migration:', sqlFile);
  console.log('Connected to:', supabaseUrl);
  
  // Split by statements and run each one
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim() + ';';
    if (stmt.startsWith('--') || stmt.startsWith('/*')) continue;
    
    try {
      const { error } = await supabase.from('_migrations_test').select('*').limit(0);
      // This won't work directly, but the supabase client can run raw SQL via the REST API
    } catch (e) {
      // expected
    }
  }
  
  console.log('Note: Direct SQL execution requires the Supabase dashboard.');
  console.log('Please copy this SQL to the Supabase SQL Editor:');
  console.log('');
  console.log(sql);
}

runMigration();
