# Syllabus Scanning System - Deployment Guide

## What Was Built

The syllabus scanning system allows kids to scan their school syllabus and have Grok automatically generate a personalized prep schedule. Kids learn topics BEFORE school teaches them.

### Components Built:

1. **Scan API Extension** (`app/api/scan-document/route.ts`)
   - Detects when a syllabus is scanned
   - Calls Grok Edge Function for analysis

2. **Grok Edge Function** (`supabase/functions/analyze-syllabus/index.ts`)
   - Analyzes syllabus text using Grok AI
   - Maps topics to curriculum
   - Generates prep lessons 1-3 days before school teaches
   - Inserts into daily_schedule table

3. **Syllabus Page** (`app/kid/[id]/syllabus/page.tsx`)
   - Displays weekly prep schedule
   - Shows lessons grouped by week
   - "Scan Syllabus Now" prompt if no syllabus exists

## Deployment Steps

### 1. Deploy the Edge Function

**Option A: Using the deployment script**
```bash
# Run the batch file
deploy-analyze-syllabus.bat
```

**Option B: Manual deployment**
```bash
cd C:\Users\DAD\Desktop\SchoolGenius-Final
supabase functions deploy analyze-syllabus --project-ref nnwvzuvebcqrpjuqjlzb
```

### 2. Set Environment Variables

Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets

Add the following environment variable:
- `XAI_API_KEY`: Your xAI Grok API key

(Note: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are already available by default)

### 3. Verify Deployment

Check that the function appears in Supabase Dashboard:
- Go to Edge Functions section
- You should see "analyze-syllabus" listed
- Status should be "Active"

## Testing the Complete Workflow

### Test 1: Scan a Syllabus

1. Go to: `http://localhost:3000/kid/[kid-id]/scan`
2. Select "Syllabus" as document type
3. Upload a test syllabus image (or take photo)
4. Click "Scan & Analyze"

**Expected Result:**
- Document saved to kid_scanned_docs table
- Console shows: "📋 Syllabus detected - calling Grok..."
- Console shows: "✅ Generated X prep lessons"

### Test 2: Check Database

Open Supabase SQL Editor and run:

```sql
-- Check if syllabus was saved
SELECT * FROM kid_scanned_docs
WHERE doc_type = 'syllabus'
ORDER BY created_at DESC
LIMIT 1;

-- Check if prep lessons were generated
SELECT * FROM daily_schedule
WHERE from_syllabus = true
ORDER BY date ASC;
```

**Expected Result:**
- Should see syllabus entry in kid_scanned_docs
- Should see multiple lessons in daily_schedule with from_syllabus=true

### Test 3: View Schedule

1. Go to: `http://localhost:3000/kid/[kid-id]/syllabus`
2. Should see weekly schedule of prep lessons
3. Each lesson should show:
   - Date
   - Subject code
   - Title
   - Description
   - Estimated time
   - "Start" button

**Expected Result:**
- Lessons grouped by week
- "Week of [date]" headers
- Formatted lesson cards with all info

## Troubleshooting

### Problem: "Grok API error: 401 Unauthorized"
**Solution:** XAI_API_KEY not set or invalid
- Go to Supabase Dashboard → Edge Functions → Secrets
- Add XAI_API_KEY with valid key
- Redeploy function

### Problem: "Grok returned invalid JSON"
**Solution:** Grok's response wasn't properly formatted
- Check Edge Function logs in Supabase Dashboard
- Look for the actual Grok response
- May need to adjust prompt or JSON parsing

### Problem: No lessons showing on syllabus page
**Possible causes:**
1. Grok function failed (check logs)
2. Lessons inserted but query is wrong (check database)
3. No syllabus scanned yet (should show "Scan Syllabus Now" button)

### Problem: Dates are wrong
**Solution:** Grok may be interpreting dates incorrectly
- Check if syllabus has clear dates
- May need to adjust Grok prompt to handle date formats better
- Check timezone handling

## Viewing Logs

### Edge Function Logs:
1. Go to Supabase Dashboard
2. Edge Functions → analyze-syllabus
3. Click "Logs" tab
4. Should see all console.log outputs

### Next.js API Logs:
- Check terminal where `npm run dev` is running
- Should see "📋 Syllabus detected" messages
- Should see "✅ Generated X prep lessons" messages

## Database Schema Reference

### daily_schedule table
```sql
- id: uuid
- child_id: uuid
- date: date
- order_index: integer
- lesson_type: text (should be "prep")
- subject_code: text (MATH, READING, etc.)
- title: text
- description: text
- estimated_minutes: integer
- completed: boolean
- from_syllabus: boolean (TRUE for syllabus-generated lessons)
- created_at: timestamp
```

### kid_scanned_docs table
```sql
- id: uuid
- student_id: uuid
- doc_type: text (should be "syllabus")
- image_url: text
- extracted_text: text
- ai_summary: text
- subject: text
- created_at: timestamp
```

## System Flow Diagram

```
1. Kid scans syllabus
   ↓
2. app/api/scan-document/route.ts
   - Uploads image to storage
   - Calls Gemini to extract text
   - Saves to kid_scanned_docs
   ↓
3. Detects docType === 'syllabus'
   ↓
4. Calls analyze-syllabus Edge Function
   - Gets child's grade level
   - Calls Grok with syllabus text
   - Parses Grok's prep lesson suggestions
   - Inserts into daily_schedule
   ↓
5. Kid views /kid/[id]/syllabus
   - Queries daily_schedule where from_syllabus=true
   - Displays weekly prep schedule
   ↓
6. Kid clicks "Start" on a lesson
   - Goes to /kid/[id] dashboard
   - Can access the prep lesson
```

## Success Criteria

✅ Edge Function deploys without errors
✅ Scanning syllabus saves to kid_scanned_docs
✅ Grok generates prep lessons
✅ Lessons appear in daily_schedule with from_syllabus=true
✅ Syllabus page displays weekly schedule
✅ Lessons are scheduled BEFORE school teaches the topic
✅ All data persists across page refreshes

## Future Enhancements

- [ ] Add Claude analysis for scanned homework/tests
- [ ] Create parent dashboard showing all scanned docs
- [ ] Add test score tracking and weak area identification
- [ ] Implement adaptive learning based on test performance
- [ ] Add calendar integration for test dates
- [ ] Create notifications for upcoming prep lessons

## Contact

If you encounter issues not covered here, check:
1. Supabase Edge Function logs
2. Next.js terminal output
3. Browser console (F12)
4. Database queries in SQL Editor
