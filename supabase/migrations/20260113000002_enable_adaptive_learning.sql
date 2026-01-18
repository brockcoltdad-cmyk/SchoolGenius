/*
  # Enable Adaptive Learning System

  ## What this does:
  1. Adds INSERT policy so parents can record their children's answer attempts
  2. Adds UPDATE policy for learning_profiles to be updated by system
  3. Allows the adaptive learning analyzer to track student progress

  ## Impact:
  - Students' answers will be tracked in answer_attempts table
  - Learning profiles will auto-update after every 20 questions
  - Gigi will have access to learning preferences for personalization
*/

-- Allow parents to INSERT answer attempts for their children
CREATE POLICY IF NOT EXISTS "Parents can insert answer attempts for their children"
  ON answer_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = answer_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Allow service role to update learning profiles (for analyzer)
-- This policy should already exist but adding it to be safe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'learning_profiles'
    AND policyname = 'Service role can update learning profiles'
  ) THEN
    CREATE POLICY "Service role can update learning profiles"
      ON learning_profiles FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create index for faster queries on answer_attempts by created_at
CREATE INDEX IF NOT EXISTS idx_answer_attempts_created_at
  ON answer_attempts(child_id, created_at DESC);

-- Comment for documentation
COMMENT ON TABLE answer_attempts IS 'Tracks every answer for adaptive learning analysis. Auto-analyzed after 20 questions.';
COMMENT ON TABLE learning_profiles IS 'AI-powered personalization based on answer patterns. Auto-updated by analyzer.';
