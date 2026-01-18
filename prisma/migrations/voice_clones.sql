-- Voice Clones table for storing parent voice samples
-- Run this migration in Supabase SQL editor

CREATE TABLE IF NOT EXISTS voice_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  voice_type VARCHAR(50) NOT NULL, -- 'mom', 'dad', 'custom'
  voice_name VARCHAR(100),
  audio_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each child can only have one voice per type
  UNIQUE(child_id, voice_type)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_voice_clones_child_id ON voice_clones(child_id);
CREATE INDEX IF NOT EXISTS idx_voice_clones_type ON voice_clones(child_id, voice_type);

-- Add preferred voice column to children table
ALTER TABLE children
ADD COLUMN IF NOT EXISTS preferred_voice_type VARCHAR(50) DEFAULT 'default';

-- Create storage bucket for voice samples (run in Supabase dashboard)
-- Storage -> Create new bucket -> Name: "voice-clones" -> Public: Yes

-- RLS Policies for voice_clones
ALTER TABLE voice_clones ENABLE ROW LEVEL SECURITY;

-- Parents can read their children's voices
CREATE POLICY "Parents can view their children's voices"
ON voice_clones FOR SELECT
USING (
  child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  )
);

-- Parents can insert voices for their children
CREATE POLICY "Parents can add voices for their children"
ON voice_clones FOR INSERT
WITH CHECK (
  child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  )
);

-- Parents can update voices for their children
CREATE POLICY "Parents can update their children's voices"
ON voice_clones FOR UPDATE
USING (
  child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  )
);

-- Parents can delete voices for their children
CREATE POLICY "Parents can delete their children's voices"
ON voice_clones FOR DELETE
USING (
  child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  )
);

-- Grant access to authenticated users
GRANT ALL ON voice_clones TO authenticated;
