# Syllabus System Testing Checklist

## Pre-Deployment Checklist

- [ ] Edge Function code exists at `supabase/functions/analyze-syllabus/index.ts`
- [ ] Scan API updated at `app/api/scan-document/route.ts` (lines 118-151)
- [ ] Syllabus page rebuilt at `app/kid/[id]/syllabus/page.tsx`
- [ ] XAI_API_KEY available (get from https://console.x.ai)

## Deployment Steps

### 1. Deploy Edge Function
```bash
# Run deployment script
deploy-analyze-syllabus.bat

# OR manually
supabase functions deploy analyze-syllabus --project-ref nnwvzuvebcqrpjuqjlzb
```

**Expected Output:**
```
✅ Deployed function analyze-syllabus successfully
```

### 2. Set Environment Variable
- Go to: https://supabase.com/dashboard/project/nnwvzuvebcqrpjuqjlzb/settings/functions
- Add Secret: `XAI_API_KEY` = `[your-xai-key]`
- Click "Save"

### 3. Verify Deployment
```bash
node verify-syllabus-system.js
```

**Expected Output:**
```
✅ Edge Function is deployed and responding
✅ daily_schedule table: Accessible
✅ kid_scanned_docs table: Accessible
```

## Testing Workflow

### Test 1: Scan Syllabus (5 min)

**URL:** `http://localhost:3000/kid/[replace-with-real-kid-id]/scan`

**Steps:**
1. Select "Syllabus" from document type dropdown
2. Choose a test image (or take photo of a real syllabus)
3. Click "Scan & Analyze"
4. Wait for processing (10-30 seconds)

**Expected Result:**
- ✅ "Document scanned successfully!" message
- ✅ Console shows: "📋 Syllabus detected - calling Grok..."
- ✅ Console shows: "✅ Generated X prep lessons"

**If It Fails:**
- Check browser console (F12) for errors
- Check Next.js terminal for error logs
- Verify image uploaded to Supabase Storage
- Run `node verify-syllabus-system.js` to check system status

### Test 2: Check Database (2 min)

**Go to:** https://supabase.com/dashboard/project/nnwvzuvebcqrpjuqjlzb/editor

**Run Query 1 - Check Scanned Syllabus:**
```sql
SELECT
  id,
  student_id,
  doc_type,
  subject,
  LEFT(extracted_text, 100) as text_preview,
  created_at
FROM kid_scanned_docs
WHERE doc_type = 'syllabus'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
- ✅ See row with doc_type = 'syllabus'
- ✅ extracted_text has content
- ✅ subject is set

**Run Query 2 - Check Generated Lessons:**
```sql
SELECT
  child_id,
  date,
  subject_code,
  title,
  description,
  estimated_minutes,
  completed,
  from_syllabus
FROM daily_schedule
WHERE from_syllabus = true
ORDER BY date ASC
LIMIT 10;
```

**Expected Result:**
- ✅ Multiple rows with from_syllabus = true
- ✅ Dates are in the future (prep lessons scheduled ahead)
- ✅ Titles like "Fractions Prep: ...", "Reading Prep: ...", etc.
- ✅ subject_code is set (MATH, READING, etc.)

### Test 3: View Schedule (3 min)

**URL:** `http://localhost:3000/kid/[replace-with-real-kid-id]/syllabus`

**Expected Display:**
- ✅ "My Learning Plan" header with Gigi character
- ✅ Weekly sections: "Week of [date]"
- ✅ Lesson cards showing:
  - Date (e.g., "Mon, Jan 20")
  - Subject badge (e.g., "MATH")
  - Lesson title
  - Description
  - Time estimate (e.g., "25 min")
  - "Start" button

**If It Shows "No syllabus scanned yet":**
- Go back to Test 1 and scan a syllabus first
- Check database (Test 2) to verify syllabus was saved

### Test 4: Click Start Button (2 min)

**Steps:**
1. On syllabus page, click "Start" button on any lesson
2. Should navigate to: `http://localhost:3000/kid/[kid-id]`

**Expected Result:**
- ✅ Redirects to kid dashboard
- ✅ Dashboard loads without errors

**Future Enhancement:**
- Should eventually show the specific prep lesson content
- For now, just verify navigation works

## Edge Function Log Checking

### View Logs in Supabase:
1. Go to: https://supabase.com/dashboard/project/nnwvzuvebcqrpjuqjlzb/functions/analyze-syllabus/logs
2. Look for recent invocations
3. Check for error messages

### Common Log Messages:

**Success:**
```
📋 Analyzing syllabus for student [student-id]
Extracted text length: 523 chars
Items found: 5
✅ Grok generated 8 prep lessons
💾 Inserted 8 lessons into daily_schedule
```

**Errors:**
```
❌ Child not found
❌ Grok API error: 401 Unauthorized
❌ Grok returned invalid JSON
```

## Troubleshooting Guide

### Problem: "Cannot connect to AI Command Center"
**Fix:** Start the dev server
```bash
npm run dev
```

### Problem: "Grok API error: 401"
**Fix:** XAI_API_KEY not set or invalid
- Go to Supabase Dashboard → Functions → Secrets
- Add XAI_API_KEY with valid key from https://console.x.ai

### Problem: No lessons generated
**Check:**
1. Edge Function logs - did Grok return valid JSON?
2. Console logs - did scan API call the Edge Function?
3. Database - is syllabus in kid_scanned_docs?

### Problem: Dates are in the past
**Fix:** Grok may have misinterpreted syllabus dates
- Check syllabus image - are dates clear?
- May need to update Grok prompt to handle date format

### Problem: "Function not found"
**Fix:** Edge Function not deployed
```bash
deploy-analyze-syllabus.bat
```

## Success Criteria

All of these should be TRUE:

- ✅ Can scan a syllabus image
- ✅ Gemini extracts text from image
- ✅ Syllabus saved to kid_scanned_docs
- ✅ Edge Function calls Grok successfully
- ✅ Grok generates prep lessons
- ✅ Lessons saved to daily_schedule with from_syllabus=true
- ✅ Syllabus page displays weekly schedule
- ✅ Lesson cards show all info correctly
- ✅ "Start" buttons work

## Test Data Examples

### Sample Syllabus Text to Test With:
```
Math Syllabus - Grade 3
Week of Jan 20: Fractions (halves, quarters)
Week of Jan 27: Multiplication tables (2s, 5s, 10s)
Week of Feb 3: Word problems
Week of Feb 10: Geometry - shapes and angles

Reading Schedule:
Jan 22: Chapter book analysis
Jan 29: Poetry unit
Feb 5: Non-fiction comprehension
```

### Expected Grok Output (Example):
```json
[
  {
    "topic": "Introduction to Fractions",
    "subject": "Math",
    "school_teaches_date": "2026-01-20",
    "prep_date": "2026-01-17",
    "lesson_title": "Fractions Prep: What is a Fraction?",
    "description": "Learn fraction basics before class",
    "estimated_minutes": 25,
    "order_index": 1
  },
  {
    "topic": "Multiplication Tables",
    "subject": "Math",
    "school_teaches_date": "2026-01-27",
    "prep_date": "2026-01-24",
    "lesson_title": "Multiplication Prep: 2s, 5s, and 10s",
    "description": "Practice times tables before class",
    "estimated_minutes": 30,
    "order_index": 2
  }
]
```

## Performance Expectations

- **Scan Time:** 10-30 seconds (depending on image size)
- **Grok Analysis:** 5-15 seconds
- **Total Workflow:** ~30-45 seconds from scan to schedule display
- **Database Queries:** <1 second

## Next Steps After Testing

Once all tests pass:

1. **Test with Real Syllabi:**
   - Have a real student scan their actual school syllabus
   - Verify dates make sense
   - Verify subjects are correct
   - Check that prep timing is appropriate

2. **Add More Features:**
   - Homework scanning and Claude analysis
   - Test scanning and weak area identification
   - Parent dashboard with all scanned docs
   - Notifications for upcoming prep lessons

3. **Monitor in Production:**
   - Watch Edge Function logs for errors
   - Check database for lesson completion rates
   - Get user feedback on prep lesson quality

## Support Resources

- **Deployment Guide:** `SYLLABUS-DEPLOYMENT-GUIDE.md`
- **Verification Script:** `node verify-syllabus-system.js`
- **Supabase Dashboard:** https://supabase.com/dashboard/project/nnwvzuvebcqrpjuqjlzb
- **xAI Console:** https://console.x.ai
- **Edge Function Logs:** Dashboard → Functions → analyze-syllabus → Logs
