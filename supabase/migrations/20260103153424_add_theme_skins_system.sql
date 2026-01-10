/*
  # Add Theme Skins/Character System

  1. Changes
    - Add `selected_theme_skin` column to `children` table to store the selected character/skin ID
    - This allows each theme to have multiple character variants (like Fortnite skins)
    - Add `theme_xp` and `theme_level` columns for progression tracking
    
  2. Notes
    - Skin IDs will be managed in the frontend theme configuration
    - When a kid selects a skin, it updates this field
    - All pages will read this value to apply the correct skin styling
*/

-- Add selected_theme_skin column to children table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'selected_theme_skin'
  ) THEN
    ALTER TABLE children ADD COLUMN selected_theme_skin text DEFAULT 'default';
  END IF;
END $$;

-- Add theme XP tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'theme_xp'
  ) THEN
    ALTER TABLE children ADD COLUMN theme_xp integer DEFAULT 0;
  END IF;
END $$;

-- Add theme level tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'theme_level'
  ) THEN
    ALTER TABLE children ADD COLUMN theme_level integer DEFAULT 1;
  END IF;
END $$;
