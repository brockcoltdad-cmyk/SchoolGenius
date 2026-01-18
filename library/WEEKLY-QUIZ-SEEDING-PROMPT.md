# Weekly Quiz Seeding Prompt
## Pre-Scripted Weekly Assessments

---

## MISSION

Generate **~600 Weekly Quizzes** that test all rules learned during each week. These are administered at the end of each week to assess mastery before moving on.

Each grade has approximately **50 weeks** of content across all subjects.

**NO LIVE AI** - All quizzes are pre-generated with multiple-choice questions.

---

## OUTPUT SCHEMA

Each weekly quiz follows this exact JSON structure:

```json
{
  "quiz_id": "MATH-G3-W1-QUIZ",
  "subject": "math",
  "grade": 3,
  "week": 1,
  "week_title": "Introduction to Multiplication",
  "rules_covered": ["MATH-R-MULT0", "MATH-R-MULT1", "MATH-R-MULT2"],
  "passing_score": 0.8,
  "time_limit_seconds": 600,
  "questions": [
    {
      "q_num": 1,
      "rule_id": "MATH-R-MULT0",
      "question": "What is 7 × 0?",
      "answer": 0,
      "options": [0, 7, 70, 1],
      "explanation": "Any number times zero equals zero. This is the zero property."
    },
    {
      "q_num": 2,
      "rule_id": "MATH-R-MULT0",
      "question": "What is 0 × 15?",
      "answer": 0,
      "options": [15, 0, 150, 1],
      "explanation": "Zero times any number equals zero."
    },
    {
      "q_num": 3,
      "rule_id": "MATH-R-MULT1",
      "question": "What is 9 × 1?",
      "answer": 9,
      "options": [1, 9, 10, 19],
      "explanation": "Any number times one equals itself. This is the identity property."
    },
    {
      "q_num": 4,
      "rule_id": "MATH-R-MULT1",
      "question": "What is 1 × 25?",
      "answer": 25,
      "options": [1, 25, 26, 125],
      "explanation": "One times any number equals that number."
    },
    {
      "q_num": 5,
      "rule_id": "MATH-R-MULT2",
      "question": "What is 6 × 2?",
      "answer": 12,
      "options": [8, 10, 12, 14],
      "explanation": "Multiplying by 2 is like doubling. 6 doubled is 12."
    }
  ],
  "pass_reward": {
    "coins": 50,
    "badge": "Week 1 Champion",
    "badge_icon": "trophy"
  },
  "fail_action": "review_rules",
  "fail_message": "Let's review those rules one more time!"
}
```

---

## QUIZ STRUCTURE

### Questions Per Quiz
- **3-5 questions per rule** covered that week
- **Total: 10-20 questions** per quiz depending on rules covered
- **Mixed order** - questions from different rules are shuffled

### Question Types (All Multiple Choice)
1. **Direct application** - "What is 9 × 0?"
2. **Reverse application** - "0 × ? = 0"
3. **Word problem** - "If you have 5 groups of 0 apples, how many apples?"
4. **Rule identification** - "Which property says a × 0 = 0?"
5. **True/False in MC form** - "Which statement is TRUE about multiplying by 1?"

### Answer Options
- Always 4 options
- 1 correct answer
- 3 distractors (common misconceptions)
- Correct answer position randomized

---

## WEEKLY CURRICULUM BY SUBJECT

### Math Weekly Schedule (Grades 0-7)

#### Grade 0 (Kindergarten) - 10 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | COUNT, ZERO | Counting & Zero |
| 2 | ONETOTEN | Numbers 1-10 |
| 3 | COMPARE | Comparing Numbers |
| 4 | ADDCONCEPT | Addition Introduction |
| 5 | SUBCONCEPT | Subtraction Introduction |
| 6 | Review | Cumulative Review |
| 7-10 | Extended Practice | Applied Skills |

#### Grade 1 - 12 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | ADD10 | Addition Facts to 10 |
| 2 | SUB10 | Subtraction Facts to 10 |
| 3 | DOUBLES | Doubles Strategy |
| 4 | MAKE10, COUNTON | Addition Strategies |
| 5 | FACTFAM | Fact Families |
| 6 | PLACEVALUE2 | Place Value |
| 7-12 | Extended | Applied Skills & Review |

#### Grade 2 - 12 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | ADD20 | Addition to 20 |
| 2 | SUB20 | Subtraction to 20 |
| 3 | REGROUP | Regrouping |
| 4 | EVENODD | Even & Odd |
| 5 | SKIP2, SKIP5, SKIP10 | Skip Counting |
| 6 | ARRAYS | Arrays Introduction |
| 7-12 | Extended | Applied Skills |

#### Grade 3 - 16 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | MULT0, MULT1 | × 0 and × 1 |
| 2 | MULT2 | × 2 (Doubles) |
| 3 | MULT5, MULT10 | × 5 and × 10 |
| 4 | MULT3, MULT4 | × 3 and × 4 |
| 5 | MULT6, MULT7, MULT8 | × 6, 7, 8 |
| 6 | MULT9 | × 9 Finger Trick |
| 7 | COMMUTATIVE, DISTRIBUTIVE | Properties |
| 8 | DIV | Division Concept |
| 9 | FRACTION | Fractions |
| 10 | ROUND10, ROUND100 | Rounding |
| 11-16 | Extended | Mixed Practice |

#### Grade 4 - 14 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | PLACEVALUE6 | Large Numbers |
| 2 | FACTORS | Factors |
| 3 | PRIME, COMPOSITE | Prime/Composite |
| 4 | EQUIVFRAC | Equivalent Fractions |
| 5 | ADDFRAC, SUBFRAC | Fraction Operations |
| 6 | MIXEDNUMBERS | Mixed Numbers |
| 7 | DECIMAL | Decimals |
| 8 | MULTFRACWHOLE | Fraction × Whole |
| 9-14 | Extended | Applied Skills |

#### Grade 5 - 12 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | POWERS10 | Powers of 10 |
| 2 | COMMONDENOMINATOR | Common Denominators |
| 3 | ADDFRACULIKE | Adding Unlike Fractions |
| 4 | SUBFRACULIKE | Subtracting Unlike Fractions |
| 5 | MULTFRAC | Multiplying Fractions |
| 6 | DIVFRAC | Dividing Fractions |
| 7 | ORDEROPS | Order of Operations |
| 8 | VOLUME | Volume |
| 9 | COORDINATE | Coordinate Plane |
| 10-12 | Extended | Applied Skills |

#### Grade 6 - 12 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | RATIO | Ratios |
| 2 | UNITRATE | Unit Rates |
| 3 | PERCENT | Percents |
| 4 | GCF, LCM | Number Theory |
| 5 | INTEGERS | Integers |
| 6 | ABSVALUE | Absolute Value |
| 7 | ADDINT | Adding Integers |
| 8 | MULTINT | Multiplying Integers |
| 9 | EXPRESSIONS | Algebraic Expressions |
| 10-12 | Extended | Applied Skills |

#### Grade 7 - 10 Weeks
| Week | Rules | Topic |
|------|-------|-------|
| 1 | PROPORTIONS | Proportions |
| 2 | PERCENTCHANGE | Percent Change |
| 3 | TWOSTEP | Two-Step Equations |
| 4 | INEQUALITIES | Inequalities |
| 5 | CIRCUMFERENCE | Circumference |
| 6 | AREACIRC | Area of Circles |
| 7 | SIMPLEINTEREST | Simple Interest |
| 8 | PROBABILITY | Probability |
| 9-10 | Extended | Applied Skills |

---

### Reading Weekly Schedule (Grades 0-7)

#### Grade 0-1 Phonics
| Week | Rules | Topic |
|------|-------|-------|
| 1 | SHORTVOWELS | Short Vowels |
| 2 | CONSONANTS | Consonant Sounds |
| 3 | CVC | CVC Words |
| 4 | DIGRAPHS | Digraphs (sh, ch, th, wh) |
| 5 | BLENDS | Consonant Blends |
| 6 | SILENTE | Silent E Rule |

#### Grade 2-3 Phonics Advanced
| Week | Rules | Topic |
|------|-------|-------|
| 1 | VOWELTEAMS | Vowel Teams |
| 2 | RCONTROLLED | R-Controlled Vowels |
| 3 | SOFTCG | Soft C and G |
| 4 | SYLLABLES | Syllable Rule |
| 5 | PREFIXES | Prefixes |
| 6 | SUFFIXES | Suffixes |

#### Grade 4-7 Comprehension
| Week | Rules | Topic |
|------|-------|-------|
| 1 | ROOTWORDS | Root Words |
| 2 | CONTEXT | Context Clues |
| 3 | MAINIDEA | Main Idea |
| 4 | INFERENCE | Making Inferences |
| 5 | THEME | Theme |

---

### Spelling Weekly Schedule

Spelling quizzes test the spelling rules covered:
- FLOSS, IEEI, PLURAL-S, PLURAL-ES, PLURAL-Y
- DROPPING-E, DOUBLING, CHANGY

---

### Writing Weekly Schedule

Writing quizzes test grammar and mechanics rules:
- SENTENCE, CAPITAL, PERIOD, QUESTION
- COMMA, APOSTROPHE, QUOTES
- PARAGRAPH, SUBJECTAGREE

---

### Coding Weekly Schedule

Coding quizzes test programming concepts:
- SEQUENCE, LOOP, VARIABLE
- CONDITIONAL, FUNCTION
- INPUT, OUTPUT

---

## GENERATION RULES

### Question Generation
1. **Variety** - Mix question types within each quiz
2. **Difficulty** - 60% standard, 30% easy, 10% challenging
3. **Coverage** - Each rule gets at least 3 questions
4. **Distractors** - Use common mistakes as wrong answers

### Distractor Strategy
For math:
- Off by one (29 instead of 28)
- Wrong operation (added instead of multiplied)
- Forgot carry/borrow
- Reversed digits

For reading/spelling:
- Common misspellings
- Similar-sounding words
- Pattern confusion

### Explanations
- Keep under 30 words
- Reference the rule name
- Explain WHY the answer is correct

---

## PASS/FAIL ACTIONS

### Pass (80%+)
- Award coins (50-100 based on difficulty)
- Award weekly badge
- Unlock next week's content
- Celebration animation

### Fail (<80%)
- Encouraging message
- Link back to rule teaching scripts
- Can retake after review
- No penalty for retaking

---

## BATCH GENERATION

### Per Batch
Generate all quizzes for one grade/subject combination:

```json
[
  { "quiz_id": "MATH-G3-W1-QUIZ", ... },
  { "quiz_id": "MATH-G3-W2-QUIZ", ... },
  { "quiz_id": "MATH-G3-W3-QUIZ", ... }
]
```

### Generation Order
1. Math K → Math 1 → ... → Math 7
2. Reading K → ... → Reading 7
3. Spelling, Writing, Coding

---

## COST ESTIMATE

~600 quizzes × ~400 tokens per quiz = ~240,000 output tokens

**Haiku: ~$1.00**

---

## START GENERATION

Begin with: **MATH-G0 Weekly Quizzes** (Kindergarten Math, Weeks 1-6)

Generate quizzes covering:
- Week 1: Counting & Zero
- Week 2: Numbers 1-10
- Week 3: Comparing Numbers
- Week 4: Addition Introduction
- Week 5: Subtraction Introduction
- Week 6: Cumulative Review
