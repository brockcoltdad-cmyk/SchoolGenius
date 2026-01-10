/*
  # Add Language Arts Skills for Grades 4-12

  Adds comprehensive Language Arts curriculum skills for middle and high school students.
  This migration ADDS to existing skills without deleting any data.

  ## New Skills Added:

  ### Grammar Skills (Grades 4-8) - 6 skills
    - Complex sentences (Grade 4)
    - Punctuation rules (Grades 4-5)
    - Subject-verb agreement (Grade 5)
    - Verb tenses (Grades 5-6)
    - Active vs passive voice (Grades 6-7)
    - Clauses and phrases (Grades 7-8)

  ### Vocabulary Skills (Grades 6-12) - 6 skills
    - Context clues (Grades 6-7)
    - Greek roots (Grades 7-8)
    - Latin roots (Grades 8-9)
    - SAT vocabulary (Grades 9-10)
    - ACT vocabulary (Grades 10-11)
    - Academic vocabulary (Grades 11-12)

  ### Writing Skills (Grades 6-12) - 7 skills
    - Paragraph structure (Grade 6)
    - Essay introduction (Grade 7)
    - Essay body paragraphs (Grade 8)
    - Essay conclusions (Grade 9)
    - Persuasive writing (Grade 10)
    - Research writing (Grade 11)
    - College essay prep (Grade 12)

  Total new skills: 19
  Existing LANG skills: 6
  New total LANG skills: 25
*/

-- Grammar Skills (Grades 4-8)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, grade_level, description, display_order, is_active)
VALUES
  ('LANG', 'lang_complex_sentences', 'Complex Sentences', 4, 'Combining independent and dependent clauses', 7, true),
  ('LANG', 'lang_punctuation_rules', 'Punctuation Rules', 4, 'Commas, semicolons, colons, and apostrophes', 8, true),
  ('LANG', 'lang_subject_verb_agreement', 'Subject-Verb Agreement', 5, 'Matching subjects with correct verb forms', 9, true),
  ('LANG', 'lang_verb_tenses', 'Verb Tenses', 5, 'Past, present, future, and perfect tenses', 10, true),
  ('LANG', 'lang_active_passive_voice', 'Active vs Passive Voice', 6, 'Understanding and using different voice forms', 11, true),
  ('LANG', 'lang_clauses_phrases', 'Clauses and Phrases', 7, 'Independent, dependent, prepositional, and participial', 12, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Vocabulary Skills (Grades 6-12)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, grade_level, description, display_order, is_active)
VALUES
  ('LANG', 'lang_context_clues', 'Context Clues', 6, 'Using surrounding text to determine word meaning', 13, true),
  ('LANG', 'lang_greek_roots', 'Greek Roots', 7, 'Common Greek word roots and their meanings', 14, true),
  ('LANG', 'lang_latin_roots', 'Latin Roots', 8, 'Common Latin word roots and their meanings', 15, true),
  ('LANG', 'lang_sat_vocabulary', 'SAT Vocabulary', 9, 'Advanced vocabulary for college entrance exams', 16, true),
  ('LANG', 'lang_act_vocabulary', 'ACT Vocabulary', 10, 'College-level vocabulary for standardized testing', 17, true),
  ('LANG', 'lang_academic_vocabulary', 'Academic Vocabulary', 11, 'Scholarly and professional terminology', 18, true)
ON CONFLICT (skill_code) DO NOTHING;

-- Writing Skills (Grades 6-12)
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, grade_level, description, display_order, is_active)
VALUES
  ('LANG', 'lang_paragraph_structure', 'Paragraph Structure', 6, 'Topic sentences, evidence, analysis, and transitions', 19, true),
  ('LANG', 'lang_essay_introduction', 'Essay Introduction', 7, 'Hook, context, thesis statement', 20, true),
  ('LANG', 'lang_essay_body', 'Essay Body Paragraphs', 8, 'Claims, evidence, reasoning, and analysis', 21, true),
  ('LANG', 'lang_essay_conclusion', 'Essay Conclusions', 9, 'Restating thesis and broader implications', 22, true),
  ('LANG', 'lang_persuasive_writing', 'Persuasive Writing', 10, 'Arguments, counterarguments, and rhetorical devices', 23, true),
  ('LANG', 'lang_research_writing', 'Research Writing', 11, 'Citations, sources, and academic integrity', 24, true),
  ('LANG', 'lang_college_essay', 'College Essay Prep', 12, 'Personal narrative and application essays', 25, true)
ON CONFLICT (skill_code) DO NOTHING;
