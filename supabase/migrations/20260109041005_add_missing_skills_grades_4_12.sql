/*
  # Add Missing Curriculum Skills for Grades 4-12
  
  This migration fills in the curriculum gaps by adding skills for:
  
  ## 1. MATH - Grades 4-12 (36 new skills)
    **Grade 4:** Multi-digit multiplication, Long division, Factors and multiples, Intro to fractions
    **Grade 5:** Adding/subtracting fractions, Multiplying fractions, Decimals operations, Order of operations
    **Grade 6:** Ratios and rates, Percents, Negative numbers, Intro to algebra
    **Grade 7:** Proportions, Algebraic expressions, One-step equations, Geometry basics
    **Grade 8:** Linear equations, Systems of equations, Pythagorean theorem, Functions intro
    **Grade 9:** Algebra I - quadratics, Factoring polynomials, Graphing linear equations, Inequalities
    **Grade 10:** Geometry proofs, Trigonometry intro, Quadratic formula, Rational expressions
    **Grade 11:** Advanced algebra, Logarithms, Sequences and series, Trig functions
    **Grade 12:** Pre-calculus, Limits intro, Complex numbers, SAT/ACT math prep
  
  ## 2. LANG - Kindergarten (3 new skills)
    **Grade K:** Capital letters, Periods and question marks, Naming words (nouns intro)
  
  ## 3. CODE - Grades 4-12 (18 new skills)
    **Grade 4:** Sequences and algorithms, Simple loops
    **Grade 5:** Nested loops, Basic debugging
    **Grade 6:** Variables and data types, User input
    **Grade 7:** Conditionals (if/else), Boolean logic
    **Grade 8:** Functions, Lists/arrays intro
    **Grade 9:** Object-oriented basics, String manipulation
    **Grade 10:** File handling, Error handling
    **Grade 11:** APIs and web basics, Data structures
    **Grade 12:** Project planning, Version control
  
  ## 4. SPELL - Grades 3-8 (12 new skills)
    **Grade 3:** Homophones, Compound words
    **Grade 4:** Greek roots, Suffixes
    **Grade 5:** Latin roots, Prefixes
    **Grade 6:** Advanced homophones, Commonly confused words
    **Grade 7:** Academic vocabulary spelling, Etymology basics
    **Grade 8:** SAT vocabulary spelling, Advanced roots and affixes
  
  ## 5. TYPE - Grades 4-8 (5 new skills)
    **Grade 4:** Number row typing
    **Grade 5:** Symbols and punctuation
    **Grade 6:** Speed building (30 WPM)
    **Grade 7:** Speed building (40 WPM)
    **Grade 8:** Speed building (50 WPM)
  
  ## Total New Skills: 74
*/

-- ========================================================================
-- MATH SKILLS - GRADES 4-12
-- ========================================================================

-- Grade 4 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'multi_digit_multiplication', 'Multi-Digit Multiplication', 'Learn to multiply numbers with two or more digits using the standard algorithm.', 4, 1, true),
  ('MATH', 'long_division', 'Long Division', 'Master the long division process to divide large numbers by single and multi-digit divisors.', 4, 2, true),
  ('MATH', 'factors_multiples', 'Factors and Multiples', 'Understand factors, multiples, prime numbers, and composite numbers.', 4, 3, true),
  ('MATH', 'intro_fractions', 'Introduction to Fractions', 'Learn to identify, compare, and work with simple fractions and mixed numbers.', 4, 4, true);

-- Grade 5 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'adding_subtracting_fractions', 'Adding and Subtracting Fractions', 'Add and subtract fractions with like and unlike denominators.', 5, 1, true),
  ('MATH', 'multiplying_fractions', 'Multiplying Fractions', 'Multiply fractions by whole numbers and other fractions.', 5, 2, true),
  ('MATH', 'decimals_operations', 'Decimal Operations', 'Perform addition, subtraction, multiplication, and division with decimals.', 5, 3, true),
  ('MATH', 'order_operations', 'Order of Operations', 'Apply PEMDAS rules to solve multi-step expressions correctly.', 5, 4, true);

-- Grade 6 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'ratios_rates', 'Ratios and Rates', 'Understand and apply ratios, rates, and unit rates in real-world problems.', 6, 1, true),
  ('MATH', 'percents', 'Percents', 'Convert between fractions, decimals, and percents, and solve percent problems.', 6, 2, true),
  ('MATH', 'negative_numbers', 'Negative Numbers', 'Work with negative numbers and understand absolute value on a number line.', 6, 3, true),
  ('MATH', 'intro_algebra', 'Introduction to Algebra', 'Solve basic algebraic equations with variables and learn to write expressions.', 6, 4, true);

-- Grade 7 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'proportions', 'Proportions', 'Solve proportional relationships and apply them to scale drawings and similar figures.', 7, 1, true),
  ('MATH', 'algebraic_expressions', 'Algebraic Expressions', 'Simplify and evaluate algebraic expressions using properties of operations.', 7, 2, true),
  ('MATH', 'one_step_equations', 'One-Step Equations', 'Solve one-step equations using addition, subtraction, multiplication, and division.', 7, 3, true),
  ('MATH', 'geometry_basics', 'Geometry Basics', 'Learn about angles, area, perimeter, circumference, and volume of basic shapes.', 7, 4, true);

-- Grade 8 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'linear_equations', 'Linear Equations', 'Solve multi-step linear equations and understand slope-intercept form.', 8, 1, true),
  ('MATH', 'systems_equations', 'Systems of Equations', 'Solve systems of linear equations using substitution and elimination methods.', 8, 2, true),
  ('MATH', 'pythagorean_theorem', 'Pythagorean Theorem', 'Apply the Pythagorean theorem to find missing sides of right triangles.', 8, 3, true),
  ('MATH', 'functions_intro', 'Introduction to Functions', 'Understand functions, function notation, and represent functions in multiple ways.', 8, 4, true);

-- Grade 9 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'quadratics', 'Quadratic Equations', 'Solve quadratic equations and graph parabolas in standard form.', 9, 1, true),
  ('MATH', 'factoring_polynomials', 'Factoring Polynomials', 'Factor polynomials including trinomials and difference of squares.', 9, 2, true),
  ('MATH', 'graphing_linear', 'Graphing Linear Equations', 'Graph linear equations and inequalities on the coordinate plane.', 9, 3, true),
  ('MATH', 'inequalities', 'Inequalities', 'Solve and graph linear inequalities and compound inequalities.', 9, 4, true);

-- Grade 10 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'geometry_proofs', 'Geometry Proofs', 'Write formal geometric proofs using postulates, theorems, and logical reasoning.', 10, 1, true),
  ('MATH', 'trig_intro', 'Introduction to Trigonometry', 'Learn basic trigonometric ratios (sine, cosine, tangent) and solve right triangles.', 10, 2, true),
  ('MATH', 'quadratic_formula', 'Quadratic Formula', 'Use the quadratic formula to solve all types of quadratic equations.', 10, 3, true),
  ('MATH', 'rational_expressions', 'Rational Expressions', 'Simplify, add, subtract, multiply, and divide rational expressions.', 10, 4, true);

-- Grade 11 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'advanced_algebra', 'Advanced Algebra', 'Master exponential and logarithmic functions and their applications.', 11, 1, true),
  ('MATH', 'logarithms', 'Logarithms', 'Understand logarithmic properties and solve logarithmic equations.', 11, 2, true),
  ('MATH', 'sequences_series', 'Sequences and Series', 'Work with arithmetic and geometric sequences and series.', 11, 3, true),
  ('MATH', 'trig_functions', 'Trigonometric Functions', 'Graph trigonometric functions and apply trig identities.', 11, 4, true);

-- Grade 12 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'precalculus', 'Pre-Calculus', 'Master advanced functions, conic sections, and polar coordinates.', 12, 1, true),
  ('MATH', 'limits_intro', 'Introduction to Limits', 'Understand the concept of limits and evaluate limits algebraically and graphically.', 12, 2, true),
  ('MATH', 'complex_numbers', 'Complex Numbers', 'Work with complex numbers and perform operations in the complex plane.', 12, 3, true),
  ('MATH', 'sat_act_math', 'SAT/ACT Math Prep', 'Review and practice key math concepts tested on standardized college entrance exams.', 12, 4, true);

-- ========================================================================
-- LANG SKILLS - KINDERGARTEN
-- ========================================================================

INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('LANG', 'capital_letters', 'Capital Letters', 'Learn when to use capital letters: at the start of sentences and for names.', 0, 1, true),
  ('LANG', 'periods_questions', 'Periods and Question Marks', 'Use periods at the end of telling sentences and question marks for asking sentences.', 0, 2, true),
  ('LANG', 'naming_words', 'Naming Words (Nouns)', 'Identify naming words for people, places, and things.', 0, 3, true);

-- ========================================================================
-- CODE SKILLS - GRADES 4-12
-- ========================================================================

-- Grade 4 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'sequences_algorithms', 'Sequences and Algorithms', 'Understand step-by-step instructions and create simple algorithms.', 4, 1, true),
  ('CODE', 'simple_loops', 'Simple Loops', 'Learn to repeat actions using basic loop structures.', 4, 2, true);

-- Grade 5 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'nested_loops', 'Nested Loops', 'Use loops inside other loops to create more complex patterns.', 5, 1, true),
  ('CODE', 'basic_debugging', 'Basic Debugging', 'Identify and fix errors in code through systematic testing.', 5, 2, true);

-- Grade 6 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'variables_data_types', 'Variables and Data Types', 'Store and work with different types of data using variables.', 6, 1, true),
  ('CODE', 'user_input', 'User Input', 'Create interactive programs that accept and process user input.', 6, 2, true);

-- Grade 7 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'conditionals', 'Conditionals (If/Else)', 'Make decisions in code using if, else if, and else statements.', 7, 1, true),
  ('CODE', 'boolean_logic', 'Boolean Logic', 'Use AND, OR, NOT operators to create complex conditions.', 7, 2, true);

-- Grade 8 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'functions', 'Functions', 'Create reusable blocks of code with parameters and return values.', 8, 1, true),
  ('CODE', 'lists_arrays', 'Lists and Arrays', 'Store and manipulate collections of data using lists and arrays.', 8, 2, true);

-- Grade 9 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'oop_basics', 'Object-Oriented Basics', 'Understand classes, objects, and basic OOP principles.', 9, 1, true),
  ('CODE', 'string_manipulation', 'String Manipulation', 'Work with text data using string methods and operations.', 9, 2, true);

-- Grade 10 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'file_handling', 'File Handling', 'Read from and write to files to persist data.', 10, 1, true),
  ('CODE', 'error_handling', 'Error Handling', 'Handle errors gracefully using try-catch blocks and exceptions.', 10, 2, true);

-- Grade 11 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'apis_web_basics', 'APIs and Web Basics', 'Interact with web APIs and understand HTTP requests and responses.', 11, 1, true),
  ('CODE', 'data_structures', 'Data Structures', 'Learn common data structures like stacks, queues, and dictionaries.', 11, 2, true);

-- Grade 12 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'project_planning', 'Project Planning', 'Plan, design, and structure larger programming projects.', 12, 1, true),
  ('CODE', 'version_control', 'Version Control', 'Use Git and version control systems to manage code collaboratively.', 12, 2, true);

-- ========================================================================
-- SPELL SKILLS - GRADES 3-8
-- ========================================================================

-- Grade 3 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'homophones', 'Homophones', 'Spell and use homophones correctly: their/there/they''re, to/too/two.', 3, 1, true),
  ('SPELL', 'compound_words', 'Compound Words', 'Spell compound words by combining two words into one.', 3, 2, true);

-- Grade 4 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'greek_roots', 'Greek Roots', 'Learn to spell words with common Greek roots like photo, graph, auto.', 4, 1, true),
  ('SPELL', 'suffixes_tion_sion', 'Suffixes (-tion, -sion)', 'Master spelling words with -tion and -sion endings.', 4, 2, true);

-- Grade 5 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'latin_roots', 'Latin Roots', 'Spell words using Latin roots like dict, port, struct.', 5, 1, true),
  ('SPELL', 'prefixes', 'Prefixes (un-, re-, pre-)', 'Add prefixes to base words and spell them correctly.', 5, 2, true);

-- Grade 6 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'advanced_homophones', 'Advanced Homophones', 'Distinguish and spell challenging homophones: complement/compliment, principal/principle.', 6, 1, true),
  ('SPELL', 'confused_words', 'Commonly Confused Words', 'Spell words that are often confused: affect/effect, accept/except.', 6, 2, true);

-- Grade 7 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'academic_vocabulary', 'Academic Vocabulary Spelling', 'Spell advanced academic vocabulary used across subjects.', 7, 1, true),
  ('SPELL', 'etymology_basics', 'Etymology Basics', 'Use word origins to understand and remember spelling patterns.', 7, 2, true);

-- Grade 8 (2 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'sat_vocabulary', 'SAT Vocabulary Spelling', 'Master spelling of high-frequency SAT vocabulary words.', 8, 1, true),
  ('SPELL', 'advanced_roots_affixes', 'Advanced Roots and Affixes', 'Apply knowledge of complex roots, prefixes, and suffixes to spell advanced words.', 8, 2, true);

-- ========================================================================
-- TYPE SKILLS - GRADES 4-8
-- ========================================================================

-- Grade 4 (1 skill)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('TYPE', 'number_row', 'Number Row Typing', 'Learn to type numbers on the top row with proper finger placement.', 4, 1, true);

-- Grade 5 (1 skill)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('TYPE', 'symbols_punctuation', 'Symbols and Punctuation', 'Type symbols and punctuation marks accurately using shift keys.', 5, 1, true);

-- Grade 6 (1 skill)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('TYPE', 'speed_30wpm', 'Speed Building (30 WPM)', 'Build typing speed and accuracy to reach 30 words per minute.', 6, 1, true);

-- Grade 7 (1 skill)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('TYPE', 'speed_40wpm', 'Speed Building (40 WPM)', 'Increase typing speed to 40 words per minute with high accuracy.', 7, 1, true);

-- Grade 8 (1 skill)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('TYPE', 'speed_50wpm', 'Speed Building (50 WPM)', 'Achieve professional typing speed of 50 words per minute.', 8, 1, true);
