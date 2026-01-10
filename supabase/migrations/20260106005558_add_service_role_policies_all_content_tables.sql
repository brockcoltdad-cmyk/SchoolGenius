/*
  # Add Service Role Policies for All Content Tables

  ## Purpose
  Enable Python scripts (NOW) and Edge Functions (LATER) to manage content using service_role key.

  ## Tables Updated (9 total)
  1. lesson_content (add SELECT and DELETE only - INSERT/UPDATE already exist)
  2. stories
  3. story_questions
  4. spelling_words
  5. writing_prompts
  6. rules_library
  7. parent_help_articles
  8. subject_intro_content
  9. coding_templates

  ## Policies Added
  For each table, 4 policies are created:
  - SELECT policy (read access)
  - INSERT policy (create access)
  - UPDATE policy (modify access)
  - DELETE policy (remove access)

  ## Security Notes
  - service_role is a trusted backend identity
  - These policies enable automated content generation and management
  - Frontend users continue to have restricted access via their own policies

  ## Note on Missing Tables
  The following tables from the request do not exist and are skipped:
  - weekly_test_questions
  - encouragement_messages
  - qa_library
  - platform_events
  - platform_insights
  - phillip_reports
*/

-- =============================================================================
-- LESSON_CONTENT
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'lesson_content' 
    AND policyname = 'Service role can select lesson content'
  ) THEN
    CREATE POLICY "Service role can select lesson content"
      ON lesson_content FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'lesson_content' 
    AND policyname = 'Service role can delete lesson content'
  ) THEN
    CREATE POLICY "Service role can delete lesson content"
      ON lesson_content FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- STORIES
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'stories' 
    AND policyname = 'Service role can select stories'
  ) THEN
    CREATE POLICY "Service role can select stories"
      ON stories FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'stories' 
    AND policyname = 'Service role can insert stories'
  ) THEN
    CREATE POLICY "Service role can insert stories"
      ON stories FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'stories' 
    AND policyname = 'Service role can update stories'
  ) THEN
    CREATE POLICY "Service role can update stories"
      ON stories FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'stories' 
    AND policyname = 'Service role can delete stories'
  ) THEN
    CREATE POLICY "Service role can delete stories"
      ON stories FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- STORY_QUESTIONS
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'story_questions' 
    AND policyname = 'Service role can select story questions'
  ) THEN
    CREATE POLICY "Service role can select story questions"
      ON story_questions FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'story_questions' 
    AND policyname = 'Service role can insert story questions'
  ) THEN
    CREATE POLICY "Service role can insert story questions"
      ON story_questions FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'story_questions' 
    AND policyname = 'Service role can update story questions'
  ) THEN
    CREATE POLICY "Service role can update story questions"
      ON story_questions FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'story_questions' 
    AND policyname = 'Service role can delete story questions'
  ) THEN
    CREATE POLICY "Service role can delete story questions"
      ON story_questions FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- SPELLING_WORDS
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'spelling_words' 
    AND policyname = 'Service role can select spelling words'
  ) THEN
    CREATE POLICY "Service role can select spelling words"
      ON spelling_words FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'spelling_words' 
    AND policyname = 'Service role can insert spelling words'
  ) THEN
    CREATE POLICY "Service role can insert spelling words"
      ON spelling_words FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'spelling_words' 
    AND policyname = 'Service role can update spelling words'
  ) THEN
    CREATE POLICY "Service role can update spelling words"
      ON spelling_words FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'spelling_words' 
    AND policyname = 'Service role can delete spelling words'
  ) THEN
    CREATE POLICY "Service role can delete spelling words"
      ON spelling_words FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- WRITING_PROMPTS
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'writing_prompts' 
    AND policyname = 'Service role can select writing prompts'
  ) THEN
    CREATE POLICY "Service role can select writing prompts"
      ON writing_prompts FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'writing_prompts' 
    AND policyname = 'Service role can insert writing prompts'
  ) THEN
    CREATE POLICY "Service role can insert writing prompts"
      ON writing_prompts FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'writing_prompts' 
    AND policyname = 'Service role can update writing prompts'
  ) THEN
    CREATE POLICY "Service role can update writing prompts"
      ON writing_prompts FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'writing_prompts' 
    AND policyname = 'Service role can delete writing prompts'
  ) THEN
    CREATE POLICY "Service role can delete writing prompts"
      ON writing_prompts FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- RULES_LIBRARY
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rules_library' 
    AND policyname = 'Service role can select rules library'
  ) THEN
    CREATE POLICY "Service role can select rules library"
      ON rules_library FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rules_library' 
    AND policyname = 'Service role can insert rules library'
  ) THEN
    CREATE POLICY "Service role can insert rules library"
      ON rules_library FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rules_library' 
    AND policyname = 'Service role can update rules library'
  ) THEN
    CREATE POLICY "Service role can update rules library"
      ON rules_library FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rules_library' 
    AND policyname = 'Service role can delete rules library'
  ) THEN
    CREATE POLICY "Service role can delete rules library"
      ON rules_library FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- PARENT_HELP_ARTICLES
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'parent_help_articles' 
    AND policyname = 'Service role can select parent help articles'
  ) THEN
    CREATE POLICY "Service role can select parent help articles"
      ON parent_help_articles FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'parent_help_articles' 
    AND policyname = 'Service role can insert parent help articles'
  ) THEN
    CREATE POLICY "Service role can insert parent help articles"
      ON parent_help_articles FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'parent_help_articles' 
    AND policyname = 'Service role can update parent help articles'
  ) THEN
    CREATE POLICY "Service role can update parent help articles"
      ON parent_help_articles FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'parent_help_articles' 
    AND policyname = 'Service role can delete parent help articles'
  ) THEN
    CREATE POLICY "Service role can delete parent help articles"
      ON parent_help_articles FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- SUBJECT_INTRO_CONTENT
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'subject_intro_content' 
    AND policyname = 'Service role can select subject intro content'
  ) THEN
    CREATE POLICY "Service role can select subject intro content"
      ON subject_intro_content FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'subject_intro_content' 
    AND policyname = 'Service role can insert subject intro content'
  ) THEN
    CREATE POLICY "Service role can insert subject intro content"
      ON subject_intro_content FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'subject_intro_content' 
    AND policyname = 'Service role can update subject intro content'
  ) THEN
    CREATE POLICY "Service role can update subject intro content"
      ON subject_intro_content FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'subject_intro_content' 
    AND policyname = 'Service role can delete subject intro content'
  ) THEN
    CREATE POLICY "Service role can delete subject intro content"
      ON subject_intro_content FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;

-- =============================================================================
-- CODING_TEMPLATES
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'coding_templates' 
    AND policyname = 'Service role can select coding templates'
  ) THEN
    CREATE POLICY "Service role can select coding templates"
      ON coding_templates FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'coding_templates' 
    AND policyname = 'Service role can insert coding templates'
  ) THEN
    CREATE POLICY "Service role can insert coding templates"
      ON coding_templates FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'coding_templates' 
    AND policyname = 'Service role can update coding templates'
  ) THEN
    CREATE POLICY "Service role can update coding templates"
      ON coding_templates FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'coding_templates' 
    AND policyname = 'Service role can delete coding templates'
  ) THEN
    CREATE POLICY "Service role can delete coding templates"
      ON coding_templates FOR DELETE
      TO service_role
      USING (true);
  END IF;
END $$;