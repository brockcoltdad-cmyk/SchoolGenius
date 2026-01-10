/*
  # Create Initial School Genius Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `children`
      - `id` (uuid, primary key)
      - `parent_id` (uuid, references profiles)
      - `name` (text)
      - `grade_level` (text) - K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
      - `coins` (integer, default 0)
      - `current_theme` (text, default 'default')
      - `avatar_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `owned_themes`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `theme_id` (text)
      - `unlocked_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `title` (text)
      - `description` (text, optional)
      - `subject` (text, optional)
      - `coins_reward` (integer)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz, optional)
      - `due_date` (timestamptz, optional)
      - `created_at` (timestamptz)
    
    - `rewards`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `title` (text)
      - `description` (text, optional)
      - `coins_cost` (integer)
      - `redeemed` (boolean, default false)
      - `redeemed_at` (timestamptz, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade_level text NOT NULL,
  coins integer DEFAULT 0,
  current_theme text DEFAULT 'default',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read own children"
  ON children
  FOR SELECT
  TO authenticated
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own children"
  ON children
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own children"
  ON children
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can delete own children"
  ON children
  FOR DELETE
  TO authenticated
  USING (auth.uid() = parent_id);

-- Owned themes table
CREATE TABLE IF NOT EXISTS owned_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  theme_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(child_id, theme_id)
);

ALTER TABLE owned_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's themes"
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

CREATE POLICY "Parents can insert child's themes"
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

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject text,
  coins_reward integer DEFAULT 10,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  due_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = tasks.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = tasks.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update child's tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = tasks.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = tasks.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete child's tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = tasks.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  coins_cost integer NOT NULL,
  redeemed boolean DEFAULT false,
  redeemed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rewards.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's rewards"
  ON rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rewards.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update child's rewards"
  ON rewards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rewards.child_id
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rewards.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete child's rewards"
  ON rewards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = rewards.child_id
      AND children.parent_id = auth.uid()
    )
  );