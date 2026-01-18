# UNDER 13 SEEDING - COMPLETE REFERENCE

**Purpose:** Everything needed for K-7 seeding (COPPA compliant)
**Last Updated:** 2026-01-16

---

## SECTION 1: COPPA REQUIREMENT (THE LAW)

```
┌─────────────────────────────────────────────────────────────────┐
│              KIDS 13 AND UNDER - NO LIVE AI                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • NO real-time AI generation                                   │
│  • ALL responses must come from pre-seeded library              │
│  • This includes: lessons, hints, chat, explanations            │
│                                                                 │
│  If it's not seeded → Kid can't learn it                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## SECTION 2: PROCEDURES (How To Build)

### Phil's 99/1 Rule

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORK DISTRIBUTION                             │
├─────────────────────────────────────────────────────────────────┤
│  Claude does 99%: code, research, debugging, everything         │
│  Phil does 1%: API keys, approving decisions, "yes/no"          │
│                                                                 │
│  DO NOT ask Phil to read code or make technical decisions.      │
│  JUST DO IT. Report results when done.                          │
└─────────────────────────────────────────────────────────────────┘
```

### Teaching Methodology (Rules-First)

Every lesson follows this 6-phase structure:

```
Phase 1: RULES (2-3 min)
   └── Gigi reads rule aloud
   └── Visual example shown
   └── "Skip rules" option for repeat lessons

Phase 2: EXAMPLES (3-5 min)
   └── 3 worked examples
   └── Gigi explains each step

Phase 3: GUIDED PRACTICE (5 min)
   └── 5 problems with hints
   └── Feedback after each

Phase 4: INDEPENDENT PRACTICE (10-15 min)
   └── 15 problems without hints
   └── Track accuracy

Phase 5: QUIZ (5 min)
   └── 10 questions
   └── 70% to pass

Phase 6: COMPLETE
   └── Celebration animation
   └── Theme message
   └── Coins + XP awarded
```

### Age Group Rules (K-7)

| Grades | Ages | Teaching Style |
|--------|------|----------------|
| K-2 | 5-8 | Simple language, bright colors, excited tone, 10-12 min lessons, heavy visual support, read-aloud |
| 3-5 | 9-11 | Friendly tone, game-like, medium complexity, 15-20 min lessons |
| 6-7 | 12-13 | Respectful peer tone, more challenging, less "cute", 20-25 min lessons |

### CRITICAL: Help System (13 and Under - ALL PRE-SCRIPTED)

```
┌─────────────────────────────────────────────────────────────────┐
│         HELP FLOW FOR 13 AND UNDER (ALL PRE-SCRIPTED)            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  2 wrong in a row → Level 1: PRE-SCRIPTED HINT                  │
│                     (from explanation_library)                  │
│                                                                 │
│  3 wrong in a row → Level 2: PRE-SCRIPTED SIMPLE EXPLANATION    │
│                                                                 │
│  4 wrong in a row → Level 3: PRE-SCRIPTED DETAILED EXPLANATION  │
│                                                                 │
│  5 wrong in a row → RETEACH THE RULES                           │
│                     → Return to Phase 1 (RULES)                 │
│                     → Play pre-scripted rule explanation        │
│                     → Show examples again                       │
│                     → Then return to practice                   │
│                                                                 │
│  NEVER: Live AI response for 13 and under                       │
│  ALWAYS: Pull from pre-seeded library content                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Caching Procedure (Cost Savings)

```typescript
// BEFORE generating content - check library first
const cached = await supabase
  .from('lesson_content')
  .select('*')
  .eq('skill_id', skillId)
  .single();

if (cached) return cached; // FREE - use cache

// AFTER generating content - save back to library
await supabase
  .from('lesson_content')
  .insert(newLesson);
```

### Gamification Rules

| Action | Coins | XP |
|--------|-------|-----|
| Correct answer | 1-5 | 10 |
| Lesson completed | 25 | 100 |
| Perfect quiz (10/10) | 50 | 200 |

**ONE Penalty:** Miss weekly test by Friday → Lose 50% coins (max 100)

---

## SECTION 3: REQUIRED FORMAT (tier1/tier2)

All under-13 content MUST have this format:

```json
{
  "id": "MATH-G3-MULTI-0001",
  "subject": "math",
  "grade": 3,
  "skill": "multiplication facts",
  "standard": "3.OA.C.7",
  "question": "What is 6 × 7?",
  "answer": "42",
  "tier1": {
    "teach": "Multiply by making equal groups.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "array",
          "data": { "rows": 6, "cols": 7 }
        },
        "voice_text": "Let's see 6 groups of 7 objects",
        "duration": 4000
      }
    ]
  },
  "tier2": {
    "teach": "Count by 7s six times.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "number_line",
          "data": { "jumps": [7,14,21,28,35,42] }
        },
        "voice_text": "Jump by 7 six times",
        "duration": 5000
      }
    ]
  },
  "visual_type": "array"
}
```

### Why tier1/tier2?

| Tier | Purpose | When Used |
|------|---------|-----------|
| tier1 | Standard teaching | First attempt |
| tier2 | Simpler explanation | If kid struggles |

### Visual Types (K-7)

| Type | Use For |
|------|---------|
| `fraction` | Fraction visuals (circle/bar) |
| `array` | Multiplication arrays |
| `place_value` | Ones, tens, hundreds |
| `number_line` | Number sequences, jumps |
| `counting_objects` | Early counting |
| `bar_model` | Word problems |
| `balance_scale` | Equations |
| `equation_steps` | Step-by-step solving |
| `graph` | Data/graphing |
| `phonics` | Reading phonics |
| `word_building` | Spelling |
| `code_block` | Coding |
| `keyboard` | Typing |

---

## SECTION 4: SEEDING TARGET

### 200,000 Lessons (K-7)

| Subject | Lessons | Per Grade |
|---------|---------|-----------|
| Math | 88,000 | 11,000 |
| Reading | 52,000 | 6,500 |
| Spelling | 26,000 | 3,250 |
| Writing | 12,000 | 1,500 |
| Coding | 12,000 | 1,500 |
| Typing | 10,000 | 1,250 |
| **TOTAL** | **200,000** | |

### Master Seeding Prompts

| File | Coverage |
|------|----------|
| `library/schoolgenius_seeding_prompt.md` | K-6 (185,000) |
| `library/schoolgenius_complete_seeding_prompt.md` | K-7 (200,000) |

**Use these when generating content to get proper tier1/tier2 format.**

---

## SECTION 5: KID-SAFE WORD LISTS

### Location: `library/`

| File | Words | Grades | Source |
|------|-------|--------|--------|
| `dolch-sight-words.json` | 315 | Pre-K to 3rd | Edward Dolch 1936 |
| `fry-1000-sight-words.json` | 1,000 | K-10 | Edward Fry |
| `academic-word-list.json` | 570 | 6-12+ | Averil Coxhead |

**Total: 1,885 kid-safe words**

---

## SECTION 6: CURRENT STATUS (Updated 2026-01-16)

### What's in Database (Correct tier1/tier2 Format)

| Grade | Items | Status |
|-------|-------|--------|
| K (0) | 7,961 | PARTIAL (need 25,000) |
| 1 | 9,811 | PARTIAL (need 25,000) |
| 2 | 0 | EMPTY |
| 3 | 0 | EMPTY |
| 4 | 0 | EMPTY |
| 5 | 0 | EMPTY |
| 6 | 0 | EMPTY |
| 7 | 0 | EMPTY |
| **TOTAL** | **17,772** | **8.9% of 200K target** |

### Compliance Checklist

- [x] Cache-first - Check library before AI call
- [x] **13 AND UNDER: NO live AI - all pre-scripted**
- [x] Arizona Standards (NOT Common Core)
- [x] Lexile levels for reading
- [x] Visual components exist
- [x] Rules-first lesson flow
- [x] 6-level help system (pre-scripted)
- [x] 5 wrong → Reteach rules (not live AI)
- [ ] **SEEDING: Only 8.9% complete - NEEDS WORK**

---

## SECTION 7: CHANGE LOG

### 2026-01-16 (Database Cleanup)

**What Was Done:**
- Analyzed 64,059 items in database
- Found 17,772 items WITH correct tier1/tier2 format
- Found 45,291 items in wrong format (i_do/we_do/you_do - gradual release)
- Found 996 items in simple format (question/answer only)

**Actions Taken:**
- Exported 45,291 gradual release items → `backups/gradual-release-format-items.json`
- Exported 996 simple format items → `backups/simple-format-items.json`
- Deleted all items WITHOUT tier1/tier2 from database
- Database now clean: 17,772 items, ALL in correct format

**Why:**
- Under-13 requires tier1/tier2 for lesson players
- Wrong format items can't be used for COPPA compliance
- Backed up for potential future use (see README-GRADUAL-RELEASE-FORMAT.md)

### 2026-01-15 (Night)

- Created `practice_problems` table
- Uploaded 63,179 items from JSON files
- Two formats discovered: tier1/tier2 and i_do/we_do/you_do

### Earlier

- All lesson players built (Math, Spelling, Typing, Writing, Coding, Reading)
- 20+ visual components built
- Theme system with 80+ themes
- GigiLiveChat integrated

---

## SECTION 8: NEXT STEPS

1. **Seed grades 2-7** with proper tier1/tier2 format
2. **Complete grades K-1** (currently partial)
3. **Use master seeding prompts** from `library/` folder
4. **Target: 200,000 lessons** for full COPPA compliance

### Seeding Command (To Be Created)

```bash
cd "C:\Users\DAD\Desktop\SchoolGenius-Final"
node seed-tier1-tier2.mjs  # Uses proper format from master prompts
```

---

## SECTION 9: FILE LOCATIONS

| Purpose | Location |
|---------|----------|
| This README | `README-UNDER13-SEEDING.md` |
| Over-13 README | `README-OVER13-SEEDING.md` |
| Gradual Release Backup | `README-GRADUAL-RELEASE-FORMAT.md` |
| Word Lists | `library/*.json` |
| Seeding Prompts | `library/schoolgenius_*.md` |
| Backups | `backups/` |

---

*This is the COMPLETE reference for under-13 seeding. No need to check other step files.*
