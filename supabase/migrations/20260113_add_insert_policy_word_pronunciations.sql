-- Add INSERT policy to word_pronunciations table
-- The original migration only had SELECT policy

-- Allow service role to insert/update word pronunciations
CREATE POLICY "Service role can manage word pronunciations"
  ON word_pronunciations FOR ALL
  TO service_role
  USING (true);

-- Also allow authenticated users to read (in case original policy is missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'word_pronunciations'
    AND policyname = 'Word pronunciations are readable by all authenticated users'
  ) THEN
    CREATE POLICY "Word pronunciations are readable by all authenticated users"
      ON word_pronunciations FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
