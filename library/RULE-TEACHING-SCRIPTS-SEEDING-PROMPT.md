# Rule Teaching Scripts Seeding Prompt
## Pre-Scripted "I DO" Phase Content

---

## MISSION

Generate **~150 Rule Teaching Scripts** for K-7 education. These are the foundational rules students must learn BEFORE practicing. Each script includes:
- Animated step-by-step explanation
- Visual aids for each step
- Voice narration text
- A "rule card" summary

**NO LIVE AI** - Everything is pre-scripted so Gigi can teach consistently.

---

## OUTPUT SCHEMA

Every rule teaching script must follow this exact JSON structure:

```json
{
  "rule_id": "MATH-R-MULT9",
  "rule_name": "Multiplication by 9 (Finger Trick)",
  "grade": 3,
  "subject": "math",
  "skill": "multiplication facts",
  "prerequisite_rules": ["MATH-R-MULT1", "MATH-R-MULT2"],
  "teaching_script": {
    "intro": "Let me show you the coolest trick in math!",
    "explanation": [
      {
        "step": 1,
        "text": "Hold up all 10 fingers",
        "visual": {
          "type": "hands",
          "data": { "fingers_up": 10 }
        },
        "voice": "Start with all ten fingers up in front of you",
        "duration": 3000
      },
      {
        "step": 2,
        "text": "To multiply 9 times a number, fold down that finger",
        "visual": {
          "type": "hands",
          "data": { "fold_finger": 4, "highlight": true }
        },
        "voice": "For nine times four, fold down your fourth finger",
        "duration": 3500
      },
      {
        "step": 3,
        "text": "Count fingers BEFORE the fold - that's your tens digit",
        "visual": {
          "type": "hands",
          "data": { "highlight_before": true, "label": "3" }
        },
        "voice": "Count the fingers before the fold. That's three - your tens digit",
        "duration": 4000
      },
      {
        "step": 4,
        "text": "Count fingers AFTER the fold - that's your ones digit",
        "visual": {
          "type": "hands",
          "data": { "highlight_after": true, "label": "6" }
        },
        "voice": "Count the fingers after. That's six - your ones digit",
        "duration": 4000
      },
      {
        "step": 5,
        "text": "Put them together: 36!",
        "visual": {
          "type": "number_combine",
          "data": { "tens": 3, "ones": 6, "result": 36, "equation": "9 × 4 = 36" }
        },
        "voice": "Three and six make thirty-six! Nine times four equals thirty-six!",
        "duration": 4000
      }
    ],
    "rule_card": {
      "title": "The 9 Finger Trick",
      "rule_text": "For 9 × N: fold finger N, count before (tens) and after (ones)",
      "examples": ["9×3 = 27 (2 before, 7 after)", "9×7 = 63 (6 before, 3 after)", "9×9 = 81 (8 before, 1 after)"],
      "memory_tip": "Your hands are a 9-times calculator!"
    }
  },
  "total_duration": 18500,
  "difficulty": "standard"
}
```

---

## VISUAL TYPES FOR RULE TEACHING

### Math Visuals

**hands** - For finger-based tricks
```json
{
  "type": "hands",
  "data": {
    "fingers_up": 10,
    "fold_finger": 4,
    "highlight_before": true,
    "highlight_after": false,
    "label": "3"
  }
}
```

**number_combine** - Showing place value combining
```json
{
  "type": "number_combine",
  "data": {
    "tens": 3,
    "ones": 6,
    "result": 36,
    "equation": "9 × 4 = 36"
  }
}
```

**number_line** - For skip counting, addition, subtraction rules
```json
{
  "type": "number_line",
  "data": {
    "min": 0,
    "max": 20,
    "jumps": [{"from": 0, "to": 5, "label": "+5"}, {"from": 5, "to": 10, "label": "+5"}],
    "highlight_points": [0, 5, 10, 15, 20]
  }
}
```

**array** - For multiplication/division understanding
```json
{
  "type": "array",
  "data": {
    "rows": 3,
    "columns": 4,
    "emoji": "⭐",
    "show_equation": true,
    "highlight_row": 1,
    "highlight_column": null
  }
}
```

**fraction_visual** - For fraction rules
```json
{
  "type": "fraction_visual",
  "data": {
    "type": "pie|bar|number_line",
    "numerator": 3,
    "denominator": 4,
    "equivalent": {"numerator": 6, "denominator": 8},
    "show_comparison": true
  }
}
```

**place_value_chart** - For place value rules
```json
{
  "type": "place_value_chart",
  "data": {
    "number": 253,
    "highlight_column": "tens",
    "show_expanded": true
  }
}
```

**equation_transform** - For algebra rules
```json
{
  "type": "equation_transform",
  "data": {
    "before": "5x - 3 = 12",
    "action": "Add 3 to both sides",
    "after": "5x = 15",
    "highlight_change": true
  }
}
```

**balance_scale** - For equation equality
```json
{
  "type": "balance_scale",
  "data": {
    "left": "5x",
    "right": "15",
    "balanced": true,
    "show_animation": true
  }
}
```

### Reading/Phonics Visuals

**phonics_rule** - For phonics patterns
```json
{
  "type": "phonics_rule",
  "data": {
    "pattern": "CVCe",
    "example_word": "cake",
    "letters": ["c", "a", "k", "e"],
    "highlight_silent": "e",
    "sound_change": "short a → long a"
  }
}
```

**word_family** - For rhyming patterns
```json
{
  "type": "word_family",
  "data": {
    "family": "-at",
    "words": ["cat", "bat", "hat", "mat", "sat"],
    "highlight_pattern": true
  }
}
```

**spelling_pattern** - For spelling rules
```json
{
  "type": "spelling_pattern",
  "data": {
    "rule": "i before e except after c",
    "correct": ["believe", "receive"],
    "incorrect": ["beleive", "recieve"],
    "exceptions": ["weird", "science"]
  }
}
```

---

## COMPLETE RULES LIST BY SUBJECT

### MATH RULES (~100 rules)

#### Kindergarten Math Rules (Grade 0)
1. **MATH-R-COUNT** - Counting means touching each object once and saying numbers in order
2. **MATH-R-ZERO** - Zero means "nothing" or "none"
3. **MATH-R-ONETOTEN** - Numbers 1-10 represent quantities
4. **MATH-R-COMPARE** - More means bigger number, less means smaller number
5. **MATH-R-ADDCONCEPT** - Adding means putting groups together
6. **MATH-R-SUBCONCEPT** - Subtracting means taking away

#### 1st Grade Math Rules (Grade 1)
7. **MATH-R-ADD10** - Addition facts to 10 (memorize)
8. **MATH-R-SUB10** - Subtraction facts to 10 (memorize)
9. **MATH-R-DOUBLES** - Doubles facts (1+1=2, 2+2=4, etc.)
10. **MATH-R-MAKE10** - Make 10 strategy (8+5 = 8+2+3 = 10+3 = 13)
11. **MATH-R-COUNTON** - Count on strategy (start from bigger number)
12. **MATH-R-FACTFAM** - Fact families (if 3+5=8, then 8-5=3)
13. **MATH-R-PLACEVALUE2** - Two-digit numbers = tens + ones

#### 2nd Grade Math Rules (Grade 2)
14. **MATH-R-ADD20** - Addition facts to 20 (fluency)
15. **MATH-R-SUB20** - Subtraction facts to 20 (fluency)
16. **MATH-R-REGROUP** - Regrouping (10 ones = 1 ten)
17. **MATH-R-EVENODD** - Even numbers end in 0,2,4,6,8; Odd end in 1,3,5,7,9
18. **MATH-R-SKIP2** - Skip counting by 2s
19. **MATH-R-SKIP5** - Skip counting by 5s
20. **MATH-R-SKIP10** - Skip counting by 10s
21. **MATH-R-ARRAYS** - Arrays show multiplication (rows × columns)

#### 3rd Grade Math Rules (Grade 3)
22. **MATH-R-MULT0** - Anything × 0 = 0 (zero property)
23. **MATH-R-MULT1** - Anything × 1 = itself (identity property)
24. **MATH-R-MULT2** - × 2 = doubles (add to itself)
25. **MATH-R-MULT5** - × 5 = skip count by 5s (ends in 0 or 5)
26. **MATH-R-MULT10** - × 10 = add a zero
27. **MATH-R-MULT3** - × 3 pattern (triple it)
28. **MATH-R-MULT4** - × 4 = double double
29. **MATH-R-MULT9** - × 9 finger trick
30. **MATH-R-MULT6** - × 6 = × 3 then double
31. **MATH-R-MULT7** - × 7 patterns
32. **MATH-R-MULT8** - × 8 = double × 4
33. **MATH-R-COMMUTATIVE** - a × b = b × a (order doesn't matter)
34. **MATH-R-DISTRIBUTIVE** - a × (b + c) = (a × b) + (a × c)
35. **MATH-R-DIV** - Division is the opposite of multiplication
36. **MATH-R-FRACTION** - Fractions = parts of a whole
37. **MATH-R-ROUND10** - Rounding to nearest 10 (5+ round up)
38. **MATH-R-ROUND100** - Rounding to nearest 100

#### 4th Grade Math Rules (Grade 4)
39. **MATH-R-PLACEVALUE6** - Place value to millions
40. **MATH-R-FACTORS** - Factors are numbers that divide evenly
41. **MATH-R-PRIME** - Prime numbers have only 2 factors (1 and itself)
42. **MATH-R-COMPOSITE** - Composite numbers have more than 2 factors
43. **MATH-R-EQUIVFRAC** - Equivalent fractions (multiply/divide top and bottom by same)
44. **MATH-R-ADDFRAC** - Adding fractions with same denominator
45. **MATH-R-SUBFRAC** - Subtracting fractions with same denominator
46. **MATH-R-MIXEDNUMBERS** - Mixed numbers = whole + fraction
47. **MATH-R-DECIMAL** - Decimals are fractions with denominator of 10, 100, etc.
48. **MATH-R-MULTFRACWHOLE** - Multiplying fraction by whole number

#### 5th Grade Math Rules (Grade 5)
49. **MATH-R-POWERS10** - Powers of 10 (10¹=10, 10²=100, etc.)
50. **MATH-R-COMMONDENOMINATOR** - Finding common denominators
51. **MATH-R-ADDFRACULIKE** - Adding fractions with unlike denominators
52. **MATH-R-SUBFRACULIKE** - Subtracting fractions with unlike denominators
53. **MATH-R-MULTFRAC** - Multiplying fractions (multiply tops, multiply bottoms)
54. **MATH-R-DIVFRAC** - Dividing fractions (keep, change, flip)
55. **MATH-R-ORDEROPS** - Order of operations (PEMDAS)
56. **MATH-R-VOLUME** - Volume = length × width × height
57. **MATH-R-COORDINATE** - Coordinate plane (x, y)

#### 6th Grade Math Rules (Grade 6)
58. **MATH-R-RATIO** - Ratios compare two quantities
59. **MATH-R-UNITRATE** - Unit rate = ratio with denominator of 1
60. **MATH-R-PERCENT** - Percent means "per 100"
61. **MATH-R-GCF** - Greatest Common Factor
62. **MATH-R-LCM** - Least Common Multiple
63. **MATH-R-INTEGERS** - Integers include negative numbers
64. **MATH-R-ABSVALUE** - Absolute value = distance from zero
65. **MATH-R-ADDINT** - Adding integers (same signs add, different signs subtract)
66. **MATH-R-MULTINT** - Multiplying integers (same signs positive, different signs negative)
67. **MATH-R-EXPRESSIONS** - Expressions have variables, equations have equals

#### 7th Grade Math Rules (Grade 7)
68. **MATH-R-PROPORTIONS** - Cross multiply to solve proportions
69. **MATH-R-PERCENTCHANGE** - Percent change = (new - old) / old × 100
70. **MATH-R-TWOSTEP** - Two-step equations (undo operations in reverse order)
71. **MATH-R-INEQUALITIES** - Inequalities show >, <, ≥, ≤
72. **MATH-R-CIRCUMFERENCE** - Circumference = π × diameter
73. **MATH-R-AREACIRC** - Area of circle = π × r²
74. **MATH-R-SIMPLEINTEREST** - Interest = Principal × Rate × Time
75. **MATH-R-PROBABILITY** - Probability = favorable outcomes / total outcomes

### READING/PHONICS RULES (~25 rules)

#### Kindergarten-1st Grade Phonics Rules
76. **READ-R-SHORTVOWELS** - Short vowels say their sounds (a as in apple)
77. **READ-R-CONSONANTS** - Consonants make one sound each
78. **READ-R-CVC** - CVC pattern = short vowel sound
79. **READ-R-DIGRAPHS** - Digraphs: two letters, one sound (sh, ch, th, wh)
80. **READ-R-BLENDS** - Blends: hear both consonant sounds (bl, cr, st)

#### 2nd-3rd Grade Phonics Rules
81. **READ-R-SILENTE** - Silent E makes vowels say their name (CVCe)
82. **READ-R-VOWELTEAMS** - Vowel teams: first vowel talks, second walks (ai, ea, oa)
83. **READ-R-RCONTROLLED** - R-controlled vowels: ar, er, ir, or, ur
84. **READ-R-SOFTCG** - Soft C before e,i,y (cent); Soft G before e,i,y (gem)
85. **READ-R-SYLLABLES** - Every syllable has one vowel sound
86. **READ-R-PREFIXES** - Prefixes change word meaning at the start
87. **READ-R-SUFFIXES** - Suffixes change word meaning at the end

#### 4th-7th Grade Reading Rules
88. **READ-R-ROOTWORDS** - Root words are the base meaning
89. **READ-R-CONTEXT** - Use context clues to figure out unknown words
90. **READ-R-MAINIDEA** - Main idea = what the text is mostly about
91. **READ-R-INFERENCE** - Inference = reading between the lines
92. **READ-R-THEME** - Theme = the message or lesson of the story

### SPELLING RULES (~15 rules)

93. **SPELL-R-FLOSS** - Double ff, ll, ss, zz after short vowel (stuff, bell, miss)
94. **SPELL-R-IEEI** - I before E except after C
95. **SPELL-R-PLURAL-S** - Add -s for most plurals
96. **SPELL-R-PLURAL-ES** - Add -es after s, x, z, ch, sh
97. **SPELL-R-PLURAL-Y** - Consonant + y: change y to i, add -es
98. **SPELL-R-DROPPING-E** - Drop silent e before suffix starting with vowel
99. **SPELL-R-DOUBLING** - Double final consonant before -ed/-ing (short vowel + single consonant)
100. **SPELL-R-CHANGY** - Change y to i before suffix (not -ing)

### GRAMMAR/WRITING RULES (~15 rules)

101. **WRITE-R-SENTENCE** - Sentences need subject + verb + end punctuation
102. **WRITE-R-CAPITAL** - Capitalize first word and proper nouns
103. **WRITE-R-PERIOD** - Periods end statements
104. **WRITE-R-QUESTION** - Question marks end questions
105. **WRITE-R-COMMA** - Commas separate items in a list
106. **WRITE-R-APOSTROPHE** - Apostrophes show possession or contraction
107. **WRITE-R-QUOTES** - Quotation marks around someone's exact words
108. **WRITE-R-PARAGRAPH** - Paragraphs need topic sentence + supporting details
109. **WRITE-R-SUBJECTAGREE** - Subject and verb must agree (he runs, they run)

### CODING RULES (~10 rules)

110. **CODE-R-SEQUENCE** - Code runs in order, top to bottom
111. **CODE-R-LOOP** - Loops repeat code multiple times
112. **CODE-R-VARIABLE** - Variables store data
113. **CODE-R-CONDITIONAL** - If/else makes decisions
114. **CODE-R-FUNCTION** - Functions are reusable code blocks
115. **CODE-R-INPUT** - Input gets data from user
116. **CODE-R-OUTPUT** - Output shows results

---

## GENERATION RULES

### Content Rules
1. **Intro** - 1-2 sentences to hook attention (max 20 words)
2. **Steps** - 3-7 steps per rule (most rules need 4-5)
3. **Text** - Max 20 words per step
4. **Voice** - Max 20 words per step (conversational, clear)
5. **Duration** - 2500-5000ms per step
6. **Rule Card** - Summary with 2-3 examples

### Visual Rules
1. Every step MUST have a visual
2. Visual type must match content
3. Data must be complete for rendering
4. Animations should build understanding

### Voice Script Rules
1. Use simple, grade-appropriate language
2. Be conversational ("Let's...", "Now we...")
3. Pause naturally between ideas
4. Emphasize key points

---

## BATCH INSTRUCTIONS

### Priority Order
1. Math rules (most important for skills)
2. Reading/Phonics rules
3. Spelling rules
4. Writing rules
5. Coding rules

### Per Batch
- Generate 10-20 rules per API call
- Output as JSON array
- Validate schema compliance
- Check visual types are valid

### Quality Checks
1. Every rule has complete teaching_script
2. Every step has visual with valid type
3. Voice text is speakable (no abbreviations)
4. Examples in rule_card are correct
5. Prerequisites reference existing rule_ids

---

## COST ESTIMATE

~150 rules × ~500 tokens per rule = ~75,000 output tokens

**Haiku: ~$0.30**
**Very affordable!**

---

## START GENERATION

Begin with: **Math Rules Grade 0-3** (Foundational rules for K-3 math)

Generate the first 25 rules covering:
- Counting (K)
- Addition/Subtraction facts (K-1)
- Place value (1-2)
- Multiplication facts (3)
