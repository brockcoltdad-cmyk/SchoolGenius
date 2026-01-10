/*
  # Add Visual and Grade Level Columns to Lesson Content

  1. Changes
    - Add `grade_level` (integer) - stores K-12 grade level for age-appropriate content
    - Add `visual_type` (text) - stores which visual component to use for the lesson
    - Add `skill_code` (text) - stores the skill code reference from curriculum_skills

  2. Notes
    - All columns nullable to support existing records
    - visual_type will map to visual components (e.g., 'place_value', 'bar_model', 'phonics')
    - grade_level enables age-appropriate language and difficulty
*/

ALTER TABLE lesson_content 
ADD COLUMN IF NOT EXISTS grade_level INTEGER,
ADD COLUMN IF NOT EXISTS visual_type TEXT,
ADD COLUMN IF NOT EXISTS skill_code TEXT;
