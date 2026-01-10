/*
  # Add Learning Profiles System

  ## Overview
  Tracks each student's learning preferences, patterns, and performance data.
  Used by Gigi to personalize explanations, examples, and pacing.

  ## New Table

  ### `learning_profiles`
  Comprehensive learning profile for each student
  - `id` (uuid, primary key)
  - `child_id` (uuid, references children) - One profile per student
  - `primary_learning_style` (text) - Main learning modality
  - `secondary_learning_style` (text) - Backup learning modality
  - `preferred_pace` (text) - How fast they like to learn
  - `frustration_threshold` (integer) - Wrong answers before frustration
  - `needs_more_examples` (boolean) - Needs extra examples
  - `responds_to_encouragement` (boolean) - Motivational style
  - `responds_to_challenges` (boolean) - Competitive style
  - `strongest_subjects` (text[]) - Best academic subjects
  - `weakest_subjects` (text[]) - Struggling subjects
  - `favorite_subjects` (text[]) - What they ENJOY (different from strongest)
  - `preferred_example_types` (text[]) - Interest areas for examples
  - `best_time_of_day` (text) - Peak learning time
  - `average_session_length` (integer) - Typical session duration
  - `confidence_level` (text) - Overall confidence
  - `total_questions_answered` (integer) - Lifetime question count
  - `total_questions_correct` (integer) - Lifetime correct count
  - `overall_accuracy` (float) - Success rate
  - `learning_style_confidence` (float 0-1) - How sure we are about their style
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Parents can view and update their children's profiles
  - Auto-created when child account is created
  - Auto-deleted when child account is deleted (CASCADE)

  ## Usage
  - Auto-detection runs after every 20 questions
  - Gigi pulls this data into system prompt for personalization
  - Parent dashboard can show insights
*/

-- Learning Profiles (AI-powered personalization)
CREATE TABLE IF NOT EXISTS learning_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE UNIQUE,
  
  -- Learning modalities
  primary_learning_style text DEFAULT 'visual' CHECK (primary_learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')),
  secondary_learning_style text CHECK (secondary_learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')),
  
  -- Pacing and frustration
  preferred_pace text DEFAULT 'medium' CHECK (preferred_pace IN ('slow', 'medium', 'fast')),
  frustration_threshold integer DEFAULT 3 CHECK (frustration_threshold >= 1 AND frustration_threshold <= 10),
  needs_more_examples boolean DEFAULT false,
  
  -- Motivational style
  responds_to_encouragement boolean DEFAULT true,
  responds_to_challenges boolean DEFAULT false,
  
  -- Subject tracking
  strongest_subjects text[] DEFAULT ARRAY[]::text[],
  weakest_subjects text[] DEFAULT ARRAY[]::text[],
  favorite_subjects text[] DEFAULT ARRAY[]::text[],
  
  -- Personalization
  preferred_example_types text[] DEFAULT ARRAY[]::text[],
  best_time_of_day text CHECK (best_time_of_day IN ('morning', 'afternoon', 'evening')),
  average_session_length integer DEFAULT 15 CHECK (average_session_length >= 5 AND average_session_length <= 120),
  
  -- Confidence and performance
  confidence_level text DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  total_questions_answered integer DEFAULT 0,
  total_questions_correct integer DEFAULT 0,
  overall_accuracy float DEFAULT 0.0 CHECK (overall_accuracy >= 0.0 AND overall_accuracy <= 1.0),
  learning_style_confidence float DEFAULT 0.0 CHECK (learning_style_confidence >= 0.0 AND learning_style_confidence <= 1.0),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE learning_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's learning profiles"
  ON learning_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_profiles.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update their children's learning profiles"
  ON learning_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_profiles.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_profiles.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "System can insert learning profiles"
  ON learning_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_profiles.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_learning_profiles_child ON learning_profiles(child_id);

-- Auto-create learning profile when child is created
CREATE OR REPLACE FUNCTION create_learning_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO learning_profiles (child_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_child_created_create_profile ON children;
CREATE TRIGGER on_child_created_create_profile
  AFTER INSERT ON children
  FOR EACH ROW
  EXECUTE FUNCTION create_learning_profile();

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_learning_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_learning_profile_updated ON learning_profiles;
CREATE TRIGGER on_learning_profile_updated
  BEFORE UPDATE ON learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_profile_timestamp();