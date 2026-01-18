/*
  # Complete SchoolGenius Database Schema

  1. New Tables
    - `coins_transactions` - Track all coin earning and spending like a bank ledger
    - `themes_catalog` - Available themes with pricing tiers
    - `syllabus_settings` - Per-child syllabus mode (default/custom/school)
    - `prizes_catalog` - Parent-created prizes and templates
    - `prize_redemptions` - Track when kids redeem prizes
    - `notification_settings` - Parent notification preferences
    - `notification_log` - History of sent notifications
    - `lesson_progress` - Track skill completion and scores
    - `lesson_content` - Grok-generated lesson content storage
    - `typing_lessons` - Track typing lesson progress
    - `typing_tests` - Store typing test results
    - `typing_games` - Track typing game scores
    - `spaced_reviews` - Schedule for spaced repetition
    - `answer_attempts` - Log every answer for Claude monitoring
    - `xp_transactions` - Track XP earning
    - `streak_history` - Track streak milestones

  2. Updates
    - Add missing fields to existing tables

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for authenticated users
*/

-- Coins Transactions (real currency ledger)
CREATE TABLE IF NOT EXISTS coins_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'refund')),
  amount integer NOT NULL,
  reason text NOT NULL,
  balance_after integer NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coins_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's coin transactions"
  ON coins_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = coins_transactions.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Themes Catalog
CREATE TABLE IF NOT EXISTS themes_catalog (
  id text PRIMARY KEY,
  name text NOT NULL,
  age_group text NOT NULL CHECK (age_group IN ('K-2', '3-5', '6-8', '9-12')),
  category text NOT NULL,
  price_tier text NOT NULL CHECK (price_tier IN ('free', 'basic', 'popular', 'premium')),
  coin_cost integer NOT NULL DEFAULT 0,
  preview_image text,
  tutor_name text NOT NULL DEFAULT 'Gigi',
  tutor_personality text,
  is_active boolean DEFAULT true,
  boy_vibe boolean DEFAULT false,
  girl_vibe boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE themes_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active themes"
  ON themes_catalog FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Syllabus Settings
CREATE TABLE IF NOT EXISTS syllabus_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE UNIQUE NOT NULL,
  mode text NOT NULL DEFAULT 'default' CHECK (mode IN ('default', 'custom', 'school')),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE syllabus_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage their children's syllabus settings"
  ON syllabus_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = syllabus_settings.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = syllabus_settings.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Prizes Catalog (parent-created + templates)
CREATE TABLE IF NOT EXISTS prizes_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  coin_cost integer NOT NULL,
  category text NOT NULL DEFAULT 'custom',
  image_url text,
  quantity integer,
  is_template boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prizes_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage their own prizes"
  ON prizes_catalog FOR ALL
  TO authenticated
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());

-- Prize Redemptions
CREATE TABLE IF NOT EXISTS prize_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  prize_id uuid REFERENCES prizes_catalog(id) ON DELETE SET NULL,
  prize_name text NOT NULL,
  coin_cost integer NOT NULL,
  parent_notified boolean DEFAULT false,
  fulfilled boolean DEFAULT false,
  redeemed_at timestamptz DEFAULT now()
);

ALTER TABLE prize_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's prize redemptions"
  ON prize_redemptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = prize_redemptions.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update redemption status"
  ON prize_redemptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = prize_redemptions.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = prize_redemptions.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Notification Settings
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  perfect_score boolean DEFAULT false,
  lesson_complete boolean DEFAULT false,
  subject_mastered boolean DEFAULT false,
  streak_milestone boolean DEFAULT false,
  badge_unlocked boolean DEFAULT false,
  level_up boolean DEFAULT false,
  prize_redemption boolean DEFAULT true,
  test_reminder boolean DEFAULT false,
  inactive_reminder boolean DEFAULT false,
  weekly_report boolean DEFAULT true,
  frequency text DEFAULT 'weekly' CHECK (frequency IN ('instant', 'daily', 'weekly')),
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT false,
  phone_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage their own notification settings"
  ON notification_settings FOR ALL
  TO authenticated
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());

-- Notification Log
CREATE TABLE IF NOT EXISTS notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  sent_via text NOT NULL CHECK (sent_via IN ('email', 'sms')),
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own notification log"
  ON notification_log FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid());

-- Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  subject_code text NOT NULL,
  skill_id uuid REFERENCES curriculum_skills(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  completed boolean DEFAULT false,
  score integer,
  stars integer DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  attempts integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  completed_at timestamptz,
  last_attempt_at timestamptz DEFAULT now(),
  UNIQUE(child_id, skill_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = lesson_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Lesson Content (Grok-generated, stored)
CREATE TABLE IF NOT EXISTS lesson_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid REFERENCES curriculum_skills(id) ON DELETE CASCADE UNIQUE NOT NULL,
  subject_code text NOT NULL,
  skill_name text NOT NULL,
  rules_text text,
  rules_audio_script text,
  demo_problems jsonb DEFAULT '[]'::jsonb,
  guided_practice jsonb DEFAULT '[]'::jsonb,
  independent_practice jsonb DEFAULT '[]'::jsonb,
  challenge_problems jsonb DEFAULT '[]'::jsonb,
  quiz_questions jsonb DEFAULT '[]'::jsonb,
  review_questions jsonb DEFAULT '[]'::jsonb,
  generated_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view lesson content"
  ON lesson_content FOR SELECT
  TO authenticated
  USING (true);

-- Typing Lessons Progress
CREATE TABLE IF NOT EXISTS typing_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  lesson_number integer NOT NULL CHECK (lesson_number >= 1 AND lesson_number <= 20),
  completed boolean DEFAULT false,
  best_wpm integer DEFAULT 0,
  best_accuracy integer DEFAULT 0,
  attempts integer DEFAULT 0,
  completed_at timestamptz,
  last_attempt_at timestamptz DEFAULT now(),
  UNIQUE(child_id, lesson_number)
);

ALTER TABLE typing_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Children's typing progress is viewable by parents"
  ON typing_lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_lessons.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_lessons.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Typing Tests
CREATE TABLE IF NOT EXISTS typing_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  duration_seconds integer NOT NULL,
  wpm integer NOT NULL,
  accuracy integer NOT NULL,
  errors integer DEFAULT 0,
  is_personal_best boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE typing_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Children's typing tests are viewable by parents"
  ON typing_tests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_tests.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_tests.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Typing Games
CREATE TABLE IF NOT EXISTS typing_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  game_type text NOT NULL CHECK (game_type IN ('falling_words', 'type_racer', 'word_zapper')),
  score integer NOT NULL DEFAULT 0,
  level_reached integer DEFAULT 1,
  wpm_during_game integer,
  is_high_score boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE typing_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Children's typing games are viewable by parents"
  ON typing_games FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_games.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = typing_games.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Spaced Reviews
CREATE TABLE IF NOT EXISTS spaced_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  subject_code text NOT NULL,
  skill_id uuid REFERENCES curriculum_skills(id) ON DELETE CASCADE NOT NULL,
  next_review_date date NOT NULL,
  interval_days integer DEFAULT 1,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, skill_id)
);

ALTER TABLE spaced_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spaced reviews are viewable by parents"
  ON spaced_reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = spaced_reviews.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = spaced_reviews.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Answer Attempts (for Claude monitoring)
CREATE TABLE IF NOT EXISTS answer_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES curriculum_skills(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  answer_given text NOT NULL,
  is_correct boolean NOT NULL,
  time_spent_seconds integer DEFAULT 0,
  help_requested boolean DEFAULT false,
  tutor_intervened boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE answer_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Answer attempts are viewable by parents"
  ON answer_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = answer_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- XP Transactions
CREATE TABLE IF NOT EXISTS xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  reason text NOT NULL,
  level_before integer NOT NULL,
  level_after integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's XP transactions"
  ON xp_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = xp_transactions.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Streak History
CREATE TABLE IF NOT EXISTS streak_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  streak_count integer NOT NULL,
  milestone_reached integer,
  bonus_coins integer DEFAULT 0,
  broken_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's streak history"
  ON streak_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = streak_history.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Add missing columns to existing tables
DO $$
BEGIN
  -- Add streak fields to children if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'current_streak'
  ) THEN
    ALTER TABLE children ADD COLUMN current_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'longest_streak'
  ) THEN
    ALTER TABLE children ADD COLUMN longest_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'last_activity_date'
  ) THEN
    ALTER TABLE children ADD COLUMN last_activity_date date;
  END IF;

  -- Add XP fields if not exists (they should exist but just in case)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'xp'
  ) THEN
    ALTER TABLE children ADD COLUMN xp integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'level'
  ) THEN
    ALTER TABLE children ADD COLUMN level integer DEFAULT 1;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coins_transactions_child_id ON coins_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_coins_transactions_created_at ON coins_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_prize_redemptions_child_id ON prize_redemptions(child_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_child_id ON lesson_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_skill_id ON lesson_progress(skill_id);
CREATE INDEX IF NOT EXISTS idx_answer_attempts_child_id ON answer_attempts(child_id);
CREATE INDEX IF NOT EXISTS idx_answer_attempts_skill_id ON answer_attempts(skill_id);
CREATE INDEX IF NOT EXISTS idx_spaced_reviews_next_review ON spaced_reviews(next_review_date);
CREATE INDEX IF NOT EXISTS idx_typing_lessons_child_id ON typing_lessons(child_id);
CREATE INDEX IF NOT EXISTS idx_typing_tests_child_id ON typing_tests(child_id);
CREATE INDEX IF NOT EXISTS idx_typing_games_child_id ON typing_games(child_id);
