/*
  # Create Missing Content Tables with Service Role Policies

  ## New Tables Created (6 total)
  
  1. **weekly_test_questions**
     - Stores questions for weekly rules/knowledge tests
     - Links to subjects and grade levels
     - Includes question text, options, correct answer
  
  2. **encouragement_messages**
     - Motivational messages shown to students
     - Categorized by trigger events (level up, streak, struggle, etc)
     - Age-appropriate messaging
  
  3. **qa_library**
     - Student question and answer library
     - FAQs and common questions with answers
     - Searchable by keywords and categories
  
  4. **platform_events**
     - Tracks platform-wide events and milestones
     - System announcements, challenges, special events
     - Date-based activation
  
  5. **platform_insights**
     - Analytics and insights about platform usage
     - Aggregate data for dashboards and reports
     - Trend analysis data
  
  6. **phillip_reports**
     - AI-generated progress reports
     - Personalized insights for parents
     - Weekly/monthly summaries

  ## Security
  - All tables have RLS enabled
  - Service role has full CRUD access (SELECT, INSERT, UPDATE, DELETE)
  - Authenticated users have SELECT access where appropriate
*/

-- =============================================================================
-- WEEKLY_TEST_QUESTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS weekly_test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code text NOT NULL,
  grade_level integer NOT NULL,
  rule_code text,
  question_text text NOT NULL,
  question_type text DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'fill_blank')),
  choice_a text,
  choice_b text,
  choice_c text,
  choice_d text,
  correct_answer text NOT NULL,
  explanation text,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points integer DEFAULT 1,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select weekly test questions"
  ON weekly_test_questions FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert weekly test questions"
  ON weekly_test_questions FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update weekly test questions"
  ON weekly_test_questions FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete weekly test questions"
  ON weekly_test_questions FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can view active weekly test questions"
  ON weekly_test_questions FOR SELECT
  TO authenticated
  USING (is_active = true);

-- =============================================================================
-- ENCOURAGEMENT_MESSAGES
-- =============================================================================

CREATE TABLE IF NOT EXISTS encouragement_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_event text NOT NULL CHECK (trigger_event IN ('level_up', 'streak_milestone', 'perfect_score', 'comeback', 'struggle_support', 'first_lesson', 'daily_login', 'challenge_complete')),
  age_group text NOT NULL CHECK (age_group IN ('K-2', '3-5', '6-8', '9-12')),
  message_text text NOT NULL,
  tone text DEFAULT 'encouraging' CHECK (tone IN ('encouraging', 'celebratory', 'supportive', 'motivational', 'playful')),
  includes_emoji boolean DEFAULT true,
  weight integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE encouragement_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select encouragement messages"
  ON encouragement_messages FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert encouragement messages"
  ON encouragement_messages FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update encouragement messages"
  ON encouragement_messages FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete encouragement messages"
  ON encouragement_messages FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can view active encouragement messages"
  ON encouragement_messages FOR SELECT
  TO authenticated
  USING (is_active = true);

-- =============================================================================
-- QA_LIBRARY
-- =============================================================================

CREATE TABLE IF NOT EXISTS qa_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('homework_help', 'concept_explanation', 'study_tips', 'parent_guidance', 'technical_support', 'subject_specific', 'general')),
  subject_code text,
  grade_level integer,
  question_pattern text NOT NULL,
  keywords text[] DEFAULT ARRAY[]::text[],
  answer_text text NOT NULL,
  follow_up_questions text[],
  related_links jsonb,
  confidence_threshold double precision DEFAULT 0.8,
  times_served integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qa_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select qa library"
  ON qa_library FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert qa library"
  ON qa_library FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update qa library"
  ON qa_library FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete qa library"
  ON qa_library FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can view active qa library"
  ON qa_library FOR SELECT
  TO authenticated
  USING (is_active = true);

-- =============================================================================
-- PLATFORM_EVENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS platform_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('challenge', 'contest', 'announcement', 'maintenance', 'feature_launch', 'seasonal', 'milestone')),
  title text NOT NULL,
  description text,
  event_data jsonb DEFAULT '{}'::jsonb,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  target_age_groups text[] DEFAULT ARRAY['K-2', '3-5', '6-8', '9-12']::text[],
  priority integer DEFAULT 0,
  banner_image_url text,
  call_to_action text,
  cta_link text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select platform events"
  ON platform_events FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert platform events"
  ON platform_events FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update platform events"
  ON platform_events FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete platform events"
  ON platform_events FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can view active platform events"
  ON platform_events FOR SELECT
  TO authenticated
  USING (is_active = true AND start_date <= now() AND (end_date IS NULL OR end_date >= now()));

-- =============================================================================
-- PLATFORM_INSIGHTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS platform_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL CHECK (insight_type IN ('usage_trend', 'popular_subject', 'completion_rate', 'engagement_metric', 'performance_pattern', 'time_analysis', 'achievement_stat')),
  time_period text NOT NULL CHECK (time_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'all_time')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric,
  metric_data jsonb DEFAULT '{}'::jsonb,
  comparison_previous numeric,
  trend_direction text CHECK (trend_direction IN ('up', 'down', 'stable')),
  insights_text text,
  recommendations text[],
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select platform insights"
  ON platform_insights FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert platform insights"
  ON platform_insights FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update platform insights"
  ON platform_insights FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete platform insights"
  ON platform_insights FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can view published platform insights"
  ON platform_insights FOR SELECT
  TO authenticated
  USING (is_published = true);

-- =============================================================================
-- PHILLIP_REPORTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS phillip_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('weekly', 'monthly', 'progress', 'achievement', 'concern', 'milestone', 'custom')),
  report_period_start date NOT NULL,
  report_period_end date NOT NULL,
  overall_summary text NOT NULL,
  subjects_analysis jsonb DEFAULT '{}'::jsonb,
  strengths text[],
  areas_for_growth text[],
  recommendations text[],
  achievements_earned text[],
  time_spent_minutes integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  average_score double precision,
  mood_assessment text CHECK (mood_assessment IN ('excellent', 'good', 'neutral', 'struggling', 'needs_support')),
  parent_action_items text[],
  celebration_moments text[],
  generated_at timestamptz DEFAULT now(),
  sent_to_parent boolean DEFAULT false,
  sent_at timestamptz,
  parent_viewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phillip_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can select phillip reports"
  ON phillip_reports FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert phillip reports"
  ON phillip_reports FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update phillip reports"
  ON phillip_reports FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete phillip reports"
  ON phillip_reports FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Parents can view their children's phillip reports"
  ON phillip_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = phillip_reports.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_weekly_test_questions_subject_grade 
  ON weekly_test_questions(subject_code, grade_level) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_encouragement_messages_trigger_age 
  ON encouragement_messages(trigger_event, age_group) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_qa_library_category_subject 
  ON qa_library(category, subject_code) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_platform_events_dates 
  ON platform_events(start_date, end_date) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_platform_insights_period 
  ON platform_insights(time_period, period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_phillip_reports_child_date 
  ON phillip_reports(child_id, report_period_end DESC);