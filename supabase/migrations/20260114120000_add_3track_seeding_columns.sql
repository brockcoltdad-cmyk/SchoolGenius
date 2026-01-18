/*
  # Add 3-Track Seeding Columns to QA Library

  Supports the 3-track system for age-appropriate responses:
  - Track 1: Grade Band (K-2, 3-5, 6-8, 9-12) - How Gigi TALKS
  - Track 2: Skill Level (below, on, above) - How HARD the content
  - Track 3: Page Context - Where on the site this applies

  ## Changes:
  1. Add grade_band column (text) - replaces grade_level for Q&A matching
  2. Add skill_level column (text) - for adaptive difficulty
  3. Add page_context column (text) - which page/section
  4. Add intervention_level column (integer) - for escalating help
  5. Add related_answers array - links to simpler/harder versions
*/

-- Add grade_band column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qa_library' AND column_name = 'grade_band'
  ) THEN
    ALTER TABLE qa_library ADD COLUMN grade_band text
      CHECK (grade_band IN ('K-2', '3-5', '6-8', '9-12', 'parent', 'all'));
  END IF;
END $$;

-- Add skill_level column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qa_library' AND column_name = 'skill_level'
  ) THEN
    ALTER TABLE qa_library ADD COLUMN skill_level text
      DEFAULT 'on'
      CHECK (skill_level IN ('below', 'on', 'above', 'all'));
  END IF;
END $$;

-- Add page_context column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qa_library' AND column_name = 'page_context'
  ) THEN
    ALTER TABLE qa_library ADD COLUMN page_context text
      DEFAULT 'general'
      CHECK (page_context IN (
        'kid_dashboard', 'lesson', 'chat', 'shop', 'leaderboard',
        'achievements', 'settings', 'reading', 'games', 'stories',
        'parent_dashboard', 'parent_data', 'parent_settings',
        'legal', 'help', 'general'
      ));
  END IF;
END $$;

-- Add intervention_level column (0=normal, 1-3=escalating simplicity)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qa_library' AND column_name = 'intervention_level'
  ) THEN
    ALTER TABLE qa_library ADD COLUMN intervention_level integer
      DEFAULT 0
      CHECK (intervention_level >= 0 AND intervention_level <= 3);
  END IF;
END $$;

-- Add related_answers for linking to simpler/harder versions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qa_library' AND column_name = 'related_answers'
  ) THEN
    ALTER TABLE qa_library ADD COLUMN related_answers uuid[] DEFAULT ARRAY[]::uuid[];
  END IF;
END $$;

-- Add audio_script for TTS (Gigi can read answers to young kids)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qa_library' AND column_name = 'audio_script'
  ) THEN
    ALTER TABLE qa_library ADD COLUMN audio_script text;
  END IF;
END $$;

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_qa_library_grade_band
  ON qa_library(grade_band) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_qa_library_skill_level
  ON qa_library(skill_level) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_qa_library_page_context
  ON qa_library(page_context) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_qa_library_3track_lookup
  ON qa_library(grade_band, skill_level, page_context) WHERE is_active = true;

-- Create composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_qa_library_full_lookup
  ON qa_library(category, subject_code, grade_band, skill_level, page_context)
  WHERE is_active = true;

-- =============================================================================
-- UPDATE explanation_library to match 3-track system
-- =============================================================================

-- Add grade_band to explanation_library
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'explanation_library' AND column_name = 'grade_band'
  ) THEN
    ALTER TABLE explanation_library ADD COLUMN grade_band text
      CHECK (grade_band IN ('K-2', '3-5', '6-8', '9-12', 'all'));
  END IF;
END $$;

-- Add skill_level to explanation_library
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'explanation_library' AND column_name = 'skill_level'
  ) THEN
    ALTER TABLE explanation_library ADD COLUMN skill_level text
      DEFAULT 'on'
      CHECK (skill_level IN ('below', 'on', 'above', 'all'));
  END IF;
END $$;

-- Create indexes for explanation_library
CREATE INDEX IF NOT EXISTS idx_explanation_library_grade_band
  ON explanation_library(grade_band);

CREATE INDEX IF NOT EXISTS idx_explanation_library_skill_level
  ON explanation_library(skill_level);

-- =============================================================================
-- HELPER FUNCTION: Get appropriate answer based on 3-track system
-- =============================================================================

CREATE OR REPLACE FUNCTION get_qa_answer(
  p_question_pattern text,
  p_grade_band text DEFAULT 'all',
  p_skill_level text DEFAULT 'on',
  p_page_context text DEFAULT 'general',
  p_subject_code text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  answer_text text,
  audio_script text,
  confidence_threshold double precision,
  intervention_level integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id,
    q.answer_text,
    q.audio_script,
    q.confidence_threshold,
    q.intervention_level
  FROM qa_library q
  WHERE q.is_active = true
    AND (
      -- Exact grade band match OR 'all' grades
      q.grade_band = p_grade_band
      OR q.grade_band = 'all'
      OR p_grade_band = 'all'
    )
    AND (
      -- Exact skill level match OR 'all' skill levels
      q.skill_level = p_skill_level
      OR q.skill_level = 'all'
      OR p_skill_level = 'all'
    )
    AND (
      -- Page context match OR 'general'
      q.page_context = p_page_context
      OR q.page_context = 'general'
    )
    AND (
      -- Subject match if provided
      p_subject_code IS NULL
      OR q.subject_code = p_subject_code
      OR q.subject_code IS NULL
    )
    AND (
      -- Question pattern match (case-insensitive contains)
      q.question_pattern ILIKE '%' || p_question_pattern || '%'
      OR p_question_pattern ILIKE '%' || q.question_pattern || '%'
    )
  ORDER BY
    -- Prefer exact matches
    CASE WHEN q.grade_band = p_grade_band THEN 0 ELSE 1 END,
    CASE WHEN q.skill_level = p_skill_level THEN 0 ELSE 1 END,
    CASE WHEN q.page_context = p_page_context THEN 0 ELSE 1 END,
    -- Then by times served (more popular = more trusted)
    q.times_served DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON COLUMN qa_library.grade_band IS 'Grade band for vocabulary level: K-2, 3-5, 6-8, 9-12, parent, or all';
COMMENT ON COLUMN qa_library.skill_level IS 'Skill level for content difficulty: below, on, above grade level';
COMMENT ON COLUMN qa_library.page_context IS 'Which page/section this Q&A applies to';
COMMENT ON COLUMN qa_library.intervention_level IS 'Escalation level: 0=normal, 1-3=increasingly simpler';
COMMENT ON COLUMN qa_library.audio_script IS 'Script for TTS, may differ from answer_text for better audio';

COMMENT ON FUNCTION get_qa_answer IS 'Retrieves the best matching answer based on 3-track system (grade, skill, context)';
