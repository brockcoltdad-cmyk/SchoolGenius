/*
  # Add 114 Missing Curriculum Skills

  This migration adds comprehensive skills to reach 160 total skills in the database.

  ## Skills Being Added (114 total):
  
  ### 1. MATH - Grades 4-12 (54 skills - 6 per grade)
    - Grade 4: Multi-digit operations, fractions, geometry, word problems, measurement, data
    - Grade 5: Advanced fractions, decimals, volume, coordinate plane, patterns, statistics
    - Grade 6: Ratios, percents, integers, expressions, equations, data analysis
    - Grade 7: Proportions, algebra, geometry, statistics, probability, scientific notation
    - Grade 8: Linear equations, functions, transformations, Pythagorean theorem, exponents, data modeling
    - Grade 9: Quadratics, polynomials, radicals, systems, graphing, exponential functions
    - Grade 10: Geometry proofs, trigonometry, circles, probability, statistics, transformations
    - Grade 11: Advanced functions, logarithms, sequences, matrices, conic sections, limits
    - Grade 12: Calculus basics, derivatives, integrals, vectors, parametric equations, series
  
  ### 2. LANG - Grade K (3 skills)
    - Capital letters, punctuation basics, noun identification
  
  ### 3. CODE - Grades 4-12 (36 skills - 4 per grade)
    - Comprehensive computer science curriculum from algorithms to advanced topics
  
  ### 4. SPELL - Grades 3-8 (18 skills - 3 per grade)
    - Progressive spelling from basic patterns to advanced vocabulary
  
  ### 5. TYPE - Grades 4-8 (5 skills - 1 per grade)
    - Typing progression from numbers to 50+ WPM

  ## Security:
    - RLS policies already exist on curriculum_skills table
    - Using IF NOT EXISTS to prevent duplicate entries
*/

-- ========================================================================
-- MATH SKILLS - GRADES 4-12 (54 skills total, 6 per grade)
-- ========================================================================

-- Grade 4 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'multi_digit_multiplication', 'Multi-Digit Multiplication', 'Multiply 2-digit and 3-digit numbers using the standard algorithm.', 4, 101, true),
  ('MATH', 'long_division', 'Long Division', 'Divide multi-digit numbers by 1-digit and 2-digit divisors.', 4, 102, true),
  ('MATH', 'factors_multiples_g4', 'Factors and Multiples', 'Find factors, multiples, GCF, and LCM of numbers.', 4, 103, true),
  ('MATH', 'fraction_equivalents', 'Equivalent Fractions', 'Generate and identify equivalent fractions using multiplication and division.', 4, 104, true),
  ('MATH', 'area_perimeter_g4', 'Area and Perimeter', 'Calculate area and perimeter of rectangles and composite shapes.', 4, 105, true),
  ('MATH', 'word_problems_g4', 'Multi-Step Word Problems', 'Solve word problems involving all four operations.', 4, 106, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 5 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'add_subtract_fractions', 'Adding and Subtracting Fractions', 'Add and subtract fractions with unlike denominators.', 5, 201, true),
  ('MATH', 'multiply_fractions_g5', 'Multiplying Fractions', 'Multiply fractions by fractions and mixed numbers.', 5, 202, true),
  ('MATH', 'divide_fractions', 'Dividing Fractions', 'Divide fractions using the reciprocal method.', 5, 203, true),
  ('MATH', 'decimal_operations', 'Decimal Operations', 'Add, subtract, multiply, and divide decimals to hundredths.', 5, 204, true),
  ('MATH', 'volume_g5', 'Volume of Rectangular Prisms', 'Calculate volume using length × width × height formula.', 5, 205, true),
  ('MATH', 'coordinate_plane_g5', 'Coordinate Plane', 'Plot and identify points on a coordinate grid.', 5, 206, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 6 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'ratios_rates_g6', 'Ratios and Rates', 'Understand ratios, rates, and unit rates in real-world contexts.', 6, 301, true),
  ('MATH', 'percents_g6', 'Percents', 'Find percent of a number and solve percent problems.', 6, 302, true),
  ('MATH', 'integers_operations', 'Integer Operations', 'Add, subtract, multiply, and divide positive and negative integers.', 6, 303, true),
  ('MATH', 'algebraic_expressions_g6', 'Algebraic Expressions', 'Write, read, and evaluate expressions with variables.', 6, 304, true),
  ('MATH', 'equations_inequalities_g6', 'Equations and Inequalities', 'Solve one-step equations and inequalities.', 6, 305, true),
  ('MATH', 'statistical_measures', 'Statistical Measures', 'Calculate mean, median, mode, and range of data sets.', 6, 306, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 7 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'proportions_g7', 'Proportions', 'Solve proportional relationships and scale factor problems.', 7, 401, true),
  ('MATH', 'algebraic_expressions_g7', 'Simplifying Expressions', 'Simplify expressions using distributive property and combining like terms.', 7, 402, true),
  ('MATH', 'two_step_equations', 'Two-Step Equations', 'Solve equations requiring two operations.', 7, 403, true),
  ('MATH', 'angles_triangles', 'Angles and Triangles', 'Work with angle relationships and triangle properties.', 7, 404, true),
  ('MATH', 'probability_g7', 'Probability', 'Calculate theoretical and experimental probability.', 7, 405, true),
  ('MATH', 'scientific_notation_g7', 'Scientific Notation', 'Convert numbers to and from scientific notation.', 7, 406, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 8 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'linear_equations_g8', 'Linear Equations', 'Solve multi-step linear equations with variables on both sides.', 8, 501, true),
  ('MATH', 'slope_intercept_form', 'Slope-Intercept Form', 'Graph linear equations using y = mx + b form.', 8, 502, true),
  ('MATH', 'systems_of_equations', 'Systems of Equations', 'Solve systems using substitution and elimination.', 8, 503, true),
  ('MATH', 'pythagorean_theorem_g8', 'Pythagorean Theorem', 'Apply the Pythagorean theorem to solve problems.', 8, 504, true),
  ('MATH', 'exponents_powers', 'Exponents and Powers', 'Work with integer exponents and exponential expressions.', 8, 505, true),
  ('MATH', 'functions_g8', 'Functions', 'Understand function notation and represent functions multiple ways.', 8, 506, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 9 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'quadratic_equations_g9', 'Quadratic Equations', 'Solve quadratic equations by factoring, completing the square, and using the formula.', 9, 601, true),
  ('MATH', 'polynomials_g9', 'Polynomials', 'Add, subtract, multiply, and factor polynomials.', 9, 602, true),
  ('MATH', 'radical_expressions', 'Radical Expressions', 'Simplify radicals and solve radical equations.', 9, 603, true),
  ('MATH', 'system_equations_g9', 'Systems of Equations', 'Solve linear systems graphically and algebraically.', 9, 604, true),
  ('MATH', 'graphing_functions', 'Graphing Functions', 'Graph linear, quadratic, and absolute value functions.', 9, 605, true),
  ('MATH', 'exponential_functions_g9', 'Exponential Functions', 'Understand exponential growth and decay.', 9, 606, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 10 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'geometry_proofs_g10', 'Geometric Proofs', 'Write formal two-column and paragraph proofs.', 10, 701, true),
  ('MATH', 'trigonometry_g10', 'Trigonometry', 'Use sine, cosine, and tangent ratios to solve right triangles.', 10, 702, true),
  ('MATH', 'circles_g10', 'Circles', 'Work with circle theorems, arcs, sectors, and tangent lines.', 10, 703, true),
  ('MATH', 'probability_statistics_g10', 'Probability and Statistics', 'Calculate combinations, permutations, and analyze data distributions.', 10, 704, true),
  ('MATH', 'transformations_g10', 'Transformations', 'Perform rotations, reflections, translations, and dilations.', 10, 705, true),
  ('MATH', 'rational_expressions_g10', 'Rational Expressions', 'Simplify and perform operations with rational expressions.', 10, 706, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 11 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'advanced_functions', 'Advanced Functions', 'Analyze polynomial, rational, and radical functions.', 11, 801, true),
  ('MATH', 'logarithms_g11', 'Logarithms', 'Solve logarithmic and exponential equations.', 11, 802, true),
  ('MATH', 'sequences_series_g11', 'Sequences and Series', 'Work with arithmetic and geometric sequences and series.', 11, 803, true),
  ('MATH', 'matrices', 'Matrices', 'Perform matrix operations and solve systems using matrices.', 11, 804, true),
  ('MATH', 'conic_sections', 'Conic Sections', 'Graph and analyze parabolas, circles, ellipses, and hyperbolas.', 11, 805, true),
  ('MATH', 'limits_intro_g11', 'Introduction to Limits', 'Understand limits and evaluate them graphically and numerically.', 11, 806, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 12 (6 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('MATH', 'derivatives_intro', 'Introduction to Derivatives', 'Calculate derivatives using power rule and product rule.', 12, 901, true),
  ('MATH', 'applications_derivatives', 'Applications of Derivatives', 'Use derivatives to find rates of change and optimize functions.', 12, 902, true),
  ('MATH', 'integrals_intro', 'Introduction to Integrals', 'Calculate definite and indefinite integrals.', 12, 903, true),
  ('MATH', 'vectors_g12', 'Vectors', 'Perform vector operations and understand vector applications.', 12, 904, true),
  ('MATH', 'parametric_equations', 'Parametric Equations', 'Work with parametric equations and polar coordinates.', 12, 905, true),
  ('MATH', 'series_convergence', 'Series and Convergence', 'Determine convergence of infinite series.', 12, 906, true)
ON CONFLICT (skill_code) DO NOTHING;

-- ========================================================================
-- LANG SKILLS - KINDERGARTEN (3 skills)
-- ========================================================================

INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('LANG', 'capital_letters_k', 'Capital Letters', 'Use capital letters at the beginning of sentences and for names.', 0, 1001, true),
  ('LANG', 'end_punctuation', 'End Punctuation', 'Use periods for statements and question marks for questions.', 0, 1002, true),
  ('LANG', 'nouns_intro', 'Nouns (Naming Words)', 'Identify nouns as words that name people, places, and things.', 0, 1003, true)
ON CONFLICT (skill_code) DO NOTHING;

-- ========================================================================
-- CODE SKILLS - GRADES 4-12 (36 skills total, 4 per grade)
-- ========================================================================

-- Grade 4 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'sequences_g4', 'Sequences and Algorithms', 'Create step-by-step instructions to solve problems.', 4, 2001, true),
  ('CODE', 'loops_intro', 'Introduction to Loops', 'Use repeat blocks to execute code multiple times.', 4, 2002, true),
  ('CODE', 'events_g4', 'Events', 'Trigger actions based on user interactions like clicks.', 4, 2003, true),
  ('CODE', 'debugging_basics', 'Debugging Basics', 'Find and fix errors in code systematically.', 4, 2004, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 5 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'nested_loops_g5', 'Nested Loops', 'Use loops inside other loops for complex patterns.', 5, 2101, true),
  ('CODE', 'conditionals_intro', 'Introduction to Conditionals', 'Make decisions in code using if statements.', 5, 2102, true),
  ('CODE', 'variables_intro', 'Variables', 'Store and update values using variables.', 5, 2103, true),
  ('CODE', 'functions_intro', 'Introduction to Functions', 'Create reusable blocks of code.', 5, 2104, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 6 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'data_types', 'Data Types', 'Work with numbers, strings, and booleans.', 6, 2201, true),
  ('CODE', 'user_input_g6', 'User Input', 'Accept and process input from users.', 6, 2202, true),
  ('CODE', 'lists_intro', 'Introduction to Lists', 'Store multiple values in a single list.', 6, 2203, true),
  ('CODE', 'string_operations', 'String Operations', 'Manipulate text using string methods.', 6, 2204, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 7 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'if_else_statements', 'If-Else Statements', 'Create branching logic with multiple conditions.', 7, 2301, true),
  ('CODE', 'boolean_logic_g7', 'Boolean Logic', 'Use AND, OR, NOT operators in conditions.', 7, 2302, true),
  ('CODE', 'while_loops', 'While Loops', 'Create loops that run until a condition is false.', 7, 2303, true),
  ('CODE', 'for_loops', 'For Loops', 'Iterate over sequences using for loops.', 7, 2304, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 8 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'functions_parameters', 'Functions with Parameters', 'Pass data into functions using parameters.', 8, 2401, true),
  ('CODE', 'return_values', 'Return Values', 'Return results from functions.', 8, 2402, true),
  ('CODE', 'lists_methods', 'List Methods', 'Use methods to add, remove, and modify list items.', 8, 2403, true),
  ('CODE', 'dictionaries_intro', 'Introduction to Dictionaries', 'Store key-value pairs using dictionaries.', 8, 2404, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 9 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'classes_objects', 'Classes and Objects', 'Create classes and instantiate objects.', 9, 2501, true),
  ('CODE', 'methods_properties', 'Methods and Properties', 'Define object methods and properties.', 9, 2502, true),
  ('CODE', 'string_manipulation_g9', 'String Manipulation', 'Advanced text processing and formatting.', 9, 2503, true),
  ('CODE', 'list_comprehensions', 'List Comprehensions', 'Create lists using compact comprehension syntax.', 9, 2504, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 10 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'file_reading', 'File Reading', 'Read data from text and CSV files.', 10, 2601, true),
  ('CODE', 'file_writing', 'File Writing', 'Write and save data to files.', 10, 2602, true),
  ('CODE', 'error_handling_g10', 'Error Handling', 'Handle exceptions using try-except blocks.', 10, 2603, true),
  ('CODE', 'modules_imports', 'Modules and Imports', 'Organize code using modules and import statements.', 10, 2604, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 11 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'api_requests', 'API Requests', 'Make HTTP requests to web APIs.', 11, 2701, true),
  ('CODE', 'json_parsing', 'JSON Parsing', 'Parse and work with JSON data.', 11, 2702, true),
  ('CODE', 'data_structures_g11', 'Data Structures', 'Implement stacks, queues, and linked lists.', 11, 2703, true),
  ('CODE', 'recursion', 'Recursion', 'Write recursive functions to solve problems.', 11, 2704, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 12 (4 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('CODE', 'git_basics', 'Git Basics', 'Use Git for version control: commit, push, pull.', 12, 2801, true),
  ('CODE', 'github_collaboration', 'GitHub Collaboration', 'Collaborate on projects using GitHub.', 12, 2802, true),
  ('CODE', 'project_structure', 'Project Structure', 'Organize large projects with proper file structure.', 12, 2803, true),
  ('CODE', 'testing_intro', 'Introduction to Testing', 'Write unit tests to verify code functionality.', 12, 2804, true)
ON CONFLICT (skill_code) DO NOTHING;

-- ========================================================================
-- SPELL SKILLS - GRADES 3-8 (18 skills total, 3 per grade)
-- ========================================================================

-- Grade 3 (3 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'homophones_g3', 'Homophones', 'Spell common homophones: to/too/two, their/there/they''re.', 3, 3001, true),
  ('SPELL', 'compound_words_g3', 'Compound Words', 'Combine two words to form compound words.', 3, 3002, true),
  ('SPELL', 'plurals_rules', 'Plural Rules', 'Add -s, -es, and change -y to -ies for plurals.', 3, 3003, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 4 (3 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'greek_roots_g4', 'Greek Roots', 'Spell words with Greek roots: photo, graph, tele, auto.', 4, 3101, true),
  ('SPELL', 'suffixes_tion_sion_g4', 'Suffixes (-tion, -sion)', 'Add and spell -tion and -sion endings correctly.', 4, 3102, true),
  ('SPELL', 'consonant_doubling', 'Consonant Doubling', 'Apply the doubling rule when adding suffixes.', 4, 3103, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 5 (3 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'latin_roots_g5', 'Latin Roots', 'Spell words with Latin roots: dict, port, struct, ject.', 5, 3201, true),
  ('SPELL', 'prefixes_g5', 'Prefixes', 'Add prefixes: un-, re-, pre-, dis-, mis-.', 5, 3202, true),
  ('SPELL', 'silent_letters', 'Silent Letters', 'Spell words with silent letters: knight, answer, wrist.', 5, 3203, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 6 (3 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'advanced_homophones_g6', 'Advanced Homophones', 'Spell challenging homophones: principal/principle, complement/compliment.', 6, 3301, true),
  ('SPELL', 'confused_words_g6', 'Commonly Confused Words', 'Distinguish affect/effect, accept/except, stationary/stationery.', 6, 3302, true),
  ('SPELL', 'ie_ei_rule', 'I Before E Rule', 'Apply the "i before e except after c" rule and exceptions.', 6, 3303, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 7 (3 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'academic_vocabulary_g7', 'Academic Vocabulary', 'Spell content-area vocabulary across subjects.', 7, 3401, true),
  ('SPELL', 'etymology_g7', 'Etymology', 'Use word origins to understand spelling patterns.', 7, 3402, true),
  ('SPELL', 'multisyllabic_words', 'Multisyllabic Words', 'Break down and spell complex multisyllabic words.', 7, 3403, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Grade 8 (3 skills)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('SPELL', 'sat_vocabulary_g8', 'SAT Vocabulary', 'Master spelling of high-frequency SAT words.', 8, 3501, true),
  ('SPELL', 'advanced_roots_g8', 'Advanced Roots and Affixes', 'Apply complex roots, prefixes, and suffixes.', 8, 3502, true),
  ('SPELL', 'technical_vocabulary', 'Technical Vocabulary', 'Spell specialized terms from science and social studies.', 8, 3503, true)
ON CONFLICT (skill_code) DO NOTHING;

-- ========================================================================
-- TYPE SKILLS - GRADES 4-8 (5 skills total, 1 per grade)
-- ========================================================================

INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, display_order, is_active)
VALUES
  ('TYPE', 'number_row_g4', 'Number Row Typing', 'Type numbers 0-9 with proper finger placement.', 4, 4001, true),
  ('TYPE', 'symbols_punctuation_g5', 'Symbols and Punctuation', 'Type symbols and punctuation using shift keys.', 5, 4002, true),
  ('TYPE', 'speed_30wpm_g6', 'Speed Building (30 WPM)', 'Build typing speed and accuracy to 30 WPM.', 6, 4003, true),
  ('TYPE', 'speed_40wpm_g7', 'Speed Building (40 WPM)', 'Increase typing speed to 40 WPM with 95% accuracy.', 7, 4004, true),
  ('TYPE', 'speed_50wpm_g8', 'Speed Building (50+ WPM)', 'Achieve professional typing speed of 50+ WPM.', 8, 4005, true)
ON CONFLICT (skill_code) DO NOTHING;