-- Add deepinfra_voice_id column to voice_clones table
ALTER TABLE voice_clones 
ADD COLUMN IF NOT EXISTS deepinfra_voice_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_voice_clones_deepinfra_voice_id 
ON voice_clones(deepinfra_voice_id);
