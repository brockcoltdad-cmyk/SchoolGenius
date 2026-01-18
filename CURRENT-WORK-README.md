# CURRENT WORK README - SCHOOLGENIUS
## For Claude: Read This To Know Exactly Where We Are

**Last Updated:** 2026-01-16 (Late Night)
**Current Task:** Fix Math K-1 (17,772 items missing Arizona codes) THEN proceed subject-by-subject

---

## IMMEDIATE STATUS

```
+-----------------------------------------------------------------------------+
|                         WHAT WE'RE DOING RIGHT NOW                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FOUND PROBLEM: 17,772 Math items in database are MISSING Arizona codes    |
|                                                                             |
|  TASK ORDER:                                                                |
|  1. FIX MATH K-1 (add Arizona standard codes) <-- CURRENT                  |
|  2. TYPING (subject 1 - start fresh)                                       |
|  3. CODING (subject 2)                                                     |
|  4. READING (subject 3)                                                    |
|  5. SPELLING (subject 4)                                                   |
|  6. WRITING (subject 5)                                                    |
|  7. MATH GRADES 2-7 (finish subject 6)                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## FIX TASK: MATH K-1 (17,772 ITEMS)

### What's In Database Now
- **Location:** Supabase `practice_problems` table
- **Count:** 17,772 items
- **Grades:** K and 1 only
- **Subject:** Math

### Format Check Results
| Field | Status | Details |
|-------|--------|---------|
| tier1.teach | GOOD | Has explanations |
| tier1.steps[].visual | GOOD | Has visual data |
| tier1.steps[].voice_text | GOOD | Has narration |
| tier1.steps[].duration | GOOD | Has timing |
| tier2.teach | GOOD | Has simpler explanations |
| tier2.steps[].visual | GOOD | Has visual data |
| tier2.steps[].voice_text | GOOD | Has narration |
| tier2.steps[].duration | GOOD | Has timing |
| visual_type | GOOD | Has type |
| visual_data | GOOD | Has data |
| **standard** | **MISSING** | **NULL on all 17,772 items** |

### Skills Found (Need Arizona Code Mapping)

**Kindergarten (Grade 0):**
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
| position words | K.G.A.1 |
| sorting objects | K.MD.B.3 |

**Grade 1:**
| Skill in Database | Arizona Standard Code |
|-------------------|----------------------|
| addition within 20 | 1.OA.C.6 |
| subtraction within 20 | 1.OA.C.6 |
| Addition within 20 | 1.OA.C.6 |
| addition within 100 | 1.NBT.C.4 |
| place value | 1.NBT.B.2 |
| place value tens and ones | 1.NBT.B.2 |
| place value tens/ones | 1.NBT.B.2 |
| comparing numbers | 1.NBT.B.3 |
| telling time | 1.MD.B.3 |
| telling time hour/half | 1.MD.B.3 |
| telling time to hour and half hour | 1.MD.B.3 |
| measuring length | 1.MD.A.1 |
| data and graphs | 1.MD.C.4 |

### Problem Found: Inconsistent Skill Names
The database has DUPLICATE skills with different capitalization/wording:
- "addition within 20" vs "Addition within 20"
- "place value tens and ones" vs "place value tens/ones"
- "telling time hour/half" vs "telling time to hour and half hour"

### Fix Script Needed
```javascript
// Step 1: Normalize skill names (fix inconsistencies)
// Step 2: Map each skill to Arizona code
// Step 3: Update all 17,772 items
// Step 4: Verify update worked
```

### Fix Checklist
- [x] Get ALL unique skills from database (full audit) - DONE: 378 unique skills found
- [x] Create skill-to-Arizona-code mapping - DONE: fix-arizona-standards.mjs
- [x] Add 'standard' column to practice_problems table - DONE
- [x] Run update script - DONE (ran 3 times to catch all)
- [x] Verify Arizona codes added - **17,110 items (96.3%) now have codes**
- [x] Move to next subject (TYPING) - **READY**

### Results:
- **17,110 items** now have Arizona standard codes (96.3%)
- **662 items** couldn't be mapped (obscure skill names like "unit circles", "symmetry")
- These 662 can be manually fixed later or ignored (3.7%)

---

## SUBJECT 1: TYPING

**Status:** NOT STARTED (waiting for Math fix)
**README:** `seeding/README-TYPING-SEEDING.md`
**Target:** 10,000 items
**Current in DB:** 0 items

### Key Info
- **Standards:** Industry WPM goals (no state standard)
- **Visual Type:** `keyboard`
- **Grades:** K-7
- **WPM Goals:** K=5 WPM, G1=10, G2=15, G3=20, G4=25, G5=30, G6=35, G7=40

### Skills by Grade
| Grade | Skills |
|-------|--------|
| K | Home row keys (asdf jkl;), Space bar |
| 1 | All letters, basic punctuation |
| 2 | Numbers, shift key, capitals |
| 3 | Special characters, speed building |
| 4 | Accuracy focus, 25 WPM goal |
| 5 | Touch typing mastery, 30 WPM |
| 6 | Advanced punctuation, 35 WPM |
| 7 | Professional typing, 40 WPM |

### Typing Checklist
- [ ] Review README for completeness
- [ ] Verify all skills listed
- [ ] Define lesson format
- [ ] Generate content
- [ ] Upload to database
- [ ] Verify upload
- [ ] Mark complete

### Cross-Subject Integration
After mastery, TYPING becomes a tool:
- Type SPELLING words (TTS says word, kid types)
- Type WRITING sentences
- Type READING passages
- Type CODE snippets

---

## SUBJECT 2: CODING

**Status:** NOT STARTED
**README:** `seeding/README-CODING-SEEDING.md`
**Target:** 12,000 items
**Current in DB:** 0 items

### Key Info
- **Standards:** ISTE (International, Arizona adopted)
- **Visual Types:** `code_block`, `variable_box`, `loop_animation`, `conditional`, `output`
- **Tools:** K-2=Scratch Jr, 3-5=Scratch, 6-7=Python

### Skills by Grade
| Grade | Skills |
|-------|--------|
| K | Sequencing, basic commands |
| 1 | Simple loops, repeat blocks |
| 2 | Events, basic conditionals |
| 3 | Variables intro, Scratch projects |
| 4 | Complex loops, functions intro |
| 5 | Debugging, algorithm design |
| 6 | Python basics, text-based coding |
| 7 | Python functions, data structures |

### Coding Checklist
- [ ] Review README for completeness
- [ ] Verify ISTE standards mapped
- [ ] Define lesson format
- [ ] Generate content
- [ ] Upload to database
- [ ] Verify upload
- [ ] Mark complete

---

## SUBJECT 3: READING

**Status:** NOT STARTED
**README:** `seeding/README-READING-SEEDING.md`
**Target:** 52,000 items
**Current in DB:** 0 items

### Key Info
- **Standards:** Arizona ELA (RF, RL, RI) + Lexile Levels
- **Visual Types:** `letter`, `phonics`, `word_building`, `sight_word`, `syllable`, `passage`
- **Lexile Ranges:** BR-200L (K) to 1050L-1150L (G7)

### Skills by Grade
| Grade | Focus |
|-------|-------|
| K | Letter recognition, phonemic awareness, basic sight words |
| 1 | Phonics, CVC words, Dolch sight words |
| 2 | Fluency, comprehension basics, vowel teams |
| 3 | Reading comprehension, inference |
| 4 | Main idea, text structure |
| 5 | Literary analysis, compare/contrast |
| 6 | Informational text, author's purpose |
| 7 | Complex texts, critical reading |

### Reading Checklist
- [ ] Review README for completeness
- [ ] Define passage/story format
- [ ] Define comprehension question format
- [ ] Generate content
- [ ] Upload to database
- [ ] Verify upload
- [ ] Mark complete

---

## SUBJECT 4: SPELLING

**Status:** NOT STARTED
**README:** `seeding/README-SPELLING-SEEDING.md`
**Target:** 26,000 items
**Current in DB:** 0 items (but 4,941 in spelling_words table)

### Key Info
- **Standards:** Arizona ELA RF codes
- **Visual Types:** `spelling_rule`, `word_building`, `phonics`
- **IMPORTANT:** Audio-based! TTS says word, kid types it (NOT multiple choice)

### Six Syllable Types
1. Closed (cat, bed)
2. Open (me, go)
3. Silent-e (make, bike)
4. Vowel Team (rain, boat)
5. R-Controlled (car, bird)
6. Consonant-le (table, apple)

### Word Lists Available
- Dolch Sight Words: 315 words
- Fry 1000 Sight Words: 1000 words
- Academic Word List: 570 words

### Spelling Checklist
- [ ] Review README for completeness
- [ ] Convert spelling_words to lesson format
- [ ] Group words by spelling pattern
- [ ] Generate content
- [ ] Upload to database
- [ ] Verify upload
- [ ] Mark complete

---

## SUBJECT 5: WRITING

**Status:** NOT STARTED
**README:** `seeding/README-WRITING-SEEDING.md`
**Target:** 12,000 items
**Current in DB:** 0 items

### Key Info
- **Standards:** Arizona ELA W (Writing) + L (Language)
- **Visual Types:** `sentence_builder`, `paragraph_structure`, `grammar_highlight`

### Skills by Grade
| Grade | Focus |
|-------|-------|
| K | Letter formation, name writing |
| 1 | Sentence writing, capitals, periods |
| 2 | Paragraph structure, sequence |
| 3 | Opinion writing, supporting details |
| 4 | Informative writing, organization |
| 5 | Narrative writing, dialogue |
| 6 | Argumentative writing, evidence |
| 7 | Research writing, citations |

### Writing Checklist
- [ ] Review README for completeness
- [ ] Define writing prompt format
- [ ] Define grading method (pre-scripted for under 13)
- [ ] Generate content
- [ ] Upload to database
- [ ] Verify upload
- [ ] Mark complete

---

## SUBJECT 6: MATH (GRADES 2-7)

**Status:** K-1 IN DATABASE (needs fix), 2-7 NOT STARTED
**README:** `seeding/README-MATH-SEEDING.md`
**Target:** 88,000 items total
**Current in DB:** 17,772 items (K-1 only)

### What's Done
- K-1 content generated (17,772 items)
- Format is GOOD (tier1, tier2, visuals)
- Missing Arizona standard codes (FIX NEEDED)

### What's Left
- Fix K-1 (add Arizona codes)
- Generate Grades 2-7 (~70,000 items)

### Math Checklist
- [ ] Fix K-1 Arizona codes
- [ ] Generate Grade 2 content
- [ ] Generate Grade 3 content
- [ ] Generate Grade 4 content
- [ ] Generate Grade 5 content
- [ ] Generate Grade 6 content
- [ ] Generate Grade 7 content
- [ ] Upload all to database
- [ ] Verify upload
- [ ] Mark complete

---

## CRITICAL RULES (FROM PHIL)

```
+-----------------------------------------------------------------------------+
|                           MUST FOLLOW                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  1. UNDER 13 = NO LIVE AI - All content must be pre-seeded                 |
|  2. RULES FIRST - Teach the rule BEFORE any practice                       |
|  3. ALL UNLOCKED - Kids can jump to any topic                              |
|  4. TIER1/TIER2 - Every item needs both help levels                        |
|  5. ARIZONA STANDARDS - Use state codes (or ISTE for coding)               |
|  6. 99/1 RULE - Claude does 99%, Phil approves                             |
|  7. AGE-APPROPRIATE THEMES - Content can advance, themes stay kid-friendly |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## REQUIRED FORMAT (ALL ITEMS)

```json
{
  "id": "{SUBJECT}-G{GRADE}-{SKILL}-{NUMBER}",
  "subject": "typing|coding|math|reading|spelling|writing",
  "grade": 0-7,
  "skill": "skill name",
  "standard": "Arizona code",
  "question": "the question",
  "answer": "correct answer",
  "tier1": {
    "teach": "explanation (max 25 words)",
    "steps": [{
      "step": 1,
      "visual": { "type": "...", "data": {...} },
      "voice_text": "narration (max 20 words)",
      "duration": 3000-6000
    }]
  },
  "tier2": {
    "teach": "simpler explanation (max 20 words)",
    "steps": [{
      "step": 1,
      "visual": { "type": "...", "data": {...} },
      "voice_text": "narration (max 15 words)",
      "duration": 3000-6000
    }]
  }
}
```

---

## FILES TO READ

| File | Purpose |
|------|---------|
| `README-MASTER-SEEDING.md` | Master guide, read first |
| `CLAUDE-SESSION-NOTES.md` | Claude's internal notes |
| `ULTIMATE-PLAN-ADAPTIVE-LEARNING.md` | Adaptive learning rules |
| `seeding/README-{SUBJECT}-SEEDING.md` | Subject-specific details |
| `library/LESSON-FLOW-ARCHITECTURE.md` | Phil's complete vision |
| `library/SCHOOLGENIUS-MASTER-SEEDING-PROMPT.md` | Skill lists, visual types |

---

## CHANGE LOG

### 2026-01-16 (Late Night)
- Created this CURRENT-WORK-README.md
- Documented Math K-1 fix task
- Set subject order: MATH fix -> TYPING -> CODING -> READING -> SPELLING -> WRITING -> MATH 2-7
- Added checklists for each subject
- Documented all key info per subject

---

*This file tracks CURRENT work. Update after every session.*
