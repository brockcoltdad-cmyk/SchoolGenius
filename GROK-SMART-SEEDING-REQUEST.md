# 🤖 GROK: CREATE AGE-APPROPRIATE SMART SEEDING SCRIPTS
## Production-Ready Content Generation Package

**Mission:** Create 8 targeted seeding scripts to generate 2,280 high-value, age-appropriate content items for SchoolGenius

**Strategy:** SMART seeding with AGE-APPROPRIATE VARIATIONS - seed what gets used frequently with 4 age versions, let closed-loop handle rare cases

**CRITICAL:** Every kid-facing piece of content MUST have 4 age-group versions!
- **K-2 (Ages 5-8):** Super simple, excited, lots of emojis 🎉⭐
- **3-5 (Ages 8-11):** Friendly, encouraging, regular emojis 🎯💡
- **6-8 (Ages 11-14):** Mature, respectful, selective emojis 💪✓
- **9-12 (Ages 14-18):** Professional, academic, minimal emojis ✓📊

**Total Cost:** ~$2.28
**Total Time:** ~8 hours
**Total Items:** 2,280 age-appropriate responses

---

## 🎯 CRITICAL: AGE-GROUP GENERATION PATTERN

**For EVERY script that has age variations, you MUST generate content for ALL 4 age groups:**

```javascript
const ageGroups = ['k2', 'grades35', 'grades68', 'grades912']

// For each base item...
for (const baseItem of baseItems) {
  // Generate 4 age-appropriate versions
  for (const ageGroup of ageGroups) {
    const prompt = createAgeAppropriatePrompt(baseItem, ageGroup)
    const generated = await callGrok(prompt)
    await saveToDatabase(generated)
  }
}
```

**Age Group Characteristics (CRITICAL TO FOLLOW):**

| Age Group | Tone | Vocabulary | Emojis | Complexity | Example Phrase |
|-----------|------|------------|--------|------------|----------------|
| **k2** | Super excited, warm | Very simple (big, small, try, help) | LOTS! 🎉⭐💪 | ONE concept at a time | "You're so smart! 🎉" |
| **grades35** | Friendly teacher | Clear, richer words | Regular 🎯💡🚀 | 2-3 steps | "Great thinking! 💡" |
| **grades68** | Respectful peer | Mature, no baby talk | Selective 💪✓🔍 | Multi-layered | "Solid work! 💪" |
| **grades912** | Professional | Advanced academic | Minimal ✓📊💪 | Full concepts | "Well reasoned. ✓" |

**Parent content (script #3) does NOT need age variations - it's for adults!**

---

## 📋 SCRIPTS TO CREATE

### 1. seed-kid-stuck-responses.mjs
**Purpose:** Generate AGE-APPROPRIATE responses for when kids ask for help

**Count:** 340 responses (85 base × 4 age groups)

**Breakdown:**
| Question Type | Variations | Subjects | Age Groups | Total |
|---------------|------------|----------|------------|-------|
| "I don't get it" | 4 responses | 5 subjects | 4 ages | 80 |
| "This is hard" | 4 responses | 5 subjects | 4 ages | 80 |
| "Help!" | 3 responses | 5 subjects | 4 ages | 60 |
| "I'm confused" | 3 responses | 5 subjects | 4 ages | 60 |
| "Can you explain again?" | 3 responses | 5 subjects | 4 ages | 60 |

**Subjects:** Math, Reading, Spelling, Coding, Typing
**Age Groups:** k2, grades35, grades68, grades912

**Database Table:**
```sql
CREATE TABLE kid_stuck_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_type TEXT NOT NULL, -- "dont_get_it", "this_is_hard", "help", "confused", "explain_again"
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  response TEXT NOT NULL,
  response_tone TEXT NOT NULL, -- "encouraging", "hint", "reframe"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stuck_responses_lookup ON kid_stuck_responses(question_type, subject, age_group);
```

**Grok Prompt Pattern:**
```
A student studying {subject} says: "{question}"
Age Group: {age_group}

Generate a helpful response from Gigi (the AI tutor) that:
1. Acknowledges their feeling ("I hear you...")
2. Offers a quick reframe or hint (NOT the answer!)
3. Encourages them to try again
4. Under 50 words
5. Warm, patient, supportive tone
6. AGE-APPROPRIATE for {age_group}:

   K-2 (Ages 5-8):
   - SUPER simple words (big, small, try, help)
   - Very excited, warm tone
   - LOTS of emojis 🎉⭐💪
   - One concept at a time
   - Example: "I hear you! Sometimes this is tricky! 😊 Let's try together! Want me to show you? You can do it! 💪"

   3-5 (Ages 8-11):
   - Friendly teacher, building confidence
   - Clear, richer vocabulary
   - Regular emojis 🎯💡🚀
   - Multi-step thinking
   - Example: "I understand - this concept can be challenging! 🤔 Let's break it down. Can you try the first part? I'll help you! 💡"

   6-8 (Ages 11-14):
   - Mature, respectful (NOT baby talk!)
   - Peer/coach tone
   - Selective emojis 💪✓🔍
   - Multi-layered concepts
   - Example: "Let's review this together! 🔍 Sometimes a different angle helps. What part is confusing? I can explain another way! 🔄"

   9-12 (Ages 14-18):
   - Professional, college prep
   - Advanced academic language
   - Minimal emojis ✓💪📊
   - Full concepts, critical thinking
   - Example: "Let's analyze where the confusion is. 🔬 Would a different explanation help? I can break down the concept in detail! 📚"

Return JSON:
{
  "question_type": "dont_get_it",
  "subject": "Math",
  "age_group": "grades35",
  "response": "I understand - math can feel tough sometimes! 🤔 Let's break this problem into smaller steps. Can you tell me what the first step would be? We'll figure it out together! 💡",
  "response_tone": "encouraging"
}
```

**Examples by subject:**
- **Math:** "Let's draw a picture to visualize this problem together"
- **Reading:** "Try reading this sentence one more time slowly"
- **Spelling:** "Let's sound it out piece by piece"
- **Coding:** "Let's check each line one at a time"
- **Typing:** "Take a breath and find the home row keys"

---

### 2. seed-subject-analogies.mjs
**Purpose:** Generate AGE-APPROPRIATE real-world analogies to explain concepts

**Count:** 1,100 analogies (275 base × 4 age groups)

**Breakdown:**
| Subject | Analogies/Skill | Skills | Age Groups | Total |
|---------|-----------------|--------|------------|-------|
| Math | 3 | 30 | 4 ages | 360 |
| Reading | 2 | 25 | 4 ages | 200 |
| Spelling | 2 | 20 | 4 ages | 160 |
| Coding | 3 | 25 | 4 ages | 300 |
| Typing | 1 | 20 | 4 ages | 80 |

**Database Table:**
```sql
CREATE TABLE subject_analogies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id),
  skill_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  analogy TEXT NOT NULL, -- "Fractions are like pizza slices"
  explanation TEXT NOT NULL, -- How the analogy connects
  when_to_use TEXT NOT NULL, -- "When introducing fractions"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analogies_lookup ON subject_analogies(skill_name, subject, age_group);
```

**Grok Prompt Pattern:**
```
Create a relatable real-world analogy for:
Skill: {skill_name}
Subject: {subject}
Age Group: {age_group}

Generate an analogy that:
1. Uses something kids experience daily
2. Is easy to visualize
3. Makes the concept memorable
4. Is AGE-APPROPRIATE for {age_group}:

   K-2 (Ages 5-8):
   - Use toys, snacks, games kids LOVE (blocks, cookies, puppies, Pokemon)
   - ONE simple sentence
   - Very visual - they can picture it
   - Super simple words
   - Example: "Fractions are like pizza slices you share with friends! 🍕"

   3-5 (Ages 8-11):
   - Use relatable everyday things (sports, food, games, school)
   - 2-3 sentences
   - Clear explanation of connection
   - Build on basics they know
   - Example: "Think of fractions like cutting things into equal parts. If you have a chocolate bar with 8 squares and eat 3, you ate 3/8!"

   6-8 (Ages 11-14):
   - Use real-world applications (money, cooking, sports stats)
   - Multi-step explanation
   - Show why it matters
   - Connect to their interests
   - Example: "Fractions represent parts of a whole, like dividing your phone storage. If photos take up 3/4 of 64GB, they're using 48GB."

   9-12 (Ages 14-18):
   - Use academic/professional contexts (finance, science, engineering)
   - Technical but relatable
   - Show real applications
   - Prepare for advanced math
   - Example: "Fractions are rational numbers expressing proportional relationships, like calculating chemical solution concentrations or financial ratios."

Return JSON:
{
  "skill_name": "Fractions",
  "subject": "Math",
  "age_group": "grades35",
  "analogy": "Think of fractions like cutting a chocolate bar into equal squares. If your bar has 8 squares and you eat 3, you ate 3/8 of the bar!",
  "explanation": "Just like the chocolate bar is divided into equal parts, fractions show parts of a whole. The bottom number tells you how many equal parts total, and the top number tells you how many you have.",
  "when_to_use": "When first introducing fractions or when students struggle to understand what fractions represent as parts of a whole"
}
```

**Analogy Examples:**
- **Math Fractions:** Pizza slices, Chocolate bars, Sharing candy
- **Math Multiplication:** Groups of things, Rows and columns, Repeated addition
- **Reading Main Idea:** Movie title, Book cover, Big picture
- **Spelling Silent E:** Magic E makes vowels say their name
- **Coding Variables:** Labeled boxes, Backpack pockets
- **Coding Loops:** Doing homework for each subject
- **Typing Home Row:** Keyboard home base, Starting position

---

### 3. seed-parent-struggle-guides.mjs
**Purpose:** Generate comprehensive guides for when parents say "My kid struggles with X"

**Count:** 28 guides (NO age variations - these are for parents, not kids!)

**Breakdown:**
- Subject struggles: 20 (5 subjects × 4 grade ranges)
- Behavioral: 5 (frustrated, rushes, gives up, unmotivated, distracted)
- Specific issues: 3 (test anxiety, focus problems, confidence)

**Database Table:**
```sql
CREATE TABLE parent_struggle_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  struggle_type TEXT NOT NULL,
  subject TEXT,
  grade_range TEXT NOT NULL, -- "K-2", "3-5", "6-8", "9-12"
  understanding TEXT NOT NULL, -- Why this happens (research-backed)
  specific_tips TEXT[] NOT NULL, -- 5 actionable tips
  whats_normal TEXT NOT NULL, -- What to expect for this age
  when_seek_help TEXT NOT NULL, -- Red flags
  timeline TEXT NOT NULL, -- How long improvement takes
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Grok Prompt Pattern:**
```
A parent says: "My child struggles with {struggle_type}"
Subject: {subject}
Grade Range: {grade_range}

Create a comprehensive, supportive guide with:

1. Understanding (100 words):
   - Why this happens at this age
   - What research/experts say
   - Normalize the struggle

2. Specific Tips (5 actionable items):
   - Concrete, practical advice
   - Things they can do today
   - Both at-home and in-school

3. What's Normal (50 words):
   - Typical timeline for this skill
   - Developmentally appropriate expectations
   - When progress happens

4. When to Seek Help (50 words):
   - Red flags to watch for
   - When to talk to teacher
   - When to consider tutoring

5. Timeline (30 words):
   - How long to see improvement
   - Realistic expectations

Tone: Warm, empowering, research-backed, no judgment

Return JSON with all fields.
```

**Struggle Types:**
- "My kid struggles with multiplication"
- "My kid can't focus on reading"
- "My kid hates spelling"
- "My kid gets frustrated easily"
- "My kid rushes through problems"
- "My kid gives up quickly"
- "My kid has test anxiety"

---

### 4. seed-transition-phrases.mjs
**Purpose:** AGE-APPROPRIATE smooth transitions between lesson phases

**Count:** 300 phrases (75 base × 4 age groups)

**Breakdown:**
| Transition | Variations | Subjects | Age Groups | Total |
|------------|------------|----------|------------|-------|
| Rules → Demo | 5 | 5 | 4 ages | 100 |
| Demo → Practice | 5 | 5 | 4 ages | 100 |
| Practice → Quiz | 5 | 5 | 4 ages | 100 |

**Database Table:**
```sql
CREATE TABLE transition_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_phase TEXT NOT NULL, -- "rules", "demo", "practice"
  to_phase TEXT NOT NULL, -- "demo", "practice", "quiz"
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  phrase TEXT NOT NULL,
  enthusiasm_level TEXT NOT NULL, -- "calm", "medium", "high"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transitions_lookup ON transition_phrases(from_phase, to_phase, subject, age_group);
```

**Grok Prompt Pattern:**
```
Generate a smooth transition phrase:
From: {from_phase}
To: {to_phase}
Subject: {subject}
Age Group: {age_group}

Make it:
1. Enthusiastic but natural (not over-the-top)
2. Creates anticipation for next phase
3. Acknowledges progress so far
4. 10-15 words max
5. AGE-APPROPRIATE for {age_group}:

   K-2: Super excited, simple words, emojis 🎉⭐
   Example: "Great job! Now let's see it in action! Ready? 🎉"

   3-5: Friendly, encouraging, regular emojis 🎯💡
   Example: "Awesome! Now let me show you how this works with a real problem! 💡"

   6-8: Mature, motivating, selective emojis 💪✓
   Example: "Solid! Let's see this concept in action with some practice. 💪"

   9-12: Professional, focused, minimal emojis ✓📊
   Example: "Well done. Let's apply this concept to real problems. ✓"

Return JSON:
{
  "from_phase": "rules",
  "to_phase": "demo",
  "subject": "Math",
  "age_group": "grades35",
  "phrase": "Awesome! Now let me show you how this works with a real problem! 💡",
  "enthusiasm_level": "medium"
}
```

**Examples:**
- Rules → Demo: "Ready to see this in action? Watch how I do it first!"
- Demo → Practice: "Your turn! Let's practice this together."
- Practice → Quiz: "You're crushing it! Time to show what you've learned!"

---

### 5. seed-achievement-celebrations.mjs
**Purpose:** AGE-APPROPRIATE celebration messages when kids earn achievements

**Count:** 168 messages (42 base × 4 age groups)

**Breakdown:**
- First lesson: 5 variations × 4 ages = 20
- Streak milestones (3, 7, 14, 30 days): 12 × 4 ages = 48
- Coin milestones: 10 × 4 ages = 40
- Skill mastery: 15 × 4 ages = 60

**Database Table:**
```sql
CREATE TABLE achievement_celebrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_type TEXT NOT NULL, -- "first_lesson", "streak", "coins", "mastery"
  milestone_value INT, -- 3, 7, 14, 30 for streaks
  subject TEXT, -- For mastery achievements
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  main_message TEXT NOT NULL,
  secondary_message TEXT,
  excitement_level TEXT NOT NULL, -- "medium", "high", "epic"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_celebrations_lookup ON achievement_celebrations(achievement_type, milestone_value, age_group);
```

**Grok Prompt Pattern:**
```
Create a celebration message for:
Achievement: {achievement_type}
Milestone: {milestone_value}
Subject: {subject}
Age Group: {age_group}

Make it:
1. EXCITING but genuine (not fake enthusiasm)
2. Recognizes the specific effort
3. Motivates them to keep going
4. 15-25 words for main message
5. 10-15 words for secondary message (optional)
6. AGE-APPROPRIATE for {age_group}:

   K-2: SUPER excited, simple words, LOTS of emojis 🎉🌟⭐💪
   Example: "WOW! You did your first lesson! You're SO smart! 🎉⭐ Amazing job, friend! 💪"

   3-5: Very excited, encouraging, regular emojis 🎯🚀💡
   Example: "ONE WHOLE WEEK! You're building an awesome learning habit! 🚀 7 days in a row - great dedication! 💡"

   6-8: Excited but mature, motivating, selective emojis 💪✓🔥
   Example: "7-day streak! You're demonstrating real commitment to your learning! 💪 That's solid discipline! ✓"

   9-12: Professional enthusiasm, focused, minimal emojis ✓📊💪
   Example: "7-day streak achieved. Your consistency demonstrates strong self-discipline. ✓ Well done. 📊"

Return JSON:
{
  "achievement_type": "streak",
  "milestone_value": 7,
  "age_group": "grades35",
  "main_message": "ONE WHOLE WEEK! You're building an awesome learning habit! 🚀",
  "secondary_message": "7 days in a row - that's dedication! 💡",
  "excitement_level": "high"
}
```

---

### 6. seed-time-greetings.mjs
**Purpose:** AGE-APPROPRIATE personalized greetings based on time of day

**Count:** 64 greetings (16 base × 4 age groups)

**Breakdown:**
- Morning: 5 variations × 4 ages = 20
- Afternoon: 5 variations × 4 ages = 20
- Evening: 3 variations × 4 ages = 12
- Weekend: 3 variations × 4 ages = 12

**Database Table:**
```sql
CREATE TABLE greeting_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_of_day TEXT NOT NULL, -- "morning", "afternoon", "evening", "weekend"
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  greeting TEXT NOT NULL,
  energy_level TEXT NOT NULL, -- "calm", "upbeat", "chill"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_greetings_lookup ON greeting_messages(time_of_day, age_group);
```

---

### 7. seed-return-messages.mjs
**Purpose:** AGE-APPROPRIATE welcome back messages based on time away

**Count:** 80 messages (20 base × 4 age groups)

**Breakdown:**
- 1 day away: 4 variations × 4 ages = 16
- 3 days away: 4 variations × 4 ages = 16
- 1 week away: 4 variations × 4 ages = 16
- 1 month+ away: 4 variations × 4 ages = 16
- First time: 4 variations × 4 ages = 16

**Database Table:**
```sql
CREATE TABLE return_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  days_away_min INT NOT NULL,
  days_away_max INT,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  message TEXT NOT NULL,
  action_suggestion TEXT, -- "Pick up where you left off?"
  tone TEXT NOT NULL, -- "welcoming", "encouraging", "gentle"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_return_lookup ON return_messages(days_away_min, age_group);
```

---

### 8. seed-gigi-personality.mjs
**Purpose:** AGE-APPROPRIATE consistent catchphrases for Gigi's brand voice

**Count:** 200 catchphrases (50 base × 4 age groups)

**Breakdown:**
- General encouragement: 10 × 4 ages = 40
- Mistake reframes: 10 × 4 ages = 40
- Excitement: 10 × 4 ages = 40
- Motivation: 10 × 4 ages = 40
- Growth mindset: 10 × 4 ages = 40

**Database Table:**
```sql
CREATE TABLE gigi_personality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  phrase TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  tone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_personality_lookup ON gigi_personality(category, age_group);
```

---

## 🔧 MASTER RUNNER SCRIPT

### 9. run-all-smart-seeding.mjs

```javascript
import { execSync } from 'child_process'

const scripts = [
  'seed-kid-stuck-responses.mjs',      // 340 items (85 × 4 ages)
  'seed-subject-analogies.mjs',        // 1,100 items (275 × 4 ages)
  'seed-parent-struggle-guides.mjs',   // 28 items (NO age variations - for parents)
  'seed-transition-phrases.mjs',       // 300 items (75 × 4 ages)
  'seed-achievement-celebrations.mjs', // 168 items (42 × 4 ages)
  'seed-time-greetings.mjs',          // 64 items (16 × 4 ages)
  'seed-return-messages.mjs',          // 80 items (20 × 4 ages)
  'seed-gigi-personality.mjs'          // 200 items (50 × 4 ages)
]

console.log('🌱 AGE-APPROPRIATE SMART SEEDING: Starting all 8 scripts...\n')
console.log('Expected total: 2,280 items')
console.log('Estimated cost: ~$2.28')
console.log('Estimated time: ~8 hours\n')
console.log('Age Groups: K-2, 3-5, 6-8, 9-12 (4 variations per content type)\n')

let totalSuccess = 0
let totalErrors = 0
const startTime = Date.now()

for (const script of scripts) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`🚀 Running: ${script}`)
  console.log('='.repeat(80))

  try {
    execSync(`node seeding/${script}`, { stdio: 'inherit' })
    // Parse output to get success count (implement proper tracking)
  } catch (error) {
    console.error(`❌ Error running ${script}:`, error.message)
    totalErrors++
  }
}

const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

console.log('\n' + '='.repeat(80))
console.log('🎉 AGE-APPROPRIATE SMART SEEDING COMPLETE!')
console.log('='.repeat(80))
console.log(`✅ Total Success: ${totalSuccess}`)
console.log(`❌ Total Errors: ${totalErrors}`)
console.log(`⏱️  Duration: ${duration} minutes`)
console.log(`💰 Estimated Cost: $${(totalSuccess * 0.001).toFixed(2)}`)
console.log(`\n📊 Age Groups Covered: K-2, 3-5, 6-8, 9-12`)
console.log('\n✨ SchoolGenius is now fully seeded with age-appropriate content!\n')
```

---

## 📦 SUPPORTING FILES

### 10. create-seeding-tables.sql
Complete SQL file with all 8 table schemas (included above)

### 11. README.md

```markdown
# SchoolGenius Age-Appropriate Smart Seeding Package

## Quick Start

1. Set environment variables:
```bash
export NEXT_PUBLIC_SUPABASE_URL="your_url"
export SUPABASE_SERVICE_ROLE_KEY="your_key"
export GROK_API_KEY="your_grok_key"
```

2. Create database tables:
```bash
psql -U postgres -d schoolgenius < create-seeding-tables.sql
```

3. Run all seeding scripts:
```bash
node run-all-smart-seeding.mjs
```

## What Gets Seeded (AGE-APPROPRIATE!)

**CRITICAL:** Every kid-facing content has 4 age-group versions:
- K-2 (Ages 5-8): Super simple, excited 🎉⭐
- 3-5 (Ages 8-11): Friendly, encouraging 🎯💡
- 6-8 (Ages 11-14): Mature, respectful 💪✓
- 9-12 (Ages 14-18): Professional, academic ✓📊

**Content Breakdown:**
- 340 kid "stuck" responses (85 × 4 ages)
- 1,100 subject analogies (275 × 4 ages)
- 28 parent struggle guides (NO age variations - for parents)
- 300 transition phrases (75 × 4 ages)
- 168 achievement celebrations (42 × 4 ages)
- 64 time greetings (16 × 4 ages)
- 80 return messages (20 × 4 ages)
- 200 Gigi personality phrases (50 × 4 ages)

**Total: 2,280 items**
**Cost: ~$2.28**
**Time: ~8 hours**

## Individual Scripts

Run one at a time:
```bash
node seeding/seed-kid-stuck-responses.mjs
node seeding/seed-subject-analogies.mjs
# ... etc
```

## Monitoring

Each script shows:
- Progress [X/Total]
- Success/error counts
- Time elapsed/remaining
- Cost estimates

## Troubleshooting

- Rate limits: Scripts have 5-second delays between calls
- Errors: Scripts continue on error, log failures
- Duplicates: Scripts check for existing content
- Retries: Failed items logged for manual retry
```

---

## 🎯 SCRIPT PATTERN (Use This EXACT Structure)

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_API_KEY = process.env.GROK_API_KEY
const DELAY_MS = 5000

async function callGrok(prompt) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a content generator for SchoolGenius. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'grok-beta',
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  // Extract JSON from markdown if needed
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/)
  return JSON.parse(jsonMatch ? jsonMatch[1] : content)
}

async function seedContent() {
  console.log('🚀 [CONTENT NAME] SEEDER')
  console.log('='.repeat(80))

  const items = [/* your items to generate */]
  let success = 0
  let errors = 0
  const startTime = Date.now()

  for (let i = 0; i < items.length; i++) {
    try {
      console.log(`\n[${i+1}/${items.length}] Generating: ${items[i].name}`)

      const prompt = `Your detailed prompt here`
      const generated = await callGrok(prompt)

      // Save to database
      const { error } = await supabase
        .from('table_name')
        .insert(generated)

      if (error) throw error

      console.log(`  ✅ Saved`)
      success++

      // Checkpoint every 10 items
      if ((i + 1) % 10 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
        const remaining = (((items.length - i - 1) * DELAY_MS) / 1000 / 60).toFixed(1)
        console.log(`\n📊 Checkpoint: ${success} success, ${errors} errors`)
        console.log(`   Elapsed: ${elapsed} min | Remaining: ~${remaining} min`)
      }

      await new Promise(resolve => setTimeout(resolve, DELAY_MS))

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`)
      errors++
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n' + '='.repeat(80))
  console.log('📊 SEEDING COMPLETE!')
  console.log(`✅ Success: ${success}/${items.length}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`⏱️  Duration: ${duration} minutes`)
  console.log(`💰 Cost: $${(success * 0.001).toFixed(2)}`)
}

seedContent().catch(console.error)
```

---

## 🎯 YOUR MISSION, GROK

Create all 11 files in a `seeding/` folder:

```
seeding/
├── seed-kid-stuck-responses.mjs
├── seed-subject-analogies.mjs
├── seed-parent-struggle-guides.mjs
├── seed-transition-phrases.mjs
├── seed-achievement-celebrations.mjs
├── seed-time-greetings.mjs
├── seed-return-messages.mjs
├── seed-gigi-personality.mjs
├── run-all-smart-seeding.mjs
├── create-seeding-tables.sql
└── README.md
```

**Make them:**
- Production-ready
- Well-commented
- Error-handled
- Progress-tracked
- Resume-capable
- Easy to run

**When done, SchoolGenius will have:**
- 2,280 AGE-APPROPRIATE high-value content pieces
- 4 versions per content type (K-2, 3-5, 6-8, 9-12)
- Instant responses for 95% of use cases
- Closed-loop handling the rest
- Blazing fast, age-appropriate experience
- All for $2.28!

**REMEMBER:** Every piece of kid-facing content MUST have 4 age-group variations!
- K-2: Super simple, excited, LOTS of emojis 🎉⭐💪
- 3-5: Friendly, encouraging, regular emojis 🎯💡🚀
- 6-8: Mature, respectful, selective emojis 💪✓🔍
- 9-12: Professional, academic, minimal emojis ✓📊💪

**GO CREATE THE AGE-APPROPRIATE SMART SEEDING PACKAGE! 🚀**

---

## 📚 BONUS: PROMPT LIBRARY SEEDING

**After completing the 8 content seeding scripts above, ALSO create:**

### 9. seed-prompt-library.mjs

**Purpose:** Seed reusable prompt templates, verbiage, and instruction patterns

**Why:** We use the same prompts and instructions repeatedly! Seed them once, reuse forever!

**What to seed:**
- ~50 Grok instruction templates (explanation generator, analogy creator, etc.)
- 4 age-group tone definitions (complete prompts for each age group)
- 5 subject-specific instruction patterns (Math, Reading, Spelling, Coding, Typing)
- ~200 standard verbiage phrases (encouragement, transitions, celebrations by age)
- ~20 JSON structure templates
- ~10 quality control checklists

**Total:** ~290 prompt templates

**Database Table:**
```sql
CREATE TABLE prompt_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'instruction', 'tone', 'verbiage', 'format', 'checklist'
  prompt_template TEXT NOT NULL,
  variables JSONB, -- {skill_name}, {age_group}, etc.
  usage_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prompt_name ON prompt_library(prompt_name);
CREATE INDEX idx_category ON prompt_library(category);
```

**Benefits:**
- Pull proven templates instead of crafting new prompts every time
- Consistent quality across all generations
- 2-5 minutes saved per generation
- Reuse best practices

**See:** `PROMPT-LIBRARY-STRATEGY.md` for full details and examples

---

**GO CREATE THE AGE-APPROPRIATE SMART SEEDING PACKAGE! 🚀**

---

*Age-Appropriate Smart Seeding Request - January 2026*
*Optimized for SchoolGenius platform*
*Every kid deserves age-appropriate content!*
