# 🧪 Quick Test Instructions

## ✅ Step 1: Verify XAI_API_KEY is Set

**IMPORTANT:** Before testing, make sure you set the XAI_API_KEY in Supabase:

1. Go to: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/settings/functions
2. Look for "XAI_API_KEY" in the secrets list
3. If not there, click "Add new secret":
   - Name: `XAI_API_KEY`
   - Value: `YOUR_XAI_API_KEY_HERE` (from .env file)
   - Click "Save"

## 📋 Step 2: Open the Scan Page

**For Colt Hayward (3rd Grade):**
http://localhost:3000/kid/8152f135-184f-423e-9bc4-17bb1abc22c4/scan

**For Test Kid:**
http://localhost:3000/kid/b975e8f3-b26c-4c64-9a40-b6b64809bbed/scan

## 📸 Step 3: Prepare a Test Syllabus

You can use either:

### Option A: Create a Simple Text Image
Create a text file and take a screenshot of it with this content:

```
Math Syllabus - Grade 3
January 2026

Week of January 20:
- Fractions: Introduction to halves and quarters
- Practice: Comparing fractions

Week of January 27:
- Multiplication Tables: 2s, 5s, and 10s
- Word Problems: Using multiplication

Week of February 3:
- Division Basics: Sharing equally
- Practice: Division with remainders

Reading Schedule
January 22: Chapter book analysis - Charlotte's Web
January 29: Poetry unit - Rhyming patterns
February 5: Non-fiction comprehension

Test Dates:
- Math Test: February 7
- Reading Quiz: January 31
```

### Option B: Use Any Real School Syllabus
- Take a photo of any school syllabus you have
- Can be from any subject (Math, Reading, Science, etc.)
- Just needs to have dates and topics

## 🎯 Step 4: Scan the Syllabus

1. On the scan page, select "Syllabus" from the document type dropdown
2. Click "Choose File" or "Take Photo"
3. Upload your test image
4. Click "Scan & Analyze"
5. **Wait 30-45 seconds** (Don't refresh!)

## 👀 Step 5: Watch for Success

**In the browser:**
- Should see "Document scanned successfully!" message
- Page may redirect or show success

**In the terminal (SchoolGenius-Final folder):**
Look for these logs:
```
📋 Syllabus detected - calling Grok to generate prep schedule...
✅ Generated X prep lessons
```

**If you see errors:**
- Check browser console (F12) → Console tab
- Check terminal for error messages
- Most common: XAI_API_KEY not set in Supabase

## 📅 Step 6: View the Prep Schedule

**For Colt Hayward:**
http://localhost:3000/kid/8152f135-184f-423e-9bc4-17bb1abc22c4/syllabus

**For Test Kid:**
http://localhost:3000/kid/b975e8f3-b26c-4c64-9a40-b6b64809bbed/syllabus

**You should see:**
- Weekly sections: "Week of January 13", "Week of January 20", etc.
- Lesson cards with:
  - Date (e.g., "Fri, Jan 17")
  - Subject badge (e.g., "MATH")
  - Lesson title (e.g., "Fractions Prep: What is a Fraction?")
  - Description
  - Time estimate (e.g., "25 min")
  - "Start" button

## ✅ Success Criteria

- [ ] Syllabus scan completes without errors
- [ ] Console shows "📋 Syllabus detected"
- [ ] Console shows "✅ Generated X prep lessons"
- [ ] Syllabus page shows weekly schedule
- [ ] Lessons are scheduled BEFORE school teaches them
- [ ] All lesson details are visible

## 🔍 Troubleshooting

### "Grok API error: 401 Unauthorized"
→ XAI_API_KEY not set in Supabase Dashboard (see Step 1)

### Scan page shows error
→ Check browser console (F12) for specific error
→ Check terminal for backend logs

### No lessons appear on syllabus page
→ Check database:
```bash
node verify-syllabus-system.js
```

### "Function not found"
→ Edge Function not deployed (already fixed, but can redeploy):
```bash
deploy-analyze-syllabus.bat
```

## 📊 Verify in Database

After scanning, check if data was saved:

```bash
node verify-syllabus-system.js
```

Should show:
- ✅ Found 1 scanned syllabus document
- ✅ Found X prep lessons

## 🎉 What Happens Next?

Once the test works:
1. Kid can see their personalized prep schedule
2. Lessons are dated BEFORE school teaches the topic
3. Kid clicks "Start" to begin learning
4. Kid shows up to class already prepared!

## Next Tests After This Works:

1. Scan homework → Should save to kid_homework table
2. Scan calendar → Should save events to kid_school_events
3. Test with multiple syllabi → Each kid gets their own schedule
4. Complete a lesson → Mark as completed in database

## Need Help?

Check these files:
- `SYLLABUS-DEPLOYMENT-GUIDE.md` - Full technical guide
- `TESTING-CHECKLIST.md` - Detailed test procedures
- `DEPLOYMENT-SUCCESS.md` - System status

Or run:
```bash
node verify-syllabus-system.js
```
