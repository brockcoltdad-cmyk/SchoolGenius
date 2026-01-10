/*
  # Create Word Pronunciations Table

  1. New Tables
    - `word_pronunciations`
      - `id` (uuid, primary key) - Unique identifier
      - `word` (text, unique, not null) - The word to pronounce
      - `pronunciation` (text, not null) - Phonetic pronunciation guide
      - `syllables` (text[], not null) - Array of syllable breakdowns
      - `audio_url` (text) - URL to full word audio
      - `syllable_audio_url` (text) - URL to syllable-by-syllable audio
      - `grade_level` (integer) - Appropriate grade level for word
      - `is_sight_word` (boolean) - Whether this is a sight word
      - `phoneme_breakdown` (text[]) - Array of phonemes for instruction
      - `created_at` (timestamp) - Record creation time

  2. Indexes
    - Index on `word` for fast lookups
    - Index on `grade_level` for filtering by grade

  3. Security
    - Enable RLS on `word_pronunciations` table
    - Add policy for authenticated users to read word pronunciations
    - Words are readable by all authenticated users (public learning resource)
*/

CREATE TABLE IF NOT EXISTS word_pronunciations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  pronunciation TEXT NOT NULL,
  syllables TEXT[] NOT NULL,
  audio_url TEXT,
  syllable_audio_url TEXT,
  grade_level INTEGER,
  is_sight_word BOOLEAN DEFAULT false,
  phoneme_breakdown TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(word)
);

CREATE INDEX IF NOT EXISTS idx_word_pronunciations_word ON word_pronunciations(word);
CREATE INDEX IF NOT EXISTS idx_word_pronunciations_grade ON word_pronunciations(grade_level);

ALTER TABLE word_pronunciations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Word pronunciations are readable by all authenticated users"
  ON word_pronunciations FOR SELECT
  TO authenticated
  USING (true);