-- Reading Progress Table
-- Tracks which stories kids have read and their quiz scores

CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint for upsert
  UNIQUE(child_id, story_id)
);

-- Enable RLS
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Children can view their own reading progress"
  ON reading_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM children
    WHERE children.id = reading_progress.child_id
    AND (children.parent_id = auth.uid() OR children.id::text = auth.uid()::text)
  ));

CREATE POLICY "Children can insert their own reading progress"
  ON reading_progress FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM children
    WHERE children.id = reading_progress.child_id
    AND (children.parent_id = auth.uid() OR children.id::text = auth.uid()::text)
  ));

CREATE POLICY "Children can update their own reading progress"
  ON reading_progress FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM children
    WHERE children.id = reading_progress.child_id
    AND (children.parent_id = auth.uid() OR children.id::text = auth.uid()::text)
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_child_id ON reading_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_story_id ON reading_progress(story_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_completed ON reading_progress(child_id, completed);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_reading_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reading_progress_updated_at
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_progress_timestamp();
