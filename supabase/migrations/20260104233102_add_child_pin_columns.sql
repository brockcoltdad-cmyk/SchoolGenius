/*
  # Add Child PIN Protection Columns

  1. New Columns
    - `pin_required` (boolean) - Whether the child's profile requires a PIN to access
    - `pin_code` (text, nullable) - The 2-digit PIN code for child profile access
    
  2. Changes
    - Add columns to `children` table with safe defaults
    - Existing children will have PIN disabled by default
*/

DO $$
BEGIN
  -- Add pin_required column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'pin_required'
  ) THEN
    ALTER TABLE children ADD COLUMN pin_required boolean DEFAULT false;
  END IF;

  -- Add pin_code column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'children' AND column_name = 'pin_code'
  ) THEN
    ALTER TABLE children ADD COLUMN pin_code text;
  END IF;
END $$;