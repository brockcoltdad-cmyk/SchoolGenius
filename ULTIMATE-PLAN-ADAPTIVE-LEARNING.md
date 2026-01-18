# ULTIMATE ADAPTIVE LEARNING PLAN
## SchoolGenius Under-13 (K-7) - Complete System Design

**Created:** 2026-01-16
**Purpose:** Master document defining how adaptive learning works across ALL subjects
**Status:** APPROVED DESIGN

---

## CORE PRINCIPLES

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PHIL'S RULES                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. SKILL LEVEL, NOT GRADE LEVEL - Don't hold kids back                    │
│  2. SCORING 100%? MOVE THEM UP - Adaptive progression                       │
│  3. UNDER 13 CAPS AT GRADE 7 - COPPA compliance                            │
│  4. THEMES STAY AGE-APPROPRIATE - 5-year-old gets kid themes               │
│  5. ENDLESS PRACTICE OPTIONS - Not just one practice, LOTS                  │
│  6. CROSS-SUBJECT INTEGRATION - Typing uses spelling words, etc.           │
│  7. ALL PRE-SEEDED - No live AI for under 13                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SYSTEM ARCHITECTURE

### Two Modes Per Subject

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  MODE 1: LEARNING (Structured Lessons)                                      │
│  ─────────────────────────────────────                                      │
│  • Learn the RULE first                                                     │
│  • Watch demo problems                                                      │
│  • Guided practice (with hints)                                             │
│  • Independent practice (no hints)                                          │
│  • Quiz to master the skill                                                 │
│                                                                             │
│  Uses: tier1/tier2 seeded content                                          │
│  Format: 6-Phase Lesson Flow (I DO, WE DO, YOU DO)                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MODE 2: PRACTICE (Endless Reinforcement)                                   │
│  ─────────────────────────────────────────                                  │
│  • After skill is "learned" or "mastered"                                   │
│  • Unlimited practice variations                                            │
│  • Cross-subject content (typing + spelling, etc.)                         │
│  • Speed challenges, accuracy challenges                                    │
│  • Daily streaks, coins, rewards                                           │
│                                                                             │
│  Uses: Simplified format (question + answer + tier1/tier2 for wrong)       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SKILL-BASED PROGRESSION (NOT GRADE-LOCKED)

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ADAPTIVE SKILL LEVELS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SCENARIO: 1st grader starts typing                                         │
│                                                                             │
│  Week 1: Learns home row (Grade 1 skill)                                   │
│          - Completes lesson, passes quiz                                   │
│          - Skill marked "MASTERED"                                         │
│                                                                             │
│  Week 2: Practices home row (endless practice mode)                        │
│          - Scores 100% on 3 sessions                                       │
│          - System detects mastery, offers advancement                      │
│                                                                             │
│  Week 3: MOVES UP to top row keys (Grade 2 skill)                          │
│          - Even though enrolled in Grade 1                                 │
│          - BUT: Theme stays age-appropriate (kid themes, not teen)         │
│                                                                             │
│  Week 4-8: Continues advancing through Grade 2, 3, 4 content               │
│            - Content difficulty increases                                   │
│            - Theme/examples stay kindergarten-appropriate                  │
│                                                                             │
│  MAX: Can reach Grade 7 content (under-13 cap)                             │
│  NEVER: Grade 8+ content shown to under-13                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Skill Mastery Levels

| Level | Name | Requirements | Next Action |
|-------|------|--------------|-------------|
| 0 | NOT STARTED | Never attempted | Start lesson |
| 1 | LEARNING | Started lesson | Continue lesson |
| 2 | PRACTICED | Completed lesson, < 80% quiz | Retry quiz |
| 3 | PASSED | 80%+ quiz score | Practice mode |
| 4 | MASTERED | 90%+ on 3 practice sessions | Offer advancement |
| 5 | ADVANCED | Moved to next skill level | Track in system |

### Advancement Rules

```javascript
// Pseudo-code for advancement logic
function shouldAdvanceStudent(childId, skillCode) {
  const recentSessions = getRecentPracticeSessions(childId, skillCode, limit=3);
  const avgScore = average(recentSessions.map(s => s.score));
  const allAbove90 = recentSessions.every(s => s.score >= 90);

  if (avgScore >= 95 && allAbove90) {
    const currentGrade = getSkillGrade(skillCode);
    const childAge = getChildAge(childId);
    const maxGrade = childAge < 13 ? 7 : 12; // COPPA cap

    if (currentGrade < maxGrade) {
      return {
        advance: true,
        nextSkill: getNextSkillInSequence(skillCode)
      };
    }
  }
  return { advance: false };
}
```

---

## CROSS-SUBJECT INTEGRATION

### The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TYPING AS A TOOL FOR ALL SUBJECTS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Once typing is "PASSED" (80%+ quiz), it becomes a TOOL:                   │
│                                                                             │
│  TYPING + SPELLING:                                                         │
│  ─────────────────                                                          │
│  - Practice mode: TTS says word, kid types it                              │
│  - Uses spelling words from kid's current spelling skill level             │
│  - Builds both typing speed AND spelling accuracy                          │
│                                                                             │
│  TYPING + WRITING:                                                          │
│  ────────────────                                                           │
│  - Practice mode: Type sentences, paragraphs                               │
│  - Sentences pulled from kid's current writing skill level                 │
│  - Practices punctuation, capitalization while typing                      │
│                                                                             │
│  TYPING + READING:                                                          │
│  ────────────────                                                           │
│  - Practice mode: Type what you read (passages)                            │
│  - Passages from kid's current Lexile level                                │
│  - Builds reading fluency + typing speed                                   │
│                                                                             │
│  TYPING + CODING:                                                           │
│  ───────────────                                                            │
│  - Practice mode: Type code snippets                                       │
│  - Code from kid's current coding skill level                              │
│  - Teaches syntax + builds muscle memory                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Content Pulling Logic

```javascript
// How cross-subject practice works
function getTypingPracticeContent(childId, practiceType) {
  const typingLevel = getSkillLevel(childId, 'typing');

  switch (practiceType) {
    case 'spelling':
      // Get spelling words at kid's SPELLING skill level
      const spellingLevel = getSkillLevel(childId, 'spelling');
      return getSpellingWords(spellingLevel.currentGrade, limit=20);

    case 'sentences':
      // Get sentences at kid's WRITING skill level
      const writingLevel = getSkillLevel(childId, 'writing');
      return getSentences(writingLevel.currentGrade, limit=10);

    case 'passages':
      // Get passages at kid's READING Lexile level
      const readingLevel = getSkillLevel(childId, 'reading');
      return getPassages(readingLevel.lexileBand, limit=5);

    case 'code':
      // Get code at kid's CODING skill level
      const codingLevel = getSkillLevel(childId, 'coding');
      return getCodeSnippets(codingLevel.currentGrade, limit=10);
  }
}
```

---

## PRACTICE MODE DETAILS

### What Practice Looks Like

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRACTICE MODE OPTIONS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  When kid clicks "PRACTICE" for a mastered skill:                          │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Quick Quiz   │  │ Speed Run    │  │ Accuracy     │  │ Mixed Review │   │
│  │ 10 questions │  │ Beat clock!  │  │ No mistakes! │  │ All skills   │   │
│  │ 🕐 5 min     │  │ 🕐 3 min     │  │ 🕐 No limit  │  │ 🕐 10 min    │   │
│  │ 💰 10 coins  │  │ 💰 15 coins  │  │ 💰 20 coins  │  │ 💰 25 coins  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  FOR TYPING (after mastery):                                               │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Random Words │  │ Spelling     │  │ Sentences    │  │ Paragraphs   │   │
│  │ Basic typing │  │ Type words   │  │ Full sent.   │  │ Long form    │   │
│  │ 🕐 No limit  │  │ TTS + type   │  │ 🕐 5 min     │  │ 🕐 10 min    │   │
│  │ 💰 1/word    │  │ 💰 2/word    │  │ 💰 5/sent.   │  │ 💰 10/para   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  FOR MATH (after mastery):                                                 │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Fact Fluency │  │ Word Probs   │  │ Beat Score   │  │ Challenge    │   │
│  │ Quick facts  │  │ Story math   │  │ High score!  │  │ Harder!      │   │
│  │ 🕐 2 min     │  │ 🕐 10 min    │  │ 🕐 5 min     │  │ 🕐 No limit  │   │
│  │ 💰 1/correct │  │ 💰 5/correct │  │ 💰 Bonus     │  │ 💰 Double    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Practice Content Requirements

| Practice Type | Content Needed | Format |
|---------------|----------------|--------|
| Quick Quiz | 1000+ questions per skill | question + answer + tier1/tier2 |
| Speed Run | Same questions, timed | question + answer only |
| Accuracy | Same questions, error tracking | question + answer + tier1/tier2 |
| Mixed Review | Questions from all mastered skills | question + answer + skill_code |
| Typing Words | Word lists by level | word + audio_word |
| Typing Sentences | Sentences by level | sentence + punctuation hints |
| Typing Passages | Passages by Lexile | passage + word_count + estimated_time |

---

## THEME VS CONTENT SEPARATION

### Critical Rule

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     THEME ≠ CONTENT DIFFICULTY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WRONG: 5-year-old doing Grade 4 math sees "tax calculation" examples      │
│  RIGHT: 5-year-old doing Grade 4 math sees "candy store" examples          │
│                                                                             │
│  HOW IT WORKS:                                                              │
│                                                                             │
│  Step 1: Determine CONTENT difficulty from skill level                     │
│          - Kid is at Grade 4 multiplication (skill-based)                  │
│                                                                             │
│  Step 2: Determine THEME from child's enrolled grade (or age)              │
│          - Kid is enrolled in Kindergarten → use K-2 themes                │
│                                                                             │
│  Step 3: Generate/select content that matches BOTH                         │
│          - Grade 4 difficulty math WITH K-2 appropriate themes             │
│                                                                             │
│  THEME BUCKETS:                                                            │
│  ─────────────                                                              │
│  K-2:    Animals, toys, candy, playground, birthday, cartoons              │
│  3-5:    Sports, games, pets, school, family, hobbies                      │
│  6-7:    Movies, music, social, technology (age-appropriate)               │
│                                                                             │
│  NEVER FOR UNDER-13:                                                        │
│  - Dating, violence, horror                                                │
│  - Real money (use coins, gems, rewards)                                   │
│  - Social media references                                                 │
│  - Mature humor                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation in Seeding

When generating content, include BOTH:

```json
{
  "id": "MATH-G4-MULT-0001",
  "skill_level": 4,
  "theme_bucket": "K-2",
  "question": "Emma has 7 bags of candy. Each bag has 8 pieces. How many pieces of candy does Emma have in all?",
  "answer": "56",
  "tier1": {
    "teach": "Multiply to find the total. 7 groups of 8 = 7 × 8.",
    "steps": [...]
  }
}
```

For the SAME skill but different theme bucket:

```json
{
  "id": "MATH-G4-MULT-0002",
  "skill_level": 4,
  "theme_bucket": "3-5",
  "question": "The basketball team practiced for 7 days. They did 8 drills each day. How many total drills did they do?",
  "answer": "56",
  "tier1": {
    "teach": "Multiply to find the total. 7 groups of 8 = 7 × 8.",
    "steps": [...]
  }
}
```

---

## DATABASE STRUCTURE FOR ADAPTIVE LEARNING

### Tables Involved

```sql
-- Track skill mastery per child
skill_mastery (
  child_id,
  skill_code,           -- e.g., "MATH-MULT-9S"
  subject,              -- e.g., "math"
  grade_level,          -- Content grade (can differ from enrolled)
  mastery_level,        -- 0-5 scale
  times_practiced,
  best_score,
  last_practiced,
  advanced_from         -- Previous skill (for tracking progression)
)

-- Learning profile (already exists)
learning_profiles (
  child_id,
  primary_learning_style,
  preferred_pace,
  frustration_threshold,
  strongest_subjects,
  weakest_subjects,
  overall_accuracy,
  ...
)

-- Track advancement history
skill_advancement_log (
  child_id,
  from_skill_code,
  to_skill_code,
  advanced_at,
  reason                -- "mastery" | "placement_test" | "manual"
)

-- Practice sessions
practice_sessions (
  child_id,
  skill_code,
  practice_type,        -- "quick_quiz" | "speed_run" | "accuracy" | "mixed"
  score,
  time_spent,
  questions_correct,
  questions_total,
  completed_at
)
```

### Queries

```sql
-- Get child's current skill level for a subject
SELECT skill_code, grade_level, mastery_level
FROM skill_mastery
WHERE child_id = ? AND subject = ?
ORDER BY grade_level DESC, mastery_level DESC
LIMIT 1;

-- Check if ready for advancement
SELECT AVG(score) as avg_score, COUNT(*) as session_count
FROM practice_sessions
WHERE child_id = ? AND skill_code = ?
  AND completed_at > NOW() - INTERVAL '7 days'
HAVING AVG(score) >= 95 AND COUNT(*) >= 3;

-- Get content at skill level with appropriate theme
SELECT * FROM lesson_items
WHERE skill_code = ?
  AND theme_bucket = ?
  AND NOT id IN (SELECT item_id FROM completed_items WHERE child_id = ?)
ORDER BY RANDOM()
LIMIT 10;
```

---

## SUBJECT-SPECIFIC ADAPTIVE RULES

### MATH

| Current Mastery | Advancement Trigger | Next Skill |
|-----------------|---------------------|------------|
| Addition within 10 | 95%+ on 3 sessions | Addition within 20 |
| Addition within 20 | 95%+ on 3 sessions | Addition within 100 |
| Multiplication ×1 | 95%+ on 3 sessions | Multiplication ×2 |
| etc. | | |

**Math Skill Sequence:** Follows Arizona Math Standards progression

### READING

| Current Mastery | Advancement Trigger | Next Skill |
|-----------------|---------------------|------------|
| Lexile BR-200L | 85%+ comprehension on 5 stories | Lexile 200L-400L |
| Lexile 200L-400L | 85%+ comprehension on 5 stories | Lexile 400L-600L |
| etc. | | |

**Reading Note:** Uses Lexile levels, not grade levels

### TYPING

| Current Mastery | Advancement Trigger | Next Skill |
|-----------------|---------------------|------------|
| Home row | 95% accuracy, 10 WPM | Top row |
| Top row | 95% accuracy, 15 WPM | Bottom row |
| All letters | 95% accuracy, 20 WPM | Numbers |
| etc. | | |

**Typing Note:** Requires BOTH accuracy AND speed targets

### SPELLING

| Current Mastery | Advancement Trigger | Next Skill |
|-----------------|---------------------|------------|
| CVC words | 90%+ on 20 words | CVCe words |
| CVCe words | 90%+ on 20 words | Vowel teams |
| etc. | | |

**Spelling Note:** Must demonstrate pattern mastery before advancing

### CODING

| Current Mastery | Advancement Trigger | Next Skill |
|-----------------|---------------------|------------|
| Sequences | Complete 5 projects | Simple loops |
| Simple loops | Complete 5 projects | Conditionals |
| etc. | | |

**Coding Note:** Project-based advancement, not quiz-based

### WRITING

| Current Mastery | Advancement Trigger | Next Skill |
|-----------------|---------------------|------------|
| Simple sentences | 3 submissions graded "proficient" | Compound sentences |
| Compound sentences | 3 submissions graded "proficient" | Paragraphs |
| etc. | | |

**Writing Note:** Requires human or AI grading (over-13 only for AI grading)

---

## COPPA COMPLIANCE SUMMARY

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COPPA RULES (UNDER 13)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. ALL content pre-seeded (no live AI generation)                         │
│  2. Maximum skill level: Grade 7 content                                   │
│  3. Themes always age-appropriate for enrolled grade                       │
│  4. No personal data collection beyond learning progress                   │
│  5. Parent controls everything (schedule, subjects, limits)                │
│  6. No social features (chat, friends, etc.)                               │
│  7. No external links or advertisements                                    │
│  8. Gigi uses pre-scripted responses only                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SEEDING REQUIREMENTS FOR ADAPTIVE LEARNING

### Per Subject - Content Needed

| Subject | Learning Mode | Practice Mode | Total Items |
|---------|---------------|---------------|-------------|
| Math | 88,000 lessons | 50,000 practice | 138,000 |
| Reading | 52,000 lessons | 30,000 practice | 82,000 |
| Spelling | 26,000 lessons | 15,000 practice | 41,000 |
| Writing | 12,000 lessons | 8,000 practice | 20,000 |
| Coding | 12,000 lessons | 5,000 practice | 17,000 |
| Typing | 10,000 lessons | 10,000 practice | 20,000 |
| **TOTAL** | **200,000** | **118,000** | **318,000** |

### Theme Variants Needed

Each lesson should have 2-3 theme variants:
- K-2 theme version
- 3-5 theme version
- 6-7 theme version (where appropriate)

This allows the same skill to be taught with age-appropriate examples.

---

## IMPLEMENTATION PHASES

### Phase 1: Core Learning Mode (Current)
- [x] Database tables created
- [x] Subject READMEs defined
- [ ] Generate 200,000 learning lessons
- [ ] Upload to database

### Phase 2: Practice Mode
- [ ] Create practice mode tables
- [ ] Define practice content format
- [ ] Generate practice content
- [ ] Build practice UI

### Phase 3: Adaptive Engine
- [ ] Implement advancement detection
- [ ] Build skill progression tracking
- [ ] Create advancement notifications
- [ ] Test with real users

### Phase 4: Cross-Subject Integration
- [ ] Link typing to spelling content
- [ ] Link typing to writing content
- [ ] Link typing to reading content
- [ ] Build selection UI

### Phase 5: Theme Separation
- [ ] Tag all content with theme_bucket
- [ ] Implement theme-based content selection
- [ ] Generate theme variants where missing

---

## CHANGE LOG

### 2026-01-16
- Created ULTIMATE-PLAN-ADAPTIVE-LEARNING.md
- Defined skill-based progression rules
- Defined cross-subject integration
- Defined theme vs content separation
- Defined COPPA compliance requirements
- Estimated seeding requirements

---

*This is the MASTER plan for adaptive learning. All subject-specific READMEs should reference this document.*
