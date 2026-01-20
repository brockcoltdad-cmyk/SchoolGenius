-- Migration: Create Tracking Tables for Self-Monitoring AI
-- Date: 2025-01-18
-- Purpose: Track student activity for progress reports

-- ============================================
-- 1. ANSWER_ATTEMPTS
-- Records each problem attempt
-- ============================================
CREATE TABLE IF NOT EXISTS answer_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answer_attempts_child_id ON answer_attempts(child_id);
CREATE INDEX idx_answer_attempts_subject ON answer_attempts(subject);
CREATE INDEX idx_answer_attempts_answered_at ON answer_attempts(answered_at);

-- ============================================
-- 2. LEARNING_SESSIONS
-- Tracks each learning session
-- ============================================
CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    problems_completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_learning_sessions_child_id ON learning_sessions(child_id);
CREATE INDEX idx_learning_sessions_subject ON learning_sessions(subject);
CREATE INDEX idx_learning_sessions_started_at ON learning_sessions(started_at);

-- ============================================
-- 3. WEEKLY_PROGRESS
-- Aggregated weekly stats
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    total_problems INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    subjects_practiced TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(child_id, week_start_date)
);

CREATE INDEX idx_weekly_progress_child_id ON weekly_progress(child_id);
CREATE INDEX idx_weekly_progress_week_start ON weekly_progress(week_start_date);

-- ============================================
-- 4. SKILL_MASTERY
-- Tracks mastery of individual skills
-- ============================================
CREATE TABLE IF NOT EXISTS skill_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    passed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(child_id, skill_id)
);

CREATE INDEX idx_skill_mastery_child_id ON skill_mastery(child_id);
CREATE INDEX idx_skill_mastery_skill_id ON skill_mastery(skill_id);

-- ============================================
-- 5. TEST_RESULTS
-- Records placement/weekly test scores
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_test_results_child_id ON test_results(child_id);
CREATE INDEX idx_test_results_test_type ON test_results(test_type);
CREATE INDEX idx_test_results_taken_at ON test_results(taken_at);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE answer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies: Users can only see their children's data
-- ============================================

-- answer_attempts policies
CREATE POLICY "Users can view their children's answer_attempts"
    ON answer_attempts FOR SELECT
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can insert their children's answer_attempts"
    ON answer_attempts FOR INSERT
    WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- learning_sessions policies
CREATE POLICY "Users can view their children's learning_sessions"
    ON learning_sessions FOR SELECT
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can insert their children's learning_sessions"
    ON learning_sessions FOR INSERT
    WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can update their children's learning_sessions"
    ON learning_sessions FOR UPDATE
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- weekly_progress policies
CREATE POLICY "Users can view their children's weekly_progress"
    ON weekly_progress FOR SELECT
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can insert their children's weekly_progress"
    ON weekly_progress FOR INSERT
    WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can update their children's weekly_progress"
    ON weekly_progress FOR UPDATE
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- skill_mastery policies
CREATE POLICY "Users can view their children's skill_mastery"
    ON skill_mastery FOR SELECT
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can insert their children's skill_mastery"
    ON skill_mastery FOR INSERT
    WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can update their children's skill_mastery"
    ON skill_mastery FOR UPDATE
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- test_results policies
CREATE POLICY "Users can view their children's test_results"
    ON test_results FOR SELECT
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

CREATE POLICY "Users can insert their children's test_results"
    ON test_results FOR INSERT
    WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));
