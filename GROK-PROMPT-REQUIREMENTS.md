# GROK PROMPT REQUIREMENTS
## Content Generation Must Follow Master Rules Checklist

**Created:** 2026-01-13
**Problem:** Current Grok prompts generate generic multiple-choice content that doesn't meet our specifications
**Solution:** Subject-specific prompts + specialized lesson players

---

## AUDIT: Current Grok Content vs Checklist

### ❌ FAILURES IDENTIFIED:

| Requirement | Current State | Required State |
|------------|---------------|----------------|
| **Arizona Standards** | Not mentioned | Must specify Arizona curriculum standards |
| **Lexile Levels** | Not used | Reading must use 13 Lexile bands (BR → 1500L) |
| **Subject-Specific UI** | All subjects = generic quiz | Each subject needs unique interface |
| **Typing Interface** | Multiple choice | Interactive keyboard, actual typing |
| **Spelling Interface** | Multiple choice | Audio pronunciation + type word 3 times |
| **Coding Interface** | Multiple choice | Actual code editor + run code |
| **Math Visuals** | Not embedded | Visual data for counting objects, number lines, etc. |
| **Theme Feedback** | Generic | Uses kid's theme (Fortnite, Minecraft, etc.) |
| **Practice Problems** | 9 problems | 5 guided + 10-15 independent = 15-20 total |
| **Skip Rules Option** | Not available | For repeat lessons |

---

## SOLUTION: Subject-Specific Generators

### The Fix: Different content structure for each subject

Instead of one generic prompt, we need:

---

## 1. MATH CONTENT GENERATOR

```
You are an Arizona curriculum expert creating VISUAL math content.

CRITICAL REQUIREMENTS:
- Arizona State Standards (NOT Common Core)
- Visual manipulatives for every problem
- Grade K-2: Counting objects with emojis (🍎🍎🍎 + 🍎🍎 = 5)
- Grade K-2: Number line hopping for addition/subtraction
- Grade 3-5: Arrays for multiplication, fraction pies
- Grade 6-8: Balance scales for equations

OUTPUT FORMAT:
{
  "problems": [
    {
      "question": "2 + 3 = ?",
      "answer": 5,
      "options": [4, 5, 6, 7],
      "visual_type": "counting_objects",
      "visual_data": {
        "emoji": "🍎",
        "groups": [2, 3],
        "operation": "add"
      },
      "explanation": "Put 2 apples with 3 apples, count all: 1, 2, 3, 4, 5!"
    }
  ]
}
```

---

## 2. SPELLING CONTENT GENERATOR

```
You are an Arizona curriculum expert creating phonics-based SPELLING content.

CRITICAL REQUIREMENTS:
- Arizona phonics standards
- Words organized by phonics rule (CVC, Magic E, Digraphs, etc.)
- Audio pronunciation is mandatory (will use TTS)
- Type word 3 times correctly to master
- NOT multiple choice

OUTPUT FORMAT:
{
  "rule": "Magic E (Long A)",
  "rule_explanation": "The silent E makes the A say its name...",
  "words": ["make", "take", "bake", "lake", "cake", "wake"],
  "phonics_breakdown": {
    "make": [
      {"letters": "m", "sound": "muh", "type": "consonant"},
      {"letters": "a", "sound": "ay", "type": "vowel"},
      {"letters": "ke", "sound": "k", "type": "consonant"}
    ]
  }
}
```

---

## 3. READING CONTENT GENERATOR

```
You are an Arizona curriculum expert creating Lexile-leveled READING content.

CRITICAL REQUIREMENTS:
- Lexile level MUST be specified
- 13 bands: BR, 200L, 300L, 400L, 500L, 600L, 700L, 800L, 900L, 1000L, 1100L, 1200L, 1500L
- 10 comprehension questions per story
- Passing score: 70% (7/10)

LEXILE BANDS BY GRADE:
| Grade | Lexile Range |
|-------|-------------|
| K | BR-200L |
| 1 | 200L-400L |
| 2 | 300L-500L |
| 3 | 400L-700L |
| 4 | 500L-800L |
| 5 | 600L-900L |
| 6+ | 700L-1500L |

OUTPUT FORMAT:
{
  "lexile_level": "400L",
  "grade_range": "2-3",
  "story_title": "The Lost Puppy",
  "story_text": "...",
  "word_count": 250,
  "comprehension_questions": [
    {
      "question": "What did Max find in the park?",
      "choices": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "correct": "B",
      "explanation": "..."
    }
  ],
  "vocabulary": ["adopted", "shelter", "excited"]
}
```

---

## 4. TYPING CONTENT GENERATOR

**NOTE: Typing doesn't need Grok - use TypingLessonPlayer with built-in content**

The TypingLessonPlayer.tsx already has:
- 7 phases (Home Row → Professional)
- Practice texts for each phase
- WPM and accuracy tracking
- Interactive keyboard visual

---

## 5. CODING CONTENT GENERATOR

```
You are creating INTERACTIVE coding lessons for kids.

CRITICAL REQUIREMENTS:
- Actual code that can be RUN
- Grade K-2: Block-based (Scratch style)
- Grade 3-5: Mix of blocks and simple Python
- Grade 6+: Real Python/JavaScript
- NOT multiple choice

OUTPUT FORMAT:
{
  "concept": "Variables",
  "explanation": "A variable is like a box that holds a value...",
  "starter_code": "name = ___",
  "solution": "name = 'Alex'",
  "expected_output": "Hello Alex!",
  "hints": [
    "Put your name in quotes",
    "Variables store values like text or numbers"
  ]
}
```

---

## IMPLEMENTATION PLAN

### Phase 1: Use Specialized Lesson Players (DONE ✅)
- TypingLessonPlayer - Built-in content, keyboard interface
- SpellingLessonPlayer - Audio + text input, 3x typing
- MathLessonPlayer - Visual manipulatives embedded

### Phase 2: Update Grok Edge Functions
1. Create `generate-math-content-v3` with visual data
2. Create `generate-spelling-content` with phonics
3. Create `generate-reading-content` with Lexile
4. Create `generate-coding-content` with runnable code

### Phase 3: Update Lesson Content Table
Add columns:
- `visual_data JSONB` - For math visuals
- `lexile_level VARCHAR` - For reading
- `phonics_rules JSONB` - For spelling
- `runnable_code BOOLEAN` - For coding

### Phase 4: Theme Integration
- Fetch kid's theme before generating feedback
- Use `getSmartThemeMessage()` for all encouragement

---

## COST CONSIDERATIONS

**Current Problem:** Generic content costs money but doesn't meet specs
**Solution:** Generate subject-specific content ONCE, cache FOREVER

**Estimated Costs for Regeneration:**
| Subject | Skills | Content Per Skill | Total Content | Est. Cost |
|---------|--------|-------------------|---------------|-----------|
| Math K-5 | ~200 | 20 problems | 4,000 | ~$8 |
| Spelling K-8 | ~100 | 6 words × 5 rules | 3,000 | ~$6 |
| Reading K-12 | ~150 | 1 story + 10 Q | 1,650 | ~$3 |
| Coding 3-12 | ~100 | 5 challenges | 500 | ~$1 |
| **TOTAL** | | | ~9,000 items | ~$18 |

**This is a ONE-TIME cost.** After generation, all content is FREE from cache.

---

## CHECKLIST BEFORE GENERATING ANY CONTENT

- [ ] Arizona Standards specified in prompt
- [ ] Lexile level specified for reading
- [ ] Visual data included for math
- [ ] Audio script for spelling
- [ ] Runnable code for coding
- [ ] Theme placeholder for feedback
- [ ] Proper problem count (15-20 per lesson)
- [ ] Multi-level explanations (6 levels)
- [ ] Mistake pattern feedback

---

**Next Steps:**
1. Test specialized lesson players (Typing, Spelling, Math)
2. Create subject-specific Grok prompts
3. Regenerate content that meets specs
4. Verify against Master Rules Checklist

---

*This document ensures all future content generation meets our requirements.*
*Check against MASTER-RULES-CHECKLIST.md before generating.*
