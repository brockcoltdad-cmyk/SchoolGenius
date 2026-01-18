-- Create student_themes table to track which theme each student has active
CREATE TABLE IF NOT EXISTS student_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN ('battle', 'princess', 'dinosaur', 'space', 'ninja', 'neutral')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_themes_student_id ON student_themes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_themes_active ON student_themes(student_id, is_active);

-- Insert some test themes for existing students (replace with actual student IDs)
-- Uncomment and modify the student IDs below:

-- INSERT INTO student_themes (student_id, theme, is_active)
-- SELECT id, 'battle', true FROM children LIMIT 1;

-- Or manually insert themes:
-- INSERT INTO student_themes (student_id, theme, is_active) VALUES
--   ('your-student-id-here', 'battle', true);
