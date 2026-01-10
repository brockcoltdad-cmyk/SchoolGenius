/*
  # Fix Curriculum Subjects Schema and Data

  ## Changes Made
  
  1. Schema Updates
     - Add `grade_levels` column (integer array) to support multiple grade levels per subject
     - Add `is_active` column (boolean) to enable/disable subjects
     - Add `display_order` column (integer) for UI ordering
     - Keep existing `grade_level` column for backward compatibility but make it nullable
  
  2. Data Reset
     - Delete all existing curriculum_subjects rows (4 incorrect subjects)
     - Insert 6 core subjects with proper grade level coverage
  
  3. New Subjects
     - MATH: K-12 (grades 0-12)
     - READ: K-12 (grades 0-12)
     - SPELL: K-8 (grades 0-8)
     - TYPE: K-12 (grades 0-12)
     - CODE: K-12 (grades 0-12)
     - LANG: K-12 (grades 0-12)
  
  ## Important Notes
  - Grade 0 = Kindergarten
  - Grade levels stored as integer array for flexibility
  - Each subject has description explaining content focus
  - Display order controls UI presentation sequence
*/

-- Add new columns to curriculum_subjects
DO $$
BEGIN
  -- Add grade_levels array column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'curriculum_subjects' AND column_name = 'grade_levels'
  ) THEN
    ALTER TABLE curriculum_subjects 
    ADD COLUMN grade_levels integer[] DEFAULT ARRAY[]::integer[];
  END IF;

  -- Add is_active column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'curriculum_subjects' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE curriculum_subjects 
    ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add display_order column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'curriculum_subjects' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE curriculum_subjects 
    ADD COLUMN display_order integer DEFAULT 0;
  END IF;

  -- Make grade_level nullable for backward compatibility
  ALTER TABLE curriculum_subjects 
  ALTER COLUMN grade_level DROP NOT NULL;
END $$;

-- Delete all existing subjects
DELETE FROM curriculum_subjects;

-- Insert the 6 core subjects with proper grade coverage
INSERT INTO curriculum_subjects (code, name, description, grade_levels, is_active, display_order, icon, color) VALUES
('MATH', 'Mathematics', 'Numbers, operations, algebra, geometry, and problem solving', ARRAY[0,1,2,3,4,5,6,7,8,9,10,11,12], true, 1, 'Calculator', 'blue'),
('READ', 'Reading', 'Stories, comprehension, Lexile-leveled reading with quizzes', ARRAY[0,1,2,3,4,5,6,7,8,9,10,11,12], true, 2, 'Book', 'green'),
('SPELL', 'Spelling', 'Phonics rules, spelling patterns, word lists - voice says word, kid types', ARRAY[0,1,2,3,4,5,6,7,8], true, 3, 'Spellcheck', 'pink'),
('TYPE', 'Typing', 'Keyboard skills, home row, speed building, typing games', ARRAY[0,1,2,3,4,5,6,7,8,9,10,11,12], true, 4, 'Keyboard', 'cyan'),
('CODE', 'Coding', 'Block-based to real programming - Scratch, JavaScript, Python', ARRAY[0,1,2,3,4,5,6,7,8,9,10,11,12], true, 5, 'Code', 'yellow'),
('LANG', 'Language Arts', 'Grammar, writing, parts of speech, sentence structure, essays', ARRAY[0,1,2,3,4,5,6,7,8,9,10,11,12], true, 6, 'PenTool', 'orange');