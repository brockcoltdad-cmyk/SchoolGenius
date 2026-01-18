-- Add placement test results table
-- Stores results from placement tests that determine starting grade levels

CREATE TABLE IF NOT EXISTS placement_test_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  results jsonb NOT NULL, -- Stores {MATH: {determinedGrade, ...}, READING: {...}, etc.}
  taken_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Index for faster lookups by child
CREATE INDEX IF NOT EXISTS idx_placement_test_results_child_id ON placement_test_results(child_id);

-- RLS policies
ALTER TABLE placement_test_results ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their children's results
CREATE POLICY "Users can view their children's placement results"
  ON placement_test_results FOR SELECT
  USING (
    child_id IN (
      SELECT id FROM children WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  );

-- Allow authenticated users to insert results for their children
CREATE POLICY "Users can insert placement results for their children"
  ON placement_test_results FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT id FROM children WHERE family_id IN (
        SELECT id FROM families WHERE user_id = auth.uid()
      )
    )
  );

-- Allow service role full access
CREATE POLICY "Service role has full access to placement_test_results"
  ON placement_test_results FOR ALL
  USING (auth.role() = 'service_role');

-- Add subject-specific grade columns to children table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'math_grade'
  ) THEN
    ALTER TABLE children ADD COLUMN math_grade integer DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'reading_grade'
  ) THEN
    ALTER TABLE children ADD COLUMN reading_grade integer DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'spelling_grade'
  ) THEN
    ALTER TABLE children ADD COLUMN spelling_grade integer DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'writing_grade'
  ) THEN
    ALTER TABLE children ADD COLUMN writing_grade integer DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'placement_completed'
  ) THEN
    ALTER TABLE children ADD COLUMN placement_completed boolean DEFAULT false;
  END IF;
END $$;

COMMENT ON TABLE placement_test_results IS 'Stores placement test results for determining student starting levels';
COMMENT ON COLUMN placement_test_results.results IS 'JSON object with per-subject results including determined grade level';
