-- Migration: Add custom_syllabus table for parent-created syllabi
-- Sprint 3: Parent Syllabus Management UI
-- Date: 2026-01-13

-- Create custom_syllabus table
CREATE TABLE IF NOT EXISTS custom_syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id)
);

-- Add comment explaining subjects structure
COMMENT ON TABLE custom_syllabus IS 'Stores parent-customized syllabus configurations per child';
COMMENT ON COLUMN custom_syllabus.subjects IS 'Array of subject configs: [{"subject_code": "MATH", "display_order": 1, "minutes_per_day": 30, "enabled": true}, ...]';

-- Enable Row Level Security
ALTER TABLE custom_syllabus ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Parents can manage their children's custom syllabi
CREATE POLICY "Parents can manage their children's custom syllabi"
  ON custom_syllabus
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM children
    WHERE children.id = custom_syllabus.child_id
    AND children.parent_id = auth.uid()
  ));

-- Create index for faster lookups by child_id
CREATE INDEX IF NOT EXISTS idx_custom_syllabus_child_id ON custom_syllabus(child_id);

-- Insert default custom syllabus for existing children (optional - can be created on first save)
-- This is commented out because it's better to create custom syllabi on-demand
-- INSERT INTO custom_syllabus (child_id, subjects)
-- SELECT
--   id,
--   '[
--     {"subject_code": "MATH", "display_order": 1, "minutes_per_day": 30, "enabled": true},
--     {"subject_code": "READ", "display_order": 2, "minutes_per_day": 30, "enabled": true},
--     {"subject_code": "SPELL", "display_order": 3, "minutes_per_day": 20, "enabled": true},
--     {"subject_code": "TYPE", "display_order": 4, "minutes_per_day": 15, "enabled": true},
--     {"subject_code": "CODE", "display_order": 5, "minutes_per_day": 20, "enabled": true},
--     {"subject_code": "LANG", "display_order": 6, "minutes_per_day": 20, "enabled": true}
--   ]'::jsonb
-- FROM children
-- WHERE NOT EXISTS (
--   SELECT 1 FROM custom_syllabus WHERE custom_syllabus.child_id = children.id
-- );
