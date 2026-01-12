# 🔧 FIXES TRACKER
## Project: SchoolGenius
## Updated: January 12, 2026

---

## 🎯 HOW TO USE THIS

**Problem → Solution → Result**

Each fix shows:
- ❌ What was broken
- ✅ What we did to fix it
- 📊 The result (time/money saved, problem eliminated)

**Sections:**
- **ACTIVE FIXES** - Problems we know about, not started
- **IN PROGRESS** - Currently working on
- **COMPLETED FIXES** - Done and verified working

---

## ACTIVE FIXES (Not Started)

### Fix #1: Closed Loop - qa_library Not Being Checked
**Priority:** 🔴 CRITICAL
**Impact:** Costs $10K-$20K/year unnecessarily
**Estimated Time:** 2 hours
**Estimated Savings:** Thousands per year

**❌ THE PROBLEM:**
- Kid asks "What's 3 × 20?"
- Claude answers ($0.02)
- Next kid asks SAME question
- Claude answers AGAIN ($0.02)
- Library never fills, costs never decrease
- With 1,000 students = $10K-$20K/year wasted

**📋 THE SOLUTION:**
1. Update `/app/api/chat/route.ts`
2. Before calling Claude: Check qa_library for existing answer
3. If found → return it (FREE)
4. If not found → call Claude
5. After Claude responds: Save to qa_library
6. Next time = FREE

**📁 FILES TO MODIFY:**
- app/api/chat/route.ts

---

### Fix #2: TTS Audio Not Cached
**Priority:** 🔴 CRITICAL
**Impact:** Costs hundreds/month unnecessarily
**Estimated Time:** 3 hours
**Estimated Savings:** Hundreds per month

**❌ THE PROBLEM:**
- Every time Gigi speaks, we generate audio
- ElevenLabs charges per generation
- Same text = same audio, but we pay every time
- 100 kids hear "Great job!" = 100 generations = $$

**📋 THE SOLUTION:**
1. Update `/app/api/tts/route.ts`
2. Before generating: Check if audio_url exists for this text
3. If exists → return cached URL (FREE)
4. If not → generate audio
5. Upload to Supabase Storage
6. Save audio_url to database
7. Next time = serve cached (FREE)

**📁 FILES TO MODIFY:**
- app/api/tts/route.ts

---

### Fix #3: Multi-Level Explanations Missing
**Priority:** 🟡 IMPORTANT
**Impact:** Kids get stuck, need expensive Claude calls
**Estimated Time:** 15 hours
**Estimated Savings:** Better learning + cost reduction

**❌ THE PROBLEM:**
- Kid doesn't understand
- Clicks "I Don't Get It"
- Immediately calls Claude (expensive)
- Should try Level 1, 2, 3 explanations from library FIRST

**📋 THE SOLUTION:**
1. Create `explanation_library` table (30 min)
2. Create `mistake_patterns` table (30 min)
3. Update Grok prompts to generate 3 levels (2 hours)
4. Build `/app/api/explanations/route.ts` to serve from library
5. Update LessonViewer.tsx for progressive levels (6 hours)
6. Backfill 123 existing lessons (4 hours + $15)

**📁 FILES TO CREATE:**
- Database: explanation_library table
- Database: mistake_patterns table
- app/api/explanations/route.ts

**📁 FILES TO MODIFY:**
- components/LessonViewer.tsx
- supabase/functions/generate-lesson/index.ts

---

### Fix #4: Parent Helper AI Not Built
**Priority:** 🟡 IMPORTANT
**Impact:** Parents need help, no AI assistant available
**Estimated Time:** 3 hours (copy/paste from master files)
**Estimated Savings:** Reduced support tickets

**❌ THE PROBLEM:**
- Complete parent helper system designed
- Full code provided in PARENT-HELPER-AI-COMPLETE.md
- Never implemented
- Parents can't get instant help

**📋 THE SOLUTION:**
1. Copy `/api/parent-help/route.ts` from master files (1 hour)
2. Copy `ParentHelpButton.tsx` from master files (1 hour)
3. Add PARENT_HELPER_PROMPT to prompts.ts (30 min)
4. Add button to parent dashboard (30 min)
5. Pre-generate 200+ FAQ articles with Grok ($10)

**📁 FILES TO CREATE:**
- app/api/parent-help/route.ts
- components/ParentHelpButton.tsx

**📁 FILES TO MODIFY:**
- lib/ai/prompts.ts
- app/dashboard/page.tsx

---

### Fix #5: Story Comprehension Questions Not Generated
**Priority:** 🟢 NICE TO HAVE (FUTURE)
**Impact:** Stories exist, no comprehension testing
**Estimated Time:** 6 hours to build + 24 hours to run
**Estimated Cost:** $1,000 one-time

**❌ THE PROBLEM:**
- 2,210 stories exist
- No comprehension questions generated
- Kids read but don't get tested on understanding
- Need 10 questions per story = 22,000 questions

**📋 THE SOLUTION:**
1. Create `generate-story-questions` Edge Function (6 hours)
2. Run generation overnight (24 hours, $1,000)
3. Update story quiz page to load questions
4. Test full reading → quiz flow

**📁 FILES TO CREATE:**
- supabase/functions/generate-story-questions/index.ts

**📁 FILES TO MODIFY:**
- app/kid/[id]/reading/[storyId]/quiz/page.tsx
- app/kid/[id]/reading/[storyId]/quiz/StoryQuizPage.tsx

---

## IN PROGRESS

[Currently working on fixes go here]

---

## COMPLETED FIXES

[Completed fixes listed here in reverse chronological order - newest first]

---

## 📊 SUMMARY

**Total Active Fixes:** 5
- 🔴 CRITICAL: 2 (closed loop, audio caching)
- 🟡 IMPORTANT: 2 (multi-level explanations, parent helper)
- 🟢 NICE TO HAVE: 1 (story questions)

**Estimated Total Time:** 29 hours
**Estimated Total Savings:** $10K-$20K/year + better UX
**One-Time Costs:** $1,025 ($1,000 story questions + $25 other)

**Recommended Order:**
1. Fix #1 (2 hours) - Immediate cost savings
2. Fix #2 (3 hours) - Immediate cost savings
3. Fix #4 (3 hours) - Easy win, complete code provided
4. Fix #3 (15 hours) - Better learning outcomes
5. Fix #5 (30 hours) - Future enhancement

---

**Last Updated:** January 12, 2026
