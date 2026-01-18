-- Create the 8 themed content tables
-- Run this in Supabase SQL Editor

-- 1. Kid Stuck Responses
CREATE TABLE IF NOT EXISTS kid_stuck_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL,
  response TEXT NOT NULL,
  response_tone TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Greeting Messages
CREATE TABLE IF NOT EXISTS greeting_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_of_day TEXT NOT NULL,
  age_group TEXT NOT NULL,
  greeting TEXT NOT NULL,
  energy_level TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Achievement Celebrations
CREATE TABLE IF NOT EXISTS achievement_celebrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_type TEXT NOT NULL,
  milestone_value INT,
  subject TEXT,
  age_group TEXT NOT NULL,
  main_message TEXT NOT NULL,
  secondary_message TEXT,
  excitement_level TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Return Messages
CREATE TABLE IF NOT EXISTS return_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  days_away_min INT NOT NULL,
  days_away_max INT,
  age_group TEXT NOT NULL,
  message TEXT NOT NULL,
  action_suggestion TEXT,
  tone TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transition Phrases
CREATE TABLE IF NOT EXISTS transition_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_phase TEXT NOT NULL,
  to_phase TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL,
  phrase TEXT NOT NULL,
  enthusiasm_level TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Parent Struggle Guides
CREATE TABLE IF NOT EXISTS parent_struggle_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  struggle_type TEXT NOT NULL,
  subject TEXT,
  grade_range TEXT NOT NULL,
  understanding TEXT NOT NULL,
  specific_tips TEXT[] NOT NULL,
  whats_normal TEXT NOT NULL,
  when_seek_help TEXT NOT NULL,
  timeline TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Subject Analogies
CREATE TABLE IF NOT EXISTS subject_analogies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  age_group TEXT NOT NULL,
  analogy TEXT NOT NULL,
  explanation TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Gigi Personality
CREATE TABLE IF NOT EXISTS gigi_personality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  age_group TEXT NOT NULL,
  phrase TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  tone TEXT NOT NULL,
  theme TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
