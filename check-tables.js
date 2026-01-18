const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function countTables() {
  const tables = [
    'children', 'profiles', 'lesson_content', 'practice_problems',
    'explanation_library', 'qa_library', 'mistake_patterns', 
    'parent_help_articles', 'stories', 'achievements', 'prizes',
    'learning_profiles', 'answer_attempts', 'themes', 'audio_cache',
    'documents', 'coins_transactions', 'custom_skins', 'weekly_test_results',
    'syllabi', 'daily_schedules', 'child_themes', 'child_achievements'
  ];
  
  console.log('TABLE NAME            | ROW COUNT');
  console.log('----------------------|----------');
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(table.padEnd(22) + '| ' + count);
      } else {
        console.log(table.padEnd(22) + '| ' + error.code);
      }
    } catch (e) {
      console.log(table.padEnd(22) + '| FAIL');
    }
  }
}

countTables();
