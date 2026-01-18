# SchoolGenius Master Lesson Seeding Program
## COMPLETE K-7 Coverage (COPPA Compliant - Under 13)

---

## MISSION
Generate **200,000+ unique lesson entries** for K-7 education platform. Each lesson has two teaching tiers with animated visual aids and voice narration. This prompt contains EVERY skill a child learns from Kindergarten through 7th grade.

---

## OUTPUT SCHEMA

Every lesson must follow this exact JSON structure:

```json
{
  "id": "{SUBJECT}-G{GRADE}-{SKILL_CODE}-{NUMBER}",
  "subject": "math|reading|spelling|writing|coding|typing",
  "grade": 0-7,
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
| Math     | 88,000 | K: 8K, 1st: 12K, 2nd: 12K, 3rd: 14K, 4th: 12K, 5th: 11K, 6th: 10K, 7th: 9K |
| Reading  | 52,000 | K: 8K, 1st: 10K, 2nd: 10K, 3rd: 8K, 4th: 6K, 5th: 4K, 6th: 3K, 7th: 3K |
| Spelling | 26,000 | K: 2K, 1st: 4K, 2nd: 5K, 3rd: 5K, 4th: 4K, 5th: 3K, 6th: 2K, 7th: 1K |
| Writing  | 12,000 | K: 1K, 1st: 1.5K, 2nd: 1.5K, 3rd: 2K, 4th: 1.5K, 5th: 1.5K, 6th: 1K, 7th: 2K |
| Coding   | 12,000 | K: 1K, 1st: 1.5K, 2nd: 1.5K, 3rd: 2K, 4th: 1.5K, 5th: 1.5K, 6th: 1K, 7th: 2K |
| Typing   | 10,000 | K: 1K, 1st: 1.5K, 2nd: 2K, 3rd: 2K, 4th: 1.5K, 5th: 1K, 6th: 0.5K, 7th: 0.5K |

**TOTAL: 200,000 lessons**

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

# COMPLETE SKILL LISTS BY SUBJECT AND GRADE

---

## MATH - COMPLETE SKILLS (K-7)

### KINDERGARTEN MATH (8,000 lessons)

**Counting & Cardinality**
- Counting objects 1-10
- Counting objects 1-20
- Counting to 100 by ones
- Counting to 100 by tens
- Number recognition 0-20
- Writing numbers 0-20
- Understanding "zero" means none
- One-to-one correspondence (matching objects to numbers)
- Counting forward from any given number
- Understanding "how many" questions
- Comparing numbers (more, less, same)
- Ordering numbers 1-10
- Understanding last number counted tells "how many"
- Counting objects in a line
- Counting objects in an array
- Counting objects in a circle

**Operations & Algebraic Thinking**
- Addition concept introduction
- Subtraction concept introduction
- Addition within 5
- Subtraction within 5
- Addition within 10
- Subtraction within 10
- Understanding "putting together"
- Understanding "taking apart"
- Understanding "adding to"
- Understanding "taking from"
- Composing numbers 1-10 (e.g., 5 = 2 + 3)
- Decomposing numbers 1-10
- Finding number pairs that make 10
- Using fingers to add and subtract
- Using objects to add and subtract
- Using drawings to represent addition
- Using drawings to represent subtraction
- Solving simple word problems (addition)
- Solving simple word problems (subtraction)
- Understanding the plus sign (+)
- Understanding the minus sign (-)
- Understanding the equals sign (=)

**Number & Operations in Base Ten**
- Understanding numbers 11-19 as ten and ones
- Place value introduction (tens and ones)
- Bundling objects into groups of 10

**Measurement & Data**
- Comparing lengths (longer, shorter)
- Comparing heights (taller, shorter)
- Comparing weights (heavier, lighter)
- Comparing capacities (holds more, holds less)
- Sorting objects by size
- Sorting objects by color
- Sorting objects by shape
- Classifying objects into categories
- Counting objects in categories

**Geometry**
- Identifying circles
- Identifying squares
- Identifying triangles
- Identifying rectangles
- Identifying hexagons
- Identifying cubes
- Identifying spheres
- Identifying cylinders
- Identifying cones
- Naming 2D shapes
- Naming 3D shapes
- Describing shapes by attributes (sides, corners)
- Comparing shapes (same, different)
- Finding shapes in the environment
- Positional words (above, below, beside, next to, in front of, behind, inside, outside)
- Composing simple shapes to form larger shapes
- Drawing shapes

**Patterns**
- Recognizing patterns (AB, ABB, ABC)
- Extending patterns
- Creating patterns
- Describing patterns
- Copying patterns

---

### 1ST GRADE MATH (12,000 lessons)

**Operations & Algebraic Thinking**
- Addition facts within 10 (fluency)
- Subtraction facts within 10 (fluency)
- Addition within 20
- Subtraction within 20
- Adding three whole numbers
- Commutative property of addition
- Associative property of addition
- Relationship between addition and subtraction
- Finding unknown numbers in addition equations
- Finding unknown numbers in subtraction equations
- Using the equal sign correctly
- Determining if equations are true or false
- Word problems: adding to
- Word problems: taking from
- Word problems: putting together
- Word problems: taking apart
- Word problems: comparing (how many more/fewer)
- Using drawings to solve word problems
- Using equations to solve word problems
- Doubles facts (1+1, 2+2, etc.)
- Near doubles (doubles plus one)
- Making ten strategy
- Counting on strategy
- Counting back strategy
- Fact families

**Number & Operations in Base Ten**
- Counting to 120
- Reading numbers to 120
- Writing numbers to 120
- Understanding tens and ones place value
- Representing two-digit numbers with objects
- Comparing two-digit numbers using >, <, =
- Adding within 100 (two-digit + one-digit)
- Adding within 100 (two-digit + multiple of 10)
- Adding multiples of 10
- Subtracting multiples of 10
- Mental math with tens
- Understanding 10 more and 10 less

**Measurement & Data**
- Ordering objects by length
- Measuring length with non-standard units
- Comparing lengths using a third object
- Telling time to the hour
- Telling time to the half hour
- Reading analog clocks
- Understanding hour hand and minute hand
- Organizing data into categories
- Representing data with tally marks
- Representing data with charts
- Answering questions about data

**Geometry**
- Defining attributes of shapes
- Distinguishing defining vs non-defining attributes
- Composing 2D shapes
- Composing 3D shapes
- Creating composite shapes
- Partitioning circles into halves and fourths
- Partitioning rectangles into halves and fourths
- Understanding equal shares
- Vocabulary: halves, fourths, quarters

**Money**
- Identifying pennies, nickels, dimes, quarters
- Value of penny (1 cent)
- Value of nickel (5 cents)
- Value of dime (10 cents)
- Value of quarter (25 cents)

**Patterns**
- Skip counting by 2s
- Skip counting by 5s
- Skip counting by 10s
- Number patterns
- Growing patterns

---

### 2ND GRADE MATH (12,000 lessons)

**Operations & Algebraic Thinking**
- Addition facts within 20 (fluency)
- Subtraction facts within 20 (fluency)
- Solving one-step word problems (addition/subtraction)
- Solving two-step word problems
- Word problems with unknowns in all positions
- Mental strategies for addition/subtraction within 20
- Even and odd numbers
- Identifying even numbers
- Identifying odd numbers
- Adding equal groups (foundation for multiplication)
- Writing equations for equal groups
- Rectangular arrays
- Counting rows and columns in arrays
- Repeated addition

**Number & Operations in Base Ten**
- Understanding three-digit numbers
- Place value: hundreds, tens, ones
- Reading and writing numbers to 1000
- Expanded form of numbers
- Comparing three-digit numbers
- Using >, <, = with three-digit numbers
- Skip counting by 5s, 10s, 100s to 1000
- Adding within 100 (fluency)
- Adding within 1000
- Subtracting within 100 (fluency)
- Subtracting within 1000
- Adding up to four two-digit numbers
- Regrouping in addition
- Regrouping in subtraction
- Mental addition/subtraction of 10 or 100

**Measurement & Data**
- Measuring length in inches
- Measuring length in feet
- Measuring length in centimeters
- Measuring length in meters
- Choosing appropriate measurement tools
- Estimating lengths
- Adding and subtracting lengths
- Solving word problems involving length
- Number lines for measurement
- Telling time to the nearest five minutes
- Using a.m. and p.m.
- Elapsed time (simple)
- Counting money (coins and bills)
- Solving word problems involving money
- Using dollar sign and cent symbol
- Making change (introduction)
- Creating picture graphs and bar graphs
- Reading picture graphs and bar graphs
- Solving problems using graphs

**Geometry**
- Recognizing triangles, quadrilaterals, pentagons, hexagons
- Identifying faces, edges, vertices of 3D shapes
- Partitioning rectangles into rows and columns
- Counting squares in partitioned rectangles
- Partitioning circles and rectangles into equal parts
- Understanding halves, thirds, fourths

---

### 3RD GRADE MATH (14,000 lessons)

**Operations & Algebraic Thinking**
- Multiplication as equal groups
- Multiplication as arrays
- Multiplication as area
- Division as equal sharing
- Division as equal groups
- Multiplication facts 0-10 (fluency)
- Division facts 0-10 (fluency)
- Relationship between multiplication and division
- Unknown factor problems
- Multiplication word problems
- Division word problems
- Two-step word problems (all operations)
- Commutative property of multiplication
- Associative property of multiplication
- Distributive property
- Multiplying by 0 and 1
- Dividing by 1
- Division with 0
- Patterns in multiplication tables
- Arithmetic patterns

**Number & Operations in Base Ten**
- Rounding to nearest 10
- Rounding to nearest 100
- Adding within 1000 (fluency)
- Subtracting within 1000 (fluency)
- Multiplying one-digit by multiples of 10
- Multiplying one-digit by two-digit numbers

**Number & Operations - Fractions**
- Understanding fractions as parts of a whole
- Unit fractions (1/2, 1/3, 1/4, etc.)
- Fractions on a number line
- Locating fractions on number lines
- Understanding numerator and denominator
- Fractions with denominators 2, 3, 4, 6, 8
- Equivalent fractions (introduction)
- Comparing fractions with same numerator
- Comparing fractions with same denominator
- Using >, <, = with fractions
- Whole numbers as fractions (3 = 3/1)
- Fractions equal to whole numbers (4/4 = 1)

**Measurement & Data**
- Telling time to the nearest minute
- Elapsed time problems
- Measuring liquid volume (liters)
- Measuring mass (grams, kilograms)
- Word problems with mass and volume
- Drawing scaled picture graphs and bar graphs
- Measuring to nearest quarter inch and half inch
- Line plots with fractional data
- Perimeter of polygons
- Finding unknown side lengths (perimeter)
- Area concept introduction
- Area of rectangles (counting squares)
- Area of rectangles (formula: l × w)
- Area of rectilinear figures
- Relating area to multiplication and addition
- Distinguishing between area and perimeter

**Geometry**
- Understanding attributes of shapes
- Categorizing shapes by attributes
- Rhombuses, rectangles, squares as quadrilaterals
- Partitioning shapes into equal parts

---

### 4TH GRADE MATH (12,000 lessons)

**Operations & Algebraic Thinking**
- Multiplication facts through 12 (fluency)
- Division facts through 12 (fluency)
- Multi-step word problems
- Using letters for unknown quantities
- Writing equations with variables
- Multiplicative comparison word problems
- Factor pairs
- Finding all factor pairs for numbers 1-100
- Identifying prime numbers
- Identifying composite numbers
- Generating number and shape patterns

**Number & Operations in Base Ten**
- Place value to millions
- Reading and writing multi-digit numbers
- Expanded form (large numbers)
- Comparing multi-digit numbers
- Rounding multi-digit numbers
- Adding multi-digit whole numbers
- Subtracting multi-digit whole numbers
- Multiplying up to 4-digit by 1-digit
- Multiplying two 2-digit numbers
- Dividing up to 4-digit by 1-digit
- Division with remainders
- Interpreting remainders
- Estimating products and quotients
- Standard algorithm for addition/subtraction

**Number & Operations - Fractions**
- Equivalent fractions
- Generating equivalent fractions
- Simplifying fractions
- Comparing fractions (different denominators)
- Ordering fractions
- Adding fractions (same denominator)
- Subtracting fractions (same denominator)
- Adding mixed numbers (same denominator)
- Subtracting mixed numbers (same denominator)
- Decomposing fractions
- Multiplying fractions by whole numbers
- Word problems with fractions
- Converting improper fractions to mixed numbers
- Converting mixed numbers to improper fractions
- Fractions with denominators 10 and 100
- Introduction to decimals
- Decimal notation (tenths, hundredths)
- Comparing decimals
- Locating decimals on number lines

**Measurement & Data**
- Converting larger units to smaller units
- Units of length (km, m, cm, mm; mi, yd, ft, in)
- Units of mass/weight (kg, g; lb, oz)
- Units of capacity (L, mL; gal, qt, pt, c)
- Units of time (hr, min, sec)
- Word problems with unit conversions
- Area and perimeter formulas
- Line plots with fractional units
- Angles as geometric shapes
- Measuring angles with protractor
- Understanding degrees
- Angle vocabulary (acute, right, obtuse, straight)
- Finding unknown angle measures

**Geometry**
- Points, lines, line segments, rays
- Parallel lines
- Perpendicular lines
- Identifying angles in shapes
- Classifying triangles by angles
- Classifying quadrilaterals
- Lines of symmetry
- Identifying and drawing symmetric figures

---

### 5TH GRADE MATH (11,000 lessons)

**Operations & Algebraic Thinking**
- Writing numerical expressions
- Interpreting numerical expressions
- Order of operations (PEMDAS)
- Using parentheses and brackets
- Evaluating expressions with grouping symbols
- Writing expressions from word problems
- Analyzing patterns and relationships
- Graphing ordered pairs from patterns

**Number & Operations in Base Ten**
- Place value to billions
- Place value for decimals (thousandths)
- Powers of 10
- Patterns in powers of 10
- Multiplying and dividing by powers of 10
- Reading and writing decimals to thousandths
- Comparing decimals to thousandths
- Rounding decimals
- Multi-digit multiplication (fluency)
- Multi-digit division (fluency)
- Dividing with 2-digit divisors
- Adding, subtracting, multiplying, dividing decimals
- Standard algorithm for multiplication/division

**Number & Operations - Fractions**
- Adding fractions (unlike denominators)
- Subtracting fractions (unlike denominators)
- Finding common denominators
- Adding mixed numbers (unlike denominators)
- Subtracting mixed numbers (unlike denominators)
- Fraction word problems (addition/subtraction)
- Multiplying fractions by fractions
- Multiplying mixed numbers
- Area model for fraction multiplication
- Scaling with fractions
- Dividing unit fractions by whole numbers
- Dividing whole numbers by unit fractions
- Division word problems with fractions

**Measurement & Data**
- Converting units within metric system
- Converting units within customary system
- Multi-step conversion problems
- Line plots with fractional measurements
- Volume concept
- Volume as cubic units
- Volume formulas (V = l × w × h, V = B × h)
- Finding volume of composite figures
- Word problems with volume

**Geometry**
- Coordinate plane introduction
- Plotting points in first quadrant
- Understanding x-axis, y-axis, origin
- Ordered pairs (x, y)
- Graphing points from real-world problems
- Classifying 2D figures in hierarchy
- Properties of 2D figures

---

### 6TH GRADE MATH (10,000 lessons)

**Ratios & Proportional Relationships**
- Understanding ratios
- Ratio language and notation (3:4, 3 to 4, 3/4)
- Equivalent ratios
- Ratio tables
- Unit rates
- Finding and comparing unit rates
- Using ratios to solve problems
- Percent as a rate per 100
- Finding percent of a number
- Converting between fractions, decimals, percents
- Double number lines
- Tape diagrams for ratios

**The Number System**
- Dividing fractions by fractions
- Dividing mixed numbers
- Fluency with multi-digit decimal operations
- Greatest common factor (GCF)
- Least common multiple (LCM)
- Distributive property with GCF
- Positive and negative numbers
- Understanding integers
- Plotting integers on number lines
- Ordering and comparing integers
- Absolute value
- Understanding opposite numbers
- Coordinate plane with all four quadrants
- Reflecting points across axes
- Finding distances on coordinate plane

**Expressions & Equations**
- Writing algebraic expressions
- Reading algebraic expressions
- Identifying parts of expressions
- Evaluating expressions with variables
- Evaluating expressions with exponents
- Equivalent expressions
- Combining like terms
- Distributive property with variables
- Solving one-step equations (all operations)
- Writing equations from word problems
- Writing and graphing inequalities

**Geometry**
- Area of triangles
- Area of parallelograms
- Area of trapezoids
- Area of composite figures
- Polygons on coordinate plane
- Surface area of 3D figures
- Surface area using nets
- Volume of rectangular prisms (fractional edges)

**Statistics & Probability**
- Statistical questions
- Measures of center: mean, median, mode
- Measures of spread: range, interquartile range, mean absolute deviation
- Dot plots, histograms, box plots
- Describing distributions and outliers

---

### 7TH GRADE MATH (9,000 lessons)

**Ratios & Proportional Relationships**
- Unit rates with complex fractions
- Identifying proportional relationships
- Proportional relationships in tables, graphs, equations
- Constant of proportionality
- Multi-step ratio problems
- Percent increase and decrease
- Percent error
- Simple interest
- Tax, tip, commission calculations
- Markup and markdown
- Scale drawings and scale factors

**The Number System**
- Adding integers
- Subtracting integers
- Multiplying integers
- Dividing integers
- Adding rational numbers
- Subtracting rational numbers
- Multiplying rational numbers
- Dividing rational numbers
- Integer rules (positive × negative, etc.)
- Converting fractions to repeating decimals
- Absolute value in operations

**Expressions & Equations**
- Adding and subtracting linear expressions
- Factoring linear expressions
- Expanding linear expressions
- Solving two-step equations
- Solving multi-step equations
- Equations with rational coefficients
- Solving two-step inequalities
- Graphing solution sets
- Word problems with equations and inequalities

**Geometry**
- Scale drawings
- Finding and using scale factor
- Constructing triangles from measurements
- Cross-sections of 3D figures
- Angle relationships (complementary, supplementary, vertical, adjacent)
- Circumference of circles
- Area of circles
- Understanding pi
- Surface area and volume of prisms and pyramids

**Statistics & Probability**
- Random sampling
- Making inferences from samples
- Comparing two populations
- Probability (theoretical and experimental)
- Probability models
- Compound events
- Sample spaces
- Tree diagrams
- Simulations

---

## READING - COMPLETE SKILLS (K-7)

### KINDERGARTEN READING (8,000 lessons)

**Phonemic & Phonological Awareness**
- Recognizing rhyming words
- Producing rhyming words
- Identifying words with same beginning sound
- Counting syllables in spoken words
- Blending syllables into words
- Segmenting words into syllables
- Blending onset and rime (c + at = cat)
- Isolating initial sounds
- Isolating final sounds
- Isolating medial sounds
- Blending phonemes into words
- Segmenting words into phonemes
- Adding sounds to make new words
- Deleting sounds to make new words
- Substituting sounds to make new words

**Print Concepts**
- Understanding print carries meaning
- Words are separated by spaces
- Following words left to right
- Following words top to bottom
- Return sweep (going to next line)
- Identifying front and back cover
- Identifying title page
- Distinguishing letters from words
- Distinguishing words from sentences

**Letter Recognition & Formation**
- Recognizing all 26 uppercase letters
- Recognizing all 26 lowercase letters
- Naming all uppercase letters
- Naming all lowercase letters
- Matching uppercase to lowercase
- Writing all uppercase letters
- Writing all lowercase letters
- Alphabetical order

**Phonics & Word Recognition**
- Consonant sounds (all single consonants)
- Short vowel sounds (a, e, i, o, u)
- Decoding CVC words
- Word families: -at, -an, -am, -ap, -ag
- Word families: -et, -en, -ed
- Word families: -it, -in, -ig, -ip
- Word families: -ot, -op, -og
- Word families: -ut, -un, -ug, -up
- High-frequency sight words (Dolch Pre-Primer: the, a, and, I, to, is, it, in, my, you, etc.)

**Vocabulary**
- Positional words (up, down, in, out, over, under)
- Color words
- Number words (one through ten)
- Shape words
- Size words (big, small, tall, short)
- Common nouns
- Common verbs
- Common adjectives
- Using context clues with picture support
- Understanding opposites

**Reading Comprehension**
- Listening to stories read aloud
- Answering questions about key details (who, what, where, when)
- Retelling familiar stories
- Identifying characters
- Identifying setting
- Identifying major events
- Making predictions
- Making connections (text-to-self)
- Sequencing events (first, next, last)
- Cause and effect (basic)
- Real vs make-believe

**Text Types**
- Fiction (storybooks)
- Nonfiction (informational books)
- Poetry and nursery rhymes

---

### 1ST GRADE READING (10,000 lessons)

**Phonics & Word Recognition**
- Short vowel sounds (mastery)
- Long vowel sounds
- Consonant digraphs: ch, sh, th, wh, ck
- Initial consonant blends: bl, cl, fl, gl, pl, sl, br, cr, dr, fr, gr, pr, tr, sc, sk, sm, sn, sp, st, sw
- Final consonant blends: -nd, -nk, -nt, -mp, -ft, -lt
- Long vowels with silent e (CVCe): a_e, i_e, o_e, u_e
- Common vowel teams: ai, ay, ee, ea, oa, ow
- Inflectional endings: -s, -es, -ed, -ing
- Contractions: don't, isn't, can't, won't, didn't, I'm, I'll, it's
- Dolch Primer and Grade 1 sight words

**Vocabulary**
- Using sentence-level context
- Using picture clues
- Identifying root words
- Simple prefixes: un-, re-
- Simple suffixes: -er, -est, -ful, -less
- Sorting words into categories
- Synonyms and antonyms
- Multiple-meaning words
- Shades of meaning (walk, march, strut)

**Fluency**
- Reading with accuracy
- Reading with appropriate rate
- Reading with expression
- Self-correcting
- Target: 60 words per minute

**Reading Comprehension**
- Asking and answering questions about key details
- Retelling stories with key details
- Identifying central message or lesson
- Describing characters, settings, major events
- Using illustrations to understand text
- Making predictions
- Making inferences (basic)
- Identifying main idea
- Identifying supporting details
- Comparing and contrasting characters
- Understanding sequence
- Cause and effect
- Text-to-self and text-to-text connections

**Story Elements**
- Characters (major and minor)
- Setting (time and place)
- Problem and solution
- Beginning, middle, end
- Lesson or moral

**Text Features (Nonfiction)**
- Titles
- Headings
- Table of contents
- Pictures and captions
- Labels and diagrams
- Bold print
- Glossaries

---

### 2ND GRADE READING (10,000 lessons)

**Phonics & Word Recognition**
- Vowel teams: ai, ay, ea, ee, ie, oa, oe, ow, ue, ey, igh
- R-controlled vowels: ar, er, ir, or, ur
- Diphthongs: oi, oy, ou, ow, au, aw
- Silent letter combinations: kn, wr, gn, mb
- Soft c (cent, city) and soft g (gem, giant)
- Prefixes: un-, re-, pre-, dis-
- Suffixes: -ful, -less, -er, -est, -ly, -ness
- Irregularly spelled words
- Dolch Grade 2-3 sight words

**Vocabulary**
- Context clues (definitions, examples, restatements)
- Using glossaries and dictionaries
- Compound words
- Homophones (to/too/two, there/their/they're)
- Homographs
- Shades of meaning among verbs and adjectives
- Academic vocabulary

**Fluency**
- Target: 90-100 words per minute
- Accuracy, rate, expression
- Self-correction strategies

**Reading Comprehension**
- Asking and answering who, what, where, when, why, how
- Recounting stories (fables, folktales)
- Determining central message, lesson, or moral
- Character point of view
- Using text features to locate information
- Main purpose of text
- How images contribute to text
- Connections within text (comparison, cause/effect, sequence)
- Comparing two versions of same story
- Comparing two texts on same topic
- Making inferences with evidence
- Drawing conclusions
- Summarizing

**Story Elements**
- Character traits and motivation
- Plot development
- Problem and solution
- Beginning, middle, end (expanded)
- Theme (basic)

**Text Structure**
- Description
- Sequence/Chronological
- Compare and contrast
- Cause and effect
- Problem and solution

---

### 3RD GRADE READING (8,000 lessons)

**Phonics & Word Analysis**
- Multisyllabic words
- Syllable division patterns
- Prefixes: un-, re-, pre-, dis-, mis-, non-
- Suffixes: -ful, -less, -ly, -er, -est, -ness, -ment, -able, -ible
- Latin roots (introduction)
- Greek combining forms (introduction)

**Vocabulary**
- Context clues
- Literal and nonliteral phrases
- Using glossaries and dictionaries
- Real-life word connections
- Synonyms and antonyms
- Shades of meaning
- Domain-specific vocabulary
- Figurative language (introduction)

**Fluency**
- Target: 100-120 words per minute
- Accuracy, rate, expression

**Reading Comprehension**
- Asking and answering questions with text evidence
- Recounting stories and determining central message
- Describing character traits with evidence
- Distinguishing own point of view from narrator/characters
- Determining main idea
- Text structure (sequence, cause/effect)
- Using text features
- Comparing themes and topics across texts
- Making inferences with evidence
- Summarizing

**Story Elements**
- Character development
- Dynamic vs static characters (introduction)
- Setting (time, place, mood)
- Plot structure (exposition, rising action, climax, falling action, resolution)
- Conflict types (character vs character, self, nature)
- Theme identification

**Literary Elements**
- Chapters, scenes, stanzas
- How parts contribute to whole
- Prose vs poetry vs drama

**Genres**
- Fables, folktales, myths, legends
- Poetry (narrative, lyrical, humorous, free verse)
- Realistic fiction, historical fiction
- Informational text, biographies

---

### 4TH GRADE READING (6,000 lessons)

**Word Analysis**
- Multisyllabic word decoding
- All syllable types
- Greek and Latin roots: auto-, bio-, graph-, photo-, tele-, port-, dict-, scrib/script-

**Vocabulary**
- Context (definitions, examples)
- Greek and Latin affixes and roots
- Reference materials
- Similes and metaphors
- Idioms, adages, proverbs
- Synonyms and antonyms
- Academic vocabulary
- Figurative language in context

**Fluency**
- Target: 100-120+ words per minute

**Reading Comprehension**
- Referring to details and examples
- Drawing inferences with evidence
- Determining theme from details
- Summarizing
- Describing characters, settings, events in depth
- Figurative and content-specific word meanings
- Point of view differences (first vs third person)
- Connections between text and visual presentations
- Comparing treatment of themes across texts
- Comparing firsthand and secondhand accounts
- Interpreting visual, oral, quantitative information
- Evaluating author's reasoning and evidence

**Story Elements**
- Character analysis (traits, motivations, actions, changes)
- Character relationships
- Setting influence on plot/characters
- Complex plot analysis
- Theme analysis
- Point of view (first person, third person limited, omniscient)

**Literary Devices**
- Simile
- Metaphor
- Personification
- Alliteration
- Onomatopoeia
- Hyperbole
- Imagery

**Genres**
- Myths from various cultures
- Fantasy, science fiction
- Historical fiction, realistic fiction
- Mystery, drama/plays
- Poetry, informational text
- Biographies and autobiographies

---

### 5TH GRADE READING (4,000 lessons)

**Word Analysis**
- Greek and Latin roots: struct, aud, vid/vis, rupt, ject, tract, spec, form
- Advanced prefixes: anti-, de-, inter-, mid-, over-, semi-, super-, trans-
- Advanced suffixes: -tion/-sion, -ous/-ious, -ive, -ment, -ance/-ence

**Vocabulary**
- Context clues (cause/effect, comparison/contrast)
- Greek and Latin affixes and roots
- Figurative language (similes, metaphors, personification)
- Idioms, adages, proverbs
- Word relationships
- Connotations
- Academic vocabulary

**Fluency**
- Target: 120+ words per minute

**Reading Comprehension**
- Quoting accurately from text
- Making inferences
- Determining themes and summarizing
- Comparing characters, settings, events
- Figurative and connotative word meanings
- How chapters/scenes/stanzas fit together
- Narrator's point of view influence
- Visual and multimedia elements
- Comparing stories in same genre
- Evaluating author's reasoning
- Integrating information from multiple texts

**Story Elements**
- Complex character analysis
- Round vs flat characters
- Dynamic vs static characters
- Setting analysis
- Plot analysis (subplots, parallel plots)
- Theme analysis (development)
- Point of view analysis

**Literary Devices**
- All previous plus:
- Symbolism (introduction)
- Foreshadowing (introduction)
- Flashback (introduction)

---

### 6TH GRADE READING (3,000 lessons)

**Vocabulary**
- Context clues (advanced)
- Greek and Latin affixes and roots (expanded)
- Reference materials
- Connotation and denotation
- Word relationships (analogies)
- Academic and domain-specific vocabulary
- Word choice analysis

**Reading Comprehension**
- Citing textual evidence
- Making inferences
- Determining themes and central ideas
- Objective summaries
- Analyzing plot and character development
- Figurative, connotative, technical word meanings
- How sentences/chapters/scenes contribute to development
- Author's point of view development
- Comparing reading to audio/video versions
- Comparing texts across genres
- Tracing and evaluating arguments
- Distinguishing supported from unsupported claims

**Literary Analysis**
- Character development and relationships
- Setting influence
- Plot analysis (detailed)
- Conflict analysis (internal, external)
- Theme analysis (development through plot, character, setting)
- Point of view analysis (narrator reliability)
- Mood and tone analysis

**Literary Devices**
- All previous plus:
- Irony (verbal, situational, dramatic)
- Allusion
- Allegory (introduction)

---

### 7TH GRADE READING (3,000 lessons)

**Vocabulary**
- Context clues (advanced)
- Greek and Latin affixes and roots (advanced)
- Figurative language (extended metaphor, allegory)
- Connotation and denotation
- Analogies
- Nuances in word meanings
- Academic vocabulary

**Reading Comprehension**
- Citing multiple pieces of evidence
- Analyzing theme development
- Objective summaries
- Analyzing how elements interact
- Analyzing structure
- Analyzing point of view development
- Comparing written text to multimedia
- Comparing historical fiction to historical account
- Evaluating arguments and reasoning

**Literary Analysis**
- Complex character analysis (indirect characterization)
- Unreliable narrator
- Shifting perspectives
- Author's style analysis

**Literary Devices**
- All previous plus:
- Extended metaphor
- Satire (introduction)
- Paradox
- Oxymoron
- Motif
- Juxtaposition

---

## SPELLING - COMPLETE SKILLS (K-7)

### KINDERGARTEN SPELLING (2,000 lessons)

- CVC words (cat, dog, run, sit, hat)
- Short vowel sounds: short a, e, i, o, u
- Word families: -at, -an, -ap, -ad, -ag
- Word families: -et, -en, -ed, -eg
- Word families: -it, -in, -ip, -ig, -id
- Word families: -ot, -op, -og, -ob
- Word families: -ut, -un, -ug, -ub, -up
- Name spelling
- High-frequency words: the, and, a, to, is, I, it, in, my, you

---

### 1ST GRADE SPELLING (4,000 lessons)

**Short Vowel Patterns**
- Short a words (cat, bat, hat, map)
- Short e words (bed, red, pet, hen)
- Short i words (sit, bit, pig, wig)
- Short o words (hop, pot, dog, log)
- Short u words (cup, bug, sun, rug)

**Consonant Blends**
- L-blends: bl, cl, fl, gl, pl, sl (black, clip, flag, glad, plan, slip)
- R-blends: br, cr, dr, fr, gr, pr, tr (brick, crab, drum, frog, green, print, trip)
- S-blends: sc, sk, sm, sn, sp, st, sw (scat, skip, small, snap, spin, stop, swim)

**Consonant Digraphs**
- sh (ship, shape, fish, wish)
- ch (chain, cheese, much, rich)
- th (this, that, think, bath)
- wh (when, where, what, which)
- ck (duck, rock, black, stick)

**Floss Rule (ff, ll, ss, zz)**
- ff: stuff, off, cliff, sniff
- ll: bell, ball, tell, well, fill
- ss: miss, boss, less, dress
- zz: buzz, fizz, jazz, fuzz

**CVCe (Silent E)**
- a_e: cake, make, late, game, name
- i_e: like, bike, time, five, nine
- o_e: home, bone, hole, note, rose
- u_e: cute, tube, use, huge, June

**Vowel Teams (Introduction)**
- ee: see, tree, feet, sleep, green
- ea: read, eat, seat, team, beach
- ai: rain, mail, tail, paint, train
- ay: day, say, play, stay, way
- oa: boat, coat, road, soap, toast

**Contractions**
- n't: can't, don't, isn't, didn't, won't
- 'm, 'll, 's: I'm, I'll, it's, he's, she's

**Sight Words**
- Dolch Primer and Grade 1 words
- Days of the week
- Color words
- Number words (one-ten)

---

### 2ND GRADE SPELLING (5,000 lessons)

**Three-Letter Blends**
- scr: scream, scratch, screen
- spl: splash, split, splinter
- spr: spring, spray, spread
- squ: square, squash, squeeze
- str: street, strong, string
- thr: three, throw, through

**Silent Letters**
- kn: know, knee, knife, knight, knock
- wr: write, wrong, wrap, wreck, wrist
- gn: gnaw, gnat, gnome, sign
- mb: lamb, climb, comb, thumb

**R-Controlled Vowels**
- ar: car, star, farm, barn, park
- or: for, corn, born, storm, short
- er: her, fern, term, perch
- ir: bird, first, girl, shirt, third
- ur: burn, turn, hurt, curl, nurse

**Vowel Teams (Advanced)**
- ee, ea (long e): feet, read, mean
- ai, ay (long a): rain, day, stay
- oa, ow (long o): boat, snow, grow
- igh (long i): high, night, light, right
- ue, ew (long u): blue, true, new, few

**Diphthongs**
- oi: oil, coin, join, point, voice
- oy: boy, toy, joy, enjoy, royal
- ou: out, loud, cloud, round, house
- ow (as in cow): how, now, cow, down, town
- oo (long): moon, soon, food, room, school
- oo (short): book, look, cook, good, wood
- au: author, August, cause, fault
- aw: saw, draw, claw, straw, lawn

**Soft C and G**
- Soft c (/s/): cent, city, cycle, race, ice, nice
- Soft g (/j/): gem, giant, giraffe, gym, page, cage

**Contractions (Expanded)**
- 've: I've, we've, you've, they've
- 'll: I'll, we'll, you'll, he'll, she'll
- 'd: I'd, we'd, you'd, he'd, she'd
- 're: we're, you're, they're

**Homophones**
- to/too/two
- there/their/they're
- here/hear
- see/sea
- no/know
- right/write
- by/buy/bye
- one/won

**Compound Words**
- airplane, birthday, sometimes, everyone, anything, something, notebook, sidewalk

**Plurals**
- Regular: add -s (cats, dogs)
- Words ending in s, x, z, ch, sh: add -es (boxes, wishes)
- Consonant + y: change y to i, add -es (baby/babies)
- Vowel + y: add -s (toys, days)
- Words ending in f/fe: change to -ves (leaf/leaves, knife/knives)

---

### 3RD GRADE SPELLING (5,000 lessons)

**Silent Letters (Expanded)**
- mb: lamb, climb, comb, thumb, bomb, crumb
- gh (silent): night, light, right, through, thought, daughter
- bt: doubt, debt

**Trigraphs**
- tch: match, catch, watch, pitch, kitchen (after short vowel)
- dge: edge, badge, bridge, fridge, judge (after short vowel)

**Prefixes**
- un-: unhappy, unkind, unfair, unlock, unable
- re-: redo, reread, rewrite, return, replay
- pre-: prepay, preview, preheat, preschool
- dis-: disagree, dislike, disappear, disconnect
- mis-: misspell, mistake, misplace, misread

**Suffixes**
- -ed (past tense): walked, jumped, played, wanted
- -ing: walking, jumping, playing, running
- -er (comparative/one who): faster, taller, teacher
- -est (superlative): fastest, tallest, biggest
- -ly (adverb): quickly, slowly, happily, sadly
- -ful (full of): helpful, careful, hopeful, thankful
- -less (without): helpless, careless, hopeless
- -ness (state of): happiness, sadness, kindness

**Spelling Rules for Adding Suffixes**
- Doubling rule: hop→hopping, run→running, big→bigger
- Drop e rule: make→making, hope→hoping, write→writing
- Change y to i: happy→happier, carry→carried, try→tried

**Irregular Past Tense**
- go/went, see/saw, come/came, run/ran, give/gave
- take/took, make/made, write/wrote, ride/rode
- eat/ate, speak/spoke, break/broke, sing/sang

**Irregular Plurals**
- man/men, woman/women, child/children, person/people
- tooth/teeth, foot/feet, goose/geese, mouse/mice
- sheep/sheep, deer/deer, fish/fish

**Syllable Types**
- Closed syllable (cat, nap-kin)
- Open syllable (me, ba-by)
- VCe syllable (cake, com-pete)
- Vowel team syllable (rain, read-ing)
- R-controlled syllable (car, tur-tle)
- Consonant-le syllable (ta-ble, pur-ple)

**Schwa Sound**
- ago, about, sofa, around, again
- open, pencil, lemon, children

**Homophones (Advanced)**
- allowed/aloud, fair/fare, hair/hare
- break/brake, stake/steak, main/mane
- piece/peace, raise/rays, threw/through

---

### 4TH GRADE SPELLING (4,000 lessons)

**Advanced Prefixes**
- in-: incorrect, incomplete, invisible
- im-: impossible, impatient, imperfect
- ir-: irregular, irresponsible
- il-: illegal, illegible, illogical
- non-: nonfiction, nonsense, nonprofit
- over-: overflow, overcome, overnight
- under-: underground, understand, underline
- mid-: midday, midnight, midway
- sub-: submarine, subway, subtract
- super-: superman, supermarket, supernatural
- trans-: transport, transfer, transform
- inter-: interact, international, interrupt
- bi-: bicycle, biweekly, bilingual
- tri-: triangle, tricycle, triple

**Advanced Suffixes**
- -tion/-sion: action, nation, vision, decision
- -ment: government, movement, statement
- -ness: kindness, darkness, weakness
- -er/-or: teacher, writer, actor, doctor
- -ist: artist, scientist, dentist
- -able/-ible: comfortable, possible, visible
- -ous/-ious: famous, dangerous, curious
- -ive: active, creative, attractive
- -al: musical, natural, personal

**Greek Roots**
- graph (write): graph, paragraph, photograph
- phon (sound): phone, phonics, symphony
- photo (light): photograph, photosynthesis
- tele (far): telephone, television, telescope
- bio (life): biology, biography
- auto (self): automobile, automatic, autograph

**Latin Roots**
- aud (hear): audio, audience, auditorium
- dict (say): dictionary, predict, dictate
- port (carry): transport, import, export
- scrib/script (write): scribble, describe, prescription
- spect (see): inspect, respect, spectator
- struct (build): structure, construct, instruct
- rupt (break): erupt, interrupt, corrupt
- tract (pull): tractor, attract, subtract
- vis/vid (see): vision, visit, visible, video

**Spelling Rules (Advanced)**
- Adding -tion vs -sion
- The -able vs -ible rule
- Commonly misspelled words: because, believe, receive, separate, different, especially

**Compound Words (Complex)**
- Closed: earthquake, waterfall, thunderstorm
- Hyphenated: self-control, well-known
- Open: ice cream, post office, high school

**Homographs**
- wind (air) / wind (to turn)
- tear (drop) / tear (to rip)
- lead (metal) / lead (to guide)
- read (present) / read (past)

---

### 5TH GRADE SPELLING (3,000 lessons)

**Advanced Greek Roots**
- chron (time): chronic, chronological, synchronize
- geo (earth): geography, geology, geometry
- meter/metr (measure): thermometer, kilometer
- path (feeling): sympathy, empathy, pathetic
- ology/logy (study of): biology, ecology, technology
- therm (heat): thermal, thermometer, thermostat
- hydr (water): hydrant, hydrate, dehydrate
- micro (small): microscope, microphone
- cycl (circle): cycle, bicycle, recycle

**Advanced Latin Roots**
- cred (believe): credit, incredible, credentials
- form (shape): form, reform, transform, uniform
- ject (throw): reject, inject, eject, project
- fac/fect/fic (make): factory, effect, perfect, fiction
- ven/vent (come): event, invent, prevent
- vers/vert (turn): reverse, convert, universe
- voc/vok (voice): vocal, vocabulary, invoke

**Number Prefixes**
- uni- (one): unicorn, uniform, unique
- mono- (one): monopoly, monologue
- bi- (two): bicycle, biweekly
- tri- (three): triangle, trilogy
- quad- (four): quadrant, quadruple
- pent- (five): pentagon
- hex- (six): hexagon
- oct- (eight): octopus, octagon
- dec- (ten): decade, decimal
- cent- (hundred): century, centipede
- milli- (thousand): millimeter
- kilo- (thousand): kilogram, kilometer

**Other Advanced Prefixes**
- anti- (against): antibiotic, antisocial
- bene- (good): benefit, beneficial
- circum- (around): circumference
- co-/com-/con- (together): cooperate, combine, connect
- de- (down): decrease, descend
- ex- (out): exit, export, exhale
- fore- (before): forecast, foresee
- post- (after): postpone, postwar
- pro- (forward): progress, promote

**Advanced Suffixes**
- -ance/-ence: importance, independence
- -ion/-ation/-ition: celebration, competition
- -ship: friendship, leadership
- -dom: freedom, kingdom, wisdom
- -ant/-ent: important, different
- -ic/-ical: historic, historical
- -ize: organize, realize, memorize
- -ify: simplify, identify, clarify
- -ate: educate, activate, celebrate
- -en: strengthen, frighten, brighten

**Derivational Relationships**
- define → definition → definitive
- create → creation → creative → creativity
- act → action → active → activity

**Spelling Demons**
- accommodate, acknowledgment, amateur, apparent
- beginning, believe, calendar, category
- definitely, desperate, discipline, embarrass
- environment, equipment, exaggerate, exceed
- familiar, February, foreign, gauge
- government, grammar, guarantee, height
- immediately, independent, intelligence, judgment

---

### 6TH GRADE SPELLING (2,000 lessons)

**Assimilated Prefixes**
- ad- changes: ac- (accept), af- (affect), ag- (aggressive), al- (allot), an- (announce), ap- (appear), ar- (arrive), as- (assist), at- (attend)
- in- changes: il- (illegal), im- (impossible), ir- (irregular)
- com- changes: col- (collect), cor- (correct), con- (connect)
- sub- changes: suc- (succeed), suf- (suffer), sug- (suggest), sup- (support)

**Advanced Latin Roots**
- aqu (water): aquarium, aquatic
- cap/capt/cept (take): capture, capable, accept
- ced/cess (go): proceed, exceed, access
- cogn (know): recognize, cognition
- corp (body): corpse, corporation
- domin (master): dominate, dominant
- equi (equal): equal, equivalent, equator
- fer (carry): transfer, refer, conference
- grat (pleasing): grateful, gratitude
- jud (judge): judge, judicial, prejudice
- leg (law): legal, legislate, legend
- man/manu (hand): manual, manufacture
- mor/mort (death): mortal, immortal
- nov (new): novel, novice, innovate
- ped (foot): pedal, pedestrian
- prim (first): primary, primitive
- sequ/secut (follow): sequence, consequence
- sign (mark): signal, signature, significant
- sol (alone): solo, solitary, solitude
- spir (breathe): inspire, expire, spirit
- sta/stat (stand): stable, station, statue
- tang/tact (touch): tangible, contact
- temp (time): temporary, tempo
- ten/tain (hold): contain, retain, maintain
- terr (land): territory, terrain
- val (worth): value, valid, evaluate
- ver (truth): verify, verdict
- vit/viv (life): vital, vivid, survive
- vol (will): volunteer, voluntary

**Advanced Greek Roots**
- anthrop (human): anthropology
- arch (ruler): monarch, anarchy
- ast/aster (star): asteroid, astronaut
- bibl (book): Bible, bibliography
- cardi (heart): cardiac, cardiologist
- crat/cracy (rule): democracy, aristocrat
- dem (people): democracy, epidemic
- derm (skin): dermatology, epidermis
- gram (written): telegram, diagram
- hetero (different): heterogeneous
- homo (same): homophone, homogeneous
- hyper (over): hyperactive, hyperbole
- hypo (under): hypothermia, hypothesis
- morph (form): metamorphosis
- neur (nerve): neurology, neural
- nom/nym (name): synonym, antonym
- opt (eye): optical, optician
- pan (all): panorama, pandemic
- phil (love): philosophy, philanthropist
- phob (fear): phobia, claustrophobia
- psych (mind): psychology, psychic
- soph (wise): philosophy, sophisticated
- syn/sym (together): synonym, symphony
- techn (art): technology, technique
- zo (animal): zoo, zoology

---

### 7TH GRADE SPELLING (1,000 lessons)

**Advanced Patterns**
- Silent letter combinations: knight, pneumonia, psychology
- Greek letter combinations: ph, ch, ps
- Latin endings: -tion, -sion, -cian
- Absorbed prefixes: irregular, immobile, collect
- Double letter rules: occurrence, committee

**Academic Vocabulary**
- Science: hypothesis, experiment, molecule, chromosome, photosynthesis
- Math: coefficient, variable, equation, polynomial
- Social Studies: democracy, civilization, revolution, constitution
- ELA: protagonist, metaphor, inference, allegory

**Commonly Confused Words**
- affect/effect
- accept/except
- than/then
- principal/principle
- stationary/stationery
- complement/compliment
- who's/whose

**SAT Prep Words**
- aberration, acquiesce, aesthetic, amalgamate
- ameliorate, anachronism, benevolent, cacophony
- capitulate, circumlocution, conundrum, denigrate
- ebullient, ephemeral, equanimity, fastidious
- garrulous, hackneyed, iconoclast, juxtaposition

---

## WRITING - COMPLETE SKILLS (K-7)

### KINDERGARTEN WRITING (1,000 lessons)
- Writing letters (uppercase)
- Writing letters (lowercase)
- Writing name
- Writing simple sentences
- Using spaces between words
- Capitalization (first word, I)
- Ending punctuation (period)
- Drawing to express ideas

### 1ST GRADE WRITING (1,500 lessons)
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

### 2ND GRADE WRITING (1,500 lessons)
- Sentence types (statement, question, exclamation, command)
- Compound sentences (and, but, or)
- Collective nouns
- Irregular plural nouns
- Past tense verbs (regular and irregular)
- Adverbs
- Apostrophes (contractions, possessives)
- Commas in greetings/closings
- Paragraph structure
- Topic sentences
- Supporting details

### 3RD GRADE WRITING (2,000 lessons)
- Simple and compound sentences
- Subject-verb agreement
- Pronoun-antecedent agreement
- Comparative/superlative adjectives
- Coordinating conjunctions
- Commas in addresses and dialogue
- Quotation marks
- Paragraph organization
- Introduction and conclusion writing
- Linking words
- Opinion, informative, and narrative structure

### 4TH GRADE WRITING (1,500 lessons)
- Complex sentences
- Run-on sentences and fragments
- Relative pronouns (who, which, that)
- Progressive verb tenses
- Modal auxiliaries (can, may, must)
- Prepositional phrases
- Commas with introductory elements
- Frequently confused words
- Formal vs informal language
- Transitions between paragraphs
- Evidence and examples
- Paraphrasing

### 5TH GRADE WRITING (1,500 lessons)
- Compound-complex sentences
- Perfect verb tenses
- Verb tense consistency
- Correlative conjunctions (either/or, neither/nor)
- Interjections
- All comma uses
- Titles (italics, quotation marks)
- Varying sentence structure
- Active/passive voice
- Precise language
- Thesis statements
- Counterclaims
- Revision strategies

### 6TH GRADE WRITING (1,000 lessons)
- Subjective/objective/possessive pronouns
- Intensive pronouns
- Sentence patterns
- Verbals (gerunds, participles, infinitives)
- Punctuation for effect
- Style and tone
- Argument structure
- Claim and counterclaim
- Formal style
- Literary analysis writing
- Research writing basics

### 7TH GRADE WRITING (2,000 lessons)
- Simple, compound, complex, compound-complex sentences
- Misplaced and dangling modifiers
- Parallel structure
- Active vs passive voice (choosing for effect)
- Verb mood (indicative, imperative, interrogative)
- Conditional sentences
- Semicolon, colon, dash usage
- Varying sentence length for effect
- Thesis statement writing
- Topic sentences
- Supporting evidence
- Commentary/analysis
- Counterargument and rebuttal
- Argumentative essay structure
- MLA format introduction

---

## CODING - COMPLETE SKILLS (K-7)

### KINDERGARTEN CODING (1,000 lessons)
- Sequences (step by step)
- Patterns
- Giving instructions
- Following instructions
- Basic debugging (finding mistakes)
- Cause and effect

### 1ST GRADE CODING (1,500 lessons)
- Algorithms (step-by-step plans)
- Sequences in Scratch Jr
- Simple loops (repeat)
- Events (when clicked)
- Basic sprites and backgrounds
- Debugging simple programs

### 2ND GRADE CODING (1,500 lessons)
- Loops with numbers (repeat 5 times)
- Events (multiple triggers)
- Simple conditionals (if touching edge)
- Animation basics
- Sound blocks
- Creating stories in Scratch

### 3RD GRADE CODING (2,000 lessons)
- Conditionals (if/then, if/else)
- Variables introduction
- Keeping score
- User input
- Broadcast messages
- Simple games
- Debugging strategies

### 4TH GRADE CODING (1,500 lessons)
- Nested loops
- Complex conditionals
- Variables (numbers and strings)
- Operators (math, comparison)
- Random numbers
- Cloning sprites
- Game design
- Functions (custom blocks)

### 5TH GRADE CODING (1,500 lessons)
- Functions with inputs
- Return values
- Lists/arrays introduction
- String operations
- Coordinate system
- Game physics basics
- Intro to Python basics
- Comments and documentation

### 6TH GRADE CODING (1,000 lessons)
- Python fundamentals
- Variables and data types
- Input and output
- Conditionals in Python
- Loops in Python (for, while)
- Functions in Python
- Lists in Python
- Basic debugging in Python

### 7TH GRADE CODING (2,000 lessons)
- Variables and data types (int, float, str, bool)
- Type conversion
- String operations and methods
- f-strings and formatting
- if/elif/else chains
- Nested conditionals
- Logical operators (and, or, not)
- for and while loops
- Nested loops
- break and continue
- Defining functions
- Parameters and return values
- Variable scope
- Lists (creating, modifying, methods)
- List slicing and comprehensions
- Tuples and dictionaries
- Problem solving and algorithm design
- Debugging and testing

---

## TYPING - COMPLETE SKILLS (K-7)

### KINDERGARTEN TYPING (1,000 lessons)
- Finding letters on keyboard
- Spacebar
- Enter key
- Letter recognition while typing
- Typing name
- Typing simple words

### 1ST GRADE TYPING (1,500 lessons)
- Home row keys (asdf jkl;)
- Proper finger placement
- Typing without looking (home row only)
- Spacebar with thumbs
- Shift key introduction
- Goal: 5-10 WPM

### 2ND GRADE TYPING (2,000 lessons)
- Top row keys
- Bottom row keys
- All letters practiced
- Capital letters with shift
- Basic punctuation (period, comma)
- Goal: 10-15 WPM

### 3RD GRADE TYPING (2,000 lessons)
- Number row
- Common punctuation
- Typing sentences
- Accuracy focus
- Speed building
- Goal: 15-20 WPM

### 4TH GRADE TYPING (1,500 lessons)
- Special characters
- Typing paragraphs
- Speed and accuracy balance
- Keyboard shortcuts (copy, paste)
- Goal: 20-25 WPM

### 5TH GRADE TYPING (1,000 lessons)
- Advanced punctuation
- Typing from dictation
- Timed typing tests
- Error correction
- Goal: 25-30 WPM

### 6TH GRADE TYPING (500 lessons)
- Professional typing
- Document formatting
- Speed refinement
- Accuracy above 95%
- Goal: 30-35 WPM

### 7TH GRADE TYPING (500 lessons)
- Goal: 35-40 WPM
- 95%+ accuracy target
- Number row fluency
- Symbol typing
- Keyboard shortcuts (Ctrl+C, V, Z, S, A)
- Typing paragraphs from dictation
- Essay typing stamina

---

## RULES FOR GENERATION

### CONTENT RULES
1. NO fluff - no "Great job!" or "Let's learn!"
2. NO emojis in teach text (only in visual data where specified)
3. Keep teach text SHORT - Tier 1 max 25 words, Tier 2 max 20 words
4. Keep voice_text SHORT - Tier 1 max 20 words, Tier 2 max 15 words
5. Make Tier 2 SIMPLER - use smaller words, more concrete examples
6. Every lesson must have 1-3 visual steps per tier
7. Duration: 3000-6000ms per step

### VISUAL RULES
1. Use ONLY the visual types listed above
2. Match visual type to content
3. Tier 2 visuals should be MORE CONCRETE than Tier 1
4. For young grades (K-2), prefer: counting_objects, array, number_line
5. For older grades (4-7), can use: equation_steps, graph, balance_scale
6. Coding always uses: code_block, variable_box, loop_animation, conditional, output
7. Typing always uses: keyboard

### GRADE-LOCKING RULES
1. Vocabulary must match grade level
2. K-1: Use only common, simple words
3. 2-3: Can introduce academic vocabulary with definitions
4. 4-7: Can use grade-appropriate academic language
5. Math complexity must match grade standards
6. Never show content above student's grade

### ID FORMAT
- Math: MATH-G{grade}-{SKILL}-{4-digit number}
- Reading: READ-G{grade}-{SKILL}-{4-digit number}
- Spelling: SPELL-G{grade}-{SKILL}-{4-digit number}
- Writing: WRITE-G{grade}-{SKILL}-{4-digit number}
- Coding: CODE-G{grade}-{SKILL}-{4-digit number}
- Typing: TYPE-G{grade}-{SKILL}-{4-digit number}

---

## BATCH INSTRUCTIONS

Generate lessons in batches by subject and grade:

### Batch Order
1. Math K → Math 1 → Math 2 → ... → Math 7
2. Reading K → Reading 1 → ... → Reading 7
3. Spelling K → Spelling 1 → ... → Spelling 7
4. Writing K → Writing 1 → ... → Writing 7
5. Coding K → Coding 1 → ... → Coding 7
6. Typing K → Typing 1 → ... → Typing 7

### Per Batch
- Generate 100-500 lessons per API call
- Output as JSON array
- Validate each lesson matches schema
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

## COST ESTIMATE

200,000 lessons × ~100 tokens per lesson = ~20 million output tokens

**Sonnet: ~$300**
**Haiku: ~$25**
**Grok: TBD (likely cheaper)**

---

## START GENERATION

Begin with: **MATH-G0 (Kindergarten Math)** - Generate first 500 lessons covering counting, number recognition, and basic shapes.
