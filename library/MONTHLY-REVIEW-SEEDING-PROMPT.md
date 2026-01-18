# Monthly Review Seeding Prompt
## Pre-Scripted Comprehensive Monthly Assessments

---

## MISSION

Generate **~150 Monthly Reviews** that comprehensively test ALL rules learned during each month. These are milestone assessments that unlock the next unit/topic.

**NO LIVE AI** - All reviews are pre-generated.

---

## OUTPUT SCHEMA

Each monthly review follows this exact JSON structure:

```json
{
  "review_id": "MATH-G3-M1-REVIEW",
  "subject": "math",
  "grade": 3,
  "month": 1,
  "month_title": "Multiplication Foundations",
  "weeks_covered": [1, 2, 3, 4],
  "rules_covered": [
    "MATH-R-MULT0", "MATH-R-MULT1", "MATH-R-MULT2",
    "MATH-R-MULT5", "MATH-R-MULT10", "MATH-R-MULT3",
    "MATH-R-MULT4", "MATH-R-MULT9"
  ],
  "passing_score": 0.8,
  "time_limit_seconds": 1800,
  "total_questions": 40,
  "sections": [
    {
      "section_num": 1,
      "section_title": "Multiply by 0, 1, and 2",
      "rules": ["MATH-R-MULT0", "MATH-R-MULT1", "MATH-R-MULT2"],
      "questions": [
        {
          "q_num": 1,
          "rule_id": "MATH-R-MULT0",
          "question": "8 × 0 = ?",
          "answer": 0,
          "options": [0, 8, 80, 1]
        },
        {
          "q_num": 2,
          "rule_id": "MATH-R-MULT1",
          "question": "12 × 1 = ?",
          "answer": 12,
          "options": [1, 12, 13, 121]
        }
      ]
    },
    {
      "section_num": 2,
      "section_title": "Multiply by 5 and 10",
      "rules": ["MATH-R-MULT5", "MATH-R-MULT10"],
      "questions": [
        {
          "q_num": 11,
          "rule_id": "MATH-R-MULT5",
          "question": "7 × 5 = ?",
          "answer": 35,
          "options": [30, 35, 40, 12]
        }
      ]
    }
  ],
  "pass_reward": {
    "coins": 200,
    "badge": "Multiplication Master",
    "badge_icon": "star_gold",
    "unlock": "DIVISION-UNIT"
  },
  "fail_action": "review_weak_areas",
  "fail_message": "Almost there! Let's review the rules you need to practice.",
  "analytics": {
    "track_by_rule": true,
    "identify_weak_areas": true,
    "recommend_practice": true
  }
}
```

---

## REVIEW STRUCTURE

### Questions Per Review
- **40 questions** total (comprehensive)
- **5 questions per rule** minimum
- **Organized into sections** by topic/week

### Time Limits
- Grade K-2: 20 minutes (1200 seconds)
- Grade 3-5: 30 minutes (1800 seconds)
- Grade 6-7: 45 minutes (2700 seconds)

### Sections
- 4-6 sections per review (one per week typically)
- Each section focuses on related rules
- Progress bar shows completion

---

## MONTHLY CURRICULUM BY SUBJECT

### Math Monthly Reviews

#### Grade 0 (Kindergarten)
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Numbers & Counting | COUNT, ZERO, ONETOTEN, COMPARE |
| 2 | Basic Operations | ADDCONCEPT, SUBCONCEPT |

#### Grade 1
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Addition Mastery | ADD10, DOUBLES, MAKE10, COUNTON |
| 2 | Subtraction & Place Value | SUB10, FACTFAM, PLACEVALUE2 |

#### Grade 2
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Operations to 20 | ADD20, SUB20, REGROUP |
| 2 | Patterns & Arrays | EVENODD, SKIP2, SKIP5, SKIP10, ARRAYS |

#### Grade 3
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Multiplication Facts | MULT0-MULT9, COMMUTATIVE, DISTRIBUTIVE |
| 2 | Division & Fractions | DIV, FRACTION |
| 3 | Rounding & Review | ROUND10, ROUND100 |

#### Grade 4
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Large Numbers & Factors | PLACEVALUE6, FACTORS, PRIME, COMPOSITE |
| 2 | Fractions | EQUIVFRAC, ADDFRAC, SUBFRAC, MIXEDNUMBERS |
| 3 | Decimals & Fractions | DECIMAL, MULTFRACWHOLE |

#### Grade 5
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Fraction Operations | POWERS10, COMMONDENOMINATOR, ADDFRACULIKE, SUBFRACULIKE |
| 2 | Advanced Fractions | MULTFRAC, DIVFRAC |
| 3 | Expressions & Geometry | ORDEROPS, VOLUME, COORDINATE |

#### Grade 6
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Ratios & Percents | RATIO, UNITRATE, PERCENT |
| 2 | Integers | GCF, LCM, INTEGERS, ABSVALUE, ADDINT, MULTINT |
| 3 | Algebra | EXPRESSIONS |

#### Grade 7
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Proportions & Equations | PROPORTIONS, PERCENTCHANGE, TWOSTEP, INEQUALITIES |
| 2 | Geometry & Probability | CIRCUMFERENCE, AREACIRC, SIMPLEINTEREST, PROBABILITY |

---

### Reading Monthly Reviews

#### Grades K-1 (Phonics)
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Sound Basics | SHORTVOWELS, CONSONANTS, CVC |
| 2 | Advanced Phonics | DIGRAPHS, BLENDS, SILENTE |

#### Grades 2-3 (Advanced Phonics)
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Vowel Patterns | VOWELTEAMS, RCONTROLLED, SOFTCG |
| 2 | Word Parts | SYLLABLES, PREFIXES, SUFFIXES |

#### Grades 4-7 (Comprehension)
| Month | Topic | Rules |
|-------|-------|-------|
| 1 | Vocabulary | ROOTWORDS, CONTEXT |
| 2 | Comprehension | MAINIDEA, INFERENCE, THEME |

---

## PASS/FAIL LOGIC

### Pass (80%+)
```json
{
  "result": "pass",
  "coins_awarded": 200,
  "badge_earned": "Multiplication Master",
  "unlock_next": "DIVISION-UNIT",
  "celebration": "confetti",
  "message": "You mastered multiplication! Ready for division!"
}
```

### Fail (<80%)
```json
{
  "result": "fail",
  "weak_rules": ["MATH-R-MULT7", "MATH-R-MULT8"],
  "recommendation": "Review × 7 and × 8 rules",
  "retry_available": true,
  "practice_links": [
    {"rule_id": "MATH-R-MULT7", "type": "rule_teaching"},
    {"rule_id": "MATH-R-MULT8", "type": "demo_problems"}
  ],
  "message": "You got 72%! Practice × 7 and × 8, then try again!"
}
```

### Analytics Output
```json
{
  "scores_by_rule": {
    "MATH-R-MULT0": 1.0,
    "MATH-R-MULT1": 1.0,
    "MATH-R-MULT7": 0.4,
    "MATH-R-MULT8": 0.6
  },
  "weakest_rules": ["MATH-R-MULT7", "MATH-R-MULT8"],
  "strongest_rules": ["MATH-R-MULT0", "MATH-R-MULT1"],
  "overall_score": 0.72,
  "time_taken_seconds": 1456
}
```

---

## QUESTION GENERATION RULES

### Distribution
- 60% direct application questions
- 20% word problems
- 10% concept questions ("Which rule...?")
- 10% challenging variations

### Difficulty Progression
Within each section:
- First 2 questions: Easy
- Middle questions: Standard
- Last 1-2 questions: Challenging

### Distractors
Same strategy as Weekly Quizzes:
- Common mistakes
- Off-by-one errors
- Operation confusion
- Pattern-based errors

---

## SPECIAL FEATURES

### Progress Tracking
- Show progress bar by section
- Allow marking questions for review
- Show time remaining

### Adaptive Feedback (Post-Quiz)
- Identify weak areas
- Link to specific rule teaching scripts
- Suggest practice problems

### Retry Logic
- Must wait 24 hours OR complete recommended practice
- New question variants on retry (same rules, different numbers)
- Track improvement between attempts

---

## BATCH GENERATION

### Per Batch
Generate all monthly reviews for one grade/subject:

```json
[
  { "review_id": "MATH-G3-M1-REVIEW", ... },
  { "review_id": "MATH-G3-M2-REVIEW", ... },
  { "review_id": "MATH-G3-M3-REVIEW", ... }
]
```

### Generation Order
1. Math K → Math 7
2. Reading K → Reading 7
3. Spelling, Writing, Coding

---

## COST ESTIMATE

~150 reviews × ~800 tokens per review = ~120,000 output tokens

**Haiku: ~$0.50**

---

## START GENERATION

Begin with: **MATH-G0 Monthly Reviews** (Kindergarten Math)

Generate reviews:
- Month 1: Numbers & Counting (COUNT, ZERO, ONETOTEN, COMPARE)
- Month 2: Basic Operations (ADDCONCEPT, SUBCONCEPT)
