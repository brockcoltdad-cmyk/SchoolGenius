# MASTER SEEDING GUIDE - SCHOOLGENIUS

**Purpose:** This is the MASTER file. Read this FIRST before doing ANY seeding work.
**Last Updated:** 2026-01-16 (Late Evening)
**Status:** BUILDING STRUCTURE + ADAPTIVE LEARNING DEFINED

---

## STOP - READ THIS FIRST

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CRITICAL RULES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. UNDER 13 (K-7) = NO LIVE AI - All content MUST be pre-seeded            │
│  2. ALL content MUST use tier1/tier2 format with visuals                    │
│  3. Follow Arizona Standards (or ISTE/industry if no state standard)        │
│  4. READ the subject-specific README BEFORE generating ANY content          │
│  5. DO NOT generate content until checklist is complete                     │
│                                                                             │
│  IF YOU DON'T FOLLOW THESE RULES, THE CONTENT WILL BE DELETED.              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## PHIL'S 99/1 RULE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WORK DISTRIBUTION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Claude does 99%: code, research, debugging, seeding, everything            │
│  Phil does 1%: API keys, approving decisions, "yes/no"                      │
│                                                                             │
│  DO NOT ask Phil to read code or make technical decisions.                  │
│  JUST DO IT. Report results when done.                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## FILE STRUCTURE

```
SchoolGenius-Final/
│
├── README-MASTER-SEEDING.md          ← YOU ARE HERE (read first)
├── README-SEEDING-CHECKLIST.md       ← Overall progress checklist
│
├── seeding/                          ← WORKING folder (subjects in progress)
│   ├── README-TYPING-SEEDING.md
│   ├── README-CODING-SEEDING.md
│   ├── README-MATH-SEEDING.md
│   ├── README-READING-SEEDING.md
│   ├── README-SPELLING-SEEDING.md
│   └── README-WRITING-SEEDING.md
│
├── library/                          ← FINISHED folder (completed subjects)
│   └── (files move here when 100% done)
│
└── backups/                          ← Backup files
    ├── gradual-release-format-items.json (45,291 items)
    └── simple-format-items.json (996 items)
```

---

## WORKFLOW - HOW TO SEED A SUBJECT

```
STEP 1: READ the subject's README file in seeding/ folder
        ↓
STEP 2: VERIFY all checklist items in that file are complete
        ↓
STEP 3: GENERATE content following the exact format
        ↓
STEP 4: AUDIT the generated content matches the rules
        ↓
STEP 5: CHECK database format is correct
        ↓
STEP 6: UPLOAD to database
        ↓
STEP 7: VERIFY upload worked correctly
        ↓
STEP 8: UPDATE the subject README (add to change log, check off items)
        ↓
STEP 9: When ALL items checked → MOVE file to library/ folder
```

---

## SUBJECT STATUS (Quick Reference)

| Subject | README Location | Status | Items in DB | Target |
|---------|-----------------|--------|-------------|--------|
| Typing | `seeding/README-TYPING-SEEDING.md` | READY TO SEED | 0 | 10,000 |
| Coding | `seeding/README-CODING-SEEDING.md` | READY TO SEED | 0 | 12,000 |
| Math | `seeding/README-MATH-SEEDING.md` | READY TO SEED | 17,772 | 88,000 |
| Reading | `seeding/README-READING-SEEDING.md` | READY TO SEED | 0 | 52,000 |
| Spelling | `seeding/README-SPELLING-SEEDING.md` | READY TO SEED | 0 | 26,000 |
| Writing | `seeding/README-WRITING-SEEDING.md` | READY TO SEED | 0 | 12,000 |
| **TOTAL** | | | **17,772** | **200,000** |

**ALL 6 SUBJECT READMEs COMPLETE - READY TO BEGIN SEEDING**

---

## REQUIRED FORMAT (ALL SUBJECTS)

Every item MUST have this structure:

```json
{
  "id": "{SUBJECT}-G{GRADE}-{SKILL}-{NUMBER}",
  "subject": "typing|coding|math|reading|spelling|writing",
  "grade": 0-7,
  "skill": "human readable skill name",
  "standard": "Arizona code OR ISTE code OR 'N/A'",
  "question": "the question or prompt",
  "answer": "correct answer",
  "tier1": {
    "teach": "explanation (max 25 words)",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "visual_type_from_subject_list",
          "data": { ... }
        },
        "voice_text": "narration (max 20 words)",
        "duration": 3000-6000
      }
    ]
  },
  "tier2": {
    "teach": "simpler explanation (max 20 words)",
    "steps": [
      {
        "step": 1,
        "visual": { ... },
        "voice_text": "simpler narration (max 15 words)",
        "duration": 3000-6000
      }
    ]
  }
}
```

---

## STANDARDS REFERENCE

| Subject | Standard Type | Source |
|---------|--------------|--------|
| Math | Arizona Math Standards | State of Arizona |
| Reading | Arizona ELA + Lexile Levels | State of Arizona + MetaMetrics |
| Spelling | Arizona ELA (RF codes) | State of Arizona |
| Writing | Arizona ELA (W/L codes) | State of Arizona |
| Coding | ISTE Standards | International (Arizona adopted) |
| Typing | Industry Standard (WPM) | No state standard exists |

---

## WHAT WE LEARNED - UNDER 13 TEACHING METHOD

This section documents EVERYTHING we know about how SchoolGenius teaches kids under 13.

### THE VISION (Found in library/)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHIL'S TEACHING PHILOSOPHY                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. RULES FIRST - Kid learns the RULE before ANY practice                   │
│  2. ALL UNLOCKED - Kids can jump to any topic (not linear)                 │
│  3. PRACTICE IN CHUNKS - Not 100 problems, do some, learn more, do more    │
│  4. WEEKLY TESTS - Test all rules from that week                           │
│  5. MONTHLY REVIEWS - Comprehensive test of everything                      │
│  6. EVERYTHING PRE-SCRIPTED - No live AI for under 13                      │
│  7. SKILL-BASED, NOT GRADE-LOCKED - Don't hold smart kids back             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### THE 6-PHASE LESSON STRUCTURE (I DO, WE DO, YOU DO)

Found in: `library/LESSON-FLOW-ARCHITECTURE.md`

This is based on educational research called "Gradual Release of Responsibility":

```
PHASE 1: RULE TEACHING (I DO - Teacher Models)
         Gigi teaches the rule. Kid watches/listens. No interaction yet.
         └── Show the rule with visual aids
         └── Voice narration explains it
         └── Rule card summarizes it
         └── Duration: 2-3 minutes
                ↓
PHASE 2: DEMO PROBLEMS (I DO - Teacher Shows Examples)
         Gigi solves 3 problems while kid watches. Step by step.
         └── Worked examples with visuals
         └── Each step explained
         └── Kid sees HOW to apply the rule
         └── Duration: 3-5 minutes
                ↓
PHASE 3: GUIDED PRACTICE (WE DO - Work Together)
         Kid tries problems WITH hints available. Gigi helps if stuck.
         └── 5 problems per rule
         └── [SHOW HINT] [SHOW RULE] [WATCH DEMO AGAIN] buttons
         └── tier1 explanation if wrong
         └── tier2 explanation if wrong again
         └── Duration: 5 minutes
                ↓
PHASE 4: INDEPENDENT PRACTICE (YOU DO - Solo Practice)
         Kid practices alone. No hints. Earns coins.
         └── 10-20 problems
         └── Timer optional
         └── Coins for correct answers
         └── This is the 200K lessons we're seeding!
         └── Duration: 10-15 minutes
                ↓
PHASE 5: RULE QUIZ (Assessment)
         Quick quiz on this rule. Must pass to "master" the rule.
         └── 5-10 questions
         └── 80% to pass
         └── PASS = Rule marked "mastered", badge + coins
         └── FAIL = Back to teaching or demo
         └── Duration: 5 minutes
                ↓
PHASE 6: COMPLETE
         Celebration! Move to next skill or practice mode.
         └── Badge earned
         └── Coins + XP awarded
         └── Unlock next skill OR enter endless practice
```

### THE TWO-TIER EXPLANATION SYSTEM

When a kid gets an answer WRONG, they get help:

```
FIRST WRONG ANSWER → tier1 explanation
   └── Standard explanation (max 25 words)
   └── Visual aid
   └── Voice narration (max 20 words)
   └── "Let me help you understand..."

SECOND WRONG ANSWER → tier2 explanation
   └── SIMPLER explanation (max 20 words)
   └── More concrete visual
   └── Shorter voice narration (max 15 words)
   └── "Let's make this even easier..."
   └── Uses smaller words, more examples
```

### WHAT THE LIBRARY TAUGHT ME

**File: `library/LESSON-FLOW-ARCHITECTURE.md`**
- Your complete vision for how lessons work
- The 6-phase gradual release model
- Content types needed: Rule scripts, Demo problems, Guided practice, Independent practice, Quizzes
- How weekly tests and monthly reviews work
- The UI flow (what screens look like)

**File: `library/SCHOOLGENIUS-MASTER-SEEDING-PROMPT.md`**
- Complete skill lists for ALL 6 subjects, K-7
- All visual types with exact JSON formats
- The 200,000 lesson distribution by subject and grade
- ID format rules
- Word count limits for tier1/tier2

**File: `lib/learning-profile-analyzer.ts`**
- How adaptive learning works in code
- Tracks: accuracy, time per question, help requests, frustration patterns
- Updates profile every 20 questions
- Detects learning style (visual, auditory, reading, kinesthetic)
- Identifies strongest/weakest subjects

**Database Tables Found:**
- `skill_mastery` - Tracks mastery level per skill per child
- `learning_profiles` - AI-powered personalization data
- `answer_attempts` - Every answer tracked for analysis
- `typing_progress`, `reading_progress` - Subject-specific progress

### HOW CONTENT DIFFICULTY ADAPTS (But Themes Stay Age-Appropriate)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SCENARIO: 5-year-old masters Grade 4 multiplication                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CONTENT: Grade 4 difficulty (7 × 8 = 56, multi-step problems)             │
│  THEME: Kindergarten-appropriate (candy, toys, animals)                     │
│                                                                             │
│  WRONG: "Calculate the tax on a $56 purchase at 8.5%"                      │
│  RIGHT: "Emma has 7 bags with 8 candies each. How many candies total?"     │
│                                                                             │
│  Same math skill. Age-appropriate context.                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CROSS-SUBJECT INTEGRATION

Once a kid MASTERS a skill, it becomes a TOOL:

```
TYPING (mastered) → Now used to practice:
   └── Spelling words (TTS says word, kid types it)
   └── Writing sentences (type sentences from writing curriculum)
   └── Reading passages (type what you read)
   └── Code snippets (type Python/Scratch code)

SPELLING (mastered) → Feeds into:
   └── Typing practice content
   └── Writing (knows how to spell words for essays)
   └── Reading (can decode words they've spelled)

READING (mastered) → Feeds into:
   └── Typing passages
   └── Writing (reads examples of good writing)
   └── All subjects (can read instructions)
```

### THE MASTERY PROGRESSION

```
Level 0: NOT STARTED     → Kid hasn't touched this skill
Level 1: LEARNING        → Started the lesson, still in Phase 1-3
Level 2: PRACTICED       → Finished lesson, quiz score < 80%
Level 3: PASSED          → Quiz score 80%+
Level 4: MASTERED        → 90%+ on 3 practice sessions
Level 5: ADVANCED        → Moved to next skill level (can exceed enrolled grade)
```

### COPPA COMPLIANCE SUMMARY

```
FOR UNDER 13:
✓ ALL content pre-seeded (no live AI)
✓ Maximum: Grade 7 content (even if kid is smarter)
✓ Themes always kid-appropriate
✓ No personal data beyond learning progress
✓ Parent controls everything
✓ No social features
✓ Gigi = pre-scripted responses only
```

---

## ADAPTIVE LEARNING (NEW)

**READ THIS:** `ULTIMATE-PLAN-ADAPTIVE-LEARNING.md`

Key points:
- **SKILL LEVEL, not grade level** - Don't hold kids back
- **100% mastery = move up** - Automatic advancement
- **Under 13 caps at Grade 7** - COPPA compliance
- **Themes stay age-appropriate** - Content difficulty can advance, themes stay kid-friendly
- **Cross-subject integration** - Typing pulls from spelling, writing, reading
- **Practice mode after mastery** - Endless reinforcement options

---

## QUICK LINKS

- **Claude's Notes:** `CLAUDE-SESSION-NOTES.md` ← FOR CLAUDE TO READ
- **Adaptive Learning Plan:** `ULTIMATE-PLAN-ADAPTIVE-LEARNING.md`
- **Overall Checklist:** `README-SEEDING-CHECKLIST.md`
- **Word Lists:** `library/dolch-sight-words.json`, `library/fry-1000-sight-words.json`
- **Lesson Flow Architecture:** `library/LESSON-FLOW-ARCHITECTURE.md`
- **Master Seeding Prompt:** `library/SCHOOLGENIUS-MASTER-SEEDING-PROMPT.md`
- **Backups:** `backups/` folder

---

## CHANGE LOG

### 2026-01-16 (Late Evening - Part 3)
- Created CLAUDE-SESSION-NOTES.md (Claude's internal notes)
- Subject-by-subject status with what's done vs missing
- Questions to resolve listed
- How to continue session documented

### 2026-01-16 (Late Evening - Part 2)
- Added "WHAT WE LEARNED" section documenting everything about under-13 teaching
- Captured Phil's vision from library files
- Documented 6-phase lesson structure
- Documented tier1/tier2 system
- Documented what was found in library/ folder
- Documented cross-subject integration
- Documented mastery progression levels

### 2026-01-16 (Late Evening - Part 1)
- Created ULTIMATE-PLAN-ADAPTIVE-LEARNING.md
- Defined skill-based progression (not grade-locked)
- Defined cross-subject integration (typing + spelling, etc.)
- Defined theme vs content separation
- Added adaptive learning section to this file

### 2026-01-16 (Evening)
- Created ALL 6 subject README files in seeding/ folder
- All subjects now READY TO SEED
- Each file contains: standards, visual types, skills, examples, checklist

### 2026-01-16 (Earlier)
- Created master seeding guide
- Established folder structure (seeding/ for working, library/ for finished)
- Set up workflow process

---

*This is the MASTER file. Always read this first before any seeding work.*
