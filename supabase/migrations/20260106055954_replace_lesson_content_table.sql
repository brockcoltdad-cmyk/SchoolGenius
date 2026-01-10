/*
  # Replace lesson_content table with new schema

  1. Changes
    - Drop old lesson_content table (with skill_definition_id, teacher_demos, mastery_quiz, spaced_review)
    - Create new lesson_content table with updated schema:
      - Uses `skill_id` instead of `skill_definition_id`
      - Uses `demo_problems` instead of `teacher_demos`
      - Uses `quiz_questions` instead of `mastery_quiz`
      - Uses `review_questions` instead of `spaced_review`
      - Adds new columns: subject_code, skill_name, rules_text, rules_audio_script, generated_at
      - Removes old columns: help_responses, mistake_patterns, alt_explanations

  2. Security
    - Enable RLS on new table
    - Allow authenticated users to read lesson content
    - Allow service role to write lesson content (for Edge Functions)

  3. Indexes
    - Add index on skill_id for fast lookups
    - Add index on subject_code for filtering by subject
*/

-- Drop old table
DROP TABLE IF EXISTS lesson_content CASCADE;

-- Create new lesson_content table
CREATE TABLE lesson_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid REFERENCES curriculum_skills(id) ON DELETE CASCADE UNIQUE NOT NULL,
  subject_code text NOT NULL,
  skill_name text NOT NULL,
  rules_text text,
  rules_audio_script text,
  demo_problems jsonb DEFAULT '[]'::jsonb,
  guided_practice jsonb DEFAULT '[]'::jsonb,
  independent_practice jsonb DEFAULT '[]'::jsonb,
  challenge_problems jsonb DEFAULT '[]'::jsonb,
  quiz_questions jsonb DEFAULT '[]'::jsonb,
  review_questions jsonb DEFAULT '[]'::jsonb,
  generated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read lesson content
CREATE POLICY "Authenticated users can view lesson content"
  ON lesson_content FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert/update lesson content (for Edge Functions)
CREATE POLICY "Service role can manage lesson content"
  ON lesson_content FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_lesson_content_skill_id ON lesson_content(skill_id);
CREATE INDEX idx_lesson_content_subject_code ON lesson_content(subject_code);
