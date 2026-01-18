-- Create practice_problems table (unified table for all subjects)
-- This replaces and expands math_problems

CREATE TABLE IF NOT EXISTS practice_problems (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL DEFAULT 'math',
  grade INTEGER NOT NULL,
  skill TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  options JSONB,
  visual_type TEXT,
  visual_data JSONB,
  tier1 JSONB,
  tier2 JSONB,
  explanation TEXT,
  common_mistake TEXT,
  hints JSONB,
  standard TEXT,
  difficulty TEXT DEFAULT 'medium',
  source_file TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_practice_problems_subject ON practice_problems(subject);
CREATE INDEX IF NOT EXISTS idx_practice_problems_grade ON practice_problems(grade);
CREATE INDEX IF NOT EXISTS idx_practice_problems_skill ON practice_problems(skill);
CREATE INDEX IF NOT EXISTS idx_practice_problems_subject_grade ON practice_problems(subject, grade);

-- Enable RLS
ALTER TABLE practice_problems ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can view practice problems"
  ON practice_problems FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert/update
CREATE POLICY "Service role can manage practice problems"
  ON practice_problems FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
