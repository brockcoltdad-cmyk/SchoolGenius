-- ============================================================================
-- SchoolGenius Age-Appropriate Smart Seeding Tables
-- ============================================================================
-- Creates all database tables needed for the seeding scripts
-- Run this BEFORE running the seeding scripts
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. KID STUCK RESPONSES (340 items: 85 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS kid_stuck_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_type TEXT NOT NULL, -- "dont_get_it", "this_is_hard", "help", "confused", "explain_again"
  subject TEXT NOT NULL, -- "Math", "Reading", "Spelling", "Coding", "Typing"
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  response TEXT NOT NULL,
  response_tone TEXT NOT NULL, -- "encouraging", "hint", "reframe"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stuck_responses_lookup
  ON kid_stuck_responses(question_type, subject, age_group);

COMMENT ON TABLE kid_stuck_responses IS 'Age-appropriate responses when kids ask for help';
COMMENT ON COLUMN kid_stuck_responses.age_group IS 'k2=Ages 5-8, grades35=Ages 8-11, grades68=Ages 11-14, grades912=Ages 14-18';

-- ============================================================================
-- 2. SUBJECT ANALOGIES (1,100 items: 275 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subject_analogies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  analogy TEXT NOT NULL, -- "Fractions are like pizza slices"
  explanation TEXT NOT NULL, -- How the analogy connects
  when_to_use TEXT NOT NULL, -- "When introducing fractions"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analogies_lookup
  ON subject_analogies(skill_name, subject, age_group);

CREATE INDEX IF NOT EXISTS idx_analogies_skill
  ON subject_analogies(skill_id);

COMMENT ON TABLE subject_analogies IS 'Age-appropriate real-world analogies for skills';

-- ============================================================================
-- 3. PARENT STRUGGLE GUIDES (28 items: NO age variations - for parents)
-- ============================================================================
CREATE TABLE IF NOT EXISTS parent_struggle_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  struggle_type TEXT NOT NULL, -- "subject", "behavioral", "specific"
  subject TEXT, -- "Math", "Reading", etc. (null for non-subject struggles)
  grade_range TEXT NOT NULL, -- "K-2", "3-5", "6-8", "9-12", "All Ages"
  understanding TEXT NOT NULL, -- Why this happens (100-150 words)
  specific_tips TEXT[] NOT NULL, -- 5 actionable tips
  whats_normal TEXT NOT NULL, -- What to expect (50-75 words)
  when_seek_help TEXT NOT NULL, -- Red flags (50-75 words)
  timeline TEXT NOT NULL, -- How long improvement takes (30-50 words)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_struggle_guides_type
  ON parent_struggle_guides(struggle_type, subject, grade_range);

COMMENT ON TABLE parent_struggle_guides IS 'Comprehensive guides for parents when children struggle';

-- ============================================================================
-- 4. TRANSITION PHRASES (300 items: 75 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS transition_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_phase TEXT NOT NULL, -- "rules", "demo", "practice"
  to_phase TEXT NOT NULL, -- "demo", "practice", "quiz"
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  phrase TEXT NOT NULL,
  enthusiasm_level TEXT NOT NULL, -- "calm", "medium", "high"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transitions_lookup
  ON transition_phrases(from_phase, to_phase, subject, age_group);

COMMENT ON TABLE transition_phrases IS 'Age-appropriate transitions between lesson phases';

-- ============================================================================
-- 5. ACHIEVEMENT CELEBRATIONS (168 items: 42 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievement_celebrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_type TEXT NOT NULL, -- "first_lesson", "streak", "coins", "mastery"
  milestone_value INT, -- 3, 7, 14, 30 for streaks; coin amounts; null for others
  subject TEXT, -- For mastery achievements
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  main_message TEXT NOT NULL,
  secondary_message TEXT,
  excitement_level TEXT NOT NULL, -- "medium", "high", "epic"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_celebrations_lookup
  ON achievement_celebrations(achievement_type, milestone_value, age_group);

COMMENT ON TABLE achievement_celebrations IS 'Age-appropriate celebration messages for achievements';

-- ============================================================================
-- 6. TIME GREETINGS (64 items: 16 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS greeting_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_of_day TEXT NOT NULL, -- "morning", "afternoon", "evening", "weekend"
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  greeting TEXT NOT NULL,
  energy_level TEXT NOT NULL, -- "calm", "upbeat", "chill"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_greetings_lookup
  ON greeting_messages(time_of_day, age_group);

COMMENT ON TABLE greeting_messages IS 'Age-appropriate greetings based on time of day';

-- ============================================================================
-- 7. RETURN MESSAGES (80 items: 20 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS return_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  days_away_min INT NOT NULL,
  days_away_max INT, -- null means "or more"
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  message TEXT NOT NULL,
  action_suggestion TEXT, -- "Pick up where you left off?"
  tone TEXT NOT NULL, -- "welcoming", "encouraging", "gentle"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_return_lookup
  ON return_messages(days_away_min, age_group);

COMMENT ON TABLE return_messages IS 'Age-appropriate welcome back messages based on time away';

-- ============================================================================
-- 8. GIGI PERSONALITY (200 items: 50 × 4 age groups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS gigi_personality (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- "encouragement", "mistake_reframe", "excitement", "motivation", "growth_mindset"
  age_group TEXT NOT NULL, -- "k2", "grades35", "grades68", "grades912"
  phrase TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  tone TEXT NOT NULL, -- "supportive", "excited", "warm"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personality_lookup
  ON gigi_personality(category, age_group);

COMMENT ON TABLE gigi_personality IS 'Age-appropriate Gigi catchphrases for consistent brand voice';

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total tables: 8
-- Total expected items: 2,280
-- Age groups: k2, grades35, grades68, grades912
--
-- k2 (K-2, Ages 5-8): Super simple, excited 🎉⭐
-- grades35 (3-5, Ages 8-11): Friendly, encouraging 🎯💡
-- grades68 (6-8, Ages 11-14): Mature, respectful 💪✓
-- grades912 (9-12, Ages 14-18): Professional, academic ✓📊
-- ============================================================================

-- Verify tables were created
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_name IN (
    'kid_stuck_responses',
    'subject_analogies',
    'parent_struggle_guides',
    'transition_phrases',
    'achievement_celebrations',
    'greeting_messages',
    'return_messages',
    'gigi_personality'
  );

  RAISE NOTICE '✅ Created % out of 8 seeding tables', table_count;

  IF table_count = 8 THEN
    RAISE NOTICE '🎉 All seeding tables created successfully!';
  ELSE
    RAISE WARNING '⚠️  Only % tables created. Expected 8.', table_count;
  END IF;
END $$;
