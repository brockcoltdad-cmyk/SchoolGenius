-- Create daily_schedule table for prep lessons
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

-- Enable RLS
ALTER TABLE daily_schedule ENABLE ROW LEVEL SECURITY;

-- Service role policy
CREATE POLICY "Service role can do anything with daily_schedule"
  ON daily_schedule FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- User policies
CREATE POLICY "Parents can view child daily schedule"
  ON daily_schedule FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM children WHERE children.id = daily_schedule.child_id AND children.parent_id = auth.uid()));
