-- Complete the Phase 2 migration
-- Run this if mistake_patterns table is missing

-- =====================================================================
-- TABLE 2: mistake_patterns
-- Purpose: Store common wrong answers with targeted feedback
-- =====================================================================

CREATE TABLE IF NOT EXISTS mistake_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What this pattern is for
  subject_code TEXT NOT NULL,
  skill_id UUID,                        -- Link to curriculum_skills
  problem_text TEXT,                    -- The specific problem
  correct_answer TEXT,                  -- What the right answer is

  -- The mistake pattern
  wrong_answer TEXT NOT NULL,           -- What kid might answer wrong
  why_kid_chose TEXT,                   -- Why they might pick this
  feedback TEXT NOT NULL,               -- What to tell them
  feedback_audio_script TEXT,           -- For Gigi to speak
  follow_up_problem TEXT,               -- Easier problem to try
  follow_up_answer TEXT,                -- Answer to follow-up

  -- Metadata
  times_seen INTEGER DEFAULT 0,         -- Track how often this mistake happens
  times_helped INTEGER DEFAULT 0,       -- Track if feedback helped

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_mistake_patterns_skill ON mistake_patterns(skill_id);
CREATE INDEX IF NOT EXISTS idx_mistake_patterns_subject ON mistake_patterns(subject_code);
CREATE INDEX IF NOT EXISTS idx_mistake_patterns_problem ON mistake_patterns(problem_text);
CREATE INDEX IF NOT EXISTS idx_mistake_patterns_answer ON mistake_patterns(wrong_answer);

-- Row Level Security (RLS)
ALTER TABLE mistake_patterns ENABLE ROW LEVEL SECURITY;

-- Anyone can read mistake patterns
DROP POLICY IF EXISTS "Anyone can read mistake patterns" ON mistake_patterns;
CREATE POLICY "Anyone can read mistake patterns"
  ON mistake_patterns FOR SELECT
  USING (true);

-- Service role can manage
DROP POLICY IF EXISTS "Service role can manage mistake patterns" ON mistake_patterns;
CREATE POLICY "Service role can manage mistake patterns"
  ON mistake_patterns FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================================
-- HELPER VIEW: Most Common Mistakes
-- Purpose: See which mistakes kids make most often
-- =====================================================================

DROP VIEW IF EXISTS common_mistakes;
CREATE OR REPLACE VIEW common_mistakes AS
SELECT
  mp.subject_code,
  mp.skill_id,
  cs.skill_name,
  mp.problem_text,
  mp.wrong_answer,
  mp.times_seen,
  mp.times_helped,
  CASE
    WHEN mp.times_seen > 0 THEN
      ROUND((mp.times_helped::NUMERIC / mp.times_seen) * 100, 2)
    ELSE 0
  END as help_success_rate
FROM mistake_patterns mp
LEFT JOIN curriculum_skills cs ON mp.skill_id = cs.id
WHERE mp.times_seen > 0
ORDER BY mp.times_seen DESC, help_success_rate DESC;

-- =====================================================================
-- SAMPLE DATA: Add example mistake pattern for testing
-- =====================================================================

-- Example: Multiplication mistake pattern
INSERT INTO mistake_patterns (
  subject_code,
  problem_text,
  correct_answer,
  wrong_answer,
  why_kid_chose,
  feedback,
  follow_up_problem,
  follow_up_answer
) VALUES (
  'MATH',
  '3 × 20 = ?',
  '60',
  '23',
  'Added instead of multiplied (20 + 3)',
  'I see you got 23! That''s what you get if you ADD 20 + 3. But the × symbol means multiply - we need 3 GROUPS of 20. Let''s count: 20... 40... 60!',
  '3 × 2 = ?',
  '6'
) ON CONFLICT DO NOTHING;

-- Add sample data to explanation_library if empty
INSERT INTO explanation_library (
  subject_code,
  skill_name,
  problem_text,
  level_1,
  level_2,
  level_3,
  visual_explanation,
  story_explanation,
  generated_by
) VALUES (
  'MATH',
  'Addition (1-digit)',
  '2 + 3 = ?',
  'When we add, we put numbers together. 2 + 3 means we start with 2 and add 3 more. Count: 2... 3, 4, 5. The answer is 5.',
  'Let''s use our fingers! Hold up 2 fingers. Now hold up 3 more fingers. Count all your fingers: 1, 2, 3, 4, 5. That''s 5!',
  'Imagine you have 2 cookies. Your friend gives you 3 more cookies. Now count all your cookies: 1, 2, 3, 4, 5 cookies! So 2 + 3 = 5.',
  'Picture 2 dots: ●●. Now add 3 more dots: ● ● ●. Count all the dots together: ● ● ● ● ● That''s 5 dots!',
  'Once upon a time, there were 2 little birds sitting on a tree. Then 3 more birds flew over and sat down too. How many birds are on the tree now? Let''s count: 1, 2, 3, 4, 5 birds!',
  'sample'
) ON CONFLICT DO NOTHING;

-- Add comment
COMMENT ON TABLE mistake_patterns IS 'Phase 2: Common wrong answers with targeted feedback';

-- Verify tables exist
SELECT 'explanation_library' as table_name, COUNT(*) as row_count FROM explanation_library
UNION ALL
SELECT 'mistake_patterns' as table_name, COUNT(*) as row_count FROM mistake_patterns;
