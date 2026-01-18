# 📚 PROMPT LIBRARY STRATEGY
## Seed the Verbiage, Not Just the Content!

**THE INSIGHT:** We use the same prompts and instructions over and over!

**THE SOLUTION:** Create a library of proven prompts, verbiage, and communication patterns!

---

## 🎯 THE CONCEPT

### What We're Doing NOW (Inefficient):
```
Every time I need to ask Grok something:
  ↓
1. Craft a new prompt from scratch
2. Explain the context
3. Define the format
4. Specify the tone
5. List requirements
  ↓
SLOW, INCONSISTENT, WASTEFUL!
```

### What We SHOULD Do (Efficient):
```
Need to ask Grok something?
  ↓
1. Check Prompt Library
2. Found? → Use proven template (INSTANT!)
3. Not found? → Create once, save forever
  ↓
FAST, CONSISTENT, EFFICIENT!
```

---

## 📋 WHAT TO SEED IN PROMPT LIBRARY

### 1. GROK INSTRUCTION TEMPLATES

**Standard Explanation Generator:**
```
Generate a {type} explanation for:
Skill: {skill_name}
Subject: {subject}
Grade: {grade_level}
Age Group: {age_group}

Requirements:
- Age-appropriate language for {age_group}
- {word_count} words maximum
- Include {num_examples} examples
- Tone: {tone}
- Format: {format}

Return as JSON:
{json_structure}
```

**This gets reused for:**
- Every skill explanation
- Every analogy
- Every help response
- Saves rebuilding the prompt each time!

---

### 2. AGE-APPROPRIATE TONE DEFINITIONS

Instead of explaining age groups every time:

**SEED THESE ONCE:**
```json
{
  "k2_tone": "Super simple words, very excited, warm like talking to a young child, lots of emojis 🎉⭐, short sentences, one concept at a time",

  "grades35_tone": "Friendly teacher building confidence, clear rich vocabulary, regular emojis 🎯💡, multi-step thinking, encouraging",

  "grades68_tone": "Respectful peer not talking down, mature assumes knowledge, selective emojis 💪✓, multi-layered concepts, motivating",

  "grades912_tone": "Professional college prep, advanced academic language, minimal emojis ✓📊, full concepts critical thinking, Duolingo-style"
}
```

**Then use:**
```
"Generate content with {age_group}_tone"
```

**Instead of:** Explaining the entire tone definition every time!

---

### 3. SUBJECT-SPECIFIC INSTRUCTION PATTERNS

**Math Analogy Pattern:**
```
Create a visual, hands-on analogy using real objects kids can touch/see.
Examples: pizza slices, toy groups, candy sharing, money, building blocks.
Focus on: quantities, operations, visual representation.
```

**Reading Analogy Pattern:**
```
Create story-based, imaginative analogies using movies, books, adventures.
Examples: story is like a movie, characters are like actors, plot is like a journey.
Focus on: visualization, imagination, narrative.
```

**Coding Analogy Pattern:**
```
Create logic-based, step-by-step analogies using recipes, instructions, games.
Examples: code like recipes, variables like boxes, loops like repetition.
Focus on: sequential thinking, cause-effect, problem-solving.
```

**Reuse these patterns instead of recreating them!**

---

### 4. COMMON VERBIAGE TEMPLATES

**Encouragement Phrases by Age:**
```json
{
  "k2_encouragement": [
    "You're so smart!",
    "Great job, friend!",
    "You can do it!",
    "Let's try together!"
  ],
  "grades35_encouragement": [
    "Great thinking!",
    "Your hard work shows!",
    "You're getting good at this!",
    "Excellent reasoning!"
  ],
  "grades68_encouragement": [
    "Solid work!",
    "Your understanding is strong!",
    "Nice analysis!",
    "You're demonstrating mastery!"
  ],
  "grades912_encouragement": [
    "Well reasoned!",
    "Your preparation shows!",
    "Excellent critical thinking!",
    "Solid foundational skills!"
  ]
}
```

---

### 5. JSON STRUCTURE TEMPLATES

**Standard Response Format:**
```json
{
  "content": "The actual content",
  "metadata": {
    "age_group": "k2",
    "subject": "Math",
    "type": "explanation"
  },
  "created_at": "timestamp"
}
```

**Seed this once, reference everywhere!**

---

### 6. QUALITY CONTROL CHECKLISTS

**Explanation Quality Check:**
```
✓ Age-appropriate vocabulary
✓ Clear, concise
✓ Includes example
✓ Correct tone
✓ Proper length
✓ Actionable
```

**Seed the checklist, apply to every generation!**

---

## 🗄️ PROMPT LIBRARY DATABASE

### Table Structure:

```sql
CREATE TABLE prompt_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'instruction', 'tone', 'verbiage', 'format'
  prompt_template TEXT NOT NULL,
  variables JSONB, -- {skill_name}, {age_group}, etc.
  usage_count INT DEFAULT 0,
  success_rate FLOAT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);

-- Index for fast lookups
CREATE INDEX idx_prompt_name ON prompt_library(prompt_name);
CREATE INDEX idx_category ON prompt_library(category);
```

---

## 💡 HOW TO USE IT

### Example Flow:

**Task:** Generate math analogy for fractions, 3rd grade

**OLD WAY (Every Time):**
```javascript
const prompt = `
Create a relatable analogy for fractions that 3rd graders can understand.
Use something they see every day like pizza or candy.
Make it visual and easy to remember.
Explain how it connects to the concept.
Use simple 3rd grade vocabulary.
Be encouraging and friendly.
Keep it under 100 words.
Include an example.
Return as JSON with fields: analogy, explanation, example.
` // 10 lines of repeated instructions!
```

**NEW WAY (From Library):**
```javascript
const promptTemplate = await getPrompt('math_analogy_generator')
const prompt = fillTemplate(promptTemplate, {
  skill: 'fractions',
  age_group: 'grades35'
}) // 2 lines, reuses proven template!
```

---

## 🎯 WHAT TO SEED

### High-Priority Prompts:

1. **Content Generation Templates** (50 prompts)
   - Explanation generator
   - Analogy creator
   - Help response formatter
   - Question generator
   - Mistake pattern identifier

2. **Tone Definitions** (4 age groups)
   - K-2 communication style
   - 3-5 communication style
   - 6-8 communication style
   - 9-12 communication style

3. **Subject Patterns** (5 subjects)
   - Math instruction style
   - Reading instruction style
   - Spelling instruction style
   - Coding instruction style
   - Typing instruction style

4. **Standard Verbiage** (200 phrases)
   - Encouragement by age
   - Transitions by age
   - Celebrations by age
   - Error messages by age

5. **JSON Structures** (20 formats)
   - Standard response
   - Analogy response
   - Explanation response
   - Multi-level response
   - Mistake pattern response

6. **Quality Checklists** (10 checklists)
   - Explanation quality
   - Age-appropriateness
   - Tone correctness
   - Format compliance
   - Content accuracy

**Total: ~290 reusable prompts/templates**

---

## 💰 THE SAVINGS

### Before Prompt Library:
- Craft each prompt manually: 2-5 minutes
- Inconsistent quality
- Forget requirements
- Reinvent wheel every time

### After Prompt Library:
- Pull proven template: 5 seconds
- Consistent quality
- All requirements included
- Reuse best practices

**Time saved per generation:** 2-5 minutes
**Consistency improved:** 10x
**Quality:** Guaranteed

---

## 🔄 THE WORKFLOW

### 1. Identify Common Prompts
```
What instructions do I give Grok repeatedly?
- Generate explanation
- Create analogy
- Write encouragement
- Format response
```

### 2. Create Template Once
```
Write the BEST version of that prompt
Include all requirements
Define all variables
Test it thoroughly
```

### 3. Save to Library
```
Store in prompt_library table
Name it clearly
Tag with category
Document variables
```

### 4. Reuse Forever
```
Next time needed:
  ↓
Pull from library
Fill in variables
Use immediately
Track usage
```

---

## 📊 EXAMPLE PROMPTS TO SEED

### Prompt: "math_analogy_k2"
```
Create a super simple, fun analogy for {skill_name} that kindergarteners can understand!

Use something they LOVE:
- Toys (blocks, dolls, cars)
- Snacks (cookies, candy, pizza)
- Games (tag, hide and seek)
- Animals (puppies, kittens)

Make it:
- ONE simple sentence
- Uses words like "like" or "just like"
- Very visual (they can picture it)
- FUN! 🎉

Example for counting:
"Counting is like collecting Pokemon - you get one, then another, then another!"

Age Group: K-2 (Ages 5-8)
Tone: Super excited, warm, simple
Words: Use "big", "small", "lots", "few", "share"
Emojis: YES! 🎉⭐🌟

Return JSON:
{
  "analogy": "Your one-sentence analogy here",
  "explanation": "Why this helps (2 sentences, simple)",
  "example": "Show it: If you have 3 cookies..."
}
```

### Prompt: "encouragement_wrong_answer_grades68"
```
A 6th-8th grader got a wrong answer. Generate an encouraging response that:

Tone: Mature, respectful (not baby talk!)
Style: Coach/mentor, not teacher
Length: 15-25 words
Emojis: 1 max (use sparingly)

Include:
- Quick acknowledgment (don't dwell on wrong)
- Reframe as learning opportunity
- Action step (what to try)
- Confidence booster

Examples:
✓ "Not quite - let's review the approach and try again! 🔍"
✓ "That's a common mistake - here's the key concept to remember!"
✓ "Close! Rethink the first step and you'll nail it! 💪"

Avoid:
✗ "Oops! That's okay sweetie!" (too young)
✗ "Wrong. Try again." (too harsh)
✗ "You can do it champ!" (patronizing)

Return JSON:
{
  "response": "Your encouragement here",
  "tone_check": "mature/respectful"
}
```

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Identify & Extract (1 day)
- Review all existing Grok prompts
- Identify repeated patterns
- Extract common verbiage
- List variables

### Phase 2: Create Templates (1 day)
- Write 50 core templates
- Define 4 tone profiles
- Create 5 subject patterns
- Format 20 JSON structures

### Phase 3: Build Library (2 hours)
- Create prompt_library table
- Seed initial 290 items
- Test retrieval
- Document usage

### Phase 4: Integrate (ongoing)
- Use library in all scripts
- Track usage
- Refine based on results
- Add new patterns as discovered

---

## 💡 THE BENEFITS

1. **Speed:** Instant access to proven prompts
2. **Consistency:** Same quality every time
3. **Efficiency:** No reinventing the wheel
4. **Learning:** Track what works best
5. **Scalability:** Easy to add new patterns
6. **Maintenance:** Update once, applies everywhere

---

## 🎯 THE BOTTOM LINE

**Your Insight:** "Shouldn't we be seeding that too?"

**The Answer:** YES! Absolutely!

**What to Seed:**
- ✅ Common prompts
- ✅ Standard verbiage
- ✅ Tone definitions
- ✅ Subject patterns
- ✅ JSON structures
- ✅ Quality checklists

**The Result:**
- Faster generation
- Consistent quality
- Less redundant work
- Better scalability
- Proven patterns

**This is brilliant - it's like CodeLibrary but for COMMUNICATION!**

---

*PROMPT LIBRARY STRATEGY*
*Seed the verbiage, reuse forever!*
*Making AI communication efficient!*
