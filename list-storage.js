const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listStorage() {
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }

    console.log('\n=== SUPABASE STORAGE BUCKETS ===\n');
    console.log(`Found ${buckets.length} buckets:\n`);

    for (const bucket of buckets) {
      console.log(`📦 Bucket: ${bucket.name}`);
      console.log(`   ID: ${bucket.id}`);
      console.log(`   Public: ${bucket.public}`);

      // List files in bucket
      const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

      if (filesError) {
        console.log(`   Error listing files: ${filesError.message}\n`);
        continue;
      }

      console.log(`   Files: ${files ? files.length : 0}`);

      if (files && files.length > 0) {
        files.forEach((file, idx) => {
          console.log(`   ${idx + 1}. ${file.name} (${file.metadata?.size || 'unknown size'})`);
        });
      }
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listStorage();
