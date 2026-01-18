-- ============================================================================
-- CREATE SEEDING TABLES FOR PARALLEL GENERATION
-- ============================================================================
-- Run this in Supabase SQL Editor before launching workers
-- ============================================================================

-- Table 1: Q&A Library (140 questions)
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

-- Table 2: Subject Analogies
CREATE TABLE IF NOT EXISTS subject_analogies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES curriculum_skills(id) ON DELETE CASCADE,
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

-- Table 3: Parent Help Articles (already exists, verify structure)
CREATE TABLE IF NOT EXISTS parent_help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  question_category TEXT NOT NULL,
  answer TEXT NOT NULL,
  quick_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  times_viewed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_help_subject ON parent_help_articles(subject);

-- Table 4: Return Messages
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

-- Table 5: Gigi Personality
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

-- Table 6: Kid Stuck Responses (might already exist)
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

-- Table 7: Transition Phrases
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

-- Table 8: Celebration Messages
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

-- Table 9: Greeting Messages
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

-- Enable RLS on all tables
ALTER TABLE qa_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_analogies ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigi_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE kid_stuck_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transition_phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE celebration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE greeting_messages ENABLE ROW LEVEL SECURITY;

-- Service role can do anything (for seeding)
CREATE POLICY "Service role full access qa_library" ON qa_library FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access subject_analogies" ON subject_analogies FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access parent_help" ON parent_help_articles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access return_messages" ON return_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access gigi_personality" ON gigi_personality FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access kid_stuck" ON kid_stuck_responses FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access transitions" ON transition_phrases FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access celebrations" ON celebration_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access greetings" ON greeting_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Everyone can read (educational content)
CREATE POLICY "Anyone can read qa_library" ON qa_library FOR SELECT USING (true);
CREATE POLICY "Anyone can read analogies" ON subject_analogies FOR SELECT USING (true);
CREATE POLICY "Anyone can read parent help" ON parent_help_articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read return messages" ON return_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can read gigi personality" ON gigi_personality FOR SELECT USING (true);
CREATE POLICY "Anyone can read kid stuck" ON kid_stuck_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can read transitions" ON transition_phrases FOR SELECT USING (true);
CREATE POLICY "Anyone can read celebrations" ON celebration_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can read greetings" ON greeting_messages FOR SELECT USING (true);

-- Success message
SELECT 'All seeding tables created successfully! 🎉' AS status;
