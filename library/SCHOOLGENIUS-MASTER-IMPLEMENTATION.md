# SCHOOLGENIUS MASTER IMPLEMENTATION FILE
## Everything Claude Code Needs - One Document
## Version 1.0 - January 16, 2026

---

# SECTION 1: ENFORCEMENT GATE

**YOU CANNOT DO ANY WORK UNTIL YOU COMPLETE THIS GATE.**

## GATE STEP 1: Read and Confirm

Before ANY task, read these files and state what you learned:

| File | Location | You Must State |
|------|----------|----------------|
| This file | You're reading it | The 6-phase lesson flow |
| Subject README | /seeding/README-[SUBJECT]-SEEDING.md | Rules for that subject |

**Say this to Phillip:**
"I read the master file. The 6 phases are: [list them]. I understand the standards are [Arizona/ISTE/Lexile]."

## GATE STEP 2: Check What Exists

Before generating ANYTHING, run database counts:

```sql
SELECT 'rule_teaching_scripts' as tbl, COUNT(*) FROM rule_teaching_scripts
UNION ALL SELECT 'demo_problems', COUNT(*) FROM demo_problems
UNION ALL SELECT 'guided_practice', COUNT(*) FROM guided_practice
UNION ALL SELECT 'practice_problems', COUNT(*) FROM practice_problems
UNION ALL SELECT 'weekly_quizzes', COUNT(*) FROM weekly_quizzes
UNION ALL SELECT 'monthly_reviews', COUNT(*) FROM monthly_reviews;
```

**Show Phillip the results. Do not proceed without approval.**

## GATE STEP 3: Check Backups

```bash
ls -la backups/
```

If `gradual-release-format-items.json` exists (45,291 items), ask Phillip if you should use them.

## GATE STEP 4: State Your Plan

Before generating, tell Phillip:

"I am going to generate [X] items for [TABLE].
They follow [STANDARD - Arizona/ISTE/Lexile].
Format matches the schema in this file.
I will verify 100% per grade when done.
Approve?"

**WAIT FOR "approved" BEFORE STARTING.**

---

# SECTION 2: FOUNDATION - WHAT EVERYTHING IS BUILT ON

## Arizona Curriculum Standards
- **Math, Reading, Writing, Spelling** → Arizona State Standards
- Every lesson maps to a specific Arizona standard code
- Standard field required in every content item

## ISTE Standards
- **Coding, Typing** → ISTE (International Society for Technology in Education)
- Industry standards for technology education

## Lexile Levels (Reading Only)
- Reading content matched to kid's Lexile level
- Determines reading difficulty
- Used for placement and progression

## The Standard Field

Every content item MUST have:
```json
{
  "standard": "AZ.MATH.3.NBT.2" // Arizona Math, Grade 3, Numbers Base Ten, Standard 2
}
```

For Coding/Typing:
```json
{
  "standard": "ISTE.1c" // ISTE Standard 1c
}
```

---

# SECTION 3: COPPA COMPLIANCE (Under 13)

## Absolute Rules

1. **NO LIVE AI** - All content must be pre-seeded
2. **Maximum Grade 7** - Even if kid is smarter, cap at Grade 7 content
3. **Themes always kid-appropriate** - No dating, violence, horror, real money
4. **No personal data** - Beyond learning progress
5. **Parent controls everything**
6. **No social features**
7. **Gigi = pre-scripted responses ONLY**

## Chat Box Rules

- Gigi is the only one who shows text in chat
- Kid clicks BUTTONS (not free typing) for under 13
- Every response is pre-scripted
- No data stored from interactions

---

# SECTION 4: THE COMPLETE LESSON FLOW

## STEP 0: PLACEMENT TEST (Before Any Subject)

**What happens:** Kid takes a test to determine starting level
**Purpose:** Don't start at Grade K if they already know it
**Result:** Places kid at correct skill level within the subject

```
Kid selects Math → Placement Test → Scores at Grade 3 level → Starts Math at Grade 3
```

---

## STEP 1: RULE TEACHING (I DO - Teacher Models)

**What happens:** Gigi teaches the RULE. Kid watches and listens. No interaction.

**This is what sets SchoolGenius apart. Rules first. Always.**

**Database table:** `rule_teaching_scripts`
**Target count:** ~150 rules total across all subjects

**Format:**
```json
{
  "rule_id": "MATH-R-MULT9",
  "rule_name": "Multiplication by 9 (Finger Trick)",
  "subject": "math",
  "grade": 3,
  "standard": "AZ.MATH.3.OA.7",
  "teaching_script": {
    "intro": "Let me show you the coolest trick for multiplying by 9!",
    "steps": [
      {
        "step": 1,
        "text": "Hold up all 10 fingers",
        "visual": { "type": "hands", "data": {} },
        "voice_text": "Hold up all ten fingers like this",
        "duration": 3000
      }
    ]
  },
  "rule_card": {
    "title": "The 9s Finger Trick",
    "rule_text": "Put down the finger for the number you multiply by 9",
    "examples": ["9 x 3 = 27", "9 x 7 = 63"],
    "memory_tip": "The tens and ones always add up to 9!"
  }
}
```

**Seeding prompt:** `/library/RULE-TEACHING-SCRIPTS-SEEDING-PROMPT.md`

---

## STEP 2: DEMO PROBLEMS (I DO - Teacher Shows Examples)

**What happens:** Gigi solves 3 example problems while kid watches. Step-by-step.

**Database table:** `demo_problems`
**Target count:** ~500 total (3-4 demos per rule)

**Format:**
```json
{
  "demo_id": "DEMO-MATH-R-MULT9-001",
  "rule_id": "MATH-R-MULT9",
  "subject": "math",
  "grade": 3,
  "standard": "AZ.MATH.3.OA.7",
  "problem": "What is 9 x 4?",
  "answer": "36",
  "walkthrough": {
    "steps": [
      {
        "step": 1,
        "action": "Hold up 10 fingers",
        "visual": { "type": "hands", "data": {} },
        "voice_text": "Let's use our finger trick!"
      },
      {
        "step": 2,
        "action": "Put down finger 4",
        "visual": { "type": "hands", "finger_down": 4 },
        "voice_text": "Put down your 4th finger"
      },
      {
        "step": 3,
        "action": "Count fingers on each side",
        "voice_text": "3 fingers on the left, 6 on the right. 36!"
      }
    ]
  }
}
```

**Seeding prompt:** `/library/DEMO-PROBLEM-WALKTHROUGHS-SEEDING-PROMPT.md`

---

## STEP 3: GUIDED PRACTICE (WE DO - Work Together)

**What happens:** Kid tries 5 problems WITH hints. Gigi helps if stuck.

**Database table:** `guided_practice`
**Target count:** ~750 total (5 per rule)

**Format:**
```json
{
  "guided_id": "GUIDED-MATH-R-MULT9-001",
  "rule_id": "MATH-R-MULT9",
  "subject": "math",
  "grade": 3,
  "standard": "AZ.MATH.3.OA.7",
  "problem": "What is 9 x 6?",
  "answer": "54",
  "hints": [
    "Remember the finger trick!",
    "Put down your 6th finger",
    "Count the fingers on each side"
  ],
  "solution": {
    "steps": [
      "Put down finger 6",
      "5 fingers on left = 50",
      "4 fingers on right = 4",
      "50 + 4 = 54"
    ]
  },
  "encouragement": "You're getting it! Try the next one."
}
```

---

## STEP 4: INDEPENDENT PRACTICE (YOU DO - Solo)

**What happens:** Kid does 10-20 problems alone. No hints. Gets tier1/tier2 if wrong.

**Database table:** `practice_problems`
**Target count:** 200,000 total (currently have 132,411)

**Format:**
```json
{
  "id": "MATH-G3-MULT9-P001",
  "subject": "math",
  "grade": 3,
  "skill": "Multiplication by 9",
  "rule_id": "MATH-R-MULT9",
  "standard": "AZ.MATH.3.OA.7",
  "question": "What is 9 x 7?",
  "answer": "63",
  "options": ["56", "63", "72", "81"],
  "tier1": {
    "teach": "Use the finger trick! Put down finger 7.",
    "visual": { "type": "hands", "finger_down": 7 },
    "voice_text": "Put down your 7th finger and count!"
  },
  "tier2": {
    "teach": "6 fingers left, 3 fingers right. 63!",
    "visual": { "type": "hands", "show_count": true },
    "voice_text": "Six three. Sixty-three!"
  }
}
```

---

## THE TWO-TIER EXPLANATION SYSTEM

**FIRST WRONG ANSWER → tier1**
- Standard explanation (max 25 words)
- Visual aid
- Voice narration (max 20 words)

**SECOND WRONG ANSWER → tier2**
- SIMPLER explanation (max 20 words)
- More concrete visual
- Shorter voice (max 15 words)
- Smaller words, more examples

**THIRD WRONG ANSWER → Back to Rule Teaching**
- AI detects struggle
- Gigi says "Let's review the rule together"
- Returns kid to Step 1 for this rule

---

## STEP 5: RULE QUIZ (Assessment)

**What happens:** Quick quiz on this rule. Pass 80% to master.

**Database table:** `weekly_quizzes`
**Target count:** ~600 quizzes

**Format:**
```json
{
  "quiz_id": "QUIZ-MATH-G3-W12",
  "subject": "math",
  "grade": 3,
  "week": 12,
  "rules_covered": ["MATH-R-MULT9", "MATH-R-MULT8"],
  "questions": [
    {
      "q_num": 1,
      "rule_id": "MATH-R-MULT9",
      "question": "What is 9 x 5?",
      "answer": "45",
      "options": ["36", "45", "54", "55"],
      "explanation": "Put down finger 5: 4 on left, 5 on right = 45"
    }
  ],
  "pass_threshold": 80,
  "reward_coins": 25
}
```

**Seeding prompt:** `/library/WEEKLY-QUIZ-SEEDING-PROMPT.md`

---

## STEP 6: WEEKLY RULES TEST

**What happens:** End of week test on ALL rules learned that week.
**Purpose:** Verify kid understood the rules, not just memorized answers.
**Includes:** Examples and re-teaching if needed.

**Pass (80%+):** Move to next week, earn coins
**Fail:** Review rules, retake test

---

## STEP 7: MONTHLY REVIEW

**What happens:** Comprehensive test of ALL rules from the month.
**Target count:** ~150 monthly reviews
**Questions:** 40 total
**Time limit:** 30 minutes
**Pass (80%+):** BIG COINS + unlock next unit

**Database table:** `monthly_reviews`
**Seeding prompt:** `/library/MONTHLY-REVIEW-SEEDING-PROMPT.md`

---

## STEP 8: MASTERY → UNLOCK PRACTICE MODES

**After passing (80%+), kid unlocks endless practice:**

| Mode | Description | Time | Reward |
|------|-------------|------|--------|
| Quick Quiz | 10 random questions | 5 min | 10 coins |
| Speed Run | Beat the clock | 3 min | 15 coins |
| Accuracy Challenge | No mistakes allowed | No limit | 20 coins |
| Mixed Review | All mastered skills | 10 min | 25 coins |
| Boss Battle | Harder problems | No limit | 30 coins |
| Daily Challenge | New every day | 5 min | 15 coins |
| Beat Your Score | Personal best | No limit | Bonus |
| Mystery Challenge | Random mix | 5 min | 20 coins |

**Target:** 10-15 practice test templates per subject that pull from question bank.

---

## STEP 9: REVIEW SESSION BEFORE TESTS

**Before Weekly or Monthly tests:**
- "Review Mode" available
- Quick recap of all rules
- Kid can pick specific rules to review
- Shows "weak spots" - rules they struggled with

---

# SECTION 5: CROSS-SUBJECT INTEGRATION

**Once TYPING is mastered, it becomes a tool:**

| Typing + | What Happens |
|----------|--------------|
| Spelling | TTS says word, kid types it |
| Writing | Type sentences from writing curriculum |
| Reading | Type passages from reading content |
| Coding | Type code snippets |

**Once SPELLING is mastered, it feeds into:**
- Typing practice content
- Writing (knows how to spell words for essays)
- Reading (can decode words they've spelled)

---

# SECTION 6: MASTERY PROGRESSION LEVELS

| Level | Name | Meaning |
|-------|------|---------|
| 0 | NOT STARTED | Kid hasn't touched this skill |
| 1 | LEARNING | Started lesson, still in Phase 1-3 |
| 2 | PRACTICED | Finished lesson, quiz < 80% |
| 3 | PASSED | Quiz score 80%+ |
| 4 | MASTERED | 90%+ on 3 practice sessions |
| 5 | ADVANCED | Moved to next skill level |

**SKILL-BASED, NOT GRADE-LOCKED:**
- Kid can advance beyond enrolled grade
- 1st grader can do Grade 3 math if they master Grade 1-2
- Maximum: Grade 7 (under-13 COPPA cap)

---

# SECTION 7: THEME SYSTEM

**Themes are separate from content difficulty.**

A 5-year-old doing Grade 4 math sees "candy store" examples, NOT "tax calculation."

**Theme Buckets:**

| Age | Themes |
|-----|--------|
| K-2 | Animals, toys, candy, playground, birthday, cartoons |
| 3-5 | Sports, games, pets, school, family, hobbies |
| 6-7 | Movies, music, social (age-appropriate), technology |

**NEVER for Under-13:**
- Dating, violence, horror
- Real money (use coins, gems)
- Social media references
- Mature humor

---

# SECTION 8: SPECIAL FEATURES

## "I'm Stuck" Button

Available on every practice screen:
- Kid clicks "I'm Stuck"
- Gigi says "Let's review the rule together"
- Returns to Rule Teaching for that specific rule
- Prevents frustration

## Certificate System

When kid masters a skill or completes a subject level:
- Printable certificate generated
- "Congratulations [Name]! You mastered Multiplication!"
- Parent can print/share

## Parent Progress Report

Shows parent:
- Rules mastered this week
- Areas of struggle
- Practice sessions completed
- Recommended focus areas

---

# SECTION 9: SUBJECT TARGETS

## Content Counts

| Subject | Learning Mode | Practice Mode | Total |
|---------|---------------|---------------|-------|
| Math | 88,000 | 50,000 | 138,000 |
| Reading | 52,000 | 30,000 | 82,000 |
| Spelling | 26,000 | 15,000 | 41,000 |
| Writing | 12,000 | 8,000 | 20,000 |
| Coding | 12,000 | 5,000 | 17,000 |
| Typing | 10,000 | 10,000 | 20,000 |
| **TOTAL** | **200,000** | **118,000** | **318,000** |

## Grade Breakdown (Example: Math)

| Grade | Target |
|-------|--------|
| K | 8,000 |
| 1 | 12,000 |
| 2 | 12,000 |
| 3 | 14,000 |
| 4 | 12,000 |
| 5 | 11,000 |
| 6 | 10,000 |
| 7 | 9,000 |
| **TOTAL** | **88,000** |

---

# SECTION 10: VISUAL TYPES BY SUBJECT

## 21 Visual Types Supported

**Reading:**
- letter (letter, case, show_stroke)
- phonics (sound, examples, mouth_position)
- word_building (letters, blend_points, final_word)
- sight_word (word, sentence, highlight_in_sentence)
- syllable (word, syllables, clap_count)

**Math:**
- counting_objects (count, emoji, groups, per_group)
- number_line (min, max, highlight, jump_from, jump_to)
- place_value (number)
- array (rows, columns, emoji, show_equation)
- fraction (pie|bar, numerator, denominator)
- bar_model (total, parts, labels, unknown)
- balance_scale (left, right, balanced)
- equation_steps (equations, highlight_step, action)
- graph (coordinate|bar|line, points)

**Spelling:**
- spelling_rule (rule, correct_examples, incorrect_examples, exceptions)

**Writing:**
- sentence_builder (parts, part_types, correct_order, punctuation)

**Typing:**
- keyboard (highlight_keys, finger_labels, home_row, target_key, finger_to_use)

**Coding:**
- code_block (language, code, highlight_lines, output)
- variable_box (name, value, type, show_update, new_value)
- loop_animation (iterations, action, emoji, current_iteration)
- conditional (condition, if_true, if_false, current_value, result)
- output (lines, typing_effect)

---

# SECTION 10B: ANIMATION SPECIFICATIONS

## 22 Animation Components Available

### Core Animations

**1. Particle System**
| Property | Default | Description |
|----------|---------|-------------|
| count | 20 | Number of particles |
| spread | 100 | Spread distance |
| duration | 1500ms | Total animation time |
| shapes | circle, star, square, triangle | Random selection |
| size | 4-12px | Random range |
| velocity | 2-5 | Speed multiplier |
| colors | blue, purple, pink, orange, green | Random selection |
| ease | easeOut | Framer Motion easing |

Trigger: `triggerParticles(x, y, count)`

**2. Confetti**
| Property | Value | Description |
|----------|-------|-------------|
| particle_count | 50 | Pieces of confetti |
| duration | 2-3 seconds | Random per particle |
| total_visible | 3000ms | Full animation |
| colors | green, blue, orange, pink, purple, red | Random |
| size | 5-15px | Random |
| shape | circle or square | 50/50 random |
| start_position | center screen (50vw, 50vh) | Burst origin |
| end_position | 120vh (falls off screen) | Gravity |
| rotation | 0-1080° | Spinning (3x rotation) |
| ease | [0.25, 0.46, 0.45, 0.94] | Custom bezier |

**3. Floating XP**
| Property | Value | Description |
|----------|-------|-------------|
| duration | 2000ms | Total float time |
| y_travel | -100px | Floats upward |
| scale | [0.5 → 1.2 → 1 → 0.8] | Bounce effect |
| opacity | [0 → 1 → 1 → 0] | Fade in/out |
| ease | [0.34, 1.56, 0.64, 1] | Springy bezier |

**5 Variants:**
| Variant | Color Gradient | Icon |
|---------|----------------|------|
| xp | blue-400 → blue-600 | Zap |
| coins | yellow-400 → yellow-600 | Sparkles |
| stars | purple-400 → purple-600 | Star |
| achievement | green-400 → green-600 | Trophy |
| combo | orange-400 → red-600 | Target |

Trigger: `triggerXPGain(amount, x, y, variant)`

### Gigi Character Animations

**5 Animation Types:**
| Animation | Keyframes | Duration | Easing |
|-----------|-----------|----------|--------|
| bounce | y: [0, -20, 0] | 2s | easeInOut |
| float | y: [0, -15, 0] | 3s | easeInOut |
| pulse | scale: [1, 1.1, 1] | 2s | easeInOut |
| sway | rotate: [-5°, 5°, -5°] | 3s | easeInOut |
| spin | rotate: [0, 360] | 4s | linear |

**Theme Entry Animation:**
- Initial: scale: 0, rotate: -180°, opacity: 0
- Animate: scale: 1, rotate: 0, opacity: 1
- Transition: spring, damping: 15

**Click-to-Spin:** 1 second spin animation on click

**Background Glow:**
- Scale: [1 → 1.2 → 1]
- Opacity: [0.3 → 0.5 → 0.3]
- Duration: 3s, infinite

**70+ Theme Configurations** with assigned idle animations

### Lesson Visual Animations

**Equation Steps:**
| Property | Value | Description |
|----------|-------|-------------|
| step_delay | 800ms | Between each step |
| transition_duration | 700ms | Slide-in effect |
| slide_direction | -8px → 0 | From left |
| opacity | 0 → 1 | Fade in |
| completion_animation | bounce | "Solution Complete!" |

**Number Line:**
| Property | Value | Description |
|----------|-------|-------------|
| hop_interval | 1200ms | Time between hops |
| hop_height | -30px | Frog jump |
| hop_duration | 400ms | Single hop |
| character_move | spring (stiffness: 100, damping: 15) | Position change |
| arc_draw | pathLength 0 → 1 | SVG path animation |
| arc_duration | 400ms | Drawing the arc |
| result_animation | opacity 0→1, y: 20→0 | Answer reveal |

**Visual Lesson Player:**
| Property | Value | Description |
|----------|-------|-------------|
| step_transition | 500ms | Delay between steps |
| step_enter | scale: 0.95→1, opacity: 0→1 | Fade zoom in |
| step_exit | scale: 1→1.05, opacity: 1→0 | Fade zoom out |
| transition_duration | 300ms | Each direction |
| progress_bar | animated width | Smooth fill |
| default_step_duration | 3000ms | If no audio |

### Tier1/Tier2 Visual Step Format

**tier1 Step:**
```json
{
  "step": 1,
  "visual": {
    "type": "hands",
    "data": { "fold_finger": 7 }
  },
  "voice_text": "Fold finger 7. Count 6 before, 3 after. 63!",
  "duration": 4000
}
```

**tier2 Step (Simpler - more visual aids):**
```json
{
  "step": 1,
  "visual": {
    "type": "hands",
    "data": { "fold_finger": 5, "labels": true, "arrows": true }
  },
  "voice_text": "Hold up hands. Fold 5. Count: 4 before, 5 after = 45!",
  "duration": 4000
}
```

**Key Difference:** tier2 includes extra visual aids (`labels: true`, `arrows: true`, `simplified: true`)

### Additional Animation Components

| Component | Purpose |
|-----------|---------|
| CoinBurst.tsx | Coins exploding animation |
| CelebrationOverlay.tsx | Full-screen celebration |
| ThemeSwitchEffect.tsx | Theme change transition |
| PulseGlow.tsx | Glowing pulse effect |
| FloatingCoins.tsx | Coins floating upward |
| SuccessRipple.tsx | Ripple on correct answer |
| AnimatedCounter.tsx | Number counting animation |
| MagicPageTransition.tsx | Page transitions |
| DisneyHeader.tsx | Animated header |
| ThemeLoader.tsx | Theme loading animation |
| PremiumLoader.tsx | Premium loading state |
| AgeCelebration.tsx | Age-specific celebrations |
| ShimmerEffect.tsx | Shimmer/loading effect |

### Timing Summary

| Animation | Duration |
|-----------|----------|
| Confetti total | 3000ms |
| Particle system | 1500ms |
| Floating XP | 2000ms |
| Gigi bounce | 2000ms |
| Gigi float | 3000ms |
| Gigi pulse | 2000ms |
| Gigi sway | 3000ms |
| Gigi spin | 4000ms |
| Equation step reveal | 800ms between |
| Number line hop | 1200ms between |
| Visual step default | 3000ms |
| Step transition | 300-500ms |

---

# SECTION 10C: RIVE AI ANIMATION SYSTEM

## Status: TO BE IMPLEMENTED

**Rive will be used for highest quality educational visuals.**

## Why Rive
- Duolingo uses Rive for their learning animations
- Google, Microsoft, Alibaba use it
- Buttery smooth 60fps vector animations
- Tiny file sizes (10-50KB per animation)
- Interactive state machines
- **AI can create animations through MCP integration**

## Pricing
- **Free** to create in editor
- **$9-14/month** to export and ship
- Get account at: https://rive.app

## AI Integration (99/1 Approach)
Rive has MCP (Model Context Protocol) integration that lets Claude control Rive to create animations automatically.

**MCP Tools Available:**
- `createStateMachine` - Build animation state machines
- `createShapes` - Generate vector shapes (circles, rectangles, paths)
- `createViewModels` - Set up data binding
- `layout` - Arrange objects

## Setup Instructions

**Step 1: Install Rive Package**
```bash
npm install @rive-app/react-canvas
```

**Step 2: Get Rive Account**
1. Go to https://rive.app
2. Sign up (free to create)
3. Get API key from account settings
4. Upgrade to $9/month plan to export

**Step 3: Install Rive MCP Server**
```bash
npm install @rive-app/mcp-server
```

**Step 4: Configure Claude to Control Rive**
Create config file for MCP integration (Claude Code will set this up)

## Priority Animations to Create with Rive AI

| Priority | Animation | Subject | Description |
|----------|-----------|---------|-------------|
| 1 | Counting Objects | Math | Bouncy apples, stars, animals that appear/disappear |
| 2 | Fraction Pies | Math | Pies that animate slicing into pieces |
| 3 | Number Line Frog | Math | Character that hops along number line |
| 4 | Hand/Fingers | Math | Fingers that fold down for multiplication tricks |
| 5 | Keyboard Hands | Typing | Hands showing finger placement |
| 6 | Letter Formation | Reading | Letters that draw stroke-by-stroke |
| 7 | Word Building | Reading | Letters sliding together to form words |
| 8 | Gigi Character | All | Upgraded Gigi with smooth animations |

## Implementation Order
1. Get Rive account and API key
2. Install packages
3. Set up MCP integration
4. Claude AI creates animations through MCP
5. Export and integrate into SchoolGenius

---

# SECTION 10D: ANIMATION QUALITY STANDARDS

## The Goal: Beat the Competition

Create animations that make kids say "WHOA!" and want to keep learning.

**Reference Quality:** Duolingo, Headspace, best mobile games for kids

## Disney/Pixar Animation Principles (REQUIRED)

| Principle | What It Means | Example |
|-----------|---------------|---------|
| Squash & Stretch | Objects compress on impact, stretch when moving fast | Apple squishes when it lands |
| Anticipation | Before any action, show a small wind-up | Pull back before jumping forward |
| Overshoot | Don't stop abruptly, go slightly past then settle back | Bounce past target, then settle |
| Ease In/Out | Start slow, speed up, slow down at end (never linear) | Natural acceleration/deceleration |
| Secondary Motion | When main object moves, attached parts follow with delay | Leaves wiggle after apple bounces |
| Follow Through | Parts keep moving after main action stops | Hair keeps swinging after head stops |
| Timing | Fast = exciting, Slow = calm/important | Quick bounces for celebration |
| Exaggeration | Push expressions and movements beyond realistic | Big eyes, dramatic reactions |
| Appeal | Characters should be cute, friendly, inviting | Round shapes, soft colors, big eyes |
| Juice | Add particles, sparkles, glows, screen shake for impact | Confetti on correct answer |

## Animation Rules for SchoolGenius

**General:**
- Smooth 60fps minimum - no choppy animations
- Colors should POP (bright, saturated, kid-friendly)
- Objects should feel ALIVE, not static
- Every movement has personality

**Feedback Animations:**
- Correct answer = satisfying bounce + sparkle + sound
- Wrong answer = gentle shake + encouraging Gigi response
- Completion = explosion of confetti + coins + celebration

**Educational Animations:**
- Learning should feel like playing a game
- Numbers and letters have personality
- Math objects (apples, stars) bounce and wiggle
- Transitions are smooth, never jarring

**Character Animations (Gigi):**
- Always breathing/moving slightly (never frozen)
- Reacts to kid's actions (happy when correct, encouraging when wrong)
- Celebrates with the kid on achievements
- Has idle animations (blinking, swaying, looking around)

## Quality Checklist for Every Animation

Before shipping any animation, verify:

- [ ] Uses squash and stretch
- [ ] Has anticipation before actions
- [ ] Overshoots and settles (no abrupt stops)
- [ ] Eases in and out (no linear motion)
- [ ] Has secondary motion where applicable
- [ ] Runs at 60fps smooth
- [ ] Colors are bright and kid-friendly
- [ ] Feels alive and playful
- [ ] Makes kids want to keep watching

**If an animation feels "meh" - it's not done. Push it until it feels magical.**

**This is a POLISH upgrade - do AFTER core content is seeded.**

---

# SECTION 11: GENERATION ORDER

**Generate content in this order:**

```
1. Rule Teaching Scripts (150) → Phase 1
2. Demo Problems (500) → Phase 2
3. Guided Practice (750) → Phase 3
4. Practice Problems (200,000) → Phase 4
5. Weekly Quizzes (600) → Phase 5
6. Monthly Reviews (150) → Phase 7
7. Practice Mode Content → Phase 8
```

**DO NOT skip phases. Start with Phase 1.**

**Start with TYPING, then:**
Typing → Math → Reading → Spelling → Writing → Coding

---

# SECTION 12: THE RULES

## Rule 1: CHECK LIBRARY FIRST
Before asking Phillip or starting work, check /library/ and /seeding/ folders.

## Rule 2: DATABASE CHECK
Verify table exists and columns match before generating.

## Rule 3: VERIFY WORK PROOF
Show per-grade database counts. Pull samples FROM DATABASE. Get approval.

## Rule 4: 100% COMPLETION RULE
**DONE = 100% on EVERY grade. Not 95%. Not 99%.**
If ANY grade is short, FIX IT before moving on.

## Rule 5: REUSABLE ASSETS
Save templates to /library/templates/[subject]/. Document locations.

## Rule 6: NO SKIPPING PHASES
Generate Phase 1 before Phase 2. Never skip to Phase 4.

---

# SECTION 13: VERIFICATION CHECKLIST

After generating ANY content:

- [ ] Ran COUNT query on database
- [ ] Showed per-grade breakdown
- [ ] Every grade at 100%
- [ ] Pulled 3-5 random samples FROM DATABASE
- [ ] Phillip approved

**If ANY grade is under 100%, the task is NOT DONE.**

---

# SECTION 14: WHAT ALREADY EXISTS

## In Database
| Table | Rows |
|-------|------|
| practice_problems | 132,411 |
| rule_teaching_scripts | 0 |
| demo_problems | 0 |
| guided_practice | 0 |
| weekly_quizzes | 0 |
| monthly_reviews | 0 |

## In Backups
| File | Items | Format |
|------|-------|--------|
| gradual-release-format-items.json | 45,291 | I DO / WE DO / YOU DO |
| simple-format-items.json | 996 | Basic |

**ASK PHILLIP about using the 45,291 backup items.**

---

# END OF MASTER FILE

**This is the single source of truth.**
**Follow this document for all SchoolGenius work.**
**When in doubt, re-read this file.**
