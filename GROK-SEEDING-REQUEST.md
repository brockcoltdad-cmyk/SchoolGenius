# 🤖 GROK: CREATE ALL SEEDING SCRIPTS
## Complete Content Generation Package

**Mission:** Generate 7 batch seeding scripts to pre-populate SchoolGenius with ALL content before launch

**Why:** Grok API is so cheap (~$0.0003 per generation), we want to seed EVERYTHING upfront for instant responses

**Pattern to Follow:** See `generate-explanations-direct.mjs` as the working reference

---

## 📋 SCRIPTS TO CREATE

### 1. PARENT FAQ SEEDER
**File:** `seed-parent-faq.mjs`

**What it generates:** 57-95 parent help articles

**Categories to cover:**
- Subject-specific struggles (15 articles)
  - "My kid struggles with multiplication"
  - "My kid can't focus on reading"
  - "My kid hates spelling"
  - "My kid gets frustrated with math"
  - One article per core subject × grades

- Platform help (20 articles)
  - "What does 2 stars mean?"
  - "Why did they lose coins?"
  - "What is XP?"
  - "How does leveling work?"
  - "What do colors mean?"
  - "How do I know if they're on track?"
  - "Can I set time limits?"
  - "How do I add another child?"
  - "Is their data safe?"
  - "Can I see what they're learning?"

- How to help at home (22 articles)
  - Math: "Practice with real objects - count toys, split snacks"
  - Reading: "Read together 15 min/day, ask questions"
  - Spelling: "Play word games, use magnetic letters"
  - One article per subject × grade ranges (K-2, 3-5, 6-8, 9-12)

**Database table:** `parent_help_articles`
```sql
CREATE TABLE parent_help_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT,
  grade_range TEXT,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Grok prompt template:**
```
Generate a comprehensive parent FAQ article for:
Question: "{question}"
Category: {category}
Subject: {subject}
Grade Range: {grade_range}

Provide:
1. A warm, understanding answer (200-300 words)
2. Specific actionable tips (3-5 bullet points)
3. What to expect (realistic timeline)
4. When to seek additional help
5. Related resources

Tone: Supportive, empowering, practical
Avoid: Jargon, condescension, one-size-fits-all advice
```

---

### 2. KID Q&A SEEDER
**File:** `seed-kid-qa.mjs`

**What it generates:** 140+ kid "help" responses

**Variations of "I'm stuck":**
- "I don't get it" (10 skill-specific responses)
- "This is hard" (10 skill-specific responses)
- "Help" (10 skill-specific responses)
- "What?" (10 skill-specific responses)
- "Huh?" (10 skill-specific responses)
- "I'm confused" (10 skill-specific responses)
- "Can you explain again?" (10 skill-specific responses)
- "I need help" (10 skill-specific responses)
- "This doesn't make sense" (10 skill-specific responses)
- "I give up" (10 skill-specific responses)
- Plus subject-specific questions (50+)

**Database table:** `kid_qa_library`
```sql
CREATE TABLE kid_qa_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_variation TEXT NOT NULL,
  skill_id UUID REFERENCES skills(id),
  subject TEXT NOT NULL,
  grade_level INT NOT NULL,
  response TEXT NOT NULL,
  response_type TEXT NOT NULL, -- 'encouragement', 'hint', 'explanation', 'redirect'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Grok prompt template:**
```
A {grade_level} grader studying {subject} - {skill_name} says: "{question_variation}"

Generate a helpful, encouraging response from Gigi that:
1. Acknowledges their feeling
2. Offers a quick hint or reframe
3. Encourages them to try
4. Keeps it under 50 words
5. Age-appropriate language

Tone: Warm, supportive, like a patient tutor
Avoid: Talking down, being overly cheerful, giving the answer away
```

---

### 3. SUBJECT ANALOGIES SEEDER
**File:** `seed-subject-analogies.mjs`

**What it generates:** 500+ real-world analogies

**By subject:**
- Math (150 analogies)
  - "Think of fractions like pizza slices"
  - "Multiplication is like groups of things"
  - "Division is sharing equally"
  - 5 analogies per skill × 30 math skills

- Reading (100 analogies)
  - "Reading is like a movie in your head"
  - "Main idea is like the title of a movie"
  - "Context clues are like detective hints"

- Spelling (100 analogies)
  - "Silent E makes vowels say their name, like magic"
  - "Breaking words into chunks is like Legos"

- Coding (100 analogies)
  - "Variables are like labeled boxes"
  - "Loops are like doing homework for each subject"
  - "Functions are like recipes"

- Typing (50 analogies)
  - "Home row is like your keyboard home base"
  - "Touch typing is like playing piano without looking"

**Database table:** `subject_analogies`
```sql
CREATE TABLE subject_analogies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id),
  subject TEXT NOT NULL,
  grade_level INT NOT NULL,
  analogy TEXT NOT NULL,
  explanation TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Grok prompt template:**
```
Create a relatable real-world analogy for:
Skill: {skill_name}
Subject: {subject}
Grade: {grade_level}

Provide:
1. The analogy (one sentence, kid-friendly)
2. How it connects to the concept (2-3 sentences)
3. When to use this analogy (specific situations)

Make it:
- Something kids experience in daily life
- Easy to visualize
- Memorable
- Age-appropriate
```

---

### 4. TRANSITION PHRASES SEEDER
**File:** `seed-transition-phrases.mjs`

**What it generates:** 200+ smooth transition messages

**Transition types:**
- Rules → Demo (50 variations)
  - "Great! Now let me show you how it works..."
  - "Ready to see this in action?"
  - "Watch how I do this first..."

- Demo → Guided Practice (50 variations)
  - "Your turn! Let's practice together..."
  - "Now you try with my help..."
  - "Let's do some together..."

- Guided → Independent (50 variations)
  - "You're doing great! Time to try on your own..."
  - "Ready to fly solo?"
  - "I think you've got this now..."

- Independent → Quiz (50 variations)
  - "You're crushing it! Let's see what you've learned..."
  - "Quiz time! Show me what you know..."
  - "Ready for the real challenge?"

**Database table:** `transition_phrases`
```sql
CREATE TABLE transition_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_phase TEXT NOT NULL,
  to_phase TEXT NOT NULL,
  phrase TEXT NOT NULL,
  theme_id TEXT,
  grade_level INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Grok prompt template:**
```
Generate a smooth, encouraging transition phrase for:
From: {from_phase}
To: {to_phase}
Grade Level: {grade_level}
Theme: {theme} (optional)

Make it:
- Enthusiastic but not over-the-top
- Creates anticipation for next phase
- Acknowledges progress so far
- 10-15 words max
- Age-appropriate
```

---

### 5. ACHIEVEMENT CELEBRATIONS SEEDER
**File:** `seed-achievement-celebrations.mjs`

**What it generates:** 100+ celebration messages

**Achievement types:**
- First lesson complete (10 variations)
- Streak milestones (20 variations)
  - 2 days, 3 days, 7 days, 14 days, 30 days, 60 days, 100 days
- Coin milestones (15 variations)
  - 100, 250, 500, 1000, 2500, 5000 coins
- XP milestones (15 variations)
- Skill mastery (15 variations)
- Theme unlocked (10 variations)
- Badge earned (15 variations)

**Database table:** `achievement_celebrations`
```sql
CREATE TABLE achievement_celebrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_type TEXT NOT NULL,
  milestone_value INT,
  celebration_message TEXT NOT NULL,
  secondary_message TEXT,
  theme_id TEXT,
  grade_level INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Grok prompt template:**
```
Create an exciting celebration message for:
Achievement: {achievement_type}
Milestone: {milestone_value}
Grade Level: {grade_level}
Theme: {theme}

Provide:
1. Main celebration (15-25 words, enthusiastic!)
2. Secondary message (optional, adds context)
3. What it means/why it matters

Make it:
- EXCITING but genuine
- Recognizes the effort
- Makes them want to keep going
- Age-appropriate
```

---

### 6. TIME-OF-DAY GREETINGS SEEDER
**File:** `seed-time-greetings.mjs`

**What it generates:** 50+ personalized greetings

**Times:**
- Morning (15 variations)
  - "Good morning, sunshine! Ready to learn?"
  - "Rise and shine! Let's make today awesome!"

- Afternoon (15 variations)
  - "Perfect time to practice!"
  - "Afternoon learning session - let's go!"

- Evening (10 variations)
  - "Learning before bed? Smart cookie!"
  - "Evening practice makes you extra smart!"

- Weekend (10 variations)
  - "Weekend warrior! Let's have fun learning!"
  - "No school? No problem! Let's learn anyway!"

**Database table:** `greeting_messages`
```sql
CREATE TABLE greeting_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_of_day TEXT NOT NULL,
  greeting TEXT NOT NULL,
  theme_id TEXT,
  grade_level INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 7. RETURN USER MESSAGES SEEDER
**File:** `seed-return-messages.mjs`

**What it generates:** 50+ welcome back messages

**Time away:**
- 1 day (10 variations)
  - "Welcome back! Pick up where you left off?"

- 3 days (10 variations)
  - "We missed you! Ready to jump back in?"

- 1 week (10 variations)
  - "It's been a while! Let's review what you learned..."

- 1 month+ (10 variations)
  - "So glad you're back! Let's start fresh together!"

- First time (10 variations)
  - "Welcome! I'm Gigi, your learning buddy!"

**Database table:** `return_messages`
```sql
CREATE TABLE return_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  days_away_min INT NOT NULL,
  days_away_max INT,
  message TEXT NOT NULL,
  action_suggestion TEXT,
  theme_id TEXT,
  grade_level INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 8. GIGI PERSONALITY LINES SEEDER
**File:** `seed-gigi-personality.mjs`

**What it generates:** 100+ catchphrases

**Categories:**
- General encouragement (20)
  - "You've got this!"
  - "I believe in you!"

- Mistake reframes (20)
  - "Mistakes help us grow!"
  - "Wrong answers are just learning opportunities!"

- Excitement (20)
  - "Ready to be awesome?"
  - "Let's learn together!"

- Celebration (20)
  - "AMAZING work!"
  - "You're on fire!"

- Motivation (20)
  - "Every expert was once a beginner!"
  - "Practice makes progress!"

**Database table:** `gigi_personality`
```sql
CREATE TABLE gigi_personality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  phrase TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  theme_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔧 SCRIPT REQUIREMENTS

### Each script should:

1. **Follow the pattern from `generate-explanations-direct.mjs`:**
   - Import Supabase client
   - Import Grok API call function
   - Progress tracking with checkpoints
   - Error handling
   - Retry logic for failures
   - Delay between API calls (5 seconds)

2. **Database operations:**
   - Check if content already exists (avoid duplicates)
   - Insert new content
   - Update progress counter
   - Log errors

3. **Progress display:**
   - Show [X/Total] for each item
   - Checkpoint every 10 items
   - Time elapsed / remaining
   - Success/error counts
   - Final summary

4. **Error handling:**
   - Catch API errors
   - Catch JSON parsing errors
   - Continue on failure (don't stop entire batch)
   - Log failures for manual review

5. **Batch configuration:**
   - Configurable batch size
   - Configurable delay
   - Can resume from last successful item

### Script template structure:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GROK_API_KEY = process.env.GROK_API_KEY
const BATCH_SIZE = 50
const DELAY_MS = 5000

async function callGrok(prompt) {
  // Grok API call
}

async function generateContent() {
  console.log('🚀 [CONTENT TYPE] SEEDER')
  console.log('='.repeat(80))

  // Get items that need content
  // For each item:
  //   - Generate with Grok
  //   - Parse response
  //   - Save to database
  //   - Track progress

  console.log('📊 SEEDING COMPLETE!')
}

generateContent()
```

---

## 📊 EXPECTED OUTPUT

After running all 7 scripts:

```
✅ Parent FAQ: 57-95 articles generated
✅ Kid Q&A: 140+ responses generated
✅ Subject Analogies: 500+ analogies generated
✅ Transition Phrases: 200+ phrases generated
✅ Achievement Celebrations: 100+ messages generated
✅ Time Greetings: 50+ greetings generated
✅ Return Messages: 50+ messages generated
✅ Gigi Personality: 100+ catchphrases generated

TOTAL: 1,200-1,400 pieces of content
COST: ~$5-10 total
TIME: ~3-4 hours (can run overnight)
```

---

## 🎯 DELIVERABLE

**Grok, please create:**
1. All 7 seeding scripts (.mjs files)
2. A master runner script that executes all 7 in sequence
3. Database migration SQL to create all tables
4. README with usage instructions

**Place in:** `C:\Users\DAD\Desktop\SchoolGenius-Final\seeding\`

**Files to create:**
```
seeding/
├── seed-parent-faq.mjs
├── seed-kid-qa.mjs
├── seed-subject-analogies.mjs
├── seed-transition-phrases.mjs
├── seed-achievement-celebrations.mjs
├── seed-time-greetings.mjs
├── seed-return-messages.mjs
├── seed-gigi-personality.mjs
├── run-all-seeding.mjs (master runner)
├── create-seeding-tables.sql
└── README.md
```

---

## 🤖 GROK: YOUR MISSION

Use this specification to create all 7 seeding scripts plus the master runner.

Follow the patterns from the successful `generate-explanations-direct.mjs` script.

Make them production-ready, well-commented, and easy to run.

**Ready? Let's seed the heck out of SchoolGenius! 🌱**

---

*Specification created: 2026-01-11*
*Target: Complete SchoolGenius content library before public launch*
*Estimated total cost: $5-10*
*Estimated total time: 3-4 hours*
