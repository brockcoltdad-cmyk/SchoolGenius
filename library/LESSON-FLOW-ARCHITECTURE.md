# SchoolGenius Lesson Flow Architecture
## The Complete Pre-Scripted Learning System

---

## YOUR VISION (Translated into System Design)

1. **All lessons unlocked** - Kids can jump to any topic
2. **Rules first** - Before ANY practice, learn the rule
3. **Practice in chunks** - Not 100 problems at once, do some, learn more rules, do more
4. **Weekly tests** - Test all rules from that week
5. **Monthly reviews** - Comprehensive test of everything
6. **Everything pre-scripted** - No live AI during lessons

---

## THE FLOW: HOW A LESSON ACTUALLY WORKS

### PHASE 1: RULE TEACHING (I DO - Teacher Models)
**What happens:** Gigi teaches the rule. Kid watches/listens. No interaction yet.

```
┌────────────────────────────────────────────────────────────────┐
│ RULE: Multiplication by 9                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Gigi: "Let me show you the coolest trick in math!"             │
│                                                                 │
│ [VISUAL: Hands with 10 fingers]                                │
│                                                                 │
│ Gigi: "Hold up all 10 fingers. To multiply 9 × 4,              │
│        fold down your 4th finger..."                            │
│                                                                 │
│ [VISUAL: 4th finger folds, showing 3 | 6 fingers]              │
│                                                                 │
│ Gigi: "Count the fingers before the fold: 3                    │
│        Count the fingers after the fold: 6                      │
│        The answer is 36!"                                       │
│                                                                 │
│ [RULE CARD: 9 × anything = (number-1) in tens place,           │
│             (10-number) in ones place]                          │
│                                                                 │
│                    [GOT IT - NEXT] button                       │
└────────────────────────────────────────────────────────────────┘
```

**Pre-scripted content needed:**
- Rule explanation text
- Visual aid data
- Voice narration text
- Duration timing

---

### PHASE 2: DEMO PROBLEMS (I DO - Teacher Shows Examples)
**What happens:** Gigi solves 3 problems while kid watches. Step by step.

```
┌────────────────────────────────────────────────────────────────┐
│ DEMO: Watch Me Solve 9 × 7                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Gigi: "Let's use the finger trick!"                            │
│                                                                 │
│ Step 1: "Hold up 10 fingers"                                   │
│         [VISUAL: 10 fingers up]                                │
│                                                                 │
│ Step 2: "Fold down finger #7"                                  │
│         [VISUAL: Finger 7 folding down with animation]         │
│                                                                 │
│ Step 3: "Count before: 6 fingers"                              │
│         [VISUAL: Highlighting fingers 1-6, number "6" appears] │
│                                                                 │
│ Step 4: "Count after: 3 fingers"                               │
│         [VISUAL: Highlighting fingers 8-10, number "3" appears]│
│                                                                 │
│ Step 5: "Put them together: 63!"                               │
│         [VISUAL: "6" and "3" combine to show "63"]             │
│                                                                 │
│ Gigi: "9 × 7 = 63. See how easy that was?"                     │
│                                                                 │
│        [DEMO 2 of 3] [NEXT DEMO →]                              │
└────────────────────────────────────────────────────────────────┘
```

**Pre-scripted content needed:**
- 3-5 worked examples per rule
- Step-by-step breakdown with visuals
- Voice narration for each step

---

### PHASE 3: GUIDED PRACTICE (WE DO - Work Together)
**What happens:** Kid tries problems WITH hints available. Gigi helps if stuck.

```
┌────────────────────────────────────────────────────────────────┐
│ YOUR TURN: 9 × 5 = ?                                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [___________] ← Type answer                                    │
│                                                                 │
│ [SHOW HINT]  [SHOW RULE]  [WATCH DEMO AGAIN]                   │
│                                                                 │
│ If correct:                                                     │
│   Gigi: "Perfect! You've got this!"                            │
│   +5 coins                                                      │
│                                                                 │
│ If wrong:                                                       │
│   Gigi: "Not quite. Let me help..."                            │
│   [Shows tier1 explanation with visual]                        │
│   "Try again!"                                                  │
│                                                                 │
│ If wrong again:                                                 │
│   Gigi: "Let's make this even simpler..."                      │
│   [Shows tier2 explanation - more concrete]                    │
│                                                                 │
│                         Progress: 2 of 5                        │
└────────────────────────────────────────────────────────────────┘
```

**Pre-scripted content needed:**
- 5 practice problems per rule (with hints)
- tier1 explanations
- tier2 explanations
- Correct/incorrect feedback messages

---

### PHASE 4: INDEPENDENT PRACTICE (YOU DO - Solo Practice)
**What happens:** Kid practices alone. No hints. Earns coins.

```
┌────────────────────────────────────────────────────────────────┐
│ PRACTICE TIME: ×9 Facts                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 9 × 8 = [___]                                                  │
│                                                                 │
│ No hints available                                              │
│ Timer: 2:45 remaining                                           │
│                                                                 │
│ Progress: ████████░░ 8/10                                       │
│ Coins earned: 35                                                │
│                                                                 │
│ [SUBMIT]                                                        │
└────────────────────────────────────────────────────────────────┘
```

**Pre-scripted content needed:**
- This is the 350K lessons we're already seeding!
- Just question + answer + tier1/tier2 for wrong answers

---

### PHASE 5: RULE QUIZ (Assessment)
**What happens:** Quick quiz on this rule. Must pass to "master" the rule.

```
┌────────────────────────────────────────────────────────────────┐
│ ×9 RULE QUIZ                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Question 4 of 5                                                 │
│                                                                 │
│ 9 × 6 = ?                                                       │
│                                                                 │
│ ○ A) 45                                                         │
│ ○ B) 54                                                         │
│ ○ C) 63                                                         │
│ ○ D) 56                                                         │
│                                                                 │
│ [SUBMIT ANSWER]                                                 │
│                                                                 │
│ Passing: 4/5 correct (80%)                                      │
└────────────────────────────────────────────────────────────────┘

PASS → Rule marked as "mastered", badge earned, coins awarded
FAIL → "Let's review!" → Back to Rule Teaching or Demo
```

---

## THE COMPLETE MULTIPLICATION CURRICULUM (Example)

### WEEK 1: Foundation Rules
```
Rule 1: ×0 (anything × 0 = 0)
  → Rule Teaching (2 min)
  → Demo Problems (3 examples)
  → Guided Practice (5 problems)
  → Independent Practice (10 problems)
  → Rule Quiz (5 questions)

Rule 2: ×1 (anything × 1 = itself)
  → Same flow

Rule 3: ×2 (doubles - skip counting by 2)
  → Same flow
```

### WEEK 1 TEST (Sunday)
```
Weekly Test: ×0, ×1, ×2 Rules
- 15 questions total (5 per rule)
- Mixed order
- Must pass 80% to complete week
- Reward: 50 coins + "Week 1 Master" badge
```

### WEEKS 2-4: Continue Pattern
```
Week 2: ×5, ×10 rules + Weekly Test
Week 3: ×3, ×4 rules + Weekly Test
Week 4: ×9 rule (hardest) + Weekly Test
```

### MONTHLY REVIEW (End of Month)
```
Monthly Multiplication Mastery Test
- All rules from weeks 1-4
- 40 questions total
- Must pass 80%
- Reward: 200 coins + "Multiplication Master" badge
- Unlocks next unit (Division!)
```

---

## WHAT WE NEED TO SEED

### Content Type 1: RULE TEACHING SCRIPTS (~150 total)

```json
{
  "rule_id": "MULT-R9",
  "rule_name": "Multiplication by 9",
  "grade": 3,
  "subject": "math",
  "skill": "multiplication facts",
  "teaching_script": {
    "intro": "Let me show you the coolest trick in math!",
    "explanation": [
      {
        "step": 1,
        "text": "Hold up all 10 fingers",
        "visual": { "type": "hands", "fingers_up": 10 },
        "voice": "Start with all ten fingers up",
        "duration": 3000
      },
      {
        "step": 2,
        "text": "To multiply 9 × 4, fold down your 4th finger",
        "visual": { "type": "hands", "fold_finger": 4 },
        "voice": "Now fold down finger number four",
        "duration": 3000
      },
      {
        "step": 3,
        "text": "Count fingers before the fold: that's your tens digit",
        "visual": { "type": "hands", "highlight": [1,2,3], "label": "3" },
        "voice": "Count the fingers before - that's three, your tens digit",
        "duration": 4000
      },
      {
        "step": 4,
        "text": "Count fingers after the fold: that's your ones digit",
        "visual": { "type": "hands", "highlight": [5,6,7,8,9,10], "label": "6" },
        "voice": "Count the fingers after - that's six, your ones digit",
        "duration": 4000
      },
      {
        "step": 5,
        "text": "Put them together: 36!",
        "visual": { "type": "number_combine", "tens": 3, "ones": 6, "result": 36 },
        "voice": "Three and six make thirty-six! Nine times four equals thirty-six!",
        "duration": 4000
      }
    ],
    "rule_card": {
      "title": "The 9 Trick",
      "rule": "Tens digit = number - 1, Ones digit = 10 - number",
      "examples": ["9×4: 3,6 = 36", "9×7: 6,3 = 63", "9×9: 8,1 = 81"]
    }
  },
  "total_duration": 18000
}
```

### Content Type 2: DEMO PROBLEMS (~500 total)

```json
{
  "demo_id": "MULT-R9-DEMO-001",
  "rule_id": "MULT-R9",
  "problem": "9 × 7",
  "answer": 63,
  "walkthrough": [
    {
      "step": 1,
      "instruction": "Hold up 10 fingers",
      "visual": { "type": "hands", "fingers_up": 10 },
      "voice": "First, hold up all ten fingers",
      "duration": 2000
    },
    {
      "step": 2,
      "instruction": "Fold down finger #7",
      "visual": { "type": "hands", "fold_finger": 7 },
      "voice": "Now fold down finger number seven",
      "duration": 2500
    },
    {
      "step": 3,
      "instruction": "Count before: 6",
      "visual": { "type": "hands", "highlight_before": true, "count": 6 },
      "voice": "Count the fingers before the fold - that's six",
      "duration": 2500
    },
    {
      "step": 4,
      "instruction": "Count after: 3",
      "visual": { "type": "hands", "highlight_after": true, "count": 3 },
      "voice": "Count the fingers after - that's three",
      "duration": 2500
    },
    {
      "step": 5,
      "instruction": "Answer: 63",
      "visual": { "type": "equation", "show": "9 × 7 = 63" },
      "voice": "Six and three make sixty-three! Nine times seven equals sixty-three!",
      "duration": 3000
    }
  ]
}
```

### Content Type 3: GUIDED PRACTICE (~750 total)
```json
{
  "practice_id": "MULT-R9-GUIDED-001",
  "rule_id": "MULT-R9",
  "problem": "9 × 5",
  "answer": 45,
  "hint": "Use the finger trick - fold down finger #5",
  "tier1_help": {
    "text": "Fingers before the fold = 4 (tens), Fingers after = 5 (ones)",
    "visual": { "type": "hands", "fold_finger": 5, "show_count": true }
  },
  "tier2_help": {
    "text": "Hold up hands. Fold finger 5. Count: 4 before, 5 after. Answer is 45!",
    "visual": { "type": "hands", "fold_finger": 5, "labels": true, "arrows": true }
  }
}
```

### Content Type 4: PRACTICE PROBLEMS (350,000 - ALREADY SEEDING!)
- This is what the current seeding script creates
- Just questions + answers + tier1/tier2 explanations

### Content Type 5: RULE QUIZZES (~150 total)
```json
{
  "quiz_id": "MULT-R9-QUIZ",
  "rule_id": "MULT-R9",
  "passing_score": 0.8,
  "questions": [
    { "q": "9 × 3 = ?", "a": 27, "options": [24, 27, 36, 28] },
    { "q": "9 × 6 = ?", "a": 54, "options": [45, 54, 63, 56] },
    { "q": "9 × 8 = ?", "a": 72, "options": [63, 72, 81, 78] },
    { "q": "9 × 4 = ?", "a": 36, "options": [32, 36, 45, 38] },
    { "q": "9 × 9 = ?", "a": 81, "options": [72, 81, 90, 89] }
  ],
  "pass_reward": { "coins": 25, "badge": "9-Trick Master" },
  "fail_action": "return_to_teaching"
}
```

### Content Type 6: WEEKLY TESTS (~600 total)
```json
{
  "weekly_test_id": "MATH-G3-W1",
  "grade": 3,
  "week": 1,
  "rules_covered": ["MULT-R0", "MULT-R1", "MULT-R2"],
  "passing_score": 0.8,
  "questions": [
    { "rule": "MULT-R0", "q": "5 × 0 = ?", "a": 0 },
    { "rule": "MULT-R0", "q": "0 × 100 = ?", "a": 0 },
    { "rule": "MULT-R1", "q": "7 × 1 = ?", "a": 7 },
    { "rule": "MULT-R1", "q": "1 × 25 = ?", "a": 25 },
    { "rule": "MULT-R2", "q": "2 × 6 = ?", "a": 12 },
    // ... 15 questions total
  ],
  "pass_reward": { "coins": 50, "badge": "Week 1 Champion" }
}
```

### Content Type 7: MONTHLY REVIEWS (~150 total)
```json
{
  "monthly_review_id": "MATH-G3-M1",
  "grade": 3,
  "month": 1,
  "weeks_covered": [1, 2, 3, 4],
  "rules_covered": ["MULT-R0", "MULT-R1", "MULT-R2", "MULT-R5", "MULT-R10", "MULT-R3", "MULT-R4", "MULT-R9"],
  "passing_score": 0.8,
  "total_questions": 40,
  "time_limit_minutes": 30,
  "pass_reward": { "coins": 200, "badge": "Multiplication Master", "unlock": "DIVISION-UNIT" }
}
```

---

## CONTENT COUNTS NEEDED

| Content Type | Count | Tokens Est. | Cost (Haiku) |
|--------------|-------|-------------|--------------|
| Rule Teaching Scripts | ~150 | ~300 each | ~$18 |
| Demo Problems | ~500 | ~200 each | ~$40 |
| Guided Practice | ~750 | ~150 each | ~$45 |
| Practice Problems | 350,000 | ~100 each | ~$560 (running) |
| Rule Quizzes | ~150 | ~100 each | ~$6 |
| Weekly Tests | ~600 | ~150 each | ~$36 |
| Monthly Reviews | ~150 | ~200 each | ~$12 |
| **TOTAL** | | | **~$717** |

---

## THE USER EXPERIENCE FLOW

### When Kid Opens a Subject (e.g., Math)
```
┌─────────────────────────────────────────────────────────────────┐
│ MATH - Grade 3                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│ │ ×0 Rule      │  │ ×1 Rule      │  │ ×2 Rule      │            │
│ │ ✅ MASTERED  │  │ ✅ MASTERED  │  │ ⭕ IN PROGRESS │            │
│ └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                  │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│ │ ×5 Rule      │  │ ×10 Rule     │  │ ×3 Rule      │            │
│ │ 🔓 UNLOCKED  │  │ 🔓 UNLOCKED  │  │ 🔓 UNLOCKED  │            │
│ └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                  │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│ │ ×4 Rule      │  │ ×6 Rule      │  │ ×9 Rule      │            │
│ │ 🔓 UNLOCKED  │  │ 🔓 UNLOCKED  │  │ 🔓 UNLOCKED  │            │
│ └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                  │
│ [WEEKLY TEST: Week 1]  [MONTHLY REVIEW: September]              │
└─────────────────────────────────────────────────────────────────┘

ALL UNLOCKED - Kid can click any rule and start learning!
```

### When Kid Clicks a Rule
```
Rule Flow:
1. RULE TEACHING (watch/listen) →
2. DEMO PROBLEMS (watch Gigi solve 3) →
3. GUIDED PRACTICE (try 5 with hints) →
4. INDEPENDENT PRACTICE (do 10-20 alone) →
5. RULE QUIZ (pass 80% to master)

They can EXIT anytime and come back later.
Progress is saved.
```

### When Kid Needs Help with Homework
```
Kid: "I need help with 9 × 7"

System:
1. Identifies this is ×9 rule
2. Shows RULE TEACHING for ×9
3. Shows DEMO for 9 × 7 specifically
4. Kid understands → Does their homework!

NO LIVE AI NEEDED - All pre-scripted!
```

---

## IMPLEMENTATION PRIORITY

### Phase 1: Currently Running (Practice Problems)
- 350K practice problems with tier1/tier2 - IN PROGRESS

### Phase 2: Rule Teaching Scripts (Next)
- ~150 rule teaching scripts
- Each has: intro, steps, visuals, voice, rule card

### Phase 3: Demo Problems
- ~500 worked examples (3-5 per rule)
- Step-by-step walkthroughs

### Phase 4: Quizzes and Tests
- Rule quizzes (~150)
- Weekly tests (~600)
- Monthly reviews (~150)

### Phase 5: Guided Practice
- ~750 hint-enabled problems
- Connect to tier1/tier2 from practice problems

---

## RESEARCH-BACKED STRUCTURE

Based on educational research (I Do, We Do, You Do - Gradual Release):

| Phase | Research Term | Our Implementation |
|-------|--------------|-------------------|
| I DO (Modeling) | Teacher demonstrates | Rule Teaching + Demo Problems |
| WE DO (Guided) | Teacher + student together | Guided Practice with hints |
| YOU DO (Independent) | Student alone | Independent Practice + Quiz |

**Sources:**
- Dunst et al. (2019) - Meta-analysis showing explicit instruction improves outcomes
- Lan (2010) - Clear modeling + structured practice builds autonomy
- Killen et al. (2003) - Direct instruction + guided work + independent practice = core strategy

This is how real teachers teach. We're just pre-scripting it so Gigi can deliver it consistently to millions of kids.

---

## NEXT STEP

Create the seeding prompt for RULE TEACHING SCRIPTS - this is the foundation everything else builds on.
