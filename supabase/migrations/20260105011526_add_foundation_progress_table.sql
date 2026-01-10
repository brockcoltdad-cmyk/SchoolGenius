/*
  # Add Foundation Progress Table

  ## Overview
  This table is used in `/api/foundation/route.ts` but was missing from the database.
  Tracks mastery level (0-100) for foundational skills practice.

  ## New Table

  ### `foundation_progress`
  Tracks mastery level for foundational skills (0-100 scale)
  - `id` (uuid, primary key)
  - `child_id` (uuid, references children) - Which child is learning
  - `subject_code` (text) - Subject like 'MATH', 'READ'
  - `topic` (text) - Specific topic being practiced
  - `mastery_level` (integer, 0-100) - Current mastery percentage
  - `attempts` (integer) - How many times practiced
  - `last_practiced` (timestamptz) - Most recent session

  ## Security
  - RLS enabled
  - Parents can view, insert, and update their children's progress
  - Data is automatically deleted when child account is deleted (CASCADE)

  ## Usage
  This fixes the broken `/api/foundation/route.ts` endpoint which queries this table
  for reading mastery tracking and rewards coins when topics are mastered.
*/

-- Foundation Progress (Mastery tracking 0-100)
CREATE TABLE IF NOT EXISTS foundation_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  subject_code text NOT NULL,
  topic text NOT NULL,
  mastery_level integer DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  attempts integer DEFAULT 0,
  last_practiced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, subject_code, topic)
);

ALTER TABLE foundation_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's foundation progress"
  ON foundation_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = foundation_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert their children's foundation progress"
  ON foundation_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = foundation_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update their children's foundation progress"
  ON foundation_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = foundation_progress.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = foundation_progress.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_foundation_progress_child ON foundation_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_foundation_progress_subject ON foundation_progress(subject_code);
CREATE INDEX IF NOT EXISTS idx_foundation_progress_mastery ON foundation_progress(mastery_level);
