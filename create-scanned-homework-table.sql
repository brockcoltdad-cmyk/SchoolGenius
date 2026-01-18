-- Create scanned_homework table for document scanning
CREATE TABLE IF NOT EXISTS scanned_homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  subject text,
  notes text,
  ai_analysis text,
  category text DEFAULT 'general' CHECK (category IN ('syllabus', 'homework', 'test', 'calendar', 'report_card', 'general')),
  needs_help boolean DEFAULT false,
  help_request text,
  scanned_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scanned_homework ENABLE ROW LEVEL SECURITY;

-- Add policies for service role (used by API)
CREATE POLICY "Service role can do anything with scanned_homework"
  ON scanned_homework
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add policies for authenticated users (parents)
CREATE POLICY "Parents can read child's scanned homework"
  ON scanned_homework
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's scanned homework"
  ON scanned_homework
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete child's scanned homework"
  ON scanned_homework
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_scanned_homework_child_id ON scanned_homework(child_id);
CREATE INDEX IF NOT EXISTS idx_scanned_homework_category ON scanned_homework(category);
