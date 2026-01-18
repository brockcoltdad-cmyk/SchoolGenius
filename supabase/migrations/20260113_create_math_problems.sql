-- Math Problems Table
-- Stores challenging, grade-appropriate math problems with visuals and hints

CREATE TABLE IF NOT EXISTS math_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level INTEGER NOT NULL,
  topic TEXT NOT NULL,
  standard TEXT, -- Arizona standard (e.g., "3.OA.A.1")
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'challenge')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL, -- Can be number or text
  options JSONB, -- Multiple choice options [1, 2, 3, 4]
  visual_type TEXT, -- counting_objects, number_line, fraction, array, etc.
  visual_data JSONB, -- Data for rendering visual
  explanation TEXT NOT NULL, -- Step-by-step solution
  common_mistake TEXT, -- What students often get wrong
  hints JSONB, -- Array of 6 hint levels
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate questions per topic/grade
  UNIQUE(grade_level, topic, question)
);

-- Enable RLS
ALTER TABLE math_problems ENABLE ROW LEVEL SECURITY;

-- Everyone can read math problems (public educational content)
CREATE POLICY "Math problems are readable by authenticated users"
  ON math_problems FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert/update (for generation scripts)
CREATE POLICY "Service role can manage math problems"
  ON math_problems FOR ALL
  TO service_role
  USING (true);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_math_problems_grade ON math_problems(grade_level);
CREATE INDEX IF NOT EXISTS idx_math_problems_topic ON math_problems(topic);
CREATE INDEX IF NOT EXISTS idx_math_problems_difficulty ON math_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_math_problems_grade_topic ON math_problems(grade_level, topic);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_math_problems_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER math_problems_updated_at
  BEFORE UPDATE ON math_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_math_problems_timestamp();

-- Add comment for documentation
COMMENT ON TABLE math_problems IS 'Challenging math problems organized by grade, topic, and difficulty. Includes visual data for K-5 and 6-level hints.';
