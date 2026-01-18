# LESSONS LEARNED - DO NOT REPEAT THESE MISTAKES

**Purpose:** This file documents mistakes made in previous sessions. READ THIS BEFORE BUILDING ANYTHING.

**Last Updated:** 2026-01-13

---

## MISTAKE #1: Building Without Checking the Checklist

**What Happened:**
- Built features without validating against MASTER-RULES-CHECKLIST.md
- Result: Features didn't meet requirements, had to redo work

**The Fix:**
BEFORE writing ANY code:
1. Read `knowledge-library/schoolgenius/MASTER-RULES-CHECKLIST.md`
2. Extract the relevant checklist items for the feature
3. Write out the checklist with [ ] checkboxes
4. Show the user the checklist for approval
5. THEN build

**Example:**
```
Building: Spelling Interface
Checklist:
[x] Audio pronunciation (ElevenLabs TTS)
[x] Text input (NOT multiple choice)
[x] Type word 3 times to master
[x] Phonics rules shown
[ ] Arizona-aligned word lists ← MISSING, need to verify
```

---

## MISTAKE #2: Not Saving Brainstorms Completely

**What Happened:**
- User brainstormed 50-100 reading categories
- Only saved partial list (~25 categories)
- User frustrated when full list wasn't there

**The Fix:**
When user says "save this" or "we'll use this later":
1. IMMEDIATELY save to a file in the project
2. Use descriptive filename: `BRAINSTORM-[topic]-[date].md`
3. Save EVERYTHING - don't summarize or truncate
4. Confirm with user: "Saved to [filename]"

---

## MISTAKE #3: Grok Content Doesn't Meet Specs

**What Happened:**
- Grok edge functions generate generic multiple-choice content
- Content doesn't include: Arizona standards, Lexile levels, visual data, phonics rules
- Specialized lesson players exist but content doesn't match their needs

**The Fix:**
Before generating ANY content with Grok:
1. Check `GROK-PROMPT-REQUIREMENTS.md` for subject-specific prompts
2. Include ALL required fields in the prompt
3. Verify output has the required structure
4. Test with the specialized lesson player

**Required by Subject:**
- Math: `visual_type`, `visual_data`, Arizona standards
- Reading: `lexile_level`, 10 comprehension questions, vocabulary
- Spelling: `phonics_rules`, audio script, word breakdown
- Typing: Built-in content (no Grok needed)
- Coding: `starter_code`, `solution`, `expected_output`

---

## MISTAKE #4: Building Orphaned Components

**What Happened:**
- Created 21 visual components in `/components/lesson/visuals/`
- NONE were integrated into the lesson player
- Components sat unused for weeks

**The Fix:**
When building a component:
1. Build the component
2. IMMEDIATELY integrate it into the parent page/component
3. Test the full flow end-to-end
4. Don't mark as "done" until it's actually USED

**Rule:** No orphaned code. If it's not connected, it doesn't exist.

---

## MISTAKE #5: Not Verifying End-to-End

**What Happened:**
- Built API routes that were never called
- Built UI components that were never rendered
- Database tables that were never queried
- Marked features as "complete" when they didn't work

**The Fix:**
Before marking ANYTHING complete:
1. Database table exists AND has data
2. API endpoint works (test with actual request)
3. Frontend page calls the API
4. UI displays the response
5. User can interact with it
6. Tested as a real user, not developer

---

## MISTAKE #6: Assuming Instead of Reading

**What Happened:**
- Made assumptions about what code exists
- Didn't read existing files before modifying
- Broke working code by not understanding it first

**The Fix:**
ALWAYS read before writing:
1. Read the file you're about to modify
2. Understand the existing patterns
3. Check for related files that might be affected
4. THEN make changes

---

## MISTAKE #7: Not Using the Tiered AI System

**What Happened:**
- Called expensive AI models for simple tasks
- Didn't check library/cache before making AI calls
- Wasted money on repeat queries

**The Fix:**
Follow the tiered system:
1. **First:** Check library tables (qa_library, explanation_library, etc.)
2. **If not found:** Use Haiku for simple responses
3. **If complex:** Use Opus, then SAVE to library
4. **Bulk generation:** Use Grok seeding scripts

**Goal:** First request costs $$, all future requests = FREE

---

## MISTAKE #8: Generic Feedback Instead of Themed

**What Happened:**
- Used generic "Good job!" messages
- Didn't use kid's selected theme for feedback
- Missed opportunity for engagement

**The Fix:**
ALWAYS use themed feedback:
1. Get kid's theme from context/database
2. Use `getSmartThemeMessage(context)` function
3. Never use generic encouragement
4. File: `lib/theme-encouragement-messages.ts`

---

## RULES FOR EVERY SESSION

### Before Starting Work:
1. Read this file (LESSONS-LEARNED.md)
2. Read MASTER-RULES-CHECKLIST.md
3. Ask: "What are we building today?"
4. Create checklist for the specific feature
5. Get user approval on checklist
6. THEN start building

### While Building:
1. Check off items as you complete them
2. Save important brainstorms immediately
3. Integrate components as you build them (no orphans)
4. Test end-to-end before marking complete

### Before Saying "Done":
1. Verify against checklist
2. Test as a real user
3. Confirm data flows from DB → API → UI → User
4. No "Coming Soon" placeholders

---

## USER PREFERENCES (Dad/Phillip)

1. **Simple over complex** - Don't over-engineer
2. **Cache everything** - First request costs, future = FREE
3. **Theme-based everything** - Kids love their themes
4. **No coin penalties** - Only earn, never lose
5. **Rules taught FIRST** - Before practice, not after
6. **Arizona standards** - NOT Common Core
7. **Visual for younger kids** - K-5 needs pictures, manipulatives
8. **Test everything** - If it's not tested, it's not done

---

## CRITICAL RULE: ADAPTIVE LEVEL, NOT GRADE LEVEL

### The Rule:
**Content is organized by SKILL LEVEL, not grade. Kids access content at THEIR assessed level.**

### Why This Matters:
- A 3rd grader might read at 6th grade Lexile level → Give them 6th grade content
- A 7th grader might be at 2nd grade math level → Start them at 2nd grade content
- Grade is just enrollment. LEVEL is where they actually perform.

### How It Works:

**1. Placement Assessment:**
- When kid joins, assess their ACTUAL level per subject
- Don't assume grade = level
- Stealth placement through initial questions

**2. Content Access:**
- ALL content is available by LEVEL (Lexile, skill difficulty)
- Kid's assessed level determines what they SEE
- Not locked by grade - locked by demonstrated ability

**3. Progression:**
- As they master content, unlock NEXT level
- A 3rd grader can reach 12th grade reading if they're capable
- A struggling 7th grader can work at 2nd grade without shame

**4. Every Subject:**
- Reading: Lexile level (BR → 1500L)
- Math: Skill progression (counting → calculus)
- Spelling: Phonics rules → advanced vocabulary
- Typing: WPM levels (beginner → professional)
- Coding: Block-based → real programming

### Database Implementation:
```
- Content stored by LEVEL, not grade
- Kid profile has: grade_enrolled (their school grade)
- Kid profile has: level_assessed (per subject - their ACTUAL level)
- Content queries use level_assessed, NOT grade_enrolled
```

### Example:
```
Emma - Grade 3, but assessed at:
- Reading: Lexile 800L (6th grade level) → sees 6th grade stories
- Math: Level 3.2 (on track) → sees 3rd grade math
- Spelling: Level 2.5 (slightly behind) → sees late 2nd grade words
```

### The Goal:
**Challenge advanced kids. Support struggling kids. No shame, just growth.**

This is what makes us ADAPTIVE, not just another grade-based curriculum.

### CRITICAL DISTINCTION:

| Aspect | Based On | Example |
|--------|----------|---------|
| **Theme/UI** | AGE (keep them kids) | 3rd grader sees Fortnite theme |
| **Gigi Tone** | AGE (age-appropriate) | 3rd grader gets cute, encouraging messages |
| **Animations** | AGE (fun and giggly) | 3rd grader sees fun coin bursts, confetti |
| **Content Difficulty** | LEVEL (challenge them) | 3rd grader at 6th grade Lexile reads harder stories |
| **Problems/Questions** | LEVEL (push growth) | 3rd grader at 6th grade math gets harder problems |

**RULE: Keep them kids in the EXPERIENCE. Challenge them in the LEARNING.**

A 7-year-old working at 12th grade reading level should:
- Still have their unicorn theme
- Still get "You're doing AMAZING! ✨" from Gigi
- Still earn coins with sparkle animations
- BUT read complex 1500L Lexile texts
- BUT answer sophisticated comprehension questions

**We don't want them to grow up too fast in the FUN stuff, but we want them to grow academically.**

---

## QUICK REFERENCE: Key Files to Read

| File | Purpose | Location |
|------|---------|----------|
| MASTER-RULES-CHECKLIST.md | Validation checklist | knowledge-library/schoolgenius/ |
| IDEAS-AND-IMPLEMENTATION-GUIDE.md | All planned features | knowledge-library/schoolgenius/ |
| GROK-PROMPT-REQUIREMENTS.md | Subject-specific prompts | SchoolGenius-Final/ |
| theme-encouragement-messages.ts | Themed feedback | lib/ |
| FUTURE-IDEAS.md | On-demand library concept | SchoolGenius-Final/ |

---

*Add new lessons to this file as mistakes are discovered.*
*This is how we get better - by not repeating the same errors.*
