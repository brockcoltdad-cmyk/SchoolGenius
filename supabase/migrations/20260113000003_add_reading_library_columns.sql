/*
  # Add Reading Library Columns to Stories Table

  Adds columns needed for proper Lexile-leveled reading library:
  - lexile_band: Specific Lexile range (e.g., "400L-600L")
  - grade_level: Grade level (0-12, where 0 = K)
  - expected_time_minutes: Reading time (15/20/25/30 min by age)
  - gender_target: Target audience (boys/girls/neutral)
  - category: Story category (e.g., "Wizard Academy")
  - vocabulary: JSON array of vocabulary words with definitions
  - reading_strategy: Which reading skill this teaches
  - strategy_tip: Tip shown before reading

  Created: 2026-01-13
  Purpose: Support adaptive reading library with proper Lexile levels
*/

-- Add missing columns to stories table
ALTER TABLE stories
ADD COLUMN IF NOT EXISTS lexile_band TEXT,
ADD COLUMN IF NOT EXISTS grade_level INTEGER,
ADD COLUMN IF NOT EXISTS expected_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS gender_target TEXT DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS vocabulary JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reading_strategy TEXT,
ADD COLUMN IF NOT EXISTS strategy_tip TEXT,
ADD COLUMN IF NOT EXISTS times_read INTEGER DEFAULT 0;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_lexile ON stories(lexile_band);
CREATE INDEX IF NOT EXISTS idx_stories_grade ON stories(grade_level);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_gender ON stories(gender_target);

-- Comment on new columns
COMMENT ON COLUMN stories.lexile_band IS 'Lexile range: BR-200L, 200L-300L, up to 1300L-1500L';
COMMENT ON COLUMN stories.grade_level IS 'Grade level 0-12 (0 = Kindergarten)';
COMMENT ON COLUMN stories.expected_time_minutes IS 'K=15min, 1-2=20min, 3-5=25min, 6-12=30min';
COMMENT ON COLUMN stories.gender_target IS 'boys, girls, or neutral';
COMMENT ON COLUMN stories.category IS 'Story category like Wizard Academy, Sports Champions';
COMMENT ON COLUMN stories.vocabulary IS 'Array of {word, definition, sentence} objects';
COMMENT ON COLUMN stories.reading_strategy IS 'main_idea, inference, sequence, etc.';
COMMENT ON COLUMN stories.strategy_tip IS 'Tip shown before reading to help with comprehension';
COMMENT ON COLUMN stories.times_read IS 'Popularity counter for caching priority';
