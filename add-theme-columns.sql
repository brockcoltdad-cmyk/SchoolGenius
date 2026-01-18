-- ============================================================================
-- Add theme column to all content tables for themed variants
-- ============================================================================
-- Created: 2026-01-12
-- Purpose: Support themed versions of content (Battle Royale, Princess, Dinosaur, Space, Ninja)
-- ============================================================================

-- Add theme column to kid_stuck_responses
ALTER TABLE kid_stuck_responses
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN kid_stuck_responses.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to subject_analogies
ALTER TABLE subject_analogies
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN subject_analogies.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to parent_struggle_guides
ALTER TABLE parent_struggle_guides
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN parent_struggle_guides.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to transition_phrases
ALTER TABLE transition_phrases
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN transition_phrases.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to achievement_celebrations
ALTER TABLE achievement_celebrations
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN achievement_celebrations.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to greeting_messages
ALTER TABLE greeting_messages
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN greeting_messages.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to return_messages
ALTER TABLE return_messages
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN return_messages.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Add theme column to gigi_personality
ALTER TABLE gigi_personality
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'neutral';

COMMENT ON COLUMN gigi_personality.theme IS 'Theme variant: neutral, battle, princess, dinosaur, space, ninja';

-- Create indexes for faster theme filtering
CREATE INDEX IF NOT EXISTS idx_kid_stuck_theme ON kid_stuck_responses(theme, age_group);
CREATE INDEX IF NOT EXISTS idx_analogies_theme ON subject_analogies(theme, age_group);
CREATE INDEX IF NOT EXISTS idx_struggles_theme ON parent_struggle_guides(theme, grade_range);
CREATE INDEX IF NOT EXISTS idx_transitions_theme ON transition_phrases(theme, age_group);
CREATE INDEX IF NOT EXISTS idx_celebrations_theme ON achievement_celebrations(theme, age_group);
CREATE INDEX IF NOT EXISTS idx_greetings_theme ON greeting_messages(theme, age_group);
CREATE INDEX IF NOT EXISTS idx_returns_theme ON return_messages(theme, age_group);
CREATE INDEX IF NOT EXISTS idx_personality_theme ON gigi_personality(theme, age_group);

-- Verify columns were added
DO $$
DECLARE
  column_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns
  WHERE column_name = 'theme'
  AND table_name IN (
    'kid_stuck_responses',
    'subject_analogies',
    'parent_struggle_guides',
    'transition_phrases',
    'achievement_celebrations',
    'greeting_messages',
    'return_messages',
    'gigi_personality'
  );

  RAISE NOTICE '✅ Added theme column to % out of 8 tables', column_count;

  IF column_count = 8 THEN
    RAISE NOTICE '🎉 All theme columns added successfully!';
  ELSE
    RAISE WARNING '⚠️  Only % theme columns added. Expected 8.', column_count;
  END IF;
END $$;
