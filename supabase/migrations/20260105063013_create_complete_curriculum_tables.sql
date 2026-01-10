/*
  # Create Complete Curriculum System Tables

  This migration creates all the core tables needed for the SchoolGenius learning platform:

  ## Daily Planning & Scheduling
  1. `daily_schedule` - Kid's daily lesson plan with completion tracking

  ## Reading System
  2. `stories` - Reading stories organized by Lexile level
  3. `story_questions` - 10 ABCD questions per story
  4. `story_attempts` - Track reading attempts and scores
  5. `reading_progress` - Overall reading progress per child

  ## Rules & Testing
  6. `rules_library` - All rules by subject/grade
  7. `rule_mastery` - Track kid's rule knowledge
  8. `weekly_rules_tests` - Weekly comprehensive tests

  ## Typing System
  9. `typing_lessons` - Typing curriculum by phase
  10. `typing_progress` - Kid's typing progress
  11. `typing_attempts` - Each typing practice session

  ## Coding System
  12. `coding_templates` - Coding project templates
  13. `coding_progress` - Kid's coding project progress

  ## Spelling & Writing
  14. `spelling_words` - Word lists by grade
  15. `spelling_attempts` - Spelling practice attempts
  16. `writing_prompts` - Writing assignments
  17. `writing_submissions` - Kid's writing submissions

  ## Content & Help
  18. `parent_help_articles` - FAQ knowledge base
  19. `subject_intro_content` - Subject introduction lessons
  20. `subject_introductions` - Track completed intros

  ## Progress Tracking
  21. `skill_mastery` - Master tracking per skill
  22. `missing_content_requests` - Track content gaps

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users based on ownership
*/

-- =====================================================
-- TABLE 1: daily_schedule (Kid's "Today's Plan")
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  order_index INTEGER NOT NULL,
  lesson_type TEXT NOT NULL,
  subject_code TEXT,
  skill_code TEXT,
  lesson_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER DEFAULT 30,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  score INTEGER,
  stars INTEGER,
  coins_earned INTEGER DEFAULT 0,
  from_syllabus BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_schedule_child_date ON daily_schedule(child_id, date);

-- =====================================================
-- TABLE 2: stories (Reading stories by Lexile)
-- =====================================================
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lexile_band TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  genre TEXT NOT NULL,
  gender_target TEXT DEFAULT 'neutral',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  expected_time_minutes INTEGER NOT NULL,
  coins_reward INTEGER DEFAULT 25,
  bonus_coins INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_lexile ON stories(lexile_band);
CREATE INDEX IF NOT EXISTS idx_stories_grade ON stories(grade_level);

-- =====================================================
-- TABLE 3: story_questions (10 ABCD per story)
-- =====================================================
CREATE TABLE IF NOT EXISTS story_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  choice_a TEXT NOT NULL,
  choice_b TEXT NOT NULL,
  choice_c TEXT NOT NULL,
  choice_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_questions_story ON story_questions(story_id);

-- =====================================================
-- TABLE 4: story_attempts (Kid's reading attempts)
-- =====================================================
CREATE TABLE IF NOT EXISTS story_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  reading_time_seconds INTEGER,
  score INTEGER,
  result TEXT,
  coins_earned INTEGER DEFAULT 0,
  answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_attempts_child ON story_attempts(child_id);

-- =====================================================
-- TABLE 5: reading_progress (Track Lexile level)
-- =====================================================
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE UNIQUE,
  current_lexile_band TEXT NOT NULL DEFAULT 'BR-300L',
  stories_completed INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  average_score FLOAT DEFAULT 0,
  last_story_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 6: rules_library (All rules by subject/grade)
-- =====================================================
CREATE TABLE IF NOT EXISTS rules_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  rule_code TEXT NOT NULL UNIQUE,
  rule_name TEXT NOT NULL,
  rule_text TEXT NOT NULL,
  examples JSONB,
  common_mistakes JSONB,
  display_order INTEGER,
  is_foundational BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rules_subject_grade ON rules_library(subject_code, grade_level);

-- =====================================================
-- TABLE 7: rule_mastery (Track kid's rule knowledge)
-- =====================================================
CREATE TABLE IF NOT EXISTS rule_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  rule_code TEXT NOT NULL,
  times_tested INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  mastery_level TEXT DEFAULT 'learning',
  last_tested TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, rule_code)
);

-- =====================================================
-- TABLE 8: weekly_rules_tests (Weekly test tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS weekly_rules_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  scheduled_date DATE NOT NULL,
  taken_at TIMESTAMP,
  questions JSONB,
  answers JSONB,
  score INTEGER,
  percentage FLOAT,
  coins_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  penalty_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, week_start)
);

-- =====================================================
-- TABLE 9: typing_lessons (Typing curriculum)
-- =====================================================
CREATE TABLE IF NOT EXISTS typing_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  new_keys TEXT[],
  practice_text TEXT[],
  finger_positions JSONB,
  min_accuracy INTEGER DEFAULT 80,
  coins_reward INTEGER DEFAULT 10,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 10: typing_progress (Kid's typing progress)
-- =====================================================
CREATE TABLE IF NOT EXISTS typing_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE UNIQUE,
  current_phase INTEGER DEFAULT 1,
  current_lesson INTEGER DEFAULT 1,
  keys_mastered TEXT[] DEFAULT '{}',
  best_wpm INTEGER DEFAULT 0,
  best_accuracy INTEGER DEFAULT 0,
  total_time_practiced INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 11: typing_attempts (Each typing attempt)
-- =====================================================
CREATE TABLE IF NOT EXISTS typing_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES typing_lessons(id),
  phase INTEGER,
  accuracy FLOAT,
  wpm INTEGER,
  errors INTEGER,
  time_seconds INTEGER,
  passed BOOLEAN,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 12: coding_templates (Template library)
-- =====================================================
CREATE TABLE IF NOT EXISTS coding_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_code TEXT NOT NULL,
  concept_code TEXT NOT NULL,
  template_name TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  difficulty TEXT DEFAULT 'medium',
  tool TEXT NOT NULL,
  template_url TEXT,
  starter_code TEXT,
  instructions JSONB,
  challenge_prompt TEXT,
  estimated_minutes INTEGER DEFAULT 20,
  coins_basic INTEGER DEFAULT 50,
  coins_challenge INTEGER DEFAULT 75,
  thumbnail_url TEXT,
  is_new BOOLEAN DEFAULT true,
  times_built INTEGER DEFAULT 0,
  added_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coding_templates_level ON coding_templates(level_code);

-- =====================================================
-- TABLE 13: coding_progress (Kid's coding progress)
-- =====================================================
CREATE TABLE IF NOT EXISTS coding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  template_id UUID REFERENCES coding_templates(id),
  status TEXT DEFAULT 'not_started',
  project_url TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  coins_earned INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, template_id)
);

-- =====================================================
-- TABLE 14: spelling_words (Word lists by grade)
-- =====================================================
CREATE TABLE IF NOT EXISTS spelling_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level INTEGER NOT NULL,
  week_number INTEGER,
  word TEXT NOT NULL,
  rule_code TEXT,
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spelling_grade ON spelling_words(grade_level);

-- =====================================================
-- TABLE 15: spelling_attempts (Kid's spelling attempts)
-- =====================================================
CREATE TABLE IF NOT EXISTS spelling_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  word_id UUID REFERENCES spelling_words(id),
  word_text TEXT NOT NULL,
  typed_text TEXT NOT NULL,
  is_correct BOOLEAN,
  attempt_number INTEGER DEFAULT 1,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 16: writing_prompts (Writing prompts by grade)
-- =====================================================
CREATE TABLE IF NOT EXISTS writing_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level INTEGER NOT NULL,
  prompt_type TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  min_words INTEGER,
  max_words INTEGER,
  rubric JSONB,
  coins_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 17: writing_submissions (Kid's writing)
-- =====================================================
CREATE TABLE IF NOT EXISTS writing_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES writing_prompts(id),
  content TEXT NOT NULL,
  word_count INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW(),
  graded_at TIMESTAMP,
  grade JSONB,
  feedback TEXT,
  score INTEGER,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 18: parent_help_articles (FAQ knowledge base)
-- =====================================================
CREATE TABLE IF NOT EXISTS parent_help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question_pattern TEXT NOT NULL,
  keywords TEXT[],
  answer TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  times_served INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE 19: subject_intro_content (Subject introductions)
-- =====================================================
CREATE TABLE IF NOT EXISTS subject_intro_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  what_it_is TEXT NOT NULL,
  vocabulary JSONB,
  core_rules JSONB,
  shortcuts JSONB,
  common_mistakes JSONB,
  estimated_time_minutes INTEGER DEFAULT 5,
  coins_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(subject_code, grade_level)
);

-- =====================================================
-- TABLE 20: subject_introductions (Track who did intro)
-- =====================================================
CREATE TABLE IF NOT EXISTS subject_introductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  subject_code TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, subject_code)
);

-- =====================================================
-- TABLE 21: skill_mastery (Track mastery per skill)
-- =====================================================
CREATE TABLE IF NOT EXISTS skill_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  skill_code TEXT NOT NULL,
  mastery_level TEXT DEFAULT 'learning',
  mastery_score INTEGER DEFAULT 0,
  times_practiced INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  last_practiced TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, skill_code)
);

-- =====================================================
-- TABLE 22: missing_content_requests (Track gaps)
-- =====================================================
CREATE TABLE IF NOT EXISTS missing_content_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID,
  requested_subject TEXT,
  requested_topic TEXT,
  grade_level INTEGER,
  school_name TEXT,
  parent_id UUID,
  child_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ENABLE RLS ON ALL NEW TABLES
-- =====================================================
ALTER TABLE daily_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_rules_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE spelling_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE spelling_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_intro_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_introductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE missing_content_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Child-Owned Data
-- =====================================================

-- Daily Schedule Policies
CREATE POLICY "Parents can view their children's daily schedule"
  ON daily_schedule FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_schedule.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's daily schedule"
  ON daily_schedule FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = daily_schedule.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Story Attempts Policies
CREATE POLICY "Parents can view their children's story attempts"
  ON story_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = story_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's story attempts"
  ON story_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = story_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Reading Progress Policies
CREATE POLICY "Parents can view their children's reading progress"
  ON reading_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = reading_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's reading progress"
  ON reading_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = reading_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Rule Mastery Policies
CREATE POLICY "Parents can view their children's rule mastery"
  ON rule_mastery FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rule_mastery.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's rule mastery"
  ON rule_mastery FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rule_mastery.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Weekly Rules Tests Policies
CREATE POLICY "Parents can view their children's weekly tests"
  ON weekly_rules_tests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = weekly_rules_tests.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's weekly tests"
  ON weekly_rules_tests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = weekly_rules_tests.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Typing Progress Policies
CREATE POLICY "Parents can view their children's typing progress"
  ON typing_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's typing progress"
  ON typing_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Typing Attempts Policies
CREATE POLICY "Parents can view their children's typing attempts"
  ON typing_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create their children's typing attempts"
  ON typing_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Coding Progress Policies
CREATE POLICY "Parents can view their children's coding progress"
  ON coding_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = coding_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's coding progress"
  ON coding_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = coding_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Spelling Attempts Policies
CREATE POLICY "Parents can view their children's spelling attempts"
  ON spelling_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = spelling_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create their children's spelling attempts"
  ON spelling_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = spelling_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Writing Submissions Policies
CREATE POLICY "Parents can view their children's writing submissions"
  ON writing_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = writing_submissions.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's writing submissions"
  ON writing_submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = writing_submissions.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Subject Introductions Policies
CREATE POLICY "Parents can view their children's subject introductions"
  ON subject_introductions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = subject_introductions.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's subject introductions"
  ON subject_introductions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = subject_introductions.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Skill Mastery Policies
CREATE POLICY "Parents can view their children's skill mastery"
  ON skill_mastery FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = skill_mastery.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage their children's skill mastery"
  ON skill_mastery FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = skill_mastery.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES - Public Content (Read-Only)
-- =====================================================

-- Stories - All authenticated users can read
CREATE POLICY "Authenticated users can view stories"
  ON stories FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Story Questions - All authenticated users can read
CREATE POLICY "Authenticated users can view story questions"
  ON story_questions FOR SELECT
  TO authenticated
  USING (true);

-- Rules Library - All authenticated users can read
CREATE POLICY "Authenticated users can view rules library"
  ON rules_library FOR SELECT
  TO authenticated
  USING (true);

-- Typing Lessons - All authenticated users can read
CREATE POLICY "Authenticated users can view typing lessons"
  ON typing_lessons FOR SELECT
  TO authenticated
  USING (true);

-- Coding Templates - All authenticated users can read
CREATE POLICY "Authenticated users can view coding templates"
  ON coding_templates FOR SELECT
  TO authenticated
  USING (true);

-- Spelling Words - All authenticated users can read
CREATE POLICY "Authenticated users can view spelling words"
  ON spelling_words FOR SELECT
  TO authenticated
  USING (true);

-- Writing Prompts - All authenticated users can read
CREATE POLICY "Authenticated users can view writing prompts"
  ON writing_prompts FOR SELECT
  TO authenticated
  USING (true);

-- Subject Intro Content - All authenticated users can read
CREATE POLICY "Authenticated users can view subject intro content"
  ON subject_intro_content FOR SELECT
  TO authenticated
  USING (true);

-- Parent Help Articles - All authenticated users can read
CREATE POLICY "Authenticated users can view help articles"
  ON parent_help_articles FOR SELECT
  TO authenticated
  USING (true);

-- Missing Content Requests - Users can create their own
CREATE POLICY "Authenticated users can create content requests"
  ON missing_content_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);