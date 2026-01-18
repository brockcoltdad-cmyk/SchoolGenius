# SchoolGenius AI Cost-Saving Resource Library

## THE PROBLEM
Every AI call costs money. With 100,000 kids asking questions, costs explode.

## THE SOLUTION
Pre-load databases and logic so AI only gets called as a LAST RESORT.

---

# PART 1: EVERYTHING THAT SAVES MONEY

## 1. DICTIONARY DATABASE
**What:** Full English dictionary with definitions, examples, parts of speech
**Why it saves money:** Kid asks "What does 'enormous' mean?" → Database lookup, zero AI cost
**Source:** WordNet (free), Wiktionary (free)
**Estimated savings:** 90% of vocabulary questions = FREE

## 2. GRADE-LEVEL WORD LISTS
**What:** Words filtered by grade level (K, 1st, 2nd, etc.)
**Why it saves money:** AI knows which words to use without thinking - just pulls from grade-appropriate list
**Source:** Dolch, Fry, Academic Word List (all free public domain)
**Estimated savings:** AI doesn't waste tokens deciding word difficulty

## 3. MATH COMPUTATION ENGINE
**What:** Code that solves math problems
**Why it saves money:** "What's 847 × 36?" → Code computes `847 * 36 = 30492` → FREE
**Source:** Built into any programming language
**Estimated savings:** 100% of math answer-checking = FREE

## 4. SPELLING WORD DATABASE
**What:** Correct spelling of every word
**Why it saves money:** "How do you spell 'necessary'?" → Lookup → n-e-c-e-s-s-a-r-y
**Source:** Any dictionary file
**Estimated savings:** 95% of spelling lookups = FREE

## 5. GRAMMAR RULES DATABASE
**What:** Every grammar rule with examples
**Why it saves money:** Pre-seeded once, reused forever
**Source:** Seed ~200 rules one time (~$10)
**Estimated savings:** 90% of grammar questions = FREE after seeding

## 6. PHONICS PATTERNS DATABASE
**What:** Every sound-letter pattern (sh, ch, th, silent e, etc.)
**Why it saves money:** Finite set (~100 patterns), seed once, done forever
**Source:** Seed one time (~$3)
**Estimated savings:** 100% of phonics = FREE after seeding

## 7. READING PASSAGES DATABASE
**What:** Pre-loaded stories and articles with pre-made questions
**Why it saves money:** AI doesn't generate passages on the fly
**Source:** Project Gutenberg (free), CommonLit (free), create your own
**Estimated savings:** 100% of passage generation = FREE

## 8. MATH FORMULA DATABASE
**What:** Every formula K-12 (area, perimeter, volume, slope, etc.)
**Why it saves money:** Lookup instead of AI explaining
**Source:** Seed ~150 formulas one time (~$5)
**Estimated savings:** Formula lookups = FREE

## 9. SCIENCE FACTS DATABASE
**What:** Facts about elements, planets, animals, body systems, etc.
**Source:** Wikipedia API (free), OpenStax (free)
**Estimated savings:** Fact questions = FREE

## 10. SYNONYM/ANTONYM DATABASE
**What:** Related words for any word
**Why it saves money:** "What's another word for 'big'?" → Lookup → large, huge, enormous
**Source:** WordNet includes this FREE
**Estimated savings:** Word relationship questions = FREE

## 11. SIGHT WORD LISTS
**What:** High-frequency words kids must memorize
**Source:** Dolch (315 words), Fry (1000 words) - both FREE public domain
**Estimated savings:** All sight word practice = FREE

## 12. SENTENCE TEMPLATES
**What:** Pre-made sentence structures by grade
**Why it saves money:** AI fills in blanks instead of creating from scratch
**Source:** Seed ~500 templates one time (~$15)
**Estimated savings:** Sentence generation = cheaper

## 13. COMMON ERROR DATABASE
**What:** Most frequent mistakes kids make + corrections
**Why it saves money:** "Your vs You're" confusion → lookup pre-made explanation
**Source:** Seed ~200 common errors (~$8)
**Estimated savings:** Error explanations = FREE after seeding

## 14. CODE EXECUTION ENGINE
**What:** Runs student code and checks if it works
**Why it saves money:** Don't need AI to run code - computer does it
**Source:** Pyodide (Python in browser), Judge0 (free tier)
**Estimated savings:** 100% of code checking = FREE

## 15. TYPING TEST ENGINE
**What:** Calculates WPM, accuracy, errors
**Why it saves money:** Pure math - words typed / time = WPM
**Source:** JavaScript code
**Estimated savings:** 100% of typing = FREE (zero AI ever)

---

# PART 2: THE GRADE-LEVEL WORD PROBLEM

## THE QUESTION
"If AI has 170,000 words in the dictionary, how does it know to pick 'big' for a 1st grader instead of 'gargantuan'?"

## THE ANSWER
**Grade-locked vocabulary lists.** The AI doesn't pick from ALL words - it picks from THAT GRADE'S word list.

---

## GRADE-LEVEL WORD LISTS STRUCTURE

```json
{
  "grade_K": {
    "words": ["a", "and", "the", "is", "it", "to", "big", "run", "cat", "dog", ...],
    "count": 300,
    "source": "Dolch Pre-Primer + Primer"
  },
  "grade_1": {
    "words": ["about", "after", "again", "because", "before", "could", ...],
    "count": 500,
    "source": "Dolch Grade 1 + Fry 1-200"
  },
  "grade_2": {
    "words": ["already", "between", "change", "different", "important", ...],
    "count": 700,
    "source": "Fry 200-500 + Academic Tier 1"
  },
  "grade_3": {
    "words": ["adventure", "character", "compare", "describe", "example", ...],
    "count": 900,
    "source": "Fry 500-800 + Academic Tier 2"
  },
  "grade_4": {
    "words": ["accomplish", "analyze", "calculate", "demonstrate", ...],
    "count": 1100,
    "source": "Academic Word List Level 4"
  },
  "grade_5": {
    "words": ["abbreviation", "consequence", "hypothesis", "interpret", ...],
    "count": 1300,
    "source": "Academic Word List Level 5"
  },
  "grade_6": {
    "words": ["accumulate", "circumstances", "deliberately", "elaborate", ...],
    "count": 1500,
    "source": "Academic Word List Level 6"
  },
  "grade_7": {
    "words": ["acknowledge", "comprehensive", "differentiate", "equivalent", ...],
    "count": 1700,
    "source": "Academic Word List Level 7"
  }
}
```

---

## HOW AI USES THE WORD LISTS

### Rule 1: AI Only Uses Words AT OR BELOW Student's Grade

```
Student Grade: 3rd
Available Words: grade_K + grade_1 + grade_2 + grade_3
Forbidden: grade_4, grade_5, grade_6, grade_7 words
```

### Rule 2: When Building Sentences, Pull From Word List

**Bad (no word list):**
AI prompt: "Create a sentence about a dog"
AI output: "The canine exhibited exuberant behavior" ← Too hard for 1st grader!

**Good (with word list):**
AI prompt: "Create a sentence about a dog using only grade_1 words"
AI output: "The dog is big and can run fast" ← Perfect!

---

# PART 3: IMPLEMENTATION PROMPTS

## PROMPT FOR GROK: How to Use the Dictionary

```
DICTIONARY USAGE RULES

You have access to a dictionary database with 170,000+ words.

WHEN TO USE IT:
- Student asks "What does [word] mean?" → Lookup definition, return it. DO NOT generate a definition.
- Student asks "How do you spell [word]?" → Lookup spelling, return it. DO NOT guess.
- Student asks "Use [word] in a sentence" → Lookup example sentence from dictionary first. Only generate if none exists.

HOW TO USE IT:
1. Receive student question
2. Extract the word they're asking about
3. Query: dictionary.lookup(word)
4. Return the result

RESPONSE FORMAT:
{
  "source": "dictionary_lookup",
  "word": "enormous",
  "definition": "very great in size or amount",
  "part_of_speech": "adjective",
  "example": "The elephant was enormous.",
  "ai_generated": false
}

COST IMPACT: Dictionary lookups = FREE. Only call AI if dictionary doesn't have what's needed.
```

---

## PROMPT FOR GROK: How to Use Grade-Level Words

```
GRADE-LEVEL VOCABULARY RULES

You have access to word lists filtered by grade level.

CORE RULE: Never use a word above the student's grade level.

BEFORE GENERATING ANY TEXT:
1. Check student's grade
2. Load allowed word lists: grade_K through grade_[student's grade]
3. Generate text using ONLY words from those lists
4. If you need a harder word, substitute with an easier synonym

EXAMPLE:
Student: 2nd grade
Task: Explain why the sky is blue

BAD OUTPUT: "Light refracts through atmospheric particles, creating a phenomenon..."
WHY BAD: "refracts", "atmospheric", "phenomenon" are NOT in grade_K, grade_1, or grade_2 lists

GOOD OUTPUT: "The sky looks blue because of how sunlight moves through the air. The blue part of light bounces around more than other colors."
WHY GOOD: All words are grade-appropriate

WORD SUBSTITUTION GUIDE:
- "phenomenon" → "thing that happens"
- "atmospheric" → "in the air"
- "refracts" → "bends" or "bounces"
- "precipitation" → "rain or snow"
- "calculate" → "figure out" (for K-2) or keep "calculate" (for 3+)
- "approximately" → "about"
- "demonstrate" → "show"

IMPLEMENTATION:
function checkWordLevel(word, studentGrade) {
  for (grade = 0; grade <= studentGrade; grade++) {
    if (wordLists[grade].includes(word)) {
      return true; // Word is allowed
    }
  }
  return false; // Word too advanced - find substitute
}
```

---

## PROMPT FOR GROK: How to Use Math Computation

```
MATH COMPUTATION RULES

You have access to a math engine that computes answers.

NEVER COMPUTE MATH YOURSELF. Always use the math engine.

FOR BASIC OPERATIONS:
- Addition: mathEngine.add(a, b)
- Subtraction: mathEngine.subtract(a, b)  
- Multiplication: mathEngine.multiply(a, b)
- Division: mathEngine.divide(a, b)

FOR ADVANCED OPERATIONS:
- Fractions: mathEngine.fraction(num, denom)
- Decimals: mathEngine.decimal(value)
- Percentages: mathEngine.percent(value, of)
- Algebra: mathEngine.solve("2x + 5 = 15")
- Square root: mathEngine.sqrt(value)

ANSWER CHECKING:
When student submits an answer:
1. Compute correct answer using mathEngine
2. Compare to student's answer
3. Return correct/incorrect

RESPONSE FORMAT:
{
  "question": "What is 847 × 36?",
  "correct_answer": 30492,
  "source": "math_engine",
  "student_answer": 30492,
  "is_correct": true,
  "ai_generated": false
}

WHEN TO CALL AI:
Only when student says "I don't understand" or "Explain how to do this"
Then pull from pre-seeded teaching lessons first.
AI is LAST RESORT.
```

---

## PROMPT FOR GROK: How to Use Reading Passages

```
READING PASSAGE RULES

You have access to a database of pre-loaded reading passages with questions.

PASSAGE DATABASE STRUCTURE:
{
  "passage_id": "READ-G3-FIC-042",
  "title": "The Lost Puppy",
  "grade_level": 3,
  "lexile": 520,
  "genre": "fiction",
  "text": "Sarah found a small brown puppy...",
  "questions": [
    {
      "id": "Q1",
      "type": "main_idea",
      "question": "What is the main idea of this story?",
      "answer": "A girl finds and helps a lost puppy.",
      "tier1_explanation": "...",
      "tier2_explanation": "..."
    },
    {
      "id": "Q2", 
      "type": "detail",
      "question": "What color was the puppy?",
      "answer": "brown",
      "tier1_explanation": "...",
      "tier2_explanation": "..."
    }
  ]
}

USAGE RULES:
1. When student needs reading practice → Pull passage at their grade level
2. Questions are PRE-MADE → Don't generate new ones
3. Answers are PRE-MADE → Don't generate new ones
4. Explanations are PRE-MADE → Don't generate new ones

NEVER GENERATE:
- New passages (use database)
- New questions (use pre-made)
- New answers (use pre-made)

WHEN AI IS ALLOWED:
Only if student asks something NOT in the pre-made questions
Then generate a response and SAVE IT to the database for future use
```

---

## PROMPT FOR GROK: How to Use Grammar Rules

```
GRAMMAR RULES DATABASE

You have access to a database of all grammar rules with explanations.

DATABASE STRUCTURE:
{
  "rule_id": "GRAM-PUNCT-014",
  "rule_name": "Question Mark Usage",
  "grade_introduced": 1,
  "rule_text": "Use a question mark at the end of a sentence that asks something.",
  "examples_correct": [
    "Where is the dog?",
    "What time is it?",
    "Can I go outside?"
  ],
  "examples_incorrect": [
    "Where is the dog.",
    "What time is it",
    "Can I go outside!"
  ],
  "tier1_explanation": "Questions need question marks. If the sentence asks something, end with ?",
  "tier2_explanation": "Is someone asking a question? If yes, put this → ? If no, put this → .",
  "common_mistakes": ["Forgetting ? on questions", "Using ? on statements"]
}

USAGE RULES:
1. Student makes grammar error → Identify which rule was broken
2. Look up rule in database
3. Return pre-made explanation

DO NOT generate grammar explanations from scratch.
DO use the pre-seeded explanations.

ONLY call AI if:
- Student says "I still don't get it" after tier2
- Rule somehow isn't in database (rare)
```

---

## PROMPT FOR GROK: How to Use Phonics Patterns

```
PHONICS PATTERN DATABASE

You have access to all phonics patterns used in English.

DATABASE STRUCTURE:
{
  "pattern_id": "PHON-DIG-003",
  "pattern": "sh",
  "type": "consonant_digraph",
  "sound": "/ʃ/",
  "grade_introduced": 1,
  "position": ["beginning", "middle", "end"],
  "example_words": ["ship", "fish", "wash", "shell", "push"],
  "teaching_tip": "Two letters make one sound. S and H together say 'shh' like you're telling someone to be quiet.",
  "mouth_position": "Lips pushed out slightly, teeth close together, blow air through",
  "common_words_by_grade": {
    "K": ["she"],
    "1": ["ship", "fish", "wish", "shop"],
    "2": ["shadow", "shower", "finish", "splash"]
  }
}

USAGE:
1. Student learning phonics → Pull patterns for their grade
2. Student asks about a sound → Look up pattern
3. Return pre-made teaching, NOT AI-generated

PATTERNS TO INCLUDE:
- Short vowels (a, e, i, o, u)
- Long vowels (a-e, ee, ea, ie, etc.)
- Consonant blends (bl, cr, st, tr, etc.)
- Consonant digraphs (sh, ch, th, wh, ph, etc.)
- R-controlled vowels (ar, er, ir, or, ur)
- Vowel teams (ai, ay, ea, ee, oa, ow, etc.)
- Silent letters (kn, wr, mb, etc.)
```

---

## PROMPT FOR GROK: How to Check Answers

```
ANSWER CHECKING FLOW

ALWAYS check answers WITHOUT calling AI.

MATH ANSWERS:
1. Compute correct answer with math engine
2. Compare to student answer
3. Return correct/incorrect
4. If incorrect, show pre-seeded explanation

SPELLING ANSWERS:
1. Look up correct spelling in dictionary
2. Compare to student answer (case insensitive)
3. Return correct/incorrect
4. If incorrect, show correct spelling + pre-seeded rule

MULTIPLE CHOICE:
1. Look up correct answer in question database
2. Compare to student selection
3. Return correct/incorrect
4. If incorrect, show pre-seeded explanation

FILL IN THE BLANK:
1. Look up acceptable answers (may be multiple)
2. Compare to student answer
3. Return correct/incorrect

CODING ANSWERS:
1. Run student code through execution engine
2. Compare output to expected output
3. Return correct/incorrect
4. If incorrect, show error message from compiler + pre-seeded fix suggestion

AI IS CALLED ONLY WHEN:
- Student clicks "I don't understand"
- Student asks a question not covered by pre-seeded content
- Student needs personalized help after tier 1 and tier 2 fail
```

---

## PROMPT FOR GROK: The Master Decision Tree

```
MASTER RESPONSE FLOW

When student asks ANYTHING, follow this order:

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: CAN A DATABASE ANSWER THIS?                         │
├─────────────────────────────────────────────────────────────┤
│ - Dictionary lookup? → Use dictionary                       │
│ - Math calculation? → Use math engine                       │
│ - Grammar question? → Use grammar database                  │
│ - Spelling question? → Use spelling database                │
│ - Phonics question? → Use phonics database                  │
│ - Science fact? → Use science database                      │
│                                                             │
│ If YES → Return database result. STOP. No AI cost.          │
│ If NO → Continue to Step 2                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: IS THERE A PRE-SEEDED LESSON?                       │
├─────────────────────────────────────────────────────────────┤
│ - Search lesson database for matching skill                 │
│ - Search lesson database for matching question              │
│ - Search lesson database for similar question               │
│                                                             │
│ If YES → Return pre-seeded lesson. STOP. No AI cost.        │
│ If NO → Continue to Step 3                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: CAN WE CONSTRUCT FROM TEMPLATES?                    │
├─────────────────────────────────────────────────────────────┤
│ - Use sentence template + word list to build response       │
│ - Use formula template + numbers to build explanation       │
│                                                             │
│ If YES → Return constructed response. STOP. Minimal AI.     │
│ If NO → Continue to Step 4                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: CALL AI (Last Resort)                               │
├─────────────────────────────────────────────────────────────┤
│ - Use smallest model that can handle request (Haiku first)  │
│ - Keep response short                                       │
│ - Use grade-level word list                                 │
│ - SAVE response to database for future reuse                │
│                                                             │
│ This costs money. Only reach here if absolutely necessary.  │
└─────────────────────────────────────────────────────────────┘

LOGGING:
Every response should log:
{
  "question": "...",
  "response_source": "dictionary|math_engine|pre_seeded|template|ai_generated",
  "ai_cost": 0.00 or actual cost,
  "grade_level": 3,
  "timestamp": "..."
}

This lets you track how much AI is being used and optimize further.
```

---

# PART 4: DATABASE SCHEMAS

## Dictionary Database Schema

```sql
CREATE TABLE dictionary (
  word_id INT PRIMARY KEY,
  word VARCHAR(100),
  definition TEXT,
  part_of_speech VARCHAR(50),
  example_sentence TEXT,
  pronunciation VARCHAR(100),
  syllables VARCHAR(100),
  grade_level INT,
  synonyms TEXT,
  antonyms TEXT,
  root_word VARCHAR(100),
  prefix VARCHAR(50),
  suffix VARCHAR(50)
);
```

## Grade Word List Schema

```sql
CREATE TABLE grade_words (
  word_id INT PRIMARY KEY,
  word VARCHAR(100),
  grade_level INT,
  frequency_rank INT,
  source VARCHAR(100), -- "Dolch", "Fry", "Academic"
  is_sight_word BOOLEAN
);

-- Index for fast grade filtering
CREATE INDEX idx_grade ON grade_words(grade_level);
```

## Lesson Database Schema

```sql
CREATE TABLE lessons (
  lesson_id VARCHAR(50) PRIMARY KEY,
  subject VARCHAR(50),
  grade INT,
  skill VARCHAR(200),
  question TEXT,
  answer TEXT,
  tier1_teach TEXT,
  tier1_visual JSON,
  tier2_teach TEXT,
  tier2_visual JSON,
  times_accessed INT DEFAULT 0
);
```

## Grammar Rules Schema

```sql
CREATE TABLE grammar_rules (
  rule_id VARCHAR(50) PRIMARY KEY,
  rule_name VARCHAR(200),
  grade_introduced INT,
  rule_text TEXT,
  examples_correct JSON,
  examples_incorrect JSON,
  tier1_explanation TEXT,
  tier2_explanation TEXT
);
```

## Reading Passages Schema

```sql
CREATE TABLE passages (
  passage_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200),
  grade_level INT,
  lexile INT,
  genre VARCHAR(50),
  text TEXT,
  questions JSON,
  word_count INT
);
```

---

# PART 5: COST COMPARISON

## WITHOUT This System (All AI)

| Interaction | AI Calls | Cost per Call | 100K Students |
|-------------|----------|---------------|---------------|
| Vocabulary lookup | 50/day/student | $0.002 | $10,000/day |
| Math problems | 30/day/student | $0.002 | $6,000/day |
| Spelling help | 20/day/student | $0.002 | $4,000/day |
| Grammar help | 10/day/student | $0.002 | $2,000/day |
| **DAILY TOTAL** | | | **$22,000/day** |
| **YEARLY TOTAL** | | | **$8 MILLION/year** |

## WITH This System (Database First)

| Interaction | AI Calls | Database Calls | Cost |
|-------------|----------|----------------|------|
| Vocabulary lookup | 5% | 95% | $500/day |
| Math problems | 2% | 98% | $120/day |
| Spelling help | 5% | 95% | $200/day |
| Grammar help | 10% | 90% | $200/day |
| **DAILY TOTAL** | | | **$1,020/day** |
| **YEARLY TOTAL** | | | **$372,000/year** |

## SAVINGS
- **One-time seeding cost:** ~$500-1,000
- **Annual savings:** ~$7.6 MILLION
- **ROI:** 7,600x return on seeding investment

---

# PART 6: QUICK START CHECKLIST

## FREE Downloads (Do Today)
- [ ] WordNet dictionary database
- [ ] Dolch sight words (315 words)
- [ ] Fry 1000 words
- [ ] CMU Pronouncing Dictionary
- [ ] Project Gutenberg passages

## One-Time Seeding (~$500)
- [ ] 200,000 lessons across K-7 subjects
- [ ] 200 grammar rules with explanations
- [ ] 100 phonics patterns with examples
- [ ] 150 math formulas with visuals
- [ ] 200 common errors with corrections

## Code to Build
- [ ] Dictionary lookup API
- [ ] Math computation engine
- [ ] Grade-level word filter
- [ ] Answer checking system
- [ ] Response routing (database vs AI)

## Prompts to Configure
- [ ] Master decision tree prompt
- [ ] Grade-level vocabulary prompt
- [ ] Dictionary usage prompt
- [ ] Math computation prompt
- [ ] Answer checking prompt

---

# SUMMARY

**The goal:** Make AI the LAST resort, not the first.

**The method:** Databases, computation, pre-seeding.

**The result:** 95%+ of interactions cost NOTHING.

**The savings:** Millions of dollars per year at scale.

Hand this document to Grok along with the seeding prompt. The AI will know how to use every resource efficiently.
