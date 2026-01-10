/*
  # Fix RLS policies for Edge Functions

  1. Changes
    - Add public SELECT policy for curriculum_skills (anon key needs access)
    - Ensure service role can access curriculum_skills
    - These policies allow Edge Functions to read curriculum data

  2. Security
    - Curriculum data is read-only and public by design
    - Service role maintains full access to lesson_content for writes
*/

-- Allow anyone (including anon) to read curriculum skills
DROP POLICY IF EXISTS "Anyone can view curriculum skills" ON curriculum_skills;

CREATE POLICY "Public can view curriculum skills"
  ON curriculum_skills
  FOR SELECT
  TO public
  USING (true);
