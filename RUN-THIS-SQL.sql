-- ============================================================================
-- COPY THIS ENTIRE FILE AND RUN IN SUPABASE SQL EDITOR
-- ============================================================================
-- Go to: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql
-- Paste this entire file
-- Click "Run"
-- Done!
-- ============================================================================

-- Table 1: Q&A Library
CREATE TABLE IF NOT EXISTS qa_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  answer_k2 TEXT NOT NULL,
  answer_35 TEXT NOT NULL,
  answer_68 TEXT NOT NULL,
  answer_912 TEXT NOT NULL,
  times_served INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_qa_library_category ON qa_library(category);
CREATE INDEX IF NOT EXISTS idx_qa_library_question ON qa_library(question);
ALTER TABLE qa_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access qa_library" ON qa_library;
CREATE POLICY "Service role full access qa_library" ON qa_library FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read qa_library" ON qa_library;
CREATE POLICY "Anyone can read qa_library" ON qa_library FOR SELECT USING (true);

-- Table 2: Subject Analogies
CREATE TABLE IF NOT EXISTS subject_analogies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID,
  subject_code TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  analogy TEXT NOT NULL,
  explanation TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subject_analogies_skill ON subject_analogies(skill_id);
CREATE INDEX IF NOT EXISTS idx_subject_analogies_age ON subject_analogies(age_group);
ALTER TABLE subject_analogies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access subject_analogies" ON subject_analogies;
CREATE POLICY "Service role full access subject_analogies" ON subject_analogies FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read analogies" ON subject_analogies;
CREATE POLICY "Anyone can read analogies" ON subject_analogies FOR SELECT USING (true);

-- Table 3: Return Messages
CREATE TABLE IF NOT EXISTS return_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  absence_period TEXT NOT NULL,
  age_group TEXT NOT NULL,
  message TEXT NOT NULL,
  tone TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_return_messages_age ON return_messages(age_group);
CREATE INDEX IF NOT EXISTS idx_return_messages_period ON return_messages(absence_period);
ALTER TABLE return_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access return_messages" ON return_messages;
CREATE POLICY "Service role full access return_messages" ON return_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read return messages" ON return_messages;
CREATE POLICY "Anyone can read return messages" ON return_messages FOR SELECT USING (true);

-- Table 4: Gigi Personality
CREATE TABLE IF NOT EXISTS gigi_personality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  age_group TEXT NOT NULL,
  trait TEXT NOT NULL,
  example_phrase TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gigi_personality_age ON gigi_personality(age_group);
CREATE INDEX IF NOT EXISTS idx_gigi_personality_category ON gigi_personality(category);
ALTER TABLE gigi_personality ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access gigi_personality" ON gigi_personality;
CREATE POLICY "Service role full access gigi_personality" ON gigi_personality FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read gigi personality" ON gigi_personality;
CREATE POLICY "Anyone can read gigi personality" ON gigi_personality FOR SELECT USING (true);

-- Table 5: Kid Stuck Responses
CREATE TABLE IF NOT EXISTS kid_stuck_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL,
  response TEXT NOT NULL,
  response_tone TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kid_stuck_type ON kid_stuck_responses(question_type);
CREATE INDEX IF NOT EXISTS idx_kid_stuck_age ON kid_stuck_responses(age_group);
ALTER TABLE kid_stuck_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access kid_stuck" ON kid_stuck_responses;
CREATE POLICY "Service role full access kid_stuck" ON kid_stuck_responses FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read kid stuck" ON kid_stuck_responses;
CREATE POLICY "Anyone can read kid stuck" ON kid_stuck_responses FOR SELECT USING (true);

-- Table 6: Transition Phrases
CREATE TABLE IF NOT EXISTS transition_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_subject TEXT NOT NULL,
  to_subject TEXT NOT NULL,
  age_group TEXT NOT NULL,
  phrase TEXT NOT NULL,
  tone TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transition_age ON transition_phrases(age_group);
ALTER TABLE transition_phrases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access transitions" ON transition_phrases;
CREATE POLICY "Service role full access transitions" ON transition_phrases FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read transitions" ON transition_phrases;
CREATE POLICY "Anyone can read transitions" ON transition_phrases FOR SELECT USING (true);

-- Table 7: Celebration Messages
CREATE TABLE IF NOT EXISTS celebration_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_type TEXT NOT NULL,
  age_group TEXT NOT NULL,
  message TEXT NOT NULL,
  tone TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celebration_milestone ON celebration_messages(milestone_type);
CREATE INDEX IF NOT EXISTS idx_celebration_age ON celebration_messages(age_group);
ALTER TABLE celebration_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access celebrations" ON celebration_messages;
CREATE POLICY "Service role full access celebrations" ON celebration_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read celebrations" ON celebration_messages;
CREATE POLICY "Anyone can read celebrations" ON celebration_messages FOR SELECT USING (true);

-- Table 8: Greeting Messages
CREATE TABLE IF NOT EXISTS greeting_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_of_day TEXT NOT NULL,
  age_group TEXT NOT NULL,
  greeting TEXT NOT NULL,
  tone TEXT NOT NULL,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_greeting_time ON greeting_messages(time_of_day);
CREATE INDEX IF NOT EXISTS idx_greeting_age ON greeting_messages(age_group);
ALTER TABLE greeting_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access greetings" ON greeting_messages;
CREATE POLICY "Service role full access greetings" ON greeting_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read greetings" ON greeting_messages;
CREATE POLICY "Anyone can read greetings" ON greeting_messages FOR SELECT USING (true);

-- Success!
SELECT 'All 8 seeding tables created successfully! 🎉' AS status;
