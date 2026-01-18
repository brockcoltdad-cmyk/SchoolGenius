# CLAUDE SESSION NOTES - SCHOOLGENIUS
## Internal Notes for Claude AI Sessions

**Purpose:** These are Claude's notes. If a session disconnects, the next Claude reads this to understand where we are.
**Last Updated:** 2026-01-16 (Late Evening)
**Current Task:** Organizing subjects one by one, ensuring nothing is missing

---

## WHAT I (CLAUDE) LEARNED FROM THE LIBRARY

When I searched the library folder, I found Phil's complete vision already documented. Here's what exists:

### Files I Found and What They Contain

**1. `library/LESSON-FLOW-ARCHITECTURE.md`** (THE MAIN VISION DOC)
- Phil's complete teaching philosophy
- The 6-phase gradual release model (I Do, We Do, You Do)
- Screen mockups showing what each phase looks like
- Weekly tests and monthly reviews structure
- Research citations backing the approach
- Content types needed: Rule scripts, Demo problems, Guided practice, Independent practice, Quizzes

**2. `library/SCHOOLGENIUS-MASTER-SEEDING-PROMPT.md`** (2200+ lines)
- Complete skill lists for ALL 6 subjects, K-7
- Every visual type with exact JSON format
- 200,000 lesson distribution by subject/grade
- ID format rules
- Word count limits (tier1: 25 words max, tier2: 20 words max)

**3. `lib/learning-profile-analyzer.ts`** (Working code)
- Analyzes every answer
- Detects learning style (visual, auditory, reading, kinesthetic)
- Tracks frustration threshold
- Updates profile every 20 questions
- Identifies strongest/weakest subjects

**4. Database tables already exist:**
- `skill_mastery` - Per-skill progress
- `learning_profiles` - Personalization
- `answer_attempts` - Every answer tracked
- `typing_progress`, `reading_progress`, etc.

**5. `library/dolch-sight-words.json`** - 315 sight words
**6. `library/fry-1000-sight-words.json`** - 1000 sight words
**7. `library/academic-word-list.json`** - 570 academic words

---

## PHIL'S VISION (SUMMARIZED)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHIL'S TEACHING RULES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. RULES FIRST - Learn the rule BEFORE any practice                        │
│  2. ALL UNLOCKED - Kids can jump to any topic (not linear)                 │
│  3. CHUNKS NOT MARATHONS - Do some, learn more, do more                    │
│  4. WEEKLY TESTS - Test all rules from that week                           │
│  5. MONTHLY REVIEWS - Comprehensive test of everything                      │
│  6. PRE-SCRIPTED ONLY - No live AI for under 13 (COPPA)                    │
│  7. SKILL-BASED - Don't hold smart kids back by grade                      │
│  8. 99/1 RULE - Claude does 99%, Phil approves                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## THE 6-PHASE LESSON STRUCTURE

This is how EVERY lesson works:

```
PHASE 1: RULE TEACHING (2-3 min)
   └── Gigi teaches the rule
   └── Visual aids + voice narration
   └── Kid watches, no interaction

PHASE 2: DEMO PROBLEMS (3-5 min)
   └── Gigi solves 3 problems step-by-step
   └── Kid watches HOW to apply the rule

PHASE 3: GUIDED PRACTICE (5 min)
   └── Kid tries 5 problems WITH hints
   └── tier1 help if wrong
   └── tier2 help if wrong again

PHASE 4: INDEPENDENT PRACTICE (10-15 min)
   └── Kid does 10-20 problems alone
   └── No hints, earns coins
   └── THIS IS THE 200K LESSONS WE'RE SEEDING

PHASE 5: QUIZ (5 min)
   └── 5-10 questions, 80% to pass
   └── Pass = mastered, badge + coins
   └── Fail = back to teaching

PHASE 6: COMPLETE
   └── Celebration, move on
```

---

## TIER1/TIER2 EXPLANATION SYSTEM

```
FIRST WRONG → tier1
   - Standard explanation (max 25 words)
   - Visual aid
   - Voice narration (max 20 words)

SECOND WRONG → tier2
   - SIMPLER explanation (max 20 words)
   - More concrete visual
   - Shorter voice (max 15 words)
   - Smaller words, more examples
```

---

## ADAPTIVE LEARNING RULES (From Phil)

```
1. SKILL LEVEL, NOT GRADE - Kid can advance beyond enrolled grade
2. 100% MASTERY = MOVE UP - Score 95%+ on 3 sessions, offer next level
3. UNDER 13 CAPS AT GRADE 7 - COPPA compliance
4. THEMES STAY AGE-APPROPRIATE - 5-year-old doing G4 math gets kid themes
5. CROSS-SUBJECT - Typing uses spelling words, sentences, passages
6. ENDLESS PRACTICE - After mastery, unlimited practice options
```

---

## CRITICAL FIX NEEDED BEFORE MOVING ON

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FIX THIS FIRST!                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FOUND: 17,772 items in database (Math K-1)                                │
│                                                                             │
│  FORMAT CHECK:                                                              │
│  ✓ tier1 with teach, steps, visual, voice_text, duration - GOOD            │
│  ✓ tier2 with teach, steps, visual, voice_text, duration - GOOD            │
│  ✓ visual_type - GOOD                                                      │
│  ✓ visual_data - GOOD                                                      │
│  ✗ standard (Arizona codes) - MISSING on ALL 17,772 items                  │
│                                                                             │
│  ACTION REQUIRED:                                                           │
│  1. Map each skill to Arizona Math Standard code                           │
│  2. Update all 17,772 items with correct standard codes                    │
│  3. Verify update worked                                                   │
│  4. THEN move on to other subjects                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Skills That Need Arizona Codes (Math K-1)

Based on database check, these skills exist but need standard codes:

**Kindergarten Math Skills → Arizona Codes Needed:**
| Skill in Database | Arizona Standard Code |
|-------------------|----------------------|
| counting to 10 | K.CC.A.1 |
| counting to 20 | K.CC.A.1 |
| number recognition | K.CC.A.3 |
| counting objects | K.CC.B.4 |
| comparing numbers | K.CC.C.6 |
| addition within 5 | K.OA.A.1 |
| subtraction within 5 | K.OA.A.1 |
| addition within 10 | K.OA.A.2 |
| subtraction within 10 | K.OA.A.2 |
| shapes | K.G.A.1 |
| (need to verify full list) | |

**Grade 1 Math Skills → Arizona Codes Needed:**
| Skill in Database | Arizona Standard Code |
|-------------------|----------------------|
| addition within 20 | 1.OA.C.6 |
| subtraction within 20 | 1.OA.C.6 |
| addition within 100 | 1.NBT.C.4 |
| place value | 1.NBT.B.2 |
| comparing numbers | 1.NBT.B.3 |
| (need to verify full list) | |

### Fix Script Needed

```javascript
// Pseudo-code for what needs to happen
const skillToStandard = {
  // Kindergarten
  'counting to 10': 'K.CC.A.1',
  'counting to 20': 'K.CC.A.1',
  'addition within 5': 'K.OA.A.1',
  'addition within 10': 'K.OA.A.2',
  // Grade 1
  'addition within 20': '1.OA.C.6',
  'subtraction within 20': '1.OA.C.6',
  // ... etc
};

// For each skill, update all items
for (const [skill, standard] of Object.entries(skillToStandard)) {
  await supabase
    .from('practice_problems')
    .update({ standard: standard })
    .eq('skill', skill);
}
```

---

## SUBJECT-BY-SUBJECT STATUS

### SUBJECT 1: TYPING

**README Location:** `seeding/README-TYPING-SEEDING.md`

**What's Defined:**
- [x] Skills by grade (K-7)
- [x] WPM goals by grade (K: 5 WPM → G7: 35-40 WPM)
- [x] Visual type: `keyboard`
- [x] tier1/tier2 example
- [x] ID format: TYPE-G{grade}-{SKILL}-{number}
- [x] Skill codes (14 codes: HOME, TOPR, BOTR, NUMS, etc.)

**What's In Database:** 0 items

**Target:** 10,000 items

**Standards:** No state standard - uses industry WPM goals

**Cross-Subject Integration:**
- After mastery, typing pulls from:
  - Spelling words (TTS says, kid types)
  - Writing sentences
  - Reading passages
  - Code snippets

**What Might Be Missing:**
- [ ] Practice mode content (separate from lessons?)
- [ ] Speed challenge content
- [ ] Accuracy challenge content
- [ ] Cross-subject practice content format

**NEXT STEPS FOR TYPING:**
1. Review README for completeness
2. Verify all skills are listed
3. Check if practice mode needs separate content
4. Begin seeding

---

### SUBJECT 2: CODING

**README Location:** `seeding/README-CODING-SEEDING.md`

**What's Defined:**
- [x] Skills by grade (K-7)
- [x] ISTE standards mapped
- [x] Visual types: `code_block`, `variable_box`, `loop_animation`, `conditional`, `output`
- [x] tier1/tier2 example
- [x] ID format: CODE-G{grade}-{SKILL}-{number}
- [x] Skill codes

**What's In Database:** 0 items

**Target:** 12,000 items

**Standards:** ISTE (International - Arizona adopted)

**Tools Used:**
- K-2: Scratch Jr
- 3-5: Scratch
- 6-7: Python

**What Might Be Missing:**
- [ ] Project templates (separate from lessons?)
- [ ] Code snippets for typing practice
- [ ] Debugging exercises format

**NEXT STEPS FOR CODING:**
1. Review README for completeness
2. Verify ISTE mapping is complete
3. Check if projects need separate content
4. Begin seeding

---

### SUBJECT 3: MATH

**README Location:** `seeding/README-MATH-SEEDING.md`

**What's Defined:**
- [x] Skills by grade (K-7) - EXTENSIVE list
- [x] Arizona Math Standards mapped
- [x] Visual types: `fraction`, `array`, `place_value`, `number_line`, `counting_objects`, `bar_model`, `balance_scale`, `equation_steps`, `graph`
- [x] tier1/tier2 example
- [x] ID format: MATH-G{grade}-{SKILL}-{number}

**What's In Database:** 17,772 items (K-1 only, need format audit)

**Target:** 88,000 items

**Standards:** Arizona Math Standards (K.CC, OA, NBT, NF, MD, G, RP, NS, EE, SP)

**What Might Be Missing:**
- [ ] Audit of existing 17,772 items for correct format
- [ ] Grades 2-7 content
- [ ] Word problem variations with different themes

**NEXT STEPS FOR MATH:**
1. Audit existing 17,772 items
2. Fix format issues if any
3. Generate grades 2-7
4. Create theme variants

---

### SUBJECT 4: READING

**README Location:** `seeding/README-READING-SEEDING.md`

**What's Defined:**
- [x] Skills by grade (K-7)
- [x] Arizona ELA Standards (RF, RL, RI)
- [x] Lexile levels by grade (BR-200L for K → 1050L-1150L for G7)
- [x] Visual types: `letter`, `phonics`, `word_building`, `sight_word`, `syllable`, `passage`
- [x] tier1/tier2 example
- [x] Word lists linked (Dolch, Fry)

**What's In Database:** 0 items

**Target:** 52,000 items

**Standards:** Arizona ELA + Lexile Levels

**What Might Be Missing:**
- [ ] Actual reading passages (stories)
- [ ] Comprehension questions for passages
- [ ] Phonics drill format
- [ ] Sight word flash card format

**NEXT STEPS FOR READING:**
1. Review README for completeness
2. Define passage/story format
3. Define comprehension question format
4. Begin seeding

---

### SUBJECT 5: SPELLING

**README Location:** `seeding/README-SPELLING-SEEDING.md`

**What's Defined:**
- [x] Skills by grade (K-7)
- [x] Arizona RF/L Standards
- [x] Six Syllable Types (Closed, Open, Silent-e, Vowel Team, R-Controlled, Consonant-le)
- [x] Visual types: `spelling_rule`, `word_building`, `phonics`
- [x] tier1/tier2 example with `audio_word` field
- [x] Word lists linked (Dolch, Fry, Academic)

**What's In Database:** 0 items (but 4,941 in spelling_words table)

**Target:** 26,000 items

**Standards:** Arizona ELA RF codes

**IMPORTANT:** Spelling is AUDIO-BASED. TTS says word, kid types it. NOT multiple choice.

**What Might Be Missing:**
- [ ] Converting existing 4,941 words to lesson format
- [ ] Spelling rule teaching scripts
- [ ] Pattern-based word groups

**NEXT STEPS FOR SPELLING:**
1. Review README for completeness
2. Convert spelling_words to lesson format
3. Group words by spelling pattern
4. Begin seeding

---

### SUBJECT 6: WRITING

**README Location:** `seeding/README-WRITING-SEEDING.md`

**What's Defined:**
- [x] Skills by grade (K-7)
- [x] Arizona W/L Standards
- [x] Visual types: `sentence_builder`, `paragraph_structure`, `grammar_highlight`
- [x] tier1/tier2 example
- [x] ID format and skill codes

**What's In Database:** 0 items

**Target:** 12,000 items

**Standards:** Arizona ELA W (Writing) + L (Language)

**What Might Be Missing:**
- [ ] Writing prompt format
- [ ] Rubric format for grading
- [ ] Example essays/paragraphs
- [ ] Grammar drill format

**NEXT STEPS FOR WRITING:**
1. Review README for completeness
2. Define writing prompt format
3. Define how writing is graded (human? AI for over-13 only?)
4. Begin seeding

---

## CONTENT TYPES WE NEED (Beyond Basic Lessons)

From LESSON-FLOW-ARCHITECTURE.md, we need MORE than just the 200K practice problems:

| Content Type | Description | Count Needed |
|--------------|-------------|--------------|
| Rule Teaching Scripts | Gigi teaches the rule | ~150 |
| Demo Problems | Worked examples with steps | ~500 |
| Guided Practice | Problems with hints | ~750 |
| Independent Practice | Problems without hints | 200,000 |
| Rule Quizzes | 5-10 questions per rule | ~150 |
| Weekly Tests | 15 questions covering week's rules | ~600 |
| Monthly Reviews | 40 questions covering month | ~150 |

**QUESTION FOR PHIL:** Are we seeding all these content types? Or just the 200K independent practice for now?

---

## CROSS-SUBJECT INTEGRATION DETAILS

After a skill is MASTERED, content flows between subjects:

```
TYPING pulls from:
├── SPELLING → Type spelling words (TTS + type)
├── WRITING → Type sentences and paragraphs
├── READING → Type passages (builds fluency)
└── CODING → Type code snippets

SPELLING feeds:
├── TYPING → Practice content
├── WRITING → Words for essays
└── READING → Decodable words

READING feeds:
├── TYPING → Passage content
├── WRITING → Example text
└── ALL → Instruction reading
```

---

## QUESTIONS TO RESOLVE

1. **Practice Mode Content:** Is this separate from lessons? Same format?
2. **Theme Variants:** Do we need K-2, 3-5, 6-7 versions of each problem?
3. **Rule Teaching Scripts:** Are we seeding these? Format?
4. **Demo Problems:** Are we seeding these? Format?
5. **Weekly/Monthly Tests:** Are we seeding these? Format?
6. **Grading Writing:** How does this work for under-13?

---

## CURRENT SESSION STATUS

**What's Done:**
- [x] All 6 subject READMEs created
- [x] Master seeding guide created
- [x] Checklist created
- [x] Adaptive learning plan created (ULTIMATE-PLAN-ADAPTIVE-LEARNING.md)
- [x] "What We Learned" documented in master README
- [x] This Claude notes file created

**What's Next:**
- [ ] Go through each subject one by one
- [ ] Verify nothing is missing
- [ ] Start seeding (Typing first?)

---

## HOW TO CONTINUE THIS SESSION

If you're a new Claude picking this up:

1. Read `README-MASTER-SEEDING.md` first
2. Read `ULTIMATE-PLAN-ADAPTIVE-LEARNING.md`
3. Read this file (`CLAUDE-SESSION-NOTES.md`)
4. Check `README-SEEDING-CHECKLIST.md` for progress
5. Read the specific subject README in `seeding/` folder
6. Ask Phil what to work on next

---

## CHANGE LOG

### 2026-01-16 (Late Evening)
- Created this CLAUDE-SESSION-NOTES.md file
- Documented what was found in library
- Created subject-by-subject status
- Identified what might be missing per subject
- Listed questions to resolve

---

*This file is for Claude's reference. Update it as work progresses.*
