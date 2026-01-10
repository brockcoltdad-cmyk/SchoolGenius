/*
  # Add K-2 Phonics Skills to Curriculum

  1. Changes
    - Adds comprehensive phonics skills for Kindergarten through Grade 2
    - Includes Arizona's required 6 syllable types instruction
    - Covers phonics foundation, syllable types, and progression

  2. Skills Added
    - Kindergarten (7 skills): Letter names, sounds, blending, rhyming, sight words
    - Six Syllable Types (6 skills): Closed, Open, VCe, Vowel Team, R-Controlled, Consonant-le
    - Phonics Progression (7 skills): Blends, digraphs, vowel teams, prefixes/suffixes

  3. Notes
    - All skills use subject_code 'READ'
    - Difficulty levels: 1 (basic), 2 (intermediate)
    - Display order ensures logical teaching sequence
    - Aligned with Arizona K-3 Reading Standards
*/

-- Delete existing READ skills to avoid duplicates
DELETE FROM curriculum_skills WHERE subject_code = 'READ';

-- Insert phonics skills
INSERT INTO curriculum_skills (subject_code, skill_code, skill_name, description, grade_level, difficulty_level, display_order, is_active) VALUES

-- PHONICS FOUNDATION (Kindergarten)
('READ', 'read_letter_names', 'Letter Names', 'Recognize and name all 26 letters (upper and lower)', 0, 1, 1, true),
('READ', 'read_letter_sounds', 'Letter Sounds', 'Know the sound each letter makes', 0, 1, 2, true),
('READ', 'read_beginning_sounds', 'Beginning Sounds', 'Identify what sound a word starts with', 0, 1, 3, true),
('READ', 'read_ending_sounds', 'Ending Sounds', 'Identify what sound a word ends with', 0, 1, 4, true),
('READ', 'read_rhyming', 'Rhyming Words', 'Identify and produce rhyming words', 0, 1, 5, true),
('READ', 'read_cvc_blending', 'CVC Blending', 'Blend sounds to read CVC words (c-a-t = cat)', 0, 1, 6, true),
('READ', 'read_sight_words_k', 'Sight Words K', 'Read Kindergarten sight words (the, a, is, to, and)', 0, 1, 7, true),

-- SIX SYLLABLE TYPES (Arizona Required - Grade 1)
('READ', 'read_syllable_closed', 'Closed Syllables', 'CVC pattern - vowel closed in by consonant = short sound (cat, fish)', 1, 1, 10, true),
('READ', 'read_syllable_open', 'Open Syllables', 'CV pattern - vowel at end = says its name/long (me, go)', 1, 1, 11, true),
('READ', 'read_syllable_vce', 'VCe Syllables (Magic E)', 'Magic E makes the vowel say its name (cake, bike)', 1, 2, 12, true),
('READ', 'read_syllable_vowel_team', 'Vowel Team Syllables', 'Two vowels together - first one talks (rain, boat)', 1, 2, 13, true),
('READ', 'read_syllable_r_controlled', 'R-Controlled Syllables', 'R bosses the vowel - makes special sound (car, bird)', 2, 2, 14, true),
('READ', 'read_syllable_consonant_le', 'Consonant-le Syllables', 'Last 3 letters make their own syllable (ta-ble, lit-tle)', 2, 2, 15, true),

-- PHONICS PROGRESSION (Grade 1-2)
('READ', 'read_consonant_blends', 'Consonant Blends', 'Two consonants together (bl, st, tr, cr, sp)', 1, 1, 16, true),
('READ', 'read_consonant_digraphs', 'Consonant Digraphs', 'Two letters make one sound (sh, ch, th, wh, ck)', 1, 1, 17, true),
('READ', 'read_sight_words_1', 'Sight Words Grade 1', 'Read first grade sight words', 1, 1, 18, true),
('READ', 'read_vowel_teams', 'Vowel Teams', 'ai, ay, ea, ee, oa, ow, ue and more', 2, 2, 19, true),
('READ', 'read_r_controlled', 'R-Controlled Vowels', 'ar, er, ir, or, ur patterns', 2, 2, 20, true),
('READ', 'read_sight_words_2', 'Sight Words Grade 2', 'Read second grade sight words', 2, 1, 21, true),
('READ', 'read_prefixes_suffixes', 'Prefixes and Suffixes', 'un-, re-, -ing, -ed, -er, -est', 2, 2, 22, true);