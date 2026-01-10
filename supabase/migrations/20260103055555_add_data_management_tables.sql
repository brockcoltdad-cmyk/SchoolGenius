/*
  # Add Data Management Tables for COPPA Compliance

  1. New Tables
    - `scanned_homework`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `image_url` (text) - URL to stored image
      - `file_name` (text) - Original file name
      - `file_size` (integer) - Size in bytes
      - `subject` (text, optional) - Math, Reading, etc.
      - `notes` (text, optional) - Parent/child notes
      - `scanned_at` (timestamptz) - When uploaded
    
    - `chat_history`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `message` (text) - The message content
      - `sender` (text) - 'child' or 'gigi'
      - `created_at` (timestamptz) - When sent
    
    - `achievements`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `badge_id` (text) - Identifier for badge type
      - `badge_name` (text) - Display name
      - `badge_description` (text) - What they earned it for
      - `earned_at` (timestamptz) - When unlocked
    
    - `learning_sessions`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references children)
      - `subject` (text) - What they studied
      - `duration_minutes` (integer) - How long
      - `score` (integer, optional) - Performance score
      - `lessons_completed` (integer) - Number of lessons
      - `coins_earned` (integer) - Coins from this session
      - `session_date` (timestamptz) - When it happened

  2. Security
    - Enable RLS on all tables
    - Parents can access all their children's data
    - Data is automatically deleted when child account is deleted (CASCADE)
*/

-- Scanned Homework table
CREATE TABLE IF NOT EXISTS scanned_homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer DEFAULT 0,
  subject text,
  notes text,
  scanned_at timestamptz DEFAULT now()
);

ALTER TABLE scanned_homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's scanned homework"
  ON scanned_homework
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's scanned homework"
  ON scanned_homework
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete child's scanned homework"
  ON scanned_homework
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = scanned_homework.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Chat History table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  message text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('child', 'gigi')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's chat history"
  ON chat_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = chat_history.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's chat history"
  ON chat_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = chat_history.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  badge_id text NOT NULL,
  badge_name text NOT NULL,
  badge_description text NOT NULL,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = achievements.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = achievements.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- Learning Sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  subject text NOT NULL,
  duration_minutes integer DEFAULT 0,
  score integer,
  lessons_completed integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  session_date timestamptz DEFAULT now()
);

ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read child's learning sessions"
  ON learning_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_sessions.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child's learning sessions"
  ON learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_sessions.child_id
      AND children.parent_id = auth.uid()
    )
  );
