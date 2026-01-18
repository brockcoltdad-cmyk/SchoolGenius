-- SchoolGenius Lesson Flow Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql

-- 1. Rule Teaching Scripts (Phase 1)
CREATE TABLE IF NOT EXISTS rule_teaching_scripts (
  id SERIAL PRIMARY KEY,
  rule_id TEXT UNIQUE NOT NULL,
  rule_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  standard TEXT,
  teaching_script JSONB NOT NULL,
  rule_card JSONB NOT NULL,
  total_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Demo Problems (Phase 2)
CREATE TABLE IF NOT EXISTS demo_problems (
  id SERIAL PRIMARY KEY,
  demo_id TEXT UNIQUE NOT NULL,
  rule_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  standard TEXT,
  problem TEXT NOT NULL,
  answer TEXT NOT NULL,
  walkthrough JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Guided Practice (Phase 3)
CREATE TABLE IF NOT EXISTS guided_practice (
  id SERIAL PRIMARY KEY,
  guided_id TEXT UNIQUE NOT NULL,
  rule_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  standard TEXT,
  problem TEXT NOT NULL,
  answer TEXT NOT NULL,
  hints JSONB NOT NULL,
  solution JSONB,
  encouragement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Weekly Quizzes (Phase 5)
CREATE TABLE IF NOT EXISTS weekly_quizzes (
  id SERIAL PRIMARY KEY,
  quiz_id TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  week INTEGER NOT NULL,
  rules_covered JSONB NOT NULL,
  questions JSONB NOT NULL,
  pass_threshold INTEGER DEFAULT 80,
  reward_coins INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Monthly Reviews (Phase 7)
CREATE TABLE IF NOT EXISTS monthly_reviews (
  id SERIAL PRIMARY KEY,
  review_id TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  month INTEGER NOT NULL,
  rules_covered JSONB NOT NULL,
  questions JSONB NOT NULL,
  pass_threshold INTEGER DEFAULT 80,
  time_limit INTEGER DEFAULT 1800,
  reward_coins INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_rule_teaching_subject_grade ON rule_teaching_scripts(subject, grade);
CREATE INDEX IF NOT EXISTS idx_demo_rule_id ON demo_problems(rule_id);
CREATE INDEX IF NOT EXISTS idx_guided_rule_id ON guided_practice(rule_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject_grade ON weekly_quizzes(subject, grade);
CREATE INDEX IF NOT EXISTS idx_reviews_subject_grade ON monthly_reviews(subject, grade);

-- Enable RLS (Row Level Security)
ALTER TABLE rule_teaching_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access (content is pre-seeded, no personal data)
CREATE POLICY "Public read access" ON rule_teaching_scripts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON demo_problems FOR SELECT USING (true);
CREATE POLICY "Public read access" ON guided_practice FOR SELECT USING (true);
CREATE POLICY "Public read access" ON weekly_quizzes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON monthly_reviews FOR SELECT USING (true);

-- Service role can do everything (for seeding)
CREATE POLICY "Service role full access" ON rule_teaching_scripts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON demo_problems FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON guided_practice FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON weekly_quizzes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON monthly_reviews FOR ALL USING (auth.role() = 'service_role');

-- Verify tables created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('rule_teaching_scripts', 'demo_problems', 'guided_practice', 'weekly_quizzes', 'monthly_reviews');
