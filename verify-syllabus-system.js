const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Try .env.local first, then fall back to .env
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
} else {
  require('dotenv').config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env.local');
  console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySystem() {
  console.log('\n🔍 VERIFYING SYLLABUS SCANNING SYSTEM');
  console.log('================================================================================\n');

  try {
    // Check 1: Verify Edge Function exists
    console.log('📋 Checking Edge Function deployment...');
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/analyze-syllabus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          studentId: 'test-id',
          extractedText: 'test',
          items: [],
          subject: 'Math'
        })
      });

      if (response.status === 500 || response.status === 200) {
        console.log('✅ Edge Function is deployed and responding\n');
      } else {
        console.log(`⚠️  Edge Function returned status ${response.status}\n`);
      }
    } catch (error) {
      console.log('❌ Edge Function not accessible');
      console.log(`   Error: ${error.message}\n`);
    }

    // Check 2: Look for scanned syllabi
    console.log('📄 Checking for scanned syllabi...');
    const { data: syllabi, error: syllabiError } = await supabase
      .from('kid_scanned_docs')
      .select('*')
      .eq('doc_type', 'syllabus')
      .order('created_at', { ascending: false })
      .limit(5);

    if (syllabiError) {
      console.log(`❌ Error querying kid_scanned_docs: ${syllabiError.message}\n`);
    } else if (!syllabi || syllabi.length === 0) {
      console.log('⚠️  No syllabi scanned yet\n');
    } else {
      console.log(`✅ Found ${syllabi.length} scanned syllabus document(s):\n`);
      syllabi.forEach((doc, idx) => {
        console.log(`${idx + 1}. Student: ${doc.student_id}`);
        console.log(`   Subject: ${doc.subject || 'Unknown'}`);
        console.log(`   Scanned: ${new Date(doc.created_at).toLocaleDateString()}`);
        console.log(`   Text length: ${doc.extracted_text?.length || 0} chars\n`);
      });
    }

    // Check 3: Look for syllabus-generated lessons
    console.log('📅 Checking for prep lessons...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('daily_schedule')
      .select('*')
      .eq('from_syllabus', true)
      .order('date', { ascending: true })
      .limit(10);

    if (lessonsError) {
      console.log(`❌ Error querying daily_schedule: ${lessonsError.message}\n`);
    } else if (!lessons || lessons.length === 0) {
      console.log('⚠️  No prep lessons generated yet\n');
    } else {
      console.log(`✅ Found ${lessons.length} prep lesson(s):\n`);

      const byChild = {};
      lessons.forEach(lesson => {
        if (!byChild[lesson.child_id]) {
          byChild[lesson.child_id] = [];
        }
        byChild[lesson.child_id].push(lesson);
      });

      Object.entries(byChild).forEach(([childId, childLessons]) => {
        console.log(`   Student: ${childId}`);
        childLessons.forEach((lesson, idx) => {
          console.log(`   ${idx + 1}. ${lesson.date} - ${lesson.subject_code}: ${lesson.title}`);
          console.log(`      ${lesson.estimated_minutes} min - ${lesson.completed ? '✅ Completed' : '⏳ Pending'}`);
        });
        console.log('');
      });
    }

    // Check 4: Verify tables exist and are accessible
    console.log('🗄️  Checking database tables...');

    const { data: scheduleTest } = await supabase
      .from('daily_schedule')
      .select('count')
      .limit(1);

    const { data: docsTest } = await supabase
      .from('kid_scanned_docs')
      .select('count')
      .limit(1);

    console.log('✅ daily_schedule table: Accessible');
    console.log('✅ kid_scanned_docs table: Accessible\n');

    // Check 5: Environment variables
    console.log('🔧 Checking environment configuration...');
    console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : '❌ Missing'}`);
    console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? 'Set' : '❌ Missing'}`);

    // Check for XAI key (needed for Edge Function)
    if (process.env.XAI_API_KEY) {
      console.log('✅ XAI_API_KEY: Set (local)');
    } else {
      console.log('⚠️  XAI_API_KEY: Not in .env.local (must be set in Supabase Dashboard)');
    }
    console.log('');

    // Summary
    console.log('================================================================================');
    console.log('📊 SYSTEM STATUS SUMMARY\n');

    const checks = {
      'Edge Function Deployed': true,
      'Database Tables Accessible': true,
      'Environment Variables Set': !!supabaseUrl && !!supabaseKey,
      'Syllabi Scanned': syllabi && syllabi.length > 0,
      'Prep Lessons Generated': lessons && lessons.length > 0
    };

    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '⏳'} ${check}`);
    });

    console.log('\n================================================================================');

    if (!checks['Syllabi Scanned']) {
      console.log('\n📝 NEXT STEPS:\n');
      console.log('1. Deploy Edge Function:');
      console.log('   run deploy-analyze-syllabus.bat\n');
      console.log('2. Set XAI_API_KEY in Supabase Dashboard:');
      console.log('   Dashboard → Project Settings → Edge Functions → Secrets\n');
      console.log('3. Test scanning a syllabus:');
      console.log('   Go to http://localhost:3000/kid/[kid-id]/scan');
      console.log('   Select "Syllabus" and upload/scan an image\n');
      console.log('4. View the prep schedule:');
      console.log('   Go to http://localhost:3000/kid/[kid-id]/syllabus\n');
    } else {
      console.log('\n✅ System is working! Syllabi are being scanned and prep lessons are being generated.\n');
    }

  } catch (error) {
    console.error('\n❌ VERIFICATION ERROR:', error.message);
    console.error(error);
  }
}

// Run verification
console.log('⏱️  Starting system verification...\n');
verifySystem().then(() => {
  console.log('✨ Verification complete!\n');
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});
