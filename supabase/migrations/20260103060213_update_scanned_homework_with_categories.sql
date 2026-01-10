/*
  # Update Scanned Homework for Document Scanner System

  1. Changes to Tables
    - Add `category` column to `scanned_homework`
      - Categories: 'syllabus', 'homework', 'test', 'calendar', 'report_card', 'general'
    - Add `ai_analysis` column for AI-generated notes
    - Add `needs_help` boolean for "need help" flag
    - Add `help_request` text for what they need help with
    
  2. New Tables
    - `extracted_calendar_events`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `document_id` (uuid, references scanned_homework)
      - `event_title` (text) - e.g., "Math Test"
      - `event_date` (date)
      - `event_type` (text) - test, homework_due, holiday, etc.
      - `description` (text, optional)
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on new table
    - Parents can access their children's calendar events
*/

-- Update scanned_homework table to add new columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scanned_homework' AND column_name = 'category'
  ) THEN
    ALTER TABLE scanned_homework ADD COLUMN category text DEFAULT 'general' CHECK (category IN ('syllabus', 'homework', 'test', 'calendar', 'report_card', 'general'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scanned_homework' AND column_name = 'ai_analysis'
  ) THEN
    ALTER TABLE scanned_homework ADD COLUMN ai_analysis text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scanned_homework' AND column_name = 'needs_help'
  ) THEN
    ALTER TABLE scanned_homework ADD COLUMN needs_help boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scanned_homework' AND column_name = 'help_request'
  ) THEN
    ALTER TABLE scanned_homework ADD COLUMN help_request text;
  END IF;
END $$;

-- Create extracted calendar events table
CREATE TABLE IF NOT EXISTS extracted_calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  document_id uuid REFERENCES scanned_homework(id) ON DELETE CASCADE,
  event_title text NOT NULL,
  event_date date NOT NULL,
  event_type text DEFAULT 'other',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE extracted_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's calendar events"
  ON extracted_calendar_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = extracted_calendar_events.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's calendar events"
  ON extracted_calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = extracted_calendar_events.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update child's calendar events"
  ON extracted_calendar_events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = extracted_calendar_events.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = extracted_calendar_events.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete child's calendar events"
  ON extracted_calendar_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = extracted_calendar_events.child_id
      AND children.parent_id = auth.uid()
    )
  );
