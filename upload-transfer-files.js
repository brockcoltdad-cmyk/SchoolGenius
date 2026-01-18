const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function uploadFile(localPath, remoteName) {
  try {
    const content = fs.readFileSync(localPath, 'utf-8');
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`transfer/${remoteName}`, content, {
        contentType: 'text/markdown',
        upsert: true
      });
    
    if (error) {
      console.log(`❌ ${remoteName}: ${error.message}`);
      return false;
    }
    console.log(`✅ Uploaded: ${remoteName}`);
    return true;
  } catch (err) {
    console.log(`❌ ${remoteName}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('📤 Uploading transfer files to Supabase...\n');
  
  const files = [
    // Main setup files
    ['C:/Projects/ai-command-center/NEW-PC-QUICK-START.md', 'NEW-PC-QUICK-START.md'],
    ['C:/Projects/ai-command-center/SUPABASE-TRANSFER-PACKAGE.md', 'SUPABASE-TRANSFER-PACKAGE.md'],
    
    // SchoolGenius README system
    ['C:/Projects/ai-command-center/SCHOOLGENIUS-1-LOOKUP.md', 'SCHOOLGENIUS-1-LOOKUP.md'],
    ['C:/Projects/ai-command-center/SCHOOLGENIUS-2-PROCEDURE.md', 'SCHOOLGENIUS-2-PROCEDURE.md'],
    ['C:/Projects/ai-command-center/SCHOOLGENIUS-3-CHANGES.md', 'SCHOOLGENIUS-3-CHANGES.md'],
    ['C:/Projects/ai-command-center/SCHOOLGENIUS-4-AUDIT.md', 'SCHOOLGENIUS-4-AUDIT.md'],
    ['C:/Projects/ai-command-center/SCHOOLGENIUS-5-COMPETITORS.md', 'SCHOOLGENIUS-5-COMPETITORS.md'],
    
    // Knowledge library essentials
    ['C:/Projects/ai-command-center/knowledge-library/schoolgenius/COMPLETE-REQUIREMENTS-EXTRACTED.md', 'COMPLETE-REQUIREMENTS-EXTRACTED.md'],
    ['C:/Projects/ai-command-center/knowledge-library/schoolgenius/MASTER-RULES-CHECKLIST.md', 'MASTER-RULES-CHECKLIST.md'],
    ['C:/Projects/ai-command-center/knowledge-library/AI-ARMY-SETUP-NEW-COMPUTER.md', 'AI-ARMY-SETUP-NEW-COMPUTER.md'],
    ['C:/Projects/ai-command-center/knowledge-library/NEW-COMPUTER-SPECS.md', 'NEW-COMPUTER-SPECS.md'],
  ];
  
  let success = 0;
  let failed = 0;
  
  for (const [local, remote] of files) {
    if (fs.existsSync(local)) {
      const result = await uploadFile(local, remote);
      if (result) success++;
      else failed++;
    } else {
      console.log(`⚠️ Not found: ${local}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${success} uploaded, ${failed} failed`);
  console.log('\n🔗 Files available at: Supabase Dashboard → Storage → documents → transfer/');
}

main();
