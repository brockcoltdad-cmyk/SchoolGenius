-- =====================================================================
-- PHASE 2: MULTI-LEVEL EXPLANATION SYSTEM
-- Created: January 11, 2026
-- Purpose: Tables for progressive help system (Level 1, 2, 3, alternatives)
-- =====================================================================

-- =====================================================================
-- TABLE 1: explanation_library
-- Purpose: Store multiple explanation levels for each concept
-- =====================================================================

CREATE TABLE IF NOT EXISTS explanation_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- What this explanation is for
  subject_code TEXT NOT NULL,           -- MATH, SPELL, READ, CODE, LANG, TYPE
  skill_id UUID,                        -- Link to curriculum_skills
  skill_name TEXT,                      -- For easy reference
  problem_text TEXT,                    -- The specific problem (optional)

  -- Multi-level explanations (progressive difficulty)
  level_1 TEXT,                         -- Standard explanation
  level_2 TEXT,                         -- Simplified breakdown
  level_3 TEXT,                         -- Most basic with analogies

  -- Alternative learning styles
  visual_explanation TEXT,              -- Picture-based explanation
  story_explanation TEXT,               -- Story/analogy-based
  hands_on_explanation TEXT,            -- Activity-based
  step_by_step TEXT,                    -- Detailed step breakdown

  -- Audio scripts for Gigi (Text-to-Speech)
  level_1_audio_script TEXT,
  level_2_audio_script TEXT,
  level_3_audio_script TEXT,
  visual_audio_script TEXT,
  story_audio_script TEXT,

  -- Metadata
  generated_by TEXT DEFAULT 'grok',     -- 'grok' or 'claude'
  times_used INTEGER DEFAULT 0,         -- Track usage
  effectiveness_score NUMERIC(3,2),     -- Future: track if it helped (0.00-1.00)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_explanation_library_skill ON explanation_library(skill_id);
CREATE INDEX IF NOT EXISTS idx_explanation_library_subject ON explanation_library(subject_code);
CREATE INDEX IF NOT EXISTS idx_explanation_library_problem ON explanation_library(problem_text);

-- Row Level Security (RLS)
ALTER TABLE explanation_library ENABLE ROW LEVEL SECURITY;

-- Anyone can read explanations (they're educational content)
CREATE POLICY "Anyone can read explanation library"
  ON explanation_library FOR SELECT
  USING (true);

-- Only service role can insert/update (via Edge Functions)
CREATE POLICY "Service role can manage explanations"
  ON explanation_library FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

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
CREATE POLICY "Anyone can read mistake patterns"
  ON mistake_patterns FOR SELECT
  USING (true);

-- Service role can manage
CREATE POLICY "Service role can manage mistake patterns"
  ON mistake_patterns FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================================
-- TRIGGER: Update updated_at on explanation_library
-- =====================================================================

CREATE OR REPLACE FUNCTION update_explanation_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_explanation_library_updated_at
  BEFORE UPDATE ON explanation_library
  FOR EACH ROW
  EXECUTE FUNCTION update_explanation_library_updated_at();

-- =====================================================================
-- HELPER VIEW: Explanation Coverage by Subject
-- Purpose: Monitor which subjects have explanations generated
-- =====================================================================

CREATE OR REPLACE VIEW explanation_coverage AS
SELECT
  cs.subject_code,
  cs.grade_level,
  COUNT(DISTINCT cs.id) as total_skills,
  COUNT(DISTINCT el.skill_id) as skills_with_explanations,
  ROUND(
    (COUNT(DISTINCT el.skill_id)::NUMERIC / NULLIF(COUNT(DISTINCT cs.id), 0)) * 100,
    2
  ) as coverage_percentage
FROM curriculum_skills cs
LEFT JOIN explanation_library el ON cs.id = el.skill_id
WHERE cs.is_active = true
GROUP BY cs.subject_code, cs.grade_level
ORDER BY cs.subject_code, cs.grade_level;

-- =====================================================================
-- HELPER VIEW: Most Common Mistakes
-- Purpose: See which mistakes kids make most often
-- =====================================================================

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
-- SAMPLE DATA: Add a few example explanations for testing
-- =====================================================================

-- Example 1: Addition explanation (MATH)
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
);

-- Example 2: Multiplication mistake pattern
INSERT INTO mistake_patterns (
  subject_code,
  skill_name,
  problem_text,
  correct_answer,
  wrong_answer,
  why_kid_chose,
  feedback,
  follow_up_problem,
  follow_up_answer
) VALUES (
  'MATH',
  'Multiplication (single digit)',
  '3 × 20 = ?',
  '60',
  '23',
  'Added instead of multiplied (20 + 3)',
  'I see you got 23! That''s what you get if you ADD 20 + 3. But the × symbol means multiply - we need 3 GROUPS of 20. Let''s count: 20... 40... 60!',
  '3 × 2 = ?',
  '6'
);

-- =====================================================================
-- VERIFICATION QUERIES (Run after migration to test)
-- =====================================================================

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('explanation_library', 'mistake_patterns');

-- Check sample data
-- SELECT * FROM explanation_library LIMIT 1;
-- SELECT * FROM mistake_patterns LIMIT 1;

-- Check coverage view
-- SELECT * FROM explanation_coverage;

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================

-- Add comment to track migration
COMMENT ON TABLE explanation_library IS 'Phase 2: Multi-level explanations for progressive help system';
COMMENT ON TABLE mistake_patterns IS 'Phase 2: Common wrong answers with targeted feedback';
