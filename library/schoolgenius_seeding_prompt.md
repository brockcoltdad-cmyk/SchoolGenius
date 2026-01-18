# SchoolGenius Lesson Seeding Program

## MISSION
Generate 185,000 unique lesson entries for K-6 education platform. Each lesson has two teaching tiers with animated visual aids and voice narration.

---

## OUTPUT SCHEMA

Every lesson must follow this exact JSON structure:

```json
{
  "id": "{SUBJECT}-G{GRADE}-{SKILL_CODE}-{NUMBER}",
  "subject": "math|reading|spelling|writing|coding|typing",
  "grade": 0-6,
  "skill": "human readable skill name",
  "standard": "state standard code if applicable",
  "question": "the question or prompt",
  "answer": "correct answer",
  "tier1": {
    "teach": "1-2 sentence explanation (max 25 words)",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "visual_type_from_list",
          "data": { }
        },
        "voice_text": "narration for this step (max 20 words)",
        "duration": 3000-6000
      }
    ]
  },
  "tier2": {
    "teach": "super simple explanation for younger minds (max 20 words)",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "visual_type_from_list",
          "data": { }
        },
        "voice_text": "kid-proof narration (max 15 words)",
        "duration": 3000-6000
      }
    ]
  }
}
```

---

## DISTRIBUTION

| Subject  | Count  | Grade Breakdown |
|----------|--------|-----------------|
| Math     | 80,000 | K: 8K, 1st: 12K, 2nd: 12K, 3rd: 14K, 4th: 12K, 5th: 11K, 6th: 11K |
| Reading  | 50,000 | K: 8K, 1st: 10K, 2nd: 10K, 3rd: 8K, 4th: 6K, 5th: 4K, 6th: 4K |
| Spelling | 25,000 | K: 2K, 1st: 4K, 2nd: 5K, 3rd: 5K, 4th: 4K, 5th: 3K, 6th: 2K |
| Writing  | 10,000 | K: 1K, 1st: 1.5K, 2nd: 1.5K, 3rd: 2K, 4th: 1.5K, 5th: 1.5K, 6th: 1K |
| Coding   | 10,000 | K: 1K, 1st: 1.5K, 2nd: 1.5K, 3rd: 2K, 4th: 1.5K, 5th: 1.5K, 6th: 1K |
| Typing   | 10,000 | K: 1K, 1st: 1.5K, 2nd: 2K, 3rd: 2K, 4th: 1.5K, 5th: 1K, 6th: 1K |

---

## VISUAL TYPES AVAILABLE

You MUST use only these visual types. Each has specific data requirements.

### MATH VISUALS

**fraction**
```json
{
  "type": "fraction",
  "data": {
    "type": "pie|bar",
    "numerator": 3,
    "denominator": 4
  }
}
```

**array**
```json
{
  "type": "array",
  "data": {
    "rows": 3,
    "columns": 4,
    "emoji": "🍎",
    "show_equation": true
  }
}
```

**place_value**
```json
{
  "type": "place_value",
  "data": {
    "number": 253
  }
}
```

**number_line**
```json
{
  "type": "number_line",
  "data": {
    "min": 0,
    "max": 20,
    "highlight": [5, 12],
    "jump_from": 5,
    "jump_to": 12,
    "jump_label": "+7"
  }
}
```

**counting_objects**
```json
{
  "type": "counting_objects",
  "data": {
    "count": 8,
    "emoji": "⭐",
    "groups": 2,
    "per_group": 4
  }
}
```

**bar_model**
```json
{
  "type": "bar_model",
  "data": {
    "total": 24,
    "parts": [10, 14],
    "labels": ["red", "blue"],
    "unknown": "total|part"
  }
}
```

**balance_scale**
```json
{
  "type": "balance_scale",
  "data": {
    "left": "5x - 3",
    "right": "2x + 12",
    "balanced": true
  }
}
```

**equation_steps**
```json
{
  "type": "equation_steps",
  "data": {
    "equations": ["5x - 3 = 2x + 12", "3x - 3 = 12", "3x = 15", "x = 5"],
    "highlight_step": 2,
    "action": "subtract 2x from both sides"
  }
}
```

**graph**
```json
{
  "type": "graph",
  "data": {
    "type": "coordinate|bar|line",
    "points": [[2,3], [4,5]],
    "x_label": "x",
    "y_label": "y",
    "x_max": 10,
    "y_max": 10
  }
}
```

### READING VISUALS

**letter**
```json
{
  "type": "letter",
  "data": {
    "letter": "A",
    "case": "upper|lower|both",
    "show_stroke": true
  }
}
```

**phonics**
```json
{
  "type": "phonics",
  "data": {
    "sound": "sh",
    "examples": ["ship", "shell", "fish"],
    "mouth_position": "teeth together, blow air"
  }
}
```

**word_building**
```json
{
  "type": "word_building",
  "data": {
    "letters": ["c", "a", "t"],
    "blend_points": [0, 1],
    "final_word": "cat"
  }
}
```

**sight_word**
```json
{
  "type": "sight_word",
  "data": {
    "word": "the",
    "sentence": "The dog ran fast.",
    "highlight_in_sentence": true
  }
}
```

**syllable**
```json
{
  "type": "syllable",
  "data": {
    "word": "elephant",
    "syllables": ["el", "e", "phant"],
    "clap_count": 3
  }
}
```

### SPELLING VISUALS

**spelling_rule**
```json
{
  "type": "spelling_rule",
  "data": {
    "rule": "i before e except after c",
    "correct_examples": ["believe", "receive"],
    "incorrect_examples": ["beleive", "recieve"],
    "exceptions": ["weird", "science"]
  }
}
```

### WRITING VISUALS

**sentence_builder**
```json
{
  "type": "sentence_builder",
  "data": {
    "parts": ["The", "cat", "sat", "on", "the", "mat"],
    "part_types": ["article", "noun", "verb", "preposition", "article", "noun"],
    "correct_order": [0, 1, 2, 3, 4, 5],
    "punctuation": "."
  }
}
```

### CODING VISUALS

**code_block**
```json
{
  "type": "code_block",
  "data": {
    "language": "python|javascript|scratch",
    "code": "for i in range(5):\n    print(i)",
    "highlight_lines": [1, 2],
    "output": "0\n1\n2\n3\n4"
  }
}
```

**variable_box**
```json
{
  "type": "variable_box",
  "data": {
    "name": "score",
    "value": 10,
    "type": "number|string|boolean",
    "show_update": true,
    "new_value": 15
  }
}
```

**loop_animation**
```json
{
  "type": "loop_animation",
  "data": {
    "iterations": 5,
    "action": "print star",
    "emoji": "⭐",
    "current_iteration": 3
  }
}
```

**conditional**
```json
{
  "type": "conditional",
  "data": {
    "condition": "score > 10",
    "if_true": "You win!",
    "if_false": "Try again",
    "current_value": 15,
    "result": "true"
  }
}
```

**output**
```json
{
  "type": "output",
  "data": {
    "lines": ["Hello", "World", "!"],
    "typing_effect": true
  }
}
```

### TYPING VISUALS

**keyboard**
```json
{
  "type": "keyboard",
  "data": {
    "highlight_keys": ["f", "j"],
    "finger_labels": true,
    "home_row": true,
    "target_key": "g",
    "finger_to_use": "left index"
  }
}
```

---

## SUBJECT-SPECIFIC SKILL LISTS

### MATH SKILLS BY GRADE

**Kindergarten (8,000 lessons)**
- Counting 1-20
- Number recognition 0-20
- One more / one less
- Comparing numbers (more, less, equal)
- Basic shapes (circle, square, triangle, rectangle)
- Positional words (above, below, beside)
- Sorting by attribute
- Patterns (AB, ABC)
- Addition within 5
- Subtraction within 5

**Grade 1 (12,000 lessons)**
- Counting to 120
- Place value (tens and ones)
- Addition within 20
- Subtraction within 20
- Addition/subtraction fact families
- Comparing two-digit numbers
- Measuring length
- Telling time (hour, half hour)
- Identifying coins
- Basic fractions (halves, fourths)
- Two-dimensional shapes
- Three-dimensional shapes

**Grade 2 (12,000 lessons)**
- Place value to 1,000
- Addition within 100
- Subtraction within 100
- Addition with regrouping
- Subtraction with regrouping
- Skip counting (2s, 5s, 10s, 100s)
- Even and odd numbers
- Arrays and repeated addition
- Measuring length (inches, feet, cm, m)
- Telling time (5 minutes)
- Money (dollars and cents)
- Word problems (add/subtract)
- Bar graphs and picture graphs
- Fractions (halves, thirds, fourths)

**Grade 3 (14,000 lessons)**
- Multiplication facts 0-10
- Division facts 0-10
- Multiplication properties
- Multi-digit addition
- Multi-digit subtraction
- Rounding to nearest 10/100
- Fractions on number line
- Equivalent fractions
- Comparing fractions
- Area (counting squares)
- Perimeter
- Elapsed time
- Mass and volume
- Scaled bar/picture graphs
- Multiplication word problems
- Division word problems

**Grade 4 (12,000 lessons)**
- Multi-digit multiplication
- Long division
- Factors and multiples
- Prime and composite numbers
- Place value to millions
- Rounding large numbers
- Adding/subtracting fractions (like denominators)
- Mixed numbers and improper fractions
- Decimal notation (tenths, hundredths)
- Comparing decimals
- Angles (acute, right, obtuse)
- Measuring angles
- Lines (parallel, perpendicular)
- Symmetry
- Area and perimeter formulas
- Word problems (multi-step)

**Grade 5 (11,000 lessons)**
- Multiplying fractions
- Dividing fractions
- Adding/subtracting fractions (unlike denominators)
- Decimal operations (all four)
- Place value patterns (powers of 10)
- Order of operations
- Writing expressions
- Coordinate plane
- Volume of rectangular prisms
- Converting measurement units
- Line plots with fractions
- Classifying 2D shapes
- Word problems with fractions
- Word problems with decimals

**Grade 6 (11,000 lessons)**
- Ratios and rates
- Unit rates
- Percentages
- Dividing fractions by fractions
- Multi-digit decimal operations
- Greatest common factor
- Least common multiple
- Positive and negative numbers
- Absolute value
- Coordinate plane (all quadrants)
- Algebraic expressions
- One-variable equations
- One-variable inequalities
- Area of triangles and polygons
- Surface area
- Volume
- Statistical questions
- Mean, median, mode, range
- Box plots
- Histograms

---

### READING SKILLS BY GRADE

**Kindergarten (8,000 lessons)**
- Letter recognition (uppercase)
- Letter recognition (lowercase)
- Letter sounds (consonants)
- Letter sounds (vowels)
- Rhyming words
- Beginning sounds
- Ending sounds
- CVC words
- Sight words (Dolch Pre-Primer)
- Print concepts (left to right, top to bottom)
- Story elements (characters, setting)
- Picture clues
- Sequencing (3 events)

**Grade 1 (10,000 lessons)**
- Short vowel sounds
- Long vowel sounds
- Consonant blends (bl, cr, st)
- Consonant digraphs (sh, ch, th, wh)
- CVCe words (silent e)
- Vowel teams (ai, ea, oa)
- R-controlled vowels (ar, er, ir, or, ur)
- Sight words (Dolch Primer + Grade 1)
- Main idea
- Supporting details
- Sequencing
- Cause and effect
- Compare and contrast
- Making predictions
- Character traits
- Author's purpose
- Fluency (60 wpm goal)

**Grade 2 (10,000 lessons)**
- Prefixes (un-, re-, pre-)
- Suffixes (-ful, -less, -ly, -er, -est)
- Compound words
- Contractions
- Context clues
- Multiple meaning words
- Synonyms
- Antonyms
- Main idea and details
- Summarizing
- Text features (headings, captions)
- Fiction vs nonfiction
- Author's purpose
- Making inferences
- Story structure (beginning, middle, end)
- Point of view
- Sight words (Dolch Grade 2-3)
- Fluency (90 wpm goal)

**Grade 3 (8,000 lessons)**
- Root words
- Greek and Latin roots
- Prefixes (dis-, mis-, non-)
- Suffixes (-tion, -ment, -ness)
- Figurative language (similes)
- Central message/theme
- Character development
- Compare texts
- Text structure (sequence, compare, cause/effect)
- Using text evidence
- Point of view (1st, 3rd)
- Illustrations and text
- Fluency (120 wpm goal)

**Grade 4 (6,000 lessons)**
- Greek and Latin roots (advanced)
- Figurative language (metaphors, idioms)
- Theme
- Summarizing fiction
- Summarizing nonfiction
- Text structure (problem/solution)
- First-hand vs second-hand accounts
- Integrating information
- Poetry elements (verse, rhythm, meter)
- Drama elements (cast, dialogue, stage directions)
- Point of view comparison
- Fluency (140 wpm goal)

**Grade 5 (4,000 lessons)**
- Word relationships (analogies)
- Connotation and denotation
- Figurative language (hyperbole, personification)
- Theme across texts
- Compare/contrast genres
- Analyzing multiple accounts
- Text structure (advanced)
- Author's argument and claims
- Integrating information from multiple sources
- Visual/multimedia elements
- Fluency (150 wpm goal)

**Grade 6 (4,000 lessons)**
- Etymology
- Academic vocabulary
- Technical vocabulary
- Figurative language (allusion, symbolism)
- Theme development
- Plot development (exposition, climax, resolution)
- Character point of view
- Author's purpose and perspective
- Evaluating arguments
- Comparing texts across genres
- Analyzing text structure
- Fluency (160 wpm goal)

---

### SPELLING SKILLS BY GRADE

**Kindergarten (2,000 lessons)**
- CVC words (cat, dog, run)
- Name spelling
- High-frequency words (the, and, a, to, is)
- Letter formation

**Grade 1 (4,000 lessons)**
- Short vowel word families (-at, -an, -ig, -op, -ug)
- Long vowel CVCe words (make, like, home)
- Consonant blends (stop, trip, glad)
- Digraphs in words (ship, that, when)
- Dolch sight words
- Days of the week
- Color words
- Number words (one-ten)

**Grade 2 (5,000 lessons)**
- Vowel teams (rain, boat, feet)
- R-controlled words (car, bird, her)
- Silent letters (know, write, lamb)
- Double consonants (rabbit, butter)
- Compound words
- Contractions (don't, can't, I'm)
- Plurals (-s, -es)
- Past tense (-ed)
- Homophones (to/too/two, there/their/they're)

**Grade 3 (5,000 lessons)**
- Prefixes (un-, re-, dis-, pre-)
- Suffixes (-ful, -less, -ly, -ment)
- Irregular plurals (children, mice, teeth)
- Irregular past tense (went, saw, came)
- Homophones (advanced)
- Apostrophes (possessives)
- Syllable patterns (VC/CV, V/CV)
- Schwa sound words
- Frequently misspelled words

**Grade 4 (4,000 lessons)**
- Greek roots (graph, phon, auto)
- Latin roots (ject, port, struct)
- Prefixes (mis-, non-, over-, under-)
- Suffixes (-tion, -sion, -ness, -able)
- Doubling rule (stopping, running)
- Drop e rule (having, hoping)
- Change y to i rule (cried, happier)
- Homographs (lead, read, wind)
- Academic vocabulary spelling

**Grade 5 (3,000 lessons)**
- Advanced Greek roots
- Advanced Latin roots
- Absorbed prefixes (irregular, immature)
- Advanced suffixes (-ous, -ive, -al)
- Spelling patterns (ough, augh, eigh)
- Science vocabulary
- Social studies vocabulary
- Commonly confused words (affect/effect)
- Etymology-based spelling

**Grade 6 (2,000 lessons)**
- Complex Greek/Latin combinations
- Technical vocabulary
- Literary vocabulary
- Foreign words in English
- Advanced commonly confused words
- Discipline-specific terms
- SAT prep words

---

### WRITING SKILLS BY GRADE

**Kindergarten (1,000 lessons)**
- Writing letters (uppercase)
- Writing letters (lowercase)
- Writing name
- Writing simple sentences
- Using spaces between words
- Capitalization (first word, I)
- Ending punctuation (period)
- Drawing to express ideas

**Grade 1 (1,500 lessons)**
- Complete sentences
- Capitalization (names, dates)
- Punctuation (period, question mark, exclamation)
- Nouns (common, proper)
- Verbs (action words)
- Adjectives
- Writing opinions
- Writing informative text
- Writing narratives
- Sequencing ideas

**Grade 2 (1,500 lessons)**
- Sentence types (statement, question, exclamation, command)
- Compound sentences (and, but, or)
- Collective nouns
- Irregular plural nouns
- Past tense verbs
- Irregular past tense
- Adverbs
- Apostrophes (contractions, possessives)
- Commas in greetings/closings
- Paragraph structure
- Topic sentences
- Supporting details

**Grade 3 (2,000 lessons)**
- Simple and compound sentences
- Subject-verb agreement
- Pronoun-antecedent agreement
- Comparative/superlative adjectives
- Coordinating conjunctions
- Commas in addresses
- Commas in dialogue
- Quotation marks
- Paragraph organization
- Introduction writing
- Conclusion writing
- Linking words (also, another, because)
- Opinion writing structure
- Informative writing structure
- Narrative writing structure

**Grade 4 (1,500 lessons)**
- Complex sentences
- Run-on sentences
- Sentence fragments
- Relative pronouns (who, which, that)
- Progressive verb tenses
- Modal auxiliaries (can, may, must)
- Prepositional phrases
- Commas with introductory elements
- Frequently confused words (to/too/two)
- Formal vs informal language
- Paragraphing
- Transitions between paragraphs
- Evidence and examples
- Paraphrasing

**Grade 5 (1,500 lessons)**
- Compound-complex sentences
- Perfect verb tenses
- Verb tense consistency
- Correlative conjunctions (either/or, neither/nor)
- Interjections
- Commas (all uses)
- Titles (italics, quotation marks)
- Varying sentence structure
- Voice (active/passive)
- Precise language
- Thesis statements
- Counterclaims
- Concluding statements
- Revision strategies

**Grade 6 (1,000 lessons)**
- Subjective/objective/possessive pronouns
- Intensive pronouns
- Sentence patterns
- Verbals (gerunds, participles, infinitives)
- Punctuation for effect
- Varying sentence patterns for meaning
- Style and tone
- Argument structure
- Claim and counterclaim
- Formal style in writing
- Cohesion and clarity
- Precise vocabulary
- Literary analysis writing
- Research writing basics

---

### CODING SKILLS BY GRADE

**Kindergarten (1,000 lessons)**
- Sequences (step by step)
- Patterns
- Giving instructions
- Following instructions
- Basic debugging (finding mistakes)
- Cause and effect

**Grade 1 (1,500 lessons)**
- Algorithms (step-by-step plans)
- Sequences in Scratch Jr
- Simple loops (repeat)
- Events (when clicked)
- Basic sprites and backgrounds
- Debugging simple programs

**Grade 2 (1,500 lessons)**
- Loops with numbers (repeat 5 times)
- Events (multiple triggers)
- Simple conditionals (if touching edge)
- Animation basics
- Sound blocks
- Creating stories in Scratch

**Grade 3 (2,000 lessons)**
- Conditionals (if/then)
- Conditionals (if/else)
- Variables introduction
- Keeping score
- User input
- Broadcast messages
- Simple games
- Debugging strategies

**Grade 4 (1,500 lessons)**
- Nested loops
- Complex conditionals
- Variables (numbers and strings)
- Operators (math, comparison)
- Random numbers
- Cloning sprites
- Game design
- Functions (custom blocks)

**Grade 5 (1,500 lessons)**
- Functions with inputs
- Return values
- Lists/arrays introduction
- String operations
- Coordinate system
- Game physics basics
- Intro to text-based coding (Python basics)
- Comments and documentation

**Grade 6 (1,000 lessons)**
- Python fundamentals
- Variables and data types
- Input and output
- Conditionals in Python
- Loops in Python (for, while)
- Functions in Python
- Lists in Python
- Basic debugging in Python
- Simple projects

---

### TYPING SKILLS BY GRADE

**Kindergarten (1,000 lessons)**
- Finding letters on keyboard
- Spacebar
- Enter key
- Letter recognition while typing
- Typing name
- Typing simple words

**Grade 1 (1,500 lessons)**
- Home row keys (asdf jkl;)
- Proper finger placement
- Typing without looking (home row only)
- Spacebar with thumbs
- Shift key introduction
- Goal: 5-10 WPM

**Grade 2 (2,000 lessons)**
- Top row keys
- Bottom row keys
- All letters practiced
- Capital letters with shift
- Basic punctuation (period, comma)
- Goal: 10-15 WPM

**Grade 3 (2,000 lessons)**
- Number row
- Common punctuation
- Typing sentences
- Accuracy focus
- Speed building
- Goal: 15-20 WPM

**Grade 4 (1,500 lessons)**
- Special characters
- Typing paragraphs
- Speed and accuracy balance
- Keyboard shortcuts (copy, paste)
- Goal: 20-25 WPM

**Grade 5 (1,000 lessons)**
- Advanced punctuation
- Typing from dictation
- Timed typing tests
- Error correction
- Goal: 25-30 WPM

**Grade 6 (1,000 lessons)**
- Professional typing
- Document formatting
- Speed refinement
- Accuracy above 95%
- Goal: 30-35 WPM

---

## RULES FOR GENERATION

### CONTENT RULES
1. NO fluff - no "Great job!" or "Let's learn!" 
2. NO emojis in teach text (only in visual data where specified)
3. Keep teach text SHORT - Tier 1 max 25 words, Tier 2 max 20 words
4. Keep voice_text SHORT - Tier 1 max 20 words, Tier 2 max 15 words
5. Make Tier 2 SIMPLER - use smaller words, more concrete examples
6. Every lesson must have 1-3 visual steps per tier
7. Duration: 3000-6000ms per step (shorter for simple, longer for complex)

### VISUAL RULES
1. Use ONLY the visual types listed above
2. Match visual type to content (fractions use fraction visual, not array)
3. Tier 2 visuals should be MORE CONCRETE than Tier 1
4. For young grades (K-2), prefer: counting_objects, array, number_line
5. For older grades (4-6), can use: equation_steps, graph, balance_scale
6. Coding always uses: code_block, variable_box, loop_animation, conditional, output
7. Typing always uses: keyboard

### GRADE-LOCKING RULES
1. Vocabulary must match grade level
2. K-1: Use only common, simple words
3. 2-3: Can introduce academic vocabulary with definitions
4. 4-6: Can use grade-appropriate academic language
5. Math complexity must match grade standards
6. Never show content above student's grade

### ID FORMAT
- Math: MATH-G{grade}-{SKILL}-{4-digit number}
- Reading: READ-G{grade}-{SKILL}-{4-digit number}
- Spelling: SPELL-G{grade}-{SKILL}-{4-digit number}
- Writing: WRITE-G{grade}-{SKILL}-{4-digit number}
- Coding: CODE-G{grade}-{SKILL}-{4-digit number}
- Typing: TYPE-G{grade}-{SKILL}-{4-digit number}

Skill codes: 3-4 letter abbreviation (MULT, ADD, DIV, FRAC, PHON, etc.)

---

## EXAMPLE OUTPUTS

### Example 1: Math - Grade 3 - Multiplication

```json
{
  "id": "MATH-G3-MULT-0042",
  "subject": "math",
  "grade": 3,
  "skill": "single digit multiplication",
  "standard": "3.OA.A.1",
  "question": "What is 7 × 8?",
  "answer": "56",
  "tier1": {
    "teach": "7 groups of 8. Skip count by 8 seven times: 8, 16, 24, 32, 40, 48, 56.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "array",
          "data": {
            "rows": 7,
            "columns": 8,
            "emoji": "🔵",
            "show_equation": true
          }
        },
        "voice_text": "7 rows of 8. Count the dots to find 56.",
        "duration": 5000
      }
    ]
  },
  "tier2": {
    "teach": "Make 7 groups. Put 8 in each group. Count them all.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "counting_objects",
          "data": {
            "groups": 7,
            "per_group": 8,
            "emoji": "⭐"
          }
        },
        "voice_text": "7 groups of 8 stars. How many stars total?",
        "duration": 5000
      },
      {
        "step": 2,
        "visual": {
          "type": "number_line",
          "data": {
            "min": 0,
            "max": 60,
            "highlight": [0, 8, 16, 24, 32, 40, 48, 56],
            "jump_from": 0,
            "jump_to": 56,
            "jump_label": "skip count by 8"
          }
        },
        "voice_text": "Jump by 8 seven times. You land on 56.",
        "duration": 5000
      }
    ]
  }
}
```

### Example 2: Reading - Grade 1 - Phonics

```json
{
  "id": "READ-G1-PHON-0156",
  "subject": "reading",
  "grade": 1,
  "skill": "consonant digraph sh",
  "standard": "RF.1.3.A",
  "question": "What sound do S and H make together?",
  "answer": "sh (as in ship)",
  "tier1": {
    "teach": "S and H together make the sh sound. Your lips push out like you're saying shh.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "phonics",
          "data": {
            "sound": "sh",
            "examples": ["ship", "shell", "fish"],
            "mouth_position": "lips out, teeth close"
          }
        },
        "voice_text": "S-H says shh. Ship. Shell. Fish.",
        "duration": 4000
      }
    ]
  },
  "tier2": {
    "teach": "Put your finger to your lips. Shh! That's the sound.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "word_building",
          "data": {
            "letters": ["sh", "i", "p"],
            "blend_points": [0, 1],
            "final_word": "ship"
          }
        },
        "voice_text": "Shh plus ip makes ship.",
        "duration": 4000
      }
    ]
  }
}
```

### Example 3: Spelling - Grade 4 - Prefix

```json
{
  "id": "SPELL-G4-PREF-0089",
  "subject": "spelling",
  "grade": 4,
  "skill": "prefix un-",
  "standard": "L.4.4.B",
  "question": "How do you spell the opposite of 'happy' using the prefix un-?",
  "answer": "unhappy",
  "tier1": {
    "teach": "Un- means not. Add un- to the front of happy. U-N-H-A-P-P-Y.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "spelling_rule",
          "data": {
            "rule": "un- means NOT or OPPOSITE",
            "correct_examples": ["unhappy", "unfair", "undo"],
            "incorrect_examples": ["unhapie"],
            "exceptions": []
          }
        },
        "voice_text": "Un means not. Unhappy means not happy.",
        "duration": 4000
      }
    ]
  },
  "tier2": {
    "teach": "Un plus happy. Keep all the letters. Just add un to the front.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "word_building",
          "data": {
            "letters": ["un", "happy"],
            "blend_points": [0],
            "final_word": "unhappy"
          }
        },
        "voice_text": "Un plus happy equals unhappy.",
        "duration": 4000
      }
    ]
  }
}
```

### Example 4: Writing - Grade 2 - Punctuation

```json
{
  "id": "WRITE-G2-PUNC-0034",
  "subject": "writing",
  "grade": 2,
  "skill": "question marks",
  "standard": "L.2.2.C",
  "question": "What punctuation goes at the end of 'Where is the dog'?",
  "answer": "?",
  "tier1": {
    "teach": "Questions need question marks. Where, what, when, why, how, and is/are/do questions all need ?",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "sentence_builder",
          "data": {
            "parts": ["Where", "is", "the", "dog"],
            "part_types": ["question word", "verb", "article", "noun"],
            "correct_order": [0, 1, 2, 3],
            "punctuation": "?"
          }
        },
        "voice_text": "This asks something. Asking sentences need question marks.",
        "duration": 4000
      }
    ]
  },
  "tier2": {
    "teach": "Are you asking something? If yes, use this: ?",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "sentence_builder",
          "data": {
            "parts": ["Where", "is", "the", "dog", "?"],
            "part_types": ["word", "word", "word", "word", "punctuation"],
            "correct_order": [0, 1, 2, 3, 4],
            "punctuation": "?"
          }
        },
        "voice_text": "Where is the dog? You're asking. Use the curly mark.",
        "duration": 4000
      }
    ]
  }
}
```

### Example 5: Coding - Grade 3 - Loops

```json
{
  "id": "CODE-G3-LOOP-0023",
  "subject": "coding",
  "grade": 3,
  "skill": "repeat loops",
  "standard": "1B-AP-10",
  "question": "How do you make the computer say 'Hello' 5 times?",
  "answer": "repeat 5 [say Hello]",
  "tier1": {
    "teach": "A loop repeats code. Repeat 5 means do it 5 times without writing it 5 times.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "loop_animation",
          "data": {
            "iterations": 5,
            "action": "say Hello",
            "emoji": "💬",
            "current_iteration": 1
          }
        },
        "voice_text": "The loop runs 5 times. Hello, Hello, Hello, Hello, Hello.",
        "duration": 5000
      },
      {
        "step": 2,
        "visual": {
          "type": "code_block",
          "data": {
            "language": "scratch",
            "code": "repeat 5\n  say [Hello]",
            "highlight_lines": [1],
            "output": "Hello\nHello\nHello\nHello\nHello"
          }
        },
        "voice_text": "Repeat 5 tells the computer to do the inside part 5 times.",
        "duration": 4000
      }
    ]
  },
  "tier2": {
    "teach": "Instead of writing Hello 5 times, tell the computer: do this 5 times.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "loop_animation",
          "data": {
            "iterations": 5,
            "action": "say Hello",
            "emoji": "🗣️",
            "current_iteration": 1
          }
        },
        "voice_text": "Count with me. 1 Hello, 2 Hello, 3 Hello, 4 Hello, 5 Hello.",
        "duration": 6000
      }
    ]
  }
}
```

### Example 6: Typing - Grade 2 - Home Row

```json
{
  "id": "TYPE-G2-HOME-0012",
  "subject": "typing",
  "grade": 2,
  "skill": "home row left hand",
  "standard": "ISTE 1c",
  "question": "Which fingers go on A, S, D, F?",
  "answer": "pinky on A, ring on S, middle on D, index on F",
  "tier1": {
    "teach": "Left hand home row: pinky-A, ring-S, middle-D, pointer-F. Feel the bump on F.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "keyboard",
          "data": {
            "highlight_keys": ["a", "s", "d", "f"],
            "finger_labels": true,
            "home_row": true,
            "target_key": "f",
            "finger_to_use": "left index"
          }
        },
        "voice_text": "Left hand finds A-S-D-F. Your pointer feels the bump on F.",
        "duration": 5000
      }
    ]
  },
  "tier2": {
    "teach": "Four fingers, four keys. Pinky starts on A. Feel the bump on F.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "keyboard",
          "data": {
            "highlight_keys": ["a", "s", "d", "f"],
            "finger_labels": true,
            "home_row": true,
            "target_key": "a",
            "finger_to_use": "left pinky"
          }
        },
        "voice_text": "Pinky on A. Ring finger on S. Middle on D. Pointer on F.",
        "duration": 6000
      }
    ]
  }
}
```

### Example 7: Math - Grade 6 - Equations

```json
{
  "id": "MATH-G6-EQTN-0284",
  "subject": "math",
  "grade": 6,
  "skill": "equations with variables on both sides",
  "standard": "6.EE.B.7",
  "question": "Solve for x: 5x - 3 = 2x + 12",
  "answer": "x = 5",
  "tier1": {
    "teach": "Get x's on one side. 5x - 2x = 3x. Then solve 3x - 3 = 12. Add 3, divide by 3.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "balance_scale",
          "data": {
            "left": "5x - 3",
            "right": "2x + 12",
            "balanced": true
          }
        },
        "voice_text": "Both sides are equal. Keep them balanced as you solve.",
        "duration": 4000
      },
      {
        "step": 2,
        "visual": {
          "type": "equation_steps",
          "data": {
            "equations": ["5x - 3 = 2x + 12", "3x - 3 = 12", "3x = 15", "x = 5"],
            "highlight_step": 1,
            "action": "subtract 2x from both sides"
          }
        },
        "voice_text": "Subtract 2x. Then add 3. Then divide by 3. X equals 5.",
        "duration": 5000
      }
    ]
  },
  "tier2": {
    "teach": "Move all x's together. You get 3x = 15. Split 15 into 3 groups. Each is 5.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "counting_objects",
          "data": {
            "groups": 3,
            "per_group": 5,
            "emoji": "📦"
          }
        },
        "voice_text": "3 boxes hold 15 total. Each box has 5. So x is 5.",
        "duration": 5000
      }
    ]
  }
}
```

---

## BATCH INSTRUCTIONS

Generate lessons in batches by subject and grade:

### Batch Order
1. Math K → Math 1 → Math 2 → ... → Math 6
2. Reading K → Reading 1 → ... → Reading 6
3. Spelling K → Spelling 1 → ... → Spelling 6
4. Writing K → Writing 1 → ... → Writing 6
5. Coding K → Coding 1 → ... → Coding 6
6. Typing K → Typing 1 → ... → Typing 6

### Per Batch
- Generate 100-500 lessons per API call
- Output as JSON array
- Validate each lesson matches schema before including
- Number IDs sequentially within each skill

### Quality Checks
1. Every lesson has both tier1 and tier2
2. Every tier has at least 1 step with visual
3. Visual type exists in the allowed list
4. Visual data matches the type's required format
5. Word count limits are respected
6. Grade-appropriate vocabulary
7. No duplicate IDs

---

## FINAL OUTPUT FORMAT

Each batch should output a JSON array:

```json
[
  { lesson 1 },
  { lesson 2 },
  { lesson 3 },
  ...
]
```

Total deliverable: 185,000 lesson JSON objects across all subjects and grades.

---

## START GENERATION

Begin with: **MATH-G0 (Kindergarten Math)** - Generate first 500 lessons covering counting, number recognition, and basic shapes.
