/*
  # Create Theme System

  1. New Tables
    - `owned_themes`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `theme_id` (text) - the theme identifier
      - `purchased_at` (timestamptz) - when they got this theme
      - `is_free` (boolean) - whether it was a free theme or purchased
    - `disabled_themes`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `theme_id` (text) - the theme identifier
      - `disabled_by` (uuid, references auth.users) - parent who disabled it
      - `disabled_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Parents can manage their children's themes
    - Children can read their own owned themes (for the UI)
  
  3. Indexes
    - Add indexes for quick lookups by child_id
*/

-- Create owned_themes table
CREATE TABLE IF NOT EXISTS owned_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  theme_id text NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  is_free boolean DEFAULT false,
  UNIQUE(child_id, theme_id)
);

CREATE INDEX IF NOT EXISTS idx_owned_themes_child_id ON owned_themes(child_id);

ALTER TABLE owned_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's owned themes"
  ON owned_themes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = owned_themes.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's owned themes"
  ON owned_themes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = owned_themes.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete child's owned themes"
  ON owned_themes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = owned_themes.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Create disabled_themes table
CREATE TABLE IF NOT EXISTS disabled_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  theme_id text NOT NULL,
  disabled_by uuid NOT NULL REFERENCES auth.users(id),
  disabled_at timestamptz DEFAULT now(),
  UNIQUE(child_id, theme_id)
);

CREATE INDEX IF NOT EXISTS idx_disabled_themes_child_id ON disabled_themes(child_id);

ALTER TABLE disabled_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's disabled themes"
  ON disabled_themes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = disabled_themes.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's disabled themes"
  ON disabled_themes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = disabled_themes.child_id
      AND children.parent_id = auth.uid()
    )
    AND disabled_by = auth.uid()
  );

CREATE POLICY "Parents can delete child's disabled themes"
  ON disabled_themes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = disabled_themes.child_id
      AND children.parent_id = auth.uid()
    )
  );
